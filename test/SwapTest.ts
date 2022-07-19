import { Contract } from '@ethersproject/contracts';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers, waffle } from 'hardhat';
import { ADDRESS } from '../constants';
import { FlashBot } from '../typechain/FlashBot';
import { IWETH } from '../typechain/IWETH';

describe('Flashswap', () => {
  let weth: IWETH;
  let flashBot: FlashBot;

  const TKN_1 = ADDRESS.WTM;
  const TKN_2 = ADDRESS.PNA;

  beforeEach(async () => {
    const wethFactory = (await ethers.getContractAt('IWETH', TKN_1)) as IWETH;
    weth = wethFactory.attach(TKN_1) as IWETH;

    const fbFactory = await ethers.getContractFactory('FlashBot');
    flashBot = (await fbFactory.deploy(ADDRESS.WETH)) as FlashBot;
  });

  describe('flash swap arbitrage', () => {
    let signer: SignerWithAddress;

    const uniFactoryAbi = ['function getPair(address, address) view returns (address pair)'];
    const uniPairAbi = ['function sync()'];

    const sushiDexFactoryAddr = ADDRESS.SUSHI_FACTORY;
    const sushiDexFactory = new ethers.Contract(sushiDexFactoryAddr, uniFactoryAbi, waffle.provider);
    let sushiDexPairAddr: any;
    let sushiDexPair: Contract;

    const uniFactoryAddr = ADDRESS.UNI_FACTORY;
    const uniFactory = new ethers.Contract(uniFactoryAddr, uniFactoryAbi, waffle.provider);
    let uniPairAddr: any;

    before(async () => {
      [signer] = await ethers.getSigners();
      sushiDexPairAddr = await sushiDexFactory.getPair(TKN_1, TKN_2);
      sushiDexPair = new ethers.Contract(sushiDexPairAddr, uniPairAbi, waffle.provider);
      uniPairAddr = await uniFactory.getPair(TKN_1, TKN_2);
    });

    it('do flash swap between Pancake and MDEX', async () => {
      // transfer 100000 to mdex pair
      const amountEth = ethers.utils.parseEther('100000');
      await weth.deposit({ value: amountEth });
      await weth.transfer(sushiDexPairAddr, amountEth);
      await sushiDexPair.connect(signer).sync();

      const balanceBefore = await ethers.provider.getBalance(flashBot.address);
      await flashBot.flashArbitrage(sushiDexPairAddr, uniPairAddr);
      const balanceAfter = await ethers.provider.getBalance(flashBot.address);

      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it('calculate how much profit we get', async () => {
      // transfer 100000 to mdex pair
      const amountEth = ethers.utils.parseEther('100000');
      await weth.deposit({ value: amountEth });
      await weth.transfer(sushiDexPairAddr, amountEth);
      await sushiDexPair.connect(signer).sync();

      const res = await flashBot.getProfit(sushiDexPairAddr, uniPairAddr);
      expect(res.profit).to.be.gt(ethers.utils.parseEther('500'));
      expect(res.baseToken).to.be.eq(TKN_1);
    });

    it('revert if callback is called from address without permission', async () => {
      await expect(
        flashBot.uniswapV2Call(flashBot.address, ethers.utils.parseEther('1000'), 0, '0xabcd')
      ).to.be.revertedWith('Non permissioned address call');
    });
  });
});
