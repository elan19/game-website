import React, { useState, useContext } from 'react';
import * as Realm from "realm-web";

import styles from "./Register.module.css";

import MongoDbModel from '../../models/mongodb';
import { AuthContext } from '../../util/AuthContext';

const RegisterForm = () => {
  const { isAuthenticated, username, register, logout } = useContext(AuthContext);
  const [formUsername, setFormUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = {
      username: formUsername,
      password: password,
      email: email
    };

    const submitButtonValue = event.nativeEvent.submitter.value;
    if (submitButtonValue === 'Registrera användare') {
      MongoDbModel.registerUser(user.username, user.password, user.email)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error("Error registering:", error);
      })
    }
  };


  const handleLogout = () => {
    logout();
  };

  return (
    <div>
        <div>
          <h1 className={styles.h1Registrera}>Register</h1>
          <form onSubmit={handleSubmit} className={styles.registerForm}>
            <label className={styles.leftInputLabel} htmlFor="username">Username</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Username"
              value={formUsername}
              onChange={(e) => setFormUsername(e.target.value)}
            />
            <label className={styles.leftInputLabel} htmlFor="password">Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className={styles.leftInputLabel} htmlFor="email">Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="submit"
              value="Registrera användare"
              className={`${styles.button} ${styles.registerButton} ${styles.marginBottom}`}
            />
          </form>
        </div>
    </div>
  );
};

export default RegisterForm;
