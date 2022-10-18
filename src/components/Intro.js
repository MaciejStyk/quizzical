import React from "react";

function Intro(props) {
  return (
    <div className="intro">
      <h1>Quizzical</h1>
      <p>Test your knowledge about the world in our quiz</p>
      <button onClick={() => props.setPages("quiz")}>Start quiz</button>
    </div>
  );
}

export default Intro;
