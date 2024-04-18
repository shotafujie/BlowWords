const kuromoji = require("kuromoji");
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let lastSentWords = [];

let tokenizer;
kuromoji.builder({ dicPath: "node_modules/kuromoji/dict" }).build((err, builtTokenizer) => {
  if (err) {
    console.error(err);
    return;
  }
  tokenizer = builtTokenizer;
});

io.on('connection', (socket) => {
  socket.on("send", async (value) => {
    if (tokenizer) {
      const result = await extractNouns(value);
      socket.emit("draw", result);
    }
  });
});

async function extractNouns(value) {
  return new Promise((resolve, reject) => {
    const tokens = tokenizer.tokenize(value);
    const newWords = [];
    let currentNoun = "";

    for (const token of tokens) {
      if (token.pos === '名詞') {
        currentNoun += token.surface_form;
      } else {
        if (currentNoun) {
          newWords.push(currentNoun);
          currentNoun = '';
        }
      }
    }

    if (currentNoun) {
      newWords.push(currentNoun);
    }

    const uniqueWords = newWords.filter(word => !lastSentWords.includes(word));
    lastSentWords = newWords;

    resolve(uniqueWords);
  });
}

app.use(express.static('public'));

const port = process.env.PORT || 3000;

http.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
