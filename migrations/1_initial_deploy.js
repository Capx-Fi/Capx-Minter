const standardToken = artifacts.require("CapxStandardToken")


const factory = artifacts.require("CapxFactory");

const routerAdd = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
    let CapxStandardToken;
    try {
        CapxStandardToken = await standardToken.deployed()    
    } catch (error) {
        if (error.message == "CapxStandardToken has not been deployed to detected network (network/artifact mismatch)") {
            await console.log("Deploying CapxStandardToken Contract");
            CapxStandardToken = await deployer.deploy(standardToken);
            await console.log("CapxStandardToken Address " + CapxStandardToken.address);
        } else {
            console.error(error)
        };
    }
    
    // Factory
    let CapxFactory = await deployProxy(factory, [standardToken.address, routerAdd], { kind: 'uups' });
    await console.log("CapxFactory Address " + CapxFactory.address);
};
