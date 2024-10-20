import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../util/AuthContext'; // Adjust the import based on your context setup

import styles from './About.module.css';
import gamigoLogo from '../../images/aboutGamigoLogo.png';
import aboutImg2 from '../../images/about-gemenskap2.png';

const About = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext); // Adjust according to your context structure

    const handleButtonClick = () => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            navigate('/gemenskap/social');
        }
    };

    return (
        <div className={styles.mainAbout}>
            <div className={styles.aboutContent}>
                <div className={styles.aboutText}>
                    <p className={styles.topTextAbout}>
                        Gamipo is the ultimate place to buy, discuss and play games.
                    </p>
                    <button className={styles.CreateAccountButton} onClick={handleButtonClick}>
                        {isLoggedIn ? 'Be Social' : 'Log in'}
                    </button>
                </div>
                <div className={styles.aboutImgDiv}>
                    <img className={styles.aboutImg} 
                         src={gamigoLogo} 
                         alt="Gamipo about" />
                </div>
            </div>
            <div className={styles.middleDiv}>
                <p className={styles.middleText}>Read more</p>
                <p className={styles.middleText}>&#8595;</p>
            </div>
            <div className={styles.aboutContentShopInfo}>
                <h1>Get access to games immediately</h1>
                <div className={styles.aboutTextMiddle}>
                    <p>
                        With a wide range of games from AAA to indie and everything in between. 
                        Enjoy exclusive offers, fast access and other great perks.
                    </p>
                    <a className={styles.aboutLink} href="/">Browse the store <span>&#8594;</span></a>
                </div>
            </div>
            <div className={styles.aboutContentGemenskapInfo}>
                <div className={styles.aboutTextLeftAboutGemenskap}>
                    <h1>Join the community</h1>
                    <p>
                        Meet new friends, check out others' photos, and share your own in the community! 
                        With plenty of potential friends (and enemies), the fun never ends.
                    </p>
                    <a className={styles.aboutLink} href="/gemenskap">Visit the community<span>&#8594;</span></a>
                </div>
                <div className={styles.aboutImgDivRightAboutGemenskap}>
                    <img className={styles.aboutImg} src={aboutImg2} alt="Gemenskap" />
                </div>
            </div>
        </div>
    );
};

export default About;
