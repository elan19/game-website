import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Profile.module.css';

import { AuthContext } from '../../util/AuthContext';
import UserFriends from '../../Components/Profile/userFriends';

function UserFriendsView() {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div>
            <main className={styles.main}>
                <UserFriends />
            </main>
        </div>
    );
}

export default UserFriendsView