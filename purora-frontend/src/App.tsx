import React from 'react';
import './style/tailwind.css'
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Routers from "@routers/index";
import {AuthDispatchType, authMapDispatchToProps, authMapStateToProps, AuthStateType} from "@store/auth";
import {connect} from "react-redux";

interface AppProps extends AuthStateType, AuthDispatchType {};

const App: React.FC<AppProps> = ({
  user,
  token,
}) => {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <Routers user={user} token={token} />
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default connect(authMapStateToProps, authMapDispatchToProps)(App);
