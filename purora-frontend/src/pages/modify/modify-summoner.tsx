import { useHistory, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {$axios} from "@utils/axios";
import {Helmet} from "react-helmet-async";
import LoginLayout from "@components/layout/login-layout";
import SummonerForm, {SummonerFormTypes} from "@components/summoner/summoner-form";
import CircleLoading from "@components/loading/circle-loadig";

type FormInputs = {
  summonerName: string;
};

const ModifySummonerPage: React.FC = () => {
  const history = useHistory();
  const params = useParams<{ summonerId: string; }>();
  const summonerId = +params.summonerId;
  const [isLoading, setLoading] = useState<boolean>(false);

  const getMySummoner = async () => {
    if (isLoading) {
      return;
    }
    try {
      setLoading(true);
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
        history.push('/my/summoner');
      }
      setLoading(false);
    } catch (error) {
      alert('서버 통신에 문제가 발생하였습니다.');
      setLoading(false);
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
    if (isLoading) {
      return;
    }
    const { summonerName } = data;

    if (!summonerName) {
      alert('소환사명을 입력해주세요!');
      return;
    }

    setLoading(true);

    const result = await $axios({
      method: 'patch',
      url: '/users/modify-summoner',
      data: {
        summonerId,
        summonerName,
      }
    });

    try {
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert('서버 통신에 문제가 발생하였습니다.');
    }
  }

  const deleteSummoner = async (id: number) => {
    if (isLoading) {
      return;
    }

    if (!window.confirm('선택한 소환사는 삭제되지만 전적은 삭제되지 않습니다.\n정말 삭제하시겠습니까?')) {
      return
    }

    try {
      setLoading(true);
      const { data: {
        success,
        error,
        message,
      } }: any = await $axios({
        url: `/users/delete-summoner`,
        method: 'delete',
        data: {
          summonerId: id,
        }
      });

      if (success) {
        alert('정상적으로 삭제되었습니다!');
        history.push('/my/summoner');
      } else {
        if (error) {
          alert(error.name);
        }
        if (message) {
          alert(message);
        }
      }
      setLoading(false);
    } catch (e) {
      alert('서버 통신에 문제가 발생하였습니다.');
      setLoading(false);
    }
  }

  return (
    <LoginLayout>
      <Helmet>
        <title>소환사 수정하기 | 포로라</title>
      </Helmet>
      <div className={'max-w-xl mx-auto'}>
        <SummonerForm
          type={SummonerFormTypes.modify}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          register={register}
          errors={errors}
          isLoading={isLoading}
        />
        <div className={'w-full flex items-center justify-center mt-2'}>
          <button
            type="button"
            className="w-full h-12 rounded border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 "
            onClick={() => deleteSummoner(summonerId)}
          >
            <CircleLoading isLoading={isLoading}>
              소환사 삭제하기
            </CircleLoading>
          </button>
        </div>
      </div>
    </LoginLayout>
  )
}

export default ModifySummonerPage;