import {Inject, Injectable} from '@nestjs/common';
import axios from 'axios';
import { Builder, By, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { GetUserCustomMatchInput, GetUserCustomMatchOutput } from './dtos/get-match.dto';
import { GetTokenInput, GetTokenOutput } from './dtos/get-token.dto';
import {PORO_CONFIG_OPTIONS} from "../../common/constants";
import {PorotModuleOptions} from "../poro.module";

const option = new Options()
  .addArguments("User-Agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36")
  .addArguments("Accept-Language=ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7")
  .addArguments("--headless")
  .addArguments("--no-sandbox")
  .addArguments("--disable-dev-shm-usage");

@Injectable()
export class RiotCrawlerService {
  constructor(
    @Inject(PORO_CONFIG_OPTIONS)
    private readonly options: PorotModuleOptions,
  ) {}

  async getToken({
    userId,
    userPw,
  }: GetTokenInput): Promise<GetTokenOutput> {
    const driver = await new Builder()
      .forBrowser('chrome')
      .usingServer(`${this.options.seleniumServer}/wd/hub`)
		  .setChromeOptions(option)
      .build();

    try {
			await driver.manage().window().maximize();
      await driver.get('https://matchhistory.kr.leagueoflegends.com/ko/#page/landing-page');
      await driver.wait(until.elementLocated(By.linkText("로그인")));
      await driver.findElement(By.linkText("로그인")).click();
      // const loginPageButton = await driver.wait(until.elementLocated(By.className('riotbar-account-action')), 10000);
      // loginPageButton.click();
      const userName = await driver.wait(until.elementLocated(By.name('username')), 10000);
      const password = await driver.wait(until.elementLocated(By.name('password')), 10000);
      userName.sendKeys(userId);
      password.sendKeys(userPw);
      const loginButton = await driver.wait(until.elementLocated(By.className('mobile-button')), 10000);
      await loginButton.click();

      await driver.wait(until.elementLocated(By.className('riotbar-account-action')), 10000);
      const cookies = await driver.manage().getCookies();

      const getKeyList = [
        'id_token',
        // 'PVPNET_TOKEN_KR',
        'PVPNET_ID_KR',
      ];

      const userCookieInfo = [];
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
      console.log('error', error)
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
