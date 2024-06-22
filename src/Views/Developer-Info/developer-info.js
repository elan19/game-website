import React from 'react';

import styles from './DeveloperInfo.module.css';

import DevInfo from '../../Components/Developer-info/developer-info';

class DeveloperInfoView extends React.Component {
    render() {
        return (
            <div>
                <main className={styles.main}>
                    <DevInfo />
                </main>
            </div>
        );
    }
}

export default DeveloperInfoView;