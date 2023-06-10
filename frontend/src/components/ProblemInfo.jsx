import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const SquareContainer = styled.div`
  max-width: 800px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 4fr 3fr 1fr;
  border-radius: 10px;
  border: 0.1px solid black;
  margin: 1rem;
  padding: 4px 0;
  background-color: white;
  box-shadow: 2px 4px 4px #cccccc;
  @media (max-width: 576px) {
    grid-template-columns: 1fr 4fr;
  }
`;

const SquareItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid;
  @media (max-width: 576px) {
    border: 0;

    &:nth-child(1) {
      order: 1;
      border-bottom: 1px solid;
    }
    &:nth-child(2) {
      order: 2;
      border-bottom: 1px solid;
    }
    &:nth-child(3) {
      order: 4;
    }
    &:nth-child(4) {
      order: 3;
    }
  }
`;

const WideSquareItem = styled(SquareItem)`
  flex: 2;
`;

const RightSquareItem = styled(SquareItem)`
  border-right: 0px;
`;

const ProblemLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: #000;
  width: 100%;
`;

function ProblemInfo({ problemNumber, title, problemCategory, problemLevel, problemStatus, isActive = true }) {
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
  let categories = Array.isArray(problemCategory) ? problemCategory.join(', ') : problemCategory;

  return (
    <ProblemLink to={isActive ? `/problem/${problemNumber}` : '#'}>
      <SquareContainer style={{ backgroundColor }}>
        <SquareItem># {problemNumber} </SquareItem>
        <WideSquareItem>{title}</WideSquareItem>
        <SquareItem>{categories}</SquareItem>
        <RightSquareItem>{problemLevel}</RightSquareItem>
      </SquareContainer>
    </ProblemLink>
  );
}

export default ProblemInfo;
