import React from 'react';
import styles from './Footer.module.css';

import valve from "../../images/valve.png";
import steamlogo from "../../images/logo_steam.png";

const Footer = () => {
    return (
        <div className={styles.footer}>
        <div className={styles.footerContent}>
            <img className={styles.footerPic} src={valve} alt="valve corp." />
            <img className={styles.footerPicRight} src={steamlogo} alt="steam_logo" />
            <p>
                © 2023 Valve Corporation. Alla rättigheter förbehållna.
                Alla varumärken tillhör respektive ägare i USA och andra länder.
            </p>
        </div>
        <a className={styles.footerLink} href="https://www.valvesoftware.com/sv/about">Om Valve</a> |
        <a className={styles.footerLink} href="https://www.valvesoftware.com/sv/">Jobb</a> |
        <a className={styles.footerLink} href="https://partner.steamgames.com/">Steamworks</a> |
        <a className={styles.footerLink} href="#">Support</a> |
        <a className={styles.footerLink} href="https://www.facebook.com/Steam">Facebook</a> |
        <a className={styles.footerLink} href="https://twitter.com/steam">Twitter</a>
    </div>
    );
}

export default Footer;