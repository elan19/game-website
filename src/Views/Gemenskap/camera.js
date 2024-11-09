import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Gemenskap.module.css';

import { AuthContext } from '../../util/AuthContext';
import withAuth from '../../util/withAuth';
import CameraComp from '../../Components/Gemenskap/camera';

function CameraView() {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/community/camera');
        } else {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div>
            <main className={styles.main}>
                <CameraComp />
            </main>
        </div>
    );
}

export default withAuth(CameraView)