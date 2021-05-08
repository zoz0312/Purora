import MatchPlayerComponent from "@components/match/match-player";

const findDataById = (dataArray: any, id: number) => {
  if (dataArray) {
    for (const data in dataArray) {
      if (+dataArray[data].key === id) {
        return dataArray[data];
      }
    }
  }
  return {};
};

interface MatchTeamProps {
  user: any;
  champData: any;
  itemData: any;
  spellData: any;
};

const MatchTeamComponent: React.FC<MatchTeamProps> = (
  {
    user,
    champData,
    itemData,
    spellData,
  }
) => {
  if (user === null ||
    champData.length === 0 ||
    itemData.length === 0 ||
    spellData.length === 0
  ) {
    return (<div>NULL</div>);
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

  const champ = findDataById(champData, championId);
  const spell1 = findDataById(spellData, spell1Id);
  const spell2 = findDataById(spellData, spell2Id);

  return (
    <MatchPlayerComponent
      key={ accountId }
      userData={user}
      champion={champ}
      spell1={spell1}
      spell2={spell2}
      itemData={itemData}
    />
  );
}

export default MatchTeamComponent;