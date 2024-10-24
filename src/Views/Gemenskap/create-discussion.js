import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Gemenskap.module.css';

import { AuthContext } from '../../util/AuthContext.js';
import withAuth from '../../util/withAuth.js';
import CreateDiscussion from '../../Components/Gemenskap/Discussion/create-discussion.js';

function CreateDiscussionView() {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/gemenskap/discussion/create-discussion');
        } else {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div>
            <main className={styles.main}>
                <CreateDiscussion />
            </main>
        </div>
    );
}

export default withAuth(CreateDiscussionView)