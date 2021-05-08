import {$axios} from "@utils/axios";
import React, {useEffect, useMemo, useState} from "react";
import useScrollPage from "../hooks/useScrollPage";
import LoginLayout from "@components/layout/login-layout";
import { moment } from '@utils/moment';
import useRiotData from "../hooks/useRiotData";
import {CDN_HOST} from "@utils/constants";
import MatchPlayerComponent from "@components/match/match-player";
import MatchTeamDetail from "@components/match/match-team-detail";
import {Helmet} from "react-helmet-async";
import MatchCard from "@components/match/match-card";

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

  return (
    <LoginLayout>
      <Helmet>
        <title>전체 전적 | 포로라</title>
      </Helmet>
      { matchData.map((match, idx) => (
        <MatchCard
          key={idx}
          match={match}
          gameType={gameType}
          champData={champData}
          itemData={itemData}
          spellData={spellData}
        />
      ))}
    </LoginLayout>
  )
}


export default MatchPage;
