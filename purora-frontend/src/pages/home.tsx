import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import LoginLayout from "@components/layout/login-layout";


const Home: React.FC = (): JSX.Element => {

  useEffect(() => {
  }, []);

  return (
    <LoginLayout>
      <Helmet>
        <title>Home | Poro</title>
      </Helmet>
      HOME
    </LoginLayout>
  )
}

export default Home;