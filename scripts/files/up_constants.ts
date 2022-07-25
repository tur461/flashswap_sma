import log, { cLog } from "../../bot/log";

const { execSync, spawnSync } = require("child_process");

const _File = './constants.ts';
const dKeys = [
    'WETH',
    'USDT',
    'SAITAMA',
    'FLASH_BOT',
    'UNI_ROUTER',
    'UNI_FACTORY',
    'SUSHI_ROUTER',
    'SUSHI_FACTORY',
];

const pdKeys = [
    'UNI_PAIR',
    'SUSHI_PAIR',
]

function editConstants(p: any, keys: string[]) {
    const pwd = execSync('pwd').toString();
    keys.forEach(k => {
        try{
            const r = execSync(`sed -i -E "s/${k}: '.*'/${k}: '${p[k]}'/g" ${_File}`);
            log.info(`constant updated: ${k}`);
        } catch(e) {
            log.error(`not updated: ${k}`)
        }
    }); 

}

export function editConstantsAfterDeploy(p: any) {
    log.info('edit Constants After Deploy');
    const s = execSync('pwd');
    editConstants(p, dKeys);
}

export function editConstantsAfterPostDeploy(p: any) {
    log.info('edit Constants After Post Deploy');
    editConstants(p, pdKeys);
}