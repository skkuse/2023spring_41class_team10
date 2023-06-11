import React from 'react';
import styled from 'styled-components';

const PageButton = styled.button`
  border-radius: 25%;
  padding: 0.5rem 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;
const FlexDiv = styled.div`
  display: flex;
  gap: 1em;
  margin-top: 2rem;
`;
function Pagination({ totalItems, itemsPerPage, onPageChange, currentPage }) {
  const pages = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pages.push(i);
  }

  // 페이지네이션 최대 10개 렌더링, 현재 페이지에 따라 유동적으로 모든 페이지 탐색 가능
  const startIdx = Math.max(0, currentPage - 5);
  const endIdx = Math.min(startIdx + 10, pages.length);
  return (
    <FlexDiv>
      {pages.slice(startIdx, endIdx).map((page) => (
        <PageButton key={page} onClick={() => onPageChange(page)} disabled={page === currentPage}>
          {page}
        </PageButton>
      ))}
    </FlexDiv>
  );
}

export default Pagination;
