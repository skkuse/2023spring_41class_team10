import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const server_url = import.meta.env.VITE_SERVER_URL;

const CardContainer = styled.div`
  width: 300px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin: 20px;
  cursor: pointer;
`;

const LectureTitle = styled.h2`
  font-size: 1rem;
  margin-bottom: 8px;
`;

const LectureImage = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 8px;
  cursor: pointer;
`;

const LectureProgress = styled.div`
  background-color: #eee;
  height: 8px;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const ProgressIndicator = styled.div`
  height: 100%;
  background-color: #007bff;
  border-radius: 4px;
`;

const Lectures = ({ id, youtubeLink, title, datetime, memo }) => {
  // Extract the YouTube video ID from the link
  const videoId = youtubeLink.match(/youtube\.com\/watch\?v=([^&]+)/)?.[1] || '';
  const handleClick = (e, id) => {
    console.log('handleClick', e);
    let updated = clickLecture;
    updated.lecture_id = id;
    setClickLecture(updated);
    postLectureHistory();
    window.open(youtubeLink, '_blank'); // Open the link in a new tab
  };
  const [clickLecture, setClickLecture] = useState({ lecture_id: 0 });
  const date = datetime ? `${datetime.slice(0, 10)} ${datetime.slice(11, 19)}` : null;

  const postLectureHistory = async () => {
    try {
      console.log('clickLecture req', clickLecture);
      const config = getHeader();
      const response = await axios.post(`${server_url}/users/v1/lectures/history/save/`, clickLecture, config);
      console.log('LectureHistory res', response);
      if (response.status === 200) {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error('Failed to post LectureHistory:', error);
    }
  };
  const getHeader = () => {
    const token = localStorage.getItem('access_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    return config;
  };

  return (
    <CardContainer id={`${id}`} onClick={(e) => handleClick(e, id)}>
      <LectureImage src={`https://img.youtube.com/vi/${videoId}/0.jpg`} alt="Lecture Thumbnail" />
      <LectureTitle>{title}</LectureTitle>
      {date && <span>{date}</span>}
      {memo && <span>{memo}</span>}

      {/* <LectureProgress>
        <ProgressIndicator style={{ width: `${progress}%` }} />
      </LectureProgress> */}
    </CardContainer>
  );
};

export default Lectures;
