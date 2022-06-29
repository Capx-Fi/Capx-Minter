const standardToken = artifacts.require("CapxStandardToken")


const factory = artifacts.require("CapxFactoryV2");

const routerAdd = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {

    let CapxStandardToken = await standardToken.deployed()
    await console.log(CapxStandardToken.address);
    if (!CapxStandardToken.address) {
    await console.log("Deploying CapxStandardToken Contract");
    let CapxStandardToken = await deployer.deploy(standardToken);
    await console.log("CapxStandardToken Address " + CapxStandardToken.address);
    }
    
    // Factory
    let CapxFactory = await deployProxy(factory, [standardToken.address, routerAdd], { kind: 'uups' });
    await console.log("CapxFactory Address " + CapxFactory.address);
};
