import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import io from 'socket.io-client';
import { UserContext } from '../../util/UserContext';

// Connect to the Socket.IO server
const socket = io('https://gamipo.org', {
    transports: ['websocket', 'polling'],
    withCredentials: true
});

const ChatView = () => {
    const { username, friendName } = useParams(); // Extract usernames from the URL
    const { userData, fetchUserData } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const navigate = useNavigate();

    // Check if the logged-in user matches the username parameter
    const checkLoggedInUser = () => {
        // Check if the friendName exists in the logged-in user's friends array
        if (!userData.friends.includes(friendName)) {
            alert('You cannot chat with this user.');
            navigate('/profile'); // Redirect to a safe route
        }
    };

    useEffect(() => {
        console.log('Username:', username); // Log username
        console.log('Friend Name:', friendName); // Log friendName
        console.log(process.env.PORT);
        
        // Sort the usernames to create a consistent chat room name
        const user1 = username < friendName ? username : friendName;
        const user2 = username < friendName ? friendName : username;
    
        const chatRoom = `${user1}-${user2}`; // Create a chat room name
        socket.emit('join', { user1, user2 }); // Emit join event with sorted usernames
    
        socket.on('message', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });
    
        return () => {
            socket.off('message'); // Clean up the socket listener on unmount
        };
    }, [username, friendName]);

    useEffect(() => {
        const updateUserData = async () => {
            setLoading(true);
            await fetchUserData();
            setLoading(false);
        };
    
        if (!userData || !userData.email) { // Check for key properties to determine if userData is incomplete
            updateUserData();
        } else {
            setLoading(false);
            checkLoggedInUser();
        }
    }, [userData, fetchUserData]);

    const sendMessage = () => {
        if (messageInput.trim()) {
            // Pass senderId if applicable
            console.log(messageInput);
            socket.emit('message', { text: messageInput, sender: userData.username});
            setMessageInput(''); // Clear the input field
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Chat with {friendName}</h2>
            <div id="messages">
                {messages.map((msg, index) => (
                    <p key={index}>{msg.sender}: {msg.text}</p>
                ))}
            </div>
            <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message here..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatView;

