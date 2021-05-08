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
      },
      participants: {
        stats: {
          item0,
          item1,
          item2,
          item3,
          item4,
          item5,
          item6,
        }
      },
    }
  } = userData;

  const champSrc = `${CDN_HOST}/${champion.version}/img/champion/${champion.image.full}`;
  const spell1Src = `${CDN_HOST}/${champion.version}/img/spell/${spell1.image.full}`;
  const spell2Src = `${CDN_HOST}/${champion.version}/img/spell/${spell2.image.full}`;
  const itmes = [item0, item1, item2, item3, item4, item5, item6];

  return (
    <div className={'flex flex-row'}>
      <div><img src={champSrc} alt={champion.name} /></div>
      <div className={'flex flex-col'}>
        <img src={spell1Src} alt={spell1.name} />
        <img src={spell2Src} alt={spell2.name} />
      </div>
      <div className={'flex flex-row'}>
        { itmes.map((item, itemIdx) => (
          <div key={itemIdx}>
            { item === 0 ? (
              <>NONE</>
            ):(
              <img src={`${CDN_HOST}/${champion.version}/img/item/${item}.png`} alt={itemData[item]} />
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
