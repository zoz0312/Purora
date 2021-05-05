import {Helmet} from "react-helmet-async";
import React from "react";
import LoginLayout from "@components/layout/login-layout";

const MyProfile: React.FC = () => {
  return (
    <LoginLayout>
      <Helmet>
        <title>내 정보 | Poro</title>
      </Helmet>
      내 정보
    </LoginLayout>
  )
}

export default MyProfile;