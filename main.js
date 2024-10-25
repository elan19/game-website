require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const { MongoClient } = require("mongodb");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const client = new MongoClient(process.env.MONGODB_URL, {
    tls: true,
});

const PORT = process.env.PORT || 4000;

// Enable CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// All other GET requests redirect to the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

var collection;

io.on("connection", (socket) => {
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

server.listen(PORT, async () => {
    try {
        await client.connect();
        collection = client.db("test").collection("chats");
        console.log(`Listening on port ${PORT}...`);
    } catch (e) {
        console.error(e);
    }
});
