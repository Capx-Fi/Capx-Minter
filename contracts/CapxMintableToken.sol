// SPDX-License-Identifier: GNU GPLv3

import "./CapxStandardToken.sol";

pragma solidity ^0.8.4;

contract CapxMintableToken is CapxStandardToken {
    constructor(
        string memory name_, 
        string memory symbol_,
        address owner_,
        uint8 decimal_,
        uint256 supply_
    ) checkIsAddressValid(owner_) 
    CapxStandardToken(
        name_,
        symbol_,
        owner_,
        decimal_,
        supply_
    ) {
    }

    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }
}