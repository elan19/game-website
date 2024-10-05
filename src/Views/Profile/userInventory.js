import React from 'react';

import styles from './Profile.module.css';

import Inventory from '../../Components/Profile/userInventory';

function OtherUserInventoryView() {
    return (
        <div>
            <main className={styles.main}>
                <Inventory />
            </main>
        </div>
    );
}

export default OtherUserInventoryView