const CONTRACT_ADDRESS = '0x44802b4e381f8B054610ACf9292e9A7EdB6eF49A';

/*
 * Add this method and make sure to export it on the bottom!
 */
const transformCharacterData = (characterData) => {
    return {
        name: characterData.name,
        imageURI: characterData.imageURI,
        hp: characterData.hp.toNumber(),
        maxHp: characterData.maxHp.toNumber(),
        attackDamage: characterData.attackDamage.toNumber(),
    };
};

export { CONTRACT_ADDRESS, transformCharacterData };