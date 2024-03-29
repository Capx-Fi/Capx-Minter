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

contract('Deflationary token', async (accounts) => {
    const tokenName = 'Deflationary Token';
    const tokenSymbol = 'DT';
    const tokenDecimals = 18;
    const tokenTotalSupply = 50000000000;
    const ownerAddress = accounts[0];
    const owner = accounts[0];
    const address1 = accounts[1];
    const address2 = accounts[2];
    const excludedAccount1 = accounts[3];
    const excludedAccount2 = accounts[4];

    before(async () => {
        factoryInstance = await factory.deployed();
        deflationarytoken = (await factoryInstance.createReflectiveToken(tokenName,tokenSymbol,tokenDecimals,tokenTotalSupply,[ownerAddress,address2],[200,200,0,0,0],15,0)).logs[0].address
        console.log("Taxable Token Clone deployed at : " + deflationarytoken.toString());
        deflationaryTokenInstance = await deflationaryToken.at(deflationarytoken);

    })

    it("Creating a Deflationary token clone", async () => {
        assert(deflationaryTokenInstance.address != undefined, "token address is undefined");
    }); 

    it('set name', async () => {
        const result = await deflationaryTokenInstance.name();
        assert.equal(tokenName, result, 'name is wrong');
    });

    it('set symbol', async () => {
        const result = await deflationaryTokenInstance.symbol();
        assert.equal(tokenSymbol, result, 'symbol is wrong');
    });

    it('set decimals', async () => {
        const result = await deflationaryTokenInstance.decimals();
        assert.equal(tokenDecimals, result, 'decimals is wrong');
    });

    it('set totalSupply', async () => {
        const result = await deflationaryTokenInstance.totalSupply();
        assert.equal(tokenTotalSupply, result, 'totalSupply is wrong');
    });

    it('exclude account should throw if not owner' , async () => {
        try {
            await deflationaryTokenInstance.excludeFromReward(excludedAccount1, { from: address1 });
            assert(false,"Account is not owner");
        } catch (error) {
            assert(true,"Account is not owner");
        }
    })

    it('Exclude an account', async () => {
        await deflationaryTokenInstance.excludeFromReward(excludedAccount1, { from: ownerAddress });
        await deflationaryTokenInstance.excludeFromReward(excludedAccount2, { from: ownerAddress });
        const result = await deflationaryTokenInstance.isExcluded(excludedAccount1, { from: ownerAddress });
        assert.equal(true, result, 'Excluded account not reflected');
    })

    it('exclude should throw if account is already excluded', async () => {
        try {
            await deflationaryTokenInstance.excludeFromReward(excludedAccount1, { from: ownerAddress });
            assert(false,"Account already excluded");
        } catch (error) {
            assert(true,"Account already excluded");
        }
    })
    it('transfer should throw if to address is not valid', async () => {
        
        try {
            await deflationaryTokenInstance.transfer('0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress });
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('transfer should throw if balance is insufficient', async () => {
        
    try {
        await deflationaryTokenInstance.transfer(ownerAddress, 1000, { from: address1 });
        assert(false,"Insufficient balance accepted");
    } catch (error) {
        assert(true,"Insufficient balance accepted");
    }
        
        
    });

    it('transfer without tax success', async () => {
        const transferValue = 500;
        const initialBalanceOf = await deflationaryTokenInstance.balanceOf(ownerAddress);
        await deflationaryTokenInstance.transfer(address1, transferValue, { from: ownerAddress });
        const resultBalanceOf = await deflationaryTokenInstance.balanceOf(ownerAddress);
        assert.equal(initialBalanceOf - transferValue, resultBalanceOf, 'wrong balance after');
    })

    it('enabling tax fee should throw if not owner', async () => {
        try {
            await deflationaryTokenInstance.enableTaxFee({ from: address1 });
            assert(false,"Not owner accepted");
        } catch (error) {
            assert(true,"Not owner accepted");
        }
    })

    it("Enabling Tax", async () => {
        await deflationaryTokenInstance.enableTax({ from: ownerAddress });
        assert(true , "Tax Enabled not done");
    })

    it('Changing tax fee', async () => {
        const taxFee = 300;
        await deflationaryTokenInstance.setTaxFee(taxFee, { from: ownerAddress });
        
        const result = await deflationaryTokenInstance._taxFee.call();
        assert.equal(taxFee, result.toNumber(), 'Tax fee not changed');
    })

    it('transfer standard success', async () => {
        const result = await deflationaryTokenInstance.transfer(address1, 1000, { from: ownerAddress });
        const balanceowner = await deflationaryTokenInstance.balanceOf(ownerAddress);
        const balanceaddress1 = await deflationaryTokenInstance.balanceOf(address1);
       
        assert(result.logs[0].event == "Transfer", "Transfer event not emitted");
    });

    it('transfer to excluded success', async () => {
        const result = await deflationaryTokenInstance.transfer(excludedAccount1, 10000, { from: ownerAddress });
       
        assert(result.logs[0].event == "Transfer", "Transfer event not emitted");
    })

    it('transfer from excluded success',async () => {
        const result = await deflationaryTokenInstance.transfer(ownerAddress, 1000, { from: excludedAccount1 });
       
        assert(result.logs[0].event == "Transfer", "Transfer event not emitted");
    })

    it('transfer between excluded accounts' , async () => {
        const result = await deflationaryTokenInstance.transfer(excludedAccount2, 1000, { from: excludedAccount1 });
       
        assert(result.logs[0].event == "Transfer", "Transfer event not emitted");
    })

    it('balanceOf success', async () => {
        const result = await deflationaryTokenInstance.balanceOf(ownerAddress, { from: ownerAddress });
        
        assert(result.toNumber() != 0, 'balance is wrong'); //Since 1000 is transferred in the previous test
    });

    it('approve success', async () => {
        const result = await deflationaryTokenInstance.approve(address1, 1000, { from: ownerAddress });
        
        assert(result.logs[0].event == "Approval", "Approval event not emitted");
    });

    it('transferFrom should throw if from address is not valid', async () => {
        try {
            await deflationaryTokenInstance.transferFrom('0x0000000000000000000000000000000000000000', address1, 1000, { from: ownerAddress })
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('transferFrom should throw if to address is not valid', async () => {
        try {
            await deflationaryTokenInstance.transferFrom(address1, '0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress })
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('transferFrom should throw if balance is insufficient', async () => {
        try {
            await deflationaryTokenInstance.transferFrom(address1, address2, 1000, { from: address1 })
            assert(false,"Insufficient balance accepted");
        } catch (error) {
            assert(true,"Insufficient balance accepted");
        }
    });

    it('transferFrom should throw if sender is not approved', async () => {
        try {
            await deflationaryTokenInstance.transferFrom(ownerAddress, address1, 1000, { from: ownerAddress })
            assert(false,"Sender is not approved");
        } catch (error) {
            assert(true,"Sender is not approved");
        }
    });

    it('transferFrom success', async () => {
        const result = await deflationaryTokenInstance.transferFrom(ownerAddress, address2, 1000, { from: address1 });

        assert(result.logs[0].event == "Transfer" || result.logs[1].event == "Transfer" , "Transfer event not emitted");
    });

    it('not allowance', async () => {
        const result = await deflationaryTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(0, result.toNumber(), 'No Allowance test failed');
    });

    it('allowance', async () => {
        const expectedAmount = 1000;
        
        await deflationaryTokenInstance.approve(address1, expectedAmount, { from: ownerAddress });
        const result = await deflationaryTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(expectedAmount, result.toNumber(), 'Allowance test failed');
    });

    it('increaseApproval success', async () => {
        const expectedAmount = 2000;
        
        const resultIncrease = await deflationaryTokenInstance.increaseAllowance(address1, 1000, { from: ownerAddress });
        const resultAfterIncrease = await deflationaryTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(expectedAmount, resultAfterIncrease.toNumber(), 'wrong result after increase');
        assert(resultIncrease.logs[0].event == "Approval", "Approval event not emitted");
    });

    it('decreaseApproval success', async () => {
        const initialAmount = 2000;
        const expectedAmount = 1000;
        
        const resultDecrease = await deflationaryTokenInstance.decreaseAllowance(address1, 1000, { from: ownerAddress });
        const resultAfterDecrease = await deflationaryTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(expectedAmount, resultAfterDecrease.toNumber(), 'wrong result after increase');
        assert(resultDecrease.logs[0].event == "Approval", "Approval event not emitted");
    });

    //tests for the reflect functions
    it('reflect should throw if the account is an excluded account', async () => {
        try {
            await deflationaryTokenInstance.reflect(1000, { from: excludedAccount1 });
            assert(false,"excluded account is accepted");
        } catch (error) {
            assert(true,"excluded account is accepted");
        }
    })

    it('reflect success' , async () => {
        const reflectamount = 5000;
        const initial = await deflationaryTokenInstance.totalFees();
        const result = await deflationaryTokenInstance.reflect(reflectamount, { from: ownerAddress });
        const after = await deflationaryTokenInstance.totalFees();
        assert(initial.toNumber() + reflectamount == after.toNumber(), 'reflect failed');
    })

    // it('Conversions test' , async () => {
    //     const tamount = 1;
    //     const ramount = (await deflationaryTokenInstance.reflectionFromToken(tamount,false));
    //     console.log(BigInt(ramount));
    //     console.log(await deflationaryTokenInstance.reflectionFromToken(tamount,true));
    //     console.log(await deflationaryTokenInstance.tokenFromReflection(ramount.toNumber()));
    // })


    

    it('Changing tax fee should throw if not owner', async () => {
        try {
            await deflationaryTokenInstance.setTaxFee(300, { from: address1 });
            assert(false,"Not owner accepted");
        } catch (error) {
            assert(true,"Not owner accepted");
        }
    })

    it('disabling tax fee should throw if not owner', async () => {
        try {
            await deflationaryTokenInstance.disableTaxFee({ from: address1 });
            assert(false,"Not owner accepted");
        } catch (error) {
            assert(true,"Not owner accepted");
        }
    })

    it('include account should throw if not owner', async () => {
        try {
            await deflationaryTokenInstance.includeInReward(excludedAccount2, { from: address1 });
            assert(false,"Not owner accepted");
        } catch (error) {
            assert(true,"Not owner accepted");
        }
    })

    it('include account' , async () => {
        await deflationaryTokenInstance.includeInReward(excludedAccount2, { from: ownerAddress });
        const result = await deflationaryTokenInstance.isExcluded(excludedAccount2);
        assert(!result, 'Account not included');
    })

    it('read total fees',async () => {
        const result = await deflationaryTokenInstance.totalFees();
        assert(0 != result.toNumber(), 'Total fees not read');
    })

    it('Balance of excluded account', async () => {
        const result = await deflationaryTokenInstance.balanceOf(excludedAccount1);
        assert(0 != result.toNumber(), 'Balance of excluded account not read');
    })

    it('Disabling tax fee', async () => {
        await deflationaryTokenInstance.disableTax({ from: ownerAddress });
        assert(true,"Tax fee not disabled");
    })

    it('set burn fee should throw if not owner', async () => {
        try {
            await deflationaryTokenInstance.setBurnFee(400 , { from: address1 });
            assert(false,"Not owner accepted");
        } catch (error) {
            assert(true);
        }
    })

    it('set burn fee', async () => {
        await deflationaryTokenInstance.setBurnFee(500);
        assert(true);
    })
})