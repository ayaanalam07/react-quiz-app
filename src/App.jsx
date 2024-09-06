import axios from 'axios'
import React, { useRef, useState } from 'react'
import { useEffect } from 'react'

function App() {
  const [question, setQuestion] = useState([]);
  const [questionState, setQuestionState] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // For feedback message

  const checkedInput = useRef([]);

  useEffect(() => {
    axios("https://the-trivia-api.com/v2/questions")
      .then((res) => {
        console.log(res.data);
        setQuestion(res.data);
      }).catch((err) => {
        console.log(err);
      });
  }, []);

  // Shuffle array function
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Function to check the answer and move to the next question
  function nextQuestion() {
    const checkedButton = checkedInput.current.find(input => input.checked);
    if (checkedButton) {
      const selectedValue = checkedButton.value;
      const correctAnswer = question[questionState].correctAnswer;

      if (selectedValue === correctAnswer) {
        setFeedback(`You Get ${score + 1} marks
          You Are Pass`);
          setScore(prevScore => prevScore + 1); // Increment score if correct
      } if(selectedValue === 7) {
        setFeedback(`You Get ${score + 1} marks
          You Are Pass
          `);
      }else{
        setFeedback(`You Get ${score + 1} marks
          You Are Failed
          `);
      }

      // Proceed to the next question or end the quiz
      if (questionState < question.length - 1) {
        setQuestionState(questionState + 1);
        setFeedback(null); // Reset feedback for the next question
      } else {
        alert(`Quiz finished! Your score: ${score + 1}`);
      }
    } else {
      alert("Please select an answer!");
    }
  }

  return (
    <>
      <h1>Quiz App</h1>
      {question.length > 0 ? (
        <div>
          <h1>Q{questionState + 1}: {question[questionState].question.text}</h1>
          <ul>
            {shuffleArray([...question[questionState].incorrectAnswers, question[questionState].correctAnswer]).map((item, index) => {
              return (
                <li key={index}>
                  <input
                    type="radio"
                    name="choice"
                    id={item}
                    value={item}
                    ref={el => (checkedInput.current[index] = el)}
                  />
                  <label htmlFor={item}>{item}</label>
                </li>
              );
            })}
          </ul>
          <button onClick={nextQuestion}>Next</button>
          {feedback && <p>{feedback}</p>} {/* Display feedback */}
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
}

export default App;
