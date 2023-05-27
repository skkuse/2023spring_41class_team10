import { Outlet } from 'react-router-dom';

import Notice from '../components/Notice';

const NoticeView = () => {
  return (
    <>
      <Outlet />
      <main>
        <Notice />
      </main>
    </>
  );
};

export default NoticeView;
