import React, { useContext, useEffect } from 'react';

import styles from './Profile.module.css';

import UserFriends from '../../Components/Profile/userFriends';

function UserFriendsView() {

    return (
        <div>
            <main className={styles.main}>
                <UserFriends />
            </main>
        </div>
    );
}

export default UserFriendsView