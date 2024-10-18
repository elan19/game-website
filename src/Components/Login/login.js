import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styles from "./Login.module.css";

import MongoDbModel from '../../models/mongodb';
import { AuthContext } from '../../util/AuthContext';
import { UserContext } from '../../util/UserContext';

const LoginForm = () => {
  const { isAuthenticated, username, login, logout } = useContext(AuthContext);
  const [formUsername, setFormUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { fetchUserData, deleteUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const submitButtonValue = event.nativeEvent.submitter.value;

    if (submitButtonValue === 'Login') {
      MongoDbModel.loginUser(formUsername, password)
        .then(response => {
          if (response && response.username) {
            login(response.username, response.loginId);
            fetchUserData()
              .then(() => {
                navigate('/');
              })
              .catch(error => {
                console.error("Error fetching user data:", error);
              });
          } else {
            setErrorMessage("Incorrect username or password.");
          }
        })
        .catch(error => {
          console.error("Error logging in:", error);
          setErrorMessage("Something went wrong. Please try again.");
        });
    }
  };

  const handleLogout = () => {
    deleteUserData();
    logout();
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h2>Welcome, {username}!</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h1 className={styles.h1LoggaIn}>Login</h1>
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <label className={styles.leftInputLabel} htmlFor="username">Username</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Username"
              value={formUsername}
              maxLength={"20"}
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
            
            {/* Display error message if login fails */}
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

            <input
              type="submit"
              value="Login"
              name="login"
              className={`${styles.button} ${styles.loginButton} ${styles.marginBottom}`}
            />
            <Link to="/register" className={styles.registerLink}>
              <input
                type="button"
                value="Register account"
                name="register"
                className={`${styles.button} ${styles.registerButton} ${styles.marginBottom}`}
              />
            </Link>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
