import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from "./Register.module.css";
import MongoDbModel from '../../models/mongodb';

const RegisterForm = () => {
  const [formUsername, setFormUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000); // Hide the error after 5 seconds

      return () => clearTimeout(timer); // Clear timeout on component unmount
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        navigate('/login'); // Redirect after 3 seconds
      }, 3000); // Redirect after 3 seconds

      return () => clearTimeout(timer); // Clear timeout on component unmount
    }
  }, [successMessage, navigate]); // Dependency array ensures this runs when successMessage changes

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null); // Clear any previous error

    const user = {
      username: formUsername,
      password: password,
      email: email
    };

    const submitButtonValue = event.nativeEvent.submitter.value;
    if (submitButtonValue === 'Register account') {
      MongoDbModel.registerUser(user.username, user.password, user.email)
        .then(response => {
          if (response && response.result) {
            setSuccessMessage("Registration successful! Redirecting to login page...");
          } else {
            setError(response.error || "Registration failed");
          }
        })
        .catch(error => {
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
              value="Register account"
              className={`${styles.button} ${styles.registerButton} ${styles.marginBottom}`}
            />
            {error && (
              <div className={styles.errorMessage}>{error}</div>
            )}
            {successMessage && (
              <div className={styles.successMessage}>{successMessage}</div>
            )}
          </form>
        </div>
    </div>
  );
};

export default RegisterForm;
