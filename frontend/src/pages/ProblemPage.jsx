import React, { useState } from 'react'
import styled from 'styled-components';
import { } from '../components'
import { useProblemQuery } from '../hooks'
import ProblemInfo from '../components/ProblemInfo';

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
    justify-content: space-around;
`;

const ActualDescriptionContainer = styled.div`
    margin: 0 5px;
    text-align: left;
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

const SolvingContainer = styled.div`
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

const InputOutputContainer = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
`;

const InputContainer = styled.div`
    label {
        display: block;
    }
    width: 100%;
    margin-right: 2vw;
`;

const OutputContainer = styled.div`
    label {
        display: block;
    }
    width: 100%;
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

function Problem() {
    
    //const { data } = useProblemQuery() // 나중에 백엔드 연결하면 바꾸기
    const { title, problemNumber, problemCategory, problemLevel, programmingLanguage, description, createdAt, updatedAt } = data;
    const [codeTyped, setCodeTyped] = useState("Type your code here.");
    const [inputTyped, setInputTyped] = useState("Type your input here.");
    const [outputValue, setOutputValue] = useState("Default Output");

    const handleCodeChange=(e)=>{
        setCodeTyped(e.target.value);
    }
    const handleInputChange=(e)=>{
        setInputTyped(e.target.value);
    }
    const handleButtonClick=(e)=>{
        console.log("button clicked ", e);
        if(e.target.innerText == "Back"){
            // Go back page
            console.log("back clicked");
        } else if (e.target.innerText == "Run"){
            // Run Code
            console.log("run clicked");
        } else if (e.target.innerText == "Stop"){
            // Stop running code
            console.log("stop clicked");
        } else if (e.target.innerText == "Submit"){
            // Submit code
            console.log("submit clicked");
        }
    }

    return (
        <Container>
        <DescriptionContainer>
            <TitleContainer>
                <Titleh1>문제 풀이</Titleh1>
                <hr style={{ height: '3px' }} />
                {/* problem metadata component */}
                <p>| #{problemNumber} | {title} | {problemCategory} | {problemLevel} |</p>
                <MoreDescriptionContainer>
                    <ActualDescriptionContainer>
                        &lt;문제설명&gt;
                        {description}
                    </ActualDescriptionContainer>
                    <ChooseLanguageContainer>
                        <LangDiv>언어 선택</LangDiv>
                        <LanguageDiv> C </LanguageDiv>
                    </ChooseLanguageContainer>
                </MoreDescriptionContainer>
            </TitleContainer>
        </DescriptionContainer>

        <SolvingContainer>
            <TypingContainer
                value={codeTyped}
                onChange={handleCodeChange}
                rows={20}
            />
            <InputOutputContainer>
                <InputContainer>
                    <label>Input</label>
                    <TypingContainer
                        value={inputTyped}
                        onChange={handleInputChange}
                        rows={10}
                    />
                </InputContainer>
                <OutputContainer>
                    <label>Output</label>
                    <TypingContainer
                        value={outputValue}
                        rows={10}
                        readOnly={true}
                    />
                </OutputContainer>
            </InputOutputContainer>
            <Controllers>
                <Button onClick={handleButtonClick} color={'#C6DBDA'}> Back </Button>
                <Button onClick={handleButtonClick} color={'#FEF0D6'}> Run </Button>
                <Button onClick={handleButtonClick} color={'#FACFCF'}> Stop </Button>
                <Button onClick={handleButtonClick} color={'#D9CFDE'}> Submit </Button>
            </Controllers>
        </SolvingContainer>
        <hr />
        </Container>
    )
}
export default Problem
