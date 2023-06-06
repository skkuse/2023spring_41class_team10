import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BsGithub } from 'react-icons/bs';

const LoginContainer = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LogoContainer = styled.div`
  width: 100%;
  height: 60px;
  padding: 0;
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
  height: 100vh;
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
  aspect-ratio: 9/2;
  font-family: Roboto;
  color: #ffffff;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: 0.5rem 1.5rem;
`;

const ButtonIcon = styled.span`
  margin: auto;
  line-height: 1.25rem !important;
`;

const ButtonText = styled.span`
  margin: auto;
`;

const GithubLoginButton = styled(LoginButton)`
  background-color: #212529;
`;

const CustomerSupportButton = styled(LoginButton)`
  background-color: #959595;
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
    window.location.href = 'https://github.com/login/oauth/authorize?client_id=Iv1.f8333c935b2b0479';
  };

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', false);
    localStorage.setItem('refresh_token', false);
    localStorage.setItem('access_token', false);
    window.location.reload();
  };

  return (
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
  );
};

export default Login;
