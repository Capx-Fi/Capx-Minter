const mintCappedToken = artifacts.require("CapxMintableCappedToken");
const mintBurnCappedToken = artifacts.require("CapxMintBurnCappedToken");
const mintCappedPauseableToken = artifacts.require("CapxMintableCappedPauseableToken");
const mintBurnCappedPauseableToken = artifacts.require("CapxMintBurnCappedPauseableToken");

const factory = artifacts.require("CapxFactory");
module.exports = async function (deployer) {
    let CapxMintableCappedToken = await mintCappedToken.deployed()
    if (!CapxMintableCappedToken.address) {
    await console.log("Deploying CapxMintableCappedToken Contract");
    let CapxMintableCappedToken = await deployer.deploy(mintCappedToken);
    await console.log("CapxMintableCappedToken Address " + CapxMintableCappedToken.address);
    }

    let CapxMintBurnCappedToken = await mintBurnCappedToken.deployed()
    if (!CapxMintBurnCappedToken.address) {
    await console.log("Deploying CapxMintBurnCappedToken Contract");
    let CapxMintBurnCappedToken = await deployer.deploy(mintBurnCappedToken);
    await console.log("CapxMintBurnCappedToken Address " + CapxMintBurnCappedToken.address);
    }

    let CapxMintableCappedPauseableToken = await mintCappedPauseableToken.deployed()
    if (!CapxMintableCappedPauseableToken.address) {
    await console.log("Deploying CapxMintableCappedPauseableToken Contract");
    let CapxMintableCappedPauseableToken = await deployer.deploy(mintCappedPauseableToken);
    await console.log("CapxMintableCappedPauseableToken Address " + CapxMintableCappedPauseableToken.address);
    }

    let CapxMintBurnCappedPauseableToken = await mintBurnCappedPauseableToken.deployed()
    if (!CapxMintBurnCappedPauseableToken.address) {
    await console.log("Deploying CapxMintBurnCappedPauseableToken Contract");
    let CapxMintBurnCappedPauseableToken = await deployer.deploy(mintBurnCappedPauseableToken);
    await console.log("CapxMintBurnCappedPauseableToken Address " + CapxMintBurnCappedPauseableToken.address);
    }

    let CapxFactory = await factory.deployed();
    const result = await CapxFactory.typesOfToken();
    typesOfToken = (result.toNumber());

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