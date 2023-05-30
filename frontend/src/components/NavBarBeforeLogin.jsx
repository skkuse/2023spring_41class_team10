import React from 'react';
import styles from './NavBar.module.css'

function NavBarBeforeLogin(props) {
    return (
        <div className={styles.navigationleft}>
            <button className={styles.secondBtn}>Sign Up</button>
            <button className={styles.firstBtn}>Login</button>
            <div className={styles.links2}>
              <div className={styles.link}><a href="#!" className={styles.nav_font}>Home</a></div>
              <div className={styles.textwrapper}><a href="#!" className={styles.nav_font}>Question</a></div>
            </div>
            <img className={styles.mainpagebeforeloginlogo} src="/imgs/nav_logo.png" />
        </div>
    );
}

export default NavBarBeforeLogin;