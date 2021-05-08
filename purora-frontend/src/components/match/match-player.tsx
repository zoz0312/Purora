import {CDN_HOST} from "@utils/constants";

interface MatchPlayerProps {
  userData: any;
  champion: any;
  spell1: any;
  spell2: any;
  itemData: any;
  maxDamage: number;
};

const MatchPlayerComponent: React.FC<MatchPlayerProps> = (
  {
    userData,
    champion,
    spell1,
    spell2,
    itemData,
    maxDamage,
  }
) => {
  const {
    gameData: {
      player: {
        accountId,
        summonerName,
      },
      participants: {
        stats,
      },
    }
  } = userData;

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
  } = stats

  const kda = deaths === 0 ? 'Prefect' : `${((kills + assists) / deaths).toFixed(2)}:1`;
  const damagePercent = (totalDamageDealtToChampions / maxDamage) * 100;

  return (
    <div className={'flex flex-row justify-center items-center md:my-0.5'}>
      <div className={'flex flex-col items-center text-center'}>
        <div className={'flex flex-row'}>
          <div className={'w-10 flex flex-col justify-center items-center'}>
            <img className={'w-8 h-8 rounded-full'} src={champSrc} alt={champion.name} />
            {/*<div className={'text-2xs md:text-sm'}>{champion.name}</div>*/}
          </div>
          <div className={'flex flex-col mx-0.5'}>
            <img className={'w-4 h-4 rounded-sm md:rounded-md'} src={spell1Src} alt={spell1.name} />
            <img className={'w-4 h-4 rounded-sm md:rounded-md'} src={spell2Src} alt={spell2.name} />
          </div>
        </div>
        <div className={'w-10 md:w-20 mx-1 text-2xs md:text-base mt-0.5'}>
          { summonerName }
        </div>
      </div>
      <div className={'flex flex-col items-center mx-1 md:mx-2'}>
        <div className={'flex flex-row'}>
          <div className={'text-xs md:text-base'}>{ stats.kills }</div>
          <div className={'text-xs md:text-base'}>/</div>
          <div className={'text-xs md:text-base'}>{ stats.deaths }</div>
          <div className={'text-xs md:text-base'}>/</div>
          <div className={'text-xs md:text-base'}>{ stats.assists }</div>
        </div>
        <div className={'flex flex-row w-15'}>
          <div className={'text-2xs md:text-base'}>{ kda }</div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center py-3 mr-1 md:mr-2">
        <span className="text-2xs md:text-sm text-gray-500">레벨:{ champLevel }</span>
        <span className="text-2xs md:text-sm text-gray-500">{ totalMinionsKilled } CS</span>
      </div>
      <div className="hidden md:inline-block  w-12 md:w-28 mx-1 md:mx-2">
        <div className="w-full h-4 md:h-6 bg-gray-400 relative">
          <span className="text-xs md:text-base absolute t-0 w-full text-center text-white font-bold h-full">{ totalDamageDealtToChampions }</span>
          <div
            className="bg-red-500 h-4 md:h-6"
            style={{
              width: `${damagePercent}%`
            }}>
          </div>
        </div>
      </div>
      <div className={'flex flex-wrap w-28 md:w-auto'}>
        { itmes.map((item, itemIdx) => (
          <div key={itemIdx} className={'w-6 h-6 md:w-8 md:h-8 bg-gray-300 rounded-md mr-0.5'}>
            { item !== 0 && (
              <img
                className={'rounded-md'}
                src={`${CDN_HOST}/${champion.version}/img/item/${item}.png`} alt={itemData[item].name} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
};

export default MatchPlayerComponent;
