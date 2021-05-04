import React, {useEffect} from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import './Login.scss';
import {$axios} from "../utils/axios";
import {AuthDispatchType, authMapDispatchToProps, authMapStateToProps, AuthStateType} from "@store/auth";
import {connect} from "react-redux";

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
  const {
    errors,
    register,
    handleSubmit,
  } = useForm<FormInputs>({
    mode: 'onChange'
  });

  const onSubmit = async (data: FormInputs) => {
    const { id, password } = data;

    if (!id) {
      alert('ID를 입력해주세요!');
      return;
    }

    if (!password) {
      alert('Password를 입력해주세요!');
      return;
    }

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
      }
    }:any = result;

    if (success) {
      setLogin({
        token,
      });
    } else {
      alert('아이디 또는 비밀번호가 잘못되었습니다!')
    }
  }

  return (
    <div className={'w-full h-full flex flex-col items-center justify-center article-login login-box'}>
      <Helmet>
        <title>로그인 | 포로라</title>
      </Helmet>
      <h1 className={'text-5xl mb-5'}>포로라</h1>
      <div className={'p-10 w-2/4 max-w-xl border border-gray-300 border-solid rounded'}>
        <h3 className={'text-2xl mb-2'}>Login</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={'flex flex-col justify-center'}
        >
          <input
            className="p-3 mb-2 outline-none border border-personal border-solid rounded"
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
            className="p-3 mb-2 outline-none border border-personal border-solid rounded"
            ref={register({
              required: '비밀번호를 입력해주세요',
              // pattern: /^(?=.*\d)(?=.*[a-z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]*$/g
            })}
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          {/*{ errors.password?.type === 'pattern' && (*/}
          {/*  <>비밀번호는 최소 8자 이상이어야 합니다.</>*/}
          {/*)}*/}
          <button
            type="submit"
            className={'w-full h-12 btn-personal rounded'}
          >Login</button>
          <Link
            to={'/create-account'}
            className={'text-blue-700 underline cursor-pointer'}
          >회원가입</Link>
        </form>
      </div>
    </div>
  );
}

export default connect(authMapStateToProps, authMapDispatchToProps)(Login);