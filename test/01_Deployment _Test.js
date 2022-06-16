const standardToken = artifacts.require("CapxStandardToken")
const burnableToken = artifacts.require("CapxBurnableToken");
const mintableToken = artifacts.require("CapxMintableToken");
const burnMintToken = artifacts.require("CapxMintBurnToken");

const standardPauseableToken = artifacts.require("CapxStandardPauseableToken");
const burnablePauseableToken = artifacts.require("CapxBurnablePauseableToken");
const mintablePauseableToken = artifacts.require("CapxMintablePauseableToken");
const burnMintPauseableToken = artifacts.require("CapxMintBurnPauseableToken");

const mintCappedToken = artifacts.require("CapxMintableCappedToken");
const mintBurnCappedToken = artifacts.require("CapxMintBurnCappedToken");
const mintCappedPauseableToken = artifacts.require("CapxMintableCappedPauseableToken");
const mintBurnCappedPauseableToken = artifacts.require("CapxMintBurnCappedPauseableToken");

const taxableToken = artifacts.require("CapxTaxableToken");
const autoLPTaxableToken = artifacts.require("CapxAutoLPTaxableToken");
const deflationaryToken = artifacts.require("CapxDeflationaryToken");
const autoLPDeflationaryToken = artifacts.require("CapxAutoLPDeflationaryToken");
const superDeflationaryToken = artifacts.require("CapxSuperDeflationaryToken");

const factory = artifacts.require("CapxFactory");

contract("Testing token workings" , async (accounts) => {

    var factoryInstance;
    var standardTokenInstance;
    var burnableTokenInstance;
    var mintableTokenInstance;
    var burnMintTokenInstance;

    var standardPauseableTokenInstance;
    var burnablePauseableTokenInstance;
    var mintablePauseableTokenInstance;
    var burnMintPauseableTokenInstance;

    var mintCappedTokenInstance;
    var mintBurnCappedTokenInstance;
    var mintCappedPauseableTokenInstance;
    var mintBurnCappedPauseableTokenInstance;

    var taxableTokenInstance;
    var autoLPTaxableTokenInstance;
    var deflationaryTokenInstance;
    var autoLPDeflationaryTokenInstance;
    var superDeflationaryTokenInstance;

    var owner = accounts[0];

    it("Should deploy the factory contract", async () => {
        factoryInstance = await factory.deployed();
        standardTokenInstance = await standardToken.deployed();
        burnableTokenInstance = await burnableToken.deployed();
        mintableTokenInstance = await mintableToken.deployed();
        burnMintTokenInstance = await burnMintToken.deployed();

        standardPauseableTokenInstance = await standardPauseableToken.deployed();
        burnablePauseableTokenInstance = await burnablePauseableToken.deployed();
        mintablePauseableTokenInstance = await mintablePauseableToken.deployed();
        burnMintPauseableTokenInstance = await burnMintPauseableToken.deployed();

        mintCappedTokenInstance = await mintCappedToken.deployed();
        mintBurnCappedTokenInstance = await mintBurnCappedToken.deployed();
        mintCappedPauseableTokenInstance = await mintCappedPauseableToken.deployed();
        mintBurnCappedPauseableTokenInstance = await mintBurnCappedPauseableToken.deployed();

        taxableTokenInstance = await taxableToken.deployed();
        autoLPTaxableTokenInstance = await autoLPTaxableToken.deployed();
        deflationaryTokenInstance = await deflationaryToken.deployed();
        autoLPDeflationaryTokenInstance = await autoLPDeflationaryToken.deployed();
        superDeflationaryTokenInstance = await superDeflationaryToken.deployed();

        assert(factoryInstance.address != undefined, "Factory contract address is undefined");
        assert(standardTokenInstance.address != undefined, "token address is undefined");
        assert(burnableTokenInstance.address != undefined, "Burnable token address is undefined");
        assert(mintableTokenInstance.address != undefined, "Mintable token address is undefined");
        assert(burnMintTokenInstance.address != undefined, "BurnMint token address is undefined");

        assert(standardPauseableTokenInstance.address != undefined, "Standard pauseable token address is undefined");
        assert(burnablePauseableTokenInstance.address != undefined, "Burnable pauseable token address is undefined");
        assert(mintablePauseableTokenInstance.address != undefined, "Mintable pauseable token address is undefined");
        assert(burnMintPauseableTokenInstance.address != undefined, "BurnMint pauseable token address is undefined");

        assert(mintCappedTokenInstance.address != undefined, "MintCapped token address is undefined");
        assert(mintBurnCappedTokenInstance.address != undefined, "MintBurnCapped token address is undefined");
        assert(mintCappedPauseableTokenInstance.address != undefined, "MintCapped pauseable token address is undefined");
        assert(mintBurnCappedPauseableTokenInstance.address != undefined, "MintBurnCapped pauseable token address is undefined");

        assert(taxableTokenInstance.address != undefined, "Taxable token address is undefined");
        assert(autoLPTaxableTokenInstance.address != undefined, "AutoLPTaxable token address is undefined");
        assert(deflationaryTokenInstance.address != undefined, "Deflationary token address is undefined");
        assert(autoLPDeflationaryTokenInstance.address != undefined, "AutoLPDeflationary token address is undefined");
        assert(superDeflationaryTokenInstance.address != undefined, "SuperDeflationary token address is undefined");
    });
});

