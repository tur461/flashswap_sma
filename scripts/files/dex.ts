import { CONTRACTS, TAG } from "../helpers/constants";
import { DeployOptions, IDeployDex1Result, IDeployDex2Result, IDeployDexesResult } from "../helpers/interfaces";

async function deployUniSwap(op: DeployOptions) : Promise<IDeployDex1Result> {
    const uFactory = await op.deploy(TAG.UNI_FACTORY, {
        contract: CONTRACTS.FACTORY,
        from: op.deployer,
        args: [op.deployer],
        log: true,
        skipIfAlreadyDeployed: true,
    });
    const uRouter = await op.deploy(TAG.UNI_ROUTER, {
        contract: CONTRACTS.ROUTER,
        from: op.deployer,
        args: [uFactory.address, op.weth.address],
        log: true,
        skipIfAlreadyDeployed: true,
    });   

    return {
        uFactory,
        uRouter,
    }
}

async function deploySushiSwap(op: DeployOptions) : Promise<IDeployDex2Result> {
    const sFactory = await op.deploy(TAG.SUSHI_FACTORY, {
        contract: CONTRACTS.FACTORY,
        from: op.deployer,
        args: [op.deployer],
        log: true,
        skipIfAlreadyDeployed: true,
    });
    const sRouter = await op.deploy(TAG.SUSHI_ROUTER, {
        contract: CONTRACTS.ROUTER,
        from: op.deployer,
        args: [sFactory.address, op.weth.address],
        log: true,
        skipIfAlreadyDeployed: true,
    });   

    return {
        sFactory,
        sRouter,
    }
}

export async function deployDexes(op: DeployOptions) : Promise<IDeployDexesResult> {
    const dx1 = await deployUniSwap(op);
    const dx2 = await deploySushiSwap(op);
    return {
        ...dx1,
        ...dx2,
    }
}