import React, {useEffect, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import LoginLayout from "@components/layout/login-layout";
import {$axios} from "@utils/axios";
import {Tier} from "@utils/constants";


const Home: React.FC = (): JSX.Element => {
  const [summoners, setSummoners] = useState([]);

  const readAllSummonerMatch = async () => {
    try {
      const { data: {
        success,
        error,
        message,
        usersSummonerInfo,
      } }: any = await $axios({
        method: 'get',
        url: `/users/read-all-summoner-match`,
      });

      if (success) {
        setSummoners(usersSummonerInfo);
      } else {
        if (error) {
          alert(error.name);
        }
        if (message) {
          alert(message);
        }
      }
    } catch (e) {
      alert('서버 통신에 문제가 발생하였습니다.');
    }
  }


  useEffect(() => {
    readAllSummonerMatch();
  }, []);

  return (
    <LoginLayout>
      <Helmet>
        <title>Home | Poro</title>
      </Helmet>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >소환사 명 (유저명)</th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >Win</th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >Lose</th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >승률</th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >점수</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                { summoners.map((summoner: any) => {

                  let winRate = Math.floor(summoner.win / (summoner.win + summoner.lose) * 100);
                  if (isNaN(winRate)) {
                    winRate = 0;
                  }

                  let textColor = 'text-gray-800';
                  if (winRate > 70) {
                    textColor = 'text-blue-500';
                  } else if (winRate > 60) {
                    textColor = 'text-green-500';
                  }

                  let myTier = '랭크없음';
                  for (let key of Object.keys(Tier)) {
                    if (Tier[key].value < summoner.user.rating) {
                      myTier = Tier[key].name;
                    } else {
                      break;
                    }
                  }

                  return (
                    <tr key={summoner.user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          { summoner.user.summonerName } ({summoner.user.user.nickName})
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        { summoner.win }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        { summoner.lose }
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${textColor}`}>
                        { winRate }%
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap`}>
                        { myTier } ({ summoner.user.rating })
                      </td>
                    </tr>
                  )
                })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </LoginLayout>
  );
}

export default Home;