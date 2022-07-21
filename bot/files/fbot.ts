import { Contract } from "ethers";
import { ADDRESS, CONFIG } from "../../constants";
import { CONTRACTS } from "../../scripts/helpers/constants";
import log, { cLog } from "../log";
import { IProfit } from "./interfaces";
import { ethForm, getContract, getEthPriceInDollar, getUSDTPriceInDollar, parseUnits, weiForm } from "./utils";

export let fBot : Contract | null = null;

export async function getProfit() : Promise<IProfit> {
    fBot = await getContract(CONTRACTS.FLASH_BOT, ADDRESS.FLASH_BOT);
    const pool1 = ADDRESS.UNI_PAIR;
    const pool2 = ADDRESS.SUSHI_PAIR;
    const p = (await fBot.getProfit(pool1, pool2)) as IProfit;
    return p;
}

export async function calculateNetProfit(scProfit: IProfit) : Promise<number> {
    const ethUsdPrice = await getEthPriceInDollar();
    log.info(`ETH price: $${ethUsdPrice}`);
    if(CONFIG.BASE_TOKENS.includes(scProfit.baseToken)) {
        const usdtUsdPrice = await getUSDTPriceInDollar();
        log.info(`USDT price: $${usdtUsdPrice}`);
        const rawProfit = parseFloat(ethForm(scProfit.profit.toString())) * usdtUsdPrice;
        const gasCost = parseFloat(ethForm(CONFIG.GAS_PRICE)) * (CONFIG.GAS_LIMIT) * ethUsdPrice;
        log.info(`(in $):\nrawProfit: ${rawProfit}\ngasCost: ${gasCost}`);
        return rawProfit - gasCost;
    }
    return 0;
}
