
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { BigNumber } from "ethers";

describe("TokenFaucet", function(){

    const TOTAL_SUPPLY = 2_000_000_000;

    async function deployContractFixture() {
        const [owner, addr1, addr2,addr3,addr4, ...addrs] = await ethers.getSigners();

        const MyToken = await ethers.getContractFactory("MyToken");
        const myToken = await MyToken.deploy("My token", "MYTOKEN", TOTAL_SUPPLY, {});
        console.log("MyToken contract address: ", myToken.address);

        const TokenFaucet = await ethers.getContractFactory("TokenFaucet");
        const tokenFaucet = await TokenFaucet.deploy();
        console.log("TokenTransfer contract address: ", tokenFaucet.address);

        return {owner, myToken, tokenFaucet, addr1, addr2, addr3, addr4};
    }

    describe("Transfer to transer contract", async () => {
        it("step1 token init ", async () => {
            const { myToken, owner} = await loadFixture(deployContractFixture);
            const totalSupply = await myToken.totalSupply();
            expect(await myToken.balanceOf(owner.address)).to.equal(totalSupply);

        })
        it("step2 token to contract", async() => {
            const{myToken, tokenFaucet} = await loadFixture(deployContractFixture);
            const transaction = await myToken.transfer(tokenFaucet.address, 1_000_000_000);
            const faucetBalance = myToken.balanceOf(tokenFaucet.address);
            console.log("faucet balance = ", faucetBalance)
            const transferBalance = await myToken.balanceOf(tokenFaucet.address);
            console.log("transferBalance = " ,transferBalance)
            expect( transferBalance).to.equal(1_000_000_000)
        })
        it("step3 set allown amount", async() =>{
            const {tokenFaucet, myToken, addr1} = await loadFixture(deployContractFixture);
            await tokenFaucet.setAllownAmount(myToken.address, 1000 , 5000);

            // const transaction = await myToken.transfer(tokenFaucet.address, 1_000_000_000);

            const transfer1 =  await tokenFaucet.requestToken(myToken.address, addr1.address, 10);

        })
        // it("step4 transfer amount", async() =>{
        //     const{myToken, tokenFaucet, addr2, addr3, addr4} = await loadFixture(deployContractFixture);
            
        
        // })
    })


})
