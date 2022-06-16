const standardToken = artifacts.require("CapxStandardToken")
const burnableToken = artifacts.require("CapxBurnableToken");
const mintableToken = artifacts.require("CapxMintableToken");
const burnMintToken = artifacts.require("CapxMintBurnToken");

const standardPauseableToken = artifacts.require("CapxStandardPauseableToken");
const burnablePauseableToken = artifacts.require("CapxBurnablePauseableToken");
const mintablePauseableToken = artifacts.require("CapxMintablePauseableToken");
const burnMintPauseableToken = artifacts.require("CapxMintBurnPauseableToken");

const mintCappedToken = artifacts.require("CapxMintableCappedToken");
const mintBurnCappedToken = artifacts.require("CapxMintBurnCappedToken");
const mintCappedPauseableToken = artifacts.require("CapxMintableCappedPauseableToken");
const mintBurnCappedPauseableToken = artifacts.require("CapxMintBurnCappedPauseableToken");

const taxableToken = artifacts.require("CapxTaxableToken");
const autoLPTaxableToken = artifacts.require("CapxAutoLPTaxableToken");
const deflationaryToken = artifacts.require("CapxDeflationaryToken");
const autoLPDeflationaryToken = artifacts.require("CapxAutoLPDeflationaryToken");
const superDeflationaryToken = artifacts.require("CapxSuperDeflationaryToken");

const factory = artifacts.require("CapxFactory");

contract("Burnable Pausable Token", async (accounts) => {
    const tokenName = 'Burnable Pausable Token';
    const tokenSymbol = 'BPT';
    const tokenDecimals = 18;
    const tokenTotalSupply = 50000000000;
    const ownerAddress = accounts[0];
    const owner = accounts[0];
    const address1 = accounts[1];
    const address2 = accounts[2];

    before(async () => {
        factoryInstance = await factory.deployed();
        let burnablepausabletoken = ((await factoryInstance.createToken(tokenName, tokenSymbol,ownerAddress, tokenDecimals,tokenTotalSupply ,tokenTotalSupply, 7,0)).logs[0].address); 
        console.log("Burnable Pausable Token Clone deployed at : " + burnablepausabletoken.toString());
        burnablePauseableTokenInstance = await burnablePauseableToken.at(burnablepausabletoken);
    })
    it("Creating a Burnable Pausable token clone", async () => {
        assert(burnablePauseableTokenInstance.address != undefined, "token address is undefined");
    }); 

    it('set name', async () => {
        const result = await burnablePauseableTokenInstance.name();
        assert.equal(tokenName, result, 'name is wrong');
    });

    it('set symbol', async () => {
        const result = await burnablePauseableTokenInstance.symbol();
        assert.equal(tokenSymbol, result, 'symbol is wrong');
    });

    it('set decimals', async () => {
        const result = await burnablePauseableTokenInstance.decimals();
        assert.equal(tokenDecimals, result, 'decimals is wrong');
    });

    it('set totalSupply', async () => {
        const result = await burnablePauseableTokenInstance.totalSupply();
        assert.equal(tokenTotalSupply, result, 'totalSupply is wrong');
    });

    it('transfer should throw if contract is paused', async () => {
        await burnablePauseableTokenInstance.pause({ from: ownerAddress });
        
        try {
            await burnablePauseableTokenInstance.transfer(address1, 1000, { from: ownerAddress });
            assert(false,"Transfer accepted");
        } catch (error) {
            assert(true,"Transfer succeded while contract was paused");
        }

        await burnablePauseableTokenInstance.unpause({ from: ownerAddress });
    });

    it('transfer should throw if to address is not valid', async () => {
        
        try {
            await burnablePauseableTokenInstance.transfer('0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress });
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('transfer should throw if balance is insufficient', async () => {
        
    try {
        await burnablePauseableTokenInstance.transfer(ownerAddress, 1000, { from: address1 });
        assert(false,"Insufficient balance accepted");
    } catch (error) {
        assert(true,"Insufficient balance accepted");
    }
        
        
    });

    it('transfer success', async () => {
        const result = await burnablePauseableTokenInstance.transfer(address1, 1000, { from: ownerAddress });
       
        assert(result.logs[0].event == "Transfer", "Transfer event not emitted");
    });

    it('balanceOf success', async () => {
        const result = await burnablePauseableTokenInstance.balanceOf(ownerAddress, { from: ownerAddress });
        
        assert.equal(result.toNumber(), tokenTotalSupply-1000, 'balance is wrong'); //Since 1000 is transferred in the previous test
    });

    it('approve success', async () => {
        const result = await burnablePauseableTokenInstance.approve(address1, 1000, { from: ownerAddress });
        
        assert(result.logs[0].event == "Approval", "Approval event not emitted");
    });

    it('transferFrom should throw if contract is paused', async () => {
        await burnablePauseableTokenInstance.pause({ from: ownerAddress });
        
        try {
            await burnablePauseableTokenInstance.transferFrom(ownerAddress, address2, 1000, { from: address1 });
            assert(false,"transferFrom accepted");
        } catch (error) {
            assert(true,"transferFrom succeded while contract was paused");
        }

        await burnablePauseableTokenInstance.unpause({ from: ownerAddress });
    });

    it('transferFrom should throw if from address is not valid', async () => {
        try {
            await burnablePauseableTokenInstance.transferFrom('0x0000000000000000000000000000000000000000', address1, 1000, { from: ownerAddress })
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('transferFrom should throw if to address is not valid', async () => {
        try {
            await burnablePauseableTokenInstance.transferFrom(address1, '0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress })
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('transferFrom should throw if balance is insufficient', async () => {
        try {
            await burnablePauseableTokenInstance.transferFrom(address1, address2, 1000, { from: address1 })
            assert(false,"Insufficient balance accepted");
        } catch (error) {
            assert(true,"Insufficient balance accepted");
        }
    });

    it('transferFrom should throw if sender is not approved', async () => {
        try {
            await burnablePauseableTokenInstance.transferFrom(ownerAddress, address1, 1000, { from: ownerAddress })
            assert(false,"Sender is not approved");
        } catch (error) {
            assert(true,"Sender is not approved");
        }
    });

    it('transferFrom success', async () => {
        const result = await burnablePauseableTokenInstance.transferFrom(ownerAddress, address2, 1000, { from: address1 });
        assert(result.logs[1].event == "Transfer", "Transfer event not emitted");
    });

    it('not allowance', async () => {
        const result = await burnablePauseableTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(0, result.toNumber(), 'No Allowance test failed');
    });

    it('allowance', async () => {
        const expectedAmount = 1000;
        
        await burnablePauseableTokenInstance.approve(address1, expectedAmount, { from: ownerAddress });
        const result = await burnablePauseableTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(expectedAmount, result.toNumber(), 'Allowance test failed');
    });

    it('increaseApproval success', async () => {
        const expectedAmount = 2000;
        
        const resultIncrease = await burnablePauseableTokenInstance.increaseAllowance(address1, 1000, { from: ownerAddress });
        const resultAfterIncrease = await burnablePauseableTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(expectedAmount, resultAfterIncrease.toNumber(), 'wrong result after increase');
        assert(resultIncrease.logs[0].event == "Approval", "Approval event not emitted");
    });

    it('decreaseApproval success', async () => {
        const initialAmount = 2000;
        const expectedAmount = 1000;
        
        const resultDecrease = await burnablePauseableTokenInstance.decreaseAllowance(address1, 1000, { from: ownerAddress });
        const resultAfterDecrease = await burnablePauseableTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(expectedAmount, resultAfterDecrease.toNumber(), 'wrong result after increase');
        assert(resultDecrease.logs[0].event == "Approval", "Approval event not emitted");
    });

    it('burn should throw if from address is invalid', async () => {
        try {
            await burnablePauseableTokenInstance.burn('0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress })
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('burn should throw if balance is insufficient', async () => {
        try {
            await burnablePauseableTokenInstance.burn(1000, { from: accounts[3] })
            assert(false,"Insufficient balance accepted");
        } catch (error) {
            assert(true,"Insufficient balance accepted");
        }
    });

    it('burn success', async () => {
        const burnValue = 500;
        const initialBalanceOf = await burnablePauseableTokenInstance.balanceOf(ownerAddress);
        await burnablePauseableTokenInstance.burn( burnValue, { from: ownerAddress });
        const expectedTotalSupply = (tokenTotalSupply) - burnValue;
        const resultAfterBurn = await burnablePauseableTokenInstance.totalSupply();
        const resultBalanceOf = await burnablePauseableTokenInstance.balanceOf(ownerAddress);

        assert.equal(expectedTotalSupply, resultAfterBurn, 'wrong totalSupply after');
        assert.equal(initialBalanceOf - burnValue, resultBalanceOf, 'wrong balance after');
    });


})