import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css'

function NavBarBeforeLogin(props) {
    return (
        <div className={styles.navigationleft}>
            <button className={styles.secondBtn}>Sign Up</button>
            <button className={styles.firstBtn}>Login</button>
            <div className={styles.links2}>
              <div className={styles.link}><Link to="/home" className={styles.nav_font}>Home</Link></div>
              <div className={styles.textwrapper}><Link to="/questions" className={styles.nav_font}>Question</Link></div>
            </div>
            <img className={styles.mainpagebeforeloginlogo} src="/imgs/nav_logo.png" />
        </div>
    );
}

export default NavBarBeforeLogin;