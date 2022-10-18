import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Question from "./Question";

function Quiz() {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [game, setGame] = useState({
    hasLoaded: false,
    isPlayed: true,
    isFinished: false,
  });

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5")
      .then((res) => res.json())
      .then(
        (result) => {
          setData(() => {
            const arrivingData = result.results;
            const trimmedData = arrivingData.map(trim);
            return trimmedData;
          });
          setGame({
            hasLoaded: true,
            isPlayed: true,
            isFinished: false,
          });
        },
        (error) => {
          setGame((prevGame) => ({ ...prevGame, hasLoaded: true }));
          setError(error);
        }
      );

    function trim(data) {
      return {
        id: nanoid(),
        question: data["question"],
        answers: createAnwersArray(
          data["incorrect_answers"],
          data["correct_answer"]
        ),
        showCorrectAnswer: false,
      };
    }

    function createAnwersArray(incorrectAnswers, correctAnswer) {
      const answersArray = [...incorrectAnswers, correctAnswer].map(
        (answer) => ({
          content: answer,
          isTrue: answer === correctAnswer,
          isClicked: false,
          id: nanoid(),
        })
      );
      return shuffle(answersArray);
    }

    function shuffle(array) {
      let currentIndex = array.length,
        randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }
      return array;
    }
  }, [game.isFinished]);

  function handleEndGame() {
    if (game.isPlayed) {
      setGame((prevGame) => ({ ...prevGame, isPlayed: false }));
      showAnswers();
    } else {
      setGame({
        hasLoaded: false,
        isPlayed: true,
        isFinished: true,
      });
    }
  }

  function showAnswers() {
    setData((prevData) =>
      prevData.map((question) => ({
        ...question,
        showCorrectAnswer: true,
      }))
    );
  }

  function countAnswers() {
    let count = 0;
    for (let question of data) {
      for (let answer of question.answers) {
        if (answer.isClicked && answer.isTrue) {
          count++;
        }
      }
    }
    return count;
  }

  function clickAnswer(questionID, answerID) {
    setData((prevData) =>
      prevData.map((question) => {
        return question.id === questionID
          ? {
              ...question,
              answers: question.answers.map((answer) => {
                return answer.id === answerID
                  ? { ...answer, isClicked: !answer.isClicked }
                  : { ...answer, isClicked: false };
              }),
            }
          : question;
      })
    );
  }

  const questionsHtml = data.map((question) => (
    <Question
      key={question.id}
      id={question.id}
      question={question.question}
      answers={question.answers}
      showCorrectAnswer={question.showCorrectAnswer}
      clickAnswer={clickAnswer}
    />
  ));

  if (error) {
    return (
      <div className="intro">
        <p className="bold">Error: {error.message}</p>
      </div>
    );
  } else if (!game.hasLoaded) {
    return (
      <div className="intro">
        <div className="loader"></div>
      </div>
    );
  } else {
    return (
      <div className="quiz">
        {questionsHtml}
        <div className="quiz__footer">
          {!game.isPlayed && (
            <h2>You scored {countAnswers()}/5 correct answers</h2>
          )}
          <button className="small-font" onClick={handleEndGame}>
            {game.isPlayed ? "Check answers" : "Play again"}
          </button>
        </div>
      </div>
    );
  }
}

export default Quiz;
