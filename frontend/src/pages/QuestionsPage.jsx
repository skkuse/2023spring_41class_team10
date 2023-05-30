import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useProfileQuery } from '../hooks';
import styled from 'styled-components';
import ProblemInfo from '../components/ProblemInfo';

const QuestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f2f2f2;
  margin-bottom:100px;
`;

const TitleContainer = styled.div`
  margin-bottom: 2rem;
`;

const Titleh1 = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const HeadContainer = styled.div`
  margin: 50px;
  display: flex;
  justify-content: space-between;
`;

const StatusContainer = styled.div`
  margin: 10px;
  margin-right: 200px;
  display: flex;
  justify-content: space-between;
`;

const FilterButton = styled.button`
  margin:20px;
  margin-right:200px;
  background-color: #ccc;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #333;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #999;
  }
`;


const FirstDiv = styled.div`
  width: 80px;
  margin: 10px;
  padding: 10px;
  background-color: #C6DBDA;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #000000;
`;

const SecondDiv = styled.div`
  width: 80px;
  margin: 10px;
  padding: 10px;
  background-color: #FEF0D6;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #000000;
`;

const ThirdDiv = styled.div`
  width: 80px;
  margin: 10px;
  padding: 10px;
  background-color: #FFFFFF;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #000000;
`;

const FourthDiv = styled.div`
  width: 80px;
  margin: 10px;
  padding: 10px;
  background-color: #D9CFDE;
  text-align: center;
  border-radius: 8px;
  border: 1px solid #000000;
`;

const SearchContainer = styled.div`
  margin: 1rem;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-right: 8px;
`;

const SearchButton = styled.button`
  padding: 8px 16px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

function QuestionsPage() {
  const tempdate1 = new Date(2023, 5, 26, 15, 55, 5).toDateString();

  const questions = [
    {
      slug: '1',
      title: 'Test Problem 1',
      problemNumber: '1',
      problemCategory: 'I/O',
      problemLevel: '2',
      problemStatus: 'complete',
      createdAt: tempdate1,
      updatedAt: tempdate1,
    },
    {
      slug: '2',
      title: 'Test Problem 2',
      problemNumber: '2',
      problemCategory: 'Looping',
      problemLevel: '3',
      problemStatus: 'processing',
      createdAt: tempdate1,
      updatedAt: tempdate1,
    },
    // Add more questions as needed
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    // Perform search logic based on the searchTerm
    // You can filter the questions array based on the searchTerm and update the filteredQuestions state
    // For example:
    const filteredQuestions = questions.filter((question) =>
      question.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Use the filteredQuestions array for rendering or further processing
    console.log(filteredQuestions);
  };

  return (
    <QuestionsContainer>
      <TitleContainer>
        <Titleh1>문제 목록</Titleh1>
        <hr style={{ height: '3px' }} />
      </TitleContainer>
      <HeadContainer>
        <StatusContainer>
            <FirstDiv>완료</FirstDiv>
            <SecondDiv>진행중</SecondDiv>
            <ThirdDiv>미완료</ThirdDiv>
            <FourthDiv>AI 추천</FourthDiv>
        </StatusContainer>
        <FilterButton>필터</FilterButton>
        <SearchContainer>
            <SearchInput
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchButton onClick={handleSearch}>Search</SearchButton>
        </SearchContainer>
      </HeadContainer>
      {questions.map((question) => (
        <ProblemInfo
          key={question.slug}
          problemNumber={question.problemNumber}
          title={question.title}
          problemCategory={question.problemCategory}
          problemLevel={question.problemLevel}
          problemStatus={question.problemStatus}
        />
      ))}
    </QuestionsContainer>
  );
}

export default QuestionsPage;
