import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ChatBotInput, ChatBotOutput } from '../../common/dtos/chatBot.dto';
import { trimInput } from '../../common/utils';
import { Status } from '../../user-custom-command/entities/working.entity';
import {
  CREATE_WORKING,
  DELETE_WORKING,
  UPDATE_WORKING,
  WEATHER_HELP,
  WEATHER_COMMAND,
} from '../command-manager.constants';
import { weatherCode, weatherIdList } from '../command-manager.constatnt';

/*
  @author AJu (zoz0312)
  Party 참가 유저 관련 명령어
*/
@Injectable()
export class WeatherService {
  constructor() {}

  // Call mainService by controller
  async mainService(
    chatBotInput: ChatBotInput,
    name: string,
  ): Promise<ChatBotOutput> {
    switch (name) {
      case WEATHER_HELP:
        return this.weatherHelp(chatBotInput);
      case WEATHER_COMMAND:
        return this.weather(chatBotInput);
      default:
        return {
          success: false,
          message: `${name}은 잘못 되었습니다.`,
        };
    }
  }

  async weatherHelp(chatBotInput: ChatBotInput): Promise<ChatBotOutput> {
    // TODO 날씨 도움말

    return {
      success: true,
      message: 'TODO',
    };
  }

  async weather(chatBotInput: ChatBotInput): Promise<ChatBotOutput> {
    const [_, arguement] = trimInput(chatBotInput);
    const [time] = arguement.split(' ');

    try {
      // TODO 날씨 API 연동

      // 날씨 검색
      // const searchWeatherURL = `http://apis.data.go.kr/1360000/MidFcstInfoService/getMidFcst`;
      // const { data: weatherData } = await axios.get(searchWeatherURL, {
      //   params: {
      //     serviceKey: process.env.WEATHER_KEY,
      //     numOfRows: 10,
      //     pageNo: 1,
      //     dataType: 'JSON',
      //     stnId: '108',
      //   },
      // });

      const searchWeatherURL = `https://weather.naver.com/today/api/nation/20220724/now`;
      const { data: weatherData } = await axios.get(searchWeatherURL);

      console.log('weatherData', weatherData);
      let message = '[전국날씨]\n';
      message += weatherIdList.reduce((prev, id) => {
        const { regionName, tmpr, wetrTxt, wetrCd } = weatherData[id];
        const icon = weatherCode[wetrCd] ? weatherCode[wetrCd].icon : '';
        return prev + `${regionName}: ${tmpr}°C ${wetrTxt}${icon}\n`;
      });

      return {
        success: true,
        message,
      };
    } catch (error) {
      console.log('error', error);
      return {
        success: false,
        error,
      };
    }
  }
}
