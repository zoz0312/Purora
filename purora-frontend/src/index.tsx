import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.scss';
import {Provider} from "react-redux";
import rootStore from "@store/index";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={rootStore}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
