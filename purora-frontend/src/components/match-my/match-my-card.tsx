import {moment} from "@utils/moment";
import React, {useState} from "react";
import {durationParse, findDataById} from "@utils/functions";
import {CDN_HOST, gameType, gmaeTimeFormat} from "@utils/constants";
import ItemBoxComponent from "@components/match-common/item-box";
import ToolTip from "@components/tooltip/tooltip";

interface MatchMyCardProps {
  match: any;
  champData: any;
  itemData: any;
  spellData: any;
}

const MatchCardComponent: React.FC<MatchMyCardProps> = (
  {
    match,
    champData,
    itemData,
    spellData,
  }
) => {

  if (champData.length === 0 ||
    itemData.length === 0 ||
    spellData.length === 0
  ) {
    return (
      <div className={'bg-gray-200 my-0.5 text-center rounded-md text-gray-400 text-xl'}>
        ?
      </div>
    );
  }

  const {
    gameData: {
      participants: {
        stats,
        championId,
        spell1Id,
        spell2Id,
      },
      player,
    },
    gameInfo: {
      duration,
      creation,
      mode,
    }
  } = match;

  const champion = findDataById(champData, championId);
  const spell1 = findDataById(spellData, spell1Id);
  const spell2 = findDataById(spellData, spell2Id);

  const champSrc = `${CDN_HOST}/${champion.version}/img/champion/${champion.image.full}`;
  const spell1Src = `${CDN_HOST}/${champion.version}/img/spell/${spell1.image.full}`;
  const spell2Src = `${CDN_HOST}/${champion.version}/img/spell/${spell2.image.full}`;

  const itmes = [
    stats.item0,
    stats.item1,
    stats.item2,
    stats.item3,
    stats.item4,
    stats.item5,
    stats.item6
  ];

  const {
    deaths,
    kills,
    assists,
    totalDamageDealtToChampions,
    totalMinionsKilled,
    champLevel,
    doubleKills,
    tripleKills,
    quadraKills,
    pentaKills,
    visionScore,
    visionWardsBoughtInGame,
  } = stats;

  const kdaValue = ((kills + assists) / deaths).toFixed(2);
  const kda = deaths === 0 ? 'Prefect' : `${kdaValue}:1`;

  let killBadge = '';
  if (pentaKills > 0) {
    killBadge = '펜타킬';
  } else if (quadraKills > 0) {
    killBadge = '쿼드라킬';
  } else if (tripleKills > 0) {
    killBadge = '트리플킬';
  } else if (doubleKills > 0) {
    killBadge = '더블킬';
  }

  const bgColor = match.winStatus === 0 ? 'bg-blue-200' : 'bg-red-200';
  const btnBgColor = match.winStatus === 0 ? 'bg-blue-400 hover:bg-blue-300' : 'bg-red-400 hover:bg-red-300';


  return (
    <div className={`max-w-4xl mx-auto ${bgColor} flex flex-row text-gray-700 shadow md:shadow-lg mb-2 md:mb-3 w-full border border-white rounded-xl`}>
      <div className={'flex flex-col p-2 md:p-3 flex-grow'}>
        <div className={'flex flex-row items-end'}>
          <h1 className={'text-xl mr-2'}>{ gameType[mode] }</h1>
          { match.winStatus === 0 ? (
            <h2 className={'text-blue-500'}>승리</h2>
          ):(
            <h2 className={'text-red-500'}>패배</h2>
            )}
        </div>
        <div className={'flex flex-row items-end mb-1'}>
          <h3 className={'text-2xs md:text-sm'}>{ durationParse(duration) }</h3>
          <h3 className={'ml-2 text-2xs md:text-sm'}>({ moment(+creation).format(gmaeTimeFormat) })</h3>
        </div>
        <div className={'flex flex-row justify-center items-center'}>
          <div className={'flex flex-col justify-center items-center'}>
            <div className={'flex flex-row'}>
              <div className={'w-14 flex flex-col justify-center items-center'}>
                <img className={'w-10 h-10 md:w-14 md:h-14 rounded-full'} src={champSrc} alt={champion.name} />
              </div>
              <div className={'flex flex-col mx-0.5'}>
                <div className={'w-5 h-5 md:w-7 md:h-7 tooltip-box'}>
                  <img className={'rounded-sm md:rounded-md'} src={spell1Src} alt={spell1.name} />
                  <ToolTip>
                    <div className={'text-sm text-yellow-400'}>{ spell1.name }</div>
                    <div className={'text-xs'}>{ spell1.description }</div>
                  </ToolTip>
                </div>
                <div className={'w-5 h-5 md:w-7 md:h-7 tooltip-box'}>
                  <img className={'rounded-sm md:rounded-md'} src={spell2Src} alt={spell2.name} />
                  <ToolTip>
                    <div className={'text-sm text-yellow-400'}>{ spell2.name }</div>
                    <div className={'text-xs'}>{ spell2.description }</div>
                  </ToolTip>
                </div>
              </div>
            </div>
            <div className={'text-xs md:text-base'}>{champion.name}</div>
          </div>
          <div className={'flex flex-col items-center ml-1 md:ml-2'}>
            <div className={'flex flex-row'}>
              <div className={'text-xs md:text-xl'}>{ stats.kills }</div>
              <div className={'text-xs md:text-xl'}>/</div>
              <div className={'text-xs md:text-xl'}>{ stats.deaths }</div>
              <div className={'text-xs md:text-xl'}>/</div>
              <div className={'text-xs md:text-xl'}>{ stats.assists }</div>
            </div>
            <div className={'flex flex-row w-15'}>
              <div className={`text-2xs md:text-base ${(+kdaValue > 3) && 'text-blue-700'}`}>{ kda }</div>
            </div>
            { killBadge !== '' && (
              <div className={'px-1 py-0.5 mt-0.5 rounded-full text-white bg-red-500 text-2xs md:text-xs'}>{ killBadge }</div>
            )}
          </div>
          <div className={'flex flex-col items-center ml-1 md:ml-2'}>
            <div className={'text-2xs md:text-base'}>
              레벨 { champLevel }
            </div>
            <div className={'text-2xs md:text-base'}>
              CS { totalMinionsKilled }
            </div>
            <div className={'text-2xs md:text-base'}>
              시야점수 { visionScore }
            </div>
            <div className={'text-2xs md:text-base'}>
              제어와드 { visionWardsBoughtInGame }
            </div>
          </div>
          <div className={'flex flex-col md:flex-row w-32 md:w-auto ml-1 md:ml-2'}>
            <div className={'flex flex-row'}>
              { itmes.filter((_, idx) => (idx < 3))
                .map((item, itemIdx) => (
                    <ItemBoxComponent
                      key={itemIdx}
                      className={'w-7 h-7 md:w-10 md:h-10 mr-0.5'}
                      version={champion.version}
                      item={item}
                      itemData={itemData[item]}
                    />
                  )
                )}
            </div>
            <div className={'flex flex-row'}>
              { itmes.filter((_, idx) => (idx >= 3))
                .map((item, itemIdx) => (
                    <ItemBoxComponent
                      key={itemIdx}
                      className={'w-7 h-7 md:w-10 md:h-10 mr-0.5'}
                      version={champion.version}
                      item={item}
                      itemData={itemData[item]}
                    />
                  )
                )}
            </div>
          </div>
        </div>
        {/*<div className={`${btnBgColor} mt-1 text-center rounded-md text-white text-base cursor-pointer`}>*/}
        {/*  게임 자세히 보기*/}
        {/*</div>*/}
      </div>
      {/*<button*/}
      {/*  className={`w-8 md:w-10 flex-grow-0 rounded-r-xl p-2 md:p-3 text-white text-2xl md:text-3xl ${btnBgColor} btn-normal focus:outline-none`}*/}
      {/*  onClick={()=> { /* TODO: 해당 게임 상세보기 페이지로 이동 *!/}*/}
      {/*>+</button>*/}
    </div>
  )
};

export default MatchCardComponent;