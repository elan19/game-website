const possibleCards = {
    'Counter-Strike: Global Offensive': [
        { name: 'Weapon Case', desc: `Just a regular case`, pic: `case_csgo.png`, rarity: 'common' },
        { name: 'Weapon Case', desc: `Just a sticker capsule`, pic: `sticker-capsule_csgo.png`, rarity: 'common' },
        { name: 'AK-47 Regular', desc: `No need for color, regular is good enough`, pic: `ak47-regular_csgo.png`, rarity: 'rare' },
        { name: 'P2000 - Dreamer', desc: `Day dreaming`, pic: `p2000-dreamer_csgo.png`, rarity: 'epic' },
        { name: 'Glock-18 - Darkness', desc: `Useable on Glock-18`, pic: `glock18-darkness_csgo.png`, rarity: 'epic' },
        { name: 'Desert Eagle - Golden', desc: `Outshine your enemy, to whatever price`, pic: `case_csgo.png`, rarity: 'legendary' },
    ],

    'Golf With Your Friends': [
        { name: 'Unicorn Horn', rarity: 'common' },
        { name: 'Cupcake Hat', rarity: 'rare' },
        { name: 'Bouncy Ring', rarity: 'legendary' }
    ],

    'Dota 2': [
        { name: 'Death Shadow Bow', desc: `Useable by: Drow Ranger`, pic: `death-shadow-bow_dota2.png`, rarity: 'common'},
        { name: 'Scavenging Guttleslug', desc: `Useable by: Pudge`, pic: `_dota2.png`, rarity: 'common'},
        { name: 'Mischievous Dragon Egg', desc: `Useable by: Puck`, pic: `mischievous-dragon-egg_dota2.png`, rarity: 'common'},
        { name: 'The Barren Crown', desc: `Useable by: Sand King`, pic: `the-barren-crown_dota2.png`, rarity: 'uncommon'},
        { name: 'Transversant Soul', desc: `Useable by: Spectre`, pic: `transversant-soul_dota2.png`, rarity: 'uncommon'},
        { name: 'Moonfall', desc: `Useable by: Luna`, pic: `moonfall_dota2.png`, rarity: 'rare'},
        { name: 'Magus Apex', desc: `Useable by: Invoker`, pic: `magus-apex_dota2.png`, rarity: 'rare'},
        { name: 'Doll of the Lizard Kin', desc: `Useable by: Shadow Shaman`, pic: `doll-of-the-lizard-kin_dota2.png`, rarity: 'epic'},
        { name: 'Spirit of Calm', desc: `Useable by: Lone Druid`, pic: `spirit-of-calm_dota2.png`, rarity: 'legendary'}
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
        { name: 'Cat Card', desc: `This is a cat card. Mjau`, pic: `cat_card.png`, rarity: 'uncommon' },
        { name: 'Hand-Grenade Card', desc: `This is a hand-grenade card. Time to blow something up`, pic: `hand-grenade_card.png`, rarity: 'rare' },
        { name: 'Shotgun Card', desc: `This is a shotgun card. Epic indeed`, pic: `shotgun_card.png`, rarity: 'epic' },
        { name: 'Crown Card', desc: `This is a crown card. Lucky you`, pic: `crown_card.png`, rarity: 'legendary' },
    ]
};

export default possibleCards;