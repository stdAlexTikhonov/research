import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./Components/App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <App
    name={process.env.REACT_APP_NAME}
    version={process.env.REACT_APP_VERSION}
    env={process.env.NODE_ENV}
  />,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
