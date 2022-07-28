import { task } from "hardhat/config";
import { cLog } from "../../bot/log";
import { _getDexInfo } from "../post_deploy/dex_info";

cLog('loaded')

task('dexInfo', 'prints information from dexes')
.setAction(async (args: any) => {
    await _getDexInfo();
})