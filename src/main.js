require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require("http"); // Use 'http' instead of 'https'
const path = require("path");
const { Server } = require("socket.io");
const { MongoClient } = require("mongodb");

const app = express();
const server = http.createServer(app); // Use 'http' server
const io = new Server(server); // Initialize Socket.IO with the server
const client = new MongoClient(process.env.MONGODB_URL);

const PORT = process.env.PORT || 4000;

console.log(PORT);

// Enable CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

let collection;

io.on("connection", (socket) => {
    socket.on("join", async ({ user1, user2 }) => {
        const chatRoom = `${user1}-${user2}`; // Create a unique chat room name based on usernames
        try {
            let result = await collection.findOne({ "_id": chatRoom });
            if (!result) {
                await collection.insertOne({ "_id": chatRoom, messages: [] });
            }
            socket.join(chatRoom);
            socket.emit("joined", chatRoom);
            socket.activeRoom = chatRoom;
        } catch (e) {
            console.error(e);
        }
    });

    socket.on("message", (message) => {
        collection.updateOne({ "_id": socket.activeRoom }, {
            "$push": {
                "messages": message
            }
        });
        io.to(socket.activeRoom).emit("message", message);
    });
});

// Serve chat.html
app.get("/chat", (req, res) => {
    res.sendFile(path.join(__dirname, 'chat.html'));
});

server.listen(PORT, async () => {
    try {
        await client.connect();
        collection = client.db("test").collection("chats");
        console.log(`Listening on port ${PORT}...`);
    } catch (e) {
        console.error(e);
    }
});
