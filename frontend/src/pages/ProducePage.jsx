import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Select from 'react-select';

import styled from 'styled-components';
import {} from '../components';
import common from '../components/Common.module.css';

const DescriptionContainer = styled.div`
  padding: 2rem;
  text-align: center;
  margin-bottom: 2vh;
`;

const Titleh2 = styled.h2`
  margin: 12px 0 0 0;
  padding: 0 10px;
  text-align: start;
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
const TestcaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TCButtonContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: 1rem;
`;
const TextareaDiv = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  text-align: start;
  width: 100%;
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
  padding: 2rem;
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

const FlexDiv = styled.div`
  display: flex;
  justify-content: end;
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
    level: '',
    field: [],
    description: '',
    tc: []
  });
  const [fieldData, setFieldData] = useState([]);
  const [selectedFieldData, setSelectedFieldData] = useState([]);
  const [testcaseData, setTestcaseData] = useState([{ testcase: '', result: '', is_sample: false }]);
  const [testcaseCount, setTestcaseCount] = useState(1);

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
  const handleLevelChange = (e) => {
    let tempdata = problemData;
    tempdata['level'] = e.target.value;
    setProblemData(tempdata);
  };
  const handleDescriptionChange = (e) => {
    let tempdata = problemData;
    tempdata['description'] = e.target.value;
    setProblemData(tempdata);
  };

  // Testcase 입력 관련
  const handleTestcaseChange = (e, i) => {
    let updated = [...testcaseData];
    if (i >= testcaseData.length) updated.push({ testcase: '', result: '', is_sample: true });
    updated[i].testcase = e.target.value;
    setTestcaseData(updated);
  };
  const handleResultChange = (e, i) => {
    let updated = [...testcaseData];
    if (i >= testcaseData.length) updated.push({ testcase: '', result: '', is_sample: false });
    updated[i].result = e.target.value;
    setTestcaseData(updated);
  };
  const handleSampleChange = (e, i) => {
    let updated = [...testcaseData];
    if (i >= testcaseData.length) updated.push({ testcase: '', result: '', is_sample: false });
    updated[i].is_sample = e.currentTarget.checked;
    setTestcaseData(updated);
  };

  const handleSubmitButtonClick = (e) => {
    let updated = problemData;
    // Testcase 업데이트
    updated.tc = testcaseData;
    // Field 데이터 업데이트
    updated.field = selectedFieldData.map((obj) => obj.value);
    setProblemData(updated);
    postNewProblem();
  };

  const handleAddButtonClick = (e) => {
    setTestcaseCount(testcaseCount + 1);
    let updated = [...testcaseData, { testcase: '', result: '', is_sample: false }];
    setTestcaseData(updated);
  };

  const handleRemoveButtonClick = (e) => {
    if (testcaseCount > 1) {
      setTestcaseCount(testcaseCount - 1);
      let updated = [...testcaseData];
      updated.pop();
      setTestcaseData(updated);
    }
  };

  const handleSelectFeild = (e) => {
    const dup = selectedFieldData.some((prev) => prev['value'] === e[0]['value']);
    if (!dup) setSelectedFieldData([...selectedFieldData, e[0]]);
  };

  const postNewProblem = async () => {
    try {
      console.log('problemData req', problemData);
      const config = getHeader();
      const response = await axios.post('http://127.0.0.1:8000/problems/v1/create/', problemData, config);
      console.log('postNewProblem res', response);
      if (response.status === 200) {
        alert(response.data.message);
        if (response.data.status !== 'fail') navigate('/home');
      }
    } catch (error) {
      console.error('Failed to post new problem:', error);
    }
  };

  return (
    <div className={`${common.container}`}>
      <div className={`${common.head}`}>
        <h1>문제 추가 (관리자)</h1>
        <hr />
      </div>
      <ProblemInfoContainer>
        <SquareContainer>
          <WideSquareItem type="text" placeholder="문제 제목" onChange={handleTitleChange} />
          <RightSquareItem type="number" placeholder="난이도" onChange={handleLevelChange} min={1} max={10} />
        </SquareContainer>
        <SelectItem
          placeholder={'분야'}
          options={fieldData}
          // value={selectedFieldData}
          onChange={(e) => handleSelectFeild(e)}
          isMulti
        />
      </ProblemInfoContainer>
      <DescriptionContainer>
        <InputContainer>
          <Titleh2>문제 설명</Titleh2>
          <TextareaDiv>
            <TypingContainer placeholder="문제 설명 추가" onChange={handleDescriptionChange} rows={10} />
          </TextareaDiv>
        </InputContainer>
        <InputContainer>
          <TestcaseHeader>
            <Titleh2>테스트 케이스</Titleh2>
            <TCButtonContainer>
              <Button type="button" onClick={handleRemoveButtonClick} color={'#FACFCF'}>
                {' '}
                Remove{' '}
              </Button>
              <Button type="button" onClick={handleAddButtonClick} color={'#AED5F8'}>
                {' '}
                Add{' '}
              </Button>
            </TCButtonContainer>
          </TestcaseHeader>
          {[...Array(testcaseCount)].map((_, i) => (
            <div key={i + 1}>
              <FlexDiv>
                <input id={`check-${i}`} type="checkbox" onChange={(e) => handleSampleChange(e, i)} />
                <label htmlFor={`check-${i}`}>샘플</label>
              </FlexDiv>
              <TextareaDiv>
                <TypingContainer
                  placeholder={`테스트 케이스 #${i + 1}`}
                  onChange={(e) => handleTestcaseChange(e, i)}
                  rows={8}
                />
                <TypingContainer
                  placeholder={`테스트 정답 #${i + 1}`}
                  onChange={(e) => handleResultChange(e, i)}
                  rows={8}
                />
              </TextareaDiv>
            </div>
          ))}
        </InputContainer>
        <Controllers>
          <Button type="button" onClick={handleSubmitButtonClick} color={'#D9CFDE'}>
            {' '}
            Submit{' '}
          </Button>
        </Controllers>
      </DescriptionContainer>
      <hr />
    </div>
  );
}
export default Produce;
