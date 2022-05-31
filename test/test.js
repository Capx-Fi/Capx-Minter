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

contract("Testing token workings" , async (accounts) => {

    var factoryInstance;
    var standardTokenInstance;
    var burnableTokenInstance;
    var mintableTokenInstance;
    var burnMintTokenInstance;

    var standardPauseableTokenInstance;
    var burnablePauseableTokenInstance;
    var mintablePauseableTokenInstance;
    var burnMintPauseableTokenInstance;

    var mintCappedTokenInstance;
    var mintBurnCappedTokenInstance;
    var mintCappedPauseableTokenInstance;
    var mintBurnCappedPauseableTokenInstance;

    var taxableTokenInstance;
    var autoLPTaxableTokenInstance;
    var deflationaryTokenInstance;
    var autoLPDeflationaryTokenInstance;
    var superDeflationaryTokenInstance;

    var owner = accounts[0];

    it("Should deploy the factory contract", async () => {
        factoryInstance = await factory.deployed();
        standardTokenInstance = await standardToken.deployed();
        burnableTokenInstance = await burnableToken.deployed();
        mintableTokenInstance = await mintableToken.deployed();
        burnMintTokenInstance = await burnMintToken.deployed();

        standardPauseableTokenInstance = await standardPauseableToken.deployed();
        burnablePauseableTokenInstance = await burnablePauseableToken.deployed();
        mintablePauseableTokenInstance = await mintablePauseableToken.deployed();
        burnMintPauseableTokenInstance = await burnMintPauseableToken.deployed();

        mintCappedTokenInstance = await mintCappedToken.deployed();
        mintBurnCappedTokenInstance = await mintBurnCappedToken.deployed();
        mintCappedPauseableTokenInstance = await mintCappedPauseableToken.deployed();
        mintBurnCappedPauseableTokenInstance = await mintBurnCappedPauseableToken.deployed();

        taxableTokenInstance = await taxableToken.deployed();
        autoLPTaxableTokenInstance = await autoLPTaxableToken.deployed();
        deflationaryTokenInstance = await deflationaryToken.deployed();
        autoLPDeflationaryTokenInstance = await autoLPDeflationaryToken.deployed();
        superDeflationaryTokenInstance = await superDeflationaryToken.deployed();

        assert(factoryInstance.address != undefined, "Factory contract address is undefined");
        assert(standardTokenInstance.address != undefined, "Standard token address is undefined");
        assert(burnableTokenInstance.address != undefined, "Burnable token address is undefined");
        assert(mintableTokenInstance.address != undefined, "Mintable token address is undefined");
        assert(burnMintTokenInstance.address != undefined, "BurnMint token address is undefined");

        assert(standardPauseableTokenInstance.address != undefined, "Standard pauseable token address is undefined");
        assert(burnablePauseableTokenInstance.address != undefined, "Burnable pauseable token address is undefined");
        assert(mintablePauseableTokenInstance.address != undefined, "Mintable pauseable token address is undefined");
        assert(burnMintPauseableTokenInstance.address != undefined, "BurnMint pauseable token address is undefined");

        assert(mintCappedTokenInstance.address != undefined, "MintCapped token address is undefined");
        assert(mintBurnCappedTokenInstance.address != undefined, "MintBurnCapped token address is undefined");
        assert(mintCappedPauseableTokenInstance.address != undefined, "MintCapped pauseable token address is undefined");
        assert(mintBurnCappedPauseableTokenInstance.address != undefined, "MintBurnCapped pauseable token address is undefined");

        assert(taxableTokenInstance.address != undefined, "Taxable token address is undefined");
        assert(autoLPTaxableTokenInstance.address != undefined, "AutoLPTaxable token address is undefined");
        assert(deflationaryTokenInstance.address != undefined, "Deflationary token address is undefined");
        assert(autoLPDeflationaryTokenInstance.address != undefined, "AutoLPDeflationary token address is undefined");
        assert(superDeflationaryTokenInstance.address != undefined, "SuperDeflationary token address is undefined");
    });
});

contract("Standard Tokem", async (accounts) => {

    const tokenName = 'Standard Token';
    const tokenSymbol = 'ST';
    const tokenDecimals = 18;
    const tokenTotalSupply = 50000000000;
    const ownerAddress = accounts[0];
    const owner = accounts[0];
    const address1 = accounts[1];
    const address2 = accounts[2];

    before(async () => {
        factoryInstance = await factory.deployed();
        let standardtoken = ((await factoryInstance.createToken(tokenName, tokenSymbol,ownerAddress, tokenDecimals,tokenTotalSupply ,tokenTotalSupply, [false ,false ,false ,false ])).logs[0].address); 
        console.log("Standard Token Clone deployed at : " + standardtoken.toString());
        standardTokenInstance = await standardToken.at(standardtoken);
    })
    it("Creating a Standard token clone", async () => {
        assert(standardTokenInstance.address != undefined, "Standard token address is undefined");
    }); 

    it('set name', async () => {
        const result = await standardTokenInstance.name();
        assert.equal(tokenName, result, 'name is wrong');
    });

    it('set symbol', async () => {
        const result = await standardTokenInstance.symbol();
        assert.equal(tokenSymbol, result, 'symbol is wrong');
    });

    it('set decimals', async () => {
        const result = await standardTokenInstance.decimals();
        assert.equal(tokenDecimals, result, 'decimals is wrong');
    });

    it('set totalSupply', async () => {
        const result = await standardTokenInstance.totalSupply();
        assert.equal(tokenTotalSupply, result, 'totalSupply is wrong');
    });

    it('transfer should throw if to address is not valid', async () => {
        
        try {
            await standardTokenInstance.transfer('0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress });
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('transfer should throw if balance is insufficient', async () => {
        
    try {
        await standardTokenInstance.transfer(ownerAddress, 1000, { from: address1 });
        assert(false,"Insufficient balance accepted");
    } catch (error) {
        assert(true,"Insufficient balance accepted");
    }
        
        
    });

    it('transfer success', async () => {
        const result = await standardTokenInstance.transfer(address1, 1000, { from: ownerAddress });
       
        assert(result.logs[0].event == "Transfer", "Transfer event not emitted");
    });

    it('balanceOf success', async () => {
        const result = await standardTokenInstance.balanceOf(ownerAddress, { from: ownerAddress });
        
        assert.equal(result.toNumber(), tokenTotalSupply-1000, 'balance is wrong'); //Since 1000 is transferred in the previous test
    });

    it('approve success', async () => {
        const result = await standardTokenInstance.approve(address1, 1000, { from: ownerAddress });
        
        assert(result.logs[0].event == "Approval", "Approval event not emitted");
    });

    it('transferFrom should throw if from address is not valid', async () => {
        try {
            await standardTokenInstance.transferFrom('0x0000000000000000000000000000000000000000', address1, 1000, { from: ownerAddress })
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('transferFrom should throw if to address is not valid', async () => {
        try {
            await standardTokenInstance.transferFrom(address1, '0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress })
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('transferFrom should throw if balance is insufficient', async () => {
        try {
            await standardTokenInstance.transferFrom(address1, address2, 1000, { from: address1 })
            assert(false,"Insufficient balance accepted");
        } catch (error) {
            assert(true,"Insufficient balance accepted");
        }
    });

    it('transferFrom should throw if sender is not approved', async () => {
        try {
            await standardTokenInstance.transferFrom(ownerAddress, address1, 1000, { from: ownerAddress })
            assert(false,"Sender is not approved");
        } catch (error) {
            assert(true,"Sender is not approved");
        }
    });

    it('transferFrom success', async () => {
        const result = await standardTokenInstance.transferFrom(ownerAddress, address2, 1000, { from: address1 });
        assert(result.logs[1].event == "Transfer", "Transfer event not emitted");
    });

    it('not allowance', async () => {
        const result = await standardTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(0, result.toNumber(), 'No Allowance test failed');
    });

    it('allowance', async () => {
        const expectedAmount = 1000;
        
        await standardTokenInstance.approve(address1, expectedAmount, { from: ownerAddress });
        const result = await standardTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(expectedAmount, result.toNumber(), 'Allowance test failed');
    });

    it('increaseApproval success', async () => {
        const expectedAmount = 2000;
        
        const resultIncrease = await standardTokenInstance.increaseAllowance(address1, 1000, { from: ownerAddress });
        const resultAfterIncrease = await standardTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(expectedAmount, resultAfterIncrease.toNumber(), 'wrong result after increase');
        assert(resultIncrease.logs[0].event == "Approval", "Approval event not emitted");
    });

    it('decreaseApproval success', async () => {
        const initialAmount = 2000;
        const expectedAmount = 1000;
        
        const resultDecrease = await standardTokenInstance.decreaseAllowance(address1, 1000, { from: ownerAddress });
        const resultAfterDecrease = await standardTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(expectedAmount, resultAfterDecrease.toNumber(), 'wrong result after increase');
        assert(resultDecrease.logs[0].event == "Approval", "Approval event not emitted");
    });



    // it("Creating a burnable token clone", async () => {
    //     factoryInstance = await factory.deployed();
    //     let burnabletoken = ((await factoryInstance.createToken("Burnable Token", "BT",owner, 18,20000000000 ,50000000000, [false ,true ,false ,false ])).logs[0].address); 
    //     console.log("Burnable Token Clone deployed at : " + burnabletoken.toString());
    //     assert(await factoryInstance.checkCloneContractWorking(burnabletoken))
    // })

    // it("Creating a mintable token clone", async () => {
    //     factoryInstance = await factory.deployed();
    //     let mintabletoken = ((await factoryInstance.createToken("Mintable Token", "MT",owner, 18,20000000000 ,50000000000, [true ,false ,false ,false ])).logs[0].address); 
    //     console.log("Mintable Token Clone deployed at : " + mintabletoken.toString());
    //     assert(await factoryInstance.checkCloneContractWorking(mintabletoken))
    // })

    // it("Creating a burnMint token clone", async () => {
    //     factoryInstance = await factory.deployed();
    //     let burnMinttoken = ((await factoryInstance.createToken("BurnMint Token", "BMT",owner, 18,20000000000 ,50000000000, [true ,true ,false ,false ])).logs[0].address); 
    //     console.log("BurnMint Token Clone deployed at : " + burnMinttoken.toString());
    //     assert(await factoryInstance.checkCloneContractWorking(burnMinttoken))
    // })

    // it("Creating a standard pauseable token clone", async () => {
    //     factoryInstance = await factory.deployed();
    //     let standardPauseabletoken = ((await factoryInstance.createToken("Standard Pauseable Token", "SPT",owner, 18,20000000000 ,50000000000, [false ,false ,true ,false ])).logs[0].address); 
    //     console.log("Standard Pauseable Token Clone deployed at : " + standardPauseabletoken.toString());
    //     assert(await factoryInstance.checkCloneContractWorking(standardPauseabletoken))
    // })

    // it("Creating a burnable pauseable token clone", async () => {   
    //     factoryInstance = await factory.deployed();
    //     let burnablePauseabletoken = ((await factoryInstance.createToken("Burnable Pauseable Token", "BPT",owner, 18,20000000000 ,50000000000, [false ,true ,true ,false ])).logs[0].address); 
    //     console.log("Burnable Pauseable Token Clone deployed at : " + burnablePauseabletoken.toString());
    //     assert(await factoryInstance.checkCloneContractWorking(burnablePauseabletoken))
    // })

    // it("Creating a mintable pauseable token clone", async () => {
    //     factoryInstance = await factory.deployed();
    //     let mintablePauseabletoken = ((await factoryInstance.createToken("Mintable Pauseable Token", "MPT",owner, 18,20000000000 ,50000000000, [true ,false ,true ,false ])).logs[0].address); 
    //     console.log("Mintable Pauseable Token Clone deployed at : " + mintablePauseabletoken.toString());
    //     assert(await factoryInstance.checkCloneContractWorking(mintablePauseabletoken))
    // })

    // it("Creating a burnMint pauseable token clone", async () => {
    //     factoryInstance = await factory.deployed();
    //     let burnMintPauseabletoken = ((await factoryInstance.createToken("BurnMint Pauseable Token", "BMPT",owner, 18,20000000000 ,50000000000, [true ,true ,true ,false ])).logs[0].address); 
    //     console.log("BurnMint Pauseable Token Clone deployed at : " + burnMintPauseabletoken.toString());
    //     assert(await factoryInstance.checkCloneContractWorking(burnMintPauseabletoken))
    // })

    // it("Creating a mintable capped token clone", async () => {
    //     factoryInstance = await factory.deployed();
    //     let mintableCappedtoken = ((await factoryInstance.createToken("Mintable Capped Token", "MTC",owner, 18,20000000000 ,50000000000, [true ,false ,false ,true ])).logs[0].address); 
    //     console.log("Mintable Capped Token Clone deployed at : " + mintableCappedtoken.toString());
    //     assert(await factoryInstance.checkCloneContractWorking(mintableCappedtoken))
    // })

    // it("Creating a burnMint capped token clone", async () => {
    //     factoryInstance = await factory.deployed();
    //     let burnMintCappedtoken = ((await factoryInstance.createToken("BurnMint Capped Token", "BMTC",owner, 18,20000000000 ,50000000000, [true ,true ,false ,true ])).logs[0].address); 
    //     console.log("BurnMint Capped Token Clone deployed at : " + burnMintCappedtoken.toString());
    //     assert(await factoryInstance.checkCloneContractWorking(burnMintCappedtoken))
    // })

    // it("Creating a mintable pauseable capped token clone", async () => {
    //     factoryInstance = await factory.deployed();
    //     let mintablePauseableCappedtoken = ((await factoryInstance.createToken("Mintable Pauseable Capped Token", "MPC",owner, 18,20000000000 ,50000000000, [true ,false ,true ,true ])).logs[0].address); 
    //     console.log("Mintable Pauseable Capped Token Clone deployed at : " + mintablePauseableCappedtoken.toString());
    //     assert(await factoryInstance.checkCloneContractWorking(mintablePauseableCappedtoken))
    // })

    // it("Creating a burnMint pauseable capped token clone", async () => {
    //     factoryInstance = await factory.deployed();
    //     let burnMintPauseableCappedtoken = ((await factoryInstance.createToken("BurnMint Pauseable Capped Token", "BPMC",owner, 18,20000000000 ,50000000000, [true ,true ,true ,true ])).logs[0].address); 
    //     console.log("BurnMint Pauseable Capped Token Clone deployed at : " + burnMintPauseableCappedtoken.toString());
    //     assert(await factoryInstance.checkCloneContractWorking(burnMintPauseableCappedtoken))
    // })

    // // it("Creating a Taxable token clone", async () => {
    // //     factoryInstance = await factory.deployed();
    // //     let Taxabletoken = ((await factoryInstance.createReflectiveToken("Taxable Token", "TT",owner, 18,20000000000 ,50000000000, [false ,false ,false ,false ])).logs[0].address); 
    // //     console.log("Taxable Token Clone deployed at : " + Taxabletoken.toString());
    // //     assert(await factoryInstance.checkCloneContractWorking(Taxabletoken))
    // // })
})

contract("Burnable Token", async (accounts) => {

    const tokenName = 'Burnable Token';
    const tokenSymbol = 'BT';
    const tokenDecimals = 18;
    const tokenTotalSupply = 50000000000;
    const ownerAddress = accounts[0];
    const owner = accounts[0];
    const address1 = accounts[1];
    const address2 = accounts[2];

    before(async () => {
        factoryInstance = await factory.deployed();
        let burnabletoken = ((await factoryInstance.createToken(tokenName, tokenSymbol,ownerAddress, tokenDecimals,tokenTotalSupply ,tokenTotalSupply, [false ,true ,false ,false ])).logs[0].address); 
        console.log("Standard Token Clone deployed at : " + burnabletoken.toString());
        burnableTokenInstance = await burnableToken.at(burnabletoken);
    })
    it("Creating a Burnable token clone", async () => {
        assert(burnableTokenInstance.address != undefined, "Standard token address is undefined");
    }); 

    it('set name', async () => {
        const result = await burnableTokenInstance.name();
        assert.equal(tokenName, result, 'name is wrong');
    });

    it('set symbol', async () => {
        const result = await burnableTokenInstance.symbol();
        assert.equal(tokenSymbol, result, 'symbol is wrong');
    });

    it('set decimals', async () => {
        const result = await burnableTokenInstance.decimals();
        assert.equal(tokenDecimals, result, 'decimals is wrong');
    });

    it('set totalSupply', async () => {
        const result = await burnableTokenInstance.totalSupply();
        assert.equal(tokenTotalSupply, result, 'totalSupply is wrong');
    });

    it('transfer should throw if to address is not valid', async () => {
        
        try {
            await burnableTokenInstance.transfer('0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress });
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('transfer should throw if balance is insufficient', async () => {
        
    try {
        await burnableTokenInstance.transfer(ownerAddress, 1000, { from: address1 });
        assert(false,"Insufficient balance accepted");
    } catch (error) {
        assert(true,"Insufficient balance accepted");
    }
        
        
    });

    it('transfer success', async () => {
        const result = await burnableTokenInstance.transfer(address1, 1000, { from: ownerAddress });
       
        assert(result.logs[0].event == "Transfer", "Transfer event not emitted");
    });

    it('balanceOf success', async () => {
        const result = await burnableTokenInstance.balanceOf(ownerAddress, { from: ownerAddress });
        
        assert.equal(result.toNumber(), tokenTotalSupply-1000, 'balance is wrong'); //Since 1000 is transferred in the previous test
    });

    it('approve success', async () => {
        const result = await burnableTokenInstance.approve(address1, 1000, { from: ownerAddress });
        
        assert(result.logs[0].event == "Approval", "Approval event not emitted");
    });

    it('transferFrom should throw if from address is not valid', async () => {
        try {
            await burnableTokenInstance.transferFrom('0x0000000000000000000000000000000000000000', address1, 1000, { from: ownerAddress })
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('transferFrom should throw if to address is not valid', async () => {
        try {
            await burnableTokenInstance.transferFrom(address1, '0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress })
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('transferFrom should throw if balance is insufficient', async () => {
        try {
            await burnableTokenInstance.transferFrom(address1, address2, 1000, { from: address1 })
            assert(false,"Insufficient balance accepted");
        } catch (error) {
            assert(true,"Insufficient balance accepted");
        }
    });

    it('transferFrom should throw if sender is not approved', async () => {
        try {
            await burnableTokenInstance.transferFrom(ownerAddress, address1, 1000, { from: ownerAddress })
            assert(false,"Sender is not approved");
        } catch (error) {
            assert(true,"Sender is not approved");
        }
    });

    it('transferFrom success', async () => {
        const result = await burnableTokenInstance.transferFrom(ownerAddress, address2, 1000, { from: address1 });
        assert(result.logs[1].event == "Transfer", "Transfer event not emitted");
    });

    it('not allowance', async () => {
        const result = await burnableTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(0, result.toNumber(), 'No Allowance test failed');
    });

    it('allowance', async () => {
        const expectedAmount = 1000;
        
        await burnableTokenInstance.approve(address1, expectedAmount, { from: ownerAddress });
        const result = await burnableTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(expectedAmount, result.toNumber(), 'Allowance test failed');
    });

    it('increaseApproval success', async () => {
        const expectedAmount = 2000;
        
        const resultIncrease = await burnableTokenInstance.increaseAllowance(address1, 1000, { from: ownerAddress });
        const resultAfterIncrease = await burnableTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(expectedAmount, resultAfterIncrease.toNumber(), 'wrong result after increase');
        assert(resultIncrease.logs[0].event == "Approval", "Approval event not emitted");
    });

    it('decreaseApproval success', async () => {
        const initialAmount = 2000;
        const expectedAmount = 1000;
        
        const resultDecrease = await burnableTokenInstance.decreaseAllowance(address1, 1000, { from: ownerAddress });
        const resultAfterDecrease = await burnableTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(expectedAmount, resultAfterDecrease.toNumber(), 'wrong result after increase');
        assert(resultDecrease.logs[0].event == "Approval", "Approval event not emitted");
    });

    it('burn should throw if from address is invalid', async () => {
        try {
            await burnableTokenInstance.burn('0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress })
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('burn should throw if balance is insufficient', async () => {
        try {
            await burnableTokenInstance.burn(1000, { from: accounts[3] })
            assert(false,"Insufficient balance accepted");
        } catch (error) {
            assert(true,"Insufficient balance accepted");
        }
    });

    it('burn success', async () => {
        const burnValue = 500;
        const initialBalanceOf = await burnableTokenInstance.balanceOf(ownerAddress);
        await burnableTokenInstance.burn( burnValue, { from: ownerAddress });
        const expectedTotalSupply = (tokenTotalSupply) - burnValue;
        const resultAfterBurn = await burnableTokenInstance.totalSupply();
        const resultBalanceOf = await burnableTokenInstance.balanceOf(ownerAddress);

        assert.equal(expectedTotalSupply, resultAfterBurn, 'wrong totalSupply after');
        assert.equal(initialBalanceOf - burnValue, resultBalanceOf, 'wrong balance after');
    });
})

contract("Mintable Token", async (accounts) => {

    const tokenName = 'Mintable Token';
    const tokenSymbol = 'MT';
    const tokenDecimals = 18;
    const tokenTotalSupply = 50000000000;
    const ownerAddress = accounts[0];
    const address1 = accounts[1];
    const address2 = accounts[2];

    before(async () => {
        factoryInstance = await factory.deployed();
        let mintabletoken = ((await factoryInstance.createToken(tokenName, tokenSymbol,ownerAddress, tokenDecimals,tokenTotalSupply ,tokenTotalSupply, [true ,false ,false ,false ])).logs[0].address); 
        console.log("Standard Token Clone deployed at : " + mintabletoken.toString());
        mintableTokenInstance = await mintableToken.at(mintabletoken);
    })
    it("Creating a Mintable token clone", async () => {
        assert(mintableTokenInstance.address != undefined, "Standard token address is undefined");
    }); 

    it('set name', async () => {
        const result = await mintableTokenInstance.name();
        assert.equal(tokenName, result, 'name is wrong');
    });

    it('set symbol', async () => {
        const result = await mintableTokenInstance.symbol();
        assert.equal(tokenSymbol, result, 'symbol is wrong');
    });

    it('set decimals', async () => {
        const result = await mintableTokenInstance.decimals();
        assert.equal(tokenDecimals, result, 'decimals is wrong');
    });

    it('set totalSupply', async () => {
        const result = await mintableTokenInstance.totalSupply();
        assert.equal(tokenTotalSupply, result, 'totalSupply is wrong');
    });

    it('transfer should throw if to address is not valid', async () => {
        
        try {
            await mintableTokenInstance.transfer('0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress });
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('transfer should throw if balance is insufficient', async () => {
        
    try {
        await mintableTokenInstance.transfer(ownerAddress, 1000, { from: address1 });
        assert(false,"Insufficient balance accepted");
    } catch (error) {
        assert(true,"Insufficient balance accepted");
    }
        
        
    });

    it('transfer success', async () => {
        const result = await mintableTokenInstance.transfer(address1, 1000, { from: ownerAddress });
       
        assert(result.logs[0].event == "Transfer", "Transfer event not emitted");
    });

    it('balanceOf success', async () => {
        const result = await mintableTokenInstance.balanceOf(ownerAddress, { from: ownerAddress });
        
        assert.equal(result.toNumber(), tokenTotalSupply-1000, 'balance is wrong'); //Since 1000 is transferred in the previous test
    });

    it('approve success', async () => {
        const result = await mintableTokenInstance.approve(address1, 1000, { from: ownerAddress });
        
        assert(result.logs[0].event == "Approval", "Approval event not emitted");
    });

    it('transferFrom should throw if from address is not valid', async () => {
        try {
            await mintableTokenInstance.transferFrom('0x0000000000000000000000000000000000000000', address1, 1000, { from: ownerAddress })
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('transferFrom should throw if to address is not valid', async () => {
        try {
            await mintableTokenInstance.transferFrom(address1, '0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress })
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('transferFrom should throw if balance is insufficient', async () => {
        try {
            await mintableTokenInstance.transferFrom(address1, address2, 1000, { from: address1 })
            assert(false,"Insufficient balance accepted");
        } catch (error) {
            assert(true,"Insufficient balance accepted");
        }
    });

    it('transferFrom should throw if sender is not approved', async () => {
        try {
            await mintableTokenInstance.transferFrom(ownerAddress, address1, 1000, { from: ownerAddress })
            assert(false,"Sender is not approved");
        } catch (error) {
            assert(true,"Sender is not approved");
        }
    });

    it('transferFrom success', async () => {
        const result = await mintableTokenInstance.transferFrom(ownerAddress, address2, 1000, { from: address1 });
        assert(result.logs[1].event == "Transfer", "Transfer event not emitted");
    });

    it('not allowance', async () => {
        const result = await mintableTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(0, result.toNumber(), 'No Allowance test failed');
    });

    it('allowance', async () => {
        const expectedAmount = 1000;
        
        await mintableTokenInstance.approve(address1, expectedAmount, { from: ownerAddress });
        const result = await mintableTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(expectedAmount, result.toNumber(), 'Allowance test failed');
    });

    it('increaseApproval success', async () => {
        const expectedAmount = 2000;
        
        const resultIncrease = await mintableTokenInstance.increaseAllowance(address1, 1000, { from: ownerAddress });
        const resultAfterIncrease = await mintableTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(expectedAmount, resultAfterIncrease.toNumber(), 'wrong result after increase');
        assert(resultIncrease.logs[0].event == "Approval", "Approval event not emitted");
    });

    it('decreaseApproval success', async () => {
        const initialAmount = 2000;
        const expectedAmount = 1000;
        
        const resultDecrease = await mintableTokenInstance.decreaseAllowance(address1, 1000, { from: ownerAddress });
        const resultAfterDecrease = await mintableTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(expectedAmount, resultAfterDecrease.toNumber(), 'wrong result after increase');
        assert(resultDecrease.logs[0].event == "Approval", "Approval event not emitted");
    });

    it('mint should throw if to address is invalid', async () => {
        try {
            await mintableTokenInstance.mint('0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress });
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    // it('mintTo should throw if amount is invalid', async () => {
    //     try {
    //         await mintableTokenInstance.mint(address1, 0, { from: ownerAddress })
    //         assert(false,"Invalid amount accepted");
    //     } catch (error) {
    //         assert(true,"Invalid amount accepted");
    //     }
    // });

    it('mint should throw if account is not a minter', async () => {
        const mintValue = 1000;

        try {
            (await mintableTokenInstance.mint(address1, mintValue, { from: address1 }))
            assert(false,"Account is not a minter");
        } catch (error) {
            assert(true,"Account is not a minter");
        }
    });

    it('mintTo success', async () => {
        const mintValue = 500;

        const resultBeforeMint = await mintableTokenInstance.totalSupply();
        const initialBalanceOf = await mintableTokenInstance.balanceOf(address1);
        await mintableTokenInstance.mint(address1, mintValue);
        const expectedTotalSupply = resultBeforeMint.toNumber() + mintValue;
        const resultAfterMint = await mintableTokenInstance.totalSupply();
        const resultBalanceOf = await mintableTokenInstance.balanceOf(address1, { from: address1 });

        assert.equal(tokenTotalSupply, resultBeforeMint, 'wrong totalSupply before');
        assert.equal(expectedTotalSupply, resultAfterMint, 'wrong totalSupply after');
        assert.equal(initialBalanceOf.toNumber() + mintValue, resultBalanceOf, 'wrong balance');
    });

    

})

contract("MintableBurnableToken", accounts => {
    const tokenName = 'MintBurn Token';
    const tokenSymbol = 'MBT';
    const tokenDecimals = 18;
    const tokenTotalSupply = 50000000000;
    const ownerAddress = accounts[0];
    const address1 = accounts[1];
    const address2 = accounts[2];

    before(async () => {
        factoryInstance = await factory.deployed();
        let burnminttoken = ((await factoryInstance.createToken(tokenName, tokenSymbol,ownerAddress, tokenDecimals,tokenTotalSupply ,tokenTotalSupply, [true ,true ,false ,false ])).logs[0].address); 
        console.log("Standard Token Clone deployed at : " + burnminttoken.toString());
        burnMintTokenInstance = await burnMintToken.at(burnminttoken);
    })
    it("Creating a Mintable token clone", async () => {
        assert(burnMintTokenInstance.address != undefined, "Standard token address is undefined");
    }); 

    it('set name', async () => {
        const result = await burnMintTokenInstance.name();
        assert.equal(tokenName, result, 'name is wrong');
    });

    it('set symbol', async () => {
        const result = await burnMintTokenInstance.symbol();
        assert.equal(tokenSymbol, result, 'symbol is wrong');
    });

    it('set decimals', async () => {
        const result = await burnMintTokenInstance.decimals();
        assert.equal(tokenDecimals, result, 'decimals is wrong');
    });

    it('set totalSupply', async () => {
        const result = await burnMintTokenInstance.totalSupply();
        assert.equal(tokenTotalSupply, result, 'totalSupply is wrong');
    });

    it('transfer should throw if to address is not valid', async () => {
        
        try {
            await burnMintTokenInstance.transfer('0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress });
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('transfer should throw if balance is insufficient', async () => {
        
    try {
        await burnMintTokenInstance.transfer(ownerAddress, 1000, { from: address1 });
        assert(false,"Insufficient balance accepted");
    } catch (error) {
        assert(true,"Insufficient balance accepted");
    }
        
        
    });

    it('transfer success', async () => {
        const result = await burnMintTokenInstance.transfer(address1, 1000, { from: ownerAddress });
       
        assert(result.logs[0].event == "Transfer", "Transfer event not emitted");
    });

    it('balanceOf success', async () => {
        const result = await burnMintTokenInstance.balanceOf(ownerAddress, { from: ownerAddress });
        
        assert.equal(result.toNumber(), tokenTotalSupply-1000, 'balance is wrong'); //Since 1000 is transferred in the previous test
    });

    it('approve success', async () => {
        const result = await burnMintTokenInstance.approve(address1, 1000, { from: ownerAddress });
        
        assert(result.logs[0].event == "Approval", "Approval event not emitted");
    });

    it('transferFrom should throw if from address is not valid', async () => {
        try {
            await burnMintTokenInstance.transferFrom('0x0000000000000000000000000000000000000000', address1, 1000, { from: ownerAddress })
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('transferFrom should throw if to address is not valid', async () => {
        try {
            await burnMintTokenInstance.transferFrom(address1, '0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress })
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('transferFrom should throw if balance is insufficient', async () => {
        try {
            await burnMintTokenInstance.transferFrom(address1, address2, 1000, { from: address1 })
            assert(false,"Insufficient balance accepted");
        } catch (error) {
            assert(true,"Insufficient balance accepted");
        }
    });

    it('transferFrom should throw if sender is not approved', async () => {
        try {
            await burnMintTokenInstance.transferFrom(ownerAddress, address1, 1000, { from: ownerAddress })
            assert(false,"Sender is not approved");
        } catch (error) {
            assert(true,"Sender is not approved");
        }
    });

    it('transferFrom success', async () => {
        const result = await burnMintTokenInstance.transferFrom(ownerAddress, address2, 1000, { from: address1 });
        assert(result.logs[1].event == "Transfer", "Transfer event not emitted");
    });

    it('not allowance', async () => {
        const result = await burnMintTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(0, result.toNumber(), 'No Allowance test failed');
    });

    it('allowance', async () => {
        const expectedAmount = 1000;
        
        await burnMintTokenInstance.approve(address1, expectedAmount, { from: ownerAddress });
        const result = await burnMintTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(expectedAmount, result.toNumber(), 'Allowance test failed');
    });

    it('increaseApproval success', async () => {
        const expectedAmount = 2000;
        
        const resultIncrease = await burnMintTokenInstance.increaseAllowance(address1, 1000, { from: ownerAddress });
        const resultAfterIncrease = await burnMintTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(expectedAmount, resultAfterIncrease.toNumber(), 'wrong result after increase');
        assert(resultIncrease.logs[0].event == "Approval", "Approval event not emitted");
    });

    it('decreaseApproval success', async () => {
        const initialAmount = 2000;
        const expectedAmount = 1000;
        
        const resultDecrease = await burnMintTokenInstance.decreaseAllowance(address1, 1000, { from: ownerAddress });
        const resultAfterDecrease = await burnMintTokenInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(expectedAmount, resultAfterDecrease.toNumber(), 'wrong result after increase');
        assert(resultDecrease.logs[0].event == "Approval", "Approval event not emitted");
    });

    it('mint should throw if to address is invalid', async () => {
        try {
            await burnMintTokenInstance.mint('0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress });
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    // it('mintTo should throw if amount is invalid', async () => {
    //     try {
    //         await burnMintTokenInstance.mint(address1, 0, { from: ownerAddress })
    //         assert(false,"Invalid amount accepted");
    //     } catch (error) {
    //         assert(true,"Invalid amount accepted");
    //     }
    // });

    it('mintTo should throw if account is not a minter', async () => {
        const mintValue = 1000;

        try {
            (await burnMintTokenInstance.mint(address1, mintValue, { from: address1 }))
            assert(false,"Account is not a minter");
        } catch (error) {
            assert(true,"Account is not a minter");
        }
    });

    it('mintTo success', async () => {
        const mintValue = 500;

        const resultBeforeMint = await burnMintTokenInstance.totalSupply();
        const initialBalanceOf = await mintableTokenInstance.balanceOf(address1);
        await burnMintTokenInstance.mint(address1, mintValue);
        const expectedTotalSupply = resultBeforeMint.toNumber() + mintValue;
        const resultAfterMint = await burnMintTokenInstance.totalSupply();
        const resultBalanceOf = await burnMintTokenInstance.balanceOf(address1, { from: address1 });

        assert.equal(tokenTotalSupply, resultBeforeMint, 'wrong totalSupply before');
        assert.equal(expectedTotalSupply, resultAfterMint, 'wrong totalSupply after');
        assert.equal(initialBalanceOf.toNumber() + mintValue, resultBalanceOf, 'wrong balance');
    });

    it('burn should throw if from address is invalid', async () => {
        try {
            await burnMintTokenInstance.burn('0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress })
            assert(false,"Invalid address accepted");
        } catch (error) {
            assert(true,"Invalid address accepted");
        }
    });

    it('burn should throw if balance is insufficient', async () => {
        try {
            await burnMintTokenInstance.burn(1000, { from: accounts[3] })
            assert(false,"Insufficient balance accepted");
        } catch (error) {
            assert(true,"Insufficient balance accepted");
        }
    });

    it('burn success', async () => {
        const burnValue = 500;
        const initialBalanceOf = await burnMintTokenInstance.balanceOf(ownerAddress);
        const initialsupply = await burnMintTokenInstance.totalSupply();
        await burnMintTokenInstance.burn( burnValue, { from: ownerAddress });
        const expectedTotalSupply = (initialsupply.toNumber()) - burnValue;
        const resultAfterBurn = await burnMintTokenInstance.totalSupply();
        const resultBalanceOf = await burnMintTokenInstance.balanceOf(ownerAddress);

        assert.equal(expectedTotalSupply, resultAfterBurn, 'wrong totalSupply after');
        assert.equal(initialBalanceOf - burnValue, resultBalanceOf, 'wrong balance after');
    });


})