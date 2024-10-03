import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProfileCard from '../../util/ProfileCard.js';
import { UserContext } from '../../util/UserContext';
import MongoDbModel from '../../models/mongodb';
import styles from './userFriends.module.css'; // Assuming a CSS module for styling

const UserFriends = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const { fetchUserData } = useContext(UserContext);
    const [friends, setFriends] = useState([]);
    const [friendsData, setFriendsData] = useState([]); // New state for preloaded friends data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredFriend, setHoveredFriend] = useState(null);
    const loggedInUser = localStorage.getItem('username'); // Get the logged-in user's ID

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

    const handleRemoveFriend = async (friendUsername) => {
        const confirmed = window.confirm(`Do you really want to remove ${friendUsername} as your friend?`);
        if (confirmed) {
            try {
                // Call backend to remove the friend
                await MongoDbModel.removeFriend(username, localStorage.getItem('loginId'), friendUsername);
                
                // Update the local state after removing the friend
                setFriends(friends.filter(friend => friend.username !== friendUsername));
                setFriendsData(friendsData.filter(friendData => friendData.username !== friendUsername));
                fetchUserData();
            } catch (err) {
                console.error('Failed to remove friend:', err);
            }
        }
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

                                {/* Only show the remove button if the logged-in user is viewing their own friends list */}
                                {username === loggedInUser && (
                                    <button 
                                        className={styles.removeButton} 
                                        onClick={() => handleRemoveFriend(friend.username)}
                                    >
                                        &#x2716; {/* Unicode for 'X' symbol */}
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
