import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BsGithub } from 'react-icons/bs';

import common from '../components/Common.module.css';

const LoginContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LogoContainer = styled.div`
  width: 100%;
  height: 60px;
  padding: 1rem 2rem;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoImg = styled.img`
  width: 150px;
  aspect-ratio: 9/5;
  margin-top: 10px;
`;

const ContentContainer = styled.div`
  width: 100%;
  padding: 1rem 2rem;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoginTitle = styled.h1`
  margin: 0;
  padding-top: 100px;
  font-family: Roboto;
  color: #000000;
  font-size: 64px;
  font-weight: 500;
`;

const LoginButton = styled.button`
  margin-top: 16px;
  width: 280px;
  font-family: Roboto;
  color: #ffffff;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: 0.5rem 1.5rem;
  transition: background-color 0.1s ease;
  border: none;
`;

const ButtonIcon = styled.span`
  margin: auto;
  line-height: 1.25rem !important;
`;

const ButtonText = styled.span`
  margin: auto;
`;

const GithubLoginButton = styled(LoginButton)`
  aspect-ratio: 9/2;
  background-color: #212529;
  &:hover {
    background-color: black;
  }
`;

const CustomerSupportButton = styled(LoginButton)`
  background-color: #ccc;
  color: black;
  font-size: 16px;
  &:hover {
    background-color: #aaa;
  }
`;

const FooterText = styled.p`
  margin: 0;
  padding-top: 35vh;
  font-family: Roboto;
  color: #000000;
  font-size: 14px;
  font-weight: 100;
`;

const Login = () => {
  const handleGithubLogin = () => {
    // local 테스트용
    const client_id = import.meta.env.VITE_CLIENT_ID;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}`;
  };

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', false);
    localStorage.setItem('refresh_token', false);
    localStorage.setItem('access_token', false);
    window.location.reload();
  };

  return (
    <div className={`${common.container}`}>
      <div className={`${common.head}`}>
        <h1>로그인</h1>
        <hr />
      </div>
      <LoginContainer>
        <LogoContainer>
          <LogoImg src="/imgs/nav_logo.png" alt="Logo" />
        </LogoContainer>
        <ContentContainer>
          <GithubLoginButton onClick={handleGithubLogin}>
            {' '}
            <ButtonIcon>
              <BsGithub size="32" />
            </ButtonIcon>
            <ButtonText>GitHub로 시작하기</ButtonText>
          </GithubLoginButton>
          <CustomerSupportButton onClick={handleLogout}>
            <ButtonText>로그아웃</ButtonText>
          </CustomerSupportButton>
          <Link to="/notice">
            <CustomerSupportButton>
              <ButtonText>고객센터</ButtonText>
            </CustomerSupportButton>
          </Link>
          <FooterText>© 2023 - Privacy — Terms</FooterText>
        </ContentContainer>
      </LoginContainer>
    </div>
  );
};

export default Login;
