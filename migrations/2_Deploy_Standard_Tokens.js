const burnableToken = artifacts.require("CapxBurnableToken");
const mintableToken = artifacts.require("CapxMintableToken");
const burnMintToken = artifacts.require("CapxMintBurnToken");
const factory = artifacts.require("CapxFactoryV2");

module.exports = async function (deployer) {

    let CapxFactory =await factory.deployed();
    await console.log("CapxFactory Address",CapxFactory.address);
    const result = await CapxFactory.typesOfToken();
    typesOfToken = (result.toNumber());
    console.log("typesOfToken " + typesOfToken);

    let CapxMintableToken = await mintableToken.deployed()
    if (!CapxMintableToken.address) {
        await console.log("Deploying CapxMintableToken Contract");
        let CapxMintableToken = await deployer.deploy(mintableToken);
        await console.log("CapxMintableToken Address " + CapxMintableToken.address);   
    }

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
    
    let CapxBurnableToken = await burnableToken.deployed()
    if (!CapxBurnableToken.address) {
        await console.log("Deploying CapxBurnableToken Contract");
        let CapxBurnableToken = await deployer.deploy(burnableToken);
        await console.log("CapxBurnableToken Address " + CapxBurnableToken.address);
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
    

    let CapxMintBurnToken = await burnMintToken.deployed()
    if (!CapxMintBurnToken.address) {
        await console.log("Deploying CapxMintBurnToken Contract");
        let CapxMintBurnToken = await deployer.deploy(burnMintToken);
        await console.log("CapxMintBurnToken Address " + CapxMintBurnToken.address);
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