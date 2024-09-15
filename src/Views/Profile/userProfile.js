import React, { useContext, useEffect } from 'react';

import styles from './Profile.module.css';

import UserProfile from '../../Components/Profile/userProfile';

function UserProfileView() {
    return (
        <div>
            <main className={styles.main}>
                <UserProfile />
            </main>
        </div>
    );
}

export default UserProfileView