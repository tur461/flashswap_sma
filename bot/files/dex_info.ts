import { Contract } from "ethers";
import { ethers } from "hardhat";
import { ADDRESS } from "../../constants";
import { CONTRACTS } from "../../scripts/helpers/constants";
import { IDexes, IPrices } from "./interfaces";
import { getContract } from "./utils";

export async function getAllDexContracts() : Promise<IDexes> {
    const uFactory = await getContract(CONTRACTS.FACTORY, ADDRESS.UNI_FACTORY);
    const sFactory = await getContract(CONTRACTS.FACTORY, ADDRESS.SUSHI_FACTORY); 
    const uRouter = await getContract(CONTRACTS.ROUTER, ADDRESS.UNI_ROUTER); 
    const sRouter = await getContract(CONTRACTS.ROUTER, ADDRESS.SUSHI_ROUTER);
    
    const uPairAddr = await uFactory.getPair(ADDRESS.SAITAMA, ADDRESS.USDT);
    const sPairAddr = await sFactory.getPair(ADDRESS.SAITAMA, ADDRESS.USDT);
    const uPair = await getContract(CONTRACTS.PAIR, uPairAddr);
    const sPair = await getContract(CONTRACTS.PAIR, sPairAddr);
    
    return {
        uPair,
        sPair,
        uRouter,
        sRouter,
        uFactory,
        sFactory,
    }
}

export async function getPrices() : Promise<IPrices> {
    const dexes = await getAllDexContracts();
    const amountsOut0 = await dexes.uRouter.getAmountsOut(ethers.utils.parseEther('1'), [ADDRESS.SAITAMA, ADDRESS.USDT]);
    const amountsOut1 = await dexes.sRouter.getAmountsOut(ethers.utils.parseEther('1'), [ADDRESS.SAITAMA, ADDRESS.USDT]);
    return {
        price0: amountsOut0[1],
        price1: amountsOut1[1],
    };
}

