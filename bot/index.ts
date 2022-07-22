import cron from 'node-cron';
import log, { cLog } from "./log";
import AsyncLock from 'async-lock';
import { IProfit } from "./files/interfaces";
import { big, ethForm, sleep } from "./files/utils";
import { ADDRESS, CONFIG, VAL } from "../constants";
import { calculateNetProfit, fBot, getProfit } from "./files/fbot";

async function arbitrager() : Promise<any> {
    log.info('bot main');
    // const lock = new AsyncLock({ timeout: 2000, maxPending: 50 });
    const scProfit: IProfit = await getProfit();
    log.info(`profit: ${ethForm(scProfit.profit.toString())} Base-Tokens`);
    
    if(scProfit.profit.eq(big(0))) {
        log.info('zero profit!');
        return VAL.SUCCESS;
    }
    
    const netProfit = await calculateNetProfit(scProfit);
    log.info(`net profit: ${netProfit}`);
    
    if(netProfit < CONFIG.MIN_PROFIT_THRESHOLD) {
        log.info('net profit not enough!');
        return VAL.SUCCESS;
    }
    
    log.info('Calling arbitrage function on-chain..');

    try {
        const gasLimit = await fBot?.flashArbitrage(ADDRESS.UNI_PAIR, ADDRESS.SUSHI_PAIR);
        cLog('gas limit:', gasLimit);
        fBot?.flashArbitrage(ADDRESS.UNI_PAIR, ADDRESS.SUSHI_PAIR, {
            gasPrice: CONFIG.GAS_PRICE,
            gasLimit: CONFIG.GAS_LIMIT,
        }).then((tx: any) => {
            tx.wait(1).then((rc: any) => {
                sleep(5000).then(_ => {
                    looper();
                })
            })
        })
    } catch(e) {}
}
async function looper() {
    await arbitrager();
}

looper();

// cron.schedule('* * * * *', async _ => {
//     await arbitrager();
// })

// let i = 0;
// (async _ => {
//     const provider = ethers.getDefaultProvider()
//     provider.on("block", async blockNumber => {
//         await arbitrager();
//     });
// })()
