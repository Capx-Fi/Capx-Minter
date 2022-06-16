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
// const autoLPTaxableToken = artifacts.require("CapxAutoLPTaxableToken");
const deflationaryToken = artifacts.require("CapxDeflationaryToken");
// const autoLPDeflationaryToken = artifacts.require("CapxAutoLPDeflationaryToken");
// const superDeflationaryToken = artifacts.require("CapxSuperDeflationaryToken");

const factory = artifacts.require("CapxFactory");

const routerAdd = "0x0000000000000000000000000000000000000000";

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
    await console.log("Deploying CapxStandardPauseableToken Contract");
    let CapxStandardPauseableToken = await deployer.deploy(standardPauseableToken);
    await console.log("CapxStandardPauseableToken Address " + CapxStandardPauseableToken.address);

    await console.log("Deploying CapxBurnablePauseableToken Contract");
    let CapxBurnablePauseableToken = await deployer.deploy(burnablePauseableToken);
    await console.log("CapxBurnablePauseableToken Address " + CapxBurnablePauseableToken.address);

    await console.log("Deploying CapxMintablePauseableToken Contract");
    let CapxMintablePauseableToken = await deployer.deploy(mintablePauseableToken);
    await console.log("CapxMintablePauseableToken Address " + CapxMintablePauseableToken.address);

    await console.log("Deploying CapxMintBurnPauseableToken Contract");
    let CapxMintBurnPauseableToken = await deployer.deploy(burnMintPauseableToken);
    await console.log("CapxMintBurnPauseableToken Address " + CapxMintBurnPauseableToken.address);

    // Capped Tokens
    await console.log("Deploying CapxMintableCappedToken Contract");
    let CapxMintableCappedToken = await deployer.deploy(mintCappedToken);
    await console.log("CapxMintableCappedToken Address " + CapxMintableCappedToken.address);

    await console.log("Deploying CapxMintBurnCappedToken Contract");
    let CapxMintBurnCappedToken = await deployer.deploy(mintBurnCappedToken);
    await console.log("CapxMintBurnCappedToken Address " + CapxMintBurnCappedToken.address);

    await console.log("Deploying CapxMintableCappedPauseableToken Contract");
    let CapxMintableCappedPauseableToken = await deployer.deploy(mintCappedPauseableToken);
    await console.log("CapxMintableCappedPauseableToken Address " + CapxMintableCappedPauseableToken.address);

    await console.log("Deploying CapxMintBurnCappedPauseableToken Contract");
    let CapxMintBurnCappedPauseableToken = await deployer.deploy(mintBurnCappedPauseableToken);
    await console.log("CapxMintBurnCappedPauseableToken Address " + CapxMintBurnCappedPauseableToken.address);

    // Reflection Tokens
    await console.log("Deploying CapxTaxableToken Contract");
    let CapxTaxableToken = await deployer.deploy(taxableToken);
    await console.log("CapxTaxableToken Address " + CapxTaxableToken.address);

    // await console.log("Deploying CapxAutoLPTaxableToken Contract");
    // let CapxAutoLPTaxableToken = await deployer.deploy(autoLPTaxableToken);
    // await console.log("CapxAutoLPTaxableToken Address " + CapxAutoLPTaxableToken.address);

    await console.log("Deploying CapxDeflationaryToken Contract");
    let CapxDeflationaryToken = await deployer.deploy(deflationaryToken);
    await console.log("CapxDeflationaryToken Address " + CapxDeflationaryToken.address);

    // await console.log("Deploying CapxAutoLPDeflationaryToken Contract");
    // let CapxAutoLPDeflationaryToken = await deployer.deploy(autoLPDeflationaryToken);
    // await console.log("CapxAutoLPDeflationaryToken Address " + CapxAutoLPDeflationaryToken.address);

    // await console.log("Deploying CapxSuperDeflationaryToken Contract");
    // let CapxSuperDeflationaryToken = await deployer.deploy(superDeflationaryToken);
    // await console.log("CapxSuperDeflationaryToken Address " + CapxSuperDeflationaryToken.address);

    // Factory
    let CapxFactory = await deployProxy(factory, [standardToken.address, routerAdd], { kind: 'uups' });
    await console.log("CapxFactory Address " + CapxFactory.address);

    await CapxFactory.addNewERC20Implementation(
        "CapxMintableToken",
        CapxMintableToken.address,
        false,
        [true,false,false,false]
    );

    await CapxFactory.addNewERC20Implementation(
        "CapxBurnableToken",
        CapxBurnableToken.address,
        false,
        [false,true,false,false]
    );

    await CapxFactory.addNewERC20Implementation(
        "CapxMintBurnToken",
        CapxMintBurnToken.address,
        false,
        [true,true,false,false]
    );

    // Pauseable Token
    await CapxFactory.addNewERC20Implementation(
        "CapxStandardPauseableToken",
        CapxStandardPauseableToken.address,
        false,
        [false,false,true,false]
    );

    await CapxFactory.addNewERC20Implementation(
        "CapxMintablePauseableToken",
        CapxMintablePauseableToken.address,
        false,
        [true,false,true,false]
    );

    await CapxFactory.addNewERC20Implementation(
        "CapxBurnablePauseableToken",
        CapxBurnablePauseableToken.address,
        false,
        [false,true,true,false]
    );

    await CapxFactory.addNewERC20Implementation(
        "CapxMintBurnPauseableToken",
        CapxMintBurnPauseableToken.address,
        false,
        [true,true,true,false]
    );

    // Capped Tokens
    await CapxFactory.addNewERC20Implementation(
        "CapxMintableCappedToken",
        CapxMintableCappedToken.address,
        false,
        [true,false,false,true]
    );

    await CapxFactory.addNewERC20Implementation(
        "CapxMintBurnCappedToken",
        CapxMintBurnCappedToken.address,
        false,
        [true,true,false,true]
    );

    await CapxFactory.addNewERC20Implementation(
        "CapxMintableCappedPauseableToken",
        CapxMintableCappedPauseableToken.address,
        false,
        [true,false,true,true]
    );

    await CapxFactory.addNewERC20Implementation(
        "CapxMintBurnCappedPauseableToken",
        CapxMintBurnCappedPauseableToken.address,
        false,
        [true,true,true,true]
    );

    // Reflection Tokens
    await CapxFactory.addNewERC20Implementation(
        "CapxTaxableToken",
        CapxTaxableToken.address,
        true,
        [true,false,false,false]
    );

    // await CapxFactory.addNewERC20Implementation(
    //     "CapxAutoLPTaxableToken",
    //     CapxAutoLPTaxableToken.address,
    //     true,
    //     [true,false,true,false]
    // );

    await CapxFactory.addNewERC20Implementation(
        "CapxDeflationaryToken",
        CapxDeflationaryToken.address,
        true,
        [true,true,false,false]
    );

    // await CapxFactory.addNewERC20Implementation(
    //     "CapxAutoLPDeflationaryToken",
    //     CapxAutoLPDeflationaryToken.address,
    //     true,
    //     [true,true,true,false]
    // );

    // await CapxFactory.addNewERC20Implementation(
    //     "CapxSuperDeflationaryToken",
    //     CapxSuperDeflationaryToken.address,
    //     true,
    //     [true,true,true,true]
    // );
};
