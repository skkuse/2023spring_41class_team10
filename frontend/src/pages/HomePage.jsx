import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import ProblemInfo from '../components/ProblemInfo';
import Lectures from '../components/Lectures';
import RecomLectures from '../components/RecomLecture';
import common from '../components/Common.module.css';

const server_url = import.meta.env.VITE_SERVER_URL;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
`;

const LecturesContainer = styled.div`
  flex-direction: column;
  margin-bottom: 100px;
`;

const ProcessingLectDiv = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const LectureList = styled.div`
  display: flex;
`;

const QuestionsContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  width: 80%;
  margin-bottom: 100px;
`;

const ProcessingQuesDiv = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ProcessingList = styled.div`
  align-items: center;
  justify-content: center;
`;

const RecommendContainer = styled.div`
  margin-top: 2rem;
`;

const RecomList = styled.div`
  margin: 20px;
  display: flex;
`;

const RecommendDiv = styled.div`
  margin-top: 2rem;
  font-size: 1.5rem;
  font-weight: bold;
`;

function HomePage() {
  const problems = [
    {
      slug: '1',
      title: 'Test Problem 1',
      problemNumber: '1',
      problemCategory: 'I/O',
      problemLevel: '2',
      problemStatus: 'complete'
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

  const [problemData, setProblemData] = useState([]);
  const [recentLecture, setRecentLecture] = useState([]);
  const [recommendLecture, setRecommendLecture] = useState([]);
  useEffect(() => {
    const fetchRecentLecture = async () => {
      try {
        const config = getHeader();
        const response = await axios.get(`${server_url}/users/v1/lectures/history/`, config);
        console.log('response', response);
        if (response.data.status !== 'fail') setRecentLecture(response.data.data);
      } catch (error) {
        console.error('Failed to fetch RecentLecture:', error);
      }
    };
    const fetchRecommendLecture = async () => {
      try {
        const config = getHeader();
        const response = await axios.get(`${server_url}/users/v1/lectures/guideline/`, config);
        console.log('response', response);
        if (response.data.status !== 'fail') setRecommendLecture(response.data.data);
      } catch (error) {
        console.error('Failed to fetch RecentLecture:', error);
      }
    };
    fetchRecentLecture();
    fetchRecommendLecture();
  }, []);
  const getHeader = () => {
    const token = localStorage.getItem('access_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    return config;
  };

  const processingProblems = problems.filter((problem) => problem.problemStatus === 'processing');

  return (
    <div className={`${common.container}`}>
      <div className={`${common.head}`}>
        <h1>Home</h1>
        <hr />
      </div>
      <BodyContainer>
        <LecturesContainer>
          <ProcessingLectDiv>최근 수강 강의</ProcessingLectDiv>
          <LectureList>
            {recentLecture.map((lecture, index) => (
              <Lectures
                key={index}
                id={lecture.id}
                youtubeLink={lecture.lecture_link}
                title={lecture.lecture_title}
                datetime={lecture.create_at}
              />
            ))}
          </LectureList>
        </LecturesContainer>
        <QuestionsContainer>
          <ProcessingQuesDiv>풀고 있는 문제</ProcessingQuesDiv>
          <ProcessingList>
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
          </ProcessingList>
        </QuestionsContainer>
        <RecommendContainer>
          <RecommendDiv>추천 강의</RecommendDiv>
          <RecomList>
            {recommendLecture.map((lecture, index) => (
              <Lectures
                key={index}
                id={lecture.lecture_id}
                youtubeLink={lecture.lecture_link}
                title={lecture.lecture_title}
                memo={lecture.memo}
              />
            ))}
          </RecomList>
        </RecommendContainer>
      </BodyContainer>
    </div>
  );
}

export default HomePage;
