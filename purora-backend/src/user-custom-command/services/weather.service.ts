import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ChatBotInput, ChatBotOutput } from '../../common/dtos/chatBot.dto';
import { trimInput } from '../../common/utils';
import { weatherCode, weatherIdList } from '../user-custom-command.constant';

/*
  @author AJu (zoz0312)
  Party 참가 유저 관련 명령어
*/
@Injectable()
export class WeatherService {
  constructor() {}

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
      let message = '[전국날씨]\n';
      message += weatherIdList.reduce((prev, id) => {
        const { regionName, tmpr, wetrTxt, wetrCd } = weatherData[id];
        const icon = weatherCode[wetrCd] ? weatherCode[wetrCd].icon : '';
        return prev + `\n${regionName}: ${tmpr}°C ${wetrTxt}${icon}`;
      }, '');

      return {
        success: true,
        message,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
  async weatherWeekly(): Promise<ChatBotOutput> {
    try {
      const extractSpanPattern = /(<([^>]+)>)/gi;
      const url =
        'https://search.naver.com/search.naver?where=nexearch&sm=top_sug.pre&fbm=0&acr=1&acq=%EC%A3%BC%EA%B0%84+%EB%82%A0%E3%85%86&qdt=0&ie=utf8&query=%EC%A3%BC%EA%B0%84+%EB%82%A0%EC%94%A8';
      const { data } = await axios.get(url);
      const [weekly] = data.split('<ul class="week_list">')[1].split('</ul>');

      let weeklyData = weekly.replace(extractSpanPattern, '');
      weeklyData = weeklyData
        .replace(/         /gi, '\n')
        .replace(/최저기온/gi, '')
        .replace(/최고기온/gi, '')
        .trim()
        .split('\n');

      let message =
        '[주간날씨]\n\n요일 | 날짜 | 오전 | 오후 | 최저기온 | 최고기온\n';
      weeklyData.map((item, index) => {
        const text = item.replace(/\s+/gi, ' ').split(' ');
        if (index === 0) {
          message += `\n[${text[0]} - ${text[1]}] ${text[3]} ${text[4]} | ${text[6]} ${text[7]} | ${text[8]} | ${text[10]}`;
        } else {
          message += `\n[${text[0]} - ${text[1]}] ${text[2]} ${text[3]} | ${text[4]} ${text[5]} | ${text[6]} | ${text[8]}`;
        }
      });

      return {
        success: true,
        message,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
}
