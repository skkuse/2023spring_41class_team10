import React from 'react';
import { useState } from 'react';
// import styles from './NavBar.module.css'

function NavBar(props) {
  const [isDetailClicked, setDetailClicked] = useState(false);

  function detailHandler() {
    setDetailClicked(!isDetailClicked);
  }

  return (
    <div className={styles.navigationleft}>
      {!isDetailClicked ? (
        <>
          <button className={styles.secondBtn} onClick={detailHandler}>
            {props.username !== '' ? props.username : 'Login'}
          </button>
          <button className={styles.firstBtn}>고객센터</button>
        </>
      ) : (
        <>
          <button className={styles.secondBtn} onClick={detailHandler}>
            Back
          </button>
          <button className={styles.thirdBtn}>Log Out</button>
          <button className={styles.fourthBtn}>My Page</button>
        </>
      )}
      <div className={styles.links2}>
        <div className={styles.link}>
          <a href="/home" className={styles.nav_font}>
            Home
          </a>
        </div>
        <div className={styles.textwrapper}>
          <a href="/questions" className={styles.nav_font}>
            Question
          </a>
        </div>
      </div>
      <img className={styles.mainpagebeforeloginlogo} src="/imgs/nav_logo.png" />
    </div>
  );
}

export default NavBar;
