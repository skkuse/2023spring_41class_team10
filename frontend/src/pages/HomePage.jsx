import React from 'react';
import { useAuth } from '../hooks';
import ProblemInfo from '../components/ProblemInfo';
import Lectures from '../components/Lectures';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f2f2f2;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const LecturesContainer = styled.div`
  margin: 2rem;
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
  align-items: center;
  justify-content: center;
  width: 80%;
`;

const ProcessingQuesDiv = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const RecommendContainer = styled.div`
  margin-top: 2rem;
`;

const RecommendDiv = styled.div`
  margin-top: 2rem;
  font-size: 1.5rem;
  font-weight: bold;
`;

function HomePage() {
  const { isAuth } = useAuth();

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
    },
    // Add more problems as needed
  ];

  const lectures = [
    {
      youtubeLink: 'https://www.youtube.com/watch?v=kWiCuklohdY',
      title: 'Lecture 1',
      progress: 30,
    },
    {
      youtubeLink: 'https://www.youtube.com/watch?v=q6fPjQAzll8',
      title: 'Lecture 2',
      progress: 70,
    },
    // Add more lectures as needed
  ];


  const processingProblems = problems.filter(
    (problem) => problem.problemStatus === 'processing'
  );

  return (
    <Container>
      <Title>Home</Title>
      <LecturesContainer>
        <ProcessingLectDiv>진행 중인 강의</ProcessingLectDiv>
        <LectureList>
        {lectures.map((lecture, index) => (
          <Lectures
            key={index}
            youtubeLink={lecture.youtubeLink}
            title={lecture.title}
            progress={lecture.progress}
          />
        ))}
        </LectureList>
      </LecturesContainer>
      <QuestionsContainer>
        <ProcessingQuesDiv>풀고 있는 문제</ProcessingQuesDiv>
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
      </QuestionsContainer>
      <RecommendContainer>
        <RecommendDiv>추천 강의</RecommendDiv>
        {/* Render recommendations here */}
      </RecommendContainer>
    </Container>
  );
}

export default HomePage;
