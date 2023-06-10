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

const SectionContainer = styled.div`
  margin: 0 0 2rem 0;
`;
const LecturesContainer = styled(SectionContainer)`
  flex-direction: column;
`;

const LectureList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ProcessingList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
`;

const RecommendContainer = styled(SectionContainer)``;

function HomePage() {
  const [problemData, setProblemData] = useState([]);
  const [recommendProblem, setRecommendProblem] = useState([]);
  const [recentLecture, setRecentLecture] = useState([]);
  const [recommendLecture, setRecommendLecture] = useState([]);
  const [recommendMsg, setRecommendMsg] = useState('추천 강의');
  useEffect(() => {
    const fetchRecentLecture = async () => {
      try {
        const config = getHeader();
        const response = await axios.get(`${server_url}/users/v1/lectures/history/`, config);
        console.log('fetchRecentLecture', response);
        if (response.data.status !== 'fail') setRecentLecture(response.data.data);
      } catch (error) {
        console.error('Failed to fetch RecentLecture:', error);
      }
    };
    const fetchProblem = async () => {
      try {
        const config = getHeader();
        const response = await axios.get(`${server_url}/users/v1/problems/?status=fail`, config);
        console.log('fetchProblem', response);
        if (response.data.status !== 'fail') setProblemData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch RecentLecture:', error);
      }
    };
    const fetchRecommendLecture = async () => {
      try {
        const config = getHeader();
        const response = await axios.get(`${server_url}/users/v1/lectures/guideline/`, config);
        console.log('fetchRecommendLecture', response);
        if (response.data.status !== 'fail') {
          setRecommendLecture(response.data.data);
          setRecommendMsg(response.data.message);
        }
      } catch (error) {
        console.error('Failed to fetch RecentLecture:', error);
      }
    };
    const fetchRecommendProblem = async () => {
      try {
        const config = getHeader();
        const response = await axios.get(`${server_url}/users/v1/problems/guideline/`, config);
        console.log('fetchRecommendProblem', response);
        if (response.data.status !== 'fail') {
          setRecommendProblem(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch RecommendProblem:', error);
      }
    };
    fetchRecentLecture();
    fetchProblem();
    fetchRecommendLecture();
    fetchRecommendProblem();
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

  return (
    <div className={`${common.container}`}>
      <div className={`${common.head}`}>
        <h1>Home</h1>
        <hr />
      </div>
      <BodyContainer>
        <LecturesContainer>
          <h2>최근 수강 강의</h2>
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
        <SectionContainer>
          <h2>최근 제출 내역</h2>
          <ProcessingList>
            {problemData.map((problem, idx) => (
              <ProblemInfo
                key={idx}
                problemNumber={problem.problem_id}
                title={problem.title}
                problemCategory={problem.field}
                problemLevel={problem.level}
                problemStatus={problem.status}
              />
            ))}
          </ProcessingList>
        </SectionContainer>
        <RecommendContainer>
          <h2>{recommendMsg}</h2>
          <LectureList>
            {recommendLecture.map((lecture, index) => (
              <Lectures
                key={index}
                id={lecture.lecture_id}
                youtubeLink={lecture.lecture_link}
                title={lecture.lecture_title}
                memo={lecture.memo}
              />
            ))}
          </LectureList>
        </RecommendContainer>
        <SectionContainer>
          <h2>AI 추천 문제</h2>
          <ProcessingList>
            {recommendProblem.map((problem, idx) => (
              <ProblemInfo
                key={idx}
                problemNumber={problem.problem_id}
                title={problem.title}
                problemCategory={problem.field}
                problemLevel={problem.level}
                problemStatus={problem.status}
              />
            ))}
          </ProcessingList>
        </SectionContainer>
      </BodyContainer>
    </div>
  );
}

export default HomePage;
