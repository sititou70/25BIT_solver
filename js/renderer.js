var ipcRenderer = require('electron').ipcRenderer
//require('remote').getCurrentWindow().toggleDevTools();

//functions
var get_answer = function(){
	var question = 0;
	for (var i = 0; i < 25; i++) {
		if(JSON.parse($("[data-num=" + i + "]")[0].dataset.pushed)){
			question |= Math.pow(2, i);
		}
	}
	
	ipcRenderer.send("get_answer", question);
};

//make ui
var button_25bit = $("#board > button").remove();
for (var i = 0; i < 25; i++) {
	button_25bit[0].dataset.num = i;
	button_25bit[0].dataset.pushed = false;
	$("#board").append(button_25bit.clone());
	if((i + 1) % 5 === 0)$("#board").append("<br />");
}

//set event handler
$("#board > button").click(function(){
	if(JSON.parse(this.dataset.pushed)){
		this.dataset.pushed = false;
		$(this).removeClass("pushed_button_25bit");
		$(this).addClass("normal_button_25bit");
	}else{
		this.dataset.pushed = true;
		$(this).removeClass("normal_button_25bit");
		$(this).addClass("pushed_button_25bit");
	}
	get_answer();
});

$("#all_off").click(function(){
	$("#board > button").each(function(){
		this.dataset.pushed = false;
		$(this).removeClass("pushed_button_25bit");
		$(this).addClass("normal_button_25bit");
	});
	get_answer();
});
$("#all_on").click(function(){
	$("#board > button").each(function(){
		this.dataset.pushed = true;
		$(this).removeClass("normal_button_25bit");
		$(this).addClass("pushed_button_25bit");
	});
	get_answer();
});

//ipc handlers
ipcRenderer.on("set_emphasis", function(event, board){
	for (var i = 0; i < 25; i++) {
		if(board & Math.pow(2, i)){
			$("[data-num=" + i + "]").addClass("emphasis_button_25bit");
		}else{
			$("[data-num=" + i + "]").removeClass("emphasis_button_25bit");
		}
	}
});
