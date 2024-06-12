const socket = io();
const SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
const recognition = new SpeechRecognition();
const startButton = document.getElementById("startButton");
const micIcon = document.getElementById("micIcon");
const logElement = document.getElementById("textLog");

recognition.addEventListener("end", () => {
  micIcon.src="./microphone.png";
  recognition.stop();
});

recognition.addEventListener("result", (e) => {
  logElement.innerHTML = "";
  for (const result of e.results) {
    logElement.innerHTML += result[0].transcript + "。";
  }
});

function startRecognition() {
  logElement.innerHTML = "";
  recognition.interimResults = true;
  recognition.continuous = true;
  recognition.lang = "ja-JP";
  micIcon.src="./microphone_rec.png";
  recognition.start();
  sendWordsToServer();
  setInterval(sendWordsToServer, 5000);
}

function sendWordsToServer() {
  const recognizedText = logElement.innerHTML.replace(/<br>/g, "");
  socket.emit("send", recognizedText);
  $('#container').empty();
  logElement.innerHTML = "";
}


function drawReceivedData(text) {
  const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  let html = '';
  let container = $('.container');
  for (let i = 0; i < text.length; i++) {
    html += '<p class="text" style="animation-duration:' + randRange(8, 15) + 's;animation-delay:' + randRange(1, 10) + 's;">'
       + text[i]
      + '</p>';
  }
  
  //console.log(html); //分割された名詞ごとに，pタグが含まれ，cssによる動き方の情報が入っている
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

// Event listeners
startButton.addEventListener("click", startRecognition);
socket.on("draw", drawReceivedData);
