import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Profile.module.css';

import { AuthContext } from '../../util/AuthContext';
import Inventory from '../../Components/Profile/inventory';

function InventoryView() {
    return (
        <div>
            <main className={styles.main}>
                <Inventory />
            </main>
        </div>
    );
}

export default InventoryView