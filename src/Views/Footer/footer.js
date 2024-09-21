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
                © 2024 Gamipo. Alla rättigheter förbehållna.
                Alla varumärken tillhör respektive ägare i USA och andra länder.
            </p>
        </div>
        <a className={styles.footerLink} href="/">Shop</a> |
        <a className={styles.footerLink} href="/about">Om Gamipo</a> |
        <a className={styles.footerLink} href="#">Works</a> |
        <a className={styles.footerLink} href="#">Support</a> |
        <a className={styles.footerLink} href="https://www.facebook.com/#">Facebook</a> |
        <a className={styles.footerLink} href="https://twitter.com/#">Twitter</a>
    </div>
    );
}

export default Footer;