const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('IronFistTournament');
  const gameContract = await gameContractFactory.deploy(
      ["King", "Heihachi", "Jin Kazama"],       // Names
      ["https://i.imgur.com/R9IOgaZ.png", // Images
        "https://i.imgur.com/L2kiTpW.jpeg",
        "https://i.imgur.com/QqOhye9.jpeg"],
      [190, 300, 200],                    // HP values
      [95, 110, 90], // Attack damage values
      "DevilJim", //Check out the URL for the nerdy joke
      "https://imgur.com/t/tekken7/98Z1pda",
      1000, //Boss HP
      200 //Boss attack
  );
  await gameContract.deployed
  console.log("Contract deployed to:", gameContract.address);

  let txn;
  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

  // Get the value of the NFT's URI.
  let returnedTokenUri = await gameContract.tokenURI(3);
  console.log("Token URI:", returnedTokenUri);

};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();