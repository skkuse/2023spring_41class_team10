import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import ProblemInfo from '../components/ProblemInfo';
import Lectures from '../components/Lectures';
import common from '../components/Common.module.css';

import { BsGithub } from 'react-icons/bs';

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 200px;
  padding: 2rem;
`;

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

const RecentQuestions = styled.div`
  margin-top: 1rem;
  width: 80%;
  display: flex;
  flex-direction: column;
`;

const RecentQuesDiv = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const RecentQuesList = styled.div`
  margin-top: 2rem;
`;

const RecentLecList = styled.div`
  margin-top: 2rem;
  display: flex;
`;

const RecentLectures = styled.div`
  margin-top: 2rem;
`;

const RecentLecDiv = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
`;

function ProfilePage(props) {
  const { slugUsername } = useParams();

  const processingProblems = [
    {
      slug: '1',
      title: 'Test Problem 1',
      problemNumber: '1',
      problemCategory: 'I/O',
      problemLevel: '2',
      problemStatus: 'processing'
    },
    {
      slug: '2',
      title: 'Test Problem 2',
      problemNumber: '2',
      problemCategory: 'Looping',
      problemLevel: '3',
      problemStatus: 'processing'
    }
  ];

  const lectures = [
    {
      youtubeLink: 'https://www.youtube.com/watch?v=kWiCuklohdY',
      title: 'Lecture 1',
      progress: 30
    },
    {
      youtubeLink: 'https://www.youtube.com/watch?v=q6fPjQAzll8',
      title: 'Lecture 2',
      progress: 70
    }
  ];

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', false);
    localStorage.setItem('refresh_token', false);
    localStorage.setItem('access_token', false);
    window.location.reload();
  };

  const handleClick = () => {
    window.open(`https://github.com/${slugUsername}`, '_blank');
  };

  return (
    <div className={`${common.container}`}>
      <div className={`${common.head}`}>
        <h1>프로필</h1>
        <hr />
      </div>
      {slugUsername === props.user.github_username ? (
        <>
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
          <BodyContainer>
            <RecentQuestions>
              <RecentQuesDiv>최근 푼 문제</RecentQuesDiv>
              <RecentQuesList>
                {processingProblems.map((problem) => (
                  <ProblemInfo
                    key={problem.slug}
                    problemNumber={problem.problemNumber}
                    title={problem.title}
                    problemCategory={problem.problemCategory}
                    problemLevel={problem.problemLevel}
                    problemStatus={problem.problemStatus}
                  />
                ))}
              </RecentQuesList>
            </RecentQuestions>
            <RecentLectures>
              <RecentLecDiv>최근 본 강의</RecentLecDiv>
              <RecentLecList>
                {lectures.map((lecture, index) => (
                  <Lectures
                    key={index}
                    youtubeLink={lecture.youtubeLink}
                    title={lecture.title}
                    progress={lecture.progress}
                  />
                ))}
              </RecentLecList>
            </RecentLectures>
          </BodyContainer>
        </>
      ) : (
        <>
          <ProfileContainer>
            {/* TODO 프로필 이미지를 유저 정보를 받아와서 처리하거나 디폴트 이미지 사용 */}
            <ProfileImage src={`https://i.ytimg.com/vi/sXeYkw4VE24/mqdefault.jpg`} alt="Profile Image" />
            <ProfileUsername>{slugUsername}</ProfileUsername>
            <ButtonContainer>
              <ProfileGithub onClick={handleClick}>GitHub 페이지</ProfileGithub>
            </ButtonContainer>
          </ProfileContainer>
        </>
      )}
    </div>
  );
}

export default ProfilePage;
