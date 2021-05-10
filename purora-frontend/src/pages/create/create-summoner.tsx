import {Link, useHistory} from "react-router-dom";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {$axios} from "@utils/axios";
import {Helmet} from "react-helmet-async";
import poro from "@image/poro.jpg";
import {regexMatch, regexPw} from "@utils/regex";
import LoginLayout from "@components/layout/login-layout";

type FormInputs = {
  summonerName: string;
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
    const { summonerName } = data;

    if (!summonerName) {
      alert('소환사명을 입력해주세요!');
      return;
    }

    const result = await $axios({
      method: 'post',
      url: '/users/create-summoner',
      data: {
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
        <title>소환사 생성하기 | 포로라</title>
      </Helmet>
      <div className={'flex flex-col items-center justify-center'}>
        <div className={'flex items-center flex-col p-5'}>
          <img className={'w-40 h-40 rounded-full'} src={poro}/>
          <h3 className={'text-3xl mb-2 pt-5'}>소환사 생성하기</h3>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={'flex flex-col justify-center'}
        >
          <input
            className="p-3 mt-2 outline-none border border-personal border-solid rounded"
            ref={register({
              required: '소환사명을 입력해주세요',
              maxLength: {
                value: 16,
                message: '소환사명은 최대 16자 입니다.',
              }
            })}
            type="text"
            name="summonerName"
            placeholder="소환사명"
            required
          />
          { errors.summonerName?.message && (
            <>{ errors.summonerName?.message }</>
          )}
          <button
            type="submit"
            className={'w-full h-12 mt-2 btn-personal rounded'}
          >소환사 추가하기</button>
        </form>
      </div>
    </LoginLayout>
  )
}

export default CreateSummonerPage;