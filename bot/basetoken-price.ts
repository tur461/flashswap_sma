import axios from 'axios';
import AsyncLock from 'async-lock';
import {getABI, getFile} from '../utils';
import config from './config';
import log from './log';
import { ethers } from 'hardhat';
import { ABI, ADDRESS } from '../constants';

import { IUniswapV2Pair } from '../typechain/IUniswapV2Pair';

const lock = new AsyncLock();

let bTokenPrice = 0;

// clear base token price every hour
setInterval(() => {
  lock
    .acquire('bToken-shares', () => {
      bTokenPrice = 0;
      return;
    })
    .then(() => {});
}, 3600000);

export async function getBaseTokenPrice(): Promise<number> {
  return await lock.acquire('bToken-shares', async () => {
    if (bTokenPrice !== 0) {
      log.info(`Base Token Price: $${bTokenPrice}`);
      return bTokenPrice;
    }
    // const pairAbi = getABI(getFile(ABI.PAIR));
    // const uPair = (await ethers.getContractAt(pairAbi, ADDRESS.UNI_PAIR)) as IUniswapV2Pair;
    // const sPair = (await ethers.getContractAt(pairAbi, ADDRESS.SUSHI_PAIR)) as IUniswapV2Pair;
    // const uReserves = await uPair.getReserves();
    // const sReserves = await sPair.getReserves();
    const res = await axios.get(config.usdtScanUrl);
    
    console.log('data:', res.data)
    const price = 
    bTokenPrice = parseFloat(res.data['tether'].usd);
    log.info(`Base Token price: $${bTokenPrice}`);
    return bTokenPrice;
  });
}
