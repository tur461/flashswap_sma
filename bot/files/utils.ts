import { cLog } from "../log";
import { ethers } from "hardhat";
import AsyncLock from "async-lock";
import Binance from 'binance-api-node';
import { CONFIG } from "../../constants";
import { fetchJson } from "ethers/lib/utils";
import { BigNumber, Contract } from "ethers";

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const toStd = (v: number) => v.toLocaleString('fullwide', {useGrouping: !1});

export const big = (v: number) => BigNumber.from(v);

export const bigStd = (v: number) => BigNumber.from(toStd(v));

export const weiForm = (v: any) => ethers.utils.parseEther(v);

export const ethForm = (v: any) => ethers.utils.formatEther(v);

export const toDec = (v: any, d?: number) => d ? v / 10**d : v / 10**18; 

export const parseUnits = (v: any, f: string) => ethers.utils.parseUnits(v, f);

export async function getContract(contractName: string, addr: string) : Promise<Contract> {
    return (await ethers.getContractAt(contractName, addr)) as Contract
}

let ethPrice = 0;

const lock = new AsyncLock();
// clear Eth price every hour
setInterval(() => {
    lock
    .acquire('eth-price', () => {
        ethPrice = 0;
        return;
    })
    .then(() => {});
}, 3600000);


async function getPriceNow(fromSym: string, toSym: string) : Promise<any> {
    const prices = await Binance().prices();
    return prices[`${fromSym.toUpperCase()}${toSym.toUpperCase()}`];
};

export async function getEthPriceInDollar() : Promise<number> {
    return await lock.acquire('eth-price', async () => {
        if(ethPrice !== 0) return ethPrice;
        const _ethPrice = await getPriceNow('ETH', 'USDT');
        ethPrice = parseFloat(_ethPrice);
        return ethPrice;
    });
}

export async function getUSDTPriceInDollar() : Promise<number> {
    const usdtPrice = 1;
    return usdtPrice;
}
