
const taxableToken = artifacts.require("CapxTaxableToken");
const autoLPTaxableToken = artifacts.require("CapxAutoLPTaxableToken");
const deflationaryToken = artifacts.require("CapxDeflationaryToken");
const autoLPDeflationaryToken = artifacts.require("CapxAutoLPDeflationaryToken");
const superDeflationaryToken = artifacts.require("CapxSuperDeflationaryToken");

const factory = artifacts.require("CapxFactory");

module.exports = async function (deployer) {
    let CapxTaxableToken = await taxableToken.deployed()
    if (!CapxTaxableToken.address) {
    await console.log("Deploying CapxTaxableToken Contract");
    let CapxTaxableToken = await deployer.deploy(taxableToken);
    await console.log("CapxTaxableToken Address " + CapxTaxableToken.address);
    }

    let CapxAutoLPTaxableToken = await autoLPTaxableToken.deployed()
    if (!CapxAutoLPTaxableToken.address) {
    await console.log("Deploying CapxAutoLPTaxableToken Contract");
    let CapxAutoLPTaxableToken = await deployer.deploy(autoLPTaxableToken);
    await console.log("CapxAutoLPTaxableToken Address " + CapxAutoLPTaxableToken.address);
    }

    let CapxDeflationaryToken = await deflationaryToken.deployed()
    if (!CapxDeflationaryToken.address) {
    await console.log("Deploying CapxDeflationaryToken Contract");
    let CapxDeflationaryToken = await deployer.deploy(deflationaryToken);
    await console.log("CapxDeflationaryToken Address " + CapxDeflationaryToken.address);
    }

    let CapxAutoLPDeflationaryToken = await autoLPDeflationaryToken.deployed()
    if (!CapxAutoLPDeflationaryToken.address) {
    await console.log("Deploying CapxAutoLPDeflationaryToken Contract");
    let CapxAutoLPDeflationaryToken = await deployer.deploy(autoLPDeflationaryToken);
    await console.log("CapxAutoLPDeflationaryToken Address " + CapxAutoLPDeflationaryToken.address);
    }

    let CapxSuperDeflationaryToken = await superDeflationaryToken.deployed()
    if (!CapxSuperDeflationaryToken.address) {
    await console.log("Deploying CapxSuperDeflationaryToken Contract");
    let CapxSuperDeflationaryToken = await deployer.deploy(superDeflationaryToken);
    await console.log("CapxSuperDeflationaryToken Address " + CapxSuperDeflationaryToken.address);
    }

    let CapxFactory = await factory.deployed();
    const result = await CapxFactory.typesOfToken();
    typesOfToken = (result.toNumber());

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

    if (typesOfToken == 13) {
    console.log("Implementing CapxAutoLPTaxableToken Contract");
    await CapxFactory.addNewERC20Implementation(
        "AutoLP Taxable Token",
        CapxAutoLPTaxableToken.address,
        true,
        [true,false,true,false]
    );
    typesOfToken += 1;
    }

    if (typesOfToken == 14) {
    console.log("Implementing CapxDeflationaryToken Contract");
    await CapxFactory.addNewERC20Implementation(
        "Deflationary Token",
        CapxDeflationaryToken.address,
        true,
        [true,true,false,false]
    );
    typesOfToken += 1;
    }

    if (typesOfToken == 15) {
    console.log("Implementing CapxAutoLPDeflationaryToken Contract");
    await CapxFactory.addNewERC20Implementation(
        "AutoLP Deflationary Token",
        CapxAutoLPDeflationaryToken.address,
        true,
        [true,true,true,false]
    );
    typesOfToken += 1;
    }

    if (typesOfToken == 16) {
    console.log("Implementing CapxSuperDeflationaryToken Contract");
    await CapxFactory.addNewERC20Implementation(
        "Super Deflationary Token",
        CapxSuperDeflationaryToken.address,
        true,
        [true,true,true,true]
    );
    typesOfToken += 1;
    }
}