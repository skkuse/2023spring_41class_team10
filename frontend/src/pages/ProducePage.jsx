import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Select from 'react-select';

import styled from 'styled-components';
import {} from '../components';

const Container = styled.div`
  width: 90%;
  max-width: 1400px;
  margin: auto;
`;

const DescriptionContainer = styled.div`
  text-align: center;
  margin-bottom: 2vh;
`;

const TitleContainer = styled.div``;

const Titleh1 = styled.h1`
  margin: 0 auto;
  padding: 10px 0;
`;

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5vh;
`;

const Titleh2 = styled.h2`
  margin: 12px 0 0 0;
  padding: 0 10px;
`;

const TypingContainer = styled.textarea`
  width: 100%;
  border: 1px solid #e1e1e8;
  background-color: #f7f7f9;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  overflow: auto;
  outline: none;
  resize: none;
`;
const InputContainer = styled.div`
  label {
    display: block;
  }
  width: 100%;
`;

const TextareaDiv = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  text-align: start;
  width: 100%;
  background-color: white;
  border-radius: 3vw;
  padding: 10px 10px 0px 10px;
  min-height: 5vh;
  margin-bottom: 1vh;
`;

const Controllers = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
`;

const Button = styled.button`
  background-color: ${(props) => props.color};
  margin: 4px;
  padding: 4px 12px;
  font-size: 16px;
  float: right;
`;

const ProblemInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
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
`;

const WideSquareItem = styled(SquareItem)`
  flex: 2;
`;

const RightSquareItem = styled(SquareItem)`
  border-left: 1px solid #23272b;
`;

//백엔드 연결 전 테스트용 데이터
const data = {
  slug: '1',
  title: 'Test Problem',
  problemNumber: '1',
  problemCategory: 'I/O',
  problemLevel: '2',
  description: 'Description for Test Problem. You will see this description and learn about the problem.',
  programmingLanguage: 'C'
};

function Produce() {
  const [problemData, setProblemData] = useState({
    title: '',
    problemCategory: '',
    problemLevel: '',
    description: '',
    testCase: ''
  });
  const [fieldData, setFieldData] = useState([]);
  const [selectedFieldData, setSelectedFieldData] = useState([]);

  useEffect(() => {
    const fetchFieldList = async () => {
      try {
        const config = getHeader();
        const response = await axios.get(`http://127.0.0.1:8000/problems/v1/fields/list/`, config);
        console.log('response', response);
        if (response.data.status !== 'fail') setFieldData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch FieldList:', error);
      }
    };
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

  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    let tempdata = problemData;
    tempdata.title = e.target.value;
    setProblemData(tempdata);
  };
  const handleCategoryChange = (e) => {
    let tempdata = problemData;
    tempdata.problemCategory = e.target.value;
    setProblemData(tempdata);
  };
  const handleLevelChange = (e) => {
    let tempdata = problemData;
    data.problemLevel = e.target.value;
    setProblemData(tempdata);
  };
  const handleDescriptionChange = (e) => {
    let tempdata = problemData;
    tempdata.description = e.target.value;
    setProblemData(tempdata);
  };
  const handleTestcaseChange = (e) => {
    let tempdata = problemData;
    tempdata.testCase = e.target.value;
    setProblemData(tempdata);
  };

  const handleButtonClick = (e) => {
    console.log('button clicked ', e);
    if (e.target.value == 'Submit') {
      console.log('submit clicked ', e);
      postNewProblem();
    }
  };

  const handleSelectFeild = (e) => {
    console.log('handleSelectFeild ', e[0]);
    console.log('selectedFieldData', selectedFieldData);
    const dup = selectedFieldData.some((prev) => prev['value'] === e[0]['value']);
    if (!dup) {
      setSelectedFieldData(() => {
        console.log('selectedFieldData', selectedFieldData);
        return [...selectedFieldData, e[0]];
      });
    }
  };

  const postNewProblem = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post('http://127.0.0.1:8000/problems/v1/create', problemData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('response', response);
      if (response.status === 200) {
        console.log(response.data.message);
        navigate('/home');
      }
    } catch (error) {
      console.error('Failed to post new problem:', error);
    }
  };

  return (
    <Container>
      <DescriptionContainer>
        <TitleContainer>
          <Titleh1>문제 추가 (관리자)</Titleh1>
          <hr />
          <ProblemInfoContainer>
            <SquareContainer>
              <WideSquareItem type="text" placeholder="문제 제목" onChange={handleTitleChange} />
              <RightSquareItem type="number" placeholder="난이도" onChange={handleLevelChange} min={1} max={10} />
            </SquareContainer>
            {/* </ProblemInfoContainer> */}
            {/* <ProblemInfoContainer> */}
            <SelectItem
              placeholder={'분야'}
              options={fieldData}
              // value={selectedFieldData}
              onChange={(e) => handleSelectFeild(e)}
              isMulti
            />
          </ProblemInfoContainer>
        </TitleContainer>
      </DescriptionContainer>

      <ReviewContainer>
        <InputContainer>
          <Titleh2>문제 설명</Titleh2>
          <TextareaDiv>
            <TypingContainer placeholder="문제 설명 추가" onChange={handleDescriptionChange} rows={10} />
          </TextareaDiv>
        </InputContainer>
        <InputContainer>
          <Titleh2>테스트 케이스</Titleh2>
          <TextareaDiv>
            <TypingContainer placeholder="테스트 케이스 추가" onChange={handleTestcaseChange} rows={8} />
            <TypingContainer placeholder="테스트 정답 추가" onChange={handleTestcaseChange} rows={8} />
          </TextareaDiv>
        </InputContainer>
        <Controllers>
          <Button onClick={handleButtonClick} color={'#D9CFDE'}>
            {' '}
            Submit{' '}
          </Button>
        </Controllers>
      </ReviewContainer>
      <hr />
    </Container>
  );
}
export default Produce;
