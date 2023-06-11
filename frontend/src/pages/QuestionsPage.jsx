import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { BsFilter, BsSearch } from 'react-icons/bs';

import ProblemInfo from '../components/ProblemInfo';
import Pagination from '../components/Pagination';
import common from '../components/Common.module.css';
import Select from 'react-select';

const server_url = import.meta.env.VITE_SERVER_URL;

const QuestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 100px;
`;

const HeadContainer = styled.div`
  margin: 1rem;
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

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FilterButton2 = styled.button`
  margin-bottom: 20px;
`;

const SquareContainer = styled.div`
  max-width: 800px;
  width: 100%;
  display: flex;
  border-radius: 4px;
  border: 1px solid #23272b;
  height: 26px;
  margin: 0.25rem 1rem;
  padding: 4px 8px;
  background-color: white;
`;

const SelectItem = styled(Select)`
  max-width: 817px;
  width: 100%;
  text-align: start;
  margin: 0.25rem 1rem;
  font-size: 14px;
`;

const SquareItem = styled.input`
  text-align: start;
  border: none;
  font-size: 16px;
  padding: 4px 8px;
  width: 100%;
`;

function QuestionsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') ? searchParams.get('q') : '');
  const [curPage, setCurPage] = useState(searchParams.get('page') ? searchParams.get('page') : 1);

  const [fieldList, setFieldList] = useState([
    { value: '입출력', label: '입출력' },
    { value: '자료구조', label: '자료구조' },
    { value: '알고리즘', label: '알고리즘' }
  ]); // 백엔드 데이터 들어오기 전 기본 데이터
  const [showFilters, setShowFilters] = useState(false);
  const [status, setStatus] = useState('all');
  const [level, setLevel] = useState(null);
  const [field, setField] = useState(null);
  const [size, setSize] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [allFilters, setAllFilters] = useState({
    status: 'all',
    level: 0,
    field: ''
  });

  useEffect(() => {
    fetchQuestions(curPage, searchTerm);
    fetchFieldList();
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
  const fetchQuestions = async (cur, keyword = '') => {
    try {
      const config = getHeader();
      let queryString = '';
      if (keyword) queryString += `?q=${keyword}`;
      if (cur && queryString) queryString += `&page=${cur}`;
      if (cur && !queryString) queryString += `?page=${cur}`;
      console.log('queryString', queryString);
      const response = await axios.get(`${server_url}/problems/v1/list/` + queryString, config);
      console.log('response', response);
      if (response.data.status !== 'fail') {
        setQuestions(response.data['data']);
        setSize(response.data['size']);
        setPageSize(response.data['page_size']);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };
  const fetchFieldList = async () => {
    try {
      const config = getHeader();
      const response = await axios.get(`${server_url}/problems/v1/fields/list/`, config);
      console.log('response', response);
      if (response.data.status !== 'fail') setFieldList(response.data.data);
    } catch (error) {
      console.error('Failed to fetch FieldList:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber !== curPage) {
      if (searchTerm !== '') {
        navigate(`?q=${searchTerm}&page=${pageNumber}`);
        setCurPage(pageNumber);
        fetchQuestions(pageNumber, searchTerm);
      } else {
        navigate(`?page=${pageNumber}`);
        setCurPage(pageNumber);
        fetchQuestions(pageNumber);
      }
    }
  };

  const handleSearch = () => {
    if (searchTerm !== '') {
      navigate(`?q=${searchTerm}&page=1`);
      fetchQuestions(1, searchTerm);
    }
  };

  const handleFilter = () => {
    setAllFilters({
      status: status,
      level: level,
      field: field
    });

    const filteredQuestions = questions.filter(
      (question) => question.level.includes(level) && question.field.includes(field) && question.status.includes(status)
    );

    console.log('filters:', level, status, field);
    console.log('filter filtered:', filteredQuestions);
  };

  const handleFieldChange = (selectedOption) => {
    setField(selectedOption);
  };

  return (
    <div className={`${common.container}`}>
      <div className={`${common.head}`}>
        <h1>문제 목록</h1>
        <hr />
      </div>
      <QuestionsContainer>
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
              value={searchTerm && searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchButton onClick={handleSearch}>
              <BsSearch />
            </SearchButton>
          </SearchContainer>
        </HeadContainer>

        <FilterWrapper>
          <FilterButton2 onClick={() => setShowFilters(!showFilters)}>Filter</FilterButton2>
          {showFilters && (
            <>
              <div>
                <label>Status:</label>
                <label>
                  <input
                    type="radio"
                    value="all"
                    checked={status === 'all'}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  All
                </label>
                <label>
                  <input
                    type="radio"
                    value="pass"
                    checked={status === 'pass'}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Pass
                </label>
                <label>
                  <input
                    type="radio"
                    value="fail"
                    checked={status === 'fail'}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Fail
                </label>
                <label>
                  <input
                    type="radio"
                    value="none"
                    checked={status === 'none'}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  None
                </label>
              </div>
              <SquareContainer>
                <SquareItem
                  type="number"
                  placeholder="Level"
                  onChange={(e) => setLevel(e.target.value)}
                  min={1}
                  max={10}
                />
              </SquareContainer>
              <SelectItem placeholder={'분야'} options={fieldList} onChange={(e) => handleFieldChange(e)} isMulti />
              <button onClick={handleFilter}>Apply Filter</button>
            </>
          )}
        </FilterWrapper>

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
        <Pagination totalItems={size} onPageChange={handlePageChange} currentPage={curPage} itemsPerPage={pageSize} />
      </QuestionsContainer>
    </div>
  );
}

export default QuestionsPage;
