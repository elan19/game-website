import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import logoSteam from '../../images/logo_steam.png';
import styles from './Navbar.module.css';

import { AuthContext } from '../../util/AuthContext';

const Navigation = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isLoggedIn, logout } = useContext(AuthContext);

    const routes = {
        '/': { name: 'Shop', hidden: false },
        '/about': { name: 'About', hidden: false },
        '/gemenskap': { name: 'Gemenskap', hidden: false },
        '/login': { name: 'Login', hidden: false },
        ...(localStorage.getItem('isLoggedIn') && { '/profile': { name: localStorage.getItem('username'), hidden: false } }), // Conditionally include profile link if authenticated
        // Add more routes as needed
    };

    const handleMenuClick = (event) => {
        event.preventDefault();
        setMenuOpen(!menuOpen);
    };

    const handleLogoutClick = (event) => {
        event.preventDefault();
        logout();
    };

    return (
        <div className={styles.bottomNav}>
            <nav className={styles.nav}>
                <Link to="/">
                    <img className={styles.navPic} src={logoSteam} alt="steam_logo" />
                </Link>
                <div className={styles.hamburgMenu} onClick={handleMenuClick}>
                    <div className={`${styles.bar1} ${menuOpen ? styles.changeBar1 : ''}`}></div>
                    <div className={`${styles.bar2} ${menuOpen ? styles.changeBar2 : ''}`}></div>
                    <div className={`${styles.bar3} ${menuOpen ? styles.changeBar3 : ''}`}></div>
                </div>
                {Object.keys(routes).map((path) => {
                    const route = routes[path];
                    if (route.hidden || (path === '/login' && isLoggedIn)) {
                        return null; // Hide the login link if authenticated
                    }
                    return (
                        <Link
                            key={path}
                            className={`${styles.navLink} ${menuOpen ? styles.navLinksVisible : ''}`}
                            to={path}
                            onClick={() => setMenuOpen(false)}
                        >
                            {route.name}
                        </Link>
                    );
                })}
                {isLoggedIn && (
                    <Link
                        to="#"
                        className={`${styles.navLink} ${menuOpen ? styles.navLinksVisible : ''}`}
                        onClick={handleLogoutClick}
                    >
                        Logout
                    </Link>
                )}
            </nav>
        </div>
    );
};

export default Navigation;
