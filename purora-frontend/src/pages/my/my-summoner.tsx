import {Helmet} from "react-helmet-async";
import React, {useEffect, useMemo, useState} from "react";
import { Link } from 'react-router-dom';
import LoginLayout from "@components/layout/login-layout";
import {$axios} from "@utils/axios";
import MySummonerDetail from "@components/modal/my-summoner-detail";
import CircleLoading from "@components/loading/circle-loadig";

const MySummoner: React.FC = () => {
  const [summonerInfo, setSummonerInfo] = useState([]);
  const hasData = useMemo(() => summonerInfo.length !== 0, [summonerInfo]);
  const [detailModal, setDetailModal] = useState(false);
  const [detailData, setDetaildata] = useState({ id: 0});
  const [isLoading, setLoading] = useState<boolean>(false);

  const getMySummoner = async () => {
    try {
      const {
        data: {
          success,
          error,
          message,
          usersSummonerInfo
        }
      }: any = await $axios({
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
    } catch (error) {
      alert('서버 통신에 문제가 발생하였습니다.');
    }
  }

  const initalizeMatchData = async (summonerIndex: number) => {
    if (isLoading) {
      return;
    }
    setLoading(true);
    try {
      const {
        data: {
          success,
          error,
          message,
        }
      }: any = await $axios({
        method: 'post',
        url: '/poro/initalize-match-data',
        data: {
          beginIndex: 0,
          endIndex: 30,
          summonerIndex: summonerIndex,
        }
      });

      if (success) {
        alert('성공적으로 갱신되었습니다!');
      } else {
        if (error) {
          alert(error);
        }
        if (message) {
          alert(message);
        }
      }
      setLoading(false);
    } catch (error) {
      alert('서버 통신에 문제가 발생하였습니다.');
      setLoading(false);
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
          <div key={summoner.id} className={'flex flex-row mt-3'}>
            <div
              className={`flex flex-row shadow-md px-5 py-3 w-full ${summoner.token !== null ? 'rounded-l-xl' : 'rounded-xl' } bg-white cursor-pointer hover:bg-personal-1 hover:text-white transition`}
              onClick={() => detailButton(index)}
            >
              <div className={'flex-grow flex flex-row'}>
                <div className={'flex-grow flex flex-row items-center'}>
                  <div className={'mr-2'}>
                    {index + 1}
                  </div>
                  <div className={''}>
                    {summoner.summonerName}
                  </div>
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
            { summoner.token !== null && (
              <button
                className={'flex-grow-0 w-40 btn-normal py-1 px-2 text-white rounded-r-xl bg-blue-500 hover:bg-blue-300 focus:outline-none'}
                onClick={() => { initalizeMatchData(summoner.id) }}
              >
                <CircleLoading isLoading={isLoading}>
                  전적갱신하기
                </CircleLoading>
              </button>
            )}
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
