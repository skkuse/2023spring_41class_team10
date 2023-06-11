import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ReactAce from 'react-ace';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-monokai';

import {} from '../components';
import ProblemInfo from '../components/ProblemInfo';
import { useParams, useNavigate } from 'react-router-dom';
import common from '../components/Common.module.css';

const server_url = import.meta.env.VITE_SERVER_URL;

const Titleh3 = styled.h3`
  text-align: start;
  flex: 50%;
  margin-bottom: 0;
  padding: 10px 0;
`;

const DescriptionContainer = styled.div`
  padding: 1rem 2rem;
  text-align: center;
  margin-bottom: 2vh;
`;

const MoreDescriptionContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const ActualDescriptionContainer = styled.pre`
  background-color: white;
  border-radius: 1rem;
  padding: 16px;
  margin: 0 5px;
  text-align: left;
  font-size: 16px;
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
  height: 22px;
  width: 80px;
`;

const SolvingContainer = styled.div`
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5vh;
  gap: 1.5rem;
`;

// const TypingContainer = styled.textarea`
//   background-color: black;
//   color: white;
//   width: 100%;
//   margin-bottom: 1vh;
// `;

const ReactAceContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: pink;
`;

const TypingContainer = styled(ReactAce)`
  background-color: black;
  color: white;
  width: 100%;
  margin-bottom: 1vh;
  max-height: 400px;
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
  justify-content: space-between;
  width: 100%;
`;
const ActionButton = styled.div`
  display: flex;
  justify-content: center;
`;
const Button = styled.button`
  background-color: ${(props) => props.color};
  width: 60px;
  height: 30px;
  margin: 5px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const ExtendButton = styled.button`
  height: 30px;
  background-color: ${(props) => props.color};
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  gap: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const NextButton = styled(ExtendButton)`
  transform: translateX(5px);
  transition: all 0.3s infinity;
  animation: animate 2.2s infinite;
  @keyframes animate {
    0% {
      transform: translateX(0px);
    }
    30% {
      transform: translateX(0px);
    }
    40% {
      transform: translateX(8px);
    }
    50% {
      transform: translateX(0);
    }
    60% {
      transform: translateX(8px);
    }
    70% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(0);
    }
  }
`;
const PrevButton = styled(ExtendButton)`
  &:hover {
    transform: translateX(-5px);
    transition: all 0.3s;
  }
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
  font-size: 16px;
  width: 50%;
  max-height: 400px;
  overflow-y: scroll;
`;

const ProblemContainer = styled.div`
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
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
  const { slug } = useParams();
  const navigate = useNavigate();

  const [language, setLanguage] = useState('Python');
  const [codeTyped, setCodeTyped] = useState('Type your code here.');
  const [inputTyped, setInputTyped] = useState('Type your input here.');
  const [outputValue, setOutputValue] = useState('Default Output');

  const [problemInfo, setProblemInfo] = useState([]);
  const [pass, setPass] = useState(false);

  useEffect(() => {
    const fetchProblemInfo = async () => {
      try {
        const config = getHeader();
        const response = await axios.get(`${server_url}/problems/v1/${slug}/`, config);
        console.log('response', response);
        if (response.data.status !== 'fail') setProblemInfo(response.data.data);
      } catch (error) {
        if (error.response.status === 401) navigate('/login');
        else console.error('Failed to fetch questions:', error);
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

  const getModeFromLanguage = (language) => {
    switch (language) {
      case 'Python':
        return 'python';
      case 'C':
        return 'c_cpp';
      case 'C++':
        return 'c_cpp';
      case 'JAVA':
        return 'java';
      default:
        return 'python';
    }
  };

  const handleCodeChange = (newValue) => {
    setCodeTyped(newValue);
  };
  const handleInputChange = (newValue) => {
    setInputTyped(newValue);
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
    } else if (e.target.innerText == 'Review') {
      navigate('./review');
    }
  };
  const handleLoadCode = async () => {
    if (confirm('코드를 불러오면 현재 작성된 코드가 덮어씌워집니다. 불러오시겠습니까?')) {
      try {
        const config = getHeader();
        const response = await axios.get(`${server_url}/problems/v1/${slug}/load/`, config);
        console.log('response', response);
        if (response.data.status !== 'fail') {
          alert(response.data.message);
          setCodeTyped(response.data.data.code);
        } else alert(response.data.message);
      } catch (error) {
        if (error.response.status === 401) navigate('/login');
        else {
          console.error('Failed to Load Code:', error);
          alert('코드를 불러오는데 실패했습니다.');
        }
      }
    }
  };
  const handleSaveCode = async () => {
    if (confirm('코드를 저장하시겠습니까?')) {
      try {
        const config = getHeader();
        let data = { lang: language, code: codeTyped };
        console.log('data', data);
        const response = await axios.post(`${server_url}/problems/v1/${slug}/save/`, data, config);
        console.log('response', response);
        if (response.data.status !== 'fail') {
          alert(response.data.message);
        } else alert(response.data.message);
      } catch (error) {
        if (error.response.status === 401) navigate('/login');
        else {
          console.error('Failed to Save Code:', error);
          alert('코드 저장에 실패했습니다.');
        }
      }
    }
  };
  const handleRunCode = async () => {
    try {
      const config = getHeader();
      let data = { lang: language, code: codeTyped, tc_user: inputTyped };
      console.log('data', data);
      const response = await axios.post(`${server_url}/problems/v1/${slug}/exec/`, data, config);
      console.log('response', response);
      if (response.data.status !== 'fail') {
        alert(response.data.message);
        setOutputValue(response.data.data.result);
      } else alert(response.data.message);
    } catch (error) {
      if (error.response.status === 401) navigate('/login');
      else {
        console.error('Failed to Run Code:', error);
        alert('코드 실행에 실패했습니다.');
      }
    }
  };
  const handleSubmitCode = async () => {
    if (confirm('코드를 제출하시겠습니까?')) {
      try {
        const config = getHeader();
        let data = { lang: language, code: codeTyped };
        console.log('data', data);

        const response = await axios.post(`${server_url}/problems/v1/${slug}/submit/`, data, config);
        console.log('response', response);
        if (response.data.status !== 'fail') {
          alert(response.data.message);
          setOutputValue(response.data.data.result);
          setPass(true);
        } else alert(response.data.message);
      } catch (error) {
        if (error.response.status === 401) navigate('/login');
        else {
          console.error('Failed to Submit Code:', error);
          alert('코드 제출에 실패했습니다.');
        }
      }
    }
  };

  return (
    <div className={`${common.container}`}>
      <div className={`${common.head}`}>
        <h1>문제 풀이</h1>
        <hr />
      </div>
      <DescriptionContainer>
        {/* problem metadata component */}
        <ProblemContainer>
          <ProblemInfo
            problemNumber={slug}
            title={problemInfo.title}
            problemCategory={problemInfo.field}
            problemLevel={problemInfo.level}
            problemStatus={problemInfo.status}
            isActive={false}
          />
        </ProblemContainer>
        <Titleh3>문제 설명</Titleh3>
        <MoreDescriptionContainer>
          <ActualDescriptionContainer>{problemInfo.description}</ActualDescriptionContainer>
        </MoreDescriptionContainer>
      </DescriptionContainer>

      <DescriptionContainer>
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
      <div style={{ padding: '0 2rem' }}>
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
      </div>
      <SolvingContainer>
        <TypingContainer
          width={'100%'}
          mode={getModeFromLanguage(language)}
          theme="monokai"
          onChange={handleCodeChange}
          value={codeTyped}
          name="1"
          editorProps={{ $blockScrolling: true }}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            showLineNumbers: true,
            tabSize: 2
          }}
        />
        <InputOutputContainer>
          <InputContainer>
            <label>Input</label>
            <TypingContainer
              width={'100%'}
              mode="markdown"
              theme="monokai"
              onChange={handleInputChange}
              name="2"
              editorProps={{ $blockScrolling: true }}
              fontSize={14}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              setOptions={{
                showLineNumbers: true,
                tabSize: 2
              }}
            />
          </InputContainer>
          <OutputContainer>
            <label>Output</label>
            <TypingContainer
              width={'100%'}
              mode="markdown"
              theme="monokai"
              name="3"
              editorProps={{ $blockScrolling: true }}
              fontSize={14}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              value={outputValue}
              setOptions={{
                showLineNumbers: true,
                tabSize: 2
              }}
              readOnly={true}
            />
          </OutputContainer>
        </InputOutputContainer>
        <Controllers>
          <PrevButton onClick={handleButtonClick} color={'#D9CFDE '}>
            <BsArrowLeftShort />
            Back
          </PrevButton>
          <ActionButton>
            <Button onClick={handleButtonClick} color={'#C6DBDA'}>
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
            <Button onClick={handleButtonClick} color={'#FACFCF'}>
              {' '}
              Submit{' '}
            </Button>
          </ActionButton>
          <div>
            {(pass || problemInfo.status === 'complete') && (
              <NextButton onClick={handleButtonClick} color={'#A9A0FC'}>
                <span>Review</span>
                <BsArrowRightShort />
              </NextButton>
            )}
          </div>
        </Controllers>
      </SolvingContainer>
      <hr />
    </div>
  );
}
export default Problem;
