import MatchPlayerComponent from "@components/match-all/match-player";
import {findDataById} from "@utils/functions";

interface MatchTeamDetailProps {
  user: any;
  champData: any;
  itemData: any;
  spellData: any;
  maxDamage: number;
};

const MatchTeamDetailComponent: React.FC<MatchTeamDetailProps> = (
  {
    user,
    champData,
    itemData,
    spellData,
    maxDamage,
  }
) => {
  if (user === null ||
    champData.length === 0 ||
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
      player: {
        accountId,
      },
      participants: {
        championId,
        spell1Id,
        spell2Id,
      },
    }
  } = user;

  const champion = findDataById(champData, championId);
  const spell1 = findDataById(spellData, spell1Id);
  const spell2 = findDataById(spellData, spell2Id);

  return (
    <MatchPlayerComponent
      key={ accountId }
      userData={user}
      champion={champion}
      spell1={spell1}
      spell2={spell2}
      itemData={itemData}
      maxDamage={maxDamage}
    />
  );
};

export default MatchTeamDetailComponent;