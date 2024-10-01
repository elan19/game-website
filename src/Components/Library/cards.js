const possibleCards = {
    'Counter-Strike: Global Offensive': [
        { name: 'AWP Lightning Strike', desc: `Sometimes you don't need to strike the same place twice`, pic: `case_csgo.png`, rarity: 'legendary' },
        { name: 'AK-47 Case Hardened', desc: `A little color never hurt anyone`, pic: `case_csgo.png`, rarity: 'epic' },
        { name: 'Desert Eagle Hypnotic', desc: `You're not getting sleepy, you're passing out from blood loss`, pic: `case_csgo.png`, rarity: 'epic' },
        { name: 'Weapon Case', desc: `Just a case`, pic: `case_csgo.png`, rarity: 'common' },
        { name: 'Glock-18 - Dragon Tattoo', desc: `In a fairy tale the knight always slays the dragon... but this is the real world`, pic: `case_csgo.png`, rarity: 'common' }
    ],

    'Golf With Your Friends': [
        { name: 'Unicorn Horn', rarity: 'common' },
        { name: 'Cupcake Hat', rarity: 'rare' },
        { name: 'Bouncy Ring', rarity: 'legendary' }
    ],

    'Dota 2': [
        { name: 'Death Shadow Bow', desc: `Useable by: Drow Ranger`, rarity: 'common'},
        { name: 'Scavenging Guttleslug', desc: `Useable by: Pudge`, rarity: 'common'},
        { name: 'Mischievous Dragon Egg', desc: `Useable by: Puck`, rarity: 'common'},
        { name: 'The Barren Crown', desc: `Useable by: Sand King`, rarity: 'uncommon'},
        { name: 'Transversant Soul', desc: `Useable by: Spectre`, rarity: 'uncommon'},
        { name: 'Moonfall', desc: `Useable by: Luna`, rarity: 'rare'},
        { name: 'Magus Apex', desc: `Useable by: Invoker`, rarity: 'rare'},
        { name: 'Doll of the Lizard Kin', desc: `Useable by: Shadow Shaman`, rarity: 'epic'},
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
    
    'Gamipo': [
        { name: 'Boring Card', desc: `This is a boring card. Guess there are no drops for this game`, pic: `boring_card.png`, rarity: 'common' },
        { name: 'Laugh Card', desc: `This is a laughing card. Guess there are no drops for this game`, pic: `laugh_card.png`, rarity: 'common' },
        { name: 'Smile Card', desc: `This is a smile card. Guess there are no drops for this game`, pic: `smile_card.png`, rarity: 'common' },
        { name: 'Pistol Card', desc: `This is a pistol card. Maybe more weapon cards exists`, pic: `pistol_card.png`, rarity: 'uncommon' },
        { name: 'Dog Card', desc: `This is a dog card. Woff Woff`, pic: `dog_card.png`, rarity: 'uncommon' },
        { name: 'Cat Card', desc: `This is a cat card. Mjau Mjau`, pic: `cat_card.png`, rarity: 'uncommon' },
        { name: 'Hand-Grenade Card', desc: `This is a hand-grenade card. Time to blow something up`, pic: `hand-grenade_card.png`, rarity: 'rare' },
        { name: 'Shotgun Card', desc: `This is a shotgun card. Epic indeed`, pic: `shotgun_card.png`, rarity: 'epic' },
        { name: 'Crown Card', desc: `This is a crown card. Lucky you`, pic: `crown_card.png`, rarity: 'legendary' },
    ]
};

export default possibleCards;