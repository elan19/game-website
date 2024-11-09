import React from 'react';
import styles from './Footer.module.css';

import gamipologo from "../../images/gamipo-logo3.png";
import arrowlogo from "../../images/gamipo-logo-arrow2.png";

const Footer = () => {
    return (
        <div className={styles.footer}>
        <div className={styles.footerContent}>
            <img className={styles.footerPic} src={arrowlogo} alt="gamipo_arrow_logo" />
            <img className={styles.footerPicRight} src={gamipologo} alt="gamipo_logo" />
            <p>
                © 2024 Gamipo. All rights reserved.
            </p>
        </div>
        <a className={styles.footerLink} href="/">Shop</a> |
        <a className={styles.footerLink} href="/about">About Gamipo</a> |
    </div>
    );
}

export default Footer;