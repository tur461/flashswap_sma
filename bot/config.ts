import { BigNumber, BigNumberish, utils } from 'ethers';
import { ADDRESS } from '../constants';

interface Config {
  contractAddr: string;
  logLevel: string;
  minimumProfit: number;
  gasPrice: BigNumber;
  gasLimit: BigNumberish;
  kccScanUrl: string;
  concurrency: number;
  usdtScanUrl: string;
}

const contractAddr = ADDRESS.FLASH_BOT; // flash bot contract address
const gasPrice = utils.parseUnits('20', 'gwei');
const gasLimit = 300000;

const VS_CURRENCY = 'currencies=usd'; // kccscan API key
const kccScanUrl = `https://api.coingecko.com/api/v3/simple/price?ids=kucoin-shares&vs_${VS_CURRENCY}`;
const usdtScanUrl = `https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd`;

const config: Config = {
  contractAddr: contractAddr,
  logLevel: 'debug',
  concurrency: 50,
  minimumProfit: 0.0050, // in USD
  gasPrice: gasPrice,
  gasLimit: gasLimit,
  kccScanUrl: kccScanUrl,
  usdtScanUrl: usdtScanUrl,
};

export default config;
