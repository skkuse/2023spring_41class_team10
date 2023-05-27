import React, { useState } from 'react';
import classes from './Notice.module.css';

function Notice() {
  // 현재 페이지를 저장하는 state
  const [currentPage, setCurrentPage] = useState(1);
  // 게시글 리스트 샘플
  // TODO: 서버에 request 보내는 방식 구현
  const [postList, setPostList] = useState([
    { id: 1, title: '첫 번째 게시글', content: '첫 번째 게시글 내용입니다.' },
    { id: 2, title: '두 번째 게시글', content: '두 번째 게시글 내용입니다.' },
    { id: 3, title: '세 번째 게시글', content: '세 번째 게시글 내용입니다.' },
    { id: 4, title: '네 번째 게시글', content: '네 번째 게시글 내용입니다.' },
    { id: 5, title: '다섯 번째 게시글', content: '다섯 번째 게시글 내용입니다.' },
    { id: 6, title: '여섯 번째 게시글', content: '여섯 번째 게시글 내용입니다.' },
    { id: 7, title: '일곱 번째 게시글', content: '일곱 번째 게시글 내용입니다.' },
    { id: 8, title: '여덟 번째 게시글', content: '여덟 번째 게시글 내용입니다.' },
    { id: 9, title: '아홉 번째 게시글', content: '아홉 번째 게시글 내용입니다.' },
    { id: 10, title: '열 번째 게시글', content: '열 번째 게시글 내용입니다.' },
    { id: 11, title: '열한 번째 게시글', content: '열한 번째 게시글 내용입니다.' },
    { id: 12, title: '열두 번째 게시글', content: '열두 번째 게시글 내용입니다.' }
  ]);
  // 한 페이지에 보여줄 게시글 수
  const postsPerPage = 5;
  // 마지막 페이지 번호
  const lastPage = Math.ceil(postList.length / postsPerPage);

  // 페이지 번호를 클릭했을 때 실행되는 함수
  const handlePagenation = (e, page) => {
    e.preventDefault();
    setCurrentPage(page);
    console.log('page', page);
  };

  // 현재 페이지에 해당하는 게시글 리스트 슬라이스
  const currentPosts = postList.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  return (
    <div>
      {/* 게시글 렌더링 */}
      <div>
        {currentPosts.map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
      {/* 페이지네이션 */}
      <div className={classes.pagenation}>
        {Array.from({ length: lastPage }, (_, i) => (
          <span key={i}>
            <a className={classes.page} href="#" onClick={(e) => handlePagenation(e, i + 1)}>
              {i + 1}
            </a>
          </span>
        ))}
      </div>
    </div>
  );
}

export default Notice;
