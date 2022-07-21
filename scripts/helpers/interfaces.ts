import { Contract } from "ethers";

export interface DeployOptions {
    deploy: any;
    deployer: string;
    weth?: any;
    saitama?: any;
    usdt?: any;
}

export interface ITxObj {
    from: string;
    gas?: any;
}

export interface IDeployDex1Result {
    uRouter: Contract;
    uFactory: Contract;
}

export interface IDeployDex2Result {
    sRouter: Contract;
    sFactory: Contract;
}

export interface IDeployDexesResult {
    uRouter: Contract;
    sRouter: Contract;
    uFactory: Contract;
    sFactory: Contract;
}

export interface IDeployTokensResult {
    weth: Contract;
    usdt: Contract;
    saitama: Contract;
}

export interface ITokenInfo {
    tkn?: Contract;
    sym?: string;
    name?: string;
}

export interface IToken {
    A: ITokenInfo;
    B: ITokenInfo;
}

export interface Pairs {
    uPair: string;
    sPair: string;
}
