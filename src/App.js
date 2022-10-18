import React, { useState } from "react";
import Intro from "./components/Intro";
import Quiz from "./components/Quiz";

function App() {
  const [pages, setPages] = useState("intro");

  const components = {
    intro: <Intro setPages={setPages} />,
    quiz: <Quiz />,
  };

  return <main className="container">{components[pages]}</main>;
}

export default App;
