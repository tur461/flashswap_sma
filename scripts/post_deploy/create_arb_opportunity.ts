import { getContract } from "../../bot/files/utils";
import { cLog } from "../../bot/log";
import { ADDRESS } from "../../constants";
import { CONTRACTS } from "../helpers/constants";



export async function getOpportunityInfo() {
    const fBot = await getContract(CONTRACTS.FLASH_BOT, ADDRESS.FLASH_BOT);
    const p = [ADDRESS.UNI_PAIR, ADDRESS.SUSHI_PAIR];
    const profit = await fBot.getProfit(...p);
    cLog('Profit:', profit);
    const isBaseTokenSmaller = await fBot.isbaseTokenSmaller(...p);
    cLog('isBaseTokenSmaller:', isBaseTokenSmaller);
    const orderedReserves = await fBot.getOrderedReserves(...p, isBaseTokenSmaller);
    cLog('orderedReserves:', orderedReserves);
    const borrowedAmount = await fBot.calcBorrowAmount(orderedReserves);
    cLog('borrowed amount:', borrowedAmount);
}