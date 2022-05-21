const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
    const gameContract = await gameContractFactory.deploy(
        ["King", "Heihachi", "Jin Kazama"],       // Names
        ["https://i.imgur.com/R9IOgaZ.png", // Images
            "https://i.imgur.com/L2kiTpW.jpeg",
            "https://i.imgur.com/QqOhye9.jpeg"],
        [190, 300, 200],                    // HP values
        [95, 110, 90]                       // Attack damage values
    );
    await gameContract.deployed();
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