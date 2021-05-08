import {CDN_HOST} from "@utils/constants";

interface MatchPlayerProps {
  userData: any;
  champion: any;
  spell1: any;
  spell2: any;
  itemData: any;
};

const MatchPlayerComponent: React.FC<MatchPlayerProps> = (
  {
    userData,
    champion,
    spell1,
    spell2,
    itemData,
  }
) => {
  const {
    gameData: {
      player: {
        accountId,
        summonerName,
      },
      participants: {
        stats
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

  const kda = stats.deaths === 0 ? 'Prefect' : `${((stats.kills + stats.assists) / stats.deaths).toFixed(2)}:1 평점`;

  return (
    <div className={'flex flex-row justify-center items-center my-0.5'}>
      <div className={'w-15 flex flex-col justify-center items-center'}>
        <img className={'w-10 h-10 rounded-full'} src={champSrc} alt={champion.name} />
        <div className={'text-sm'}>{champion.name}</div>
      </div>
      <div className={'flex flex-col mx-1'}>
        <img className={'w-6 h-6 rounded-md'} src={spell1Src} alt={spell1.name} />
        <img className={'w-6 h-6 rounded-md'} src={spell2Src} alt={spell2.name} />
      </div>
      <div className={'w-20 mx-2'}>
        { summonerName }
      </div>
      <div className={'flex flex-col items-center mx-2'}>
        <div className={'flex flex-row'}>
          <div>{ stats.kills }</div>
          <div>/</div>
          <div>{ stats.deaths }</div>
          <div>/</div>
          <div>{ stats.assists }</div>
        </div>
        <div className={'flex flex-row w-20'}>
          <div>{ kda }</div>
        </div>
      </div>
      <div className={'flex flex-row'}>
        { itmes.map((item, itemIdx) => (
          <div key={itemIdx} className={'w-8 h-8 bg-gray-300 rounded-lg mr-0.5'}>
            { item !== 0 && (
              <img
                className={'rounded-lg'}
                src={`${CDN_HOST}/${champion.version}/img/item/${item}.png`} alt={itemData[item]} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
  return (
    <>
    </>
  )
};

export default MatchPlayerComponent;
