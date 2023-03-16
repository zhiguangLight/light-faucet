import { ethers } from "hardhat";

async function main() {
    const Fauct = await ethers.getContractFactory("TokenFaucet");
    const fauct = await Fauct.deploy();
    await fauct.setAllownAmount("", 1000, 100000);

    const deployedResult =  fauct.deployed;
    console.log("deployedResult = ", deployedResult);
    console.log("fauct address = ", fauct.address);

};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });