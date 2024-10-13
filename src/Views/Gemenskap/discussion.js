import React, { useContext, useEffect } from 'react';

import styles from './Gemenskap.module.css';

import withAuth from '../../util/withAuth';
import DiscussionComp from '../../Components/Gemenskap/Discussion/discussion.js';

function DiscussionView() {

    return (
        <div>
            <main className={styles.main}>
                <DiscussionComp />
            </main>
        </div>
    );
}

export default DiscussionView