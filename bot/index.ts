import log, { cLog } from "./log";
import AsyncLock from 'async-lock';
import { IProfit } from "./files/interfaces";
import { big, ethForm } from "./files/utils";
import { ADDRESS, CONFIG } from "../constants";
import { calculateNetProfit, fBot, getProfit } from "./files/fbot";

async function arbitrager() : Promise<any> {
    const lock = new AsyncLock({ timeout: 2000, maxPending: 50 });
    // scProfit -> profit from our smart contract ie fBot 
    const scProfit: IProfit = await getProfit();
    log.info(`profit: ${ethForm(scProfit.profit.toString())} Base-Tokens`);
    if(scProfit.profit.eq(big(0))) return log.info('zero profit!');
    
    const netProfit = await calculateNetProfit(scProfit);
    log.info(`net profit: ${netProfit}`);
    if(netProfit < CONFIG.MIN_PROFIT_THRESHOLD) return log.info('net profit not enough!');
    
    log.info('Calling arbitrage function on-chain..');

    try {
        await lock.acquire('fBot', async () => {
            const tx = await fBot?.flashArbitrage(ADDRESS.UNI_PAIR, ADDRESS.SUSHI_PAIR, {
                gasPrice: CONFIG.GAS_PRICE,
                gasLimit: CONFIG.GAS_LIMIT,
            });
            const receipt = await tx.wait(1);
            log.info(`Tx: ${receipt.transactionHash}`);
        })
    } catch(e) {
        if (
            e.message === 'Too much pending tasks' || 
            e.message === 'async-lock timed out'
        ) return; 
        cLog(e); 
    }
    
    return 0;
}

async function main() {
    await arbitrager();
}

main()
.then(() => log.info('exiting from main...'))
.catch(e => log.error('error in main!.'));