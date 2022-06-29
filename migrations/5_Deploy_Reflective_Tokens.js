
const taxableToken = artifacts.require("CapxTaxableToken");
const deflationaryToken = artifacts.require("CapxDeflationaryToken");

const factory = artifacts.require("CapxFactoryV2");

module.exports = async function (deployer) {

    let CapxFactory =await factory.deployed();
    await console.log("CapxFactory Address",CapxFactory.address);
    const result = await CapxFactory.typesOfToken();
    typesOfToken = (result.toNumber());
    console.log("typesOfToken " + typesOfToken);


    let CapxTaxableToken = await taxableToken.deployed()
    if (!CapxTaxableToken.address) {
        await console.log("Deploying CapxTaxableToken Contract");
        let CapxTaxableToken = await deployer.deploy(taxableToken);
        await console.log("CapxTaxableToken Address " + CapxTaxableToken.address);
    }

    if (typesOfToken == 12) {
        console.log("Implementing CapxTaxableToken Contract");
        await CapxFactory.addNewERC20Implementation(
            "Taxable Token",
            CapxTaxableToken.address,
            true,
            [true,false,false,false]
        );
        typesOfToken += 1;
    }

    let CapxDeflationaryToken = await deflationaryToken.deployed()
    if (!CapxDeflationaryToken.address) {
        await console.log("Deploying CapxDeflationaryToken Contract");
        let CapxDeflationaryToken = await deployer.deploy(deflationaryToken);
        await console.log("CapxDeflationaryToken Address " + CapxDeflationaryToken.address);
    }

    if (typesOfToken == 13) {
        console.log("Implementing CapxDeflationaryToken Contract");
        await CapxFactory.addNewERC20Implementation(
            "Deflationary Token",
            CapxDeflationaryToken.address,
            true,
            [true,true,false,false]
        );
        typesOfToken += 1;
    }

}