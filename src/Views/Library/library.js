import React from 'react';

import styles from './Library.module.css';

import Library from '../../Components/Library/library';

class LibraryView extends React.Component {
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

export default LibraryView;