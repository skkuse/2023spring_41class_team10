import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useProfileQuery } from '../hooks';
import styled from 'styled-components';

const NoticeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f2f2f2;
`;

const TitleContainer = styled.div`
  margin-bottom: 2rem;
`;

const Titleh1 = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const NoticeButton = styled.button`
  padding: 0.5rem 1rem;
`;

const FAQButton = styled.button`
  padding: 0.5rem 1rem;
`;

const ContentContainer = styled.div`
  width: 800px;
  padding: 1rem;
`;

const DropBoxContainer = styled.div`
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  margin: 2rem;
  cursor: pointer;
  border: 2px solid #ccc;
  padding: 10px;
  background-color: white;
`;

const DropBox = styled.textarea`
  width: 800px;
  height: auto;
  border: none;
  background-color: transparent;
`;



const QuestionContainer = styled.div`
  margin-bottom: 1rem;
`;

function NoticePage() {
  const { authUser } = useAuth();
  const [toast, setToast] = useState(false);
  const [showNoticeContent, setShowNoticeContent] = useState(false);
  const [showFAQContent, setShowFAQContent] = useState(false);
  const [faqDescriptions, setFAQDescriptions] = useState({});
  const [noticeDescriptions, setNoticeDescriptions] = useState({});

  const handleNoticeClick = () => {
    setShowNoticeContent(!showNoticeContent);
    setShowFAQContent(false);
  };

  const handleFAQClick = () => {
    setShowFAQContent(!showFAQContent);
    setShowNoticeContent(false);
  };

  const handleNoticeItemClick = (noticeId) => {
    setNoticeDescriptions((prevDescriptions) => {
      const updatedDescriptions = { ...prevDescriptions };
      if (updatedDescriptions[noticeId]) {
        delete updatedDescriptions[noticeId];
      } else {
        const descriptions = {
          1: 'This is Notice 1 description.',
          2: 'This is Notice 2 description.',
          3: 'This is Notice 3 description.',
          4: 'This is Notice 4 description.'
        };
        updatedDescriptions[noticeId] = descriptions[noticeId];
      }
      return updatedDescriptions;
    });
  };

  const handleFAQItemClick = (faqId) => {
    setFAQDescriptions((prevDescriptions) => {
      const updatedDescriptions = { ...prevDescriptions };
      if (updatedDescriptions[faqId]) {
        delete updatedDescriptions[faqId];
      } else {
        const descriptions = {
          1: 'This is FAQ 1 description.',
          2: 'This is FAQ 2 description.',
          3: 'This is FAQ 3 description.',
        };
        updatedDescriptions[faqId] = descriptions[faqId];
      }
      return updatedDescriptions;
    });
  };


  return (
    <NoticeContainer>
      <TitleContainer>
        <Titleh1>고객센터</Titleh1>
        <hr style={{ height: '3px' }} />
      </TitleContainer>
      <ButtonContainer>
        <NoticeButton onClick={handleNoticeClick}>
            공지사항
        </NoticeButton>
        <FAQButton onClick={handleFAQClick}>
          FAQ
        </FAQButton>
      </ButtonContainer>
      {showNoticeContent && (
        <ContentContainer>
          <h2>Notice</h2>
          <DropBoxContainer onClick={() => handleNoticeItemClick(1)}>2023년 8월 29일 사이트 개편 안내</DropBoxContainer>
            {noticeDescriptions[1] && (
            <QuestionContainer>
                <DropBox value={noticeDescriptions[1]} />
            </QuestionContainer>
            )}

            <DropBoxContainer onClick={() => handleNoticeItemClick(2)}>2023년  'Chat GPT 열풍'에 따른 BePro 자료 사용 안내</DropBoxContainer>
            {noticeDescriptions[2] && (
            <QuestionContainer>
                <DropBox value={noticeDescriptions[2]} />
            </QuestionContainer>
            )}

            <DropBoxContainer onClick={() => handleNoticeItemClick(3)}>[BePro] 개인정보처리방침 개정 안내(2023.04.01)</DropBoxContainer>
            {noticeDescriptions[3] && (
            <QuestionContainer>
                <DropBox value={noticeDescriptions[3]} />
            </QuestionContainer>
            )}

            <DropBoxContainer onClick={() => handleNoticeItemClick(4)}>인터넷 익스플로러(IE) 종료로 인한 권장 브라우저 안내</DropBoxContainer>
            {noticeDescriptions[4] && (
            <QuestionContainer>
                <DropBox value={noticeDescriptions[4]} />
            </QuestionContainer>
            )}
        </ContentContainer>
      )}
      {showFAQContent && (
        <ContentContainer>
            <h2>FAQ</h2>
            <DropBoxContainer onClick={() => handleFAQItemClick(1)}>로그인 오류가 나요.</DropBoxContainer>
            {faqDescriptions[1] && (
            <QuestionContainer>
                <DropBox value={faqDescriptions[1]} />
            </QuestionContainer>
            )}

            <DropBoxContainer onClick={() => handleFAQItemClick(2)}>오류발생</DropBoxContainer>
            {faqDescriptions[2] && (
            <QuestionContainer>
                <DropBox value={faqDescriptions[2]} />
            </QuestionContainer>
            )}

            <DropBoxContainer onClick={() => handleFAQItemClick(3)}>회원가입 오류가 나요.</DropBoxContainer>
            {faqDescriptions[3] && (
            <QuestionContainer>
                <DropBox value={faqDescriptions[3]} />
            </QuestionContainer>
            )}
        </ContentContainer>
        )}

    </NoticeContainer>
  );
}

export default NoticePage;
