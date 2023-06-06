import React from 'react';
import { createRoot } from 'react-dom/client';
// import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools';
import App from './App';
import './index.css';

// const queryClient = new QueryClient();
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <QueryClientProvider client={queryClient}> */}
    <App />
    {/* <ReactQueryDevtools initialIsOpen={false} containerElement="div" /> */}
    {/* </QueryClientProvider> */}
  </React.StrictMode>
);
