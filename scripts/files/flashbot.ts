import { Contract } from "ethers";
import { ADDRESS } from "../../constants";
import { CONTRACTS, TAG } from "../helpers/constants";
import { DeployOptions } from "../helpers/interfaces";

export async function deployFlashBot(op: DeployOptions) : Promise<Contract> {
    const bot = await op.deploy(TAG.FLASH_BOT, {
        contract: CONTRACTS.FLASH_BOT,
        from: op.deployer,
        args: [op.usdt.address],
        log: true,
        skipIfAlreadyDeployed: true,
    }) as Contract;
    return bot;
}