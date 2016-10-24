# 25BIT Solver

## 概要
[25BIT](https://itunes.apple.com/app/id983478281)というゲームの解を求めるツールです。あらかじめ全ての問題空間と解空間を計算しておくことで、O(1)で解答を表示します。

## 使い方
ツールを起動し、問題を入力します。解がある問題であれば、幾つかのボタンが光ります。アプリに戻り、光っているボタンと同じ位置のボタンを、一回ずつ押していきます。押す順番は関係ありません。問題が解けます。

## アルゴリズム
25BITは、問題から解答を求める事が難しいが、解答から問題を求めることが非常に容易なゲームです。あらかじめ全ての解空間から、全ての問題空間を計算し保持しておくことで、O(1)で解答を表示します。

## make_answers.exeとanswers.dat
全ての解を求めるツールと、それを保持しているファイルです。もはやベンチマークです。