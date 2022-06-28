
const standardPauseableToken = artifacts.require("CapxStandardPauseableToken");
const burnablePauseableToken = artifacts.require("CapxBurnablePauseableToken");
const mintablePauseableToken = artifacts.require("CapxMintablePauseableToken");
const burnMintPauseableToken = artifacts.require("CapxMintBurnPauseableToken");
const factory = artifacts.require("CapxFactory");
module.exports = async function (deployer) {
    let CapxStandardPauseableToken;
    let CapxBurnablePauseableToken;
    let CapxMintablePauseableToken;
    let CapxMintBurnPauseableToken;

    try {
        CapxStandardPauseableToken = await standardPauseableToken.deployed()
    } catch (error) {
        if (error.message == "CapxStandardPauseableToken has not been deployed to detected network (network/artifact mismatch)") {
            await console.log("Deploying CapxStandardPauseableToken Contract");
            CapxStandardPauseableToken = await deployer.deploy(standardPauseableToken);
            await console.log("CapxStandardPauseableToken Address " + CapxStandardPauseableToken.address);
        } else {
            console.error(error)
        };
    }

    try {
        CapxBurnablePauseableToken = await burnablePauseableToken.deployed()
    } catch (error) {
        if (error.message == "CapxBurnablePauseableToken has not been deployed to detected network (network/artifact mismatch)") {
            await console.log("Deploying CapxBurnablePauseableToken Contract");
            CapxBurnablePauseableToken = await deployer.deploy(burnablePauseableToken);
            await console.log("CapxBurnablePauseableToken Address " + CapxBurnablePauseableToken.address);
        } else {
            console.error(error)
        };
    }

    try {
        CapxMintablePauseableToken = await mintablePauseableToken.deployed()
    } catch (error) {
        if (error.message == "CapxMintablePauseableToken has not been deployed to detected network (network/artifact mismatch)") {
            await console.log("Deploying CapxMintablePauseableToken Contract");
            CapxMintablePauseableToken = await deployer.deploy(mintablePauseableToken);
            await console.log("CapxMintablePauseableToken Address " + CapxMintablePauseableToken.address);
        } else {
            console.error(error)
        };
    }

    try {
        CapxMintBurnPauseableToken = await burnMintPauseableToken.deployed()
    } catch (error) {
        if (error.message == "CapxMintBurnPauseableToken has not been deployed to detected network (network/artifact mismatch)") {
            await console.log("Deploying CapxMintBurnPauseableToken Contract");
            CapxMintBurnPauseableToken = await deployer.deploy(burnMintPauseableToken);
            await console.log("CapxMintBurnPauseableToken Address " + CapxMintBurnPauseableToken.address);
        } else {
            console.error(error)
        };
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