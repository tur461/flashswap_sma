import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { deployTokens } from "../files/tokens";
import { deployDexes } from "../files/dex";
import { deployFlashBot } from "../files/flashbot";
import { DeployOptions, IDeployDexesResult } from "../helpers/interfaces";
import { run } from "hardhat";
import { Contract } from "ethers";
import { editConstantsAfterDeploy } from "../files/up_constants";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    await run('compile');
    const { deployments, getNamedAccounts, getUnnamedAccounts } = hre;
    const { deploy } = deployments;
    // const { deployer } = await getNamedAccounts();
    const unnamedAccounts = await getUnnamedAccounts();
    
    const deployer = unnamedAccounts[0];
    let deployOptions: DeployOptions = {
      deploy,
      deployer,
    }
    const tokens = await deployTokens(deployOptions);
    deployOptions.weth = tokens.weth;
    deployOptions.usdt = tokens.usdt;
    const dexes: IDeployDexesResult = await deployDexes(deployOptions);

    const flashBot: Contract = await deployFlashBot(deployOptions);

    console.log(`
      Deployment success:\n
      Tokens:\n
          WETH:     ${tokens.weth.address}
          USDT:     ${tokens.usdt.address}
          SAITAMA:  ${tokens.saitama.address}\n
      Dexes:\n
      UniSwap:\n
          Router:   ${dexes.uRouter.address}
          Factory:  ${dexes.uFactory.address}\n
      SushiSwap:\n
          Router:   ${dexes.sRouter.address}
          Factory:  ${dexes.sFactory.address}\n
      Bot:\n
        FlashBot: ${flashBot.address}
      `);

      editConstantsAfterDeploy({
        WETH: tokens.weth.address,
        USDT: tokens.usdt.address,
        SAITAMA: tokens.saitama.address,
        FLASH_BOT: flashBot.address,
        UNI_ROUTER: dexes.uRouter.address,
        UNI_FACTORY: dexes.uFactory.address,
        SUSHI_ROUTER: dexes.sRouter.address,
        SUSHI_FACTORY: dexes.sFactory.address,

      });
};
export default func;
