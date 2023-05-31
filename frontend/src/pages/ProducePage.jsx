import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import styled from 'styled-components';
import { } from '../components'


const Container = styled.div`
    width: 90%;
    max-width: 1400px;
    margin: auto;
`;

const DescriptionContainer = styled.div`
    text-align: center;
    margin-bottom: 2vh;
`;

const TitleContainer = styled.div`
`;

const Titleh1 = styled.h1`
    margin: 0 auto;
    padding: 10px 0;
`;

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5vh;
`;

const Titleh2 = styled.h2`
    margin: 15px 3vw;
`;


const TypingContainer = styled.textarea`
    width: 100%;
    height: 100%;
    border-style: none;
    border-color: Transparent;
    overflow: auto;
    outline: none;
`;
const CodeReviewContainer = styled.div`
    label {
        display: block;
    }
    width: 100%;
`;

const CodeReviewDiv = styled.div`
    width: 100%;
    background-color: white;
    border-radius: 3vw;
    padding: 10px 10px 0px 10px;
    min-height: 5vh;
    margin-bottom: 1vh;
`;

const Controllers = styled.div`
    display: flex;
    justify-content: center;
`;

const Button = styled.button`
    background-color: ${props => props.color};
    width: 60px;
    height: 30px;
    margin: 5px;
    font-size: 15px;

    display: flex;
    align-items: center;
    justify-content: center;
`;

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

const SquareItem = styled.input`
  text-align: center;
  border: none;
  border-left: 2px solid;
`;

const WideSquareItem = styled(SquareItem)`
  flex: 2;
`;

const LefttSquareItem = styled(SquareItem)`
  border-left: 0px;
  user-select: none;
`;

//백엔드 연결 전 테스트용 데이터
const data = {
    slug : '1',
    title : "Test Problem",
    problemNumber : '1',
    problemCategory : 'I/O',
    problemLevel : '2',
    description : 'Description for Test Problem. You will see this description and learn about the problem.',
    programmingLanguage : 'C'
  }


function Produce() {
    const [problemData, setProblemData] = useState({
        title : "",
        problemCategory : "",
        problemLevel : "",
        description : "",
        testCase: "",
    });

    const history = useHistory();

    const handleTitleChange=(e)=>{
        let tempdata = problemData;
        tempdata.title = e.target.value;
        setProblemData(tempdata);
    }
    const handleCategoryChange=(e)=>{
        let tempdata = problemData;
        tempdata.problemCategory = e.target.value;
        setProblemData(tempdata);
    }
    const handleLevelChange=(e)=>{
        let tempdata = problemData;
        data.problemLevel = e.target.value;
        setProblemData(tempdata);
    }
    const handleDescriptionChange=(e)=>{
        let tempdata = problemData;
        tempdata.description = e.target.value;
        setProblemData(tempdata);
    }
    const handleTestcaseChange=(e)=>{
        let tempdata = problemData;
        tempdata.testCase = e.target.value;
        setProblemData(tempdata);
    }

    const handleButtonClick=(e)=>{
        console.log("button clicked ", e);
        if(e.target.value == "Submit"){
            console.log("submit clicked ", e);
            postNewProblem();
        } 
    }

    const postNewProblem = async() => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post('http://127.0.0.1:8000/problems/v1/create', problemData, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            console.log('response', response);
            if (response.status === 200) {
                console.log(response.data.message);
                history.push("/home");
            };
        } catch (error) {
            console.error('Failed to post new problem:', error);
        }
    }

    return (
        <Container>
        <DescriptionContainer>
            <TitleContainer>
                <Titleh1>문제 추가 (관리자)</Titleh1>
                <hr style={{ height: '3px' }} />
                <SquareContainer>
                    <LefttSquareItem type="text" defaultValue="#번호 자동지정"/>
                    <WideSquareItem type="text" placeholder="문제 제목" onChange={handleTitleChange}/>
                    <SquareItem type="text" placeholder="문제 종류" onChange={handleCategoryChange}/>
                    <SquareItem type="text" placeholder="문제 레벨" onChange={handleLevelChange}/>
                </SquareContainer>
            </TitleContainer>
        </DescriptionContainer>

        <ReviewContainer>
            <CodeReviewContainer>
                <Titleh2>문제 설명</Titleh2>
                <CodeReviewDiv>
                <TypingContainer
                    placeholder="문제 설명 추가"
                    onChange={handleDescriptionChange}
                    rows={10}
                />
                </CodeReviewDiv>
            </CodeReviewContainer>
            <CodeReviewContainer>
                <Titleh2>테스트 케이스</Titleh2>
                <CodeReviewDiv>
                <TypingContainer
                    placeholder="테스트 케이스 추가"
                    onChange={handleTestcaseChange}
                    rows={8}
                />
                </CodeReviewDiv>
            </CodeReviewContainer>
            <Controllers>
                <Button onClick={handleButtonClick} color={'white'}> Submit </Button>
            </Controllers>
        </ReviewContainer>
        <hr />
        </Container>
    )
}
export default Produce
