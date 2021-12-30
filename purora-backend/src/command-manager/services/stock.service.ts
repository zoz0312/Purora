import { Injectable } from '@nestjs/common';
import { ChatBotInput, ChatBotOutput } from 'src/common/dtos/chatBot.dto';
import { STOCK_SEARCH } from '../command-manager.constants';
import { trimInput } from "../../common/utils";
import axios from "axios";
import * as moment from 'moment-timezone';

/*
  @author AJu (zoz0312)
  주식 관련 명령어
*/
@Injectable()
export class StockManagerService {
  // Call mainService by controller
  async mainService (
    chatBotInput :ChatBotInput,
    name: string,
  ): Promise<ChatBotOutput> {
    switch (name) {
      case STOCK_SEARCH:
        return this.stockSearch(chatBotInput);
      default:
        return {
          success: false,
          message: `${name}은 잘못 되었습니다.`
        }
    }
  }

  async stockSearch (
    chatBotInput :ChatBotInput
  ): Promise<ChatBotOutput> {
    const [_, args] = trimInput(chatBotInput);
    const argSplit = args.split(',');
    const code = (argSplit[0]).toUpperCase();
    let startDate = argSplit[1] ?? '';
    let endDate = argSplit[2] ?? '';
    let getType = (argSplit[3] ?? 'day').toLowerCase();

    if (startDate) {
      const momentDate = moment(startDate);
      if(!momentDate.isValid()) {
        return {
          success: false,
          message: '시작 날짜가 잘못되었습니다.'
        }
      }
      startDate = momentDate.format('YYYYMMDD');
    } else {
      const current = moment();
      if (current.hours() < 9) {
        current.subtract(1, 'd');
      }
      startDate = current.format('YYYYMMDD');
    }

    if (endDate) {
      const momentDate = moment(endDate);
      if(!momentDate.isValid()) {
        return {
          success: false,
          message: '끝나는 날짜가 잘못되었습니다.'
        }
      }
      endDate = momentDate.format('YYYYMMDD');
    } else {
      endDate = moment().format('YYYYMMDD');
    }

    if (startDate > endDate) {
      return {
        success: false,
        message: '시작 날짜가 끝나는 날짜보다 클 수 없습니다. (X__X)',
      }
    }

    if (endDate > moment().format('YYYYMMDD')) {
      return {
        success: false,
        message: '끝나는 날짜가 현재 시간보다 클 수 없습니다. (X__X)',
      }
    }

    if (getType) {
      switch (getType) {
        case 'd':
        case 'da':
        case 'day':
          getType = 'day';
          break;
        case 'w':
        case 'we':
        case 'wee':
        case 'week':
          getType = 'week';
          break;
        case 'm':
        case 'mo':
        case 'mon':
        case 'mont':
        case 'month':
          getType = 'month';
          break;
      }
    }

    let stockCode = '';

    // 종목검색
    const searchStockNameURL = `https://ac.finance.naver.com/ac`;
    const { data: stockCodeData } = await axios.get(
      searchStockNameURL,
      {
        params: {
          q: code,
          q_enc: 'euc-kr',
          st: '111',
          r_format: 'json',
          r_unicode: '0',
          t_koreng: '0',
          r_lt: '111',
        }
      }
    );

    const sockElement = stockCodeData.items[0].find(element => {
      return element[0][0] === code || element[1][0] === code;
    });

    stockCode = sockElement[0][0];
    const stockName = sockElement[1][0];

    const stockPriceURL = `https://api.finance.naver.com/siseJson.naver`;
    const { data } = await axios.get(
      stockPriceURL,
      {
        params: {
          symbol: stockCode,
          requestType: 1,
          startTime: startDate,
          endTime: endDate,
          timeframe: getType,
        }
      }
    );

    if (!code) {
      return {
        success: false,
        message: `종목 코드가 없습니다`,
      }
    }

    const replaced = data.replace(/'/g, '"');
    const arr = JSON.parse(replaced);
    let message = `📈 ${stockName} (${stockCode})\n`;

    message += arr.map((item, index) => {
      let msg = `${item[0]}`;
      msg += ` | ${item[1]}${index !== 0 ? '원' : ''}`;
      return msg;
    }).join('\n');

    return {
      success: true,
      message: `${message}`
    };
  }
}