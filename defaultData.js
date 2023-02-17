var saveValuesDefault = {
    clickCount:0,
    clickFactor:1,
    dps:1023,
    realScore:1e16,
    freeLevels:0,
    primogem:11111,
    energy:1000,
    rowCount:0,
    heroesPurchased:0,
    wishUnlocked:false,
    wishCounterSaved:0,
    goldenNut:0,
}

var SettingsDefault = {
    bgmVolume:0.5,
    sfxVolume:0.5,
}


var upgradeDictDefault = {
    0:  {Row:-1,        Purchased: -1,   "Contribution": 0, "Level": 1, "BaseCost":20, Factor:1  },
    1:  {Row:-1,        Purchased: -1,                         },
    2:  {Row:-1,        Purchased: -1,                                         },
    3:  {Row:-1,        Purchased: -1,                                       },
    4:  {Row:-1,        Purchased: -1,                                          },
    5:  {Row:-1,        Purchased: -1,                                       },
    6:  {Row:-1,        Purchased: -1,                                         },
    7:  {Row:-1,        Purchased: -1,                                       },
    8:  {Row:-1,        Purchased: -1,                                      },
    9:  {Row:-1,        Purchased: -1,                                       },
    10: {Row:-1,        Purchased: -1,                                       },
    11: {Row:-1,        Purchased: -1,                                     },
    12: {Row:-1,        Purchased: -1,                                       },
    13: {Row:-1,        Purchased: -1,                                         },
    14: {Row:-1,        Purchased: -1,                                              },
    15: {Row:-1,        Purchased: -1,                                                },
    16: {Row:-1,        Purchased: -1,                                          },
    17: {Row:-1,        Purchased: -1,                                             },
    18: {Row:-1,        Purchased: -1,                                        },
    19: {Row:-1,        Purchased: -1,                                           },
    20: {Row:-1,        Purchased: -1,                                              },
    21: {Row:-1,        Purchased: -1,                                            },
    22: {Row:-1,        Purchased: -1,                                             },
    23: {Row:-1,        Purchased: -1,                                                },
    24: {Row:-1,        Purchased: -1,                                              },
    25: {Row:-1,        Purchased: -1,                                        },
    26: {Row:-1,        Purchased: -1,                                       },
    27: {Row:-1,        Purchased: -1,                                         },
    28: {Row:-1,        Purchased: -1,                                     },
    29: {Row:-1,        Purchased: -1,                                         },
    30: {Row:-1,        Purchased: -1,                                       },
    31: {Row:-1,        Purchased: -1,                                            },
    32: {Row:-1,        Purchased: -1,                                        },
    33: {Row:-1,        Purchased: -1,                                    },
    34: {Row:-1,        Purchased: -1,                                         },
    35: {Row:-1,        Purchased: -1,                                         },    
    36: {Row:-1,        Purchased: -1,                                             },
    37: {Row:-1,        Purchased: -1,                                          },
    38: {Row:-1,        Purchased: -1,                                      },
    39: {Row:-1,        Purchased: -1,                                        },
    40: {Row:-1,        Purchased: -1,                                            },
    41: {Row:-1,        Purchased: -1,                                     },
    42: {Row:-1,        Purchased: -1,                                            },
    43: {Row:-1,        Purchased: -1,                                            },
    44: {Row:-1,        Purchased: -1,                                           },
    45: {Row:-1,        Purchased: -1,                                          },
    46: {Row:-1,        Purchased: -1,                                         },
    47: {Row:-1,        Purchased: -1,                                      },
    48: {Row:-1,        Purchased: -1,                                    },
    49: {Row:-1,        Purchased: -1,                                          },
// RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS
    100: {Row:-1,    "Level": 0, Purchased: -10,                                        },
    101: {Row:-1,    "Level": 0, Purchased: -10,                                      },
    102: {Row:-1,    "Level": 0, Purchased: -10,                                   },
    103: {Row:-1,    "Level": 0, Purchased: -10,                                  },
    104: {Row:-1,    "Level": 0, Purchased: -10,                                     },
    105: {Row:-1,    "Level": 0, Purchased: -10,                                      },
    106: {Row:-1,    "Level": 0, Purchased: -10,                                           },
    107: {Row:-1,    "Level": 0, Purchased: -10,                                          },
    108: {Row:-1,    "Level": 0, Purchased: -10,                                         },
    109: {Row:-1,    "Level": 0, Purchased: -10,                                      },
    110: {Row:-1,    "Level": 0, Purchased: -10,                                  },
    111: {Row:-1,    "Level": 0, Purchased: -10,                                        },
    // 112: {Row:-1,     "Level": 0, Purchased: -10,                                    },
};

var upgradeInfo = {
    0: {
        Name: "Nahida",
        Lore: " Being a listener has never been enough for me. I've always dreamed of going out and seeing things for myself.  Can you be my guide? I want to experience all your future tales first-hand.",
        Type: "Catalyst",
        Ele: "Dendro",
        Nation: "Sumeru"
    },
    1: {
        Name: "Traveller",
        Lore: "",
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
        Lore: "I am right by your side. But if you're still nervous, just take my hand.",
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
    11: {
        Name: "Amber",
        Lore: "Outrider Amber reporting for duty! Just say the word if you ever need my help!",
        Type: "Bow",
        Ele: "Pyro",
        Nation: "Sumeru"
    },
    12: {
        Name: "Bennett",
        Lore: "No one's joined me on an adventure in ages. C'mon, let's go!",
        Type: "Sword",
        Ele: "Pyro",
        Nation: "Sumeru"
    },
    13: {
        Name: "Noelle",
        Lore: "I am devoted to what I do, but make no mistake — I devote myself freely. A maid, to me, is the most liberating job there is. I'm a chef, a gardener, a warrior, a guide... I can be anything you need me to be!",
        Type: "Claymore",
        Ele: "Geo",
        Nation: "Sumeru"
    },
    14: {
        Name: "Barbara",
        Lore: "Are you tired? Try my new spicy energy drink, I'm sure it'll wake you up!",
        Type: "Catalyst",
        Ele: "Hydro",
        Nation: "Mondstadt"
    },
    15: {
        Name: "Lisa",
        Lore: " Hey darling, would you like to try one of my magic potions? There's no knowing what it will do to you until you try it, though... Don't say I didn't warn you!",
        Type: "Catalyst",
        Ele: "Electro",
        Nation: "Mondstadt"
    },
    16: {
        Name: "Kaeya",
        Lore: "Please, allow me to join you on your journey. Guarding you on your journey sounds far more entertaining than any of the usual Favonius stuff.",
        Type: "Sword",
        Ele: "Cryo",
        Nation: "Mondstadt"
    },
    17: {
        Name: "Diluc",
        Lore: "You should really bring the Knights of Favonius with you next time.",
        Type: "Claymore",
        Ele: "Pyro",
        Nation: "Mondstadt"
    },
    18: {
        Name: "Diona",
        Lore: "What's that!? Let me see! Maybe I can add it to my next cocktail to give it a dreadful taste... Huh? It's just a strange-looking mushroom, how boring...",
        Type: "Bow",
        Ele: "Cryo",
        Nation: "Mondstadt"
    },
    19: {
        Name: "Fischl",
        Lore: "Remember thou this, that I, Fischl, am the Prinzessin der Verurteilung, Sovereign of Immernachtreich, omniscient and eminent judge of all the world's iniquity!",
        Type: "Bow",
        Ele: "Electro",
        Nation: "Mondstadt"
    },
    20: {
        Name: "Mona",
        Lore: "Do you know about constellations? Astrologers believe that the patterns of the stars map out the destiny of Vision bearers — past, present, and future, everything is written in the stars.",
        Type: "Catalyst",
        Ele: "Hydro",
        Nation: "Mondstadt"
    },
    21: {
        Name: "Rosaria",
        Lore: "Listen, if you've got a problem you can't handle, then I'm the one for the job. But if you're looking for prayer, you'd better find some other Sister.",
        Type: "Polearm",
        Ele: "Cryo",
        Nation: "Mondstadt"
    },
    22: {
        Name: "Klee",
        Lore: "This is my new and improved bomb! Whaddya think? Great huh? ...Oh, but ahh... If you find it near any fires, it's not mine. Definitely. Not. Mine.",
        Type: "Catalyst",
        Ele: "Pyro",
        Nation: "Mondstadt"
    },
    23: {
        Name: "Razor",
        Lore: "I like the stars at night. So many stars. In the sky, in the lake. And in the city.",
        Type: "Claymore",
        Ele: "Electro",
        Nation: "Mondstadt"
    },
    24: {
        Name: "Sucrose",
        Lore: "Th-The sun is already out? Oh, ah, okay! Just one last experiment, and then we can get some rest. Last one, I promise...",
        Type: "Catalyst",
        Ele: "Anemo",
        Nation: "Mondstadt"
    },
    25: {
        Name: "Xiangling",
        Lore: "I'm much better at cooking than navigating... but if you do go out, definitely take me with you!",
        Type: "Polearm",
        Ele: "Pyro",
        Nation: "Liyue"
    },
    26: {
        Name: "Xingqiu",
        Lore: " I always have to put on an act around other people, because they see me only as the second son of the Feiyun Commerce Guild. It's a relief that I can just be myself around you.",
        Type: "Sword",
        Ele: "Hydro",
        Nation: "Liyue"
    },
    27: {
        Name: "Chongyun",
        Lore: "'Heart be pure, evil be erased. Mind be purged, world be...' Um... Ugh, I always forget that last part.",
        Type: "Claymore",
        Ele: "Cryo",
        Nation: "Liyue"
    },
    28: {
        Name: "Hu Tao",
        Lore: "Need a hand, need a hand? I'm here! If you need some assistance, I'm here to give it my all to the very end!",
        Type: "Polearm",
        Ele: "Pyro",
        Nation: "Liyue"
    },
    29: {
        Name: "Xinyan",
        Lore: " I'd sure love to add some extra flavor to my rock 'n' roll. Wanna get on the drums next time? Don't sweat it, it's a question of soul, not skill! Give it a go, I just know you'll be great!",
        Type: "Claymore",
        Ele: "Pyro",
        Nation: "Liyue"
    },
    30: {
        Name: "Yun Jin",
        Lore: "",
        Type: "Polearm",
        Ele: "Geo",
        Nation: "Liyue"
    },
    31: {
        Name: "Beidou",
        Lore: "Wind's picking up. If sand gets in your eyes, be sure not to rub them.",
        Type: "Claymore",
        Ele: "Electro",
        Nation: "Liyue"
    },
    32: {
        Name: "Ningguang",
        Lore: "I suppose you've heard enough rumors about me. What kind of person am I? I shall leave that for you to decide... Of course, your judgement will become a part of the rumor.",
        Type: "Catalyst",
        Ele: "Geo",
        Nation: "Liyue"
    },
    33: {
        Name: "Ganyu",
        Lore: "Should we really be off work this early? There is still a lot left to do...",
        Type: "Bow",
        Ele: "Cryo",
        Nation: "Liyue"
    },
    34: {
        Name: "Keqing",
        Lore: "If you feel strongly about something, you should speak up and take action. That's the philosophy I live by.",
        Type: "Sword",
        Ele: "Electro",
        Nation: "Liyue"
    },
    35: {
        Name: "Yanfei",
        Lore: "",
        Type: "Catalyst",
        Ele: "Pyro",
        Nation: "Liyue"
    },
    36: {
        Name: "Yaoyao",
        Lore: "",
        Type: "Polearm",
        Ele: "Dendro",
        Nation: "Liyue"
    },
    37: {
        Name: "Thoma",
        Lore: "Anything I can lend a hand with, just say the word. A conversation? I see, I see. That's a little different from what I'm used to, but I'm all for it",
        Type: "Polearm",
        Ele: "Pyro",
        Nation: "Inazuma"
    },
    38: {
        Name: "Yoimiya",
        Lore: "",
        Type: "Bow",
        Ele: "Pyro",
        Nation: "Inazuma"
    },
    39: {
        Name: "Ayaka",
        Lore: "'Was it one's thoughts that drew him to my dreams? Had I known it a dream, one would not have awakened.' Hehe, I love that poem.",
        Type: "Sword",
        Ele: "Cryo",
        Nation: "Inazuma"
    },
    40: {
        Name: "Sayu",
        Lore: "Hey, will you do me a favor and let me know if you see the shrine maiden coming? I'm just gonna, um... rest my eyes for a moment.",
        Type: "Claymore",
        Ele: "Anemo",
        Nation: "Inazuma"
    },
    41: {
        Name: "Gorou",
        Lore: " It'd be nice to just lie in the sun... Ahem, but I must set an example for the others.",
        Type: "Bow",
        Ele: "Geo",
        Nation: "Inazuma"
    },
    42: {
        Name: "Kokomi",
        Lore: " I like to find a quiet place by myself and read books on strategy. Ahh, the whole day without interruption. I'd be even happier if we looked over some of it together... One thing though, you'd have to sleep on the floor.",
        Type: "Catalyst",
        Ele: "Hydro",
        Nation: "Inazuma"
    },
    43: {
        Name: "Heizou",
        Lore: "Seems to me like these commissions of yours are an endless gold mine of cases, and you'll never be able to finish them all. So maybe you could throw one my way every once in a while?",
        Type: "Catalyst",
        Ele: "Anemo",
        Nation: "Inazuma"
    },
    44: {
        Name: "Shinobu",
        Lore: "Just let me know if you ever find yourself in a pinch. I can help you out. If the Arataki Gang stirs up any trouble, I'll drag every last one of them back to apologize.",
        Type: "Sword",
        Ele: "Electro",
        Nation: "Inazuma"
    },
    45: {
        Name: "Itto",
        Lore: "~Arataki 'He Might Lose but He'll Never Admit Defeatto'...",
        Type: "Claymore",
        Ele: "Geo",
        Nation: "Inazuma"
    },
    46: {
        Name: "Sara",
        Lore: "I have agreed to fight by your side, and I will honor that commitment. I may be uncompromising on matters of great importance, but on most other things, you will find me quite easygoing.",
        Type: "Bow",
        Ele: "Electro",
        Nation: "Inazuma"
    },
    47: {
        Name: "Venti",
        Lore: "My tummy is rumbling, but I can't get caught pilfering food again... Oh, it's you! Where are you heading? May I join?",
        Type: "Bow",
        Ele: "Anemo",
        Nation: "Mondstadt"
    },
    48: {
        Name: "Zhongli",
        Lore: "",
        Type: "Polearm",
        Ele: "Geo",
        Nation: "Liyue"
    },
    49: {
        Name: "Ei",
        Lore: "Do you wish to know the truth about the shooting stars at night? Haha, they are but fleeting moments of luminosity.",
        Type: "Polearm",
        Ele: "Electro",
        Nation: "Inazuma"
    },
    // RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS
    100: {
        Name: "Wanderer",
        Lore: "You want to use my hat as an umbrella? Hmph, the audacity to even make that request...",
        Type: "Catalyst",
        Ele: "Anemo",
        Nation: "Sumeru"
    },
    101: {
        Name: "Albedo",
        Lore: "Going out into the world and investigating, turning the 'unknown' into the 'known.' ...Ahhh, I missed this feeling.",
        Type: "Sword",
        Ele: "Geo",
        Nation: "Mondstadt"
    },
    102: {
        Name: "Qiqi",
        Lore: "Some people want to take advantage of me. Others are terrified of me. But you... You are not like any of those people.",
        Type: "Sword",
        Ele: "Cryo",
        Nation: "Liyue"
    },
    103: {
        Name: "Yelan",
        Lore: "",
        Type: "Bow",
        Ele: "Hydro",
        Nation: "Liyue"
    },
    104: {
        Name: "Shenhe",
        Lore: "I rarely leave the mountains, so I was never taught proper manners. If you don't approve of my methods, please do let me know.",
        Type: "Polearm",
        Ele: "Cryo",
        Nation: "Liyue"
    },
    105: {
        Name: "Ayato",
        Lore: "I'm no stickler for doing things in a certain way. Whatever method you use, the important thing is that it delivers acceptable results",
        Type: "Sword",
        Ele: "Hydro",
        Nation: "Inazuma"
    },
    106: {
        Name: "Yae Miko",
        Lore: "",
        Type: "Catalyst",
        Ele: "Electro",
        Nation: "Inazuma"
    },
    107: {
        Name: "Eula",
        Lore: "You want to learn some Favonius Bladework? Heh, alright then, I'll teach you.... Oh yes, I'll teach you, alright, mark my words...",
        Type: "Claymore",
        Ele: "Cryo",
        Nation: "Mondstadt"
    },
    108: {
        Name: "Kazuha",
        Lore: "You'd like to know more about me, you say? Well, as you see, I am but a wandering samurai that you could have run into just about anywhere.",
        Type: "Sword",
        Ele: "Anemo",
        Nation: "Inazuma"
    },
    109: {
        Name: "Xiao",
        Lore: "I'm willing to protect you. But don't think about getting close, and stay out of my way, or all that awaits you is regret.",
        Type: "Polearm",
        Ele: "Anemo",
        Nation: "Liyue"
    },
    110: {
        Name: "Tartaglia",
        Lore: "Ah, I'm sure the Harbingers must know of my dealings with you by now. Oh, I'd love to see the look on their faces... Hahaha...",
        Type: "Bow",
        Ele: "Hydro",
        Nation: "Liyue"
    },
    111: {
        Name: "Jean",
        Lore: "'Dandelion, Dandelion, ride the wind to a faraway land.' Who knows, the wind might take it all the way to Celestia",
        Type: "Sword",
        Ele: "Anemo",
        Nation: "Mondstadt"
    },
    // 112: {Name: "Dehya",         Lore:"",     "Level":   Type: "Claymore",   Ele: "Pyro",           Nation:"Mond"                                             },
};

// RMB TO UPDATE MAX CONSTANTS
var InventoryDefault = {
    // SPECIAL WEAPON
    1001: {File:"amosBow",                 Name:"Amos' Bow",                         Lore:"", Star:6,       Type:"Bow"        },
    1002: {File:"aquaSimulacra",           Name:"Aqua Simulacra",                    Lore:"", Star:6,       Type:"Bow"         },
    1003: {File:"aquilaFavonia",           Name:"Aquila Favonia",                    Lore:"", Star:6,        Type:"Sword"         },
    1004: {File:"brokenPines",             Name:"Song of Broken Pines",              Lore:"", Star:6,        Type:"Claymore"        },
    1005: {File:"calamityQueller",         Name:"Calamity Queller",                  Lore:"", Star:6,        Type:"Polearm"        },
    1006: {File:"elergy",                  Name:"Elegy For the End",                 Lore:"", Star:6,       Type:"Bow"         },
    1007: {File:"engulfing",               Name:"Engulfing Lightning",               Lore:"", Star:6,        Type:"Polearm"         },
    1008: {File:"floatingDreams",          Name:"A Thousand Floating Dreams",        Lore:"", Star:6,       Type:"Catalyst"       },
    1009: {File:"freedomSworn",            Name:"Freedom-Sworn",                     Lore:"", Star:6,     Type:"Sword"         },
    1010: {File:"haranGeppaku",            Name:"Haran Geppaku Futsu",               Lore:"", Star:6,    Type:"Sword"         },
    1011: {File:"homa",                    Name:"Staff of Homa",                     Lore:"", Star:6,       Type:"Polearm"         },
    1012: {File:"jadeSpear",               Name:"Primordial Jade Winged-Spear",      Lore:"", Star:6,      Type:"Polearm"       },
    1013: {File:"kaguraVerity",            Name:"Kagura's Verity",                   Lore:"", Star:6,      Type:"Catalyst"        },
    1014: {File:"polarStar",               Name:"Polar Star",                        Lore:"", Star:6,     Type:"Bow"        },
    1015: {File:"tulaytullah",             Name:"Tulaytullah's Remembrance",         Lore:"", Star:6,     Type:"Catalyst"       },
    1016: {File:"vortexVanquisher",        Name:"Vortex Vanquisher",                 Lore:"", Star:6,      Type:"Polearm"      },
    1017: {File:"redhorn",                 Name:"Redhorn Stonethresher",             Lore:"", Star:6,      Type:"Claymore"      },
    1018: {File:"wolfgs",                  Name:"Wolf's Gravestone",                 Lore:"", Star:6,      Type:"Claymore"      },
// SHOP WEAPONS ^^^ ||| REGULAR WEAPONS vvv
    1101: {File:"skywardBlade",            Name:"Skyward Blade",                     Lore:"",        Star:5,  Type:"Sword"                                                },
    1102: {File:"skywardAtlas",            Name:"Skyward Atlas",                     Lore:"",        Star:5,  Type:"Catalyst"                                             },
    1201: {File:"mappa",                   Name:"Mappa Mare",                        Lore:"",        Star:4,  Type:"Catalyst"                                              },
    1202: {File:"rust",                    Name:"Rust",                              Lore:"",        Star:4,  Type:"Bow"                                                   },
    1301: {File:"ferrous",                 Name:"Ferrous Shadow",                    Lore:"",        Star:3,  Type:"Claymore"                                             },
    1302: {File:"coolSteel",               Name:"Cool Steel",                        Lore:"",        Star:3,  Type:"Sword"                                                 },
    1303: {File:"harbingerDawn",           Name:"Harbinger of Dawn",                 Lore:"",        Star:3,  Type:"Sword"                                                },
    1304: {File:"travelerHandySword",      Name:"Traveler's Handy Sword",            Lore:"",        Star:3,  Type:"Sword"                                                 },
    1305: {File:"sacSword",                Name:"Sacrificial Sword",                 Lore:"",        Star:3,  Type:"Sword"                                                 },
    1306: {File:"lionsRoar",               Name:"Lion's Roar",                       Lore:"",        Star:3,  Type:"Sword"                                                },
    1351: {File:"silverSword",             Name:"Silver Sword",                      Lore:"",        Star:2,  Type:"Sword"                                                 },
    1401: {File:"dullSword",               Name:"Dull Sword",                        Lore:"",        Star:1,  Type:"Sword"                                                },
// RMB TO UPDATE MAX CONSTANTS
    2001: {File:"deepwoodGoblet",          Name:"Lamp of the Lost",                  Lore:"",        Star:5                                                                  },
    2002: {File:"crimFeather",             Name:"Witch's Ever-Burning Plume",        Lore:"",        Star:5                                                                  },
    2051: {File:"gladiatorFlower",         Name:"Gladiator's Nostalgia",             Lore:"",        Star:4                                                                  },
// RMB TO UPDATE MAX CONSTANTS
    3051: {File:"masalaCheese",            Name:"Masala Cheese Balls",               Lore:"",        Star:2                                                     ,BuffTemp:10},
    3052: {File:"jueyunChili",             Name:"Jueyun Chili Chicken",              Lore:"",        Star:2                                                     ,BuffTemp:10},
// RMB TO UPDATE MAX CONSTANTS
    4003: {File:"wandererEXP",             Name:"Wanderer's Advice",                 Lore:"Provides a few free levels: (Free Levels do not cost Nuts to purchase)",   Star:2  ,BuffLvlLow:1,BuffLvlHigh:3},
    4002: {File:"adventureEXP",            Name:"Adventurer's Experience",           Lore:"Provides some free levels: (Free Levels do not cost Nuts to purchase)",    Star:3  ,BuffLvlLow:6,BuffLvlHigh:10},
    4001: {File:"heroEXP",                 Name:"Hero's Wit",                        Lore:"Provides many free levels: (Free Levels do not cost Nuts to purchase)",    Star:4  ,BuffLvlLow:15,BuffLvlHigh:20},
// SHOP ITEMS vvv
    5001: {File:"any5",          Name:"Brilliant Diamond Gemstone",                  Lore:"",        Star:6,                   element:"Any"          },
    5002: {File:"any4",          Name:"Brilliant Diamond Chunck",                    Lore:"",      Star:5,                   element:"Any"          },
    5003: {File:"pyro5",         Name:"Agnidus Agate Gemstone",                      Lore:"",      Star:5,                   element:"Pyro"         },
    5004: {File:"hydro5",        Name:"Varunada Lazurite Gemstone",                  Lore:"",       Star:5,                   element:"Hydro"         },
    5005: {File:"dendro5",       Name:"Nagadus Emerald Gemstone",                    Lore:"",        Star:5,                    element:"Dendro"         },
    5006: {File:"electro5",      Name:"Vajrada Amethyst Gemstone",                   Lore:"",         Star:5,                    element:"Electro"         },
    5007: {File:"anemo5",        Name:"Vayuda Turquoise Gemstone",                   Lore:"",       Star:5,                     element:"Anemo"         },
    5008: {File:"cryo5",         Name:"Shivada Jade",                                Lore:"",      Star:5,                                element:"Cryo"         },
    5009: {File:"geo5",          Name:"Prithiva Topaz",                              Lore:"",     Star:5,                              element:"Geo"         },
    5010: {File:"pyro4",         Name:"Agnidus Agate Chunk",                         Lore:"",      Star:4,                      element:"Pyro"      },
    5011: {File:"hydro4",        Name:"Varunada Lazurite Chunk",                     Lore:"",       Star:4,                    element:"Hydro"      },
    5012: {File:"dendro4",       Name:"Nagadus Emerald Chunk",                       Lore:"",        Star:4,                     element:"Dendro"      },
    5013: {File:"electro4",      Name:"Vajrada Amethyst Chunk",                      Lore:"",         Star:4,                    element:"Electro"      },
    5014: {File:"anemo4",        Name:"Vayuda Turquoise Chunk",                      Lore:"",       Star:4,                     element:"Anemo"      },
    5015: {File:"cryo4",         Name:"Shivada Jade Chunk",                          Lore:"",      Star:4,                       element:"Cryo"      },
    5016: {File:"geo4",          Name:"Prithiva Topaz Chunk",                        Lore:"",     Star:4,                        element:"Geo"      },
// TALENT TEMS vvv
    6001: {File:"liyueTal4",     Name:"Philosophies of Prosperity",                  Lore:"",    Star:4,                         nation:"Liyue"  }, 
    6002: {File:"mondTal4",      Name:"Philosophies of Freedom",                     Lore:"",   Star:4,                          nation:"Mondstadt" },
    6003: {File:"sumeruTal4",    Name:"Philosophies of Admonition",                  Lore:"",     Star:4,                         nation:"Sumeru" },
    6004: {File:"inazumaTal4",   Name:"Philosophies of Transience",                  Lore:"",      Star:4,                        nation:"Inazuma" },
    6005: {File:"liyueTal3",     Name:"Guide to Diligence",                          Lore:"",    Star:3,                           nation:"Liyue"    },
    6006: {File:"mondTal3",      Name:"Guide to Resistance",                         Lore:"",   Star:3,                           nation:"Mondstadt"    },
    6007: {File:"sumeruTal3",    Name:"Guide to Ingenuity",                          Lore:"",     Star:3,                         nation:"Sumeru"    },
    6008: {File:"inazumaTal3",   Name:"Guide to Elegance",                           Lore:"",      Star:3,                        nation:"Inazuma"    },
    6009: {File:"liyueTal2",     Name:"Teachings of Gold",                           Lore:"",    Star:2,                         nation:"Liyue"    },
    6010: {File:"mondTal2",      Name:"Teachings of Ballad",                         Lore:"",   Star:2,                         nation:"Mondstadt"    },
    6011: {File:"sumeruTal2",    Name:"Teachings of Praxis",                         Lore:"",     Star:2,                       nation:"Sumeru"    },
    6012: {File:"inazumaTal2",   Name:"Teachings of Light",                          Lore:"",      Star:2,                      nation:"Inazuma"    },

};

var eventText = {
    1: "Oh no! A strong wind current has swept through the desert and caused things to fall from the sky!",
    2: "A surge of power courses through Nahida - She feels empowered! ",
    3: "Let's play a game! Do you have a good reaction time?",
    4: "We found some mysterious boxes in the wild! Shall we open them?",
    5: "A whopperflower infestation has occured in the area - please help to identify them!",
    6: "Weasel thieves has been hoarding the Ajilenakh Nuts for themselves, we need to catch them!",
}

var expeditionDictDefault = {
    1:{Text:"Explore Teyvat | 100 "                  ,Locked:"0" ,Lore:"The legend of the Golden Nut is from a bygone era. Some on-the-ground research is certainly needed if you wanted even a slither of a chance to find the mythical fruit."},
    2:{Text:"Ask the Adventurers' Guild | 250 "      ,Locked:"0" ,Lore:"Tapping into the resources of the Adventurer's Guild's network is one way to widen the scope of the search as the more eyes, the better."},
    3:{Text:"Challenge Domains | 500 "               ,Locked:"1" ,Lore:"Clues about the origin of the Golden Nut are said to have been hidden deep inside some mysterious domain. Exploring it will likely be the next step in unravelling the fruit's location."},
    4:{Text:"Hunt Boss Enemies | 750 "               ,Locked:"1" ,Lore:"The last confirmed sighting of the Golden Nut was in the heart of the woods, which is currently being guarded by a ferocious beast. It may well be the only stone left unturned."},
    5:{Text:"Abyss Diving | 1000 "                   ,Locked:"1" ,Lore:"All trails seem to end here. With nowhere else to go, the Abyss is the sole place left where the fruit is likely to be. Search through the floors with the help of an unlikely ally."},
    6:{Text:"Locked"                                 ,Locked:"0" ,Lore:"Perhaps this path will open after some time..."            },
    7:{Text:""                                       ,Locked:"0" ,Lore:""            },
}

var achievementListDefault = {
    1: {Name:"Nut Collector",                         Description:"Collect 10 nuts"                            },
    2: {Name:"Fan of Nuts",                           Description:"Collect 1000 nuts"                          },
    3: {Name:"Nut Gatherer",                          Description:"Collect 10,000 nuts"                        },
    4: {Name:"Nut Accumulator",                       Description:"Collect 1 million nuts"                     },
    5: {Name:"Nut Hobbyist",                          Description:"Collect 100 million nuts"                   },
    6: {Name:"Nut Addict",                            Description:"Collect 1 billion nuts"                     },
    7: {Name:"Nut Fancier",                           Description:"Collect 100 billion nuts"                   },
    8: {Name:"Lord of the Nuts",                      Description:"Collect 1 trillion nuts"                    },
    9: {Name:"Nut Authority",                         Description:"Collect 100 trillion nuts"                  },
    10: {Name:"Nut Connoisseur",                      Description:"Collect 1 quadrillion nuts"                 },
    11: {Name:"Devotee of Nuts",                      Description:"Collect 100 quadrillion nuts"               },
    12: {Name:"Aficionado of Nuts",                   Description:"Collect 1 quintillion nuts"                 },
    13: {Name:"Nut Pundit",                           Description:"Collect 100 quintillion nuts"               },
    14: {Name:"Nut Antiquarian",                      Description:"Collect 1 sextillion nuts"                  },
    15: {Name:"Nut Savant",                           Description:"Collect 100 sextillion nuts"                },
    16: {Name:"Nut Archon",                           Description:"Collect 1 septillion nuts"                  },
    101: {Name:"dasdasd",                             Description:"Reach 1 NpS"                                },
    102: {Name:"sdasasd",                             Description:"Reach 10 NpS"                               },
    103: {Name:"sdsdsds",                             Description:"Reach 100 NpS"                              },
    104: {Name:"sds",                                 Description:"Reach 10,000 NpS"                           },
    105: {Name:"",                                    Description:"Reach 100,000 NpS"                          },
    106: {Name:"",                                    Description:"Reach 1 million NpS"                        },
    107: {Name:"",                                    Description:"Reach 100 million NpS"                      },
    108: {Name:"",                                    Description:"Reach 1 billion NpS"                        },
    109: {Name:"",                                    Description:"Reach 100 billion NpS"                      },
    110: {Name:"",                                    Description:"Reach 1 trillion NpS"                       },
    111: {Name:"",                                    Description:"Reach 100 trillion NpS"                     },
    112: {Name:"",                                    Description:"Reach 1 quadrillion NpS"                    },
    113: {Name:"",                                    Description:"Reach 100 quadrillion NpS"                  },
    114: {Name:"",                                    Description:"Reach 1 quintillion NpS"                    },
    115: {Name:"",                                    Description:"Reach 100 quintillion NpS"                  },
    116: {Name:"Champion of Tevyat",                  Description:"Reach 1 sextillion NpS"                     },
    201: {Name:"",                                    Description:"Click 10 times"                             },
    202: {Name:"",                                    Description:"Click 100 times"                            },
    203: {Name:"",                                    Description:"Click 500 times"                            },
    204: {Name:"",                                    Description:"Click 1000 times"                           },
    205: {Name:"",                                    Description:"Click 2500 times"                           },
    206: {Name:"",                                    Description:"Click 5000 times"                           },
    207: {Name:"",                                    Description:"Click 7500 times"                           },
    208: {Name:"",                                    Description:"Click 10,000 times"                         },
    209: {Name:"",                                    Description:"Click 15,000 times"                         },
    210: {Name:"Master of Cultivation",               Description:"Click 20,000 times"                         },
    301: {Name:"The Longest Achievement Name Ever",   Description:"Upgrade 1 time"                             },
    302: {Name:"",                                    Description:"Upgrade 10 times"                           },
    303: {Name:"",                                    Description:"Upgrade 100 times"                          },
    304: {Name:"",                                    Description:"Upgrade 250 times"                          },
    305: {Name:"",                                    Description:"Upgrade 500 times"                          },
    306: {Name:"",                                    Description:"Upgrade 750 time"                           }, 
    307: {Name:"",                                    Description:"Upgrade 1000 times"                         },
    308: {Name:"",                                    Description:"Upgrade 1500 times"                         },
    309: {Name:"",                                    Description:"Upgrade 2000 times"                         },
    310: {Name:"Heart of Dendro",                     Description:"Upgrade 2500 times"                         },
    401: {Name:"",                                    Description:"Obtain 1 Golden Nut"                        },
    402: {Name:"Three of a Kind",                     Description:"Obtain 3 Golden Nuts"                       },
    403: {Name:"The Seven",                           Description:"Obtain 7 Golden Nuts"                       },
    404: {Name:"",                                    Description:"Obtain 15 Golden Nuts"                      },
    405: {Name:"",                                    Description:"Obtain 30 Golden Nuts"                      },
    406: {Name:"Golden Harvest",                      Description:"Obtain 50 Golden Nuts"                      },
    407: {Name:"",                                    Description:"Obtain 75 Golden Nuts"                      },
    408: {Name:"Golden Experience",                   Description:"Obtain 100 Golden Nuts"                     },
}

export { upgradeDictDefault,SettingsDefault,InventoryDefault,expeditionDictDefault,achievementListDefault,saveValuesDefault,eventText,upgradeInfo };