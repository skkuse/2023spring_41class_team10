import React from 'react';
import styled from 'styled-components';

const NavigationLeft = styled.div`
    background-color: #ffffff;
    height: 64px;
    left: 318px;
    position: absolute;
    top: 0;
    width: 1440px;
`;

const FirstButton = styled.button`
    color: #000000;
    font-family: "Roboto", Helvetica;
    font-size: 18px;
    font-weight: 400;
    height: 40px;
    right: 11%;
    position: absolute;
    top: 12px;
    width: 10%;
    background-color: #ffffff;
`;

const SecondButton = styled.button`
    height: 40px;
    right: 0.7%;
    position: absolute;
    top: 12px;
    width: 10%;
    background-color: rgb(0,0,0);
    color: rgb(255,255,255);
`;

const LinkDiv = styled.div`
    color: #000000;
    font-family: "Roboto", Helvetica;
    font-size: 18px;
    font-weight: 400;
    height: 22px;
    left: 0;
    letter-spacing: 0;
    line-height: normal;
    position: absolute;
    top: 0;
`;

const Links2 = styled.div`
    height: 22px;
    left: 156px;
    position: absolute;
    top: 21px;
    width: 165px;
`;

const NavFont = styled.a`
    font-family: "Roboto", Helvetica; font-size: 18px; font-weight: 400; color: rgb(0, 0, 0); line-height: normal;
    height: 22px;
    left: 0;
    letter-spacing: 0;
    position: absolute;
    top: 0;
`;

const LogoImage = styled.img`
    height: 58px;
    left: 20px;
    object-fit: cover;
    position: absolute;
    top: 0;
    width: 101px;
    cursor: pointer;
`;

function NavBarBeforeLogin(props) {
    return (
        <NavigationLeft>
            <SecondButton>Sign Up</SecondButton>
            <FirstButton>Login</FirstButton>
            <Links2>
              <LinkDiv><NavFont href="#!">Home</NavFont></LinkDiv>
              <LinkDiv><NavFont href="#!">Question</NavFont></LinkDiv>
            </Links2>
            <LogoImage src="/imgs/nav_logo.png" />
        </NavigationLeft>
    );
}

export default NavBarBeforeLogin;