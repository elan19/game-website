import React from 'react';

import styles from './PublisherInfo.module.css';

import PublisherInfo from '../../Components/Publisher-Info/publisher-info';

class PublisherInfoView extends React.Component {
    render() {
        return (
            <div>
                <main className={styles.main}>
                    <PublisherInfo />
                </main>
            </div>
        );
    }
}

export default PublisherInfoView;