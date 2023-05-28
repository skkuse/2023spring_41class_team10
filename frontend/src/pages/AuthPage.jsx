import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../hooks'

import styled from 'styled-components';

const AuthPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f2f2f2;
`;

const AuthButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1rem;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #000;
  }
`;

function AuthPage() {
  const navigate = useNavigate()
  const { login } = useAuth()


  async function handleLogin() {
    // Handle login with GitHub logic here
    try {
      // login with github logic
      const { data } = '' // github와 통신 후 받아온 user 데이터 (github nickname)
      // login(data.user)
      navigate('/')

    } catch (error) {

      const { status, data } = error.response
      if (status === 422) {
        actions.setErrors(data.errors)
      }

    }
  }

  return (
    <AuthPageContainer>
      <AuthButton onClick={handleLogin}>Login with GitHub</AuthButton>
    </AuthPageContainer>
  );
}

export default AuthPage;