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
        address[2] calldata _address,
        address _autoLPRouter
    ) public virtual;
}

contract CapxFactory is Initializable, UUPSUpgradeable, OwnableUpgradeable {

    uint256 public typesOfToken;
    mapping(uint256 => address) public erc20Implementations;
    mapping(uint256 => address[]) public deployedContracts;
    address public autoLPRouter;

    event NewERC20Implementation (
        string typeOfToken,
        uint256 indexed typeID,
        address indexed implementation,
        bool isReflective,
        bool[4] features
    );

    event NewTokenDeployed (
        uint256 tokenType,
        address indexed token,
        string documentHash,
        address deployer
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

    /**
     * @param _implementation - Implementation address of the ERC20 Token
    */
    function initialize (
        address _implementation,
        address _autoLPRouter
    ) public initializer checkIsAddressValid(_autoLPRouter) checkIsAddressValid(_implementation) {
        __Ownable_init();
        typesOfToken = 1;
        erc20Implementations[typesOfToken] = _implementation;
        autoLPRouter = _autoLPRouter;
        emit NewERC20Implementation(
            "Standard Token", 
            typesOfToken, 
            _implementation,
            false,
            [false,false,false,false]
        );
    }

    /**
    * @param typeOfToken - Type of ERC20 Token
    * @param _implementation - Implementation address of the ERC20 Token
    * @param _isReflective - Boolean to determine type of ERC20 Token
                [true] reflective
                [false] non-reflective
    * @param _features bool parameters
            _isReflective -> [false]
                [0] mintable flag, updatable by the owner after creation
                [1] burnable flag, updatable by the owner after creation
                [2] Pauseable flag, updatable by the owner after creation
                [3] capped flag, updatable by the owner after creation
            _isReflective -> [true]
                [0] taxable flag on transfers, updatable by the owner after creation
                [1] burnable flag on transfers, updatable by the owner after creation
                [2] autoLiquify flag on transfers, updatable by the owner after creation
                [3] marketing flag, updatable by the owner after creation
    */
    function addNewERC20Implementation(
        string calldata typeOfToken, 
        address _implementation,
        bool _isReflective,
        bool[4] calldata _features
    ) checkIsAddressValid(_implementation) external virtual onlyOwner {
        typesOfToken += 1;
        erc20Implementations[typesOfToken] = _implementation;
        emit NewERC20Implementation(
            typeOfToken, 
            typesOfToken, 
            _implementation,
            _isReflective,
            _features
        );
    }

    function updateAutoLPRouter(
        address _autoLPRouter
    ) checkIsAddressValid(_autoLPRouter) external virtual onlyOwner {
        autoLPRouter = _autoLPRouter;
    }

    /**
    * @param _name Token Name
    * @param _symbol Token Symbol
    * @param _owner Token Owner.
    * @param _decimal Token Decimal.
    * @param _initialSupply Token Supply minted at the time of creation
    * @param _totalSupply Maximum Token Supply.
    * @param _documentHash IPFS hash storing Token details.
    * @param _typeOfToken uint256 type of token between the range 1 - 12
            [1] Standard Token
            [2] Mintable Token
            [3] Burnable Token
            [4] Mintable & Burnable Token
            [5] Pauseable Standard Token
            [6] Pauseable Mintable Token
            [7] Pauseable Burnable Token
            [8] Pauseable Mintable & Burnable Token
            [9] Mintable & Capped Token
            [10] Mintable & Burnable & Capped Token
            [11] Pauseable Mintable & Capped Token
            [12] Pauseable Mintable & Burnable & Capped Token
    */
    function createToken(
        string calldata _name,
        string calldata _symbol,
        address _owner,
        uint8 _decimal,
        uint256 _initialSupply,
        uint256 _totalSupply,
        uint256 _typeOfToken,
        string calldata _documentHash
    ) external virtual returns (address deployed) {
        // Validation
        require(_decimal >= 8 && _decimal <= 18, "[Validation] Invalid Decimal");
        require(_initialSupply > 0 && _totalSupply > 0 && _initialSupply <= _totalSupply, "[Validation] Invalid Supply");
        require(_typeOfToken != 0, "Invalid Token Type");
        deployed = create(erc20Implementations[_typeOfToken]);
        // Handling low level exception
        assert(deployed != address(0));
        // Initializing Deployed Token
        if(_typeOfToken >=9 && _typeOfToken <= 12 ){
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
        // Updating the mapping with the deployed token for the type of Token
        deployedContracts[_typeOfToken].push(deployed);
        emit NewTokenDeployed(_typeOfToken, deployed,_documentHash, msg.sender);
        return deployed;
    }
    
    /**
    * @param _name Token Name
    * @param _symbol Token Symbol
    * @param _decimal Token Decimal.
    * @param _supply Token Supply
    * @param _documentHash IPFS hash storing Token details.
    * @param _address address parameters:
                    [0] owner, receives totalSupply and controls the parameters
                    [1] Uniswap-like (or) Pancake-like router for autoLiquify on transfers, must have WETH() function
                    [2] marketingAddress, only if _reflectionType[3] is set
    * @param _parameters address parameters:
                    [0] taxFee on transfers, updatable by the owner after creation
                    [1] burnFee on transfers, only if _reflectionType[1] is set
                    [2] liquidityFee on transfers, only if _reflectionType[2] is set
                    [3] marketingFee on transfers, only if _reflectionType[3] is set
                    [4] liquidityThreshold, min amount of tokens to be swapped on transfers, only if _reflectionType[2] is set.
    * @param _typeOfToken uint256 type of token between the range 13 - 17 :
                    [13] Taxable Token
                    [14] AutoLPTaxable Token
                    [15] Defaltionary Token
                    [16] AutoLPDefaltionary Token
                    [17] SuperDefaltionary Token
    */
    function createReflectiveToken(
        string calldata _name,
        string calldata _symbol,
        uint8 _decimal,
        uint256 _supply,
        address[2] calldata _address,
        uint256[5] calldata _parameters,
        uint256 _typeOfToken,
        string calldata _documentHash
    ) external virtual checkIsAddressValid(_address[0]) returns (address deployed) {
        require(
            (_typeOfToken != 17 || _address[1] != address(0)) // If Marketing then Marketing Address cannot be Zero.
            && 
            ((_typeOfToken != 14 && _typeOfToken != 16) || autoLPRouter != address(0)) // If AutoLiquify then Router Address cannot be Zero.
            , "[Validation] Invalid Address"
        );
        require(_typeOfToken != 0, "Invalid Token Type");
        deployed = create(erc20Implementations[_typeOfToken]);
        // Handling low level exception
        assert(deployed != address(0));
        // address[3] memory _addressList = [_address[0],autoLPRouter,_address[1]];

        CapxReflectionToken(deployed).initializer(
            _name,
            _symbol,
            _decimal,
            _supply,
            _parameters,
            _address,
            autoLPRouter
        );
        // Updating the mapping with the deployed token for the type of Token
        deployedContracts[_typeOfToken].push(deployed);
        emit NewTokenDeployed(_typeOfToken, deployed,_documentHash, msg.sender);
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