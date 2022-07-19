import fs from 'fs';
import path from 'path';
import 'lodash.combinations';
import lodash from 'lodash';
import { Contract } from '@ethersproject/contracts';
import { ethers } from 'hardhat';

import log from './log';
import { ADDRESS } from '../constants';

export enum Network {
  KCC = 'kcc',
  RINK = 'rinkeby',
}

const baseTokens: Tokens = {
  wtm: { symbol: 'WTM', address: ADDRESS.WTM },
};

const quoteTokens: Tokens = {
  // wtm: { symbol: 'WTM', address: ADDRESS.WTM },
  pna: { symbol: 'PNA', address: ADDRESS.PNA },
};

const dexes: AmmFactories = {
  uniswap: ADDRESS.UNI_ROUTER,
  sushiSwap: ADDRESS.SUSHI_ROUTER,
  // value: '0x1B8E12F839BD4e73A47adDF76cF7F0097d74c14C',
};

function getFactories(network: Network): AmmFactories {
  switch (network) {
    case Network.RINK:
      return dexes;
    default:
      throw new Error(`Unsupported network:${network}`);
  }
}

export function getTokens(network: Network): [Tokens, Tokens] {
  switch (network) {
    case Network.RINK:
      return [baseTokens, quoteTokens];
    default:
      throw new Error(`Unsupported network:${network}`);
  }
}

async function updatePairs(network: Network): Promise<ArbitragePair[]> {
  log.info('Updating arbitrage token pairs');
  const [baseTokens, quoteTokens] = getTokens(network);
  const factoryAddrs = getFactories(network);

  const factoryAbi = ['function getPair(address, address) view returns (address pair)'];
  let factories: Contract[] = [];

  log.info(`Fetch from dexes: ${Object.keys(factoryAddrs)}`);
  for (const key in factoryAddrs) {
    const addr = factoryAddrs[key];
    const factory = new ethers.Contract(addr, factoryAbi, ethers.provider);
    factories.push(factory);
  }

  let tokenPairs: TokenPair[] = [];
  for (const key in baseTokens) {
    const baseToken = baseTokens[key];
    for (const quoteKey in quoteTokens) {
      const quoteToken = quoteTokens[quoteKey];
      let tokenPair: TokenPair = { symbols: `${quoteToken.symbol}-${baseToken.symbol}`, pairs: [] };
      for (const factory of factories) {
        const pair = await factory.getPair(baseToken.address, quoteToken.address);
        if (pair != ADDRESS.ZERO) {
          tokenPair.pairs.push(pair);
        }
      }
      if (tokenPair.pairs.length >= 2) {
        tokenPairs.push(tokenPair);
      }
    }
  }

  let allPairs: ArbitragePair[] = [];
  for (const tokenPair of tokenPairs) {
    if (tokenPair.pairs.length < 2) {
      continue;
    } else if (tokenPair.pairs.length == 2) {
      allPairs.push(tokenPair as ArbitragePair);
    } else {
      // @ts-ignore
      const combinations = lodash.combinations(tokenPair.pairs, 2);
      for (const pair of combinations) {
        const arbitragePair: ArbitragePair = {
          symbols: tokenPair.symbols,
          pairs: pair,
        };
        allPairs.push(arbitragePair);
      }
    }
  }
  return allPairs;
}

function getPairsFile(network: Network) {
  return path.join(__dirname, `../pairs-${network}.json`);
}

export async function tryLoadPairs(network: Network): Promise<ArbitragePair[]> {
  let pairs: ArbitragePair[] | null;
  const pairsFile = getPairsFile(network);
  try {
    pairs = JSON.parse(fs.readFileSync(pairsFile, 'utf-8'));
    log.info('Load pairs from json');
  } catch (err) {
    pairs = null;
  }

  if (pairs) {
    return pairs;
  }
  pairs = await updatePairs(network);

  fs.writeFileSync(pairsFile, JSON.stringify(pairs, null, 2));
  return pairs;
}
