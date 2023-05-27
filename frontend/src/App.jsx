import { useState, React } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import { Home, Profile, Auth, Problem } from './pages'
import { LoginView, NoticeView, RootLayout } from './routes/'
import { GuestRoute, Navbar } from './components'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <header>
        <Navbar />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/login2" element={<Auth />} /> {/* 추가해야함: 현재 로그인되어있지 않은 상태에서만 입장 가능, 로그인 되어있을 시 home으로 navigate (GuestRoute.jsx 참고)*/}
          <Route path="/problem/:slug" element={<Problem />} />
          <Route path="/profile/:username" element={<Profile />} /> {/*남의 프로필*/}
          <Route path="/@:username" element={<Profile />} /> {/*본인 프로필*/} {/* 추가해야함: 본인 프로필에 로그인되어 있는 상태에서만 입장 가능*/}
          <Route path="/notice" element={<NoticeView />} />
        </Routes>
      </main>
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
