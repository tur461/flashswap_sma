// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//a mock token for cflu (coinfluence ido lp native token)
contract SAITAMA is ERC20 {
    constructor(uint256 totalSupply_) ERC20("Saitama erc20 Token", "SAITAMA") {
        _mint(msg.sender, totalSupply_);
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}
