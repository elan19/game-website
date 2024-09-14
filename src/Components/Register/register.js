import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from "./Register.module.css";

import MongoDbModel from '../../models/mongodb';

const RegisterForm = () => {
  const [formUsername, setFormUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null); // To track error messages

  const navigate = useNavigate(); // useNavigate hook for redirection

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null); // Clear any previous error

    const user = {
      username: formUsername,
      password: password,
      email: email
    };

    const submitButtonValue = event.nativeEvent.submitter.value;
    if (submitButtonValue === 'Registrera användare') {
      MongoDbModel.registerUser(user.username, user.password, user.email)
        .then(response => {
          if (response && response.result) {
            // If registration is successful, navigate to the login page
            console.log("Registration successful!");
            navigate('/login'); // Redirect to login page
          } else {
            // If registration failed, set the error message
            setError(response.error || "Registration failed");
          }
        })
        .catch(error => {
          // Handle any error that occurs during registration
          console.error("Error registering:", error);
          setError("Error occurred during registration. Please try again.");
        });
    }
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
            {error && (
              <div className={styles.errorMessage}>{error}</div>
            )}
          </form>
        </div>
    </div>
  );
};

export default RegisterForm;
