import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import styles from './Profile.module.css';
import { UserContext } from '../../util/UserContext';
import Inventory from '../../Components/Profile/inventory'; // User's own inventory
import OtherUserInventory from '../../Components/Profile/userInventory'; // Other user's inventory

function InventoryView() {
    const { username } = useParams(); // Get the username from the URL
    const { userData } = useContext(UserContext); // Get the logged-in user's data

    const isOwnProfile = userData && username && userData.username === username; // Check if the username matches the logged-in user

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
