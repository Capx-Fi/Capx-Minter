# Factory Contract
The `Factory` contract is the contract responsible for creating new ERC20 tokens.

## Variables
* `uint256 public typesOfToken` : The number of different token types that can be created.
* `mapping(uint256 => address) public erc20Implementations` : The mapping of token types to the address of the ERC20 contract used for implementing them.
* `mapping(uint256 => address[]) public deployedContracts` : The mapping of token types to the address of the deployed contracts.
  
## Events
### NewERC20Implementation
```solidity
event NewERC20Implementation (
        string typeOfToken,
        uint256 indexed typeID,
        address indexed implementation,
        bool isReflective,
        bool[4] features
    );
```
Event emitted when a new ERC20 implementation is added to the factory.
* `typeOfToken` : The name of the type of token that is being added.
* `typeID` : The index of the token type in `erc20Implementations`.
* `implementation` : The address of the ERC20 contract that is being added.
* `isReflective` : Whether the token is reflective.
* `features` : The features of the token.

### NewERC20Deployed
```solidity
event NewTokenDeployed (
        uint256 tokenType,
        address indexed token,
        string documentHash
    );
```
Event emitted when a new ERC20 contract is deployed.
* `tokenType` : The index of the token type in `erc20Implementations`.
* `token` : The address of the deployed token.
* `documentHash` : The hash of the document that contains other information about the token.

## Modifiers
### checkIsAddressValid
```solidity
modifier checkIsAddressValid(address _address)
    {
        require(_address != address(0), "[Validation] Invalid address");
        require(_address == address(_address), "[Validation] Invalid address");
        _;
    }
```
Modifier that checks if the address is valid.

## Functions
### Initializer

```solidity
function initialize (
        address _implementation,
        address _autoLPRouter
    ) public initializer checkIsAddressValid(_autoLPRouter) checkIsAddressValid(_implementation)
```
While deploying, `deployProxy` internally calls this initializer for the controller contract.

__Inputs Required :__ 
* `_implementation` : The address of the first ERC20 implementation to be implemented (usually Standard token).
* `_autoLPRouter` : The address of the autoLPRouter contract.

### _authorizeUpgrade

```solidity
  function _authorizeUpgrade(
    address _newImplementation
    ) internal 
    override 
    onlyOwner
```
Function responsible to internally update the smart contract, ideally it should revert when msg.sender is not authorized to upgrade the contract.

### addNewERC20Implementation

```solidity
function addNewERC20Implementation(
        string calldata typeOfToken, 
        address _implementation,
        bool _isReflective,
        bool[4] calldata _features
    ) checkIsAddressValid(_implementation) external virtual onlyOwner
```
Function responsible to add a new ERC20 implementation to the factory.

__Inputs Required :__
* `typeOfToken` : The name of the type of token that is being added.
* `_implementation` : The address of the ERC20 contract that is being added.
* `_isReflective` : Whether the token is reflective.
* `_features` : The features of the token.

Emits the [NewERC20Implementation](#event-newerc20implementation) event.

### updateAutoLPRouter

```solidity
function updateAutoLPRouter(
        address _autoLPRouter
    ) checkIsAddressValid(_autoLPRouter) external virtual onlyOwner
```
Function responsible to update the autoLPRouter contract address.

__Inputs Required :__
* `_autoLPRouter` : The address of the new autoLPRouter contract.

### createToken

```solidity
function createToken(
        string calldata _name,
        string calldata _symbol,
        address _owner,
        uint8 _decimal,
        uint256 _initialSupply,
        uint256 _totalSupply,
        uint256 _typeOfToken,
        string calldata _documentHash
    ) external virtual returns (address deployed)
```
Function responsible to create a new non-Reflective ERC20 token.

__Inputs Required :__
* `_name` : The name of the token.
* `_symbol` : The symbol of the token.
* `_owner` : The address of the owner of the token.
* `_decimal` : The number of decimals of the token.
* `_initialSupply` : The initial supply of the token.
* `_totalSupply` : The total supply of the token.
* `_typeOfToken` : The index of the token type in `erc20Implementations`.
* `_documentHash` : The hash of the document that contains other information about the token.

Returns the address of the deployed token.

Emits the [NewTokenDeployed](#event-newtokendeployed) event.

### createReflectiveToken

```solidity
function createReflectiveToken(
        string calldata _name,
        string calldata _symbol,
        uint8 _decimal,
        uint256 _supply,
        address[2] calldata _address,
        uint256[5] calldata _parameters,
        uint256 _typeOfToken,
        string calldata _documentHash
    ) external virtual checkIsAddressValid(_address[0]) returns (address deployed)
```
Function responsible to create a new Reflective ERC20 token.

__Inputs Required :__
* `_name` : The name of the token.
* `_symbol` : The symbol of the token.
* `_decimal` : The number of decimals of the token.
* `_supply` : The supply of the token.
* `_address` : 
  * [0] : owner, receives totalSupply and controls the parameters
  * [1] : marketingAddress, only if _reflectionType[3] is set (i.e for types 14 16 and 17)
* `_parameters` :
  * [0] : taxFee on transfers, updatable by the owner after creation
  * [1] : burnFee on transfers, only if _reflectionType[1] is set
  * [2] : liquidityFee on transfers, only if _reflectionType[2] is set (i.e for types 15 16 and 17)
  * [3] : marketingFee on transfers, only if _reflectionType[3] is set (i.e for types 14 16 and 17)
  * [4] :  liquidityThreshold, min amount of tokens to be swapped on transfers, only if _reflectionType[2] is set (i.e for types 15 16 and 17)
* `_typeOfToken` : The index of the token type in `erc20Implementations`.
* `_documentHash` : The hash of the document that contains other information about the token.

Returns the address of the deployed token.

Emits the [NewTokenDeployed](#event-newtokendeployed) event.

### create

```solidity
function create(address _target) internal returns (address result)
```
Function that clones a contract using [EIP-1167](https://eips.ethereum.org/EIPS/eip-1167).

__Inputs Required :__
* `_target` : The address of the contract to be cloned.
  
Returns the address of the cloned contract.