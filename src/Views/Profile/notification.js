import React, { useContext, useEffect } from 'react';

import styles from './Profile.module.css';

import Notification from '../../Components/Profile/notification';

function NotificationView() {
    return (
        <div>
            <main className={styles.main}>
                <Notification />
            </main>
        </div>
    );
}

export default NotificationView