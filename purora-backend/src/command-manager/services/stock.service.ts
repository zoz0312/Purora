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
      current.subtract(7, 'd');
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

    if (!sockElement) {
      return {
        success: false,
        message: `존재하지 않는 종목입니다 X__x`,
      }
    }

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

    if (arr.length === 1) {
      return {
        success: false,
        message: `해당 날짜의 데이터가 없습니다 ㅠ__ㅠ`,
      }
    }

    // item
    // 0: 날짜
    // 1: 시가
    // 2: 고가
    // 3: 저가
    // 4: 종가
    // 5: 거래량
    // 6: 외국인소진률

    let prevPrice = 0;
    message += arr.map((item, index) => {
      let msg = '';
      if (index === 0) {
        msg = `${item[0]} | ${item[4]}(이전대비)`;
      } else {
        const price = +item[4];
        msg = `${moment(item[0]).format('YY.MM.DD')}`;
        msg += ` | ${price.toLocaleString()}원`;
        if (prevPrice !== 0) {
          const diff = prevPrice - price;
          const percent = ((diff / price) * 100) * -1;
          msg += ` (${percent.toFixed(2)}%`;
          if (percent > 0) {
            msg += `⬆`;
          } else if (percent < 0) {
            msg += `⬇`;
          }
          msg += `)`;
        }
        prevPrice = price;
      }
      return msg;
    }).join('\n');

    return {
      success: true,
      message: `${message}`
    };
  }
}