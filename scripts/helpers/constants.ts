export const ADDRESS = {
  ZERO: '0x' + '0'.repeat(40),
  OWNER: '0x84fF670281055e51FE317c0A153AAc2D26619798',
  UNI_V2Router02: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',

}

export const CONTRACTS = {
  WETH: 'WETH9',
  FLASH_BOT: 'FlashBot',
  ROUTER: 'UniswapV2Router02',
  FACTORY: 'UniswapV2Factory',
}

export const TAG = {
  WETH: 'Weth9_01',
  FLASH_BOT: 'FlashBot_01',
  ROUTER: 'UniswapV2Router02_01',
  FACTORY: 'UniswapV2Factory_01',
}

export const INIT_VAL = {  
  CLAIM_AMOUNT: '1000' + '0'.repeat(18),
  INITIAL_MINT_AMOUNT: '1000000000' + '0'.repeat(18),
  START_BLOCK: 0, // The block number when Saitama mining starts.
  SAITAMA_PER_BLOCK: 7, // Saitama tokens created per block (emission rate)
  LOCK_TIME: 1, // lock-time in days
}
