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
                        Gamipo är den ultimata platsen för att spela, diskutera och skapa spel.
                    </p>
                    <button className={styles.CreateAccountButton} onClick={handleButtonClick}>
                        {isLoggedIn ? 'Be Social' : 'Logga in'}
                    </button>
                </div>
                <div className={styles.aboutImgDiv}>
                    <img className={styles.aboutImg} 
                         src={gamigoLogo} 
                         alt="Gamipo about" />
                </div>
            </div>
            <div className={styles.middleDiv}>
                <p className={styles.middleText}>Läs mer</p>
                <p className={styles.middleText}>&#8595;</p>
            </div>
            <div className={styles.aboutContentShopInfo}>
                <h1>Få tillgång till spel direkt</h1>
                <div className={styles.aboutTextMiddle}>
                    <p>
                        Med mängder av spel från AAA till indie och allt däremellan. 
                        Njut av exklusiva erbjudanden, 
                        automatiska speluppdateringar och andra bra förmåner. 
                    </p>
                    <a className={styles.aboutLink} href="/">Bläddra i butiken <span>&#8594;</span></a>
                </div>
            </div>
            <div className={styles.aboutContentGemenskapInfo}>
                <div className={styles.aboutTextLeftAboutGemenskap}>
                    <h1>Gå med i gemenskapen</h1>
                    <p>
                        Träffa nya vänner, 
                        titta på andras bilder och lägg upp dina bilder på gemenskapen! 
                        Med mängder av potentiella vänner (och fiender) 
                        tar det roliga aldrig slut. 
                    </p>
                    <a className={styles.aboutLink} href="/gemenskap">Besök gemenskapen <span>&#8594;</span></a>
                </div>
                <div className={styles.aboutImgDivRightAboutGemenskap}>
                    <img className={styles.aboutImg} src={aboutImg2} alt="Gemenskap" />
                </div>
            </div>
        </div>
    );
};

export default About;
