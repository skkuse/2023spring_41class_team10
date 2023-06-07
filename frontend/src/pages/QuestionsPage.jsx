import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useProfileQuery } from '../hooks';
import styled from 'styled-components';
import { BsFilter, BsSearch } from 'react-icons/bs';
import ProblemInfo from '../components/ProblemInfo';
// import { useQuestionQuery } from '../hooks';
import axios from 'axios';

const QuestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f2f2f2;
  margin-bottom: 100px;
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
  margin: 50px 10px;
  display: flex;
  justify-content: space-between;
  gap: 5rem;
`;

const StatusContainer = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
`;

const FilterButton = styled.button`
  margin: 0 10px;
  background-color: #ccc;
  padding: 4px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #333;
  font-size: 18px;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #999;
  }
`;

const FirstDiv = styled.div`
  width: 72px;
  margin: 4px 8px;
  padding: 4px 8px;
  background-color: #c6dbda;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #000000;
`;

const SecondDiv = styled.div`
  width: 72px;
  margin: 4px 8px;
  padding: 4px 8px;
  background-color: #fef0d6;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #000000;
`;

const ThirdDiv = styled.div`
  width: 72px;
  margin: 4px 8px;
  padding: 4px 8px;
  background-color: #ffffff;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #000000;
`;

const FourthDiv = styled.div`
  width: 72px;
  margin: 4px 8px;
  padding: 4px 8px;
  background-color: #d9cfde;
  text-align: center;
  border-radius: 8px;
  border: 1px solid #000000;
`;

const SearchContainer = styled.div`
  margin: 0.5rem 1rem;
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
  padding: 4px 8px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
`;

function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://127.0.0.1:8000/problems/v1/list/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('response', response);
        if (response.data.status !== 'fail') setQuestions(response.data['data']);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };
    fetchQuestions();
  }, []);

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
        <hr />
      </TitleContainer>
      <HeadContainer>
        <StatusContainer>
          <FirstDiv>완료</FirstDiv>
          <SecondDiv>진행중</SecondDiv>
          <ThirdDiv>미완료</ThirdDiv>
          <FourthDiv>AI 추천</FourthDiv>
        </StatusContainer>
        <SearchContainer>
          <FilterButton>
            <BsFilter />
          </FilterButton>
          <SearchInput
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchButton onClick={handleSearch}>
            <BsSearch />
          </SearchButton>
        </SearchContainer>
      </HeadContainer>
      {questions.map((question) => (
        <ProblemInfo
          key={question.id}
          problemNumber={question.id}
          title={question.title}
          problemCategory={question.field}
          problemLevel={question.level}
          problemStatus={question.status}
        />
      ))}
    </QuestionsContainer>
  );
}

export default QuestionsPage;
