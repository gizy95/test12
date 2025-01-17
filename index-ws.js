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

process.on("SIGINT", () => {
  wss.clients.forEach(function each(client) {
    client.close();
  });
  server.close(() => {
    shutdownDB();
  });
});

wss.on("connection", function connection(ws) {
  const num = wss.clients.size;
  console.log("Clients connected", num);

  wss.broadcast("Current visitor" + num);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my sever");
  }

  db.run(`INSERT INTO visitors (count, time)
    VALUES (${num}, datetime('now'))
  `);

  ws.on("close", function close() {
    wss.broadcast("Curent visitors:" + num);
    console.log("Client disconnected!");
  });
});
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

//end web sockets

//DB

const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory:");

db.serialize(() => {
  db.run(`
        CREATE TABLE visitors (
            count INTEGER,
            time TEXT
        )
    `);
});

function getCounts() {
  db.each("SELECT * FROM visitors", (err, row) => {
    console.log(row);
  });
}

function shutdownDB() {
  console.log("Shutting down db");

  getCounts();
  db.close();
}
