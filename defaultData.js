let saveValuesDefault = {
    clickCount:0,
    clickFactor:1,
    dps:0,
    realScore:1e12,
    freeLevels:0,
    primogem:0,
    energy:100,
    rowCount:0,
    heroesPurchased:0,
    mailCore:0,
    wishUnlocked: false,
    wishCounterSaved:0,
    goldenNut: 0,
    goldenTutorial: false,
    currentTime: 0,
    achievementCount: 0,
}

let persistentValuesDefault = {
    goldenCore: 0,
    upgrade1:{Purchased: 0},
    upgrade2:{Purchased: 0},
    upgrade3:{Purchased: 0},
    upgrade4:{Purchased: 0},
    upgrade5:{Purchased: 0},
    upgrade6:{Purchased: 0},
    upgrade7:{Purchased: 0},
    upgrade8:{Purchased: 0},
    upgrade9:{Purchased: 0},
    upgrade10:{Purchased: 0},
    upgrade11:{Purchased: 0},
}

let SettingsDefault = {
    bgmVolume:0.5,
    sfxVolume:0.5,
    combineFloatText:false,
}

let permUpgrades = {
    1:{Name:"Blessing of Vitality",        Effect:10,  Max:50,   Cap:false,   Description:"Increases Energy gained by clicking Big Nahida."},
    2:{Name:"Blessing of Technique",       Effect:10,  Max:50,   Cap:false,   Description:"Increase Nuts gained by clicking Big Nahida."},
    3:{Name:"Blessing of Wanderlust",      Effect:2,   Max:50,   Cap:true,   Description:"Increases base power of Wish characters."},
    4:{Name:"Blessing of Concession",      Effect:2,   Max:25,   Cap:true,   Description:"Decreases price of Dori's Shop items."},
    5:{Name:"Blessing of Might",           Effect:1,   Max:50,   Cap:true,   Description:"Increases critical hit amount and chance.",   zeroDescription:"Enables critical hits for clicking Big Nahida."},
    6:{Name:"Blessing of Tranquillity",    Effect:1,   Max:50,   Cap:false,   Description:"Increases offline Nut accumulation rate.",    zeroDescription:"Enables accumulation of Nuts while offline."},
    7:{Name:"Blessing of Fortuity",        Effect:0.5, Max:50,   Cap:true,   Description:"Increases chances of lucky outcomes.",          zeroDescription:"Enables additional lucky outcomes for certain events."},
    8:{Name:"Blessing of Enlightenment",   Effect:2,   Max:25,   Cap:true,   Description:"Decreases cooldown between Event spawns."},
    9:{Name:"Blessing of Riches",          Effect:10,  Max:25,   Cap:true,   Description:"Increases Primogems gained from Events/Achievements."},
    10:{Name:"Blessing of Strength",       Effect:10,  Max:25,   Cap:false,   Description:"Increases effectiveness of Weapons and Talents."},
    11:{Name:"Blessing of Fortification",  Effect:10,  Max:25,   Cap:false,   Description:"Increases effectiveness of Artifacts, Gems and Food."},
}
let upgradeDictDefault = {
    0:  {Row:-1,        Purchased: -1,   "Contribution": 0, "Level": 1, "BaseCost":20, Factor:1  },
    1:  {Row:-1,        Purchased: -1,    },
    2:  {Row:-1,        Purchased: -1,    },
    3:  {Row:-1,        Purchased: -1,    },
    4:  {Row:-1,        Purchased: -1,    },
    5:  {Row:-1,        Purchased: -1,    },
    6:  {Row:-1,        Purchased: -1,    },
    7:  {Row:-1,        Purchased: -1,    },
    8:  {Row:-1,        Purchased: -1,    },
    9:  {Row:-1,        Purchased: -1,    },
    10: {Row:-1,        Purchased: -1,    },
    50: {Row:-1,        Purchased: -1,    },
    51: {Row:-1,        Purchased: -1,    },
    52: {Row:-1,        Purchased: -1,    },
    53: {Row:-1,        Purchased: -1,    },
    54: {Row:-1,        Purchased: -1,    },
    55: {Row:-1,        Purchased: -1,    },
    56: {Row:-1,        Purchased: -1,    },
    57: {Row:-1,        Purchased: -1,    },
    58: {Row:-1,        Purchased: -1,    },
    59: {Row:-1,        Purchased: -1,    },
    60: {Row:-1,        Purchased: -1,    },
    61: {Row:-1,        Purchased: -1,    },
    62: {Row:-1,        Purchased: -1,    },
    63: {Row:-1,        Purchased: -1,    },
    64: {Row:-1,        Purchased: -1,    },
    101: {Row:-1,        Purchased: -1,    },
    102: {Row:-1,        Purchased: -1,    },
    103: {Row:-1,        Purchased: -1,    },
    104: {Row:-1,        Purchased: -1,    },
    105: {Row:-1,        Purchased: -1,    },
    106: {Row:-1,        Purchased: -1,    },
    107: {Row:-1,        Purchased: -1,    },
    108: {Row:-1,        Purchased: -1,    },
    109: {Row:-1,        Purchased: -1,    },
    110: {Row:-1,        Purchased: -1,    },    
    111: {Row:-1,        Purchased: -1,    },
    112: {Row:-1,        Purchased: -1,    },
    113: {Row:-1,        Purchased: -1,    },
    150: {Row:-1,        Purchased: -1,    },
    151: {Row:-1,        Purchased: -1,    },
    152: {Row:-1,        Purchased: -1,    },
    153: {Row:-1,        Purchased: -1,    },
    154: {Row:-1,        Purchased: -1,    },
    155: {Row:-1,        Purchased: -1,    },
    156: {Row:-1,        Purchased: -1,    },
    157: {Row:-1,        Purchased: -1,    },
    158: {Row:-1,        Purchased: -1,    },
    159: {Row:-1,        Purchased: -1,    },
    160: {Row:-1,        Purchased: -1,    },
// RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS
    800: {Row:-1,    "Level": 0, Purchased: -10,   },
    801: {Row:-1,    "Level": 0, Purchased: -10,   },
    802: {Row:-1,    "Level": 0, Purchased: -10,   },
    803: {Row:-1,    "Level": 0, Purchased: -10,   },
    804: {Row:-1,    "Level": 0, Purchased: -10,   },
    805: {Row:-1,    "Level": 0, Purchased: -10,   },
    806: {Row:-1,    "Level": 0, Purchased: -10,   },
    807: {Row:-1,    "Level": 0, Purchased: -10,   },
    808: {Row:-1,    "Level": 0, Purchased: -10,   },
    809: {Row:-1,    "Level": 0, Purchased: -10,   },
    810: {Row:-1,    "Level": 0, Purchased: -10,   },
    811: {Row:-1,    "Level": 0, Purchased: -10,   },
    812: {Row:-1,    "Level": 0, Purchased: -10,   },
};

let upgradeInfo = {
    0: {
        Name: "Nahida",
        Lore: "I've always dreamed of going out and seeing things for myself. Can you be my guide? I want to experience all your future tales first-hand.",
        Type: "Catalyst",
        Ele: "Dendro",
        Nation: "Sumeru"
    },
    1: {
        Name: "Traveller",
        Lore: "'A traveler from another world who had their only kin taken away, forcing them to embark on a journey to find The Seven.'",
        Type: "Sword",
        Ele: "Any",
        Nation: "Any"
    },
    2: {
        Name: "Collei",
        Lore: "It's quite normal to be out until midday on the longer patrol routes. I brought a few extra Pita Pockets — would you like one?",
        Type: "Bow",
        Ele: "Dendro",
        Nation: "Sumeru"
    },
    3: {
        Name: "Tighnari",
        Lore: "If you press a leaf between dry sheets of paper, you can make an attractive and handy bookmark.",
        Type: "Bow",
        Ele: "Dendro",
        Nation: "Sumeru"
    },
    4: {
        Name: "Dori",
        Lore: "You'd like to see a Sumpter Beast? No problem! I've got more than you could ever dream of! I'd be happy to let you see them, for a fee... hehe.",
        Type: "Claymore",
        Ele: "Electro",
        Nation: "Sumeru"
    },
    5: {
        Name: "Candace",
        Lore: "If ever you tire of your journey, know that here, you can always find rest in. Aaru Village welcomes you with open arms... as do I.",
        Type: "Polearm",
        Ele: "Hydro",
        Nation: "Sumeru"
    },
    6: {
        Name: "Cyno",
        Lore: "I just thought of a new joke. 'Good morning. Have a Candied Ajilenakh Nut, and I'll ca-shew later.'",
        Type: "Polearm",
        Ele: "Electro",
        Nation: "Sumeru"
    },
    7: {
        Name: "Nilou",
        Lore: "Remember, let out all your frustrations before bedtime for a better night's rest. If you want, I'm more than happy to be your audience.",
        Type: "Sword",
        Ele: "Hydro",
        Nation: "Sumeru"
    },
    8: {
        Name: "Layla",
        Lore: "Mm, this sun's making me so... yawn sleepy... Mkay, lemme grab a pillow and rest my eyes before this wears off... It's been two, two days since I last, last... Zzz...",
        Type: "Sword",
        Ele: "Cryo",
        Nation: "Sumeru"
    },
    9: {
        Name: "Faruzan",
        Lore: "Youngster, there's nothing quite like an enthusiastic greeting to start your morning! Try to remember now: What are you supposed to say?",
        Type: "Bow",
        Ele: "Anemo",
        Nation: "Sumeru"
    },
    10: {
        Name: "Alhaitham",
        Lore: "Rather than lacing my words with rhetoric, I prefer speaking factually...Curses, there's sand in my shoes.",
        Type: "Sword",
        Ele: "Dendro",
        Nation: "Sumeru"
    },
    50: {
        Name: "Amber",
        Lore: "Outrider Amber reporting for duty! Just say the word if you ever need my help!",
        Type: "Bow",
        Ele: "Pyro",
        Nation: "Sumeru"
    },
    51: {
        Name: "Noelle",
        Lore: "A maid, to me, is the most liberating job there is. I'm a chef, a gardener, a warrior, a guide... I can be anything you need me to be!",
        Type: "Claymore",
        Ele: "Geo",
        Nation: "Sumeru"
    },
    52: {
        Name: "Barbara",
        Lore: "Tada! Barbara is here~ Leave the healing to me! As long as I can help you on your journey, I'm happy~",
        Type: "Catalyst",
        Ele: "Hydro",
        Nation: "Mondstadt"
    },
    53: {
        Name: "Diluc",
        Lore: "You should really bring the Knights of Favonius with you next time.",
        Type: "Claymore",
        Ele: "Pyro",
        Nation: "Mondstadt"
    },
    54: {
        Name: "Lisa",
        Lore: "Hey darling, would you like to try one of my magic potions? There's no knowing what it will do to you until you try it, though... Don't say I didn't warn you!",
        Type: "Catalyst",
        Ele: "Electro",
        Nation: "Mondstadt"
    },
    55: {
        Name: "Kaeya",
        Lore: "Please, allow me to join you on your journey. Guarding you on your journey sounds far more entertaining than any of the usual Favonius stuff.",
        Type: "Sword",
        Ele: "Cryo",
        Nation: "Mondstadt"
    },
    56: {
        Name: "Diona",
        Lore: "What's that!? Let me see! Maybe I can add it to my next cocktail to give it a dreadful taste... Huh? It's just a strange-looking mushroom, how boring...",
        Type: "Bow",
        Ele: "Cryo",
        Nation: "Mondstadt"
    },
    57: {
        Name: "Bennett",
        Lore: "No one's joined me on an adventure in ages. C'mon, let's go find some treasure!",
        Type: "Sword",
        Ele: "Pyro",
        Nation: "Sumeru"
    },
    58: {
        Name: "Sucrose",
        Lore: "Th-The sun is already out? Oh, ah, okay! Just one last experiment, and then we can get some rest. Last one, I promise...",
        Type: "Catalyst",
        Ele: "Anemo",
        Nation: "Mondstadt"
    },
    59: {
        Name: "Fischl",
        Lore: "Remember thou this, that I, Fischl, am the Prinzessin der Verurteilung, Sovereign of Immernachtreich, omniscient and eminent judge of all the world's iniquity!",
        Type: "Bow",
        Ele: "Electro",
        Nation: "Mondstadt"
    },
    60: {
        Name: "Mona",
        Lore: "Astrologers believe that the patterns of the stars map out the destiny of Vision bearers — past, present, and future, everything is written in the stars.",
        Type: "Catalyst",
        Ele: "Hydro",
        Nation: "Mondstadt"
    },
    61: {
        Name: "Klee",
        Lore: "This is my new and improved bomb! Whaddya think? Great huh? ...Oh, but ahh... If you find it near any fires, it's not mine. Definitely. Not. Mine.",
        Type: "Catalyst",
        Ele: "Pyro",
        Nation: "Mondstadt"
    },
    62: {
        Name: "Razor",
        Lore: "I like the stars at night. So many stars. In the sky, in the lake. And in the city.",
        Type: "Claymore",
        Ele: "Electro",
        Nation: "Mondstadt"
    },
    63: {
        Name: "Rosaria",
        Lore: "Listen, if you've got a problem you can't handle, then I'm the one for the job. But if you're looking for prayer, you'd better find some other Sister.",
        Type: "Polearm",
        Ele: "Cryo",
        Nation: "Mondstadt"
    },
    64: {
        Name: "Venti",
        Lore: "My tummy is rumbling, but I can't get caught pilfering food again... Oh, it's you! Where are you heading? May I join?",
        Type: "Bow",
        Ele: "Anemo",
        Nation: "Mondstadt"
    },
    101: {
        Name: "Xiangling",
        Lore: "I'm much better at cooking than navigating... but if you do go out, definitely take me with you!",
        Type: "Polearm",
        Ele: "Pyro",
        Nation: "Liyue"
    },
    102: {
        Name: "Xingqiu",
        Lore: "I always have to put on an act around other people, because they see me only as the second son of the Feiyun Commerce Guild. It's a relief that I can just be myself around you.",
        Type: "Sword",
        Ele: "Hydro",
        Nation: "Liyue"
    },
    103: {
        Name: "Chongyun",
        Lore: "'Heart be pure, evil be erased. Mind be purged, world be...' Um... Ugh, I always forget that last part.",
        Type: "Claymore",
        Ele: "Cryo",
        Nation: "Liyue"
    },
    104: {
        Name: "Hu Tao",
        Lore: "Need a hand, need a hand? I'm here! If you need some assistance, I'm here to give it my all to the very end!",
        Type: "Polearm",
        Ele: "Pyro",
        Nation: "Liyue"
    },
    105: {
        Name: "Xinyan",
        Lore: "I'd sure love to add some extra flavor to my rock 'n' roll. Wanna get on the drums next time? Give it a go, I just know you'll be great!",
        Type: "Claymore",
        Ele: "Pyro",
        Nation: "Liyue"
    },
    106: {
        Name: "Yun Jin",
        Lore: "As the saying goes, you never truly know someone until you meet them in person, and at long last, I finally have the great honor of meeting you today.",
        Type: "Polearm",
        Ele: "Geo",
        Nation: "Liyue"
    },
    107: {
        Name: "Beidou",
        Lore: "You've heard of my ship, The Crux, and its crew? If you too love adventure, then join me. I've got your back.",
        Type: "Claymore",
        Ele: "Electro",
        Nation: "Liyue"
    },
    108: {
        Name: "Ningguang",
        Lore: "I suppose you've heard enough rumors about me. What kind of person am I? I shall leave that for you to decide... Of course, your judgement will become a part of the rumor.",
        Type: "Catalyst",
        Ele: "Geo",
        Nation: "Liyue"
    },
    109: {
        Name: "Ganyu",
        Lore: "Should we really be off work this early? There is still a lot left to do...",
        Type: "Bow",
        Ele: "Cryo",
        Nation: "Liyue"
    },
    110: {
        Name: "Keqing",
        Lore: "If you feel strongly about something, you should speak up and take action. That's the philosophy I live by.",
        Type: "Sword",
        Ele: "Electro",
        Nation: "Liyue"
    },
    111: {
        Name: "Yanfei",
        Lore: "Next time, be sure to make a proper appointment. I charge 710,000 Mora per case — final quote and commission rate depending on the details of your case. Not a bad deal, right?",
        Type: "Catalyst",
        Ele:  "Pyro",
        Nation: "Liyue"
    },
    112: {
        Name: "Yaoyao",
        Lore: "It's a pleasure to make your acquaintance! If you encounter any difficulties outdoors, then lemme help you! Oh, by the way, I brought some Fried Radish Balls with me, help yourself!",
        Type: "Polearm",
        Ele: "Dendro",
        Nation: "Liyue"
    },
    113: {
        Name: "Zhongli",
        Lore: "A new contract? Okay. I'm still on leave, but I can accompany you for a while.",
        Type: "Polearm",
        Ele: "Geo",
        Nation: "Liyue"
    },
    150: {
        Name: "Thoma",
        Lore: "Anything I can lend a hand with, just say the word. A conversation? I see, I see. That's a little different from what I'm used to, but I'm all for it.",
        Type: "Polearm",
        Ele: "Pyro",
        Nation: "Inazuma"
    },
    151: {
        Name: "Ayaka",
        Lore: "'Was it one's thoughts that drew him to my dreams? Had I known it a dream, one would not have awakened.' Hehe, I love that poem.",
        Type: "Sword",
        Ele: "Cryo",
        Nation: "Inazuma"
    },
    152: {
        Name: "Yoimiya",
        Lore: "Well, who do we have here? Welcome, welcome, you're just in time for the fireworks show.",
        Type: "Bow",
        Ele: "Pyro",
        Nation: "Inazuma"
    },
    153: {
        Name: "Sayu",
        Lore: "Hey, will you do me a favor and let me know if you see the shrine maiden coming? I'm just gonna, um... rest my eyes for a moment.",
        Type: "Claymore",
        Ele: "Anemo",
        Nation: "Inazuma"
    },
    154: {
        Name: "Gorou",
        Lore: "It'd be nice to just lie in the sun... Ahem, but I must set an example for the others.",
        Type: "Bow",
        Ele: "Geo",
        Nation: "Inazuma"
    },
    155: {
        Name: "Kokomi",
        Lore: "My journey with you will be an opportunity to unwind... I mean, to survey beyond our borders.",
        Type: "Catalyst",
        Ele: "Hydro",
        Nation: "Inazuma"
    },
    156: {
        Name: "Heizou",
        Lore: "Seems to me like these commissions of yours are an endless gold mine of cases, and you'll never be able to finish them all. So maybe you could throw one my way every once in a while?",
        Type: "Catalyst",
        Ele: "Anemo",
        Nation: "Inazuma"
    },
    157: {
        Name: "Shinobu",
        Lore: "Just let me know if you ever find yourself in a pinch. I can help you out. If the Arataki Gang stirs up any trouble, I'll drag every last one of them back to apologize.",
        Type: "Sword",
        Ele: "Electro",
        Nation: "Inazuma"
    },
    158: {
        Name: "Itto",
        Lore: "The first and greatest head of the Arataki Gang, Arataki 'Numero Uno' Itto, here in the flesh! Hahaha... *cough*",
        Type: "Claymore",
        Ele: "Geo",
        Nation: "Inazuma"
    },
    159: {
        Name: "Sara",
        Lore: "I may be uncompromising on matters of great importance, but on most other things, you will find me quite easygoing.",
        Type: "Bow",
        Ele: "Electro",
        Nation: "Inazuma"
    },
    160: {
        Name: "Ei",
        Lore: "Do you wish to know the truth about the shooting stars at night? Haha, they are but fleeting moments of luminosity.",
        Type: "Polearm",
        Ele: "Electro",
        Nation: "Inazuma"
    },
    // RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS
    800: {
        Name: "Wanderer",
        Lore: "You want to use my hat as an umbrella? Hmph, the audacity to even make that request...",
        Type: "Catalyst",
        Ele: "Anemo",
        Nation: "Sumeru"
    },
    801: {
        Name: "Albedo",
        Lore: "Going out into the world and investigating, turning the 'unknown' into the 'known.' ...Ahhh, I missed this feeling.",
        Type: "Sword",
        Ele: "Geo",
        Nation: "Mondstadt"
    },
    802: {
        Name: "Qiqi",
        Lore: "Some people want to take advantage of me. Others are terrified of me. But you... You are not like any of those people.",
        Type: "Sword",
        Ele: "Cryo",
        Nation: "Liyue"
    },
    803: {
        Name: "Yelan",
        Lore: "Call me Yelan. I think you may need my help, and I just so happen to be interested in some information you have. In other words — you scratch my back, I'll scratch yours.",
        Type: "Bow",
        Ele: "Hydro",
        Nation: "Liyue"
    },
    804: {
        Name: "Shenhe",
        Lore: "I rarely leave the mountains, so I was never taught proper manners. If you don't approve of my methods, please do let me know.",
        Type: "Polearm",
        Ele: "Cryo",
        Nation: "Liyue"
    },
    805: {
        Name: "Ayato",
        Lore: "I'm no stickler for doing things in a certain way. Whatever method you use, the important thing is that it delivers acceptable results",
        Type: "Sword",
        Ele: "Hydro",
        Nation: "Inazuma"
    },
    806: {
        Name: "Yae Miko",
        Lore: "Traveling to other worlds is all that anyone seems be writing about these days. Huh, goodness knows what they find so disappointing about their own world.",
        Type: "Catalyst",
        Ele: "Electro",
        Nation: "Inazuma"
    },
    807: {
        Name: "Eula",
        Lore: "You want to learn some Favonius Bladework? Heh, alright then, I'll teach you.... Oh yes, I'll teach you, alright, mark my words...",
        Type: "Claymore",
        Ele: "Cryo",
        Nation: "Mondstadt"
    },
    808: {
        Name: "Kazuha",
        Lore: "You'd like to know more about me, you say? Well, as you see, I am but a wandering samurai that you could have run into just about anywhere.",
        Type: "Sword",
        Ele: "Anemo",
        Nation: "Inazuma"
    },
    809: {
        Name: "Xiao",
        Lore: "I'm willing to protect you. But don't think about getting close, and stay out of my way, or all that awaits you is regret.",
        Type: "Polearm",
        Ele: "Anemo",
        Nation: "Liyue"
    },
    810: {
        Name: "Tartaglia",
        Lore: "Ah, I'm sure the Harbingers must know of my dealings with you by now. Oh, I'd love to see the look on their faces... Hahaha...",
        Type: "Bow",
        Ele: "Hydro",
        Nation: "Liyue"
    },
    811: {
        Name: "Jean",
        Lore: "'Dandelion, Dandelion, ride the wind to a faraway land.' Who knows, the wind might take it all the way to Celestia.",
        Type: "Sword",
        Ele: "Anemo",
        Nation: "Mondstadt"
    },
    812: {
        Name: "Dehya",
        Lore: "My favourite food? Candied Ajilenakh Nuts, no contest. Easy to take on the road, and of course delicious.",
        Type: "Claymore",
        Ele: "Pyro",
        Nation: "Sumeru"
    },
};

// RMB TO UPDATE MAX CONSTANTS
let InventoryDefault = {
// 6 STAR WEAPON
    1001: {File:"amosBow",                 Name:"Amos' Bow",                         Lore:"An unstoppable weapon that increases power of [s]Bow[/s] characters by at least [s]360%[/s].  \n \n (Only characters currently purchased count.)",      Star:6,  Type:"Bow"      ,       },
    1002: {File:"aquaSimulacra",           Name:"Aqua Simulacra",                    Lore:"An unstoppable weapon that increases power of [s]Bow[/s] characters by at least [s]360%[/s].  \n \n (Only characters currently purchased count.)",      Star:6,  Type:"Bow"      ,        },
    1003: {File:"aquilaFavonia",           Name:"Aquila Favonia",                    Lore:"An unstoppable weapon that increases power of [s]Sword[/s] characters by at least [s]360%[/s].  \n \n (Only characters currently purchased count.)",      Star:6,  Type:"Sword"    ,           },
    1004: {File:"brokenPines",             Name:"Song of Broken Pines",              Lore:"An unstoppable weapon that increases power of [s]Claymore[/s] characters by at least [s]360%[/s].  \n \n (Only characters currently purchased count.)",      Star:6,  Type:"Claymore" ,             },
    1005: {File:"calamityQueller",         Name:"Calamity Queller",                  Lore:"An unstoppable weapon that increases power of [s]Polearm[/s] characters by at least [s]360%[/s].  \n \n (Only characters currently purchased count.)",      Star:6,  Type:"Polearm"  ,            },
    1006: {File:"elergy",                  Name:"Elegy For the End",                 Lore:"An unstoppable weapon that increases power of [s]Bow[/s] characters by at least [s]360%[/s].  \n \n (Only characters currently purchased count.)",      Star:6,  Type:"Bow"      ,        },
    1007: {File:"engulfing",               Name:"Engulfing Lightning",               Lore:"An unstoppable weapon that increases power of [s]Polearm[/s] characters by at least [s]360%[/s].  \n \n (Only characters currently purchased count.)",      Star:6,  Type:"Polearm"  ,             },
    1008: {File:"floatingDreams",          Name:"A Thousand Floating Dreams",        Lore:"An unstoppable weapon that increases power of [s]Catalyst[/s] characters by at least [s]360%[/s].  \n \n (Only characters currently purchased count.)",      Star:6,  Type:"Catalyst" ,           },
    1009: {File:"freedomSworn",            Name:"Freedom-Sworn",                     Lore:"An unstoppable weapon that increases power of [s]Sword[/s] characters by at least [s]360%[/s].  \n \n (Only characters currently purchased count.)",      Star:6,  Type:"Sword"    ,        },
    1010: {File:"haranGeppaku",            Name:"Haran Geppaku Futsu",               Lore:"An unstoppable weapon that increases power of [s]Sword[/s] characters by at least [s]360%[/s].  \n \n (Only characters currently purchased count.)",      Star:6,  Type:"Sword"    ,       },
    1011: {File:"homa",                    Name:"Staff of Homa",                     Lore:"An unstoppable weapon that increases power of [s]Polearm[/s] characters by at least [s]360%[/s].  \n \n (Only characters currently purchased count.)",      Star:6,  Type:"Polearm"  ,            },
    1012: {File:"jadeSpear",               Name:"Primordial Jade Winged-Spear",      Lore:"An unstoppable weapon that increases power of [s]Polearm[/s] characters by at least [s]360%[/s].  \n \n (Only characters currently purchased count.)",      Star:6,  Type:"Polearm"  ,         },
    1013: {File:"kaguraVerity",            Name:"Kagura's Verity",                   Lore:"An unstoppable weapon that increases power of [s]Catalyst[/s] characters by at least [s]360%[/s].  \n \n (Only characters currently purchased count.)",      Star:6,  Type:"Catalyst" ,           },
    1014: {File:"polarStar",               Name:"Polar Star",                        Lore:"An unstoppable weapon that increases power of [s]Bow[/s] characters by at least [s]360%[/s].  \n \n (Only characters currently purchased count.)",      Star:6,  Type:"Bow"      ,     },
    1015: {File:"tulaytullah",             Name:"Tulaytullah's Remembrance",         Lore:"An unstoppable weapon that increases power of [s]Catalyst[/s] characters by at least [s]360%[/s].  \n \n (Only characters currently purchased count.)",      Star:6,  Type:"Catalyst" ,         },
    1016: {File:"vortexVanquisher",        Name:"Vortex Vanquisher",                 Lore:"An unstoppable weapon that increases power of [s]Polearm[/s] characters by at least [s]360%[/s].  \n \n (Only characters currently purchased count.)",      Star:6,  Type:"Polearm"  ,        },
    1017: {File:"redhorn",                 Name:"Redhorn Stonethresher",             Lore:"An unstoppable weapon that increases power of [s]Claymore[/s] characters by at least [s]360%[/s].  \n \n (Only characters currently purchased count.)",      Star:6,  Type:"Claymore" ,         },
    1018: {File:"wolfgs",                  Name:"Wolf's Gravestone",                 Lore:"An unstoppable weapon that increases power of [s]Claymore[/s] characters by at least [s]360%[/s].  \n \n (Only characters currently purchased count.)",      Star:6,  Type:"Claymore" ,         },
// 5 STAR
    1101: {File:"skywardBlade",            Name:"Skyward Blade",                     Lore:"A devastating weapon that increases power of [s]Sword[/s] characters by at least [s]170%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,  Type:"Sword"                                                },
    1102: {File:"skywardAtlas",            Name:"Skyward Atlas",                     Lore:"A devastating weapon that increases power of [s]Catalyst[/s] characters by at least [s]170%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,  Type:"Catalyst"                                             },
    1103: {File:"summitShaper",            Name:"Summit Shaper",                     Lore:"A devastating weapon that increases power of [s]Sword[/s] characters by at least [s]170%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,  Type:"Sword"                                                },
    1104: {File:"primordialJadeCutter",    Name:"Primordial Jade Cutter",            Lore:"A devastating weapon that increases power of [s]Sword[/s] characters by at least [s]170%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,  Type:"Sword"                                                },
    1105: {File:"toukabouShigureAsc",      Name:"Toukabou Shigure (Ascended)",       Lore:"A devastating weapon that increases power of [s]Sword[/s] characters by at least [s]170%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,  Type:"Sword"                                                },
    1106: {File:"skywardPride",            Name:"Skyward Pride",                     Lore:"A devastating weapon that increases power of [s]Claymore[/s] characters by at least [s]170%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,  Type:"Claymore"                                                },
    1107: {File:"theUnforged",             Name:"The Unforged",                      Lore:"A devastating weapon that increases power of [s]Claymore[/s] characters by at least [s]170%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,  Type:"Claymore"                                                },
    1108: {File:"seaLordAsc",              Name:"Luxurious Sea-Lord (Ascended)",     Lore:"A devastating weapon that increases power of [s]Claymore[/s] characters by at least [s]170%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,  Type:"Claymore"                                                },
    1109: {File:"skywardSpine",            Name:"Skyward Spine",                     Lore:"A devastating weapon that increases power of [s]Polearm[/s] characters by at least [s]170%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,  Type:"Polearm"                                                },
    1110: {File:"theCatchAsc",             Name:"'The Catch' (Ascended)",            Lore:"A devastating weapon that increases power of [s]Polearm[/s] characters by at least [s]170%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,  Type:"Polearm"                                                },
    1111: {File:"hunterPath",              Name:"Hunter's Path",                     Lore:"A devastating weapon that increases power of [s]Bow[/s] characters by at least [s]170%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,  Type:"Bow"                                                },
    1112: {File:"skywardHarp",             Name:"Skyward Harp",                      Lore:"A devastating weapon that increases power of [s]Bow[/s] characters by at least [s]170%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,  Type:"Bow"                                                },
    1113: {File:"thunderingPulse",         Name:"Thundering Pulse",                  Lore:"A devastating weapon that increases power of [s]Bow[/s] characters by at least [s]170%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,  Type:"Bow"                                                },
    1114: {File:"lostPrayer",              Name:"Lost Prayer to the Sacred Winds",   Lore:"A devastating weapon that increases power of [s]Catalyst[/s] characters by at least [s]170%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,  Type:"Catalyst"                                                },
    1115: {File:"dodocoTalesAsc",          Name:"Dodoco Tales (Ascended)",           Lore:"A devastating weapon that increases power of [s]Catalyst[/s] characters by at least [s]170%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,  Type:"Catalyst"                                                },
    1116: {File:"memoryDust",              Name:"Memory of Dust",                    Lore:"A devastating weapon that increases power of [s]Catalyst[/s] characters by at least [s]170%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,  Type:"Catalyst"                                                },
// 4 STAR                                          
    1201: {File:"mappa",                   Name:"Mappa Mare",                        Lore:"A mighty weapon that increases power of [s]Catalyst[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Catalyst"                                              },
    1202: {File:"rust",                    Name:"Rust",                              Lore:"A mighty weapon that increases power of [s]Bow[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Bow"                                                   },
    1203: {File:"sacSword",                Name:"Sacrificial Sword",                 Lore:"A mighty weapon that increases power of [s]Sword[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Sword"                                                 },
    1204: {File:"lionsRoar",               Name:"Lion's Roar",                       Lore:"A mighty weapon that increases power of [s]Sword[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Sword"                                                },
    1205: {File:"amenomaKageuchi",         Name:"Amenoma Kageuchi",                  Lore:"A mighty weapon that increases power of [s]Sword[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Sword"                                                },
    1206: {File:"cinnabarSpindle",         Name:"Cinnabar Spindle",                  Lore:"A mighty weapon that increases power of [s]Sword[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Sword"                                                },
    1207: {File:"favoniusSword",           Name:"Favonius Sword",                    Lore:"A mighty weapon that increases power of [s]Sword[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Sword"                                                },
    1208: {File:"prototypeArchaic",        Name:"Prototype Archaic",                 Lore:"A mighty weapon that increases power of [s]Claymore[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Claymore"                                                },
    1209: {File:"lithicBlade",             Name:"Lithic Blade",                      Lore:"A mighty weapon that increases power of [s]Claymore[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Claymore"                                                },
    1210: {File:"blackcliffSlasher",       Name:"Blackcliff Slasher",                Lore:"A mighty weapon that increases power of [s]Claymore[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Claymore"                                                },
    1211: {File:"royalGreatsword",         Name:"Royal Greatsword",                  Lore:"A mighty weapon that increases power of [s]Claymore[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Claymore"                                                },
    1212: {File:"dragonBane",              Name:"Dragon's Bane",                     Lore:"A mighty weapon that increases power of [s]Polearm[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Polearm"                                                },
    1213: {File:"favoniusLance",           Name:"Favonius Lance",                    Lore:"A mighty weapon that increases power of [s]Polearm[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Polearm"                                                },
    1214: {File:"prototypeStarglitter",    Name:"Prototype Starglitter",             Lore:"A mighty weapon that increases power of [s]Polearm[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Polearm"                                                },
    1215: {File:"wavebreakerFin",          Name:"Wavebreaker's Fin",                 Lore:"A mighty weapon that increases power of [s]Polearm[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Polearm"                                                },
    1216: {File:"Stringless",              Name:"The Stringless",                    Lore:"A mighty weapon that increases power of [s]Bow[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Bow"                                                },
    1217: {File:"endLine",                 Name:"End of the Line",                   Lore:"A mighty weapon that increases power of [s]Bow[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Bow"                                                },
    1218: {File:"fadingTwilight",          Name:"Fading Twilight",                   Lore:"A mighty weapon that increases power of [s]Bow[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Bow"                                                },
    1219: {File:"sacrificialFragments",    Name:"Sacrificial Fragments",             Lore:"A mighty weapon that increases power of [s]Catalyst[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Catalyst"                                                },
    1220: {File:"Widsith",                 Name:"The Widsith",                       Lore:"A mighty weapon that increases power of [s]Catalyst[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Catalyst"                                                },
    1221: {File:"oathswornEye",            Name:"Oathsworn Eye",                     Lore:"A mighty weapon that increases power of [s]Catalyst[/s] characters by at least [s]110%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,  Type:"Catalyst"                                                },
// 3 STAR
    1301: {File:"ferrous",                 Name:"Ferrous Shadow",                    Lore:"A strong weapon that increases power of [s]Claymore[/s] characters by at least [s]70%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,  Type:"Claymore"                                             },
    1302: {File:"coolSteel",               Name:"Cool Steel",                        Lore:"A strong weapon that increases power of [s]Sword[/s] characters by at least [s]70%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,  Type:"Sword"                                                 },
    1303: {File:"harbingerDawn",           Name:"Harbinger of Dawn",                 Lore:"A strong weapon that increases power of [s]Sword[/s] characters by at least [s]70%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,  Type:"Sword"                                                },
    1304: {File:"travelerHandySword",      Name:"Traveler's Handy Sword",            Lore:"A strong weapon that increases power of [s]Sword[/s] characters by at least [s]70%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,  Type:"Sword"                                                 },
    1305: {File:"blackTassel",             Name:"Black Tassel",                      Lore:"A strong weapon that increases power of [s]Polearm[/s] characters by at least [s]70%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,  Type:"Polearm"                                                 },
    1306: {File:"halberd",                 Name:"Halberd",                           Lore:"A strong weapon that increases power of [s]Polearm[/s] characters by at least [s]70%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,  Type:"Polearm"                                                 },
    1307: {File:"whiteTassel",             Name:"White Tassel",                      Lore:"A strong weapon that increases power of [s]Polearm[/s] characters by at least [s]70%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,  Type:"Polearm"                                                },
    1308: {File:"emeraldOrb",              Name:"Emerald Orb",                       Lore:"A strong weapon that increases power of [s]Catalyst[/s] characters by at least [s]70%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,  Type:"Catalyst"                                                },
    1309: {File:"magicGuide",              Name:"Magic Guide",                       Lore:"A strong weapon that increases power of [s]Catalyst[/s] characters by at least [s]70%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,  Type:"Catalyst"                                                },
    1310: {File:"otherworldlyStory",       Name:"Otherworldly Story",                Lore:"A strong weapon that increases power of [s]Catalyst[/s] characters by at least [s]70%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,  Type:"Catalyst"                                                },
    1311: {File:"taleDragonSlayers",       Name:"Thrilling Tales of Dragon Slayers", Lore:"A strong weapon that increases power of [s]Catalyst[/s] characters by at least [s]70%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,  Type:"Catalyst"                                                },
    1312: {File:"messenger",               Name:"Messenger",                         Lore:"A strong weapon that increases power of [s]Bow[/s] characters by at least [s]70%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,  Type:"Bow"                                                },
    1313: {File:"ravenBow",                Name:"Raven Bow",                         Lore:"A strong weapon that increases power of [s]Bow[/s] characters by at least [s]70%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,  Type:"Bow"                                                },
    1314: {File:"recurveBow",              Name:"Recurve Bow",                       Lore:"A strong weapon that increases power of [s]Bow[/s] characters by at least [s]70%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,  Type:"Bow"                                                },
    1315: {File:"sharpshooterOath",        Name:"Sharpshooter's Oath",               Lore:"A strong weapon that increases power of [s]Bow[/s] characters by at least [s]70%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,  Type:"Bow"                                                },
    1316: {File:"debateClub",              Name:"Debate Club",                       Lore:"A strong weapon that increases power of [s]Claymore[/s] characters by at least [s]70%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,  Type:"Claymore"                                                },
    1317: {File:"skyriderGreatsword",      Name:"Skyrider Greatsword",               Lore:"A strong weapon that increases power of [s]Claymore[/s] characters by at least [s]70%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,  Type:"Claymore"                                                },
    1318: {File:"ironGreatsword",          Name:"White Iron Greatsword",             Lore:"A strong weapon that increases power of [s]Claymore[/s] characters by at least [s]70%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,  Type:"Claymore"                                                },
// 2 STAR
    1351: {File:"silverSword",             Name:"Silver Sword",                      Lore:"A serviceable weapon that increases power of [s]Sword[/s] characters by at least [s]30%[/s].     \n\n (Only characters currently purchased count.)",        Star:2,  Type:"Sword"                                                 },
    1352: {File:"apprenticeNotesAsc",      Name:"Apprentice's Notes (Ascended)",     Lore:"A serviceable weapon that increases power of [s]Catalyst[/s] characters by at least [s]30%[/s].  \n\n (Only characters currently purchased count.)",        Star:2,  Type:"Catalyst"                                                },
    1353: {File:"beginnerProtectorAsc",    Name:"Beginner's Protector (Ascended)",   Lore:"A serviceable weapon that increases power of [s]Polearm[/s] characters by at least [s]30%[/s].   \n\n (Only characters currently purchased count.)",        Star:2,  Type:"Polearm"                                                },
    1354: {File:"dullBladeAsc",            Name:"Dull Sword (Ascended)",             Lore:"A serviceable weapon that increases power of [s]Sword[/s] characters by at least [s]30%[/s].     \n\n (Only characters currently purchased count.)",        Star:2,  Type:"Sword"                                                },
    1355: {File:"hunterBowAsc",            Name:"Hunter's Bow (Ascended)",           Lore:"A serviceable weapon that increases power of [s]Bow[/s] characters by at least [s]30%[/s].       \n\n (Only characters currently purchased count.)",        Star:2,  Type:"Bow"                                                },
    1356: {File:"wasterGreatswordAsc",     Name:"Waster Greatsword (Ascended)",      Lore:"A serviceable weapon that increases power of [s]Claymore[/s] characters by at least [s]30%[/s].  \n\n (Only characters currently purchased count.)",        Star:2,  Type:"Claymore"                                                },
    1357: {File:"ironPoint",               Name:"Iron Point",                        Lore:"A serviceable weapon that increases power of [s]Polearm[/s] characters by at least [s]30%[/s].   \n\n (Only characters currently purchased count.)",        Star:2,  Type:"Polearm"                                                },
    1358: {File:"oldMerc",                 Name:"Old Merc's Pal",                    Lore:"A serviceable weapon that increases power of [s]Claymore[/s] characters by at least [s]30%[/s].  \n\n (Only characters currently purchased count.)",        Star:2,  Type:"Claymore"                                                },
    1359: {File:"pocketGrimoire",          Name:"Pocket Grimoire",                   Lore:"A serviceable weapon that increases power of [s]Catalyst[/s] characters by at least [s]30%[/s].  \n\n (Only characters currently purchased count.)",        Star:2,  Type:"Catalyst"                                                },
    1360: {File:"seasonedHunter",          Name:"Seasoned Hunter's Bow",             Lore:"A serviceable weapon that increases power of [s]Bow[/s] characters by at least [s]30%[/s].       \n\n (Only characters currently purchased count.)",        Star:2,  Type:"Bow"                                                },
// 1 STAR
    1401: {File:"dullSword",               Name:"Dull Sword",                        Lore:"A weak weapon that increases power of [s]Sword[/s] characters by at least [s]10%[/s].    \n\n (Only characters currently purchased count.)",        Star:1,  Type:"Sword"                                                },
    1402: {File:"apprenticeNotes",         Name:"Apprentice's Notes",                Lore:"A weak weapon that increases power of [s]Catalyst[/s] characters by at least [s]10%[/s]. \n\n (Only characters currently purchased count.)",        Star:1,  Type:"Catalyst"                                                },
    1403: {File:"beginnerProtector",       Name:"Beginner's Protector",              Lore:"A weak weapon that increases power of [s]Polearm[/s] characters by at least [s]10%[/s].  \n\n (Only characters currently purchased count.)",        Star:1,  Type:"Polearm"                                                },
    1404: {File:"hunterBow",               Name:"Hunter's Bow",                      Lore:"A weak weapon that increases power of [s]Bow[/s] characters by at least [s]10%[/s].      \n\n (Only characters currently purchased count.)",        Star:1,  Type:"Bow"                                                },
    1405: {File:"wasterGreatsword",        Name:"Waster Greatsword",                 Lore:"A weak weapon that increases power of [s]Claymore[/s] characters by at least [s]10%[/s]. \n\n (Only characters currently purchased count.)",        Star:1,  Type:"Claymore"                                                },

//  ARTIFACTS
    2001: {File:"deepwoodGoblet",              Name:"Lamp of the Lost",                  Lore:"An extraordinary jewellery that increases power of [s]all[/s] characters by at least [s]85%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,      Type:"Artifact"                                                            },
    2002: {File:"crimFeather",                 Name:"Witch's Ever-Burning Plume",        Lore:"An extraordinary jewellery that increases power of [s]all[/s] characters by at least [s]85%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,      Type:"Artifact"                                                            },
    2003: {File:"aMomentCongealed",            Name:"A Moment Congealed",                Lore:"An extraordinary jewellery that increases power of [s]all[/s] characters by at least [s]85%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,      Type:"Artifact"                                                            },
    2004: {File:"capriciousVisage",            Name:"Capricious Visage",                 Lore:"An extraordinary jewellery that increases power of [s]all[/s] characters by at least [s]85%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,      Type:"Artifact"                                                            },
    2005: {File:"frozenHomelandsDemise",       Name:"Frozen Homeland's Demise",          Lore:"An extraordinary jewellery that increases power of [s]all[/s] characters by at least [s]85%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,      Type:"Artifact"                                                            },
    2006: {File:"gildedCorsage",               Name:"Gilded Corsage",                    Lore:"An extraordinary jewellery that increases power of [s]all[/s] characters by at least [s]85%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,      Type:"Artifact"                                                            },
    2007: {File:"magnificentTsuba",            Name:"Magnificent Tsuba",                 Lore:"An extraordinary jewellery that increases power of [s]all[/s] characters by at least [s]85%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,      Type:"Artifact"                                                            },
    2008: {File:"mockingMask",                 Name:"Mocking Mask",                      Lore:"An extraordinary jewellery that increases power of [s]all[/s] characters by at least [s]85%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,      Type:"Artifact"                                                            },
    2009: {File:"plumeofLuxury",               Name:"Plume of Luxury",                   Lore:"An extraordinary jewellery that increases power of [s]all[/s] characters by at least [s]85%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,      Type:"Artifact"                                                            },
    2010: {File:"viridescentVenerersVessel",   Name:"Viridescent Venerer's Vessel",      Lore:"An extraordinary jewellery that increases power of [s]all[/s] characters by at least [s]85%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,      Type:"Artifact"                                                            },

    2031: {File:"gladiatorFlower",             Name:"Gladiator's Nostalgia",             Lore:"A very rare jewellery that increases power of [s]all[/s] characters by at least [s]55%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,      Type:"Artifact"                                                            },
    2032: {File:"bardArrowFeather",            Name:"Bard's Arrow Feather",              Lore:"A very rare jewellery that increases power of [s]all[/s] characters by at least [s]55%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,      Type:"Artifact"                                                            },
    2033: {File:"bloodstainedChevalierGoblet", Name:"Bloodstained Chevalier's Goblet",   Lore:"A very rare jewellery that increases power of [s]all[/s] characters by at least [s]55%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,      Type:"Artifact"                                                            },
    2034: {File:"lavawalkerTorment",           Name:"Lavawalker's Torment",              Lore:"A very rare jewellery that increases power of [s]all[/s] characters by at least [s]55%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,      Type:"Artifact"                                                            },
    2035: {File:"maidenFadingBeauty",          Name:"Maiden's Fading Beauty",            Lore:"A very rare jewellery that increases power of [s]all[/s] characters by at least [s]55%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,      Type:"Artifact"                                                            },
    2036: {File:"maskofSolitudeBasalt",        Name:"Mask of Solitude Basalt",           Lore:"A very rare jewellery that increases power of [s]all[/s] characters by at least [s]55%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,      Type:"Artifact"                                                            },
    2037: {File:"omenofThunderstorm",          Name:"Omen of Thunderstorm",              Lore:"A very rare jewellery that increases power of [s]all[/s] characters by at least [s]55%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,      Type:"Artifact"                                                            },
    2038: {File:"royalPocketWatch",            Name:"Royal Pocket Watch",                Lore:"A very rare jewellery that increases power of [s]all[/s] characters by at least [s]55%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,      Type:"Artifact"                                                            },
    2039: {File:"summerNightBloom",            Name:"Summer Night's Bloom",              Lore:"A very rare jewellery that increases power of [s]all[/s] characters by at least [s]55%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,      Type:"Artifact"                                                            },
    2040: {File:"thundersootherPlume",         Name:"Thundersoother's Plume",            Lore:"A very rare jewellery that increases power of [s]all[/s] characters by at least [s]55%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,      Type:"Artifact"                                                            },

    2051: {File:"scholarCup",              Name:"Scholar's Ink Cup",                     Lore:"A rare jewellery that increases power of [s]all[/s] characters by at least [s]35%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,      Type:"Artifact"                                                           },
    2052: {File:"exileFlower",             Name:"Exile's Flower",                        Lore:"A rare jewellery that increases power of [s]all[/s] characters by at least [s]35%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,      Type:"Artifact"                                                           },
    2053: {File:"instructorCap",           Name:"Instructor's Cap",                      Lore:"A rare jewellery that increases power of [s]all[/s] characters by at least [s]35%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,      Type:"Artifact"                                                           },
    2054: {File:"featherHomecoming",       Name:"Feather of Homecoming",                 Lore:"A rare jewellery that increases power of [s]all[/s] characters by at least [s]35%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,      Type:"Artifact"                                                           },
    2055: {File:"tinyHourglass",           Name:"Tiny Miracle's Hourglass",              Lore:"A rare jewellery that increases power of [s]all[/s] characters by at least [s]35%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,      Type:"Artifact"                                                           },
    2056: {File:"berserkerGoblet",         Name:"Berserker's Bone Goblet",               Lore:"A rare jewellery that increases power of [s]all[/s] characters by at least [s]35%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,      Type:"Artifact"                                                           },
    2057: {File:"guardianBand",            Name:"Guardian's Band",                       Lore:"A rare jewellery that increases power of [s]all[/s] characters by at least [s]35%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,      Type:"Artifact"                                                           },
    2058: {File:"medalBrave",              Name:"Medal of the Brave",                    Lore:"A rare jewellery that increases power of [s]all[/s] characters by at least [s]35%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,      Type:"Artifact"                                                           },
    2059: {File:"martialFeather",          Name:"Martial Artist's Feather Accessory",    Lore:"A rare jewellery that increases power of [s]all[/s] characters by at least [s]35%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,      Type:"Artifact"                                                           },
    2060: {File:"gamblerWatch",            Name:"Gambler's Pocket Watch",                Lore:"A rare jewellery that increases power of [s]all[/s] characters by at least [s]35%[/s]. \n\n (Only characters currently purchased count.)",        Star:3,      Type:"Artifact"                                                           },

    2071: {File:"adventurerBandana",       Name:"Adventurer's Bandana",                  Lore:"An uncommon jewellery that increases power of [s]all[/s] characters by at least [s]15%[/s]. \n\n (Only characters currently purchased count.)",        Star:2,      Type:"Artifact"                                                           },
    2072: {File:"adventurerFeather",       Name:"Adventurer's Tail Feather",             Lore:"An uncommon jewellery that increases power of [s]all[/s] characters by at least [s]15%[/s]. \n\n (Only characters currently purchased count.)",        Star:2,      Type:"Artifact"                                                           },
    2073: {File:"travelingDoctorPot",      Name:"Traveling Doctor's Medicine Pot",       Lore:"An uncommon jewellery that increases power of [s]all[/s] characters by at least [s]15%[/s]. \n\n (Only characters currently purchased count.)",        Star:2,      Type:"Artifact"                                                           },
    2074: {File:"travelingDoctorFeather",  Name:"Traveling Doctor's Owl Feather",        Lore:"An uncommon jewellery that increases power of [s]all[/s] characters by at least [s]15%[/s]. \n\n (Only characters currently purchased count.)",        Star:2,      Type:"Artifact"                                                           },
    2075: {File:"luckyDogHourglass",       Name:"Lucky Dog's Hourglass",                 Lore:"An uncommon jewellery that increases power of [s]all[/s] characters by at least [s]15%[/s]. \n\n (Only characters currently purchased count.)",        Star:2,      Type:"Artifact"                                                           },
    2076: {File:"luckyDogClover",          Name:"Lucky Dog's Clover",                    Lore:"An uncommon jewellery that increases power of [s]all[/s] characters by at least [s]15%[/s]. \n\n (Only characters currently purchased count.)",        Star:2,      Type:"Artifact"                                                           },

    2091: {File:"travelingLotus",          Name:"Traveling Doctor's Silver Lotus",       Lore:"A common jewellery that increases power of [s]all[/s] characters by at least [s]5%[/s]. \n\n (Only characters currently purchased count.)",        Star:1,      Type:"Artifact"                                                          },
    2092: {File:"travelingWatch",          Name:"Traveling Doctor's Pocket Watch",       Lore:"A common jewellery that increases power of [s]all[/s] characters by at least [s]5%[/s]. \n\n (Only characters currently purchased count.)",        Star:1,      Type:"Artifact"                                                          },
    2093: {File:"luckyDogCirclet",         Name:"Lucky Dog's Silver Circlet",            Lore:"A common jewellery that increases power of [s]all[/s] characters by at least [s]5%[/s]. \n\n (Only characters currently purchased count.)",        Star:1,      Type:"Artifact"                                                          },
    2094: {File:"luckyDogFeather",         Name:"Lucky Dog's Eagle Feather",             Lore:"A common jewellery that increases power of [s]all[/s] characters by at least [s]5%[/s]. \n\n (Only characters currently purchased count.)",        Star:1,      Type:"Artifact"                                                          },
    2095: {File:"adventurerWatch",         Name:"Adventurer's Pocket Watch",             Lore:"A common jewellery that increases power of [s]all[/s] characters by at least [s]5%[/s]. \n\n (Only characters currently purchased count.)",        Star:1,      Type:"Artifact"                                                          },
    2096: {File:"adventurerGoblet",        Name:"Adventurer's Golden Goblet",            Lore:"A common jewellery that increases power of [s]all[/s] characters by at least [s]5%[/s]. \n\n (Only characters currently purchased count.)",        Star:1,      Type:"Artifact"                                                          },
    
// RMB TO UPDATE MAX CONSTANTS
    3001: {File:"adeptusTemptation",            Name:"Adeptus Temptation",            Lore:"Gourmet food that temporarily boosts NpS by at least [s]500%[/s].",        Star:5,      Type:"Food"                         },
    3002: {File:"aBuoyantBreeze",               Name:"A Buoyant Breeze",              Lore:"Gourmet food that temporarily boosts NpS by at least [s]500%[/s].",        Star:5,      Type:"Food"                              },
    3003: {File:"halvamazd",                    Name:"Halvamazd",                     Lore:"Gourmet food that temporarily boosts NpS by at least [s]500%[/s].",        Star:5,      Type:"Food"                                          },
    3004: {File:"shimiChazuke",                 Name:"Shimi Chazuke",                 Lore:"Gourmet food that temporarily boosts NpS by at least [s]500%[/s].",        Star:5,      Type:"Food"                                   },
    3005: {File:"slow-CookedBambooShootSoup",   Name:"Slow-Cooked Bamboo Shoot Soup", Lore:"Gourmet food that temporarily boosts NpS by at least [s]500%[/s].",        Star:5,      Type:"Food"     },
    3006: {File:"goldenFriedChicken",           Name:"Golden Fried Chicken",          Lore:"Gourmet food that temporarily boosts NpS by at least [s]500%[/s].",        Star:5,      Type:"Food"                      },
    
    3021: {File:"biryani",                      Name:"Biryani",                     Lore:"Exceptional food that temporarily boosts NpS by at least [s]300%[/s].",        Star:4,      Type:"Food"                                              },
    3022: {File:"goldenCrab",                   Name:"Golden Crab",                 Lore:"Exceptional food that temporarily boosts NpS by at least [s]300%[/s].",        Star:4,      Type:"Food"                                       },
    3023: {File:"jadeParcels",                  Name:"Jade Parcels",                Lore:"Exceptional food that temporarily boosts NpS by at least [s]300%[/s].",        Star:4,      Type:"Food"                                     },
    3024: {File:"meatLoversMushroomPizza",      Name:"Meat Lovers Mushroom Pizza",  Lore:"Exceptional food that temporarily boosts NpS by at least [s]300%[/s].",        Star:4,      Type:"Food"           },
    3025: {File:"sashimiPlatter",               Name:"Sashimi Platter",             Lore:"Exceptional food that temporarily boosts NpS by at least [s]300%[/s].",        Star:4,      Type:"Food"                               },
    3026: {File:"tandooriRoastChicken",         Name:"Tandoori Roast Chicken",      Lore:"Exceptional food that temporarily boosts NpS by at least [s]300%[/s].",        Star:4,      Type:"Food"                  },

    3041: {File:"comeandGetIt",                 Name:"Come and Get It",             Lore:"Premium food that temporarily boosts NpS by at least [s]200%[/s].",        Star:3,      Type:"Food"                                 },
    3042: {File:"curedPorkDryHotpot",           Name:"Cured Pork Dry Hotpot",       Lore:"Premium food that temporarily boosts NpS by at least [s]200%[/s].",        Star:3,      Type:"Food"                     },
    3043: {File:"barbatosRatatouille",          Name:"Barbatos Ratatouille",        Lore:"Premium food that temporarily boosts NpS by at least [s]200%[/s].",        Star:3,      Type:"Food"                     },
    3044: {File:"baklava",                      Name:"Baklava",                     Lore:"Premium food that temporarily boosts NpS by at least [s]200%[/s].",        Star:3,      Type:"Food"                                              },
    3045: {File:"butterChicken",                Name:"Butter Chicken",              Lore:"Premium food that temporarily boosts NpS by at least [s]200%[/s].",        Star:3,      Type:"Food"                                 },
    3046: {File:"dragonBeardNoodles",           Name:"Dragon Beard Noodles",        Lore:"Premium food that temporarily boosts NpS by at least [s]200%[/s].",        Star:3,      Type:"Food"                      },
    3047: {File:"goldenChickenBurger",          Name:"Golden Chicken Burger",       Lore:"Premium food that temporarily boosts NpS by at least [s]200%[/s].",        Star:3,      Type:"Food"                    },
    3048: {File:"goldenShrimpBalls",            Name:"Golden Shrimp Balls",         Lore:"Premium food that temporarily boosts NpS by at least [s]200%[/s].",        Star:3,      Type:"Food"                        },

    3061: {File:"masalaCheese",                 Name:"Masala Cheese Balls",         Lore:"Good food that temporarily boosts NpS by at least [s]100%[/s].",        Star:2,      Type:"Food"                             },
    3062: {File:"jueyunChili",                  Name:"Jueyun Chili Chicken",        Lore:"Good food that temporarily boosts NpS by at least [s]100%[/s].",        Star:2,      Type:"Food"                             },
    3063: {File:"katsuSandwich",                Name:"Katsu Sandwich",              Lore:"Good food that temporarily boosts NpS by at least [s]100%[/s].",        Star:2,      Type:"Food"                                 },
    3064: {File:"crabRoeKourayaki",             Name:"Crab Roe Kourayaki",          Lore:"Good food that temporarily boosts NpS by at least [s]100%[/s].",        Star:2,      Type:"Food"                          },
    3065: {File:"dangoMilk",                    Name:"Dango Milk",                  Lore:"Good food that temporarily boosts NpS by at least [s]100%[/s].",        Star:2,      Type:"Food"                                         },
    3066: {File:"curryShrimp",                  Name:"Curry Shrimp",                Lore:"Good food that temporarily boosts NpS by at least [s]100%[/s].",        Star:2,      Type:"Food"                                     },
    3067: {File:"fishermanToast",               Name:"Fisherman's Toast",           Lore:"Good food that temporarily boosts NpS by at least [s]100%[/s].",        Star:2,      Type:"Food"                             },
    3068: {File:"roseCustard",                  Name:"Rose Custard",                Lore:"Good food that temporarily boosts NpS by at least [s]100%[/s].",        Star:2,      Type:"Food"                                     },
    3069: {File:"sweetMadame",                  Name:"Sweet Madame",                Lore:"Good food that temporarily boosts NpS by at least [s]100%[/s].",        Star:2,      Type:"Food"                                     },
    3070: {File:"jewelrySoup",                  Name:"Jewelry Soup",                Lore:"Good food that temporarily boosts NpS by at least [s]100%[/s].",        Star:2,      Type:"Food"                                     },
   
    3081: {Name:"Chicken Mushroom Skewer",      File:"chickenMushroomSkewer",       Lore:"Decent food that temporarily boosts NpS by at least [s]30%[/s].",        Star:1 ,      Type:"Food"                       },
    3082: {Name:"Egg Roll",                     File:"eggRoll",                     Lore:"Decent food that temporarily boosts NpS by at least [s]30%[/s].",        Star:1 ,      Type:"Food"                                    },
    3083: {Name:"Lambad Fish Roll",             File:"lambadFishRoll",              Lore:"Decent food that temporarily boosts NpS by at least [s]30%[/s].",        Star:1 ,      Type:"Food"                             },
    3084: {Name:"Mint Jelly",                   File:"mintJelly",                   Lore:"Decent food that temporarily boosts NpS by at least [s]30%[/s].",        Star:1 ,      Type:"Food"                                  },
    3085: {Name:"Minty Bean Soup",              File:"mintyBeanSoup",               Lore:"Decent food that temporarily boosts NpS by at least [s]30%[/s].",        Star:1 ,      Type:"Food"                              },
    3086: {Name:"Miso Soup",                    File:"misoSoup",                    Lore:"Decent food that temporarily boosts NpS by at least [s]30%[/s].",        Star:1 ,      Type:"Food"                                   },
    3087: {Name:"Mora Meat",                    File:"moraMeat",                    Lore:"Decent food that temporarily boosts NpS by at least [s]30%[/s].",        Star:1 ,      Type:"Food"                                   },
    3088: {Name:"Steak",                        File:"steak",                       Lore:"Decent food that temporarily boosts NpS by at least [s]30%[/s].",        Star:1 ,      Type:"Food"                                      },
    3089: {Name:"Sweet Shrimp Sushi",           File:"sweetShrimpSushi",            Lore:"Decent food that temporarily boosts NpS by at least [s]30%[/s].",        Star:1 ,      Type:"Food"                           },
    3090: {Name:"Teyvat Fried Egg",             File:"teyvatFriedEgg",              Lore:"Decent food that temporarily boosts NpS by at least [s]30%[/s].",        Star:1 ,      Type:"Food"                             },

// LEVEL ITEMS + SPECIAL ITEMS
    4001: {File:"heroEXP",                 Name:"Hero's Wit",                        Lore:"Comprehensive papers that provide many free levels.\n \n (Free Levels do not cost Nuts to purchase.)",       Star:4,  Type:"Level",   BuffLvlLow:10,BuffLvlHigh:15, },
    4002: {File:"adventureEXP",            Name:"Adventurer's Experience",           Lore:"Elaborate papers that provide some free levels.\n \n (Free Levels do not cost Nuts to purchase.)",           Star:3,  Type:"Level",   BuffLvlLow:4,BuffLvlHigh:9,  },
    4003: {File:"wandererEXP",             Name:"Wanderer's Advice",                 Lore:"A detailed paper that provides a few free levels.\n \n (Free Levels do not cost Nuts to purchase.)",          Star:2,  Type:"Level",   BuffLvlLow:1,BuffLvlHigh:3,  },
    4010: {File:"mailLarge",               Name:"Enchanted Courier",                 Lore:"A magical letter that automatically seeks its recipient, no matter where they may be.",                      Star:5,  Type:"Level" },
    4011:{File:"sanctifyingOil",           Name:"Sanctifying Oil",                   Lore:"A rejuvenating potion that restores a modest amount of Energy.",                                             Star:3,  Type:"Food"  },
    4012:{File:"sanctifyingUnction",       Name:"Sanctifying Unction",               Lore:"A rejuvenating concotion that restores a considerable amount of Energy.",                                    Star:4,  Type:"Food"  },
    4013:{File:"sanctifyingEssence",       Name:"Sanctifying Essence",               Lore:"A rejuvenating elixir that restores a substantial amount of Energy.",                                        Star:5,  Type:"Food"  },
    

// SHOP ITEMS vvv
    5001: {File:"any5",          Name:"Brilliant Diamond Gemstone",                  Lore:"A shiny mystical gem that increases power of [s]all[/s] characters by at least [s]200%[/s]. \n\n (Only characters currently purchased count.)",                       Star:6,       Type:"Gemstone",           element:"Any"          },
    5002: {File:"any4",          Name:"Brilliant Diamond Chunck",                    Lore:"A shiny mystical gem that increases power of [s]all[/s] characters by at least [s]90%[/s]. \n\n (Only characters currently purchased count.)",                        Star:5,        Type:"Gemstone",         element:"Any"          },
    5003: {File:"pyro5",         Name:"Agnidus Agate Gemstone",                      Lore:"A mystical red gem that increases power of [s]Pyro[/s] characters by at least [s]200%[/s]. \n\n (Only characters currently purchased count.)",      Star:5,        Type:"Gemstone",            element:"Pyro"         },
    5004: {File:"hydro5",        Name:"Varunada Lazurite Gemstone",                  Lore:"A mystical blue gem that increases power of [s]Hydro[/s] characters by at least [s]200%[/s]. \n\n (Only characters currently purchased count.)",       Star:5,       Type:"Gemstone",             element:"Hydro"         },
    5005: {File:"dendro5",       Name:"Nagadus Emerald Gemstone",                    Lore:"A mystical dark green gem that increases power of [s]Dendro[/s] characters by at least [s]200%[/s]. \n\n (Only characters currently purchased count.)",        Star:5,      Type:"Gemstone",              element:"Dendro"         },
    5006: {File:"electro5",      Name:"Vajrada Amethyst Gemstone",                   Lore:"A mystical purple gem that increases power of [s]Electro[/s] characters by at least [s]200%[/s]. \n\n (Only characters currently purchased count.)",         Star:5,      Type:"Gemstone",               element:"Electro"         },
    5007: {File:"anemo5",        Name:"Vayuda Turquoise Gemstone",                   Lore:"A mystical green gem that increases power of [s]Anemo[/s] characters by at least [s]200%[/s]. \n\n (Only characters currently purchased count.)",       Star:5,        Type:"Gemstone",              element:"Anemo"         },
    5008: {File:"cryo5",         Name:"Shivada Jade",                                Lore:"A mystical light blue gem that increases power of [s]Cryo[/s] characters by at least [s]200%[/s]. \n\n (Only characters currently purchased count.)",      Star:5,         Type:"Gemstone",              element:"Cryo"         },
    5009: {File:"geo5",          Name:"Prithiva Topaz",                              Lore:"A mystical yellowish brown gem that increases power of [s]Geo[/s] characters by at least [s]200%[/s]. \n\n (Only characters currently purchased count.)",     Star:5,          Type:"Gemstone",              element:"Geo"         },
    5010: {File:"pyro4",         Name:"Agnidus Agate Chunk",                         Lore:"A mystical red gem that increases power of [s]Pyro[/s] characters by at least [s]120%[/s]. \n\n (Only characters currently purchased count.)",      Star:4,          Type:"Gemstone",             element:"Pyro"      },
    5011: {File:"hydro4",        Name:"Varunada Lazurite Chunk",                     Lore:"A mystical blue gem that increases power of [s]Hydro[/s] characters by at least [s]120%[/s]. \n\n (Only characters currently purchased count.)",       Star:4,         Type:"Gemstone",            element:"Hydro"      },
    5012: {File:"dendro4",       Name:"Nagadus Emerald Chunk",                       Lore:"A mystical dark green gem that increases power of [s]Dendro[/s] characters by at least [s]120%[/s]. \n\n (Only characters currently purchased count.)",        Star:4,        Type:"Gemstone",              element:"Dendro"      },
    5013: {File:"electro4",      Name:"Vajrada Amethyst Chunk",                      Lore:"A mystical purple gem that increases power of [s]Electro[/s] characters by at least [s]120%[/s]. \n\n (Only characters currently purchased count.)",         Star:4,       Type:"Gemstone",              element:"Electro"      },
    5014: {File:"anemo4",        Name:"Vayuda Turquoise Chunk",                      Lore:"A mystical green gem that increases power of [s]Anemo[/s] characters by at least [s]120%[/s]. \n\n (Only characters currently purchased count.)",       Star:4,          Type:"Gemstone",            element:"Anemo"      },
    5015: {File:"cryo4",         Name:"Shivada Jade Chunk",                          Lore:"A mystical light blue gem that increases power of [s]Cryo[/s] characters by at least [s]120%[/s]. \n\n (Only characters currently purchased count.)",      Star:4,           Type:"Gemstone",             element:"Cryo"      },
    5016: {File:"geo4",          Name:"Prithiva Topaz Chunk",                        Lore:"A mystical yellowish brown gem that increases [s]power[/s] of Geo characters by at least [s]120%[/s]. \n\n (Only characters currently purchased count.)",     Star:4,           Type:"Gemstone",              element:"Geo"      },
// TALENT TEMS vvv
    6001: {File:"liyueTal4",     Name:"Philosophies of Prosperity",                  Lore:"Exhaustive reading materials that increases power of [s]Liyue[/s] characters by at least [s]80%[/s]. \n\n (Only characters currently purchased count.)",    Star:4,             Type:"Talent",             nation:"Liyue"  }, 
    6002: {File:"mondTal4",      Name:"Philosophies of Freedom",                     Lore:"Exhaustive reading materials that increase power of [s]Mondstadt[/s] characters by at least [s]80%[/s]. \n\n (Only characters currently purchased count.)",   Star:4,              Type:"Talent",            nation:"Mondstadt" },
    6003: {File:"sumeruTal4",    Name:"Philosophies of Admonition",                  Lore:"Exhaustive reading materials that increase power of [s]Sumeru[/s] characters by at least [s]80%[/s]. \n\n (Only characters currently purchased count.)",     Star:4,             Type:"Talent",            nation:"Sumeru" },
    6004: {File:"inazumaTal4",   Name:"Philosophies of Transience",                  Lore:"Exhaustive reading materials that increase power of [s]Inazuma[/s] characters by at least [s]80%[/s]. \n\n (Only characters currently purchased count.)",      Star:4,            Type:"Talent",            nation:"Inazuma" },
    6005: {File:"liyueTal3",     Name:"Guide to Diligence",                          Lore:"In-depth reading materials that increase power of [s]Liyue[/s] characters by at least [s]50%[/s]. \n\n (Only characters currently purchased count.)",    Star:3,              Type:"Talent",             nation:"Liyue"    },
    6006: {File:"mondTal3",      Name:"Guide to Resistance",                         Lore:"In-depth reading materials that increase power of [s]Mondstadt[/s] characters by at least [s]50%[/s]. \n\n (Only characters currently purchased count.)",   Star:3,               Type:"Talent",            nation:"Mondstadt"    },
    6007: {File:"sumeruTal3",    Name:"Guide to Ingenuity",                          Lore:"In-depth reading materials that increase power of [s]Sumeru[/s] characters by at least [s]50%[/s]. \n\n (Only characters currently purchased count.)",     Star:3,             Type:"Talent",            nation:"Sumeru"    },
    6008: {File:"inazumaTal3",   Name:"Guide to Elegance",                           Lore:"In-depth reading materials that increase power of [s]Inazuma[/s] characters by at least [s]50%[/s]. \n\n (Only characters currently purchased count.)",      Star:3,            Type:"Talent",            nation:"Inazuma"    },
    6009: {File:"liyueTal2",     Name:"Teachings of Gold",                           Lore:"Concise reading materials that increase power of [s]Liyue[/s] characters by at least [s]20%[/s]. \n\n (Only characters currently purchased count.)",    Star:2,              Type:"Talent",           nation:"Liyue"    },
    6010: {File:"mondTal2",      Name:"Teachings of Ballad",                         Lore:"Concise reading materials that increase power of [s]Mondstadt[/s] characters by at least [s]20%[/s]. \n\n (Only characters currently purchased count.)",   Star:2,               Type:"Talent",          nation:"Mondstadt"    },
    6011: {File:"sumeruTal2",    Name:"Teachings of Praxis",                         Lore:"Concise reading materials that increase power of [s]Sumeru[/s] characters by at least [s]20%[/s]. \n\n (Only characters currently purchased count.)",     Star:2,             Type:"Talent",          nation:"Sumeru"    },
    6012: {File:"inazumaTal2",   Name:"Teachings of Light",                          Lore:"Concise reading materials that increase power of [s]Inazuma[/s] characters by at least [s]20%[/s]. \n\n (Only characters currently purchased count.)",      Star:2,            Type:"Talent",          nation:"Inazuma"    },
};

let eventText = {
    1: "A surge of power courses through Nahida - She feels empowered!",
    1.5: `"Are you sure it has to be me? \n ...Fine, let's get this over with."`,
    2: "Let's play a game! When the clock stops ticking, we'll see who can press the button first!",
    3: "We found some mysterious boxes in the wild! Shall we open them?",
    4: "A whopperflower infestation has occured in the area - please help to identify them!",
    5: "Weasel thieves has been hoarding the Ajilenakh Nuts for themselves, we need to catch them!",
    6: "Oh no! A strong wind current has swept through the desert and caused things to fall from the sky!",
}

let expeditionDictDefault = {
    1:{Text:"Explore Teyvat | 100 "                  ,Locked:"0" ,Lore:"The legend of the Golden Nut is from a bygone era. Some on-the-ground research is certainly needed if you wanted even a slither of a chance to find the mythical fruit."},
    2:{Text:"Ask the Adventurers' Guild | 250 "      ,Locked:"0" ,Lore:"Tapping into the resources of the Adventurer's Guild's network is one way to widen the scope of the search as the more eyes, the better."},
    3:{Text:"Challenge Domains | 500 "               ,Locked:"1" ,Lore:"Clues about the origin of the Golden Nut are said to have been hidden deep inside some mysterious domain. Exploring it will likely be the next step in unravelling the fruit's location."},
    4:{Text:"Hunt Boss Enemies | 750 "               ,Locked:"1" ,Lore:"The last confirmed sighting of the Golden Nut was in the heart of the woods, which is currently being guarded by a ferocious beast. It may well be the only stone left unturned."},
    5:{Text:"Abyss Diving | 1000 "                   ,Locked:"1" ,Lore:"All trails seem to end here. With nowhere else to go, the Abyss is the sole place left where the fruit is likely to be. Search through the floors with the help of an unlikely ally."},
    6:{Text:"Locked"                                 ,Locked:"0" ,Lore:"Perhaps this path will open after you get stronger..."            },
    7:{Text:"Select an Expedition"                   ,Locked:"0" ,Lore:"Go on Expeditions to get items to upgrade your characters!"            },
    8:{Text:"Expeditions Use Energy "                ,Locked:"1" ,Lore:"Energy can be obtained by clicking Big Nahida"            },
    9:{Text:"Not enough Energy "                     ,Locked:"1" ,Lore:"Obtain more before going on Expeditions!"            },
}

let achievementListDefault = {
    1: {Name:"Nut Collector",                         Description:"Collect 100 nuts"                            },
    2: {Name:"Fan of Nuts",                           Description:"Collect 10,000 nuts"                          },
    3: {Name:"Nut Gatherer",                          Description:"Collect 1 million nuts"                        },
    4: {Name:"Nut Accumulator",                       Description:"Collect 100 million nuts"                     },
    5: {Name:"Nut Hobbyist",                          Description:"Collect 1 billion nuts"                   },
    6: {Name:"Nut Addict",                            Description:"Collect 100 billion nuts"                     },
    7: {Name:"Nut Fancier",                           Description:"Collect 1 trillion nuts"                   },
    8: {Name:"Lord of the Nuts",                      Description:"Collect 100 trillion nuts"                    },
    9: {Name:"Nut Authority",                         Description:"Collect 1 quadrillion nuts"                  },
    10: {Name:"Nut Connoisseur",                      Description:"Collect 100 quadrillion nuts"                 },
    11: {Name:"Devotee of Nuts",                      Description:"Collect 1 quintillion nuts"               },
    12: {Name:"Aficionado of Nuts",                   Description:"Collect 100 quintillion nuts"                 },
    13: {Name:"Nut Syndrome",                         Description:"Collect 1 sextillion nuts"               },
    14: {Name:"Nut Antiquarian",                      Description:"Collect 100 sextillion nuts"                  },
    15: {Name:"Nut Savant",                           Description:"Collect 1 septillion nuts"                },
    16: {Name:"Nut Pundit",                           Description:"Collect 100 septillion nuts"                  },
    17: {Name:"Nut Star",                             Description:"Collect 1 octillion nuts"                  },
    18: {Name:"Nut Grandmaster",                      Description:"Collect 100 octillion nuts"                  },
    19: {Name:"Wielder of Nuts",                      Description:"Collect 1 nonillion nuts"                  },
    20: {Name:"The Nut Archon",                       Description:"Collect 100 nonillion nuts"                  },
    101: {Name:"Mission Start",                       Description:"Reach 10 NpS"                                },
    102: {Name:"Empowered",                           Description:"Reach 100 NpS"                               },
    103: {Name:"A Rising Star",                       Description:"Reach 1000 NpS"                              },
    104: {Name:"Big Nut",                             Description:"Reach 100,000 NpS"                          },
    105: {Name:"Sprout of Rebirth",                   Description:"Reach 1 million NpS"                        },
    106: {Name:"Committed to Memory",                 Description:"Reach 100 million NpS"                      },
    107: {Name:"Kernel by Kernel",                    Description:"Reach 1 billion NpS"                        },
    108: {Name:"The Courier",                         Description:"Reach 100 billion NpS"                      },
    109: {Name:"Exquisite Delicacy",                  Description:"Reach 1 trillion NpS"                       },
    110: {Name:"Legend In the Flesh",                 Description:"Reach 100 trillion NpS"                     },
    111: {Name:"Power Overwhelming",                  Description:"Reach 1 quadrillion NpS"                    },
    112: {Name:"The Spirit of Dendro",                Description:"Reach 100 quadrillion NpS"                  },
    113: {Name:"Bound by Fate",                       Description:"Reach 1 quintillion NpS"                    },
    114: {Name:"One for All",                         Description:"Reach 100 quintillion NpS"                  },
    115: {Name:"The Forest Will Remember",            Description:"Reach 1 sextillion NpS"                     },
    116: {Name:"Champion of Tevyat",                  Description:"Reach 100 sextillion NpS"                     },
    117: {Name:"Windborne Bard",                      Description:"Reach 1 septillion NpS"                     },
    118: {Name:"Vago Mundo",                          Description:"Reach 100 septillion NpS"                     },
    119: {Name:"Plane of Euthymia",                   Description:"Reach 1 octtillion NpS"                     },
    120: {Name:"The Physic of Purity",                Description:"Reach 100 octtillion NpS"                     },
    201: {Name:"Welcome to Sumeru",                   Description:"Click 10 times"                             },
    202: {Name:"Just Getting Started",                Description:"Click 100 times"                            },
    203: {Name:"Into the Forest",                     Description:"Click 500 times"                            },
    204: {Name:"Seasoned Adventurer",                 Description:"Click 1000 times"                           },
    205: {Name:"Proof of Bravery",                    Description:"Click 2500 times"                           },
    206: {Name:"Trial by Nuts",                       Description:"Click 5000 times"                           },
    207: {Name:"Supertrainer",                        Description:"Click 7500 times"                           },
    208: {Name:"The Fair Lady",                       Description:"Click 10,000 times"                         },
    209: {Name:"Temple of Wisdom",                    Description:"Click 15,000 times"                         },
    210: {Name:"Top of The Game",                     Description:"Click 20,000 times"                         },
    211: {Name:"Dance of Lotuslight",                 Description:"Click 25,000 times"                         },
    212: {Name:"The Hero's Journey",                  Description:"Click 30,000 times"                         },
    213: {Name:"Kernel Keeper",                       Description:"Click 35,000 times"                         },
    214: {Name:"Greatest Challenge",                  Description:"Click 40,000 times"                         },
    215: {Name:"The Master of Cultivation",           Description:"Click 50,000 times"                         },
    301: {Name:"Lvl.1 Grunt",                         Description:"Upgrade 1 time"                             },
    302: {Name:"Clan Leader",                         Description:"Upgrade 10 times"                           },
    303: {Name:"Peas in a Pod",                       Description:"Upgrade 100 times"                          },
    304: {Name:"Flourishing Green",                   Description:"Upgrade 250 times"                          },
    305: {Name:"Sumerian City",                       Description:"Upgrade 500 times"                          },
    306: {Name:"Lvl.10 Knight",                       Description:"Upgrade 750 time"                           }, 
    307: {Name:"Eon's Elite",                         Description:"Upgrade 1000 times"                         },
    308: {Name:"Witch of the Rose",                   Description:"Upgrade 1250 times"                         },
    309: {Name:"Philosophies of Ingenuity",           Description:"Upgrade 1500 times"                         },
    310: {Name:"Team Sigil",                          Description:"Upgrade 1750 times"                         },
    311: {Name:"Powers Combined",                     Description:"Upgrade 2000 times"                         },
    312: {Name:"Ajilenakh Knight",                    Description:"Upgrade 2250 times"                         },
    313: {Name:"Queen of Heroes",                     Description:"Upgrade 2500 times"                         },
    314: {Name:"Lvl.100 Shogun",                      Description:"Upgrade 2750 times"                         },
    315: {Name:"A Heart of Dendro",                   Description:"Upgrade 3000 times"                         },
    401: {Name:"Struck Gold",                         Description:"Obtain 1 Golden Nut"                        },
    402: {Name:"Golden Vow",                          Description:"Obtain 10 Golden Nuts"                       },
    403: {Name:"Golden Harvest",                      Description:"Obtain 25 Golden Nuts"                       },
    404: {Name:"All That Glitters",                   Description:"Obtain 50 Golden Nuts"                      },
    405: {Name:"State of Gold",                       Description:"Obtain 100 Golden Nuts"                      },
    406: {Name:"Overflowing Wealth",                  Description:"Obtain 200 Golden Nuts"                      },
    407: {Name:"My Precious",                         Description:"Obtain 350 Golden Nuts"                      },
    408: {Name:"High Roller",                         Description:"Obtain 500 Golden Nuts"                     },
    409: {Name:"Golden Swallow",                      Description:"Obtain 750 Golden Nuts"                      },
    410: {Name:"A Golden Experience",                 Description:"Obtain 1000 Golden Nuts"                     },
}

export { upgradeDictDefault,SettingsDefault,InventoryDefault,expeditionDictDefault,achievementListDefault,saveValuesDefault,eventText,upgradeInfo,persistentValuesDefault,permUpgrades };