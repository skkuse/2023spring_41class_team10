import React from 'react'
import { } from '../components'
import { useAuth } from '../hooks'

import styled from "styled-components"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f2f2f2;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: #666;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  font-size: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

function MainPage() {
  const { isAuth } = useAuth()

  return (
    <Container>
      <Title>BePro</Title>
      <Subtitle>미래형 AI 코딩 교육 플랫폼</Subtitle>
      <Button>지금 가입하기</Button>
    </Container>
  )
}

export default MainPage;
