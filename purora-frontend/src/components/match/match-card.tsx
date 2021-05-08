import {moment} from "@utils/moment";
import MatchTeamDetail from "@components/match/match-team-detail";
import React, {useState} from "react";

interface MatchCardProps {
  match: any;
  gameType: any;
  champData: any;
  itemData: any;
  spellData: any;
}

const durationParse = (duration: number) => {
  const m = Math.floor(duration / 60);
  const s = duration % 60;
  return `${m}분 ${s}초`
}

const MatchCardComponent: React.FC<MatchCardProps> = (
  {
    match,
    gameType,
    champData,
    itemData,
    spellData,
  }
) => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const format = 'YY년 MM월 DD일 h:mm A';

  let maxDamage = 0;
  if (match.blue && match.red) {
    const damageFunction = (item: any) => {
      if (item === null) {
        return 0;
      }
      return item.gameData.participants.stats.totalDamageDealtToChampions
    };
    maxDamage = Math.max.apply(null, [
      ...match.blue.map(damageFunction),
      ...match.red.map(damageFunction),
    ]);
  }

  return (
    <div className={`max-w-4xl mx-auto bg-blue-50 flex flex-row text-gray-700 shadow md:shadow-lg mb-2 md:mb-5 w-full border border-white rounded-xl`}>
      <div className={'flex flex-col p-2 md:p-5 flex-grow'}>
        <div className={'flex flex-row items-end'}>
          <h1 className={'text-xl mr-2'}>{ gameType[match.mode] }</h1>
          { match.winStatus === 1 ? (
            <h2 className={'text-blue-500'}>블루팀 승리!</h2>
          ):(
            <h2 className={'text-red-500'}>레드팀 승리!</h2>
          )}</div>
        <div className={'flex flex-row items-end mb-1'}>
          <h3 className={'text-2xs md:text-sm'}>{ durationParse(match.duration) }</h3>
          <h3 className={'ml-2 text-2xs md:text-sm'}>({ moment(match.creation).format(format) })</h3>
        </div>
        { showDetail && (
          <div className={'flex flex-col'}>
            <div className={'flex flex-col'}>
              { match.blue?.map((blueUser: any, blueIdx: number) => (
                <MatchTeamDetail
                  key={blueIdx}
                  user={blueUser}
                  champData={champData}
                  itemData={itemData}
                  spellData={spellData}
                  maxDamage={maxDamage}
                />
              ))}
            </div>
            <div className={'w-full my-2 border-b border-gray-300 border-solid'} />
            <div className={'flex flex-col'}>
              { match.red?.map((redUser: any, redIdx: number) => (
                <MatchTeamDetail
                  key={redIdx}
                  user={redUser}
                  champData={champData}
                  itemData={itemData}
                  spellData={spellData}
                  maxDamage={maxDamage}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <button
        className={`w-8 md:w-10 flex-grow-0 rounded-r-xl p-2 md:p-3 text-white text-2xl md:text-3xl bg-blue-300 hover:bg-blue-200 btn-normal focus:outline-none`}
        onClick={()=>setShowDetail(value => !value)}
      >{ showDetail ? '-' : '+'}</button>
    </div>
  )
};

export default MatchCardComponent;