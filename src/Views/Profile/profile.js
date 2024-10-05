import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Profile.module.css';

import { AuthContext } from '../../util/AuthContext';
import Profile from '../../Components/Profile/profile';

function ProfileView() {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div>
            <main className={styles.main}>
                <Profile />
            </main>
        </div>
    );
}

export default ProfileView