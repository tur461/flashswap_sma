import { Contract } from "ethers";
import { ethers } from "hardhat";
import log from "../../bot/log";
import { ADDRESS } from "../../constants";
import { CONTRACTS } from "../helpers/constants";
import { Pairs } from "../helpers/interfaces";

async function getContract(contractName: string, addr: string) : Promise<Contract> {
    return (await ethers.getContractAt(contractName, addr)) as Contract
}

async function flashBot() {
    const fBot = await getContract(CONTRACTS.FLASH_BOT, ADDRESS.FLASH_BOT);
    await addBaseToken(fBot);
    // await remBaseTokens(fBot);
}

async function addBaseToken(fBot: Contract) {
    await fBot.addBaseToken(ADDRESS.USDT);
    log.info('Added USDT as one of the base tokens.')
}

async function remBaseTokens(fBot: Contract) {
    await fBot.addBaseToken(ADDRESS.SAITAMA);
    await fBot.addBaseToken(ADDRESS.WETH);
    log.info('Removed saitama & weth from base tokens.')
}


flashBot()
.then()
.catch(e => log.error('benchod!!'));