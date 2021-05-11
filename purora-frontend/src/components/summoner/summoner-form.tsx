import poro from "@image/poro.jpg";
import React from "react";
import {Tier} from "@utils/constants";

export enum SummonerFormTypes {
  create = 'create',
  modify = 'modify',
};

interface SummonerFormProps {
  type: SummonerFormTypes;
  handleSubmit: Function;
  onSubmit: Function;
  register: any;
  errors: any;
};

const SummonerForm: React.FC<SummonerFormProps> = (
  {
    type,
    handleSubmit,
    onSubmit,
    register,
    errors,
  }
) => {

  return (
    <div className={'flex flex-col items-center justify-center w-full'}>
      <div className={'flex items-center flex-col p-5 w-full'}>
        <img className={'w-40 h-40 rounded-full'} src={poro}/>
        <h3 className={'text-3xl mb-2 pt-5'}>
          { type === SummonerFormTypes.create && ('소환사 생성하기') }
          { type === SummonerFormTypes.modify && ('소환사 수정하기') }
        </h3>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={'flex flex-col justify-center w-full'}
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
        <select
          className={'p-3 mt-2 outline-none border border-personal border-solid rounded'}
          ref={register({
            required: '티어는 필수값 입니다.',
          })}
          name="summonerTier"
        >
          {Object.keys(Tier).map(key => (
            <option key={key} value={key}>
              { key }
            </option>
          ))}
        </select>
        <button
          type="submit"
          className={'w-full h-12 mt-2 btn-personal rounded'}
        >
          { type === SummonerFormTypes.create && ('소환사 추가하기') }
          { type === SummonerFormTypes.modify && ('소환사 수정하기') }
        </button>
      </form>
    </div>
  );
}

export default SummonerForm;