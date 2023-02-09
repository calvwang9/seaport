import hre, { ethers } from "hardhat";
import { seaportFixture } from "../test/utils/fixtures";
import { faucet } from "../test/utils/faucet";

// See: https://hardhat.org/hardhat-runner/docs/getting-started#connecting-a-wallet-or-dapp-to-hardhat-network
//
// To deploy to localhost network:
// 1. Start local hardhat node
//    `npx hardhat node`
// 2. Open a new terminal and deploy the smart contract in the localhost network
//    `npx hardhat run --network localhost scripts/deploy.ts`

async function main() {
  // log network details
  console.log("network:", hre.network.name);
  console.log("chainId:", hre.network.config.chainId);

  // init random owner wallet with ETH balance
  const { provider } = ethers;
  const owner = ethers.Wallet.createRandom().connect(provider);
  await faucet(owner.address, provider);

  // deploy Seaport (marketplaceContract), alongside others (ConduitController, TestERC20, TestERC721, etc)
  // access other contracts via returned fixture object
  // see test/*.spec.ts for examples
  const { marketplaceContract } = await seaportFixture(owner);

  // test retrieve info from Seaport contract
  const name = await marketplaceContract.name();
  console.log("name:", name);
  const info = await marketplaceContract.information();
  console.log("version:", info.version);
  console.log("domainSeparator:", info.domainSeparator);
  console.log("conduitController:", info.conduitController);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
