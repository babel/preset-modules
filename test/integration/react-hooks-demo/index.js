import React, { useState, useContext, createContext } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import ThemeContext from "./context";

import Comments from "./Comments";

function App(props) {
  const [theme, setTheme] = useState("light");

  return (
    <div {...props}>
      <Comments />
    </div>
  );
}

App = styled(App)`
  font-family: sans-serif;
  font-family: "Nunito";
  text-align: center;
  box-sizing: border-box;

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
