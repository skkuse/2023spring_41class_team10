import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {} from '../components';
import { useProblemQuery } from '../hooks';
import ProblemInfo from '../components/ProblemInfo';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Container = styled.div`
  width: 90%;
  max-width: 1400px;
  margin: auto;
`;

const DescriptionContainer = styled.div`
  text-align: center;
  margin-bottom: 2vh;
`;

const TitleContainer = styled.div`
  margin-bottom: 2rem;
`;

const Titleh1 = styled.h1`
  margin: 0 auto;
  padding: 10px 0;
`;

const Titleh3 = styled.h3`
  flex: 50%;
  margin-bottom: 0;
  padding: 10px 0;
`;

const MoreDescriptionContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const ActualDescriptionContainer = styled.pre`
  margin: 0 5px;
  text-align: left;
  font-size: 18px;
  font-family: Inter, system-ui, sans-serif;
  flex: 100%;
  white-space: pre-wrap;
  word-break: normal;
  word-wrap: normal;
`;
const LeftAlign = styled.div`
  display: flex;
  justify-content: end;
  margin-bottom: 8px;
`;
const ChooseLanguageContainer = styled.div`
  display: flex;
  background-color: #cccccc;
  padding: 4px;
  margin: 0 5px;
  border-radius: 4px;
  width: 180px;
  height: 30px;
  align-items: center;
  justify-content: space-around;
`;
const LangDiv = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const LanguageDiv = styled.select`
  background-color: black;
  color: white;
  padding: 2px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  height: 24px;
  width: 80px;
`;

const SolvingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5vh;
`;

const TypingContainer = styled.textarea`
  background-color: black;
  color: white;
  width: 100%;
  margin-bottom: 1vh;
`;

const InputOutputContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const InputContainer = styled.div`
  label {
    display: block;
  }
  width: 100%;
  margin-right: 2vw;
`;

const OutputContainer = styled.div`
  label {
    display: block;
  }
  width: 100%;
`;

const Controllers = styled.div`
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  background-color: ${(props) => props.color};
  width: 60px;
  height: 30px;
  margin: 5px;
  font-size: 15px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const TestCaseArea = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  text-align: start;
`;

const TestCase = styled.pre`
  overflow-x: scroll;
  border: 1px solid #e1e1e8;
  background-color: #f7f7f9;
  padding: 1rem;
  font-family: consolas;
  font-size: 18px;
  width: 50%;
`;

//백엔드 없을 때 테스트용 데이터
const tempdate1 = new Date(2023, 5, 26, 15, 55, 5).toDateString();
const data = {
  title: 'Test Problem',
  problemNumber: '1',
  problemCategory: 'I/O',
  problemLevel: '2',
  description: 'Description for Test Problem. You will see this description and learn about the problem.',
  programmingLanguage: 'C',
  createdAt: tempdate1,
  updatedAt: tempdate1
};

function Problem() {
  //const { data } = useProblemQuery() // 나중에 백엔드 연결하면 바꾸기
  const { slug } = useParams();
  const navigate = useNavigate();

  const [language, setLanguage] = useState('Python');
  const [codeTyped, setCodeTyped] = useState('Type your code here.');
  const [inputTyped, setInputTyped] = useState('Type your input here.');
  const [outputValue, setOutputValue] = useState('Default Output');

  const [problemInfo, setProblemInfo] = useState([]);
  useEffect(() => {
    const fetchProblemInfo = async () => {
      try {
        const config = getHeader();
        const response = await axios.get(`http://127.0.0.1:8000/problems/v1/${slug}/`, config);
        console.log('response', response);
        if (response.data.status !== 'fail') setProblemInfo(response.data.data);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };
    fetchProblemInfo();
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

  const handleCodeChange = (e) => {
    setCodeTyped(e.target.value);
  };
  const handleInputChange = (e) => {
    setInputTyped(e.target.value);
  };
  const handleLanguageSelect = (e) => {
    // 선택한 언어에 대한 동작 수행
    setLanguage(e.target.value);
    console.log(`Selected language: ${e.target.value}`);
  };
  const handleButtonClick = (e) => {
    console.log('button clicked ', e);
    if (e.target.innerText == 'Back') {
      // Go back page
      console.log('back clicked');
      navigate('/questions');
    } else if (e.target.innerText == 'Load') {
      // Load Code
      console.log('load clicked');
      handleLoadCode();
    } else if (e.target.innerText == 'Run') {
      // Run Code
      console.log('run clicked');
      handleRunCode();
    } else if (e.target.innerText == 'Save') {
      // Save running code
      console.log('stop clicked');
      handleSaveCode();
    } else if (e.target.innerText == 'Submit') {
      // Submit code
      console.log('submit clicked');
      handleSubmitCode();
    }
  };
  const handleLoadCode = async () => {
    if (confirm('코드를 불러오면 현재 작성된 코드가 덮어씌워집니다. 불러오시겠습니까?')) {
      try {
        const config = getHeader();
        const response = await axios.get(`http://127.0.0.1:8000/problems/v1/${slug}/load/`, config);
        console.log('response', response);
        if (response.data.status !== 'fail') {
          alert(response.data.message);
          setCodeTyped(response.data.data.code);
        } else alert(response.data.message);
      } catch (error) {
        console.error('Failed to Load Code:', error);
        alert('Fail to Load Code');
      }
    }
  };
  const handleSaveCode = async () => {
    if (confirm('코드를 저장하시겠습니까?')) {
      try {
        const config = getHeader();
        let data = { lang: language, code: codeTyped };
        console.log('data', data);
        const response = await axios.post(`http://127.0.0.1:8000/problems/v1/${slug}/save/`, data, config);
        console.log('response', response);
        if (response.data.status !== 'fail') {
          alert(response.data.message);
        } else alert(response.data.message);
      } catch (error) {
        console.error('Failed to Run Code:', error);
        alert('Fail to Run Code');
      }
    }
  };
  const handleRunCode = async () => {
    try {
      const config = getHeader();
      let data = { lang: language, code: codeTyped, tc_user: inputTyped };
      console.log('data', data);
      const response = await axios.post(`http://127.0.0.1:8000/problems/v1/${slug}/exec/`, data, config);
      console.log('response', response);
      if (response.data.status !== 'fail') {
        alert(response.data.message);
        setOutputValue(response.data.data.result);
      } else alert(response.data.message);
    } catch (error) {
      console.error('Failed to Run Code:', error);
      alert('Fail to Run Code');
    }
  };
  const handleSubmitCode = async () => {
    if (confirm('코드를 제출하시겠습니까?')) {
      try {
        const config = getHeader();
        let data = { lang: language, code: codeTyped };
        console.log('data', data);

        const response = await axios.post(`http://127.0.0.1:8000/problems/v1/${slug}/submit/`, data, config);
        console.log('response', response);
        if (response.data.status !== 'fail') {
          alert(response.data.message);
          setOutputValue(response.data.data.result);
        } else alert(response.data.message);
      } catch (error) {
        console.error('Failed to Run Code:', error);
        alert('Fail to Run Code');
      }
    }
  };

  return (
    <Container>
      <DescriptionContainer>
        <TitleContainer>
          <Titleh1>문제 풀이</Titleh1>
          <hr />
          {/* problem metadata component */}
          {/* <p>
            | #{slug} | {problemInfo.title} | {problemInfo.field} | {problemInfo.level} |
          </p> */}
          <ProblemInfo
            problemNumber={slug}
            title={problemInfo.title}
            problemCategory={problemInfo.field}
            problemLevel={problemInfo.level}
            isActive={false}
          />

          <MoreDescriptionContainer>
            <ActualDescriptionContainer>
              &lt;문제설명&gt;<br></br>
              {problemInfo.description}
            </ActualDescriptionContainer>
          </MoreDescriptionContainer>
        </TitleContainer>
        {problemInfo.tc_sample && (
          <TestCaseArea>
            <Titleh3>예제</Titleh3>
            <Titleh3>출력값</Titleh3>
          </TestCaseArea>
        )}
        {problemInfo.tc_sample &&
          problemInfo.tc_sample.map((item, index) => (
            <TestCaseArea key={index}>
              <TestCase>{item.testcase}</TestCase>
              <TestCase>{item.result}</TestCase>
            </TestCaseArea>
          ))}
      </DescriptionContainer>
      <LeftAlign>
        <ChooseLanguageContainer>
          <LangDiv>언어 선택</LangDiv>
          <LanguageDiv onChange={(val) => handleLanguageSelect(val)}>
            <option>Python</option>
            <option>C</option>
            <option>C++</option>
            <option>JAVA</option>
          </LanguageDiv>
        </ChooseLanguageContainer>
      </LeftAlign>
      <SolvingContainer>
        <TypingContainer value={codeTyped} onChange={handleCodeChange} rows={20} />
        <InputOutputContainer>
          <InputContainer>
            <label>Input</label>
            <TypingContainer value={inputTyped} onChange={handleInputChange} rows={10} />
          </InputContainer>
          <OutputContainer>
            <label>Output</label>
            <TypingContainer value={outputValue} rows={10} readOnly={true} />
          </OutputContainer>
        </InputOutputContainer>
        <Controllers>
          <Button onClick={handleButtonClick} color={'#C6DBDA'}>
            {' '}
            Back{' '}
          </Button>
          <Button onClick={handleButtonClick} color={'#FACFCF'}>
            {' '}
            Load{' '}
          </Button>
          <Button onClick={handleButtonClick} color={'#FEF0D6'}>
            {' '}
            Run{' '}
          </Button>
          <Button onClick={handleButtonClick} color={'#AED5F8 '}>
            {' '}
            Save{' '}
          </Button>
          <Button onClick={handleButtonClick} color={'#D9CFDE'}>
            {' '}
            Submit{' '}
          </Button>
        </Controllers>
      </SolvingContainer>
      <hr />
    </Container>
  );
}
export default Problem;
