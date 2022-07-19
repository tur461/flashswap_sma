import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { CONTRACTS, TAG, INIT_VAL } from "../helpers/constants";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, getUnnamedAccounts } = hre;
    const { deploy } = deployments;
    // const { deployer } = await getNamedAccounts();
    const uAccs = await getUnnamedAccounts();
    // console.log('unnamed accounts:', uAccs);
    const deployer = uAccs[0];

    console.log('deploye:', deployer);

    const weth = await deploy(TAG.WETH, {
        contract: CONTRACTS.WETH,
        from: deployer,
        args: [],
        log: true,
        skipIfAlreadyDeployed: true,
    });
    
    const uFactory = await deploy(TAG.FACTORY, {
        contract: CONTRACTS.FACTORY,
        from: deployer,
        args: [deployer],
        log: true,
        skipIfAlreadyDeployed: true,
    });
    const uRouter = await deploy(TAG.ROUTER, {
        contract: CONTRACTS.ROUTER,
        from: deployer,
        args: [uFactory.address, weth.address],
        log: true,
        skipIfAlreadyDeployed: true,
    });
    
    const sFactory = await deploy(TAG.FACTORY, {
        contract: CONTRACTS.FACTORY,
        from: deployer,
        args: [deployer],
        log: true,
        skipIfAlreadyDeployed: true,
    });
    const sRouter = await deploy(TAG.ROUTER, {
        contract: CONTRACTS.ROUTER,
        from: deployer,
        args: [sFactory.address, weth.address],
        log: true,
        skipIfAlreadyDeployed: true,
    });

    console.log(`
      Deployment success:\n
      WETH:\t${weth.address}\n
      UniSwap:
      \tRouter:\t${uRouter.address}
      \tFactory:\t${uFactory.address}
      SushiSwap:
      \tRouter:\t${sRouter.address}
      \tFactory:\t${sFactory.address}
      `)
};
export default func;
