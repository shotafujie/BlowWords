var kuromoji = require("kuromoji");
const sleep = require('./sleep');
var jsdom = require('jsdom');
$ = require('jquery')(new jsdom.JSDOM().window);


//単語取り出しに使う変数
var word = ""; //pos=="名詞"

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
//クライアントからAが送られたときの処理
io.on('connection', function(socket) {
  //Aを受け取ると，その値をCに渡す
  socket.on("A", async function(value) {
    const result = await C(value);
    socket.emit("B", result);
  });
});


async function C(value) {
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: "node_modules/kuromoji/dict" }).build(function(err, tokenizer) {
      var path = tokenizer.tokenize(value);
      //console.log(path);
      const result = new Array();
      word = "";
      //入力された値すべてをチェック
      for (let i = 0; i < path.length; i++) {
        //名詞以外ならば続ける
        if (path[i].pos === '名詞') {
          word += path[i].surface_form;
        } else {
          if (word !== '') {
            result.push(word);
            word = '';
          }
        }
      }
      if (word !== '') {
        result.push(word);
      }
      resolve(result);
      console.log(result);
      
    });
  });
}
//ここまで名詞に分割している


app.use(express.static('public'));

app.get('/', (req, res) => {
  // es.sendFile(__dirname + '/public/index.html');
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});

