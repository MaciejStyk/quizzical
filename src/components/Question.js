import React from "react";

function Question(props) {
  const { id, question, answers, showCorrectAnswer, clickAnswer } = props;

  function removeAsciiFrom(string) {
    return string
      .replaceAll("&#039;", "'")
      .replaceAll("&quot;", '"')
      .replaceAll("&eacute;", "é")
      .replaceAll("&ldquo;", '"')
      .replaceAll("&rdquo;", '"');
  }

  function getClassName(answer) {
    let className = "question__answer";
    if (!showCorrectAnswer) {
      className += answer.isClicked ? " question__answer--clicked" : "";
    } else {
      className += answer.isTrue
        ? " question__answer--correct"
        : answer.isClicked
        ? " question__answer--incorrect"
        : " question__answer--not-picked";
    }
    return className;
  }

  const answersHtml = answers.map((answer) => (
    <span
      key={answer.id}
      className={getClassName(answer)}
      onClick={() => clickAnswer(id, answer.id)}
    >
      {removeAsciiFrom(answer.content)}
    </span>
  ));

  return (
    <div className="question">
      <h2>{removeAsciiFrom(question)}</h2>
      <div className="question__answers">{answersHtml}</div>
    </div>
  );
}

export default Question;
