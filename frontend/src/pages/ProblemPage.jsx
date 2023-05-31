import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {} from '../components';
import { useProblemQuery } from '../hooks';
import ProblemInfo from '../components/ProblemInfo';
import { useParams } from 'react-router-dom';
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

const LanguageDiv = styled.div`
  background-color: black;
  color: white;
  padding: 2px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
  height: 16px;
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

function Problem() {
  //const { data } = useProblemQuery() // 나중에 백엔드 연결하면 바꾸기
  const { slug } = useParams();

  const [codeTyped, setCodeTyped] = useState('Type your code here.');
  const [inputTyped, setInputTyped] = useState('Type your input here.');
  const [outputValue, setOutputValue] = useState('Default Output');

  const [problemInfo, setProblemInfo] = useState([]);
  useEffect(() => {
    const fetchProblemInfo = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`http://127.0.0.1:8000/problems/v1/${slug}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('response', response);
        if (response.data.status !== 'fail') setProblemInfo(response.data);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };
    fetchProblemInfo();
  }, []);

  const handleCodeChange = (e) => {
    setCodeTyped(e.target.value);
  };
  const handleInputChange = (e) => {
    setInputTyped(e.target.value);
  };
  const handleButtonClick = (e) => {
    console.log('button clicked ', e);
    if (e.target.innerText == 'Back') {
      // Go back page
      console.log('back clicked');
    } else if (e.target.innerText == 'Run') {
      // Run Code
      console.log('run clicked');
    } else if (e.target.innerText == 'Stop') {
      // Stop running code
      console.log('stop clicked');
    } else if (e.target.innerText == 'Submit') {
      // Submit code
      console.log('submit clicked');
    }
  };

  return (
    <Container>
      <DescriptionContainer>
        <TitleContainer>
          <Titleh1>문제 풀이</Titleh1>
          <hr style={{ height: '3px' }} />
          {/* problem metadata component */}
          <p>
            | #{slug} | {problemInfo.title} | {problemInfo.field} | {problemInfo.level} |
          </p>
          <LeftAlign>
            <ChooseLanguageContainer>
              <LangDiv>언어 선택</LangDiv>
              <LanguageDiv> C </LanguageDiv>
            </ChooseLanguageContainer>
          </LeftAlign>
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
          <Button onClick={handleButtonClick} color={'#FEF0D6'}>
            {' '}
            Run{' '}
          </Button>
          <Button onClick={handleButtonClick} color={'#FACFCF'}>
            {' '}
            Stop{' '}
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
