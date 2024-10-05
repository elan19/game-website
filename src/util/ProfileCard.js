import React from 'react';
import styles from './ProfileCard.module.css'; // Create a corresponding CSS module for styling

const ProfileCard = ({ user }) => {
    // Ensure user is not null before rendering the content
    if (!user) {
        return null; // Display a loading message or skeleton if needed
    }

    return (
        <div className={styles.profileCard}>
            <img src={`/images/profile/${user.profilePic}`} alt={`${user.username}'s profile`} />
            <h4>{user.username}</h4>
            <p>Status: {user.status}</p>
            <p>Games: {user.games.length}</p>
            <p>Friends: {user.friends.length}</p>
        </div>
    );
};

export default ProfileCard;
