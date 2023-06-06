import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AuthContext from './AuthContext';

const StyledNavbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  background-color: #ffffff;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const LogoImage = styled.img`
  height: 100%;
  max-height: 50px;
  transform: translateY(3px);
`;

const NavigationLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const AuthLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StyledLink = styled(Link)`
  color: #000000;
  text-decoration: none;
  padding: 4px 4px;
`;

const StyledLinkBlack = styled(Link)`
  color: white;
  background-color: black;
  text-decoration: none;
  padding: 4px 24px;
  border-radius: 6px;
`;

function NavBar(props) {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <StyledNavbar>
      <NavigationLinks>
        <Logo>
          <StyledLink to="/">
            <LogoImage src="/imgs/nav_logo.png" />
          </StyledLink>
        </Logo>
        <StyledLink to="/home">Home</StyledLink>
        <StyledLink to="/questions">Questions</StyledLink>
      </NavigationLinks>
      {isLoggedIn ? (
        <AuthLinks>
          <StyledLink to="/notice">고객센터</StyledLink>
          <StyledLinkBlack to="/login">{props.username !== '' ? props.username : '로그인'}</StyledLinkBlack>
        </AuthLinks>
      ) : (
        <AuthLinks>
          <StyledLink to="/notice">고객센터</StyledLink>
          <StyledLinkBlack to="/login">Login</StyledLinkBlack>
        </AuthLinks>
      )}
    </StyledNavbar>
  );
}

export default NavBar;
