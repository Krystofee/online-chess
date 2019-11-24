import React from "react";
import ReactDOM from "react-dom";

import "purecss/build/buttons-min.css";
import "purecss/build/grids-min.css";
import "purecss/build/pure-min.css";
import "purecss/build/tables-min.css";
import "purecss/build/menus-min.css";
import "purecss/build/forms-min.css";
import "purecss/build/base-min.css";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
