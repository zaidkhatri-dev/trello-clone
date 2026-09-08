import {WebSocketServer} from "ws";
import { db } from "db/client"

const server = new WebSocketServer({port: 3002})

interface Users {
    
}

const USERS = new Map();

server.on("connection", (ws) => {
    
    ws.on("message", (message) => {
        console.log(message);
    })
})