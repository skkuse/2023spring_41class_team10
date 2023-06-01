import React from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';

const StyledFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 10px;
  background-color: #000000;
  height: 120px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const LogoImage = styled.img`
    height: 100%;
    max-height: 140px;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 20px;
  margin-right: 10px;
`;

const Copyright = styled.div`
  max-width: 30vw;
  font-size: 10px;
  color: gray;
`;

const StyledLink = styled(Link)`
  color: #dddddd;
  text-decoration: none;
  margin: 0px 1vw;
`;

function Footer() {
    return (
        <StyledFooter>
            <Logo>
                <StyledLink to="/">
                <LogoImage src="/imgs/Footer_img.png" />
                </StyledLink>
            </Logo>
            <FooterLinks>
                <StyledLink to="https://docs.google.com/document/d/16dsYUR7PljnmRDSPxcPIAwcWHd9pJJ0LGFp6gEMlPio/edit?usp=sharing">서비스 약관</StyledLink>
                <StyledLink to="https://docs.google.com/document/d/1pEbqxKdsFs529TlTf0WzfuMgPVHXgVWXpy1Qqxkcvzg/edit?usp=sharing">개인정보 보호 방침</StyledLink>
                <StyledLink to="https://github.com/skkuse/2023spring_41class_team10/">GitHub</StyledLink>
            </FooterLinks>
            <Copyright>
                © BePro, Inc. 2023.  Be Pro Bro <br/><br/>
                AI based programming education platform, BePro. <br/>Team 10 of Software Engineering class SWE3002_41, Spring 2023,&nbsp;
                <a href="https://skku.edu" style={{ color: '#ffffff' }}>SKKU</a>, 
            </Copyright>
        </StyledFooter>
    );
}

export default Footer;