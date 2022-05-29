// SPDX-License-Identifier: GNU GPLv3

pragma solidity ^0.8.4;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

abstract contract CapxToken {
    function initializer (
        string calldata name_, 
        string calldata symbol_,
        address owner_,
        uint8 decimal_,
        uint256 supply_
    ) public virtual;
}
abstract contract CapxReflectionToken {
    function initializer (
        string calldata name_,
        string calldata symbol_,
        uint8 decimal_,
        uint256 supply_,
        uint256[5] calldata _parameters,
        address[3] calldata _address
    ) public virtual;
}

contract CapxFactory is Initializable, UUPSUpgradeable, OwnableUpgradeable {

    uint256 public typesOfToken;
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
        __Ownable_init();
        typesOfToken = 1;
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

    function _getTypeOfToken(bool _mintable, bool _burnable, bool _pausable) internal pure returns (uint256 _typeOfToken) {
        if(!_pausable) {
            if(_mintable && _burnable) {
                // MintBurnToken
                _typeOfToken = 4; 
            } else if(_burnable) {
                // BurnableToken
                _typeOfToken = 3;
            } else if(_mintable) {
                // MintableToken
                _typeOfToken = 2;
            } else {
                // StandardToken
                _typeOfToken = 1;
            }
        } else if (_pausable){
            if(_mintable && _burnable) {
                // PausableMintBurnToken
                _typeOfToken = 8;
            } else if(_burnable) {
                // PausableBurnToken
                _typeOfToken = 7;
            } else if(_mintable) {
                // PausableMintToken
                _typeOfToken = 6;
            } else {
                // PausableStandardToken
                _typeOfToken = 5;
            }
        }
    }

    function _getTypeOfReflectionToken(bool[4] calldata _reflectionType) internal pure returns (uint256 _typeOfToken) {
        if(_reflectionType[0] && _reflectionType[1] && _reflectionType[2] && _reflectionType[3]){
            // SuperDefaltionaryToken
            _typeOfToken = 13;
        } else if (_reflectionType[0] && _reflectionType[1] && _reflectionType[2] && !_reflectionType[3]) {
            // AutoLPDeflationaryToken
            _typeOfToken = 12;
        } else if (_reflectionType[0] && _reflectionType[1] && !_reflectionType[2] && !_reflectionType[3]){
            // DefaltionaryToken
            _typeOfToken = 11;
        } else if (_reflectionType[0] && !_reflectionType[1] && _reflectionType[2] && !_reflectionType[3]) {
            // AutoLPTaxableToken
            _typeOfToken = 10;
        } else if (_reflectionType[0] && !_reflectionType[1] && !_reflectionType[2] && !_reflectionType[3]) {
            // Taxable Tolen
            _typeOfToken = 9;
        }
    }

    function createToken(
        string calldata _name,
        string calldata _symbol,
        uint8 _decimal,
        uint256 _supply,
        bool _mintable,
        bool _burnable,
        bool _pausable
    ) external virtual returns (address) {
        // Validation
        require(_decimal >= 8 && _decimal <= 18, "[Validation] Invalid Decimal");
        require(_supply > 0, "[Validation] Invalid Supply");
        uint256 _typeOfToken = _getTypeOfToken(_mintable, _burnable, _pausable);
        assert(_typeOfToken != 0);
        address deployed = create(erc20Implementations[_typeOfToken]);
        // Handling low level exception
        assert(deployed != address(0));
        // Initializing Deployed Token
        CapxToken(deployed).initializer(
            _name,
            _symbol,
            msg.sender,
            _decimal,
            _supply
        );
        return deployed;
    }
    /**
    * @param _address address parameters:
                    [0] owner, receives totalSupply and controls the parameters
                    [1] Uniswap-like (or) Pancake-like router for autoLiquify on transfers, must have WETH() function
                    [2] marketingAddress, only if _reflectionType[3] is set
    * @param _reflectionType bool parameters:
                    [0] taxable flag on transfers, updatable by the owner after creation
                    [1] burnable flag on transfers, updatable by the owner after creation
                    [2] autoLiquify flag on transfers, updatable by the owner after creation
                    [3] marketing flag, updatable by the owner after creation
    * @param _parameters address parameters:
                    [0] taxFee on transfers, updatable by the owner after creation
                    [1] burnFee on transfers, only if _reflectionType[1] is set
                    [2] liquidityFee on transfers, only if _reflectionType[2] is set
                    [3] marketingFee on transfers, only if _reflectionType[3] is set
                    [4] liquidityThreshold, min amount of tokens to be swapped on transfers, only if _reflectionType[2] is set.
    */
    function createReflectiveToken(
        string calldata _name,
        string calldata _symbol,
        uint8 _decimal,
        uint256 _supply,
        address[3] calldata _address,
        bool[4] calldata _reflectionType,
        uint256[5] calldata _parameters
    ) external virtual checkIsAddressValid(_address[0]) returns (address) {
        require(
            (_reflectionType[3] && _address[2] != address(0)) // If Marketing then Marketing Address cannot be Zero.
            && 
            (_reflectionType[2] && _address[1] != address(0)) // If AutoLiquify then Router Address cannot be Zero.
            , "[Validation] Invalid Address"
        );
        uint256 _typeOfToken = _getTypeOfReflectionToken(_reflectionType);
        assert(_typeOfToken != 0);
        address deployed = create(erc20Implementations[_typeOfToken]);
        // Handling low level exception
        assert(deployed != address(0));
        CapxReflectionToken(deployed).initializer(
            _name,
            _symbol,
            _decimal,
            _supply,
            _parameters,
            _address
        );
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