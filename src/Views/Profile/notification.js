import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Profile.module.css';

import { AuthContext } from '../../util/AuthContext';
import Notification from '../../Components/Profile/notification';

function NotificationView() {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/profile/notification');
        } else {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div>
            <main className={styles.main}>
                <Notification />
            </main>
        </div>
    );
}

export default NotificationView