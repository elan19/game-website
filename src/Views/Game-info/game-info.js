import React from 'react';

import styles from './GameInfo.module.css';

import GameInfo from '../../Components/Game-info/game-info';

class GameInfoView extends React.Component {
    render() {
        return (
            <div>
                <main className={styles.main}>
                    <GameInfo />
                </main>
            </div>
        );
    }
}

export default GameInfoView;