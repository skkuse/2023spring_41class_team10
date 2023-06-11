import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { BsRobot } from 'react-icons/bs';
import { FaSpinner } from 'react-icons/fa';

import { ProblemInfo } from '../components';
import common from '../components/Common.module.css';

const server_url = import.meta.env.VITE_SERVER_URL;

const DescriptionContainer = styled.div`
  text-align: center;
  margin-bottom: 2vh;
`;

const ProblemContainer = styled.div`
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const MoreDescriptionContainer = styled.div`
  display: flex;
  justify-content: right;
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
  font-size: 12px;
  font-weight: bold;
  height: 22px;
  width: 80px;
`;

const ReviewContainer = styled.div`
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
  resize: none;
`;

const Titleh2 = styled.h2`
  margin: 5px 0;
  text-align: start;
`;

const CodeCompareContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const OriginalCodeContainer = styled.div`
  label {
    display: block;
  }
  width: 100%;
  margin-right: 4vw;
`;

const FeedbackContainer = styled.div`
  label {
    display: block;
  }
  width: 100%;
`;

const CodeReviewContainer = styled.div`
  label {
    display: block;
  }
  width: 100%;
`;

const CodeReviewDiv = styled.pre`
  background-color: white;
  border-radius: 1rem;
  padding: 16px;
  min-height: 15vh;
  margin-bottom: 1.5rem;
  font-family: Inter, system-ui, sans-serif;
  white-space: pre-wrap;
  word-break: normal;
  word-wrap: normal;
`;

const Controllers = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ActionButton = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  background-color: ${(props) => props.color};
  width: 60px;
  height: 30px;
  margin: 5px;
  font-size: 14px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const PrevButton = styled(Button)`
  &:hover {
    transform: translateX(-5px);
    transition: all 0.3s;
  }
`;
const LongButton = styled.button`
  background-color: ${(props) => props.color};
  width: 130px;
  height: 30px;
  margin: 5px;
  font-size: 14px;
  padding: 0.25rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FaSpinnerBlock = styled.div`
  display: flex;
  align-items: center;
  animation: spin 2s infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(720deg);
    }
  }
`;

//백엔드 연결 전 테스트용 데이터
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

const reviewData = {
  originalCode: '(test)\nint main() {\n\tprintf("Hello World");\n}',
  feedbackCode: '(test)\nint main() {\n\tprintf("Hello World");\n\treturn 0;\n}',
  review:
    '(test) 당신의 코드는 마치 바보가 쓴 것과 같습니다.\n기본적으로 C언어에서 Hello World를 출력하기 위해서는 심윤보 님이 사용하신 코드와 같은 형식을 이용하면 되지만, int main이 끝날 때 return 0를 해주는 것이 좋습니다.'
};

function Review() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [{ code, message }, setGPTReview] = useState({ code: '', message: '' });
  const [submissionData, setSubmissionData] = useState([]);
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    const fetchProblemInfo = async () => {
      try {
        const config = getHeader();
        const response = await axios.get(`${server_url}/users/v1/problems/${slug}/`, config);
        console.log('response', response);
        if (response.data.status !== 'fail') {
          setSubmissionData(response.data.data);
        }
      } catch (error) {
        if (error.response.status === 401) navigate('/login');
        else console.error('Failed to fetch submission:', error);
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

  const handleButtonClick = (e) => {
    if (e.target.innerText == 'Back') {
      navigate(`/problem/${slug}`);
    } else if (e.target.innerText == 'Save') {
      if (code.trim() === '') {
        alert('ChatGPT의 코드가 없습니다.');
        return;
      }
      if (confirm('ChatGPT가 작성한 코드를 저장하시겠습니까?')) {
        postSaveCode();
      }
    }
  };
  const postSaveCode = async () => {
    try {
      const config = getHeader();
      let data = { lang: submissionData.lang, code: code };
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
  };

  const handleCodeReview = async () => {
    if (loading == 0) {
      try {
        setLoading(1);
        const config = getHeader();
        const data = {
          lang: submissionData.lang,
          code: submissionData.code,
          problem: submissionData.description,
          submission_id: submissionData.submission_id
        };
        const response = await axios.post(`${server_url}/codes/v1/review/`, data, config);
        console.log('response', response);
        setGPTReview(response.data);
        setLoading(0);
      } catch (error) {
        if (error.response.status === 401) navigate('/login');
        else console.error('Failed to fetch review:', error);
        setLoading(0);
      }
    }
  };
  const handleCodeRefactor = async () => {
    if (loading == 0) {
      try {
        setLoading(2);
        const config = getHeader();
        const data = {
          lang: submissionData.lang,
          code: submissionData.code,
          problem: submissionData.description,
          submission_id: submissionData.submission_id
        };
        const response = await axios.post(`${server_url}/codes/v1/refactoring/`, data, config);
        console.log('response', response.data);
        setGPTReview(response.data);
        setLoading(0);
      } catch (error) {
        if (error.response.status === 401) navigate('/login');
        else console.error('Failed to fetch refactoring:', error);
        setLoading(0);
      }
    }
  };
  const handleCodeComment = async () => {
    if (loading == 0) {
      try {
        setLoading(3);
        const config = getHeader();
        const data = {
          lang: submissionData.lang,
          code: submissionData.code,
          problem: submissionData.description,
          submission_id: submissionData.submission_id
        };
        const response = await axios.post(`${server_url}/codes/v1/comment/`, data, config);
        console.log('response', response);
        setGPTReview(response.data);
        setLoading(0);
      } catch (error) {
        if (error.response.status === 401) navigate('/login');
        else console.error('Failed to fetch comment:', error);
        setLoading(0);
      }
    }
  };
  const handleDeadCode = async () => {
    if (loading == 0) {
      try {
        setLoading(4);
        const config = getHeader();
        const data = {
          lang: submissionData.lang,
          code: submissionData.code,
          problem: submissionData.description,
          submission_id: submissionData.submission_id
        };
        const response = await axios.post(`${server_url}/codes/v1/deadcode/`, data, config);
        console.log('response', response);
        setGPTReview(response.data);
        setLoading(0);
      } catch (error) {
        if (error.response.status === 401) navigate('/login');
        else console.error('Failed to fetch deadcode:', error);
        setLoading(0);
      }
    }
  };
  return (
    <div className={`${common.container}`}>
      <div className={`${common.head}`}>
        <h1>코드 리뷰</h1>
        <hr />
      </div>

      <DescriptionContainer>
        {/* problem metadata component */}
        <ProblemContainer>
          <ProblemInfo
            problemNumber={slug}
            title={submissionData.title}
            problemCategory={Array.isArray(submissionData.field) ? submissionData.field.join(', ') : ''}
            problemLevel={submissionData.level}
            problemStatus="complete"
            isActive={false}
          />
        </ProblemContainer>
        <MoreDescriptionContainer>
          <ChooseLanguageContainer>
            <LangDiv>선택한 언어</LangDiv>
            <LanguageDiv> {submissionData.lang} </LanguageDiv>
          </ChooseLanguageContainer>
        </MoreDescriptionContainer>
      </DescriptionContainer>

      <ReviewContainer>
        <CodeCompareContainer>
          <OriginalCodeContainer>
            <h3>내가 쓴 코드</h3>
            <TypingContainer value={submissionData.code} rows={15} readOnly={true} />
          </OriginalCodeContainer>
          <FeedbackContainer>
            <h3>ChatGPT의 코드</h3>
            <TypingContainer value={code} rows={15} readOnly={true} />
          </FeedbackContainer>
        </CodeCompareContainer>
        <CodeReviewContainer>
          <h3>ChatGPT의 답변</h3>
          <CodeReviewDiv>{message}</CodeReviewDiv>
        </CodeReviewContainer>
        <Controllers>
          <PrevButton onClick={handleButtonClick} color={'#D9CFDE'}>
            {' '}
            Back{' '}
          </PrevButton>
          <ActionButton>
            <LongButton onClick={handleCodeReview} color={'#C6DBDA'}>
              {' '}
              {loading == 1 ? (
                <FaSpinnerBlock>
                  <FaSpinner />
                </FaSpinnerBlock>
              ) : (
                <BsRobot />
              )}
              &nbsp; Code Review{' '}
            </LongButton>
            <LongButton onClick={handleCodeRefactor} color={'#FEF0D6'}>
              {' '}
              {loading == 2 ? (
                <FaSpinnerBlock>
                  <FaSpinner />
                </FaSpinnerBlock>
              ) : (
                <BsRobot />
              )}
              &nbsp; Refactoring{' '}
            </LongButton>
            <LongButton onClick={handleCodeComment} color={'#AED5F8'}>
              {' '}
              {loading == 3 ? (
                <FaSpinnerBlock>
                  <FaSpinner />
                </FaSpinnerBlock>
              ) : (
                <BsRobot />
              )}
              &nbsp; Comment{' '}
            </LongButton>
            <LongButton onClick={handleDeadCode} color={'#FACFCF'}>
              {' '}
              {loading == 4 ? (
                <FaSpinnerBlock>
                  <FaSpinner />
                </FaSpinnerBlock>
              ) : (
                <BsRobot />
              )}
              &nbsp; Dead Code{' '}
            </LongButton>
          </ActionButton>
          <Button onClick={handleButtonClick} color={'#A9A0FC'}>
            {' '}
            Save{' '}
          </Button>
        </Controllers>
      </ReviewContainer>
      <hr />
    </div>
  );
}
export default Review;
