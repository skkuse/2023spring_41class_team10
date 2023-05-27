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

const MoreDescriptionContainer = styled.div`
    display: flex;
    justify-content: right;
`;

const ChooseLanguageContainer = styled.div`
    display: flex;
    background-color: #CCCCCC;
    padding: 4px;
    margin: 0 5px;
    border-radius: 4px;
    width: 180px;
    height: 30px;
    align-items: center;
    justify-content: space-around;
`;
const LangDiv = styled.div`
    font-size: 14px;
    font-weight: bold;
`

const LanguageDiv = styled.div`
    background-color: black;
    color: white;
    padding: 2px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: bold;
    height: 16px;
    width: 80px;
`

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5vh;
`;

const TypingContainer = styled.textarea`
    background-color: black;
    color: white;
    width: 100%;
    margin-bottom: 1vh;
`;

const Titleh2 = styled.h2`
    margin: 5px 0;
`;

const CodeCompareContainer = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
`;

const OriginalCodeContainer = styled.div`
    label {
        display: block;
    }
    width: 100%;
    margin-right: 4vw;
`;

const FeedbackContainer = styled.div`
    label {
        display: block;
    }
    width: 100%;
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
    padding: 15px;
    min-height: 15vh;
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
        slug : "",
        title : "",
        problemNumber : "",
        problemCategory : "",
        problemLevel : "",
        description : "",
        programmingLanguage : "",
        testCase: "",
    });

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
                <label>허용된 언어</label>
                <CodeReviewDiv>
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
