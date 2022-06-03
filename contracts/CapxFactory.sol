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

abstract contract CapxCappedToken {
    function initializer (
        string calldata name_, 
        string calldata symbol_,
        address owner_,
        uint8 decimal_,
        uint256 initialSupply_,
        uint256 totalCappedSupply_
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

    function addNewERC20Implementation(string calldata typeOfToken, address _implementation) checkIsAddressValid(_implementation) external virtual onlyOwner {
        typesOfToken += 1;
        erc20Implementations[typesOfToken] = _implementation;
        emit newERC20Implementation(
            typeOfToken, 
            typesOfToken, 
            _implementation);
    }

    /**
    * @param _features bool parameters:
            [0] mintable flag, updatable by the owner after creation
            [1] burnable flag, updatable by the owner after creation
            [2] Pauseable flag, updatable by the owner after creation
            [3] capped flag, updatable by the owner after creation
    */
    function _getTypeOfToken(bool[4] calldata _features) internal pure virtual returns (uint256 _typeOfToken) {
        if(!_features[2]) {
            if(_features[0] && _features[1] && !_features[3]) {
                // MintBurnToken
                _typeOfToken = 4; 
            } else if(_features[0] && _features[1] && _features[3]) {
                // MintBurnCappedToken
                _typeOfToken = 10; 
            }else if(_features[1]) {
                // BurnableToken
                _typeOfToken = 3;
            } else if(_features[0] && !_features[3] ) {
                // MintableToken
                _typeOfToken = 2;
            } else if(_features[0] && _features[3] ) {
                // MintableCappedToken
                _typeOfToken = 9;
            } else {
                // StandardToken
                _typeOfToken = 1;
            }
        } else if (_features[2]){
            if(_features[0]  && _features[1] && !_features[3]) {
                // PauseableMintBurnToken
                _typeOfToken = 8;
            } else if(_features[0] && _features[1] && _features[3]) {
                // PauseableMintBurnCappedToken
                _typeOfToken = 12; 
            } else if(_features[1]) {
                // PauseableBurnToken
                _typeOfToken = 7;
            } else if(_features[0] && !_features[3] ) {
                // PauseableMintToken
                _typeOfToken = 6;
            } else if(_features[0] && _features[3]) {
                // PauseableMintCappedToken
                _typeOfToken = 11;
            } else {
                // PauseableStandardToken
                _typeOfToken = 5;
            }
        }
    }

    function _getTypeOfReflectionToken(bool[4] calldata _reflectionType) internal pure virtual returns (uint256 _typeOfToken) {
        if(_reflectionType[0] && _reflectionType[1] && _reflectionType[2] && _reflectionType[3]){
            // SuperDefaltionaryToken
            _typeOfToken = 17;
        } else if (_reflectionType[0] && _reflectionType[1] && _reflectionType[2] && !_reflectionType[3]) {
            // AutoLPDeflationaryToken
            _typeOfToken = 16;
        } else if (_reflectionType[0] && _reflectionType[1] && !_reflectionType[2] && !_reflectionType[3]){
            // DefaltionaryToken
            _typeOfToken = 15;
        } else if (_reflectionType[0] && !_reflectionType[1] && _reflectionType[2] && !_reflectionType[3]) {
            // AutoLPTaxableToken
            _typeOfToken = 14;
        } else if (_reflectionType[0] && !_reflectionType[1] && !_reflectionType[2] && !_reflectionType[3]) {
            // Taxable Tolen
            _typeOfToken = 13;
        }
    }
    /**
    * @param _name Token Name
    * @param _symbol Token Symbol
    * @param _decimal Token Decimal.
    * @param _owner Token Owner.
    * @param _initialSupply Token Supply minted at the time of creation
    * @param _totalSupply Maximum Token Supply.
    * @param _features bool parameters:
            [0] mintable flag, updatable by the owner after creation
            [1] burnable flag, updatable by the owner after creation
            [2] Pauseable flag, updatable by the owner after creation
            [3] capped flag, updatable by the owner after creation
    */
    function createToken(
        string calldata _name,
        string calldata _symbol,
        address _owner,
        uint8 _decimal,
        uint256 _initialSupply,
        uint256 _totalSupply,
        bool[4] calldata _features
    ) external virtual returns (address) {
        // Validation
        require(_decimal >= 8 && _decimal <= 18, "[Validation] Invalid Decimal");
        require(_initialSupply > 0 && _totalSupply > 0 && _initialSupply <= _totalSupply, "[Validation] Invalid Supply");
        uint256 _typeOfToken = _getTypeOfToken(_features);
        assert(_typeOfToken != 0);
        address deployed = create(erc20Implementations[_typeOfToken]);
        // Handling low level exception
        assert(deployed != address(0));
        // Initializing Deployed Token
        if(_features[3]){
            CapxCappedToken(deployed).initializer(
                _name,
                _symbol,
                _owner,
                _decimal,
                _initialSupply,
                _totalSupply
            );
        } else {
            CapxToken(deployed).initializer(
                _name,
                _symbol,
                _owner,
                _decimal,
                _initialSupply
            );
        }
        return deployed;
    }
    /**
    * @param _name Token Name
    * @param _symbol Token Symbol
    * @param _decimal Token Decimal.
    * @param _supply Token Supply
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
            (!_reflectionType[3] || _address[2] != address(0)) // If Marketing then Marketing Address cannot be Zero.
            && 
            (!_reflectionType[2] || _address[1] != address(0)) // If AutoLiquify then Router Address cannot be Zero.
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