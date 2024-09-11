import React from 'react';

import styles from './Library.module.css';

import Social from '../../Components/Gemenskap/social';

class SocialView extends React.Component {
    render() {
        return (
            <div>
                <main className={styles.mainLogin}>
                    <Library />
                </main>
            </div>
        );
    }
}

export default SocialView;