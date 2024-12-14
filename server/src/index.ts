import { WebSocket, WebSocketServer } from "ws";

const PORT = 8080;
const ws = new WebSocketServer({ port: PORT });

interface AllRooms {
    [key: string]: WebSocket[];
}

const allRooms: AllRooms = {};

ws.on("connection", (socket) => {
    console.log("User connected");
    socket.on("message", (evt) => {
        const obj = JSON.parse(evt.toString())
        const type = obj.type;
        const roomID = obj.payload.roomId
        const message = obj.payload.message

        if(type === "join"){
            if(allRooms[roomID]) allRooms[roomID].push(socket)
            else
                allRooms[roomID] = [socket];
        }
        else if(type === "chat"){
            allRooms[roomID].forEach((ws) => {
                    ws.send(message);
            });
        }
        else if(type === "disconnect"){
            if (allRooms[roomID]) {
                allRooms[roomID] = allRooms[roomID].filter(ws => ws !== socket);
                if (allRooms[roomID].length === 0) {
                    delete allRooms[roomID];
                }
            }
        }
        
    })
});

console.log(`WebSocket server is running on port: ${PORT}`);