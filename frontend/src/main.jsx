import React from 'react';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';

import App from './App';
import './index.css';

const Wrapper = styled.div`
  background-color: #f2f2f2;
`;

const root = createRoot(document.getElementById('root'));
root.render(
  <Wrapper>
    <App />
  </Wrapper>
);
