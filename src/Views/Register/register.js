import React from 'react';

import styles from './Register.module.css';

import RegisterForm from '../../Components/Register/register';

class RegisterView extends React.Component {
    render() {
        return (
            <div>
                <main className={styles.mainLogin}>
                    <RegisterForm />
                </main>
            </div>
        );
    }
}

export default RegisterView;