import React from 'react';

import styles from './Gemenskap.module.css';

import EditDiscussion from '../../Components/Gemenskap/Discussion/edit-discussion.js';

function EditDiscussionView() {

    return (
        <div>
            <main className={styles.main}>
                <EditDiscussion />
            </main>
        </div>
    );
}

export default EditDiscussionView