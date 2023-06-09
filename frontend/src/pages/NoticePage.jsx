import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import common from '../components/Common.module.css';

const server_url = import.meta.env.VITE_SERVER_URL;

const NoticeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f2f2f2;
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
  padding: 1rem 3rem;
`;

const DropBoxContainer = styled.div`
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  margin: 1.5rem 0 0 0;
  cursor: pointer;
  border: 2px solid #ccc;
  padding: 10px;
  background-color: white;
  &:hover {
    background-color: #d3d4d5;
  }
`;

const DropBox = styled.pre`
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  white-space: pre-wrap;
  word-break: normal;
  word-wrap: normal;
  height: auto;
  border: none;
  background-color: transparent;
  margin: 0rem;
  padding: 1rem;
`;

const QuestionContainer = styled.div`
  margin-bottom: 1rem;
`;

function NoticePage() {
  const [showNoticeContent, setShowNoticeContent] = useState(true);
  const [showFAQContent, setShowFAQContent] = useState(false);
  const [curNotice, setCurNotice] = useState(0);
  const [curFAQ, setCurFAQ] = useState(0);
  const [FAQDescriptions, setFAQDescriptions] = useState([]);
  const [noticeDescriptions, setNoticeDescriptions] = useState([]);
  useEffect(() => {
    const fetchNoticeInfo = async () => {
      try {
        const config = getHeader();
        const response = await axios.get(`${server_url}/boards/v1/notice/list/`, config);
        console.log('fetchNoticeInfo response', response);
        if (response.data.status !== 'fail') setNoticeDescriptions(response.data.data);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };
    const fetchFAQInfo = async () => {
      try {
        const config = getHeader();
        const response = await axios.get(`${server_url}/boards/v1/faq/list/`, config);
        console.log('fetchFAQInfo response', response);
        if (response.data.status !== 'fail') setFAQDescriptions(response.data.data);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };
    fetchNoticeInfo();
    fetchFAQInfo();
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

  const handleNoticeClick = () => {
    if (!showNoticeContent) {
      setShowNoticeContent(!showNoticeContent);
      setShowFAQContent(false);
    }
  };

  const handleFAQClick = () => {
    if (!showFAQContent) {
      setShowFAQContent(!showFAQContent);
      setShowNoticeContent(false);
    }
  };

  const handleNoticeItemClick = (noticeId) => {
    if (noticeId === curNotice) setCurNotice(0);
    else setCurNotice(noticeId);
  };

  const handleFAQItemClick = (faqId) => {
    if (faqId === curFAQ) setCurFAQ(0);
    else setCurFAQ(faqId);
  };

  return (
    <div className={`${common.container}`}>
      <div className={`${common.head}`}>
        <h1>고객센터</h1>
        <hr />
      </div>
      <NoticeContainer>
        <ButtonContainer>
          <NoticeButton onClick={handleNoticeClick}>공지사항</NoticeButton>
          <FAQButton onClick={handleFAQClick}>FAQ</FAQButton>
        </ButtonContainer>
        {showNoticeContent && (
          <ContentContainer key="notice">
            <h2>Notice</h2>
            {noticeDescriptions &&
              noticeDescriptions.map((notice) => (
                <div key={`notice-${notice.id}`}>
                  <DropBoxContainer onClick={() => handleNoticeItemClick(notice.id)}>{notice.title}</DropBoxContainer>
                  <QuestionContainer>{curNotice === notice.id && <DropBox>{notice.body}</DropBox>}</QuestionContainer>
                </div>
              ))}
          </ContentContainer>
        )}
        {showFAQContent && (
          <ContentContainer key="faq">
            <h2>FAQ</h2>
            {FAQDescriptions &&
              FAQDescriptions.map((faq) => (
                <div key={`faq-${faq.id}`}>
                  <DropBoxContainer onClick={() => handleFAQItemClick(faq.id)}>{faq.title}</DropBoxContainer>
                  <QuestionContainer>{curFAQ === faq.id && <DropBox>{faq.body}</DropBox>}</QuestionContainer>
                </div>
              ))}
          </ContentContainer>
        )}
      </NoticeContainer>
    </div>
  );
}

export default NoticePage;
