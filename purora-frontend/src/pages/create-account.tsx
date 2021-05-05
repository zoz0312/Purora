import {Helmet} from "react-helmet-async";
import poro from "../image/poro.jpg";
import {Link} from "react-router-dom";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {useHistory} from "react-router-dom";
import {$axios} from "../utils/axios";
import {regexPw, regexMatch} from "../utils/regex";

type FormInputs = {
  nickName: string;
  id: string;
  password: string;
  password2: string;
};

const CreateAccount: React.FC = () => {
  const history = useHistory();
  const [isSame, setIsSame] = useState(false);

  const {
    errors,
    register,
    handleSubmit,
  } = useForm<FormInputs>({
    mode: 'onChange'
  });

  const onSubmit = async (data: FormInputs) => {
    setIsSame(false);

    const { nickName, id, password, password2 } = data;

    if (!nickName) {
      alert('별명을 입력해주세요!');
      return;
    }

    if (!id) {
      alert('아이디를 입력해주세요!');
      return;
    }

    if (!password) {
      alert('비밀번호를 입력해주세요!');
      return;
    }

    if (!password2) {
      alert('비밀번호 확인을 입력해주세요!');
      return;
    }

    if (password !== password2) {
      setIsSame(true);
      return;
    }

    const result = await $axios({
      method: 'post',
      url: '/users/create-user',
      data: {
        nickName,
        userId: id,
        userPw: password,
      }
    });

    const {
      data: {
        success,
        message,
      }
    }:any = result;

    alert(Array.isArray(message) ? message[0] : message);

    if (success) {
      history.push('/')
    }
  }

  return (
    <div className={'w-full h-full p-5 flex flex-col items-center justify-center article-login login-box'}>
      <Helmet>
        <title>회원가입 | 포로라</title>
      </Helmet>
      <div className={'p-10 w-full sm:w-2/4 max-w-xl border border-gray-300 border-solid rounded'}>
        <div className={'flex items-center flex-col p-5'}>
          <img className={'w-40 h-40 rounded-full'} src={poro}/>
          <h3 className={'text-3xl mb-2 pt-5'}>포로라 회원가입</h3>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={'flex flex-col justify-center'}
        >
          <input
            className="p-3 mt-2 outline-none border border-personal border-solid rounded"
            ref={register({
              required: '별명을 입력해주세요',
              maxLength: {
                value: 16,
                message: '별명은 최대 16자 입니다.',
              }
            })}
            type="text"
            name="nickName"
            placeholder="별명"
            required
          />
          { errors.nickName?.message && (
            <>{ errors.nickName?.message }</>
          )}
          <input
            className="p-3 mt-2 outline-none border border-personal border-solid rounded"
            ref={register({
              required: '아이디를 입력해주세요',
              minLength: {
                value: 5,
                message: '아이디는 최소 5자 이상입니다.',
              }
            })}
            type="text"
            name="id"
            placeholder="아이디"
            required
          />
          { errors.id?.message && (
            <>{ errors.id?.message }</>
          )}
          <input
            className="p-3 mt-2 outline-none border border-personal border-solid rounded"
            ref={register({
              required: '비밀번호를 입력해주세요',
              validate: {
                pattern: (value) => {
                  const matchPw = regexMatch(value, regexPw);
                  return matchPw
                },
              },
              minLength: {
                value: 6,
                message: '비밀번호는 최소 6자 입니다.',
              },
              maxLength: {
                value: 15,
                message: '비밀번호는 최대 15자 입니다.',
              }
            })}
            type="password"
            name="password"
            placeholder="비밀번호"
            required
          />
          { errors.password?.message && (
            <>{ errors.password?.message }</>
          )}
          { errors.password?.type === 'pattern' && (
            <>비밀번호는 영문과 숫자가 반드시 포함되어야 하고, 특수문자까지 입력가능합니다.</>
          )}
          <input
            className="p-3 mt-2 outline-none border border-personal border-solid rounded"
            ref={register({
              required: '확인비밀번호를 입력해주세요',
              validate: {
                pattern: (value) => {
                  const matchPw = regexMatch(value, regexPw);
                  return matchPw
                },
              },
              minLength: {
                value: 6,
                message: '비밀번호는 최소 6자 입니다.',
              },
              maxLength: {
                value: 15,
                message: '비밀번호는 최대 15자 입니다.',
              },
            })}
            type="password"
            name="password2"
            placeholder="비밀번호 확인"
            required
          />
          { errors.password2?.message && (
            <>{ errors.password2?.message }</>
          )}
          { errors.password2?.type === 'pattern' && (
            <>비밀번호는 영문과 숫자가 반드시 포함되어야 하고, 특수문자까지 입력가능합니다.</>
          )}
          { isSame && (
            <>확인 비밀번호가 일치하지 않습니다!</>
          )}
          <button
            type="submit"
            className={'w-full h-12 mt-2 btn-personal rounded'}
          >회원가입</button>
          <Link
            to={'/'}
            className={'text-blue-700 underline cursor-pointer'}
          >로그인</Link>
        </form>
      </div>
    </div>
  )
}

export default CreateAccount;