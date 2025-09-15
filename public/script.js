const micIcon = document.getElementById("micIcon");
const logElement = document.getElementById("textLog");
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
const startButton = document.getElementById("startButton");

recognition.addEventListener("end", () => {
  micIcon.src="./microphone.png";
  recognition.stop();
});

recognition.addEventListener("result", (e) => {
  logElement.innerHTML = "";
  let fullText = "";
  for (const result of e.results) {
    fullText += result[0].transcript;
  }
  logElement.innerHTML = fullText;
  
  // 音声認識結果を直接描画処理へ
  if (fullText.trim()) {
    const words = splitText(fullText);
    drawReceivedData(words);
  }
});

function startRecognition() {
  logElement.innerHTML = "";
  recognition.interimResults = true;
  recognition.continuous = true;
  recognition.lang = "ja-JP";
  micIcon.src="./microphone_rec.png";
  recognition.start();
}

// テキストを句点やスペースで分割
function splitText(text) {
  return text.split(/[。\s]+/).filter(word => word.trim() !== "");
}

function drawReceivedData(textArray) {
  const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  let html = '';
  let container = $('.container');
  
  for (let i = 0; i < textArray.length; i++) {
    html += '<p class="text" style="animation-duration:' + randRange(8, 15) + 's;animation-delay:' + randRange(1, 10) + 's;">'
       + textArray[i]
      + '</p>';
  }
  
  $('.container').append(html);
  
  let item = $('.container').find('p');
  let cont_w = $('.container').width();
  
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

// コンテナをクリアする関数（必要に応じて）
function clearContainer() {
  $('#container').empty();
  $('.container').empty();
}
