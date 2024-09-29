import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProfileCard from '../../util/ProfileCard.js';
import MongoDbModel from '../../models/mongodb';
import styles from './Friends.module.css'; // Assuming a CSS module for styling

const UserFriends = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [friendsData, setFriendsData] = useState([]); // New state for preloaded friends data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredFriend, setHoveredFriend] = useState(null);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friendsList = await MongoDbModel.getUserFriends(username);
                const fetchedUser = await MongoDbModel.getUserProfile(username);
                
                // Preload all friends' profile data
                const friendsData = await Promise.all(
                    friendsList.friends.map(friend => MongoDbModel.getUserProfile(friend.username))
                );

                setUser(fetchedUser);
                setFriends(friendsList.friends);
                setFriendsData(friendsData); // Store all the friends' data
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch friends", err);
                setError('Failed to load friends list.');
                setLoading(false);
            }
        };

        fetchFriends();
    }, [username]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <h1>{username}'s Friends</h1>
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
                                        {/* Pass preloaded friend data to ProfileCard */}
                                        <ProfileCard user={friendsData.find(f => f.username === friend.username)} />
                                    </div>
                                )}
                                <span className={friend.status === "Online" ? styles.online : styles.offline}>
                                    {friend.status}
                                </span>
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
