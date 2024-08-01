const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, function () {
  console.log("Server is runing");
});

//web sockets

const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ server: server });

wss.on("connection", function connection(ws) {
  const num = wss.clients.size;
  console.log("Clients connected", num);

  wss.broadcast("Current visitor" + num);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my sever");
  }

  ws.on("close", function close() {
    console.log("Client disconnected!");
  });
});
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
