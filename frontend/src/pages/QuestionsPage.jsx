import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { BsFilter, BsSearch } from 'react-icons/bs';
import Select from 'react-select';

import ProblemInfo from '../components/ProblemInfo';
import Pagination from '../components/Pagination';
import common from '../components/Common.module.css';

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

// Filter Sytle
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
`;

const Modal = styled.div`
  position: relative;
  width: auto;
  margin: auto;
  margin-top: 5rem;
  left: 0;
  width: 50%;
  height: 50vh;
  background-color: white;
  border: none;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  overflow: hidden;
  z-index: 2;
`;

const FlexSpaceDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const FlexColumnDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FlexRowDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0.25rem 1rem;
`;

const SquareContainer = styled.div`
  display: flex;
  border-radius: 4px;
  border: 1px solid #23272b;
  height: 26px;
  margin: 0.25rem 1rem;
  padding: 4px 8px;
  background-color: white;
`;
const SelectItem = styled(Select)`
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
  const [size, setSize] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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

  // Filter
  const [status, setStatus] = useState('all');
  const [level, setLevel] = useState(null);
  const [field, setField] = useState(null);
  const [allFilters, setAllFilters] = useState({
    status: 'all',
    level: 0,
    field: ''
  });
  const handleOpenFilter = () => {
    console.log('showFilters', showFilters);
    setShowFilters(true);
  };
  const handleCloseFilter = () => {
    console.log('showFilters', showFilters);
    setShowFilters(false);
  };
  const handleFieldChange = (selectedOption) => {
    setField(selectedOption);
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
  const handleStatus = (e) => {
    setStatus(e.target.value);
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
            <FilterButton onClick={handleOpenFilter}>
              <BsFilter />
            </FilterButton>
            {showFilters && (
              <ModalContainer>
                <Backdrop onClick={handleCloseFilter}></Backdrop>
                <Modal>
                  <FlexSpaceDiv>
                    <FlexColumnDiv>
                      <FlexRowDiv>
                        <span>Status:</span>
                        <label>
                          <input type="radio" value="all" checked={status === 'all'} onChange={handleStatus} />
                          전체
                        </label>
                        <label>
                          <input type="radio" value="pass" checked={status === 'pass'} onChange={handleStatus} />
                          완료
                        </label>
                        <label>
                          <input type="radio" value="fail" checked={status === 'fail'} onChange={handleStatus} />
                          진행중
                        </label>
                        <label>
                          <input type="radio" value="none" checked={status === 'none'} onChange={handleStatus} />
                          미완료
                        </label>
                      </FlexRowDiv>
                      <SquareContainer>
                        <SquareItem
                          type="number"
                          placeholder="Level"
                          onChange={(e) => setLevel(e.target.value)}
                          min={1}
                          max={10}
                        />
                      </SquareContainer>
                      <SelectItem
                        placeholder={'분야'}
                        options={fieldList}
                        onChange={(e) => handleFieldChange(e)}
                        isMulti
                      />
                    </FlexColumnDiv>
                    <FlexRowDiv>
                      <button onClick={handleCloseFilter}>닫기</button>
                      <button onClick={handleFilter}>필터링</button>
                    </FlexRowDiv>
                  </FlexSpaceDiv>
                </Modal>
              </ModalContainer>
            )}
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
