import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { UserContext } from '../../util/UserContext';
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
    const navigate = useNavigate();

    const checkLoggedInUser = () => {
        if (!userData.friends.includes(friendName)) {
            alert('You cannot chat with this user.');
            navigate('/profile');
        }
    };

    useEffect(() => {
        const user1 = username < friendName ? username : friendName;
        const user2 = username < friendName ? friendName : username;
        const chatRoom = `${user1}-${user2}`;
        socket.emit('join', { user1, user2 });

        socket.on('message', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
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

        if (!userData || !userData.email) {
            updateUserData();
        } else {
            setLoading(false);
            checkLoggedInUser();
        }
    }, [userData, fetchUserData]);

    const sendMessage = () => {
        if (messageInput.trim()) {
            socket.emit('message', { text: messageInput, sender: userData.username });
            setMessageInput('');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>Chat with {friendName}</div>
            <div className={styles.messages}>
                <p className={`${styles.receiver} ${styles.message}`}>Test</p>
                <p className={`${styles.sender} ${styles.message}`}>Test</p>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`${styles.message} ${msg.sender === userData.username ? styles.sender : styles.receiver}`}
                    >
                        
                        {msg.sender}: {msg.text}
                    </div>
                ))}
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
