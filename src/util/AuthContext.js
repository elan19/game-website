import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('isLoggedIn') === 'true'
  );

  const login = (username) => {
    // Implement your login logic here, such as validating credentials
    setIsAuthenticated(true);
    setUsername(username);
    localStorage.setItem('username', username); // Save username in localStorage
    localStorage.setItem('isLoggedIn', 'true'); // Save isLoggedIn as true in localStorage
    setIsLoggedIn(true); // Update state variable
  };

  const logout = () => {
    // Implement logout logic
    setIsAuthenticated(false);
    setUsername("");
    localStorage.removeItem('username'); // Remove username from localStorage
    localStorage.removeItem('isLoggedIn'); // Remove isLoggedIn from localStorage
    setIsLoggedIn(false); // Update state variable
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };