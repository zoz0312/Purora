import time
from selenium import webdriver
# from selenium.webdriver.common.keys import Keys

import requests
from bs4 import BeautifulSoup

headerEx = {
	'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36',
	'Accept-Language':'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
}

driver = webdriver.Chrome(executable_path='C:/Users/zoz03/Downloads/chromedriver_win32/chromedriver.exe')
driver.get('https://matchhistory.kr.leagueoflegends.com/ko/#page/landing-page');
time.sleep(0.5);
driver.find_element_by_class_name('riotbar-account-action').click()

# driver.get("https://auth.riotgames.com/login#client_id=rso-web-client-prod&login_hint=kr&redirect_uri=https%3A%2F%2Flogin.leagueoflegends.com%2Foauth2-callback&response_type=code&scope=openid&state=5JQSqiXs6MU758q5YrQeAiV2bHKiIACKlPUemj8yg9M&ui_locales=ko-kr")
time.sleep(0.5)

driver.find_element_by_name('username').send_keys('zoz0312')
driver.find_element_by_name('password').send_keys('userpw')

driver.find_element_by_class_name('mobile-button').click()
time.sleep(2)

print(driver.get_cookies())

# driver.add_cookie({"name": "key", "value": "value"})

# driver.implicitly_wait(3)
# lolSession = requests.session()
# res = lolSession.post(
#   "https://auth.riotgames.com/login",
#   data=MEMBER_DATA,
#   headers=headerEx,
# )
# res.raise_for_status()

# res_my = lolSession.get("https://matchhistory.kr.leagueoflegends.com/ko/#page/landing-page")
# res_my.raise_for_status()
# soup = BeautifulSoup(res_my.text, 'html.parser')
# print('soup', soup)
# print('=========================')
# print("res_my", res_my.cookies.get_dict())
# print(res.cookies[0])
# res.raise_for_status()

# print(res.headers)
# with lolSession as e:
# 	login = lolSession.post()
#   print('login', login);
  # cookies = req.cookies.get_dict()