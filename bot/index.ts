import { ethers } from 'hardhat';
import { BigNumber } from 'ethers';
import pool from '@ricokahler/pool';
import AsyncLock from 'async-lock';

import { FlashBot } from '../typechain/FlashBot';
import { Network, tryLoadPairs, getTokens } from './tokens';
import { getBaseTokenPrice } from './basetoken-price';
import log from './log';
import config from './config';
import { ADDRESS } from '../constants';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function calcNetProfit(profitWei: BigNumber, address: string, baseTokens: Tokens): Promise<number> {
  let price = await getBaseTokenPrice();
  if (baseTokens.wtm.address == address) {
    price = await getBaseTokenPrice();
  }
  let profit = parseFloat(ethers.utils.formatEther(profitWei));
  profit = profit * price;

  const gasCost = price * parseFloat(ethers.utils.formatEther(config.gasPrice)) * (config.gasLimit as number);
  return profit - gasCost;
}

function arbitrageFunc(flashBot: FlashBot, baseTokens: Tokens) {
  const lock = new AsyncLock({ timeout: 2000, maxPending: 20 });
  return async function arbitrage(pair: ArbitragePair) {
    const [pair0, pair1] = [ADDRESS.UNI_PAIR, ADDRESS.SUSHI_PAIR];

    let res: [BigNumber, string] & {
      profit: BigNumber;
      baseToken: string;
    };
    try {
      res = await flashBot.getProfit(pair0, pair1);
      log.info(`Profit on ${pair.symbols}: ${ethers.utils.formatEther(res.profit)}`);
    } catch (err) {
      log.debug(err);
      return;
    }

    if (res.profit.gt(BigNumber.from('0'))) {
      const netProfit = await calcNetProfit(res.profit, res.baseToken, baseTokens);
      log.info(`net profit: ${netProfit}`);
      if (netProfit < config.minimumProfit) {
        return;
      }

      log.info(`Calling flash arbitrage, net profit: ${netProfit}`);
      try {
        // lock to prevent tx nonce overlap
        await lock.acquire('flash-bot', async () => {
          const estimate: BigNumber = await flashBot.estimateGas.flashArbitrage(pair0, pair1);
          console.log('Estimated Gas:', estimate.toBigInt().toString());
          const response = await flashBot.flashArbitrage(pair0, pair1, {
            gasPrice: config.gasPrice,
            gasLimit: config.gasLimit,
          });
          const receipt = await response.wait(1);
          log.info(`Tx: ${receipt.transactionHash}`);
        });
      } catch (err) {
        if (err.message === 'Too much pending tasks' || err.message === 'async-lock timed out') {
          return;
        }
        log.error(err);
      }
    }
  };
}

async function main() {
  // const pairs = await tryLoadPairs(Network.KCC);
  const pairs: ArbitragePair[] = [
    {
      symbols: 'WTM/PNA',
      pairs: [ADDRESS.UNI_PAIR, ADDRESS.SUSHI_PAIR],
    }
  ];
  const flashBot = (await ethers.getContractAt('FlashBot', config.contractAddr)) as FlashBot;
  const [baseTokens] = getTokens(Network.RINK);

  log.info('Start arbitraging');
  while (true) {
    await pool({
      collection: pairs,
      task: arbitrageFunc(flashBot, baseTokens),
      // maxConcurrency: config.concurrency,
    });
    await sleep(1000);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    log.error(err);
    process.exit(1);
  });
