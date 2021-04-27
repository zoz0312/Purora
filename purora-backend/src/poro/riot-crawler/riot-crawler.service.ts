import { Injectable } from '@nestjs/common';
import { Builder, By, Key, until } from 'selenium-webdriver';
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
        'PVPNET_TOKEN_KR',
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

      console.log('userCookieInfo', userCookieInfo);
      if (userCookieInfo.length === 0) {
        return {
          success: false,
          keyList: [],
        };
      }

      return {
        success: true,
        keyList: userCookieInfo,
      };
    } catch (error) {
      return {
        success: false,
        error
      }
    } finally {
      await driver.quit();
    }
  }
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));