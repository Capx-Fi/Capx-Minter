const mintCappedToken = artifacts.require("CapxMintableCappedToken");
const mintBurnCappedToken = artifacts.require("CapxMintBurnCappedToken");
const mintCappedPauseableToken = artifacts.require("CapxMintableCappedPauseableToken");
const mintBurnCappedPauseableToken = artifacts.require("CapxMintBurnCappedPauseableToken");

const factory = artifacts.require("CapxFactory");
module.exports = async function (deployer) {
    let CapxMintableCappedToken;
    let CapxMintBurnCappedToken;
    let CapxMintableCappedPauseableToken;
    let CapxMintBurnCappedPauseableToken;

    try {
        CapxMintableCappedToken = await mintCappedToken.deployed()
    } catch (error) {
        if (error.message == "CapxMintableCappedToken has not been deployed to detected network (network/artifact mismatch)") {
            await console.log("Deploying CapxMintableCappedToken Contract");
            CapxMintableCappedToken = await deployer.deploy(mintCappedToken);
            await console.log("CapxMintableCappedToken Address " + CapxMintableCappedToken.address);
        } else {
            console.error(error)
        };
    }
    
    try {
        CapxMintBurnCappedToken = await mintBurnCappedToken.deployed()
    } catch (error) {
        if (error.message == "CapxMintBurnCappedToken has not been deployed to detected network (network/artifact mismatch)") {
            await console.log("Deploying CapxMintBurnCappedToken Contract");
            CapxMintBurnCappedToken = await deployer.deploy(mintBurnCappedToken);
            await console.log("CapxMintBurnCappedToken Address " + CapxMintBurnCappedToken.address);
        } else {
            console.error(error)
        };
    }

    try {
        CapxMintableCappedPauseableToken = await mintCappedPauseableToken.deployed()
    } catch (error) {
        if (error.message == "CapxMintableCappedPauseableToken has not been deployed to detected network (network/artifact mismatch)") {
            await console.log("Deploying CapxMintableCappedPauseableToken Contract");
            CapxMintableCappedPauseableToken = await deployer.deploy(mintCappedPauseableToken);
            await console.log("CapxMintableCappedPauseableToken Address " + CapxMintableCappedPauseableToken.address);
        } else {
            console.error(error)
        };
    }

    try {
        CapxMintBurnCappedPauseableToken = await mintBurnCappedPauseableToken.deployed()
    } catch (error) {
        if (error.message == "CapxMintBurnCappedPauseableToken has not been deployed to detected network (network/artifact mismatch)") {
            await console.log("Deploying CapxMintBurnCappedPauseableToken Contract");
            CapxMintBurnCappedPauseableToken = await deployer.deploy(mintBurnCappedPauseableToken);
            await console.log("CapxMintBurnCappedPauseableToken Address " + CapxMintBurnCappedPauseableToken.address);
        } else {
            console.error(error)
        };
    }

    let CapxFactory = await factory.deployed();
    const result = await CapxFactory.typesOfToken();
    typesOfToken = (result.toNumber());
    console.log("typesOfToken " + typesOfToken);

    if (typesOfToken == 8) {
    console.log("Implementing CapxMintableCappedToken Contract");
    await CapxFactory.addNewERC20Implementation(
        "Mintable Capped Token",
        CapxMintableCappedToken.address,
        false,
        [true,false,false,true]
    );
    typesOfToken += 1;
    }

    if (typesOfToken == 9) {
    console.log("Implementing CapxMintBurnCappedToken Contract");
    await CapxFactory.addNewERC20Implementation(
        "Mintable Burnable & Capped Token",
        CapxMintBurnCappedToken.address,
        false,
        [true,true,false,true]
    );
    typesOfToken += 1;
    }

    if (typesOfToken == 10) {
    console.log("Implementing CapxMintableCappedPauseableToken Contract");
    await CapxFactory.addNewERC20Implementation(
        "Mintable Capped & Pauseable Token",
        CapxMintableCappedPauseableToken.address,
        false,
        [true,false,true,true]
    );
    typesOfToken += 1;
    }

    if (typesOfToken == 11) {
    console.log("Implementing CapxMintBurnCappedPauseableToken Contract");
    await CapxFactory.addNewERC20Implementation(
        "Mintable Burnable Capped & Pauseable Token",
        CapxMintBurnCappedPauseableToken.address,
        false,
        [true,true,true,true]
    );
    typesOfToken += 1;
    }
}