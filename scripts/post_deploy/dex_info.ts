import { Contract } from "ethers";
import { ethers } from "hardhat";
import log from "../../bot/log";
import { ADDRESS } from "../../constants";
import { CONTRACTS } from "../helpers/constants";
import { Pairs } from "../helpers/interfaces";

async function getContract(contractName: string, addr: string) : Promise<Contract> {
    return (await ethers.getContractAt(contractName, addr)) as Contract
}

async function pairs(factory: Contract[]) : Promise<Pairs> {
    const uPair = await factory[0].getPair(ADDRESS.SAITAMA, ADDRESS.USDT);
    const sPair = await factory[1].getPair(ADDRESS.SAITAMA, ADDRESS.USDT);

    return {
        uPair,
        sPair,
    }
}

async function getPrice(router: Contract) : Promise<number[]> {
    const amountsOut = await router.getAmountsOut(ethers.utils.parseEther('1'), [ADDRESS.SAITAMA, ADDRESS.USDT]);
    return amountsOut;
}

export async function getDexInfo() {
    const uFactory = await getContract(CONTRACTS.FACTORY, ADDRESS.UNI_FACTORY);
    const sFactory = await getContract(CONTRACTS.FACTORY, ADDRESS.SUSHI_FACTORY); 
    const uRouter = await getContract(CONTRACTS.ROUTER, ADDRESS.UNI_ROUTER); 
    const sRouter = await getContract(CONTRACTS.ROUTER, ADDRESS.SUSHI_ROUTER); 
    const prs = await pairs([uFactory, sFactory]);
    const uAmtOut = await getPrice(uRouter);
    const sAmtOut = await getPrice(sRouter);

    log.info(`
        Dex Information:\n
            Pair Addresses:\n
                Uniswap Pair: ${prs.uPair}
                SushiSwap Pair: ${prs.sPair}\n
            Amounts Out on UniSwap:\n
                0: ${uAmtOut[0]/10**18}
                1: ${uAmtOut[1]/10**18}\n
            Amounts Out on SushiSwap:\n
                0: ${sAmtOut[0]/10**18}
                1: ${sAmtOut[1]/10**18}
    `)
}