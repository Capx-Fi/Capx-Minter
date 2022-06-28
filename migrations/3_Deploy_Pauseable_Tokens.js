
const standardPauseableToken = artifacts.require("CapxStandardPauseableToken");
const burnablePauseableToken = artifacts.require("CapxBurnablePauseableToken");
const mintablePauseableToken = artifacts.require("CapxMintablePauseableToken");
const burnMintPauseableToken = artifacts.require("CapxMintBurnPauseableToken");
const factory = artifacts.require("CapxFactory");
module.exports = async function (deployer) {
    let CapxStandardPauseableToken = await standardPauseableToken.deployed()
    if (!CapxStandardPauseableToken.address) {
        await console.log("Deploying CapxStandardPauseableToken Contract");
        let CapxStandardPauseableToken = await deployer.deploy(standardPauseableToken);
        await console.log("CapxStandardPauseableToken Address " + CapxStandardPauseableToken.address);
    }

    let CapxBurnablePauseableToken = await burnablePauseableToken.deployed()
    if (!CapxBurnablePauseableToken.address) {
    await console.log("Deploying CapxBurnablePauseableToken Contract");
    let CapxBurnablePauseableToken = await deployer.deploy(burnablePauseableToken);
    await console.log("CapxBurnablePauseableToken Address " + CapxBurnablePauseableToken.address);
    }

    let CapxMintablePauseableToken = await mintablePauseableToken.deployed()
    if (!CapxMintablePauseableToken.address) {
    await console.log("Deploying CapxMintablePauseableToken Contract");
    let CapxMintablePauseableToken = await deployer.deploy(mintablePauseableToken);
    await console.log("CapxMintablePauseableToken Address " + CapxMintablePauseableToken.address);
    }

    let CapxMintBurnPauseableToken = await burnMintPauseableToken.deployed()
    if (!CapxMintBurnPauseableToken.address) {
    await console.log("Deploying CapxMintBurnPauseableToken Contract");
    let CapxMintBurnPauseableToken = await deployer.deploy(burnMintPauseableToken);
    await console.log("CapxMintBurnPauseableToken Address " + CapxMintBurnPauseableToken.address);
    }

    let CapxFactory =  await factory.deployed()
    const result = await CapxFactory.typesOfToken();
    typesOfToken = (result.toNumber());

    console.log("typesOfToken " + typesOfToken);

    if (typesOfToken == 4) {
    console.log("Implementing CapxStandardPauseableToken Contract");
    await CapxFactory.addNewERC20Implementation(
        "Standard Pauseable Token",
        CapxStandardPauseableToken.address,
        false,
        [false,false,true,false]
    );
    typesOfToken += 1;
    }

    if (typesOfToken == 5) {
    console.log("Implementing CapxBurnablePauseableToken Contract");
    await CapxFactory.addNewERC20Implementation(
        "Mintable Pauseable Token",
        CapxMintablePauseableToken.address,
        false,
        [true,false,true,false]
    );
    typesOfToken += 1;
    }

    if (typesOfToken == 6) {
    console.log("Implementing CapxMintablePauseableToken Contract");
    await CapxFactory.addNewERC20Implementation(
        "Burnable Pauseable Token",
        CapxBurnablePauseableToken.address,
        false,
        [false,true,true,false]
    );
    typesOfToken += 1;
    }

    if (typesOfToken == 7) {
    console.log("Implementing CapxMintBurnPauseableToken Contract");
    await CapxFactory.addNewERC20Implementation(
        "Mintable Burnable & Pauseable Token",
        CapxMintBurnPauseableToken.address,
        false,
        [true,true,true,false]
    );
    typesOfToken += 1;
    }

    
}