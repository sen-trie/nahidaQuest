
const commisionDict = {
    'Alhaitham':{
        currentComm: '',
        affection: 0, 
        stamina: 100,
    },
    'Candace':{
        currentComm: '',
        affection: 0, 
        stamina: 100,
    },
    'Collei':{
        currentComm: '',
        affection: 0, 
        stamina: 100,
    },
    'Cyno':{
        currentComm: '',
        affection: 0, 
        stamina: 100,
    },
    'Dehya':{
        currentComm: '',
        affection: 0, 
        stamina: 100,
    },
    'Dori':{
        currentComm: '',
        affection: 0, 
        stamina: 100,
    },
    'Faruzan':{
        currentComm: '',
        affection: 0, 
        stamina: 100,
    },
    'Kaveh':{
        currentComm: '',
        affection: 0, 
        stamina: 100,
    },
    'Layla':{
        currentComm: '',
        affection: 0, 
        stamina: 100,
    },
    'Nahida':{
        currentComm: '',
        affection: 50, 
        stamina: 100,
    },
    'Nilou':{
        currentComm: '',
        affection: 0, 
        stamina: 100,
    },
    'Tighnari':{
        currentComm: '',
        affection: 0, 
        stamina: 100,
    },
    'Wanderer':{
        currentComm: '',
        affection: 0, 
        stamina: 100,
    },
}

const treeObj = {
    level: 0,
    element: null,
    growth: 0,
    growthRate: 1,
    defense: false,
    energy: 100,
    health: 100,
    offerAmount: 0,
    offer: [],
    // PYRO, HYDRO, DENDRO, ELECTRO, ANEMO, CRYO, GEO
    elementAffinity: [1,1,1,1,1,1,1]
}

const saveValuesDefault = {
    versNumber:0,
    clickCount:0,
    clickFactor:1,
    dps:0,
    realScore:0,
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
    treeObj: treeObj,
    baseCommisions: [],
    extraCommisions: [],
    currentCommisions: [],
}

const persistentValuesDefault = {
    goldenCore: 0,
    tutorialRanged: false,
    tutorialBasic: false,
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
    upgrade12:{Purchased: 0},
    treeSeeds:[0,0,0,0,0,0],
    leylinePower: 100,
    harvestCount: 0,
    ascendEle:{ "Pyro":0, "Hydro":0, "Dendro":0, "Electro":0, "Anemo":0, "Cryo":0, "Geo":0 },
    ascendDict:{
        "Nahida":0,
        "Traveller":0,
        "Collei":0,
        "Tighnari":0,
        "Dori":0,
        "Candace":0,
        "Cyno":0,
        "Nilou":0,
        "Layla":0,
        "Faruzan":0,
        "Alhaitham":0,
        "Amber":0,
        "Noelle":0,
        "Barbara":0,
        "Diluc":0,
        "Lisa":0,
        "Kaeya":0,
        "Diona":0,
        "Bennett":0,
        "Sucrose":0,
        "Fischl":0,
        "Mona":0,
        "Klee":0,
        "Razor":0,
        "Rosaria":0,
        "Venti":0,
        "Xiangling":0,
        "Xingqiu":0,
        "Chongyun":0,
        "Hu Tao":0,
        "Xinyan":0,
        "Yun Jin":0,
        "Beidou":0,
        "Ningguang":0,
        "Ganyu":0,
        "Keqing":0,
        "Yanfei":0,
        "Yaoyao":0,
        "Zhongli":0,
        "Thoma":0,
        "Ayaka":0,
        "Yoimiya":0,
        "Sayu":0,
        "Gorou":0,
        "Kokomi":0,
        "Heizou":0,
        "Shinobu":0,
        "Itto":0,
        "Sara":0,
        "Ei":0,
        "Wanderer":0,
        "Albedo":0,
        "Qiqi":0,
        "Yelan":0,
        "Shenhe":0,
        "Ayato":0,
        "Yae Miko":0,
        "Eula":0,
        "Kazuha":0,
        "Xiao":0,
        "Tartaglia":0,
        "Jean":0,
        "Dehya":0,
        "Mika":0,
        "Kaveh":0,
        "Baizhu":0,
        "Kirara":0,
    },
    commisionDict: commisionDict,
}

const SettingsDefault = {
    bgmVolume:0.5,
    sfxVolume:0.5,
    defaultZoom: 50,
    combineFloatText:false,
    preferOldPic: true,
    showFallingNuts: true,
    showWishAnimation: true,
}

const advDictDefault = {
    adventureRank: 1,
    advXP: 0,
    bounty:[],
    bountyTime: 0,
    morale:50,
    rankDict: {
        1:{Locked:false},
        2:{Locked:true},
        3:{Locked:true},
        4:{Locked:true},
        5:{Locked:true},
        6:{Locked:true},
        7:{Locked:true},
        8:{Locked:true},
        9:{Locked:true},
        10:{Locked:true},
        11:{Locked:true},
        12:{Locked:true},
        13:{Locked:true},
        14:{Locked:true},
        15:{Locked:true},
        16:{Locked:true},
        17:{Locked:true},
        18:{Locked:true},
        19:{Locked:true},
        20:{Locked:true},
    }
}

const permUpgrades = {
    1:{Name:"Blessing of Vitality",        Effect:5,  Max:50,   Cap:false,   Description:"Increases Energy gained by clicking Big Nahida."},
    2:{Name:"Blessing of Technique",       Effect:3,  Max:50,    Cap:true,   Description:"Increase clicking DMG during Combat Expeditions."},
    3:{Name:"Blessing of Wanderlust",      Effect:0.5, Max:50,   Cap:true,   Description:"Decreases base price of Wish characters."},
    4:{Name:"Blessing of Concession",      Effect:2,   Max:25,   Cap:true,   Description:"Decreases price of Dori's Shop items and random trades."},
    5:{Name:"Blessing of Might",           Effect:1,   Max:50,   Cap:true,   Description:"Increases critical rate amount for clicking Big Nahida.",   zeroDescription:"Enables critical hits for clicking Big Nahida."},
    6:{Name:"Blessing of Tranquillity",    Effect:1,   Max:50,   Cap:false,   Description:"Increases offline Nut accumulation rate.",    zeroDescription:"Enables accumulation of Nuts while offline."},
    7:{Name:"Blessing of Fortuity",        Effect:0.5, Max:50,   Cap:true,   Description:"Increases chances of lucky outcomes.",          zeroDescription:"Enables additional lucky outcomes for certain events."},
    8:{Name:"Blessing of Enlightenment",   Effect:2,   Max:25,   Cap:true,   Description:"Decreases cooldown between Event spawns."},
    9:{Name:"Blessing of Riches",          Effect:10,  Max:25,   Cap:true,   Description:"Increases Primogems gained from Events/Achievements."},
    10:{Name:"Blessing of Strength",       Effect:10,  Max:25,   Cap:false,   Description:"Increases effectiveness of Weapons and Talents."},
    11:{Name:"Blessing of Fortification",  Effect:10,  Max:25,   Cap:false,   Description:"Increases effectiveness of Artifacts, Gems and Food."},
    12:{Name:"Blessing of Determination",  Effect:2,  Max:50,   Cap:false,   Description:"Increase XP gain from Expeditions attempts."},
}

const expeditionDictDefault = {
    1:"0",
    2:"0",
    3:"1",
    4:"1",
    5:"1",
    6:"1",
    7:"0",
    8:"0",
    9:"1",
    10:"0",
    12:"0",
    13:"0",
    14:"0",
}

const storeInventoryDefault = {
    active:false,
    storedTime:0,
    1:{Purchased:false, Item:0, Cost:0},
    2:{Purchased:false, Item:0, Cost:0},
    3:{Purchased:false, Item:0, Cost:0},
    4:{Purchased:false, Item:0, Cost:0},
    5:{Purchased:false, Item:0, Cost:0},
    6:{Purchased:false, Item:0, Cost:0},
    7:{Purchased:false, Item:0, Cost:0},
    8:{Purchased:false, Item:0, Cost:0},
    9:{Purchased:false, Item:0, Cost:0},
    10:{Purchased:false, Item:0, Cost:0},
}

const enemyInfo = {
    bountyKey: {
        0:["Fungi-Mob.4","Specter-Mob.5","Hilichurl-Mob.4","Hoarder-Mob.4"],
        1:["Eremite-Mob.2","Fatui-Mob.5","Fatui-Leader.4","Hilichurl-Leader.3","Automaton-Mob.3"],
        2:["Fatui-Leader.4","Hilichurl-Leader.3","MAbyss-Leader.4","Eremite-Mob.2","Fungi-Leader.2"],
        3:["Hilichurl-Boss.2","Fungi-Boss.1","Eremite-Leader.3","MAbyss-Leader.4","SAutomaton-Mob.3"],
        4:["WAbyss-Mob.2","WAbyss-Leader.2","WAbyss-Boss.1","HAbyss-Mob.3","HAbyss-Leader.3"],
        5:["Automaton-Boss.1","SAutomaton-Boss.2","Eremite-Boss.3"],
    },

    quicktimeDict: {
        3:{
            1:[0.41,0.48],
            2:[0.45,0.44,0.47],
            3:[0.44,0.45,0.46,0.50],
        },
        4:{
            1:[0.42,0.44,0.52,0.54,0.50],
            2:[0.48,0.42,0.47,0.51],
            3:[0.44,0.49,0.45],
            4:[0.48,0.51],
        },
        5:{
            1:[0.51,0.56],
            2:[0.44,0.52,0.52,0.41],
            3:[0.49,0.35,0.47,0.53],
            4:[0.53,0.53,0.53],
            5:[0.36,0.40,0.45,0.53,0.57],
        },
        13:{
            1:[0.54,0.56],
            2:[0.52,0.54,0.56],
            3:[0.50,0.53,0.57],
            4:[0.55,0.47,0.60],
        },
        14:{
            1:[0.54,0.56],
            2:[0.52,0.54,0.56],
            3:[0.50,0.53,0.57],
            4:[0.55,0.47,0.60],
        },
        'Unusual': {
            1:[0.45,0.53,0.57,0.45,0.53,0.57,0.57],
            2:[0.45,0.55,0.55,0.45,0.55,0.55],
            3:[0.50,0.53,0.50,0.53,0.50,0.53,0.50,0.53],
        }
    },

    // LVL 1
    "1-Wave-1":{Wave:[101,101,101],         BG:[1,4]},
    "1-Wave-2":{Wave:[121,121,121],         BG:[1,4]},
    "1-Wave-3":{Wave:[111,111,111],         BG:[3,6]},
    "1-Wave-4":{Wave:[111,112],             BG:[3,6]},
    "1-Wave-5":{Wave:[121,121],             BG:[6,7]},
    "1-Wave-6":{Wave:[131,131,131],         BG:[4,7]},
    101:{Class:"Mob",       Variation:4,   Type:"Fungi",       HP:70,    ATK:0.5,   AtkCooldown:50},
    111:{Class:"Mob",       Variation:4,   Type:"Hilichurl",   HP:100,   ATK:0.5,   AtkCooldown:40},
    112:{Class:"Leader",    Variation:3,   Type:"Hilichurl",   HP:140,   ATK:1,     AtkCooldown:45},
    121:{Class:"Mob",       Variation:5,   Type:"Specter",     HP:200,   ATK:1,     AtkCooldown:50},
    131:{Class:"Mob",       Variation:4,   Type:"Hoarder",     HP:100,   ATK:1,     AtkCooldown:40},
    // LVL 2
    "2-Wave-1":{Wave:[201,202,201],         BG:[1,5]},
    "2-Wave-2":{Wave:[202,202],             BG:[1,5]},
    "2-Wave-3":{Wave:[212,211,212],         BG:[2,4]},
    "2-Wave-4":{Wave:[211,211,211,211],     BG:[4,6]},
    "2-Wave-5":{Wave:[222,222],             BG:[6,7]},
    "2-Wave-6":{Wave:[221,221,221,221],     BG:[6,7]},
    "2-Wave-7":{Wave:[231,202,231],         BG:[4,7]},
    201:{Class:"Mob",       Variation:2,   Type:"Eremite",     HP:150,   ATK:1,     AtkCooldown:50},
    202:{Class:"Leader",    Variation:3,   Type:"Eremite",     HP:250,   ATK:1.5,   AtkCooldown:35},
    211:{Class:"Mob",       Variation:5,   Type:"Fatui",       HP:150,   ATK:1,     AtkCooldown:50},
    212:{Class:"Leader",    Variation:4,   Type:"Fatui",       HP:300,   ATK:1.5,   AtkCooldown:30},
    221:{Class:"Mob",       Variation:3,   Type:"Automaton",   HP:150,   ATK:1,     AtkCooldown:50},
    222:{Class:"Leader",    Variation:3,   Type:"Automaton",   HP:300,   ATK:1.5,   AtkCooldown:30},
    231:{Class:"Mob",       Variation:4,   Type:"Hoarder",     HP:150,   ATK:1,     AtkCooldown:50},
    // LVL 3
    "3-Wave-1":{Wave:[301,301,301,301],     BG:[1,4]},
    "3-Wave-2":{Wave:[302,301,302],         BG:[1,4]},
    "3-Wave-3":{Wave:[311,311,312,311],     BG:[2,5]},
    "3-Wave-4":{Wave:[312,311,312],         BG:[2,5]},
    "3-Wave-5":{Wave:[321,322,322,321],     BG:[4,6]},
    "3-Wave-6":{Wave:[322,322,322],         BG:[4,6]},
    "3-Wave-7":{Wave:[331,331,331],         BG:[4,6]},
    "3-Wave-8":{Wave:[341,341,341],         BG:[4,6]},
    301:{Class:"Mob",       Variation:2,   Type:"Eremite",     HP:250,   ATK:1.5,     AtkCooldown:45},
    302:{Class:"Leader",    Variation:3,   Type:"Eremite",     HP:400,   ATK:1.5,     AtkCooldown:30},
    311:{Class:"Mob",       Variation:5,   Type:"Fatui",       HP:200,   ATK:1.5,     AtkCooldown:45},
    312:{Class:"Leader",    Variation:4,   Type:"Fatui",       HP:300,   ATK:2,      AtkCooldown:30},
    321:{Class:"Mob",       Variation:4,   Type:"Hilichurl",   HP:200,   ATK:1.5,     AtkCooldown:45},
    322:{Class:"Leader",    Variation:3,   Type:"Hilichurl",   HP:350,   ATK:2.5,     AtkCooldown:40},
    331:{Class:"Leader",    Variation:4,   Type:"MAbyss",      HP:400,   ATK:1.5,     AtkCooldown:30},
    341:{Class:"Mob",       Variation:3,   Type:"SAutomaton",  HP:500,   ATK:1,       AtkCooldown:30},
    // LVL 4
    "4-Wave-1":{Wave:[401,402,401],         BG:[1,2]},
    "4-Wave-2":{Wave:[411,411,411],         BG:[2,4]},
    "4-Wave-3":{Wave:[412,412],             BG:[2,4]},
    "4-Wave-4":{Wave:[431,431,431,431],     BG:[2,4]},
    "4-Wave-5":{Wave:[431,432,431],         BG:[2,3]},
    401:{Class:"Leader",    Variation:2,   Type:"Fungi",       HP:400,    ATK:1.5,  AtkCooldown:35},
    402:{Class:"Boss",      Variation:1,   Type:"Fungi",       HP:1000,   ATK:2.5,    AtkCooldown:30},
    411:{Class:"Leader",    Variation:3,   Type:"Hilichurl",   HP:700,    ATK:2,    AtkCooldown:35},
    412:{Class:"Boss",      Variation:2,   Type:"Hilichurl",   HP:1000,   ATK:2.5,    AtkCooldown:35},
    // 421:{Class:"Superboss", Variation:1,   Type:"Fatui",       HP:2666,   ATK:2.5,    AtkCooldown:50},
    431:{Class:"Mob",       Variation:3,   Type:"SAutomaton",   HP:700,   ATK:1.5,    AtkCooldown:30},
    432:{Class:"Boss",      Variation:2,   Type:"SAutomaton",   HP:1700,  ATK:2.5,    AtkCooldown:40},
    // LVL 5
    "5-Wave-1":{Wave:[502,502,502],         BG:[3,6]},
    "5-Wave-2":{Wave:[501,503,501],         BG:[3,6]},
    // "5-Wave-3":{Wave:[504],                 BG:[3,6]},
    "5-Wave-4":{Wave:[511,512,512,511],     BG:[3,6]},
    "5-Wave-5":{Wave:[522,522,522],         BG:[1,2]},
    "5-Wave-6":{Wave:[521,523,521],         BG:[1,2]},
    "5-Wave-7":{Wave:[532,532,532],         BG:[2,4]},
    "5-Wave-8":{Wave:[531,532,532,531],     BG:[2,4]},
    501:{Class:"Mob",       Variation:2,   Type:"WAbyss",      HP:600,   ATK:1.5,     AtkCooldown:30},
    502:{Class:"Leader",    Variation:2,   Type:"WAbyss",      HP:1100,   ATK:1.5,     AtkCooldown:40},
    503:{Class:"Boss",      Variation:1,   Type:"WAbyss",      HP:1700,   ATK:2.5,     AtkCooldown:40},
    // 504:{Class:"Superboss", Variation:1,   Type:"WAbyss",      HP:3000,   ATK:2.5,     AtkCooldown:50},
    511:{Class:"Mob",       Variation:3,   Type:"HAbyss",      HP:750,   ATK:1.5,   AtkCooldown:45},
    512:{Class:"Leader",    Variation:3,   Type:"HAbyss",      HP:1300,   ATK:2,     AtkCooldown:40},
    521:{Class:"Mob",       Variation:3,   Type:"Automaton",   HP:800,   ATK:1.5,   AtkCooldown:45},
    522:{Class:"Leader",    Variation:3,   Type:"Automaton",   HP:1200,   ATK:2,     AtkCooldown:40},
    523:{Class:"Boss",      Variation:1,   Type:"Automaton",   HP:2000,   ATK:2.5,   AtkCooldown:42.5},
    531:{Class:"Leader",    Variation:3,   Type:"Eremite",     HP:750,   ATK:1.5,   AtkCooldown:40},
    532:{Class:"Boss",      Variation:3,   Type:"Eremite",     HP:1200,   ATK:1.5,     AtkCooldown:32.5},
    // LVL 13
    "13-Wave-1":{Wave:[1301,1301,1301],         BG:[1,1]},
    "13-Wave-2":{Wave:[1302,1302,1302],         BG:[4,6]},
    1301:{Class:"Leader",       Variation:1,   Type:"Skirmish",      HP:1700,   ATK:2,     AtkCooldown:40},
    1302:{Class:"Leader",       Variation:1,   Type:"Skirmish",      HP:1200,   ATK:1.5,     AtkCooldown:35},
    // LVL 14
    "14-Wave-1":{Wave:[1401],         BG:[1,1]},
    "14-Wave-2":{Wave:[1411],         BG:[2,2]},
    "14-Wave-3":{Wave:[1412],         BG:[2,2]},
    "14-Wave-4":{Wave:[1421],         BG:[3,3]},
    "14-Wave-5":{Wave:[1431],         BG:[4,4]},
    1401:{Class:"Megaboss",       Variation:1,   Type:"FellBoss",      HP:3000,   ATK:2,     AtkCooldown:35},
    1411:{Class:"Megaboss",       Variation:1,   Type:"Unusual",      HP:8500,   ATK:0.5,     AtkCooldown:30},
    1412:{Class:"Minion",          Variation:3,   Type:"Unusual",      HP:1000,   ATK:0.5,     AtkCooldown:45},
    1421:{Class:"Megaboss",       Variation:1,   Type:"Workshop",      HP:3000,   ATK:2,     AtkCooldown:35},
    1431:{Class:"Megaboss",       Variation:1,   Type:"Finale",      HP:3000,   ATK:2,     AtkCooldown:35},
}

const upgradeDictDefault = {
    0:  {Row:-1,        Purchased: -1,   "Contribution": 0, "Level": 1, "BaseCost":20, Factor:1  , BaseFactor:1},
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

export { upgradeDictDefault,SettingsDefault,expeditionDictDefault,saveValuesDefault,enemyInfo,persistentValuesDefault,permUpgrades,advDictDefault,storeInventoryDefault };