import { getDexInfo } from "./dex_info";
import { addLiquidity } from "./add_liquidity";

async function main() {
    await addLiquidity();
    await getDexInfo();
}

(async () => await main())();