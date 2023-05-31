import React from 'react';
import styles from './FooterB.module.css'

function FooterB(props) {
    return (
        <div className={styles.footer_box}>
          <p className={styles.service_box}><a className={styles.service_font} href="http://www.naver.com">서비스 약관 / 이용 약관</a></p>
          <p className={styles.bepro_box}>© BePro, Inc. 2023.  Be Pro Bro!</p>
          <p className={styles.privacy_box}><a className={styles.privacy_font} href="http://www.skku.edu">개인정보 보호</a></p>
          <p className={styles.github_box}><a className={styles.github_font} href="http://www.github.com">GitHub</a></p>
          <img className={styles.footer_img} src="/imgs/Footer_img.png" />
        </div>
    );
}

export default FooterB;