import React, { useState } from 'react'
import styled from 'styled-components';
import { ProblemInfo } from '../components'
import { useProblemQuery } from '../hooks'

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
const tempdate1 = new Date(2023, 5, 26, 15, 55, 5).toDateString()
const data = {
    title : "Test Problem",
    problemNumber : '1',
    problemCategory : 'I/O',
    problemLevel : '2',
    description : 'Description for Test Problem. You will see this description and learn about the problem.',
    programmingLanguage : 'C',
    createdAt : tempdate1,
    updatedAt : tempdate1,
  }

const reviewData = {
    originalCode : "(test)\nint main() {\n\tprintf(\"Hello World\");\n}",
    feedbackCode : "(test)\nint main() {\n\tprintf(\"Hello World\");\n\treturn 0;\n}",
    review : "(test) 당신의 코드는 마치 바보가 쓴 것과 같습니다.\n기본적으로 C언어에서 Hello World를 출력하기 위해서는 심윤보 님이 사용하신 코드와 같은 형식을 이용하면 되지만, int main이 끝날 때 return 0를 해주는 것이 좋습니다.",
  }

function Review() {
    //const { data } = useProblemQuery() // 나중에 백엔드 연결하면 바꾸기
    const { title, problemNumber, problemCategory, problemLevel, programmingLanguage, description, createdAt, updatedAt } = data;
    const { originalCode, feedbackCode, review} = reviewData;
    const [username, setUsername] = useState("심윤보");


    const handleButtonClick=(e)=>{
        console.log("button clicked ", e);
        if(e.target.value == "Exit"){
            // Exit to problem list page
            console.log("exit clicked ", e);
        } 
    }

    return (
        <Container>
        <DescriptionContainer>
            <TitleContainer>
                <Titleh1>코드 리뷰</Titleh1>
                <hr style={{ height: '3px' }} />
                {/* problem metadata component */}
                <ProblemInfo problemNumber={problemNumber} title={title} problemCategory={problemCategory} problemLevel={problemLevel} isActive={false}/>
                <MoreDescriptionContainer>
                    <ChooseLanguageContainer>
                        <LangDiv>선택한 언어</LangDiv>
                        <LanguageDiv> C </LanguageDiv>
                    </ChooseLanguageContainer>
                </MoreDescriptionContainer>
            </TitleContainer>
        </DescriptionContainer>

        <ReviewContainer>
            <Titleh2>Answer</Titleh2>
            <CodeCompareContainer>
                <OriginalCodeContainer>
                    <label>{username} 님</label>
                    <TypingContainer
                        value={originalCode}
                        rows={15}
                        readOnly={true}
                    />
                </OriginalCodeContainer>
                <FeedbackContainer>
                    <label>ChatGPT 보완</label>
                    <TypingContainer
                        value={feedbackCode}
                        rows={15}
                        readOnly={true}
                    />
                </FeedbackContainer>
            </CodeCompareContainer>
            <Titleh2>Code Review</Titleh2>
            <CodeReviewContainer>
                <label>ChatGPT의 코드 리뷰</label>
                <CodeReviewDiv>
                    {review}
                </CodeReviewDiv>
            </CodeReviewContainer>
            <Controllers>
                <Button onClick={handleButtonClick} color={'white'}> Exit </Button>
            </Controllers>
        </ReviewContainer>
        <hr />
        </Container>
    )
}
export default Review
