import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Profile.module.css';

import { AuthContext } from '../../util/AuthContext';
import EditProfile from '../../Components/Profile/edit-profile';

function EditProfileView() {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/profile/edit');
        } else {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div>
            <main className={styles.main}>
                <EditProfile/>
            </main>
        </div>
    );
}

export default EditProfileView;