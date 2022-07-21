import { BigNumber } from "ethers";
import log, { cLog } from "../log";
import { getAllDexContracts } from "./dex_info";
import { IPriceCompares, IPrices } from "./interfaces";
import { big, bigStd } from "./utils";


function sqrt(n: BigNumber) {
    if (n === big(0)) return 0;
    let val = n;
    while(!0) {
        let last = val;
        val = val.add(n).div(val).div(big(2));
        if (val.sub(last).abs().lt(bigStd(1e-9))) break;
        log.info(val.sub(last).abs().toString());
    }
    return val;
}

export function comparePrices(prices: IPrices) : IPriceCompares {
    return prices.price0.gt(prices.price1) ? {
        isDifference: !0,
        isPrice0GreaterThanPrice1: !0,
    } : prices.price0.lt(prices.price1) ? {
        isDifference: !0,
        isPrice0GreaterThanPrice1: !1,
    } : {
        isDifference: !1,
    };
}

function getD(a1: BigNumber, a2: BigNumber, b1: BigNumber, b2: BigNumber) : BigNumber {
    const min1 = a1.lt(b1) ? a1 : b1;
    const min2 = a2.lt(b2) ? a2 : b2;
    const min = min1.lt(min2) ? min1 : min2;

    // choose appropriate number to divide based on the minimum number
    return min.gt(bigStd(1e24)) ? bigStd(1e20) :
        min.gt(bigStd(1e23)) ? bigStd(1e19) :
        min.gt(bigStd(1e22)) ? bigStd(1e18) :
        min.gt(bigStd(1e21)) ? bigStd(1e17) :
        min.gt(bigStd(1e20)) ? bigStd(1e16) :
        min.gt(bigStd(1e19)) ? bigStd(1e15) :
        min.gt(bigStd(1e18)) ? bigStd(1e14) :
        min.gt(bigStd(1e17)) ? bigStd(1e13) :
        min.gt(bigStd(1e16)) ? bigStd(1e12) :
        min.gt(bigStd(1e15)) ? bigStd(1e11) :
        bigStd(1e10);
}

function calculateQuadraticSolution(A: BigNumber, B: BigNumber, C: BigNumber, B1: BigNumber, B2: BigNumber) : BigNumber | null {
    const a = A;
    const b = B;
    const c = C;
    const b1 = B1;
    const b2 = B2;
try{
    const m = b.mul(b).sub(big(4).mul(a).mul(c));
    const sq = sqrt(m);
    const d = a.mul(big(2));
    const x1 = b.mul(big(-1)).add(sq).div(d);
    const x2 = b.mul(big(-1)).sub(sq).div(d);

    cLog([a, b, c, b1, b2, m, x1, x2]);
    
    const isX1Valid = x1 > big(0) && x1 < b1 && x1 < b2;
    const isX2Valid = x2 > big(0) && x2 < b1 && x2 < b2;

    return isX1Valid ? x1 : isX2Valid ? x2 : null;

} catch(e) {
    cLog(e);
    return null;
}
}

export async function calculateBorrowAmount() : Promise<BigNumber | null> {
    const dexes = await getAllDexContracts();
    let [a1, b1] : BigNumber[] = await dexes.uPair.getReserves();
    let [a2, b2] : BigNumber[] = await dexes.sPair.getReserves();
    let d1: BigNumber = big(0);
    try{
        d1 = getD(a1, a2, b1, b2);
    } catch(e) {
        log.error('error!');
        cLog(e);
    }
    const d = d1
    cLog('d:', d.toString());
    cLog(b1.toString(), b2.toString());
    
    a1 = a1.div(d);
    b1 = b1.div(d);
    a2 = a2.div(d);
    b2 = b2.div(d);

    cLog(b1.toString(), b2.toString());

    // (int256 a1, int256 a2, int256 b1, int256 b2) =
    //     (int256(a1), int256(a2), int256(b1), int256(b2));

    const a = a1.mul(b1).sub(a2.mul(b2));
    const b = b1.mul(2).mul(b2).mul(a1.add(a2));
    const c = b1.mul(b2).mul(a1.mul(b2).sub(a2.mul(b1)));

    const amountOfQuoteTokenToBorrow = calculateQuadraticSolution(a, b, c, b1, b2);
    
    if(amountOfQuoteTokenToBorrow == null) return null;

    return amountOfQuoteTokenToBorrow;
}