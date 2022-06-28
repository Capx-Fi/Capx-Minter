
const taxableToken = artifacts.require("CapxTaxableToken");
const autoLPTaxableToken = artifacts.require("CapxAutoLPTaxableToken");
const deflationaryToken = artifacts.require("CapxDeflationaryToken");
const autoLPDeflationaryToken = artifacts.require("CapxAutoLPDeflationaryToken");
const superDeflationaryToken = artifacts.require("CapxSuperDeflationaryToken");

const factory = artifacts.require("CapxFactory");

module.exports = async function (deployer) {
    let CapxTaxableToken;
    let CapxAutoLPTaxableToken;
    let CapxDeflationaryToken;
    let CapxAutoLPDeflationaryToken;
    let CapxSuperDeflationaryToken;

    try {
        CapxTaxableToken = await taxableToken.deployed();
    } catch (error) {
        if (error.message == "CapxTaxableToken has not been deployed to detected network (network/artifact mismatch)") {
            await console.log("Deploying CapxTaxableToken Contract");
            CapxTaxableToken = await deployer.deploy(taxableToken);
            await console.log("CapxTaxableToken Address " + CapxTaxableToken.address);
        } else {
            console.error(error);
        };
    }

    try {
        CapxAutoLPTaxableToken = await autoLPTaxableToken.deployed();
    } catch (error) {
        if (error.message == "CapxAutoLPTaxableToken has not been deployed to detected network (network/artifact mismatch)") {
            await console.log("Deploying CapxAutoLPTaxableToken Contract");
            CapxAutoLPTaxableToken = await deployer.deploy(autoLPTaxableToken);
            await console.log("CapxAutoLPTaxableToken Address " + CapxAutoLPTaxableToken.address);
        } else {
            console.error(error);
        };
    }

    try {
        CapxDeflationaryToken = await deflationaryToken.deployed();
    } catch (error) {
        if (error.message == "CapxDeflationaryToken has not been deployed to detected network (network/artifact mismatch)") {
            await console.log("Deploying CapxDeflationaryToken Contract");
            CapxDeflationaryToken = await deployer.deploy(deflationaryToken);
            await console.log("CapxDeflationaryToken Address " + CapxDeflationaryToken.address);
        } else {
            console.error(error);
        };
    }

    try {
        CapxAutoLPDeflationaryToken = await autoLPDeflationaryToken.deployed();
    } catch (error) {
        if (error.message == "CapxAutoLPDeflationaryToken has not been deployed to detected network (network/artifact mismatch)") {
            await console.log("Deploying CapxAutoLPDeflationaryToken Contract");
            CapxAutoLPDeflationaryToken = await deployer.deploy(autoLPDeflationaryToken);
            await console.log("CapxAutoLPDeflationaryToken Address " + CapxAutoLPDeflationaryToken.address);
        } else {
            console.error(error);
        };
    }

    try {
        CapxSuperDeflationaryToken = await superDeflationaryToken.deployed();
    } catch (error) {
        if (error.message == "CapxSuperDeflationaryToken has not been deployed to detected network (network/artifact mismatch)") {
            await console.log("Deploying CapxSuperDeflationaryToken Contract");
            CapxSuperDeflationaryToken = await deployer.deploy(superDeflationaryToken);
            await console.log("CapxSuperDeflationaryToken Address " + CapxSuperDeflationaryToken.address);
        } else {
            console.error(error);
        };
    }

    let CapxFactory = await factory.deployed();
    const result = await CapxFactory.typesOfToken();
    typesOfToken = (result.toNumber());
    console.log("typesOfToken " + typesOfToken);

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

    console.log("typesOfToken " + typesOfToken);
    console.log("DEPLOYMENT COMPLETE");
}