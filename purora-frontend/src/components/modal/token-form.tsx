import {useForm} from "react-hook-form";
import React, {useState} from "react";
import {$axios} from "@utils/axios";
import CircleLoading from "@components/loading/circle-loadig";

interface TokenFormProps {
  summonerId?: number;
}
type FormInputs = {
  riotId: string;
  riotPw: string;
};

const TokenForm: React.FC<TokenFormProps> = (
  {
    summonerId,
  }
) => {
  const {
    errors,
    register,
    handleSubmit,
  } = useForm<FormInputs>({
    mode: 'onChange'
  });

  const [isLoading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: FormInputs) => {
    if (isLoading) {
      return;
    }

    try {
      const {riotId, riotPw} = data;

      if (!riotId) {
        alert('Riot ID 를 입력해주세요!');
        return;
      }

      if (!riotPw) {
        alert('Riot PW 를 입력해주세요!');
        return;
      }

      if (!summonerId) {
        alert('summonerId가 없습니다.');
        return;
      }

      setLoading(true);

      const result = await $axios({
        method: 'post',
        url: '/poro/get-riot-token',
        data: {
          userId: riotId,
          userPw: riotPw,
          summonerId,
        }
      });

      const {
        data: {
          success,
          message,
          error,
        }
      }:any = result;

      if (success) {
        alert('토큰이 갱신되었습니다!');
      } else {
        if (message) {
          alert(message);
        }
        if (error) {
          alert(error.name);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert('서버 통신에 문제가 발생하였습니다.');
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={'flex flex-row justify-center items-center'}
      >
        <div className={'flex-grow'}>
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              ref={register({
                required: '아이디를 입력해주세요',
              })}
              type="text"
              name="riotId"
              id="riotId"
              placeholder="Riot ID"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              ref={register({
                required: '비밀번호를 입력해주세요',
              })}
              id="riotPw"
              type="password"
              name="riotPw"
              placeholder="Riot Password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          className={'flex-none p-5 ml-2 btn-personal rounded disabled:opacity-50 focus:outline-none'}
        >
          <CircleLoading isLoading={isLoading}>
            토큰 갱신
          </CircleLoading>
        </button>
      </form>
      <span className={'text-red-500'}>갱신에 사용하는 Riot 계정은 절대 저장하지 않습니다!</span>
    </>
  )
}

export default TokenForm;
