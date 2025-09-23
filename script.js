// server.js
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });
let players = {};

wss.on("connection", ws => {
  const id = Math.random().toString(36).slice(2);
  players[id] = { x: 0, y: 0 };

  ws.on("message", msg => {
    const data = JSON.parse(msg);
    if (data.type === "move") {
      players[id] = data.pos;
      broadcast();
    }
  });

  ws.on("close", () => {
    delete players[id];
    broadcast();
  });

  function broadcast() {
    const payload = JSON.stringify({ type: "update", players });
    wss.clients.forEach(c => c.send(payload));
  }
});
