import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoSteam from '../../images/logo_steam.png';
import styles from './Navbar.module.css';
import { AuthContext } from '../../util/AuthContext';

const Navigation = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Track if the view is mobile
    const { isLoggedIn, logout } = useContext(AuthContext);

    const routes = {
        '/': { name: 'Shop', hidden: false },
        '/about': { name: 'About', hidden: false },
        '/gemenskap': { name: 'Gemenskap', hidden: false },
        '/login': { name: 'Login', hidden: false },
        ...(localStorage.getItem('isLoggedIn') && { '/profile': { name: localStorage.getItem('username'), hidden: false } }), // Conditionally include profile link if authenticated
    };

    const handleMenuClick = (event) => {
        event.preventDefault();
        setMenuOpen(!menuOpen);
    };

    const handleLogoutClick = (event) => {
        event.preventDefault();
        logout();
    };

    const handleDropdownToggle = (event) => {
        event.preventDefault();
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        // Update the isMobile state when resizing
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        // Close dropdown when resizing to desktop view
        if (!isMobile) {
            setDropdownOpen(false);
        }
    }, [isMobile]);

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
                    return path === '/gemenskap' ? (
                        <div
                            key={path}
                            className={styles.dropdownContainer}
                            onClick={(e) => {
                                if (isMobile) {
                                    handleDropdownToggle(e); // Toggle dropdown on click in mobile view
                                }
                            }}
                            onMouseEnter={() => !isMobile && setDropdownOpen(true)} // Show dropdown on hover for larger screens
                            onMouseLeave={() => !isMobile && setDropdownOpen(false)} // Hide dropdown when not hovering for larger screens
                        >
                            <Link
                                to={path}
                                className={`${styles.navLink} ${menuOpen ? styles.navLinksVisible : ''}`}
                                onClick={(e) => {
                                    if (isMobile) {
                                        e.preventDefault(); // Prevent default link behavior on mobile
                                    }
                                    handleDropdownToggle(e); // Toggle dropdown on click in mobile view
                                }}
                            >
                                {route.name}
                            </Link>
                            {(dropdownOpen || !isMobile) && (
                                <div className={`${styles.dropdownMenu} ${isMobile && dropdownOpen ? styles.dropdownMenuOpen : ''}`}>
                                    <Link to="/gemenskap" onClick={() => setMenuOpen(false)}>Social</Link>
                                    <Link to="/gemenskap/Market" onClick={() => setMenuOpen(false)}>Market</Link>
                                    <Link to="/gemenskap/events" onClick={() => setMenuOpen(false)}>Events</Link>
                                </div>
                            )}
                        </div>
                    ) : (
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
