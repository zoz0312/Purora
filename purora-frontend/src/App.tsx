import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Routers from "@routers/index";
import {AuthDispatchType, authMapDispatchToProps, authMapStateToProps, AuthStateType} from "@store/auth";
import {connect} from "react-redux";

import './style/styles.css';


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <Routers />
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;
