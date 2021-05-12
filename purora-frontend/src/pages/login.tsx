import React, {useEffect, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import './login.scss';
import {$axios} from "../utils/axios";
import {AuthDispatchType, authMapDispatchToProps, authMapStateToProps, AuthStateType} from "@store/auth";
import {connect} from "react-redux";
import poro from '../image/poro.jpg';
import CircleLoading from "@components/loading/circle-loadig";

type FormInputs = {
  id: string;
  password: string;
};

interface LoginProps extends AuthStateType, AuthDispatchType {};

const Login: React.FC<LoginProps> = (
  {
    setLogin
  }
) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const {
    errors,
    register,
    handleSubmit,
  } = useForm<FormInputs>({
    mode: 'onChange'
  });

  const onSubmit = async (data: FormInputs) => {
    if (isLoading) {
      return;
    }
    const { id, password } = data;

    if (!id) {
      alert('ID를 입력해주세요!');
      return;
    }

    if (!password) {
      alert('Password를 입력해주세요!');
      return;
    }

    setLoading(true);

    try {
      const result = await $axios({
        method: 'post',
        url: '/users/login',
        data: {
          userId: id,
          userPw: password,
        }
      });

      const {
        data: {
          success,
          token,
          user,
        }
      }: any = result;

      if (success) {
        setLogin({
          token,
          user,
        });
      } else {
        alert('아이디 또는 비밀번호가 잘못되었습니다!')
      }
      setLoading(false);
    } catch (error) {
      alert('서버 통신에 문제가 발생하였습니다.');
      setLoading(false);
    }
  }

  return (
    <div className={'w-full h-full p-5 flex flex-col items-center justify-center article-login login-box'}>
      <Helmet>
        <title>로그인 | 포로라</title>
      </Helmet>
      <div className={'p-10 w-full sm:w-2/4 max-w-xl border border-gray-300 border-solid rounded bg-white'}>
        <div className={'flex items-center flex-col p-5'}>
          <img className={'w-40 h-40 rounded-full'} src={poro}/>
          <h3 className={'text-3xl mb-2 pt-5'}>포로라 로그인</h3>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={'flex flex-col justify-center'}
        >
          <input
            className="p-3 mt-2 outline-none border border-personal border-solid rounded"
            ref={register({
              required: '아이디를 입력해주세요',
            })}
            type="text"
            name="id"
            placeholder="ID"
            required
          />
          { errors.id?.message && (
            <>{ errors.id?.message }</>
          )}
          <input
            className="p-3 mt-2 outline-none border border-personal border-solid rounded"
            ref={register({
              required: '비밀번호를 입력해주세요',
            })}
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className={'w-full h-12 mt-2 btn-personal rounded'}
          >
            <CircleLoading isLoading={isLoading}>
              로그인
            </CircleLoading>
          </button>
          <Link
            to={'/create/account'}
            className={'text-blue-700 underline cursor-pointer'}
          >회원가입</Link>
        </form>
      </div>
    </div>
  );
}

export default connect(authMapStateToProps, authMapDispatchToProps)(Login);