import { ethers, run } from 'hardhat';

import deployer from '../.secret';
import { ADDRESS } from '../constants';

// WKCS address on KCC, WETH address on ETH
const BASE_TOKEN = ADDRESS.WTM;

async function main() {
  await run('compile');
  const FlashBot = await ethers.getContractFactory('FlashBot');
  const flashBot = await FlashBot.deploy(BASE_TOKEN);

  console.log(`FlashBot deployed to ${flashBot.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
