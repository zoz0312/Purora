import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Builder, By, Key, until } from 'selenium-webdriver';
import { GetUserCustomMatchInput, GetUserCustomMatchOutput } from './dtos/get-match.dto';
import { GetTokenInput, GetTokenOutput } from './dtos/get-token.dto';

@Injectable()
export class RiotCrawlerService {
  async getToken({
    userId,
    userPw,
  }: GetTokenInput): Promise<GetTokenOutput> {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
      await driver.get('https://matchhistory.kr.leagueoflegends.com/ko/#page/landing-page');

      const loginPageButton = await driver.wait(until.elementLocated(By.className('riotbar-account-action')), 1000);

      loginPageButton.click();

      const userName = await driver.wait(until.elementLocated(By.name('username')), 1000);
      const password = await driver.wait(until.elementLocated(By.name('password')), 1000);
      userName.sendKeys(userId);
      password.sendKeys(userPw);
      const loginButton = await driver.wait(until.elementLocated(By.className('mobile-button')), 1000);
      await loginButton.click();

      await sleep(4000);
      const cookies = await driver.manage().getCookies();

      let getKeyList = [
        'id_token',
        // 'PVPNET_TOKEN_KR',
        'PVPNET_ID_KR',
      ];

      let userCookieInfo = [];
      cookies.map(({
        name,
        value,
        domain,
      }) => {
        if (getKeyList.includes(name)) {
          userCookieInfo.push({
            name,
            value,
            domain,
          })
        }
      });

      if (userCookieInfo.length === 0) {
        return {
          keyList: [],
        };
      }

      return {
        keyList: userCookieInfo,
      };
    } catch (error) {
      return {
        error
      }
    } finally {
      await driver.quit();
    }
  }

  async getUserCustomMatch ({
    id_token,
    PVPNET_ID_KR,
    beginIndex,
    endIndex,
  }: GetUserCustomMatchInput): Promise<GetUserCustomMatchOutput> {
    try {
      const { data } = await axios.get(
        `https://acs.leagueoflegends.com/v1/stats/player_history/KR/${PVPNET_ID_KR}?begIndex=${beginIndex}&endIndex=${endIndex}&queue=0`,
        {
          headers: {
            Cookie: `id_token=${id_token}; PVPNET_ID_KR=${PVPNET_ID_KR};`
          },
        },
      );
      return { data };
    } catch (error) {
      return { error };
    }
  }
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));