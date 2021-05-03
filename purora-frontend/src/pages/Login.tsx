import React, {useEffect} from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import './Login.scss';

type FormInputs = {
  id: string;
};

const Login: React.FC = () => {
  const {
    errors,
    register,
    handleSubmit,
  } = useForm<FormInputs>({
    mode: 'onChange'
  });

  const onSubmit = (data: FormInputs) => {
    console.log('data', data)
  }

  return (
    <div className={'w-full h-full flex flex-col items-center justify-center article-login login-box'}>
      <Helmet>
        <title>Login | Poro</title>
      </Helmet>
      <h1 className={'text-5xl mb-5'}>Poro</h1>
      <div className={'p-10 w-2/4 max-w-xl border border-gray-200 border-solid rounded'}>
        <h3 className={'text-2xl mb-2'}>Login</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={'flex flex-col justify-center'}
        >
          <input
            className="p-3 mb-2 outline-none border border-personal border-solid rounded"
            ref={register({
              required: '아이디를 입력해주세요',
              minLength: 8,
            })}
            type="text"
            name="id"
            placeholder="ID"
            required
          />
          { errors.id?.message && (
            <>{ errors.id?.message }</>
          )}
          { errors.id?.type === 'minLength' && (
            <>비밀번호는 최소 8자 이상이어야 합니다.</>
          )}
          <input
            className="p-3 mb-2 outline-none border border-personal border-solid rounded"
            ref={register({
              required: '비밀번호를 입력해주세요',
              minLength: 8,
            })}
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className={'w-full h-10 btn-personal rounded'}
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

export default Login;