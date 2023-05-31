import React, { useState } from 'react'
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
        programmingLanguage : "",
        testCase: "",
    });

    const handleTitleChange=(e)=>{
        let data = problemData;
        data.title = e.target.value;
        setProblemData(data);
    }
    const handleCategoryChange=(e)=>{
        let data = problemData;
        data.problemCategory = e.target.value;
        setProblemData(data);
    }
    const handleLevelChange=(e)=>{
        let data = problemData;
        data.problemLevel = e.target.value;
        setProblemData(data);
    }
    const handleDescriptionChange=(e)=>{
        let data = problemData;
        data.description = e.target.value;
        setProblemData(data);
    }
    const handleLanguageChange=(e)=>{
        let data = problemData;
        data.programmingLanguage = e.target.value;
        setProblemData(data);
    }
    const handleTestcaseChange=(e)=>{
        let data = problemData;
        data.testCase = e.target.value;
        setProblemData(data);
    }

    const handleButtonClick=(e)=>{
        console.log("button clicked ", e);
        if(e.target.value == "Submit"){
            // submit new problem
            console.log("submit clicked ", e);
        } 
    }

    return (
        <Container>
        <DescriptionContainer>
            <TitleContainer>
                <Titleh1>문제 추가 (관리자)</Titleh1>
                <hr style={{ height: '3px' }} />
                {/* problem metadata component */}
            </TitleContainer>
        </DescriptionContainer>

        <ReviewContainer>
            <CodeReviewContainer>
                <Titleh2>허용된 언어</Titleh2>
                <CodeReviewDiv>
                <TypingContainer
                    value={data.programmingLanguage}
                    onChange={handleLanguageChange}
                    rows={3}
                />
                </CodeReviewDiv>
            </CodeReviewContainer>
            <CodeReviewContainer>
                <Titleh2>문제 설명</Titleh2>
                <CodeReviewDiv>
                <TypingContainer
                    value={data.description}
                    onChange={handleDescriptionChange}
                    rows={10}
                />
                </CodeReviewDiv>
            </CodeReviewContainer>
            <CodeReviewContainer>
                <Titleh2>테스트 케이스</Titleh2>
                <CodeReviewDiv>
                <TypingContainer
                    value={data.testCase}
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
