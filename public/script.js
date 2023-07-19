const socket = io();
//Web Speech APIのSpeechRecognitionインタフェースのオブジェクトを作成
SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
const sr = new SpeechRecognition();
//ボタンの状況を格納
const btn_s = document.getElementById("startButton");
//node_jsボタン
const btn_n = document.getElementById("NodeButton");
//htmlからID引っ張って名前つける
const log = document.getElementById("textLog");
let empty = "<br>";
//見やすさのため改行できるように。
//ターゲットに特定のイベントが配信されるたびに呼び出される関数を設定
//1つのイベントに対して複数のハンドラーを追加することができる
//音声認識サービスが停止した際には，音声認識を停止及びボタンを非表示
sr.addEventListener("end", function(){
  sr.stop();
  btn_s.disabled = false;
})
sr.addEventListener("result", function(e) {
  console.log(e.results);
  log.innerHTML = "";
  for (var i = 0; i < e.results.length; i++) {
    log.innerHTML += e.results[i][0].transcript + "。";
    //認識が終わったらstartは表示状態    
    btn_s.disabled = true;
  }
});


btn_s.addEventListener("click", function() {
  document.getElementById("description").innerHTML = "音声認識結果  ~サーバーに送信で反映します~"
  //音声認識をリセットする
  log.innerHTML = "";
  //認識の途中経過がONの状態
  sr.interimResults = true;
  //連続音声認識CSRがONの状態
  sr.continuous = true;
  //認識開始  
  sr.start();
  sendwords();
  //sr.stop(); //ボタンを押したらstopする
  
  //1０秒ごとに関数を実行するタイマーの設定 第1引数は呼び出す関数名,第2引数は繰り返す時間をms表記で指定.
  setInterval(sendwords,10000);

});

//10秒経つごとに呼ばれる.
function sendwords(){
  document.getElementById("description").innerHTML = "話したことばが出てくるよ！！"

  var string = log.innerHTML.replace(/<br>/g, "")
  socket.emit("A", string)
  log.innerHTML = "";  
  
}


//B
socket.on("B", function(result) {
  draw(result);
})



//描写用関数
function draw(text) {
  console.log("渡されたよ");//draw()が動いているかを確認
  const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  //ランダム関数
  let html = '';
  //containerはjQueryオブジェクト
  let container = $('.container');
  for (let i = 0; i < text.length; i++) {
    html += '<p class="text" style="animation-duration:' + randRange(8, 15) + 's;animation-delay:' + randRange(1, 10) + 's;">'
       + text[i]
      + '</p>';
  }
  
  console.log(html); //分割された名詞ごとに，pタグが含まれ，cssによる動き方の情報が入っている
  $('.container').append(html);//流れるテキスト挿入
  // 流れるテキスト追加　ここまで
  let item = $('.container').find('p');
  // let cont_h = container.height();//コンテンツ高さ取得
  let cont_w = $('.container').width();//コンテンツ幅取得
  // 流れるテキストをランダム配置　ここから
  item.each(function(index) {
    console.log("生成開始");
    $(this).css({
      left: randRange(0, cont_w),
      bottom: -30,
      'font-size': randRange(15, 25) + 'px',
    });
  });

  
}
