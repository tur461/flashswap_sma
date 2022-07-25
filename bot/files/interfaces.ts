import { BigNumber, Contract } from "ethers"

export interface IDexes {
    uPair: Contract;
    sPair: Contract;
    uRouter: Contract;
    sRouter: Contract;
    uFactory: Contract;
    sFactory: Contract;
}

export interface IPrices {
    price0: BigNumber,
    price1: BigNumber,
}

export interface IProfit {
    profit: BigNumber;
    baseToken: string;
}
export interface ITxQueue {
    buf: any;
    Q: any[];
    id: number;
    getId: Function;
    add2Q: Function;
    add2Buf: Function;
    waitForTx: Function;
    isBufEmpty: Function;
}