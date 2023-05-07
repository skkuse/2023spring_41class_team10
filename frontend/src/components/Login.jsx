import { Link } from 'react-router-dom';
import { BsGithub } from 'react-icons/bs';

const Login = () => {
  return (
    <div>
      <h1>Login 페이지</h1>
      {/* GitHub OAuth 버튼 */}
      <Link to="/github">
        <button>
          <BsGithub />
          Start with GitHub
        </button>
      </Link>
      {/* 고객 센터 페이지 이동 버튼 */}
      <Link to="/notice">
        <button>고객 센터</button>
      </Link>
    </div>
  );
};

export default Login;
