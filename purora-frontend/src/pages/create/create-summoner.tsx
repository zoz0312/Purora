import {Link, useHistory} from "react-router-dom";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {$axios} from "@utils/axios";
import {Helmet} from "react-helmet-async";
import LoginLayout from "@components/layout/login-layout";
import SummonerForm, {SummonerFormTypes} from "@components/summoner/summoner-form";

type FormInputs = {
  summonerName: string;
  summonerTier: string;
};

const CreateSummonerPage: React.FC = () => {
  const history = useHistory();

  const {
    errors,
    register,
    handleSubmit,
  } = useForm<FormInputs>({
    mode: 'onChange'
  });

  const onSubmit = async (data: FormInputs) => {
    const { summonerName, summonerTier } = data;

    if (!summonerName) {
      alert('소환사명을 입력해주세요!');
      return;
    }

    const result = await $axios({
      method: 'post',
      url: '/users/create-summoner',
      data: {
        summonerName,
        summonerTier,
      }
    });

    const {
      data: {
        success,
        message,
      }
    }:any = result;

    if (success) {
      history.push('/my/summoner')
    } else {
      if (message) {
        alert(Array.isArray(message) ? message[0] : message);
      }
    }
  }

  return (
    <LoginLayout>
      <Helmet>
        <title>소환사 생성하기 | 포로라</title>
      </Helmet>
      <SummonerForm
        type={SummonerFormTypes.create}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        errors={errors}
      />
    </LoginLayout>
  )
}

export default CreateSummonerPage;