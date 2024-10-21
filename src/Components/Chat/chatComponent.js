import React, { useEffect, useState } from 'react';

const ChatComponent = () => {
    const [ws, setWs] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const socket = new WebSocket('wss://game-platform-heroku-655c0a464d62.herokuapp.com/'); // Replace with your Heroku app URL

        socket.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        socket.onmessage = (event) => {
            const message = event.data;
            setMessages((prevMessages) => [...prevMessages, message]);
            console.log('Received:', message);
        };

        socket.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = (msg) => {
        if (ws) {
            ws.send(msg);
        }
    };

    return (
        <div>
            <h2>Chat</h2>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <button onClick={() => sendMessage('Hello World!')}>Send Message</button>
        </div>
    );
};

export default ChatComponent;
