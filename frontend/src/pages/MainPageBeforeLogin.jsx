import React from 'react';
import styles from './MainPage.module.css';
import FooterB from '../components/FooterB';
import NavBarBeforeLogin from '../components/NavBarBeforeLogin';

function MainPageBeforeLogin(props) {
    return (
        <div className={styles.mainpage}>
        <div className={styles.div}>
          <div className={styles.overlap}>
            <div className={styles.herocenter}>
              <button className={styles.centerBtn}>지금 가입하기</button>
              <div className={styles.subtitle}>Be Pro 설명</div>
              <h1 className={styles.title}>미래형 AI 코딩 교육 플랫폼</h1>
            </div>
            <div className={styles.group}>
              <img className={styles.vector} src="/imgs/vector.svg" />
              <img className={styles.img} src="/imgs/vector-1.svg" />
              <img className={styles.vector2} src="/imgs/vector-2.svg" />
              <div className={styles.ellipse2} />
              <div className={styles.ellipse3} />
              <div className={styles.ellipse4} />
              <div className={styles.rectangle} />
            </div>
            <div className={styles.group23}>
              <img className={styles.vector} src="/imgs/Footer_img.png" />
              <img className={styles.vector4} src="/imgs/vector-4.svg" />
              <img className={styles.vector5} src="/imgs/vector-5.svg" />
              <div className={styles.ellipse} />
              <div className={styles.ellipse2} />
              <div className={styles.ellipse3} />
              <div className={styles.ellipse4} />
              <div className={styles.rectangle} />
            </div>
            <NavBarBeforeLogin />
          </div>
          <div className={styles.rectangle2} />
          <div className={styles.overlapgroup4}>
            <div className={styles.postssquare}>
              <div className={styles.cardsqare}>
                <div className={styles.subtitle2}>Learn More</div>
                <div className={styles.title2}>나에게 맞는 강의 추천</div>
                <img className={styles.mainpagebeforeloginelement} src="/imgs/service.png" />
              </div>
              <div className={styles.cardsquare}>
                <p className={styles.title3}>자동 코드 분석 및 리팩토링</p>
                <div className={styles.subtitle2}>Learn More</div>
                <div
                  className={styles.mainpagebeforeloginoverlapgroup}
                  
                />
              </div>
              <div className={styles.cardsquare3}>
                <div className={styles.title2}>ChatGPT를 이용한 코딩 교육</div>
                <div className={styles.subtitle2}>Learn More</div>
                <div className={styles.overlapgroup1}>
                  <img className={styles.element001101} src="/imgs/service-2.png" />
                </div>
              </div>
              <p className={styles.p}>미래형 AI 코딩 교육 플랫폼 서비스 모음</p>
              <p className={styles.title4}>BePro 의 주요 학습 서비스</p>
            </div>
            
          </div>
          <div className={styles.overlapgroup5}><FooterB /></div>
          
        </div>
      </div>
    );
}

export default MainPageBeforeLogin;