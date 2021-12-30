import { STOCK_SEARCH, STOCK_SERVICE } from "../../command-manager.constants";

const service = STOCK_SERVICE;
export const commandStockManager: commandDTO[] = [
  {
    service,
    name: STOCK_SEARCH,
    command: ['주식'],
    desc: '주식검색',
    argumentDesc: ['종목코드,[시작날짜],[끝나는날짜],[단위(d:일, w:주, m:월)]'],
  },
];