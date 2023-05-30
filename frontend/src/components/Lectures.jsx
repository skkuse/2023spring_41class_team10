import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  width: 300px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin: 20px;
`;

const LectureTitle = styled.h2`
  font-size: 1rem;
  margin-bottom: 8px;
`;

const LectureImage = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 8px;
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

const Lectures = ({ youtubeLink, title, progress }) => {
  // Extract the YouTube video ID from the link
  const videoId = youtubeLink.match(/youtube\.com\/watch\?v=([^&]+)/)?.[1] || '';
  const handleClick = () => {
    window.open(youtubeLink, '_blank'); // Open the link in a new tab
  };

  return (
    <CardContainer onClick={handleClick}>
      <LectureImage
        src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
        alt="Lecture Thumbnail"
      />
      <LectureTitle>{title}</LectureTitle>
      <LectureProgress>
        <ProgressIndicator style={{ width: `${progress}%` }} />
      </LectureProgress>
    </CardContainer>
  );
};

export default Lectures;
