import React from 'react';
import { Helmet } from 'react-helmet-async';
import './Login.scss';
import { authMapDispatchToProps, AuthDispatchType } from '@store/auth';
import { connect } from 'react-redux';

interface LoginPageProps extends AuthDispatchType {};

const Login: React.FC<LoginPageProps> = ({
   setLoginInfo,
 }) => {
  return (
    <div className={'flex flex-col items-center justify-center article-login login-box'}>
      <Helmet>
        <title>Login | Poro</title>
      </Helmet>
      <h1 className="text-white text-2xl md:text-6xl leading-loose mb-5">Poro Login</h1>
      {/*<LoginForm*/}
      {/*  setLoginInfo={setLoginInfo}*/}
      {/*/>*/}
    </div>
  );
}

export default connect(null, authMapDispatchToProps)(Login);