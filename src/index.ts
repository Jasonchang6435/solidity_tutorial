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
  const tx = await threeDXContact.mint(image);
  tx.wait();

  console.log("Mint txHash:", tx.hash);
  const rcp = await provider.getTransactionReceipt(tx.hash);
  const parsedLog = await iface.parseLog(rcp.logs[0]);
  return parsedLog.args.tokenId.toString();
}

async function main(): Promise<void> {
  await mint("QmVrvZ3fmSiYVoAvuDvp45fqjMaW4htYHa1LFFkexxP9rU");
}

void main();
