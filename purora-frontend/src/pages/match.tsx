import {$axios} from "@utils/axios";
import {useEffect, useState} from "react";
import useScrollPage from "../hooks/useScrollPage";
import LoginLayout from "@components/layout/login-layout";
import { moment } from '@utils/moment';
import useRiotData from "../hooks/useRiotData";
import {CDN_HOST} from "@utils/constants";
import MatchPlayerComponent from "@components/match/match-player";
import MatchTeam from "@components/match/match-team";

interface matchDataType {
  id: number;
  gameId: string;
  creation: string;
  duration: number;
  mode: string;
  version: string;
  UsersGameInfo: any[];
  blue?: any[];
  red?: any[];
}

const MatchPage: React.FC = () => {
  const [matchData, setMatchData] = useState<matchDataType[]>([]);
  const { page, setTotalPages } = useScrollPage(1);

  const [champData, itemData, spellData]: any[] = useRiotData();

  const getIndex = 15; // limit 개수 만큼 가져옵니다
  const [offset, setOffset] = useState<number>(getIndex);

  const gameType: any = {
    ARAM: '칼바람 나락',
    CLASSIC: '소환사의 협곡',
  };

  const format = 'YY년 MM월 DD일 h:mm A';

  const readMatchData = async () => {
    const { data: {
      success,
      error,
      message,
      data,
      totalLength,
    } }: any = await $axios({
      method: 'get',
      url: `/poro/read-match-all?beginIndex=${offset - getIndex}&endIndex=${offset}`,
    });

    if (success) {
      const parsed = data.map((item: any) => {
        item.creation = +item.creation;
        item.blue = [];
        item.red = [];
        item.UsersGameInfo.map((user: any) => {
          user.gameData = JSON.parse(user.gameData);
          if (user.gameData.participants.teamId === 100) { // blue
            item.blue.push(user);
          }
          if (user.gameData.participants.teamId === 200) { // red
            item.red.push(user);
          }
        });

        for (let i=0; i<5; i++) {
          if (!item.blue[i]) {
            item.blue[i] = null;
          }
          if (!item.red[i]) {
            item.red[i] = null;
          }
        }
        delete(item.UsersGameInfo);
        return item;
      });
      setMatchData((value) => [...value, ...parsed]);
      setTotalPages(Math.floor(totalLength/getIndex));
      console.log('matchData', matchData)
    } else {
      if (error) {
        alert(message);
      }
      if (message) {
        alert(message);
      }
    }
  }

  useEffect(() => {
    setOffset(page * getIndex);
  }, [page]);

  useEffect(() => {
    console.log('itemData', itemData);
    console.log('spellData', spellData)
  }, [itemData, spellData])

  useEffect(() => {
    readMatchData();
  }, [offset]);

  const durationParse = (duration: number) => {
    const m = Math.floor(duration / 60);
    const s = duration % 60;
    return `${m}분 ${s}초`
  }

  return (
    <LoginLayout>
      { matchData.map((match, idx) => (
        <div key={idx} className={`bg-blue-50 p-5 text-gray-700 flex flex-col shadow-lg mb-5 w-full border border-white rounded-xl`}>
          <h1 className={'text-xl'}>{ gameType[match.mode] }</h1>
          <div className={'flex flex-row items-end'}>
            <h3 className={'text-sm'}>{ durationParse(match.duration) }</h3>
            <h3 className={'ml-2 text-sm'}>({ moment(match.creation).format(format) })</h3>
          </div>
          <div className={'flex flex-col'}>
            <div className={'flex flex-row'}>
              { match.blue?.map((blueUser: any, blueIdx) => (
                <MatchTeam
                  user={blueUser}
                  champData={champData}
                  itemData={itemData}
                  spellData={spellData}
                />
              ))}
            </div>
            <div className={'flex flex-row'}>
              { match.red?.map((redUser: any, redIdx) => (
                <MatchTeam
                  user={redUser}
                  champData={champData}
                  itemData={itemData}
                  spellData={spellData}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </LoginLayout>
  )
}


export default MatchPage;
