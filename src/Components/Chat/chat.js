import React, { useEffect, useContext, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { UserContext } from '../../util/UserContext';
import MongoDbModel from '../../models/mongodb'; // Import MongoDbModel
import styles from './Chat.module.css'; // Import your styles

// Connect to the Socket.IO server
const socket = io('/', {
    transports: ['websocket'],
    withCredentials: true,
});

const ChatView = () => {
    const { username, friendName } = useParams();
    const { userData, fetchUserData } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [displayCount, setDisplayCount] = useState(5); // Track how many messages to display
    const messagesEndRef = useRef(null); // Ref for scrolling to the bottom
    const navigate = useNavigate();

    const checkLoggedInUser = () => {
        if (!userData.friends.includes(friendName)) {
            navigate('/profile');
        }
    };

    useEffect(() => {
        const user1 = username < friendName ? username : friendName;
        const user2 = username < friendName ? friendName : username;
        socket.emit('join', { user1, user2 });

        socket.on('message', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to bottom on new message
        });

        return () => {
            socket.off('message');
        };
    }, [username, friendName]);

    useEffect(() => {
        const updateUserData = async () => {
            setLoading(true);
            await fetchUserData();
            setLoading(false);
        };

        const fetchMessages = async () => {
            const user1 = username < friendName ? username : friendName;
            const user2 = username < friendName ? friendName : username;
            const fetchedMessages = await MongoDbModel.getMessages(user1, user2);
            setMessages(fetchedMessages);
        };

        if (!userData || !userData.email) {
            updateUserData();
        } else {
            setLoading(false);
            checkLoggedInUser();
            fetchMessages(); // Fetch earlier messages here
        }
    }, [userData, fetchUserData]);

    const sendMessage = () => {
        if (messageInput.trim()) {
            socket.emit('message', { text: messageInput, sender: userData.username });
            setMessageInput('');
        }
    };

    const loadMoreMessages = () => {
        setDisplayCount(prevCount => Math.min(prevCount + 5, messages.length)); // Increase display count
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>Chat with {friendName}</div>
            <div className={styles.messages}>
                {displayCount < messages.length && (
                <button onClick={loadMoreMessages} className={styles.showMoreButton}>
                    Show More
                </button>
                )}
                {messages.slice(-displayCount).map((msg, index) => (
                    <div
                        key={index}
                        className={`${styles.message} ${msg.sender === userData.username ? styles.sender : styles.receiver}`}
                    >
                        {msg.sender}: {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* For scrolling to the bottom */}
            </div>
            
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message here..."
                    className={styles.input}
                />
                <button onClick={sendMessage} className={styles.sendButton}>Send</button>
            </div>
        </div>
    );
};

export default ChatView;
