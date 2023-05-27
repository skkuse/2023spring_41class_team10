import { Outlet } from 'react-router-dom';

import Login from '../components/Login';

const LoginView = () => {
  return (
    <>
      <Outlet />
      <main>
        <Login />
      </main>
    </>
  );
};

export default LoginView;
