import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";


describe("Token", function () {
   

    async function paramInit(){
        const Token = await ethers.getContractFactory("Token")
        const token = await Token.deploy();
        const [owner, addr1] = await ethers.getSigners();
        return { Token, token, owner, addr1};

    }   
    
    describe("suibian", function () {
        it("所有者是否正确", async function () {      
            const {token, owner, addr1} = await loadFixture(paramInit);
            expect(await token.owner()).to.equal(owner.address);
        });
        it("部署者拥有所有代币", async function () {      
            const {token, owner, addr1} = await loadFixture(paramInit);
            const totalSupply = await token.totalSupply();
            expect(await token.balanceOf(owner.address)).to.equal(totalSupply);
        });
    })

    describe("transfer test", function(){
        it("正确发送", async function(){
            
            const {token, owner, addr1} = await loadFixture(paramInit);
            await token.transfer(addr1.getAddress(), 100);
            
            const balanceAddr1 = await token.balanceOf(addr1.getAddress());

            console.log("addr1 balances = " + balanceAddr1);
            expect(balanceAddr1).to.equal(100);

        })
    })
})
