import { useState, React } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import styled from 'styled-components';

import { Main, Home, Profile, Auth, Problem, Review, Produce, Notice, Questions } from './pages'
import { LoginView, NoticeView } from './routes/'

import { GuestRoute, Navbar } from './components'

import './App.css'

const MainBack = styled.main`
    background-color:#f2f2f2;
`

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <header>
        <Navbar />
      </header>
      <MainBack>
        <Routes>
          <Route path="/" element={<Main/>} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/login2" element={<Auth />} /> {/* 추가해야함: 현재 로그인되어있지 않은 상태에서만 입장 가능, 로그인 되어있을 시 home으로 navigate (GuestRoute.jsx 참고)*/}
          <Route path="/problem/:slug" element={<Problem />} /> {/* http://localhost:5173/problem/1 */}
          <Route path="/problem/:slug/review" element={<Review />} /> {/* http://localhost:5173/problem/1/review */}
          <Route path="/@:username" element={<Profile />} /> {/* 추가해야함: 본인 프로필에 로그인되어 있는 상태에서만 입장 가능*/}
          <Route path="/notice" element={<Notice />}/>
          <Route path="/questions" element={<Questions />}/>
          <Route path="/produce" element={<Produce />} />  {/* produce page(문제 추가 페이지): 허가된 관리자만 입장할 수 있도록 설정해야함*/}

        </Routes>
      </MainBack>
      <footer>
        <div className="container">
          <Link to="/" className="logo-font">
            BePro
          </Link>
          <span className="attribution">
            AI based programming education platform, BePro, from Software Engineering class SWE3002_41 of <a href="https://skku.edu">Thinkster</a>. Code &amp; design
            licensed under MIT.
          </span>
        </div>
      </footer>
    </Router>
  )
}

export default App
