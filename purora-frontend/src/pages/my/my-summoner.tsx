import {Helmet} from "react-helmet-async";
import React, {useEffect, useMemo, useState} from "react";
import { Link } from 'react-router-dom';
import LoginLayout from "@components/layout/login-layout";
import {$axios} from "@utils/axios";
import MySummonerDetail from "@components/modal/my-summoner-detail";

const MySummoner: React.FC = () => {
  const [summonerInfo, setSummonerInfo] = useState([]);
  const hasData = useMemo(() => summonerInfo.length !== 0, [summonerInfo]);
  const [detailModal, setDetailModal] = useState(false);
  const [detailData, setDetaildata] = useState({ id: 0});

  const getMySummoner = async () => {
    const { data: {
      success,
      error,
      message,
      usersSummonerInfo
    } }: any = await $axios({
      method: 'get',
      url: '/users/read-my-summoner',
    });

    if (success) {
      setSummonerInfo(usersSummonerInfo);
    } else {
      if (error) {
        alert(error);
      }
      if (message) {
        alert(message);
      }
    }
  }

  useEffect(() => {
    getMySummoner();
  }, []);

  const detailButton = (index: number) => {
    setDetaildata(summonerInfo[index]);
    setDetailModal(true);
  }

  return (
    <LoginLayout>
      <Helmet>
        <title>내 소환사 목록 | Poro</title>
      </Helmet>

      { hasData && (
        summonerInfo.map((summoner: any, index) => (
          <div
            key={summoner.id}
            className={`flex flex-row shadow-md mt-3 p-5 w-full rounded-xl bg-white cursor-pointer hover:bg-personal-1 hover:text-white transition`}
            onClick={() => detailButton(index)}
          >
            <div className={'flex-grow flex flex-row'}>
              <div className={'mr-2'}>
                {index + 1}
              </div>
              <div className={''}>
                {summoner.summonerName}
              </div>
            </div>
            {/*<div className={'flex-none w-6 flex justify-center'}>*/}
              {/*<button className={'focus:outline-none text-red-500 hover:text-red-600'}>*/}
              {/*  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">*/}
              {/*    <path*/}
              {/*      fill-rule="evenodd"*/}
              {/*      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"*/}
              {/*      clip-rule="evenodd"/>*/}
              {/*  </svg>*/}
              {/*</button>*/}
            {/*</div>*/}
          </div>
        ))
      )}
      <Link
        to={'/create/summoner'}
        className={`flex flex-col items-center justify-center mt-3 p-5 w-full text-gray-500 border-4 border-dashed border-gray-400 rounded-xl bg-gray-200 cursor-pointer hover:bg-gray-300 transition`}
        // onClick={() => detailButton(index)}
      >
        <span className={'text-5xl'}>+</span>
        <span>소환사 추가하기</span>
      </Link>
      <MySummonerDetail
        show={detailModal}
        setShow={setDetailModal}
        detailData={detailData}
        getMySummoner={getMySummoner}
      />
    </LoginLayout>
  )
}

export default MySummoner;
