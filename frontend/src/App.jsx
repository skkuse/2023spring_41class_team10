import { useState, useEffect, React } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';

import { Main, Home, Profile, Auth, Problem, Review, Produce, Notice, Questions, OAuth } from './pages';
import { LoginView, NoticeView } from './routes/';

import { GuestRoute, Navbar, Footer, AuthContext } from './components';
import './App.css';
import axios from 'axios';

const MainBack = styled.main`
  background-color: #f2f2f2;
`;

function App() {
  const [isLoggedIn, setLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [userInfo, setUserInfo] = useState([]);
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    const fetchUserInfo = async () => {
      try {
        console.log('fetch');
        const config = getHeader();
        const response = await axios.get(`http://127.0.0.1:8000/users/v1/info/`, config);
        console.log('response', response);
        setUserInfo(response.data.user);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };
    if (isLoggedIn) fetchUserInfo();
  }, [isLoggedIn]);
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
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn }}>
      <Router>
        <Navbar username={userInfo ? userInfo.github_username : ''} />
        {/* Navbar에 props로 username 넘겨주기 */}
        <MainBack>
          <Routes>
            <Route path="/" element={<Main username={userInfo ? userInfo.github_username : ''} />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/login/github/callback/" element={<OAuth />} />{' '}
            <Route path="/problem/:slug" element={<Problem />} />
            <Route path="/problem/:slug/review" element={<Review />} />
            <Route path="/profile/:slugUsername" element={<Profile />} />{' '}
            {/* 추가해야함: 본인 프로필에 로그인되어 있는 상태에서만 입장 가능*/}
            <Route path="/notice" element={<Notice />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/produce" element={<Produce />} />{' '}
            {/* produce page(문제 추가 페이지): 허가된 관리자만 입장할 수 있도록 설정해야함*/}
          </Routes>
        </MainBack>
        <Footer />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
