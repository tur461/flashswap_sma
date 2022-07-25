import { Contract } from "ethers";
import { ethers } from "hardhat";
import log from "../../bot/log";
import { ADDRESS } from "../../constants";
import { CONTRACTS } from "../helpers/constants";
import { IToken, ITxObj } from "../helpers/interfaces";

const Case = {
    // case A: token1 cheaper on SushiSwap
    A: [
        [1e4, 10e4],
        [10e2, 5e2]
    ],
    // case B: token1 cheaper on UniSwap
    B: [
        [3e4, 10e4],
        [1e2, 10e2]
    ]
}

let uAmount: any[] = Case.A[0];
let sAmount: any[] = Case.A[1];

let Token: IToken = {
    A: {},
    B: {},
};

async function getContract(contractName: string, addr: string) : Promise<Contract> {
    return (await ethers.getContractAt(contractName, addr)) as Contract
}



async function onUniSwap() {
    const uRouter = await getContract(CONTRACTS.ROUTER, ADDRESS.UNI_ROUTER);
    log.info('got uni router');
    uAmount = uAmount.map(amt => ethers.utils.parseEther(amt.toFixed()));
    await addLiquidityOnChain(uAmount, uRouter);
    const amts = uAmount.map(amt => ethers.utils.formatEther(amt));
    log.info(`
        UniSwap ${Token.A.sym} / ${Token.B.sym} pair created
        Reserves: ${amts[0]} ${Token.A.sym} | ${amts[1]} ${Token.B.sym}
        Price: ${(uAmount[0]/uAmount[1]).toFixed(2)} ${Token.A.sym} / ${Token.B.sym}
    `)
}

async function onSushiSwap() {
    const sRouter = await getContract(CONTRACTS.ROUTER, ADDRESS.SUSHI_ROUTER);
    log.info('got sushi router');
    sAmount = sAmount.map(amt => ethers.utils.parseEther(amt.toFixed()));
    await addLiquidityOnChain(sAmount, sRouter);
    const amts = sAmount.map(amt => ethers.utils.formatEther(amt));
    log.info(`
        SushiSwap ${Token.A.sym} / ${Token.B.sym} pair created
        Reserves: ${amts[0]} ${Token.A.sym} | ${amts[1]} ${Token.B.sym}
        Price: ${(sAmount[0]/sAmount[1]).toFixed(2)} ${Token.A.sym} / ${Token.B.sym}
    `);
}

async function getTokensWithInfo() {
    const tkn0 = await getContract(CONTRACTS.SAITAMA, ADDRESS.SAITAMA);
    const tkn1 = await getContract(CONTRACTS.USDT, ADDRESS.USDT);
    
    Token.A.tkn = tkn0;
    Token.A.sym = await tkn0.symbol();
    Token.A.name = await tkn0.name();
    
    Token.B.tkn = tkn1;
    Token.B.sym = await tkn1.symbol();
    Token.B.name = await tkn1.name(); 
} 



async function addLiquidityOnChain(amounts: any[], router: Contract) {
    const myAccount = await (await ethers.getSigners())[0].getAddress();
    const op: ITxObj = {from: myAccount};
    const deadline = Math.round(Date.now() / 1000) + 60 * 60;
    const amts = amounts.map(amt => amt.toString());
    await getTokensWithInfo();
    let gasLimit = await Token.A.tkn?.estimateGas.approve(router.address, amts[0]);
    await Token.A.tkn?.approve(router.address, amts[0]);
    op.gas = gasLimit;
    gasLimit = await Token.B.tkn?.estimateGas.approve(router.address, amts[1]);
    op.gas = gasLimit
    await Token.B.tkn?.approve(router.address, amts[1]);
    gasLimit = await router.estimateGas.addLiquidity(
        Token.A.tkn?.address,
        Token.B.tkn?.address,
        amts[0],
        amts[1],
        0,
        0,
        myAccount,
        deadline
    );
    op.gas = gasLimit;
    log.info(`GasLimit: ${gasLimit}`);
    await router.addLiquidity(
        Token.A.tkn?.address,
        Token.B.tkn?.address,
        amts[0],
        amts[1],
        0,
        0,
        myAccount,
        deadline
    );
}

export async function addLiquidity(): Promise<any> {
    try{
        await onUniSwap();
        await onSushiSwap();
    } catch(e) {
        log.error('error adding liquidity.');
        console.log(e);
    }
}