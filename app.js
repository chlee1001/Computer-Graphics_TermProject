/* 설치한 express 모듈 불러오기 */
const express = require("express");

/* 설치한 socket.io 모듈 불러오기 */
const socket = require("socket.io");

/* Node.js 기본 내장 모듈 불러오기 */
const http = require("http");

/* Node.js 기본 내장 모듈 불러오기 */
const fs = require("fs");

/* express 객체 생성 */
const app = express();

/* express http 서버 생성 */
const server = http.createServer(app);

/* 생성된 서버를 socket.io에 바인딩 */
const io = socket(server);

app.use("/css", express.static("./static/css"));
app.use("/js", express.static("./static/js"));
app.use("/resources", express.static("./static/assets/resources"));
app.use("/modules", express.static("./static/assets/modules"));
app.use("/", express.static("./static"));

/* Get 방식으로 / 경로에 접속하면 실행 됨 */
app.get("/", function (request, response) {
  fs.readFile("./static/index.html", function (err, data) {
    if (err) {
      response.send("에러");
    } else {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
    }
  });
});

/* 서버를 ~~~~ 포트로 listen */
server.listen(----, function () {
  console.log("서버 실행 중..");
});
