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
  gap: 1rem;
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
  gap: 1rem;
`;

const AuthLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StyledLink = styled(Link)`
  font-family: 'Roboto', Helvetica;
  color: #000000;
  text-decoration: none;
  padding: 4px 4px;
  text-wrap: nowrap;
`;

const StyledLinkBlack = styled(Link)`
  font-family: 'Roboto', Helvetica;
  color: white;
  background-color: #23272b;
  text-decoration: none;
  padding: 4px 24px;
  border-radius: 6px;
  &:hover {
    background-color: black;
  }
`;

function Navbar(props) {
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
        {props.user.is_staff && <StyledLink to="/produce">Produce</StyledLink>}
      </NavigationLinks>
      {isLoggedIn ? (
        <AuthLinks>
          <StyledLink to="/notice">고객센터</StyledLink>
          {props.user.github_username ? (
            <StyledLinkBlack to={`/profile/${props.user.github_username}`}>
              {props.user.github_username}
            </StyledLinkBlack>
          ) : (
            <StyledLinkBlack to="/login">Login</StyledLinkBlack>
          )}
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

export default Navbar;
