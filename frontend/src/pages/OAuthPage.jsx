import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import axios from 'axios';
import { AuthContext } from '../components';

const server_url = import.meta.env.VITE_SERVER_URL;

const OAuthPage = () => {
  const { setLoggedIn } = useContext(AuthContext);

  console.log('OAuthPage');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('location.search', location.search);

    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    console.log('code', code);

    if (code) {
      const url = `${server_url}/login/github/callback/?code=${code}`;

      axios
        .get(url)
        .then((response) => {
          // 처리 완료 후 리다이렉트 등 필요한 동작 수행
          console.log('Successful callback:', response);
          console.log(response.data.message);
          setLoggedIn(true);
          localStorage.setItem('access_token', response.data.data.access_token);
          localStorage.setItem('refresh_token', response.data.data.refresh_token);
          localStorage.setItem('isLoggedIn', true);
          window.location.href = '/';
        })
        .catch((error) => {
          console.error('Callback request error:', error);
        });
    } else {
      console.error('Callback code is missing');
      setLoggedIn(false);
    }
  }, [history, location.search]);

  return <div>Loading...</div>;
};

export default OAuthPage;
