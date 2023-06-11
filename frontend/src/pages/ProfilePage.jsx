import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { BsGithub } from 'react-icons/bs';

import common from '../components/Common.module.css';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 1px solid #d0d7de;
  object-fit: cover;
`;

const ProfileUsername = styled.h2``;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const ProfileGithub = styled.a`
  font-size: 18px;
  display: flex;
  justify-content: center;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: color 0.2s ease;
  color: #ffffff;
  background-color: #212529;
  gap: 0.5rem;
  &:hover {
    text-decoration: underline;
    color: #ffffff;
    background-color: black;
  }
`;

const LogoutButton = styled.button`
  font-size: 1rem;
  background-color: #ccc;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    background-color: #aaa;
  }
`;

const ButtonIcon = styled.span`
  margin: auto;
  line-height: 1.25rem !important;
`;

const ButtonText = styled.span`
  margin: auto;
`;

function ProfilePage(props) {
  const { slugUsername } = useParams();

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', false);
    localStorage.setItem('refresh_token', false);
    localStorage.setItem('access_token', false);
    window.location.href = '/';
  };

  const handleClick = () => {
    window.open(`https://github.com/${slugUsername}`, '_blank');
  };

  return (
    <div className={`${common.container}`}>
      {slugUsername === props.user.github_username ? (
        <>
          <div className={`${common.head}`}>
            <h1>프로필</h1>
            <hr />
          </div>
          <ProfileContainer>
            <ProfileImage src={props.user.profile_image_url} alt="Profile Image" />
            <ProfileUsername>{slugUsername}</ProfileUsername>
            <ButtonContainer>
              <ProfileGithub onClick={handleClick}>
                <ButtonIcon>
                  <BsGithub size="32" />
                </ButtonIcon>
                <ButtonText>GitHub 페이지</ButtonText>
              </ProfileGithub>
              <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
            </ButtonContainer>
          </ProfileContainer>
        </>
      ) : (
        <>
          <div className={`${common.head}`}>
            <h1>접근권한이 없습니다.</h1>
            <hr />
          </div>
        </>
      )}
    </div>
  );
}

export default ProfilePage;
