import React from 'react'
import { } from '../components'
import { useProblemQuery } from '../hooks'

//백엔드 연결 전 테스트용 데이터
const tempdate1 = new Date(2023, 5, 26, 15, 55, 5).toDateString()
const data = {
    slug : '1',
    title : "Test Problem",
    problemNumber : '1',
    problemCategory : 'I/O',
    problemLevel : '2',
    description : 'Descriptino for Test Problem. You will see this description and learn about the problem.',
    programmingLanguage : 'C',
    createdAt : tempdate1,
    updatedAt : tempdate1,
  }

function Problem() {
//   const { data } = useProblemQuery() // 나중에 백엔드 연결하면 바꾸기
  const { title, problemNumber, problemCategory, problemLevel, programmingLanguage, description, createdAt, updatedAt } = data

  return (
    <div className="problem-page">
      <div className="banner">
        <div className="container">
          <h1>{title}</h1>
          {/* <ArticleMeta /> */}
          <p>{problemNumber} | {problemCategory} | {problemLevel} | {programmingLanguage} </p>
        </div>
      </div>
      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>{description}</p>
            <p>createdAt: {createdAt}</p>
            <p>updatedAt: {updatedAt}</p>
          </div>
        </div>
        <hr />
        <div className="article-actions">
          {/* <ArticleMeta /> */}
          
        </div>
      </div>
    </div>
  )
}

export default Problem
