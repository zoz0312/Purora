import {$axios} from "@utils/axios";
import React, {useEffect, useMemo, useState} from "react";
import useScrollPage from "@hooks/useScrollPage";
import LoginLayout from "@components/layout/login-layout";
import useRiotData from "@hooks/useRiotData";
import {Helmet} from "react-helmet-async";
import MatcMyCard from "@components/match-my/match-my-card";

interface MyMatchDataType {
  id: number;
  gameId: string;
  creation: string;
  duration: number;
  mode: string;
  version: string;
  UsersGameInfo: any[];
}

const MyMatchPage: React.FC = () => {
  const [matchData, setMatchData] = useState<MyMatchDataType[]>([]);
  const { page, setTotalPages } = useScrollPage(1);

  const [champData, itemData, spellData]: any[] = useRiotData();

  const getIndex = 15; // limit 개수 만큼 가져옵니다
  const [offset, setOffset] = useState<number>(getIndex);

  const readMatchData = async () => {
    const { data: {
      success,
      error,
      message,
      data,
      totalLength,
    } }: any = await $axios({
      method: 'get',
      url: `/poro/read-match-user?beginIndex=${offset - getIndex}&endIndex=${offset}`,
    });

    if (success) {
      const parsed = data.map((item: any) => {
        item.gameData = JSON.parse(item.gameData);
        return item;
      });

      setMatchData((value) => [...value, ...parsed]);
      setTotalPages(Math.floor(totalLength/getIndex));
      console.log('parsed', parsed)
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
        <title>내 전적조회 | 포로라</title>
      </Helmet>
      { matchData.map((match, idx) => (
          <MatcMyCard
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


export default MyMatchPage;
