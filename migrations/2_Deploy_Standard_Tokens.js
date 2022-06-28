const burnableToken = artifacts.require("CapxBurnableToken");
const mintableToken = artifacts.require("CapxMintableToken");
const burnMintToken = artifacts.require("CapxMintBurnToken");
const factory = artifacts.require("CapxFactory");

module.exports = async function (deployer) {
    let CapxBurnableToken;
    let CapxMintableToken;
    let CapxMintBurnToken;

    try {
        CapxBurnableToken =await burnableToken.deployed()
    } catch (error) {
        if (error.message == "CapxBurnableToken has not been deployed to detected network (network/artifact mismatch)") {
            await console.log("Deploying CapxBurnableToken Contract");
            CapxBurnableToken = await deployer.deploy(burnableToken);
            await console.log("CapxBurnableToken Address " + CapxBurnableToken.address);
        } else {
            console.error(error)
        };
    }

    try {
        CapxMintableToken = await mintableToken.deployed()
    } catch (error) {
        if (error.message == "CapxMintableToken has not been deployed to detected network (network/artifact mismatch)") {
            await console.log("Deploying CapxMintableToken Contract");
            CapxMintableToken = await deployer.deploy(mintableToken);
            await console.log("CapxMintableToken Address " + CapxMintableToken.address);
        } else {
            console.error(error)
        };
    }

    try {
        CapxMintBurnToken = await burnMintToken.deployed()
    } catch (error) {
        if (error.message == "CapxMintBurnToken has not been deployed to detected network (network/artifact mismatch)") {
            await console.log("Deploying CapxMintBurnToken Contract");
            CapxMintBurnToken = await deployer.deploy(burnMintToken);
            await console.log("CapxMintBurnToken Address " + CapxMintBurnToken.address);
        } else {
            console.error(error)
        };
    }

    let CapxFactory =await factory.deployed();
    const result = await CapxFactory.typesOfToken();
    typesOfToken = (result.toNumber());
    console.log("typesOfToken " + typesOfToken);
    
    if (typesOfToken == 1) {
    console.log("Implementing CapxBurnableToken Contract");
    await CapxFactory.addNewERC20Implementation(
        "Mintable Token",
        CapxMintableToken.address,
        false,
        [true,false,false,false]
    );
    typesOfToken += 1;
    }

    if (typesOfToken == 2) {
    console.log("Implementing CapxMintableToken Contract");
    await CapxFactory.addNewERC20Implementation(
        "Burnable Token",
        CapxBurnableToken.address,
        false,
        [false,true,false,false]
    );
    typesOfToken += 1;
    }

    if (typesOfToken == 3) {
    console.log("Implementing CapxMintBurnToken Contract");
    await CapxFactory.addNewERC20Implementation(
        "Mintable & Burnable Token",
        CapxMintBurnToken.address,
        false,
        [true,true,false,false]
    );
    typesOfToken += 1;
    }
}