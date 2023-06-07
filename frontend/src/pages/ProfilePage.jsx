import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import ProblemInfo from '../components/ProblemInfo';
import Lectures from '../components/Lectures';
import common from '../components/Common.module.css';

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

const ButtonContainer = styled.div`
  margin-top: 1rem;
  display: flex;
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

const ProfileUsername = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ProfileGithub = styled.a`
  font-size: 1rem;
  background-color: #ccc;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.3s ease;
  margin-right: 2rem;
  color: #333;

  &:hover {
    color: #0056b3;
  }
`;

const LogoutButton = styled.button`
  font-size: 1rem;
  background-color: #ccc;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #0056b3;
  }
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

function ProfilePage() {
  /*const { data } = useProfileQuery();
  const { authUser, logout } = useAuth();
  const { username, github } = data.profile;
  const canUpdateProfile = authUser?.username === username;*/
  const { slugUsername } = useParams();

  const data = [
    {
      username: 'Jiyun',
      github: 'https://github.com/mery0816'
    }
  ];

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
    // Handle logout functionality here
    logout();
  };

  const handleClick = () => {
    window.open(data[0].github, '_blank');
  };

  return (
    <div className={`${common.container}`}>
      <div className={`${common.head}`}>
        <h1>프로필</h1>
        <hr />
      </div>
      <ProfileContainer>
        <ProfileImage src="https://img.youtube.com/vi/k75oGRMiENk/0.jpg" alt="Profile Image" />
        <ProfileUsername>{slugUsername}</ProfileUsername>
        <ButtonContainer>
          <ProfileGithub onClick={handleClick}>Visit GitHub Profile</ProfileGithub>
          <LogoutButton onClick={handleLogout}>GitHub 계정 로그아웃</LogoutButton>
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
    </div>
  );
}

export default ProfilePage;
