import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const SquareContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  border-radius: 4px;
  border: 0.1px solid;
  height: 50px;
  margin: 1rem;
`;

const SquareItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
`;

const WideSquareItem = styled(SquareItem)`
  flex: 2;
`;

const ProblemLink = styled(Link)`
  text-decoration: none;
  color: #000;
  width: 80%;
  height: 50px;
  margin-bottom:20px;
`;

function ProblemInfo({ problemNumber, title, problemCategory, problemLevel, problemStatus }) {
  let backgroundColor;

  if (problemStatus === 'complete') {
    backgroundColor = '#C6DBDA';
  } else if (problemStatus === 'processing') {
    backgroundColor = '#FEF0D6';
  } else if (problemStatus === 'uncomplete') {
    backgroundColor = '#FFFFFF';
  } else if (problemStatus === 'ai') {
    backgroundColor = '#D9CFDE';
  }

  return (
    <ProblemLink to={`/problem/${problemNumber}`}>
      <SquareContainer style={{ backgroundColor }}>
        <SquareItem>{problemNumber}</SquareItem>
        <WideSquareItem>{title}</WideSquareItem>
        <SquareItem>{problemCategory}</SquareItem>
        <SquareItem>{problemLevel}</SquareItem>
      </SquareContainer>
    </ProblemLink>
  );
}

export default ProblemInfo;
