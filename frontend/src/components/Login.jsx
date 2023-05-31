import React from 'react';
import styled from 'styled-components';

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
  width: 5%;
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
  margin-top: 20px;
  width: 20%;
  aspect-ratio: 4/1;
  font-family: Roboto;
  color: #ffffff;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
`;

const GithubLoginButton = styled(LoginButton)`
  background-color: #555555;
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

  return (
    <LoginContainer>
      <LogoContainer>
        <LogoImg src="/imgs/nav_logo.png" alt="Logo" />
      </LogoContainer>
      <ContentContainer>
        <LoginTitle>로그인</LoginTitle>
        <GithubLoginButton onClick={handleGithubLogin}>Github로 로그인</GithubLoginButton>
        <CustomerSupportButton>고객 센터</CustomerSupportButton>
        <FooterText>© 2023 - Privacy — Terms</FooterText>
      </ContentContainer>
    </LoginContainer>
  );
};

export default Login;
