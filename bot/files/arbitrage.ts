import { fBot } from "./fbot";
import log, { cLog } from "../log";
import {exec, execSync} from 'child_process';
import { getDexInfo, _getDexInfo } from "../../scripts/post_deploy/dex_info";

let buf: any = null;

export async function tryArbitrage(p: any[]) {
    if(!buf) {
        const gLimit = await fBot?.estimateGas.flashArbitrage(p[0], p[1]);
        cLog('gas Limit:', gLimit?.toString());
        p[2]['gasLimit'] = gLimit?.toString();
        buf = await fBot?.flashArbitrage(...p);
        const rcpt = await buf.wait(1);
        log.info(`tx hash: ${rcpt.transactionHash}`);
        await _getDexInfo();
        if(rcpt.transactionHash) buf = null;
        return rcpt;
    } else {
        log.info('there is already a pending tx!');
        return new Promise((r: Function) => r());
    }
}