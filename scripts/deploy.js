const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('IronFistTournament');

  const gameContract = await gameContractFactory.deploy(
      ["King", "Heihachi", "Jin Kazama", "Hwoarang"],       // Names
      ["https://64.media.tumblr.com/13bf4f6bafb1d550901ecbb1ad08f5e4/0d9b5c98ff9e1199-cd/s540x810/2f8715aa0dd847d37e66ea8b8dc00de181630b69.gifv", // Images
        "https://64.media.tumblr.com/73b9abc10448355bd8621a22160085a9/ab8d755d838896de-72/s400x600/4b781ed6a1eff42297c2e673f767c053260aecb6.gifv",
        "https://64.media.tumblr.com/a24273e7a9989cbf91730284a18a5868/eeaad1375bb05898-60/s540x810/ea47f20bf489702c0151afc2a248eca513ca8dc4.gifv",
        "https://64.media.tumblr.com/f08b9f568a81745b7c8e11a23e26079f/1c9ecb800db71398-94/s500x750/142c305dff45ceb0f02e1a6937d12319f4bc7f78.gifv"
      ],
      [190, 300, 200, 185],                    // HP values
      [95, 110, 90, 100], // Attack damage values
      "DevilJim", //Check out the URL for the nerdy joke
      "https://imgur.com/t/tekken7/98Z1pda",
      1000, //Boss HP
      200 //Boss attack
  );

  await gameContract.deployed
  console.log("Contract deployed to:", gameContract.address);
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