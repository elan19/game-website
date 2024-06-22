import React, { useEffect, useState } from 'react';

import styles from './About.module.css';
import aboutImg2 from '../../images/about-gemenskap2.png';

const About = () => {

    return (
        <div className={styles.mainAbout}>
            <div className={styles.aboutContent}>
                <div className={styles.aboutText}>
                    <p className={styles.topTextAbout}>
                        Steam är den ultimata platsen för att spela, diskutera och skapa spel.
                    </p>
                    <button className={styles.installSteamButton}>Installera steam</button>
                </div>
                <div className={styles.aboutImgDiv}>
                    <img className={styles.aboutImg} 
                         src="https://cdn.akamai.steamstatic.com/store/about/videos/about_hero_loop_web.png" 
                         alt="Steam about" />
                </div>
            </div>
            <p className={styles.middleText}>Läs mer</p>
            <p className={styles.middleText}>&#8595;</p>
            <div className={styles.aboutContentShopInfo}>
                <h1>Få tillgång till spel direkt</h1>
                <div className={styles.aboutTextMiddle}>
                    <p>
                        Med nästan 30 000 spel från AAA till indie och allt däremellan. 
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
                        Med över 100 miljoner potentiella vänner (och fiender) 
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
