import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import LoginView from './routes/LoginView';
import NoticeView from './routes/NoticeView';

import RootLayout from './routes/RootLayout';
import App from './App';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <App />
      },
      {
        path: '/login',
        element: <LoginView />
      },
      {
        path: '/notice',
        element: <NoticeView />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
