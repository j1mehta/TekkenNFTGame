// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "hardhat/console.sol";

//NFT contract to inherit from
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

//Other Openzeppelin functions
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../libraries/Base64.sol";


contract IronFistTournament is ERC721 {
    // We'll hold our character's attributes in a struct. Feel free to add
    // whatever you'd like as an attribute! (ex. defense, crit chance, etc).
    struct CharacterAttributes {
        uint characterIndex;
        string name;
        string imageURI;
        uint hp;
        uint maxHp;
        uint attackDamage;
    }

    // NFT's unique identifier.
    // The weird syntax below means
    // *using fns of library A as type B"
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // A lil array to help us hold the default data for our characters.
    // This will be helpful when we mint new characters and need to know
    // things like their HP, AD, etc.
    CharacterAttributes[] defaultCharacters;

    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

    //MishimaCorp big boss which Tekken players need to defeat
    struct BigBoss {
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
    }

    BigBoss public bigBoss;
    // Data passed in to the contract when it's first created initializing the characters.
    // We're going to actually pass these values in from run.js.
    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint[] memory characterHp,
        uint[] memory characterAttackDmg,
        string memory bossName, // These new variables would be passed in via run.js or deploy.js.
        string memory bossImageURI,
        uint bossHp,
        uint bossAttackDamage
    )
    //Below, we initialize the name and symbol for the NFT collection where each NFT will have its own token_ID. This
    //is indirect initialization done to the constructor of the base class from which the contract is derived, ie,
    //ERC721. If you don't do this, you'll get an error asking you to mark the contract "IronFistTournament" as abstract
    //due to the missing implementation of ERC721 contract's constructor.
    ERC721("Tekken", "TEKK")
    {
        // Initialize the boss. Save it to our global "bigBoss" state variable.
        bigBoss = BigBoss({
        name: bossName,
        imageURI: bossImageURI,
        hp: bossHp,
        maxHp: bossHp,
        attackDamage: bossAttackDamage
        });

        console.log("Done initializing boss %s w/ HP %s, img %s", bigBoss.name, bigBoss.hp, bigBoss.imageURI);

        // In the constructor, we loop through all the characters, and save their values in our contract so
        // we can use them later when we mint our NFTs.
        for(uint i = 0; i < characterNames.length; i += 1) {
            defaultCharacters.push(CharacterAttributes({
            characterIndex: i,
            name: characterNames[i],
            imageURI: characterImageURIs[i],
            hp: characterHp[i],
            maxHp: characterHp[i],
            attackDamage: characterAttackDmg[i]
            }));

            CharacterAttributes memory c = defaultCharacters[i];
            console.log("Done initializing %s w/ HP %s, img %s", c.name, c.hp, c.imageURI);

            //Lets increment the _tokenIds by 1 so the counting starts from 1 instead of 0,
            //because that's the recommended approach (TODO: find out more on this)
            _tokenIds.increment();
        }

        // All the other character code is below here is the same as before, just not showing it to keep things short!
    }

    mapping(address => uint256) public nftHolders;

    //This is the fn that the user will interact with to mint a new NFT
    //by inputting their desired characterID
    function mintCharacterNFT(uint _characterIndex) external {

        uint256 newItemId = _tokenIds.current();

        //This is the newly minted newItemId that would belong to the minter, ie,
        //msg.sender
        _safeMint(msg.sender, newItemId);

        //Lets now map the newItemId to the metadata associated with the NFT's tokenId
        nftHolderAttributes[newItemId] = CharacterAttributes({
            characterIndex: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            imageURI: defaultCharacters[_characterIndex].imageURI,
            hp: defaultCharacters[_characterIndex].hp,
            maxHp: defaultCharacters[_characterIndex].maxHp,
            attackDamage: defaultCharacters[_characterIndex].attackDamage
        });

        console.log("Minted NFT w/ tokenId %s and characterIndex %s", newItemId, _characterIndex);

        // Keep an easy way to see who owns what NFT.
        nftHolders[msg.sender] = newItemId;

        // Increment the tokenId for the next person that uses it.
        _tokenIds.increment();
    }

    //Let's format our JSON file and encode it to Base64. Why? Coz that's the format
    //most NFT websites like Opensea, Rarible want
    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];

        string memory strHp = Strings.toString(charAttributes.hp);
        string memory strMaxHp = Strings.toString(charAttributes.maxHp);
        string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                charAttributes.name,
                ' -- NFT #: ',
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play with Tekken characters!", "image": "',
                charAttributes.imageURI,
                '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
                strAttackDamage,'} ]}'
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function attackBoss() public {
        // Get the state of the player's NFT.
        uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
        CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];

        console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
        console.log("Boss %s has %s HP and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);

        // Make sure the player has more than 0 HP.
        require (
            player.hp > 0,
            "Error: character must have HP to attack boss."
        );

        // Make sure the boss has more than 0 HP.
        require (
            bigBoss.hp > 0,
            "Error: boss must have HP to attack boss."
        );

        // Allow player to attack boss.
        if (bigBoss.hp < player.attackDamage) {
            bigBoss.hp = 0;
        } else {
            bigBoss.hp = bigBoss.hp - player.attackDamage;
        }

        // Allow boss to attack player.
        if (player.hp < bigBoss.attackDamage) {
            player.hp = 0;
        } else {
            player.hp = player.hp - bigBoss.attackDamage;
        }

        // Console for ease.
        console.log("Player attacked boss. New boss hp: %s", bigBoss.hp);
        console.log("Boss attacked player. New player hp: %s\n", player.hp);
    }
}