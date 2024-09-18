import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import styles from './Profile.module.css';
import { AuthContext } from '../../util/AuthContext';
import Inventory from '../../Components/Profile/inventory'; // User's own inventory
import OtherUserInventory from '../../Components/Profile/userInventory'; // Other user's inventory

function InventoryView() {
    const { username } = useParams(); // Get the username from the URL
    const { user } = useContext(AuthContext); // Get the logged-in user's data

    const isOwnProfile = user && user.username === username; // Check if the username matches the logged-in user

    return (
        <div>
            <main className={styles.main}>
                {isOwnProfile ? (
                    <Inventory /> // Show own inventory
                ) : (
                    <OtherUserInventory username={username} /> // Show other user's inventory
                )}
            </main>
        </div>
    );
}

export default InventoryView;
