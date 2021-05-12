import {useHistory} from "react-router-dom";
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
    const { summonerName, summonerTier } = data;

    if (!summonerName) {
      alert('소환사명을 입력해주세요!');
      return;
    }

    setLoading(true);

    try {
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
      }: any = result;

      if (success) {
        history.push('/my/summoner')
      } else {
        if (message) {
          alert(Array.isArray(message) ? message[0] : message);
        }
      }
      setLoading(false);
    } catch (error) {
      alert('서버 통신에 문제가 발생하였습니다.');
      setLoading(false);
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
        isLoading={isLoading}
      />
    </LoginLayout>
  )
}

export default CreateSummonerPage;