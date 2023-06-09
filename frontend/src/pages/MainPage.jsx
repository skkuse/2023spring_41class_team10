import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MainPage.module.css';

function MainPage(props) {
  /*페이지 이동 추가 부분*/
  const navigate = useNavigate();
  const goUrl1 = () => {
    navigate('/login');
  };
  const goUrl2 = () => {
    navigate('/home');
  };

  return (
    <div className={styles.mainpage}>
      <div className={styles.div}>
        <div className={styles.overlap}>
          <div className={styles.herocenter}>
            {props.user.github_username ? (
              <>
                <button className={styles.centerBtn} onClick={goUrl2}>
                  개인 페이지로 이동
                </button>
                <div className={styles.subtitle}>AI 학습 도구와 함께하는 프로그래밍 학습</div>
                {props.user.github_username && (
                  <h1 className={styles.title}>어서오세요, {props.user.github_username + ' 님'}</h1>
                )}
              </>
            ) : (
              <>
                <button className={styles.centerBtn} onClick={goUrl1}>
                  지금 시작하기
                </button>
                <div className={styles.subtitle}>AI 학습 도구와 함께하는 프로그래밍 학습</div>
                <h1 className={styles.title}>미래형 AI 코딩 교육 플랫폼</h1>
              </>
            )}
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
        </div>
        <div className={styles.rectangle2} />
        <div className={styles.overlapgroup4}>
          <div className={styles.postssquare}>
            <div className={styles.cardsqare}>
              <div className={styles.title2}>ChatGPT를 이용한 코딩 교육</div>
              <img className={styles.mainpagebeforeloginelement} src="/imgs/main_img1.png" />
            </div>
            <div className={styles.cardsquare}>
              <p className={styles.title3}>진도 저장 및 개인 맞춤 서비스</p>
              <div className={styles.mainpagebeforeloginoverlapgroup} />
            </div>
            <div className={styles.cardsquare3}>
              <div className={styles.title2}>자동 코드 분석 및 리팩토링</div>
              <div className={styles.overlapgroup1}>
                <img className={styles.element001101} src="/imgs/main_img3.png" />
              </div>
            </div>
            <p className={styles.p}>미래형 AI 코딩 교육 플랫폼 서비스 모음</p>
            <p className={styles.title4}>BePro 의 주요 학습 서비스</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
