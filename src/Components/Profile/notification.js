import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../util/UserContext';
import MongoDbModel from '../../models/mongodb';
import styles from './Notification.module.css';
import { Link } from 'react-router-dom';

const NotificationView = () => {
    const { userData, fetchUserData } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [friendRequests, setFriendRequests] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Fetch user data if not available
                if (!userData) {
                    await fetchUserData();
                }

                // Fetch friend requests after ensuring userData is available
                if (userData) {
                    const requests = await MongoDbModel.getFriendRequests(userData.username);
                    setFriendRequests(requests.friendRequests);
                }

            } catch (err) {
                console.error('Failed to fetch friend requests:', err);
                setError('Failed to load friend requests.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userData, fetchUserData]);

    const handleAcceptRequest = async (sender) => {
        try {
            await MongoDbModel.friendRequestAction(sender, userData.username, 'accept');
            const requests = await MongoDbModel.getFriendRequests(userData.username); // Fetch friend requests
            setFriendRequests(requests.friendRequests); // Extract the array from the response
            fetchUserData();
        } catch (error) {
            console.error('Failed to accept friend request:', error);
        }
    };

    const handleRejectRequest = async (sender) => {
        try {
            await MongoDbModel.friendRequestAction(sender, userData.username, 'decline');
            const requests = await MongoDbModel.getFriendRequests(userData.username); // Fetch friend requests
            setFriendRequests(requests.friendRequests); // Extract the array from the response
            fetchUserData();
        } catch (error) {
            console.error('Failed to reject friend request:', error);
        }
    };

    if (loading) {
        return <div></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.notificationDiv}>
            <div className={styles.backProfileLinkDiv}>
                <Link to="/profile" className={styles.backProfileLink}>
                    Back to profile 
                </Link>
            </div>
            <h1>Notifications</h1>
            {friendRequests.length > 0 ? (
                friendRequests.map((request, index) => (
                    <div key={index} className={styles.request}>
                        <p>{request.sender} wants to be your friend!</p>
                        <button onClick={() => handleAcceptRequest(request.sender)}>Accept</button>
                        <button onClick={() => handleRejectRequest(request.sender)}>Reject</button>
                        <Link to={`/profile/${request.sender}`} className={styles.profileLink}>
                            View Profile
                        </Link>
                    </div>
                ))
            ) : (
                <p className={styles.noFriend}>No friend requests at this time.</p>
            )}
        </div>
    );
};

export default NotificationView;
