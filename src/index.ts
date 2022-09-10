import threeDXAbi from "../artifacts/contracts/ThreeDX.sol/ThreeDX.json";
import { ethers } from "ethers";
require("dotenv").config();

const iface = new ethers.utils.Interface(threeDXAbi.abi);

const threeDXContractAddress = "0xf17FD11EB21a79E44Aa46F334d590B6a1529eFDa";
export const provider = new ethers.providers.JsonRpcProvider(
  process.env.RINKEYBY_URL
);
export const wallet = new ethers.Wallet(
  process.env.RINKEYBY_PRIVATE_KEY!,
  provider
);
const threeDXContact = new ethers.Contract(
  threeDXContractAddress,
  threeDXAbi.abi,
  provider
).connect(wallet);

export async function mint(image: string): Promise<string> {
  const gasPrice = await provider.getGasPrice()
  const maxFeePerGas = gasPrice.mul(2)
  const maxPriorityFeePerGas = gasPrice
  const tx = await threeDXContact.mint(image,{
    maxFeePerGas,
    maxPriorityFeePerGas,
  });
  tx.wait();

  console.log("Mint txHash:", tx.hash);
  const rcp = await provider.getTransactionReceipt(tx.hash);
  const parsedLog = await iface.parseLog(rcp.logs[0]);
  return parsedLog.args.tokenId.toString();
}

async function main(): Promise<void> {
  await mint( "{\"name\":\"696969\",\"image\":\"ipfs://Qmd2BRY1u5b4NWCzUgd94W2ef3HdRAe119CfnbF5ezmVoW\",\"description\":\"LooksWhale Sire!\"}")}

void main();
