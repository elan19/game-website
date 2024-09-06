import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoSteam from '../../images/logo_steam.png';
import styles from './Navbar.module.css';
import { AuthContext } from '../../util/AuthContext';
import { UserContext } from '../../util/UserContext'; // Import UserContext

const Navigation = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
    const { userData } = useContext(UserContext); // Access user data from context
    const { isLoggedIn, logout } = useContext(AuthContext);

    const routes = {
        '/': { name: 'Shop', hidden: false },
        ...(isLoggedIn && { '/library': { name: 'Library', hidden: false } }),
        '/about': { name: 'About', hidden: false },
        '/gemenskap': { name: 'Gemenskap', hidden: false },
        '/login': { name: 'Login', hidden: false },
        ...(isLoggedIn && { '/profile': { name: localStorage.getItem('username') + " ▼ $" + (userData ? userData.money : 0), hidden: false } })
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
    };

    const handleDropdownToggle = (event) => {
        event.preventDefault();
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 900);
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
                        return null;
                    }
                    return path === '/gemenskap' ? (
                        <div
                            key={path}
                            className={`${styles.dropdownContainer} ${isMobile && dropdownOpen ? styles.dropdownContainerMobileOpen : ''}`}
                            onClick={(e) => isMobile && handleDropdownToggle(e)}
                            onMouseEnter={() => !isMobile && setDropdownOpen(true)}
                            onMouseLeave={() => !isMobile && setDropdownOpen(false)}
                        >
                            <Link
                                to={path}
                                className={`${styles.navLink} ${menuOpen ? styles.navLinksVisible : ''}`}
                                onClick={(e) => isMobile && e.preventDefault() && handleDropdownToggle(e)}
                            >
                                {route.name}
                            </Link>
                            {(dropdownOpen && menuOpen|| !isMobile) && (
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
