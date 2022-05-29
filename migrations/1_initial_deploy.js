const standardToken = artifacts.require("CapxStandardToken")
const burnableToken = artifacts.require("CapxBurnableToken");
const mintableToken = artifacts.require("CapxMintableToken");
const burnMintToken = artifacts.require("CapxMintBurnToken");

const standardPauseableToken = artifacts.require("CapxStandardPausableToken");
const burnablePauseableToken = artifacts.require("CapxBurnablePausableToken");
const mintablePauseableToken = artifacts.require("CapxMintablePausableToken");
const burnMintPauseableToken = artifacts.require("CapxMintBurnPausableToken");

const taxableToken = artifacts.require("CapxTaxableToken");
const autoLPTaxableToken = artifacts.require("CapxAutoLPTaxableToken");
const deflationaryToken = artifacts.require("CapxDeflationaryToken");
const autoLPDeflationaryToken = artifacts.require("CapxAutoLPDeflationaryToken");
const superDeflationaryToken = artifacts.require("CapxSuperDeflationaryToken");

const factory = artifacts.require("CapxFactory");

const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {

    // Standard Tokens
    await console.log("Deploying CapxStandardToken Contract");
    let CapxStandardToken = await deployer.deploy(standardToken);
    await console.log("CapxStandardToken Address " + CapxStandardToken.address);

    await console.log("Deploying CapxBurnableToken Contract");
    let CapxBurnableToken = await deployer.deploy(burnableToken);
    await console.log("CapxBurnableToken Address " + CapxBurnableToken.address);

    await console.log("Deploying CapxMintableToken Contract");
    let CapxMintableToken = await deployer.deploy(mintableToken);
    await console.log("CapxMintableToken Address " + CapxMintableToken.address);

    await console.log("Deploying CapxMintBurnToken Contract");
    let CapxMintBurnToken = await deployer.deploy(burnMintToken);
    await console.log("CapxMintBurnToken Address " + CapxMintBurnToken.address);


    // Pauseable Tokens
    await console.log("Deploying CapxStandardPausableToken Contract");
    let CapxStandardPausableToken = await deployer.deploy(standardPauseableToken);
    await console.log("CapxStandardPausableToken Address " + CapxStandardPausableToken.address);

    await console.log("Deploying CapxBurnablePausableToken Contract");
    let CapxBurnablePausableToken = await deployer.deploy(burnablePauseableToken);
    await console.log("CapxBurnablePausableToken Address " + CapxBurnablePausableToken.address);

    await console.log("Deploying CapxMintablePausableToken Contract");
    let CapxMintablePausableToken = await deployer.deploy(mintablePauseableToken);
    await console.log("CapxMintablePausableToken Address " + CapxMintablePausableToken.address);

    await console.log("Deploying CapxMintBurnPausableToken Contract");
    let CapxMintBurnPausableToken = await deployer.deploy(burnMintPauseableToken);
    await console.log("CapxMintBurnPausableToken Address " + CapxMintBurnPausableToken.address);

    // Reflection Tokens
    await console.log("Deploying CapxTaxableToken Contract");
    let CapxTaxableToken = await deployer.deploy(taxableToken);
    await console.log("CapxTaxableToken Address " + CapxTaxableToken.address);

    await console.log("Deploying CapxAutoLPTaxableToken Contract");
    let CapxAutoLPTaxableToken = await deployer.deploy(autoLPTaxableToken);
    await console.log("CapxAutoLPTaxableToken Address " + CapxAutoLPTaxableToken.address);

    await console.log("Deploying CapxDeflationaryToken Contract");
    let CapxDeflationaryToken = await deployer.deploy(deflationaryToken);
    await console.log("CapxDeflationaryToken Address " + CapxDeflationaryToken.address);

    await console.log("Deploying CapxAutoLPDeflationaryToken Contract");
    let CapxAutoLPDeflationaryToken = await deployer.deploy(autoLPDeflationaryToken);
    await console.log("CapxAutoLPDeflationaryToken Address " + CapxAutoLPDeflationaryToken.address);

    await console.log("Deploying CapxSuperDeflationaryToken Contract");
    let CapxSuperDeflationaryToken = await deployer.deploy(superDeflationaryToken);
    await console.log("CapxSuperDeflationaryToken Address " + CapxSuperDeflationaryToken.address);

    // Factory
    let CapxFactory = await deployProxy(factory, [standardToken.address], { kind: 'uups' });
    await console.log("CapxFactory Address " + CapxFactory.address);

    await CapxFactory.addNewERC20Implementation(
        "CapxMintableToken",
        CapxMintableToken.address
    );

    await CapxFactory.addNewERC20Implementation(
        "CapxBurnableToken",
        CapxBurnableToken.address
    );

    await CapxFactory.addNewERC20Implementation(
        "CapxMintBurnToken",
        CapxMintBurnToken.address
    );

    await CapxFactory.addNewERC20Implementation(
        "CapxStandardPausableToken",
        CapxStandardPausableToken.address
    );

    await CapxFactory.addNewERC20Implementation(
        "CapxMintablePausableToken",
        CapxMintablePausableToken.address
    );

    await CapxFactory.addNewERC20Implementation(
        "CapxBurnablePausableToken",
        CapxBurnablePausableToken.address
    );

    await CapxFactory.addNewERC20Implementation(
        "CapxMintBurnPausableToken",
        CapxMintBurnPausableToken.address
    );

    await CapxFactory.addNewERC20Implementation(
        "CapxTaxableToken",
        CapxTaxableToken.address
    );

    await CapxFactory.addNewERC20Implementation(
        "CapxAutoLPTaxableToken",
        CapxAutoLPTaxableToken.address
    );

    await CapxFactory.addNewERC20Implementation(
        "CapxDeflationaryToken",
        CapxDeflationaryToken.address
    );

    await CapxFactory.addNewERC20Implementation(
        "CapxAutoLPDeflationaryToken",
        CapxAutoLPDeflationaryToken.address
    );

    await CapxFactory.addNewERC20Implementation(
        "CapxSuperDeflationaryToken",
        CapxSuperDeflationaryToken.address
    );
};