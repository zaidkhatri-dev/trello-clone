import { WebSocketServer } from "ws";

const server = new WebSocketServer({ port: 3002 })

server.on("connection", (ws) => {

    ws.on("message", (message) => {
        console.log(message);
    })
})