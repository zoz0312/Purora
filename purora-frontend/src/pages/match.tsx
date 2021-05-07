import {$axios} from "@utils/axios";
import {useEffect, useState} from "react";
import useScrollPage from "../hooks/useScrollPage";
import LoginLayout from "@components/layout/login-layout";
import { moment } from '@utils/moment';

interface matchDataType {
  id: number;
  gameId: string;
  creation: string;
  duration: number;
  mode: string;
  version: string;
  UsersGameInfo: any[];
}

const MatchPage: React.FC = () => {
  const [matchData, setMatchData] = useState<matchDataType[]>([]);
  const { page, setTotalPages } = useScrollPage(1);

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
      setMatchData((value) => [...value, ...data]);
      setTotalPages(Math.floor(totalLength/getIndex));
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
    readMatchData();
  }, [offset]);

  return (
    <LoginLayout>
      { matchData.map((match, idx) => (
        <div key={idx} className={`bg-blue-200 flex flex-row shadow-lg mb-5 w-full border border-white rounded-xl`}>
          { gameType[match.mode] }
          { moment(+match.creation).format(format) }
        </div>
      ))}
    </LoginLayout>
  )
}

export default MatchPage;
