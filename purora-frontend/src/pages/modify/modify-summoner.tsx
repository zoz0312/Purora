import {Link, useHistory, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {$axios} from "@utils/axios";
import {Helmet} from "react-helmet-async";
import LoginLayout from "@components/layout/login-layout";
import SummonerForm, {SummonerFormTypes} from "@components/summoner/summoner-form";

type FormInputs = {
  summonerName: string;
};

const ModifySummonerPage: React.FC = () => {
  const history = useHistory();
  const params = useParams<{ summonerId: string; }>();
  const summonerId = +params.summonerId;

  const getMySummoner = async () => {
    const { data: {
      success,
      error,
      message,
      usersSummonerInfo,
    } }: any = await $axios({
      method: 'get',
      url: `/users/read-summoner/${summonerId}`,
    });

    if (success) {
      reset({
        summonerName: usersSummonerInfo.summonerName
      })
    } else {
      if (error) {
        alert(error);
      }
      if (message) {
        alert(message);
      }
    }
  }

  useEffect(() => {
    getMySummoner();
  }, [])

  const {
    errors,
    register,
    handleSubmit,
    reset,
  } = useForm<FormInputs>({
    mode: 'onChange',
  });

  const onSubmit = async (data: FormInputs) => {
    const { summonerName } = data;

    if (!summonerName) {
      alert('소환사명을 입력해주세요!');
      return;
    }

    const result = await $axios({
      method: 'patch',
      url: '/users/modify-summoner',
      data: {
        summonerId,
        summonerName,
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
        <title>소환사 수정하기 | 포로라</title>
      </Helmet>
      <SummonerForm
        type={SummonerFormTypes.modify}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        errors={errors}
      />
    </LoginLayout>
  )
}

export default ModifySummonerPage;