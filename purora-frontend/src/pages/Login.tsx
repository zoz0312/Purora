import React, {useEffect} from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
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
    <div className={'flex flex-col items-center justify-center article-login login-box'}>
      <Helmet>
        <title>Login | Poro</title>
      </Helmet>
      <h1 className="text-white text-2xl md:text-6xl leading-loose mb-5">Poro Login</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="p-3 mb-2 outline-none border border-gray-300 border-solid rounded-xl"
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
        <button type="submit">asd</button>
      </form>
      {/*<LoginForm*/}
      {/*  setLoginInfo={setLoginInfo}*/}
      {/*/>*/}
    </div>
  );
}

export default Login;