require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io"); // Updated import for Socket.IO
const { MongoClient } = require("mongodb");

const app = express();
const server = http.createServer(app);
const io = new Server(server); // Initialize Socket.IO with the server
const client = new MongoClient(process.env.MONGODB_URL, {
    ssl: true,  // Enable SSL
});

const PORT = process.env.SERVER_PORT || 4000;

console.log(`Starting server on port: ${PORT}`);

// Enable CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

var collection;

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
        io.to(socket.activeRoom).emit("message", message); // Use 'io' instead of 'socketIo'
    });
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
