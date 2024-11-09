import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Gemenskap.module.css';

import { AuthContext } from '../../util/AuthContext';
import withAuth from '../../util/withAuth';
import GemenskapList from '../../Components/Gemenskap/gemenskap-list';

function GemenskapView() {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/community');
        } else {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div>
            <main className={styles.main}>
                <GemenskapList />
            </main>
        </div>
    );
}

export default withAuth(GemenskapView)