import { parseUnits } from "ethers/lib/utils"
import path from "path"

const ADDRESS = {
    ZERO: `0x${'0'.repeat(40)}`,
    DAI: '0x7f84437D0bD9a9e0D8957FB394BBfa73893FD957',
    
    WETH: '0xc96304e3c037f81dA488ed9dEa1D8F2a48278a75',
    
    USDT: '0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A',
    SAITAMA: '0x34B40BA116d5Dec75548a9e9A8f15411461E8c70',
    
    UNI_ROUTER: '0x22753E4264FDDc6181dc7cce468904A80a363E44',
    UNI_FACTORY: '0x07882Ae1ecB7429a84f1D53048d35c4bB2056877',
    
    SUSHI_ROUTER: '0xfaAddC93baf78e89DCf37bA67943E1bE8F37Bb8c',
    SUSHI_FACTORY: '0xA7c59f010700930003b33aB25a7a0679C860f29c',
    
    FLASH_BOT: '0x276C216D241856199A83bf27b2286659e5b877D3',

    UNI_PAIR: '0x1Cbe1aE00Da077c99297F78087835186Ff6187C1',
    SUSHI_PAIR: '0x26497048B0DE6EFC3B54813648bC38044EdDEf19',
}

const VAL = {
    TKN0_SYM: 'SAITAMA',
    TKN1_SYM: 'USDT',
    PRICE_TOKEN0: 0.002,
    PRICE_TOKEN1: 0.003,
    TKN0_NAME: 'saitama',
    TKN1_NAME: 'usdt',
}


// bsc testnet = 97
// rinkeby = 4
const CHAIN = {
    BSC: 97,
    LOCAL: 0,
    ETHEREUM: 4,
}

const ABI = {
    I_ERC20: './ABI/IERC20.json',
    PAIR: './ABI/UniswapV2Pair.json',
    F_BOT: path.join(__dirname, './ABI/FlashBot.json'),
    I_PAIR: './ABI/IUniswapV2Pair.json',
    I_FACTORY: './ABI/IUniswapV2Factory.json',
    I_ROUTER: './ABI/IUniswapV2Router02.json',
}

const CONFIG = {
    LOG_LEVEL: 'debug',
    BASE_TOKENS: [
        ADDRESS.USDT
    ],
    GAS_LIMIT: 500000, // units
    MIN_PROFIT_THRESHOLD: 50, // usd
    GAS_PRICE: parseUnits('3', 'gwei'), // in Gwei
    PRICE_URL: 'https://min-api.cryptocompare.com/data/price',
}

export {
    VAL,
    ABI,
    CHAIN,
    CONFIG,
    ADDRESS,
}