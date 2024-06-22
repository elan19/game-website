import React from 'react';

import styles from './Login.module.css';

import LoginForm from '../../Components/Login/login';

class LoginView extends React.Component {
    render() {
        return (
            <div>
                <main className={styles.mainLogin}>
                    <LoginForm />
                </main>
            </div>
        );
    }
}

export default LoginView;