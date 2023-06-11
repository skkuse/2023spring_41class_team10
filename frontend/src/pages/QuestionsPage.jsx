import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { BsFilter, BsSearch } from 'react-icons/bs';
import Select from 'react-select';
import { FaSpinner } from 'react-icons/fa';

import ProblemInfo from '../components/ProblemInfo';
import Pagination from '../components/Pagination';
import common from '../components/Common.module.css';

const server_url = import.meta.env.VITE_SERVER_URL;

const QuestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const HeadContainer = styled.div`
  margin: 1rem;
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  flex-wrap: wrap;
`;

const StatusContainer = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
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
  margin: 0.5rem 0;
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
const LoadingContainer = styled.div`
  width: 328px;
  height: 328px;
  animation: spin 2s infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 50px;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(720deg);
    }
  }
`;

function QuestionsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') ? searchParams.get('q') : '');
  const [curPage, setCurPage] = useState(searchParams.get('page') ? searchParams.get('page') : 1);
  const [size, setSize] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoding] = useState(false);

  const fetchQuestions = async (cur, keyword = '') => {
    try {
      setLoding(true);
      const config = getHeader();
      let queryString = '';
      if (keyword) queryString += `?q=${keyword}`;
      if (cur && queryString) queryString += `&page=${cur}`;
      if (cur && !queryString) queryString += `?page=${cur}`;
      console.log('queryString', queryString);
      const response = await axios.get(`${server_url}/problems/v1/list/` + queryString, config);
      console.log('Questions', response);
      if (response.data.status !== 'fail') {
        setQuestions(response.data['data']);
        setSize(response.data['size']);
        setPageSize(response.data['page_size']);
        setLoding(false);
      }
    } catch (error) {
      setLoding(false);
      if (error.response.status === 401) navigate('/login');
      else console.error('Failed to fetch questions:', error);
    }
  };

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

  const fetchFieldList = async () => {
    try {
      const config = getHeader();
      const response = await axios.get(`${server_url}/problems/v1/fields/list/`, config);
      console.log('response', response);
      if (response.data.status !== 'fail') setFieldList(response.data.data);
    } catch (error) {
      if (error.response.status === 401) navigate('/login');
      else console.error('Failed to fetch FieldList:', error);
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
  const [showFilters, setShowFilters] = useState(false);
  const [status, setStatus] = useState('all');
  const [level, setLevel] = useState(0);
  const [selectedFieldData, setSelectedFieldData] = useState([]);
  const [fieldList, setFieldList] = useState([
    { value: '입출력', label: '입출력' },
    { value: '자료구조', label: '자료구조' },
    { value: '알고리즘', label: '알고리즘' }
  ]); // 백엔드 데이터 들어오기 전 기본 데이터

  const handleOpenFilter = () => {
    setShowFilters(true);
    setStatus('all');
    setLevel(0);
    setSelectedFieldData([]);
  };
  const handleCloseFilter = () => {
    setShowFilters(false);
  };
  const handleFieldChange = (e) => {
    setSelectedFieldData(e);
    console.log('selectedFieldData', selectedFieldData);
  };

  const handleFilter = () => {
    const data = {
      status: status,
      level: level,
      field: selectedFieldData.map((obj) => obj['value'])
    };
    if (searchTerm) {
      navigate(`?q=${searchTerm}&page=1`);
    } else {
      navigate(`?page=1`);
    }
    fetchFilterQuestions(data, 1, searchTerm);
    setShowFilters(false);
  };
  const fetchFilterQuestions = async (data, cur, keyword = '') => {
    try {
      setLoding(true);
      const config = getHeader();
      let queryString = '';
      if (keyword) queryString += `?q=${keyword}`;
      if (cur && queryString) queryString += `&page=${cur}`;
      if (cur && !queryString) queryString += `?page=${cur}`;
      console.log('queryString', queryString);
      console.log('data', data);

      const response = await axios.post(`${server_url}/problems/v1/list/` + queryString, data, config);
      console.log('FilterQuestions', response);
      if (response.data.status !== 'fail') {
        setQuestions(response.data['data']);
        setSize(response.data['size']);
        setPageSize(response.data['page_size']);
        setLoding(false);
      }
    } catch (error) {
      setLoding(false);
      if (error.response.status === 401) navigate('/login');
      else console.error('Failed to fetch FilterQuestions:', error);
    }
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
                        onChange={handleFieldChange}
                        value={selectedFieldData}
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

        {loading ? (
          <LoadingContainer>
            <FaSpinner />
          </LoadingContainer>
        ) : (
          questions.map((question) => (
            <ProblemInfo
              key={question.id}
              problemNumber={question.id}
              title={question.title}
              problemCategory={question.field}
              problemLevel={question.level}
              problemStatus={question.status}
            />
          ))
        )}
        <Pagination totalItems={size} onPageChange={handlePageChange} currentPage={curPage} itemsPerPage={pageSize} />
      </QuestionsContainer>
    </div>
  );
}

export default QuestionsPage;
