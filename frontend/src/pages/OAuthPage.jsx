import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import axios from 'axios';
import { useAuth } from '../hooks';

const OAuthPage = () => {
  console.log('OAuthPage');

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    console.log('location.search', location.search);

    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    console.log('code', code);

    if (code) {
      const url = `http://127.0.0.1:8000/login/github/callback/?code=${code}`;

      axios
        .get(url)
        .then((response) => {
          // 처리 완료 후 리다이렉트 등 필요한 동작 수행
          console.log('Successful callback:', response);
          console.log(response.data.message);
          localStorage.setItem('access_token', response.data.data.access_token);
          localStorage.setItem('refresh_token', response.data.data.refresh_token);
          navigate('/');
        })
        .catch((error) => {
          console.error('Callback request error:', error);
        });
    } else {
      console.error('Callback code is missing');
    }
  }, [history, location.search]);

  return <div>Loading...</div>;
};

export default OAuthPage;
