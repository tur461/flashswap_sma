import { ethers } from "hardhat";
import { cLog } from "../log";
import { CONFIG } from "../../constants";
import { BigNumber, Contract } from "ethers";

import { fetchJson } from "ethers/lib/utils";

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

async function getPriceNow(fromSym: string, toSym: string) : Promise<any> {
    toSym = toSym.toUpperCase() || 'BTC,USD,EUR,AUD,CHF,CAD,GBP';
	
    const url = `${CONFIG.PRICE_URL}?fsym=${fromSym}&tsyms=${toSym}&sign=true`;
    const a = await fetchJson(url);
    cLog(a);
    return a;
};

export async function getEthPriceInDollar() : Promise<number> {
    const ethPrice = await getPriceNow('ETH', 'USD');
    return ethPrice.USD;
}

export async function getUSDTPriceInDollar() : Promise<number> {
    const usdtPrice = 1;
    return usdtPrice;
}