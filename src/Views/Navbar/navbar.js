import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoGamipo from '../../images/gamipo-logo3.png';
import styles from './Navbar.module.css';
import { AuthContext } from '../../util/AuthContext';
import { UserContext } from '../../util/UserContext'; // Import UserContext

const Navigation = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1050);
    const { userData, fetchUserData, deleteUserData } = useContext(UserContext); // Access user data from context
    const { isLoggedIn, logout } = useContext(AuthContext);

    useEffect(() => {
        const loadData = async () => {
            await fetchUserData();
        };

        if (!userData) {
            loadData();
        }
    }, [userData, fetchUserData]);

    const routes = {
        '/': { name: 'Shop', hidden: false },
        ...(isLoggedIn && { '/library': { name: 'Library', hidden: false } }),
        '/about': { name: 'About', hidden: false },
        '/community': { name: 'Community', hidden: false },
        '/login': { name: 'Login', hidden: false },
        ...(isLoggedIn && userData && { '/profile': { name: userData.username + " ▼ $" + (userData && userData.money !== undefined ? parseFloat(userData.money.toFixed(2)) : 0), hidden: false } })
    };

    const handleMenuClick = (event) => {
        event.preventDefault();
        console.log(menuOpen);
        setMenuOpen(!menuOpen);
        setDropdownOpen(false)
    };

    const handleLogoutClick = (event) => {
        event.preventDefault();
        logout();
        deleteUserData();
    };

    const handleDropdownToggle = (event) => {
        event.preventDefault();
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1050);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (!isMobile) {
            setDropdownOpen(false);
        }
    }, [isMobile]);

    return (
        <div className={styles.bottomNav}>
            <nav className={styles.nav}>
                <Link to="/">
                    <img className={styles.navPic} src={logoGamipo} alt="steam_logo" />
                </Link>
                <div className={styles.hamburgMenu} onClick={handleMenuClick}>
                    <div className={`${styles.bar1} ${menuOpen ? styles.changeBar1 : ''}`}></div>
                    <div className={`${styles.bar2} ${menuOpen ? styles.changeBar2 : ''}`}></div>
                    <div className={`${styles.bar3} ${menuOpen ? styles.changeBar3 : ''}`}></div>
                    <div className={`${styles.bar4} ${menuOpen ? styles.changeBar4 : ''}`}></div>
                </div>

                {Object.keys(routes).map((path) => {
                    const route = routes[path];
                    if (route.hidden || (path === '/login' && isLoggedIn)) {
                        return null;
                    }
                    return path === '/community' ? (
                        <div
                            key={path}
                            className={`${styles.dropdownContainer} ${isMobile && dropdownOpen ? styles.dropdownContainerMobileOpen : ''}`}
                            onMouseEnter={() => !isMobile && setDropdownOpen(true)}
                            onMouseLeave={() => !isMobile && setDropdownOpen(false)}
                        >
                            <Link
                                to={path}
                                className={`${styles.navLink} ${menuOpen ? styles.navLinksVisible : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (isMobile) handleDropdownToggle(e);
                                }}
                            >
                                {route.name}
                            </Link>
                            {((dropdownOpen && menuOpen) || !isMobile) && (
                                <div className={`${styles.dropdownMenu} ${isMobile && dropdownOpen ? styles.dropdownMenuOpen : ''}`}>
                                    <Link to="/community" onClick={() => { setMenuOpen(false); setDropdownOpen(false); }}>Home</Link>
                                    <Link to="/community/social" onClick={() => { setMenuOpen(false); setDropdownOpen(false); }}>Social</Link>
                                    <Link to="/community/discussion" onClick={() => { setMenuOpen(false); setDropdownOpen(false); }}>Discussion</Link>
                                    <Link to="/community/market" onClick={() => { setMenuOpen(false); setDropdownOpen(false); }}>Market</Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            key={path}
                            className={`${styles.navLink} ${menuOpen ? styles.navLinksVisible : ''}`}
                            to={path}
                            onClick={() => {
                                setMenuOpen(false);
                                setDropdownOpen(false); // Close dropdown when a different link is clicked
                            }}
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
