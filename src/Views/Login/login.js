import React from 'react';

import styles from './Login.module.css';

import LoginForm from '../../Components/Login/login';

function LoginView() {
    return (
        <div>
            <main className={styles.mainLogin}>
                <LoginForm />
            </main>
        </div>
    );
}

export default LoginView;