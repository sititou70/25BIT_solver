'use strict';

var App = require("app");
var fs = require("fs");
var Menu = require("menu");
var BrowserWindow = require("browser-window");
var ipcMain = require("electron").ipcMain;
var mainWindow = null;
var answers_buffer = null;


// 全てのウィンドウが閉じたら終了
App.on("window-all-closed", function(){
	if(process.platform != "darwin"){
		App.quit();
	}
});

// Electronの初期化完了後に実行
App.on("ready", function(){
	//ansers.datを読み込む
	fs.readFile(__dirname + "\\answers.dat", function(err, data){
		answers_buffer = new Buffer(data, 'binary');
	});
	
	// メイン画面の表示。ウィンドウの幅、高さを指定できる
	var window_bounds = JSON.parse(fs.readFileSync(__dirname + "\\window_bounds.json"));
	mainWindow = new BrowserWindow({
		width: window_bounds.width,
		height: window_bounds.height,
		x: window_bounds.x,
		y: window_bounds.y,
		resizable: true,
		center: true,
		autoHideMenuBar: true
	});
	mainWindow.loadURL("file://" + __dirname + "/index.html");
	
	//ウインドウが閉じる前にサイズと位置を記録する
	mainWindow.on("close", function(){
		var window_bounds = JSON.stringify(mainWindow.getBounds());
		fs.writeFileSync(__dirname + "\\window_bounds.json", window_bounds);
	});
	
	//ウィンドウが閉じられたらアプリも終了
	mainWindow.on("closed", function(){
		mainWindow = null;
	});
});

//ipcハンドラを定義
ipcMain.on("get_answer", function(event, question){
	mainWindow.webContents.send("set_emphasis", answers_buffer.readUInt32LE(question * 4));
});

//メニューバーを定義
var menu = Menu.buildFromTemplate([
	{
		label: "File",
		submenu: [
			{
				label: "Quit",
				click: function(){
					App.quit();
				}
			}
		]
	}
]);
Menu.setApplicationMenu(menu);

