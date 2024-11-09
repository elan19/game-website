import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Library.module.css';

import { AuthContext } from '../../util/AuthContext';
import Library from '../../Components/Library/library';

function LibraryView()  {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/library');
        } else {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div>
            <main className={styles.mainLogin}>
                <Library />
            </main>
        </div>
    );
}

export default LibraryView;