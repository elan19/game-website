import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProfileCard from '../../util/ProfileCard.js';
import { UserContext } from '../../util/UserContext.js';
import MongoDbModel from '../../models/mongodb.js';
import styles from './userFriends.module.css';

const UserFriends = () => {
    const { username } = useParams();
    const { userData, fetchUserData } = useContext(UserContext);
    const [friends, setFriends] = useState([]);
    const [friendsData, setFriendsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredFriend, setHoveredFriend] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friendsList = await MongoDbModel.getUserFriends(username);
                const friendsData = await Promise.all(
                    friendsList.friends.map(friend => MongoDbModel.getUserProfile(friend.username))
                );
                setFriends(friendsList.friends);
                setFriendsData(friendsData);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch friends", err);
                setError('Failed to load friends list.');
                setLoading(false);
            }
        };

        fetchFriends();
    }, [username]);

    const handleRemoveFriend = async (friendUsername) => {
        const confirmed = window.confirm(`Do you really want to remove ${friendUsername} as your friend?`);
        if (confirmed) {
            try {
                await MongoDbModel.removeFriend(username, userData?.loginId, friendUsername);
                setFriends(friends.filter(friend => friend.username !== friendUsername));
                setFriendsData(friendsData.filter(friendData => friendData.username !== friendUsername));
                fetchUserData();
            } catch (err) {
                console.error('Failed to remove friend:', err);
            }
        }
    };

    const handleChatClick = (friendUsername) => {
        navigate(`/chat/${userData?.username}/${friendUsername}`);
    };

    const handleBackToProfile = () => {
        navigate(`/profile/${username}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.container}>
            
            <h1>{username}'s Friends</h1>
            <button onClick={handleBackToProfile} className={styles.backButton}>
                &larr; Back to Profile
            </button>
            {friends.length > 0 ? (
                <ul className={styles.friendList}>
                    {friends.map((friend, index) => (
                        <li key={index} className={styles.friend}>
                            <div 
                                className={styles.friendContainer}
                                onMouseEnter={() => setHoveredFriend(friend.username)}
                                onMouseLeave={() => setHoveredFriend(null)}
                            >
                                <Link to={`/profile/${friend.username}`} className={styles.friendLink}>
                                    {friend.username}
                                </Link>

                                {hoveredFriend === friend.username && (
                                    <div className={styles.profileCardContainer}>
                                        <ProfileCard user={friendsData.find(f => f.username === friend.username)} />
                                    </div>
                                )}
                                
                                <span className={friend.status === "Online" ? styles.online : styles.offline}>
                                    {friend.status}
                                </span>

                                <button 
                                    className={styles.chatButton} 
                                    onClick={() => handleChatClick(friend.username)}
                                >
                                    Chat
                                </button>

                                {username === userData.username && (
                                    <button 
                                        className={styles.removeButton} 
                                        onClick={() => handleRemoveFriend(friend.username)}
                                    >
                                        &#x2716;
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No friends found.</p>
            )}
        </div>
    );
};

export default UserFriends;
