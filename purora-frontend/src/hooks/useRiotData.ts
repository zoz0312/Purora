import axios from 'axios';
import {useEffect, useState} from "react";

interface IUseRiotData {
};

const useRiotData = () => {
  const [champData, setChampData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [spellData, setSepllData] = useState([]);

  useEffect(() => {
    let curVersion = '11.9.1';
    axios.get('https://ddragon.leagueoflegends.com/api/versions.js')
      .then(res => {
        let version = res.data;
        version = version.replace('Riot.DDragon.versions', 'currentVersion');
        let currentVersion = ['11.9.1'];
        eval(version);
        curVersion = currentVersion[0];
        return axios.get(`https://ddragon.leagueoflegends.com/cdn/${curVersion}/data/ko_KR/champion.json`);
      })
      .then(res => {
        const { data: { data } } = res;
        if (data) {
          setChampData(data);
        }
        return axios.get(`https://ddragon.leagueoflegends.com/cdn/${curVersion}/data/ko_KR/item.json`);
      })
      .then(res => {
        const { data: { data } } = res;
        if (data) {
          setItemData(data);
        }
        return axios.get(`https://ddragon.leagueoflegends.com/cdn/${curVersion}/data/ko_KR/summoner.json`);
      })
      .then(res => {
        const { data: { data } } = res;
        if (data) {
          setSepllData(data);
        }
      })
  }, []);

  return [champData, itemData, spellData];
};

export default useRiotData;