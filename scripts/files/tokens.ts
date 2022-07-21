import { Contract } from "ethers";
import { CONTRACTS, INIT_VAL, TAG } from "../helpers/constants";
import { DeployOptions, IDeployTokensResult } from "../helpers/interfaces";

export async function deployTokens(op: DeployOptions): Promise<IDeployTokensResult> {
    const weth = await op.deploy(TAG.WETH, {
        contract: CONTRACTS.WETH,
        from: op.deployer,
        args: [],
        log: true,
        skipIfAlreadyDeployed: true,
    }) as Contract;

    const saitama = await op.deploy(TAG.SAITAMA, {
        contract: CONTRACTS.SAITAMA,
        from: op.deployer,
        args: [INIT_VAL.INITIAL_MINT_AMOUNT],
        log: true,
        skipIfAlreadyDeployed: true,
    }) as Contract;

    const usdt = await op.deploy(TAG.USDT, {
        contract: CONTRACTS.USDT,
        from: op.deployer,
        args: [INIT_VAL.INITIAL_MINT_AMOUNT],
        log: true,
        skipIfAlreadyDeployed: true,
    }) as Contract;

    return {
        weth, saitama, usdt
    }

}