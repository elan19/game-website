import React from 'react';

import styles from './Library.module.css';

import Game from '../../Components/Library/game';

class GameView extends React.Component {
    render() {
        return (
            <div>
                <main className={styles.mainLogin}>
                    <Game />
                </main>
            </div>
        );
    }
}

export default GameView;