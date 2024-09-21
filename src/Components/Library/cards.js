const possibleCards = {
    'Counter-Strike: Global Offensive': [
        { name: 'AWP Lightning Strike', desc: `Sometimes you don't need to strike the same place twice`, rarity: 'legendary' },
        { name: 'AK-47 Case Hardened', desc: `A little color never hurt anyone`, rarity: 'epic' },
        { name: 'Desert Eagle Hypnotic', desc: `You're not getting sleepy, you're passing out from blood loss`, rarity: 'epic' },
        { name: 'Weapon Case', rarity: 'common' },
        { name: 'Glock-18 - Dragon Tattoo', desc: `In a fairy tale the knight always slays the dragon... but this is the real world`, rarity: 'common' }
    ],

    'Golf With Your Friends': [
        { name: 'Unicorn Horn', rarity: 'common' },
        { name: 'Cupcake Hat', rarity: 'rare' },
        { name: 'Bouncy Ring', rarity: 'legendary' }
    ],

    'Dota 2': [
        { name: 'Death Shadow Bow', desc: `Useable by: Drow Ranger`, rarity: 'common'},
        { name: 'Scavenging Guttleslug', desc: `Useable by: Pudge`, rarity: 'common'},
        { name: 'Mischievous Dragon Tail', desc: `Useable by: Puck`, rarity: 'common'},
        { name: 'The Barren Crown', desc: `Useable by: Sand King`, rarity: 'uncommon'},
        { name: 'Transversant Soul', desc: `Useable by: Spectre`, rarity: 'uncommon'},
        { name: 'Moonfall', desc: `Useable by: Luna`, rarity: 'rare'},
        { name: 'Magus Apex', desc: `Useable by: Invoker`, rarity: 'rare'},
        { name: 'Lash of the Lizard Kin', desc: `Useable by: Shadow Shaman`, rarity: 'epic'},
        { name: 'Spirit of Calm', desc: `Useable by: Lone Druid`, rarity: 'legendary'}
    ],

    'Rust': [
        { name: 'Wood', desc: `Wood can be combined to craft new skins and items`, rarity: 'common' },
        { name: 'Cloth', desc: `Cloth can be combined to craft new clothing items`, rarity: 'common' },
        { name: 'Green Cap', desc: `A hat with a protrusion on the front which under the right conditions prevents the sun from entering the wearer's eye`, rarity: 'uncommon' },
        { name: 'Egg Suit', desc: `An extremely silly egg suit which you can paint anything you'd like on to`, rarity: 'rare' },
        { name: 'High Quality Bag', desc: `Bags contain clothes`, rarity: 'epic' },
        { name: 'Dragon Rocker Launcher', desc: `This is a skin for the Rocket Launcher item`, rarity: 'legendary' },
    ],
    
    'Rest': [
        { name: 'Boring Card', desc: `This is a boring card. Guess there are no drops for this game`, rarity: 'common' },
        { name: 'Laugh Card', desc: `This is a laughing card. Guess there are no drops for this game`, rarity: 'common' },
        { name: 'Smile Card', desc: `This is a smile card. Guess there are no drops for this game`, rarity: 'common' },
        { name: 'Pistol Card', desc: `This is a pistol card. Maybe more weapon cards exists`, rarity: 'uncommon' },
        { name: 'Dog Card', desc: `This is a dog card. Woff Woff`, rarity: 'uncommon' },
        { name: 'Cat Card', desc: `This is a cat card. Mjau Mjau`, rarity: 'uncommon' },
        { name: 'Hand-Grenade Card', desc: `This is a hand-grenade card. Time to blow something up`, rarity: 'rare' },
        { name: 'Shotgun Card', desc: `This is a shotgun card. Epic indeed`, rarity: 'epic' },
        { name: 'Crown Card', desc: `This is a crown card. Lucky you`, rarity: 'legendary' },
    ]
};

export default possibleCards;