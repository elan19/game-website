require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const { MongoClient } = require("mongodb");

const app = express();
const httpServer = require('http').createServer(app);
const client = new MongoClient(process.env.MONGODB_URL, {
    ssl: true,
});

const PORT = process.env.SERVER_PORT || 4000;

// Enable CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

// Initialize Socket.IO
const io = require('socket.io')(httpServer, {
    cors: {
        origin: "*"
    },
    transports: ['websocket']
});

var collection;

io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("join", async ({ user1, user2 }) => {
        const chatRoom = `${user1}-${user2}`;
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

httpServer.listen(PORT, async () => {
    try {
        await client.connect();
        collection = client.db("test").collection("chats");
        console.log(`Listening on port ${PORT}...`);
    } catch (e) {
        console.error(e);
    }
});
