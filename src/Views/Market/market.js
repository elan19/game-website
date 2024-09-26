import React from 'react';

import styles from './Market.module.css';

import Market from '../../Components/Market/market';

function MarketView() {
    return (
        <div>
            <main className={styles.mainLogin}>
                <Market />
            </main>
        </div>
    );
}

export default MarketView;