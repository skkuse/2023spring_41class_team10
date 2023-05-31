import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const SquareContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  border-radius: 10px;
  border: 0.1px solid black;
  height: 26px;
  margin: 1rem;
  padding: 4px 0;
  background-color: white;
  box-shadow: 2px 4px 4px #cccccc;
`;

const SquareItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 2px solid;
`;

const WideSquareItem = styled(SquareItem)`
  flex: 2;
`;

const RightSquareItem = styled(SquareItem)`
  border-right: 0px;
`;

const ProblemLink = styled(Link)`
  text-decoration: none;
  color: #000;
  width: 80%;
  height: 50px;
  margin-bottom: 20px;
`;

function ProblemInfo({ problemNumber, title, problemCategory, problemLevel, problemStatus, isActive=true }) {
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
      <SquareContainer>
        <SquareItem>{problemNumber} </SquareItem>
        <WideSquareItem>{title}</WideSquareItem>
        <SquareItem>{categories}</SquareItem>
        <RightSquareItem>{problemLevel}</RightSquareItem>
      </SquareContainer>
    </ProblemLink>
  );
}

export default ProblemInfo;
