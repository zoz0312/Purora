import {Helmet} from "react-helmet-async";
import React from "react";
import LoginLayout from "@components/layout/login-layout";

const MySummoner: React.FC = () => {
  return (
    <LoginLayout>
      <Helmet>
        <title>소환사 | Poro</title>
      </Helmet>
      소환사
    </LoginLayout>
  )
}

export default MySummoner;
