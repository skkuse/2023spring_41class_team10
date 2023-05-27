import { React, useState } from 'react'
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
        if(e.target.value == "Back"){
            // Go back page
            console.log("back clicked ", e);
        } else if (e.target.value == "Run"){
            // Run Code
            console.log("run clicked ", e);
        } else if (e.target.value == "Stop"){
            // Stop running code
            console.log("stop clicked ", e);
        } else if (e.target.value == "Submit"){
            // Submit code
            console.log("submit clicked ", e);
        }
    }

    return (
    <div className="container">

        <div className="description-container">
            <div className="title-container">
                <h1>{title}</h1>
                <hr style={{height:'3px'}}/>
                {/* problem metadata component */}
                <p>| {problemNumber} | {problemCategory} | {problemLevel} | {programmingLanguage} |</p>
                <div style={{display:'flex'}} className="more-description-container">
                    <div className="actual-description-container"> 
                        &lt;문제설명&gt; 
                        {description}
                    </div>
                    <div style={{display:'flex', backgroundColor:'lightgray'}} className="choose-language-container">
                        <p>언어 선택</p>
                        <div style={{backgroundColor:'black', color:'white'}}> C </div>
                    </div>
                </div>
            </div>
        </div>

      <div className="solving-container">
        <div className="typing-container">
            <textarea
                name="postContent"
                value={codeTyped}
                onChange={handleCodeChange}
                rows={20}
                cols={100}
                style={{backgroundColor:'black', color:'white'}}
            />
        </div>
        <div className="input-output-container" style={{display:'flex'}}>
            <div className="input-container">
                <label>Input</label>
                <textarea
                    name="postContent"
                    value={inputTyped}
                    onChange={handleInputChange}
                    rows={10}
                    cols={50}
                    style={{backgroundColor:'black', color:'white'}}
                />
            </div>
            <div className="output-container">
                <label>Output</label>
                <textarea
                    name="postContent"
                    value={outputValue}
                    rows={10}
                    cols={50}
                    style={{backgroundColor:'black', color:'white'}}
                    readOnly={true}
                />
            </div>
        </div>
        <div className="controllers">
            <button onClick={handleButtonClick} style={{backgroundColor:'#C6DBDA'}}> Back </button>
            <button onClick={handleButtonClick} style={{backgroundColor:'#FEF0D6'}}> Run </button>
            <button onClick={handleButtonClick} style={{backgroundColor:'#FACFCF'}}> Stop </button>
            <button onClick={handleButtonClick} style={{backgroundColor:'#D9CFDE'}}> Submit </button>
        </div>
      </div>
      <hr />
    </div>
    )
}

export default Problem
