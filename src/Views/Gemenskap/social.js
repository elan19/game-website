import React from 'react';

import styles from './Social.module.css';

import Social from '../../Components/Gemenskap/social';

class SocialView extends React.Component {
    render() {
        return (
            <div>
                <main className={styles.main}>
                    <Social />
                </main>
            </div>
        );
    }
}

export default SocialView;