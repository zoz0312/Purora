import {
  WEATHER_HELP,
  WEATHER_SERVICE,
  WEATHER_WEEKLY_COMMAND,
} from 'src/command-manager/command-manager.constants';
import { WEATHER_COMMAND } from '../../../command-manager/command-manager.constants';

/*
  @author AJu (zoz0312)
  날씨 API 명령어 목록
*/
const service = WEATHER_SERVICE;
export const keywordWeatherManager: commandDTO[] = [
  // {
  //   service,
  //   name: WEATHER_HELP,
  //   command: ['날씨도움말', '날씨도움', '날씨도', '날씨?', '날?'],
  //   desc: '날씨 도움말',
  //   // argumentDesc: ['유저이름::챔피언'],
  // },
  {
    service,
    name: WEATHER_COMMAND,
    command: ['날씨', '날'],
    desc: '날씨',
    // argumentDesc: ['오전 or 오후'],
  },
  {
    service,
    name: WEATHER_WEEKLY_COMMAND,
    command: ['주간날씨', '주날'],
    desc: '주간날씨',
    // argumentDesc: ['오전 or 오후'],
  },
];
