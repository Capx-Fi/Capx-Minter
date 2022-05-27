// SPDX-License-Identifier: GNU GPLv3

pragma solidity ^0.8.4;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

abstract contract CapxStandardToken {
    function initializer (
        string calldata name_, 
        string calldata symbol_,
        address owner_,
        uint8 decimal_,
        uint256 supply_
    ) public virtual;
}

abstract contract CapxMintableToken {
    function initializer (
        string calldata name_, 
        string calldata symbol_,
        address owner_,
        uint8 decimal_,
        uint256 supply_
    ) public virtual;
}

abstract contract CapxBurnableToken {
    function initializer (
        string calldata name_, 
        string calldata symbol_,
        address owner_,
        uint8 decimal_,
        uint256 supply_
    ) public virtual;
}

abstract contract CapxMintBurnToken {
    function initializer (
        string calldata name_, 
        string calldata symbol_,
        address owner_,
        uint8 decimal_,
        uint256 supply_
    ) public virtual;
}

contract CapxFactory is Initializable, UUPSUpgradeable, OwnableUpgradeable {

    uint256 public typesOfToken = 0;
    mapping(uint256 => address) public erc20Implementations;
    mapping(uint256 => address[]) public deployedContracts;

    event newERC20Implementation (
        string typeOfToken,
        uint256 indexed typeID,
        address indexed implementation
    );

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

    function _authorizeUpgrade(address _newImplementation)
        internal
        override
        onlyOwner
    {}

    function initialize (
        address _implementation
    ) public initializer {
        typesOfToken += 1;
        erc20Implementations[typesOfToken] = _implementation;
        emit newERC20Implementation(
            "CapxStandardToken", 
            typesOfToken, 
            _implementation
        );
    }

    function addNewERC20Implementation(string calldata typeOfToken, address _implementation) checkIsAddressValid(_implementation) external onlyOwner {
        typesOfToken += 1;
        erc20Implementations[typesOfToken] = _implementation;
        emit newERC20Implementation(
            typeOfToken, 
            typesOfToken, 
            _implementation);
    }

    function createToken(
        string calldata _name,
        string calldata _symbol,
        uint8 _decimal,
        uint256 _supply,
        uint256 _typeOfToken,
        uint256[] memory _parameters
    ) external virtual returns (address) {
        // Validation
        require(_decimal >= 8 && _decimal <= 18, "[Validation] Invalid Decimal");
        require(_supply > 0, "[Validation] Invalid Supply");
        address deployed = create(erc20Implementations[_typeOfToken]);
        // Handling low level exception
        assert(deployed != address(0));
        if(_typeOfToken == 1) {
            CapxStandardToken(deployed).initializer(
                _name,
                _symbol,
                msg.sender,
                _decimal,
                _supply
            );
        } else if ( _typeOfToken == 2 ) {
            CapxMintableToken(deployed).initializer(
                _name,
                _symbol,
                msg.sender,
                _decimal,
                _supply
            );
        } else if ( _typeOfToken == 3 ) {
            CapxBurnableToken(deployed).initializer(
                _name,
                _symbol,
                msg.sender,
                _decimal,
                _supply
            );
        } else if ( _typeOfToken == 4 ) {
            CapxBurnableToken(deployed).initializer(
                _name,
                _symbol,
                msg.sender,
                _decimal,
                _supply
            );
        }
        return deployed;
    }

    /// @notice Function uses EIP-1167 implementation
    function create(address _target) internal returns (address result) {
        bytes20 targetBytes = bytes20(_target);
        assembly {
            let clone := mload(0x40)
            mstore(
                clone,
                0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000
            )
            mstore(add(clone, 0x14), targetBytes)
            mstore(
                add(clone, 0x28),
                0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000
            )
            result := create(0, clone, 0x37)
        }
    }
}