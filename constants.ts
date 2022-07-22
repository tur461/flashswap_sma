import path from "path";
import { parseUnits } from "ethers/lib/utils";

const ADDRESS = {
    ZERO: `0x${'0'.repeat(40)}`,
    DAI: '0x7f84437D0bD9a9e0D8957FB394BBfa73893FD957',
    
    WETH: '0x46b142DD1E924FAb83eCc3c08e4D46E82f005e0E',
    
    USDT: '0x1c85638e118b37167e9298c2268758e058DdfDA0',
    SAITAMA: '0xC9a43158891282A2B1475592D5719c001986Aaec',
    
    UNI_ROUTER: '0x4C2F7092C2aE51D986bEFEe378e50BD4dB99C901',
    UNI_FACTORY: '0x367761085BF3C12e5DA2Df99AC6E1a824612b8fb',
    
    SUSHI_ROUTER: '0x49fd2BE640DB2910c2fAb69bB8531Ab6E76127ff',
    SUSHI_FACTORY: '0x7A9Ec1d04904907De0ED7b6839CcdD59c3716AC9',
    
    FLASH_BOT: '0x4631BCAbD6dF18D94796344963cB60d44a4136b6',

    UNI_PAIR: '0xC1C5Becb7Cc937F616495aCcf5f576cC6533f3aC',
    SUSHI_PAIR: '0xc3BaF40A3e293D64AADCBDaA34835200cc41DF08',
}

const VAL = {
    TKN0_SYM: 'SAITAMA',
    TKN1_SYM: 'USDT',
    PRICE_TOKEN0: 0.002,
    PRICE_TOKEN1: 0.003,
    TKN0_NAME: 'saitama',
    TKN1_NAME: 'usdt',
    SUCCESS: 'success',
    FAILURE: 'failure',
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