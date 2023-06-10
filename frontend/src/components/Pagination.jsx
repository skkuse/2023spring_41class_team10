import React from 'react';

function Pagination({ totalItems, itemsPerPage, onPageChange, currentPage }) {
    const pages = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
      pages.push(i);
    }
  
    return (
      <div>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={page === currentPage}
          >
            {page}
          </button>
        ))}
      </div>
    );
  }

  export default Pagination;