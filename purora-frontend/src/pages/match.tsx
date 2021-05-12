import {$axios} from "@utils/axios";
import React, {useEffect, useMemo, useState} from "react";
import useScrollPage from "@hooks/useScrollPage";
import LoginLayout from "@components/layout/login-layout";
import useRiotData from "@hooks/useRiotData";
import {Helmet} from "react-helmet-async";
import MatchCard from "@components/match-all/match-card";
import MenuBar from "@components/menu/menu-bar";

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

// const menus: any = {
//   ALL_MATCH: '전체 전적',
//   MY_MATCH: '나의 전적'
// }

const gameType: any = {
  ARAM: '칼바람 나락',
  CLASSIC: '소환사의 협곡',
};

const MatchPage: React.FC = () => {
  const [matchData, setMatchData] = useState<matchDataType[]>([]);
  // const [menu, setMenu] = useState(menus.ALL_MATCH);
  const { page, setTotalPages } = useScrollPage(1);

  const [champData, itemData, spellData]: any[] = useRiotData();

  const getIndex = 15; // limit 개수 만큼 가져옵니다
  const [offset, setOffset] = useState<number>(getIndex);

  const readMatchData = async () => {
    try {
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

          for (let i = 0; i < 5; i++) {
            if (!item.blue[i]) {
              item.blue[i] = null;
            }
            if (!item.red[i]) {
              item.red[i] = null;
            }
          }
          delete (item.UsersGameInfo);
          return item;
        });
        setMatchData((value) => [...value, ...parsed]);
        setTotalPages(Math.floor(totalLength / getIndex));
      } else {
        if (error) {
          alert(message);
        }
        if (message) {
          alert(message);
        }
      }
    } catch (error) {
      alert('서버 통신에 문제가 발생하였습니다.');
    }
  }

  useEffect(() => {
    setOffset(page * getIndex);
  }, [page]);

  // useEffect(() => {
  //   console.log('itemData', itemData);
  //   console.log('spellData', spellData)
  // }, [itemData, spellData])

  useEffect(() => {
    readMatchData();
  }, [offset]);

  return (
    <LoginLayout>
      <Helmet>
        <title>전체 전적조회 | 포로라</title>
      </Helmet>
      {/*<MenuBar*/}
      {/*  className={'my-2'}*/}
      {/*  menus={menus}*/}
      {/*  menu={menu}*/}
      {/*  setMenu={setMenu}*/}
      {/*/>*/}
      { matchData.map((match, idx) => (
          <MatchCard
            key={idx}
            match={match}
            champData={champData}
            itemData={itemData}
            spellData={spellData}
          />
        ))
      }

    </LoginLayout>
  )
}


export default MatchPage;
