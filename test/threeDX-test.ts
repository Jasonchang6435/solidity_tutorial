import chai from "chai";
import "mocha";
import { ethers } from "hardhat";
import chaiAsPromised from "chai-as-promised";
import threeDXAbi from "../artifacts/contracts/ThreeDX.sol/ThreeDX.json";
const iface = new ethers.utils.Interface(threeDXAbi.abi);

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("ThreeDX", function () {
  it("mint", async function () {
    const ThreeDX = await ethers.getContractFactory("ThreeDX");
    const threeDX = await ThreeDX.deploy();
    await threeDX.deployed();

    let tx = await threeDX.mint(
      "QmVrvZ3fmSiYVoAvuDvp45fqjMaW4htYHa1LFFkexxP9rU"
    );
    tx.wait();

    const tokenURI = await threeDX.tokenURI(1);
    console.log(tokenURI);
  });
});
