import { useState, useEffect, React } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Main, Home, Profile, Problem, Review, Produce, Notice, Questions, OAuth } from './pages';
import { LoginView } from './routes/';

import { Navbar, Footer, AuthContext } from './components';
import './App.css';
import axios from 'axios';

const server_url = import.meta.env.VITE_SERVER_URL;

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  useEffect(() => {
    try {
      let isLogin = localStorage.getItem('isLoggedIn');
      if (isLogin === 'true') setLoggedIn(isLogin);
      else localStorage.setItem('isLoggedIn', false);
    } catch {
      localStorage.setItem('isLoggedIn', false);
    }
    const fetchUserInfo = async () => {
      try {
        console.log('fetch');
        const config = getHeader();
        const response = await axios.get(`${server_url}/users/v1/info/`, config);
        console.log('user info', response);
        setUserInfo(response.data.user);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        setUserInfo({ github_username: '' });
        localStorage.setItem('isLoggedIn', false);
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
        <Navbar user={userInfo ? userInfo : {}} />
        {/* Navbar에 props로 username 넘겨주기 */}
        <Routes>
          <Route path="/" element={<Main user={userInfo ? userInfo : ''} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/login/github/callback/" element={<OAuth />} />{' '}
          <Route path="/problem/:slug" element={<Problem />} />
          <Route path="/problem/:slug/review" element={<Review />} />
          <Route path="/profile/:slugUsername" element={<Profile user={userInfo ? userInfo : {}} />} />{' '}
          {/* 추가해야함: 본인 프로필에 로그인되어 있는 상태에서만 입장 가능*/}
          <Route path="/notice" element={<Notice />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/produce" element={<Produce user={userInfo ? userInfo : {}} />} />{' '}
          {/* produce page(문제 추가 페이지): 허가된 관리자만 입장할 수 있도록 설정해야함*/}
        </Routes>
        <Footer />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
