import React from 'react';

import styles from './Gemenskap.module.css';

import DiscussionDetail from '../../Components/Gemenskap/Discussion/discussion-detail.js';

function DiscussionDetailiew() {

    return (
        <div>
            <main className={styles.main}>
                <DiscussionDetail />
            </main>
        </div>
    );
}

export default DiscussionDetailiew