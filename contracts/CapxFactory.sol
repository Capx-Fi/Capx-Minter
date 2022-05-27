// SPDX-License-Identifier: GNU GPLv3

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CapxStandardToken.sol";
import "./CapxBurnableToken.sol";
import "./CapxMintableToken.sol";

contract CapxFactory is Ownable {

    address [] public deployedTokens;

    event newTokenDeployed (
        string typeOfToken,
        string indexed tokenName,
        string indexed tokenSymbol,
        address indexed token,
        address owner,
        uint256 decimals
    );

    modifier checkIsAddressValid(address _address)
    {
        require(_address != address(0), "[Validation] Invalid address");
        require(_address == address(_address), "[Validation] Invalid address");
        _;
    }

    function createToken(
        string calldata _name,
        string calldata _symbol,
        uint8 _decimal,
        uint256 _supply,
        bool _burnable,
        bool _mintable
    ) external returns (address) {
        // Validation
        require(_decimal >= 8 && _decimal <= 18, "[Validation] Invalid Decimal");
        require(_supply > 0, "[Validation] Invalid Supply");

        if (_burnable) {
            CapxBurnableToken token = new CapxBurnableToken(
                _name,
                _symbol,
                msg.sender,
                _decimal,
                _supply
            );

            deployedTokens.push(address(token));

            emit newTokenDeployed(
                "BurnableToken", 
                _name, 
                _symbol, 
                address(token), 
                msg.sender, 
                _decimal
            );
            return address(token);
        } else if (_mintable) {
            CapxMintableToken token = new CapxMintableToken(
                _name,
                _symbol,
                msg.sender,
                _decimal,
                _supply
            );

            deployedTokens.push(address(token));

            emit newTokenDeployed(
                "MintableToken", 
                _name, 
                _symbol, 
                address(token), 
                msg.sender, 
                _decimal
            );
            return address(token);
        } else {
            CapxStandardToken token = new CapxStandardToken(
                _name,
                _symbol,
                msg.sender,
                _decimal,
                _supply
            );

            deployedTokens.push(address(token));

            emit newTokenDeployed(
                "StandardToken", 
                _name, 
                _symbol, 
                address(token), 
                msg.sender, 
                _decimal
            );
            return address(token);
        }
    }
}