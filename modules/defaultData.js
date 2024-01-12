
const commisionDict = {
    'Alhaitham':{
        currentComm: '',
    },
    'Candace':{
        currentComm: '',
    },
    'Collei':{
        currentComm: '',
    },
    'Cyno':{
        currentComm: '',
    },
    'Dehya':{
        currentComm: '',
    },
    'Dori':{
        currentComm: '',
    },
    'Faruzan':{
        currentComm: '',
    },
    'Kaveh':{
        currentComm: '',
    },
    'Layla':{
        currentComm: '',
    },
    'Nahida':{
        currentComm: '',
        affection: 50, 
    },
    'Nilou':{
        currentComm: '',
    },
    'Tighnari':{
        currentComm: '',
    },
    'Wanderer':{
        currentComm: '',
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
    commisionDict: commisionDict,
    currentCommisions: [],
}

const persistentValuesDefault = {
    goldenCore: 0,
    tutorialRanged: false,
    tutorialBasic: false,
    tutorialAscend: false,
    upgrade: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    treeSeeds: [0, 0, 0],
    leylinePower: 100,
    harvestCount: 0,
    ascendEle:{"Pyro": 0, "Hydro": 0, "Dendro": 0, "Electro": 0, "Anemo": 0, "Cryo": 0, "Geo": 0},
    ascendDict:{},
    nahidaSkin: 'New',
    autoFood: false,
    autoClickNahida: false,
    blackMarketDict:{},
    lastRecordedTime: null,
    timeSpentValue: 0,
    lifetimeClicksValue: 0, 
    lifetimeLevelsValue: 0,
    lifetimeEnergyValue: 0,
    lifetimePrimoValue: 0,
    itemsUsedValue: 0,
    aranaraEventValue: 0,
    aranaraLostValue: 0,
    enemiesDefeatedValue: 0,
    commissionsCompletedValue: 0,
    transcendValue: 0,
    fellBossDefeat: false,
    unusualBossDefeat: false,
    workshopBossDefeat: false,
    finaleBossDefeat: false,
    allChallenges: false,
}

const SettingsDefault = {
    bgmVolume:0.5,
    sfxVolume:0.5,
    defaultZoom: 50,
    fontSizeLevel: 5, 
    combineFloatText:false,
    preferOldPic: false,
    showFallingNuts: false, //INVERSED
    showWishAnimation: false, //INVERSED
    autoClickBig: false,
    wideCombatScreen: false,
    leftHandMode: false,
}

const advDictDefault = {
    adventureRank: 1,
    advXP: 0,
    bounty:[],
    bountyTime: 0,
    morale:50,
    rankDict:{},
}

const permUpgrades = {
    1:{Name:"Blessing of Vitality",        Effect:2.5,  Max:50,   Cap:false,   Description:"Increases Energy gained by clicking Big Nahida."},
    2:{Name:"Blessing of Technique",       Effect:2,  Max:50,    Cap:true,   Description:"Increase clicking DMG during Combat Expeditions."},
    3:{Name:"Blessing of Wanderlust",      Effect:0.5, Max:50,   Cap:true,   Description:"Decreases base price of Wish characters."},
    4:{Name:"Blessing of Concession",      Effect:2,   Max:25,   Cap:true,   Description:"Decreases price of Dori's Shop items and random trades."},
    5:{Name:"Blessing of Might",           Effect:1,   Max:50,   Cap:true,   Description:"Increases critical rate amount for clicking Big Nahida.",   zeroDescription:"Enables critical hits for clicking Big Nahida."},
    6:{Name:"Blessing of Tranquillity",    Effect:1,   Max:50,   Cap:false,   Description:"Increases offline Nut accumulation rate.",    zeroDescription:"Enables accumulation of Nuts while offline."},
    7:{Name:"Blessing of Fortuity",        Effect:0.5, Max:50,   Cap:true,   Description:"Increases chances of lucky outcomes.",          zeroDescription:"Enables additional lucky outcomes for certain events."},
    8:{Name:"Blessing of Enlightenment",   Effect:1,   Max:25,   Cap:true,   Description:"Decreases cooldown between Event spawns."},
    9:{Name:"Blessing of Riches",          Effect:5,  Max:25,   Cap:true,   Description:"Increases Primogems gained from Events/Achievements."},
    10:{Name:"Blessing of Strength",       Effect:5,  Max:25,   Cap:false,   Description:"Increases effectiveness of Weapons and Talents."},
    11:{Name:"Blessing of Fortification",  Effect:5,  Max:25,   Cap:false,   Description:"Increases effectiveness of Artifacts, Gems and Food."},
    12:{Name:"Blessing of Determination",  Effect:5,  Max:50,   Cap:false,   Description:"Increase XP and Nuts gain in Expeditions."},
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

    // 1ST POSITION IS FOR TIMING, 2ND IS FOR DELAY, X IS FOR OCCUPIED LANE, O IS FOR EMPTY LANE
    easyCytusDict: [
        [
            [300, 20, 'OXO', 'Circle-', true],
            [275, 25, 'XOX', 'Circle-'],
            [225, 25, 'OXO', 'Circle-', true],
            [325, 20, 'XOX', 'Bullet-'],
            [325, 20, 'OXO', 'Bullet-', true],
            [300, 10, 'XOX', 'Circle-'],
        ], [
            [175, 20, 'OXX', null, true],
            [175, 35, 'XXO', null],
            [175, 35, 'OXX', null, true],
            [175, 35, 'XXO', null],
            [250, 45, 'OOX', 'Boomer-'],
            [325, 15, 'XOO', 'Bullet-', true],
            [275, 5, 'OXX', 'Boomer-'],
        ], [
            [250, 0, 'OXO', 'Bullet-'], 
            [300, 15, 'XOO', 'Bullet-'],
            [300, 5, 'OOX', 'Bullet-', true], 
            [300, 15, 'OXO', 'Bullet-'], 
            [325, 15, 'XOX', 'Bullet-', true],
            [300, 10, 'OXX', 'Bullet-'],
            [350, 5, 'XOO', 'Bullet-', true],  
        ], [
            [175, 20, 'OXX', null, true],
            [175, 30, 'XOX', null, true],
            [175, 30, 'XXO', null, true],
            [250, 55, 'OOX', 'Boomer-'],
            [250, 20, 'OXO', 'Circle-'],
            [250, 65, 'XOO', 'Boomer-', true],
        ],
    ],

    hardCytusDict: [
        [
            [350, 20, 'XXO', null, true],
            [300, 20, 'OOX', 'Circle-'],
            [300, 25, 'OXX', 'Circle-'],
            [300, 25, 'XOX', 'Circle-'],
            [300, 25, 'XXO', 'Circle-'],
            [300, 25, 'XOX', 'Circle-'],
            [300, 85, 'OXO', 'Boomer-', true],
            [300, 35, 'XOX', 'Boomer-'],
            [300, 35, 'OXO', 'Boomer-', true],
        ],[
            [400, 0, 'OXO', 'Bullet-'], 
            [300, 30, 'XXO', null],
            [300, 20, 'OXX', 'Circle-'],
            [300, 50, 'XOX', null],
            [250, 30, 'OXX', 'Bullet-'],
            [300, 15, 'XXO', null, true],
            [300, 30, 'XOX', null, true],
            [300, 55, 'OXX', 'Boomer-'],
        ],[   
            [300, 15, 'OXX', 'Bullet-'],
            [350, 25, 'XOX', null],
            [300, 25, 'XXO', 'Bullet-', true],
            [300, 15, 'OXX', 'Bullet-'],
            [500, 25, 'XXO', null],
            [300, 15, 'XOX', 'Bullet-', true],
            [400, 15, 'OXX', null],
            [300, 25, 'XXO', 'Circle-', true],
            [300, 35, 'OXX', 'Circle-'],
            [300, 35, 'XXO', 'Circle-'],
            [300, 35, 'XOX', 'Circle-', true],
        ],[
            [300, 20, 'OXX', null],
            [300, 17, 'OOX', null],
            [300, 17, 'XOX', null],
            [300, 17, 'XOO', null],
            [300, 0, 'OOX', 'Boomer-', true],
            [300, 17, 'XXO', null],
            [300, 17, 'XOO', null],
            [300, 17, 'XOX', null],
            [300, 17, 'OOX', null],
            [300, 17, 'OXX', null],
            [300, 17, 'OOX', null],
            [300, 17, 'XOX', null],
            [300, 0, 'XOO', 'Boomer-', true],
            [300, 17, 'XOO', null],
            [300, 17, 'XXO', null],
            [300, 60, 'OXX', 'Bullet-', true],
            [300, 10, 'XOX', 'Bullet-'],
            [350, 10, 'OXX', 'Boomer-'],
        ], [
            [270, 20, 'XOX', 'Bullet-', true],
            [270, 0, 'XOX', 'Bullet-'],
            [270, 20, 'OXX', 'Boomer-', true],
            [270, 0, 'OXX', 'Boomer-'],
            [270, 35, 'XOX', 'Bullet-', true],
            [270, 0, 'XOX', 'Bullet-'],
            [270, 40, 'XXO', 'Boomer-', true],
            [270, 0, 'XXO', 'Boomer-'],
            [270, 20, 'XOX', 'Bullet-', true],
            [270, 0, 'XOX', 'Bullet-'],
            [250, 20, 'OXX', 'Circle-', true],
            [250, 0, 'OXX', 'Circle-'],
        ]
    ],

    veryHardCytusDict: [[
        [300, 20, 'XOX', null],
        [300, 17, 'XOX', null],
        [300, 17, 'XOO', null],
        [280, 2, 'XXO', 'Bullet-'],
        [320, 5, 'OOX', 'Boomer-', true],
        [300, 5, 'XOX', null],
        [300, 17, 'XOX', null],
        [300, 17, 'XOX', null],
        [300, 17, 'XOO', null],
        [220, 2, 'XXO', 'Bullet-', true],
        [300, 5, 'XOX', null],
        [300, 17, 'XOX', null],
        [300, 22, 'XXO', null],
        [300, 22, 'XOX', null],
        [300, 0, 'OXO', 'Circle-', true],
        [200, 0, 'XOX', 'Circle-'],
        [300, 32, 'XOX', null],
        [300, 32, 'XOX', null, true],
        [350, 40, 'OXO', 'Boomer-', true],
        [350, 30, 'XOX', 'Boomer-'],
        [280, 2, 'XOX', 'Circle-'],
        [320, 15, 'OOX', 'Bullet-', true],
        [320, 20, 'OXO', 'Bullet-'],
        [320, 30, 'OXX', 'Circle-', true],
        [300, 0, 'XXO', 'Boomer-'],
        [320, 20, 'OXO', 'Bullet-', true],
        [320, 1, 'XOO', 'Bullet-', true],
        [320, 20, 'XOX', 'Circle-'],
        [320, 1, 'XXO', 'Bullet-'],
    ]],

    // HIGHER 3RD NUMBER MEANS SLOWER
    hardOsuArray: [
        [
            [50, 30, 450], [45, 35, 450], [40, 40, 450], [35, 50, 450],
            [20, 10, 400, 650], [30, 15, 400], [40, 20, 400], [50, 25, 400], 
            [70, 50, 475, 800], [60, 40, 475], [50, 50, 475], [40, 40, 475], [30, 50, 475],
            [60, 15, 425, 700], [50, 25, 425], [60, 35, 425], [50, 45, 425], [60, 55, 425]
        ],
        [
            [50, 30, 450], [40, 50, 450], [30, 30, 450],
            [18, 30, 475], [40, 60, 475], [62, 30, 475],
            [65, 30, 475, 450], [40, 5, 475], [15, 30, 475], [40, 65, 475],
            [62, 30, 475], [40, 60, 475], [18, 30, 475]
        ],[
            [10, 10, 440], [26, 20, 450], [42, 30, 460], [58, 40, 470], [72, 50, 470],
            [72, 10, 470, 500], [58, 20, 470], [42, 30, 460], [26, 40, 450], [10, 50, 440], 
        ],[
            [30, 10, 470], [10, 35, 470], [60, 60, 470], [80, 35, 470], [40, 35, 470],
            [10, 35, 470, 600], [30, 60, 470], [80, 35, 470], [60, 10, 470], [40, 35, 470],
        ],
    ],

    easyOsuArray: [
        [
            [50, 30, 475], [45, 35, 475], [40, 40, 475], 
            [20, 10, 425, 1000], [30, 15, 425], [40, 20, 425], 
            [70, 50, 500, 1000], [60, 40, 500], [50, 50, 500], [40, 40, 500],
            [60, 15, 475, 800], [50, 25, 475], [60, 35, 475], [50, 45, 475]
        ],[
            [50, 30, 450], [40, 50, 450], [30, 30, 450],
            [18, 30, 500, 800], [40, 60, 500], [62, 30, 500],
            [65, 30, 500, 800], [40, 5, 500], [15, 30, 500], [40, 65, 500]
        ],[
            [10, 10, 500], [18, 15, 500], [26, 20, 510],
            [34, 25, 510], [42, 30, 520], [50, 35, 520],
            [58, 40, 525], [66, 45, 525], [72, 50, 530],
        ],[
            [30, 10, 560], [10, 35, 560], [60, 60, 560], [80, 35, 560],
            [10, 35, 560, 1000], [30, 60, 560], [80, 35, 560], [60, 10, 560],
        ],
    ],

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
            1:[0.54,0.56,0.53],
            2:[0.52,0.54,0.56],
            3:[0.50,0.53,0.57],
            4:[0.55,0.47,0.60],
            5:[0.52,0.54,0.53,0.53],
        },
        'Unusual': {
            1:[0.45,0.53,0.57,0.45,0.53,0.57,0.57],
            2:[0.45,0.55,0.55,0.45,0.55,0.55],
            3:[0.50,0.53,0.50,0.53,0.50,0.53,0.50,0.53],
        },
        'Finale': {
            1:[0.45,0.53,0.57,0.45,0.53,0.57,0.57],
            2:[0.45,0.55,0.45,0.55,0.45,0.55],
            3:[0.54,0.54,0.50,0.54,0.50,0.54,0.50,0.54],
            4:[0.40,0.43,0.46,0.49,0.52,0.54,0.57],
        }
    },

    // LVL 1, INCLUSIVE BG
    "1-Wave-1":{Wave:[101,101,101],         BG:[1,3]},
    "1-Wave-2":{Wave:[121,121,121],         BG:[1,3]},
    "1-Wave-3":{Wave:[111,111,111],         BG:[3,5]},
    "1-Wave-4":{Wave:[111,112],             BG:[3,5]},
    "1-Wave-5":{Wave:[121,121],             BG:[6,6]},
    "1-Wave-6":{Wave:[131,131,131],         BG:[4,6]},
    101:{Class:"Mob",       Variation:4,   Type:"Fungi",       HP:70,    ATK:0.5,   AtkCooldown:50},
    111:{Class:"Mob",       Variation:4,   Type:"Hilichurl",   HP:100,   ATK:0.5,   AtkCooldown:40},
    112:{Class:"Leader",    Variation:3,   Type:"Hilichurl",   HP:140,   ATK:1,     AtkCooldown:45},
    121:{Class:"Mob",       Variation:5,   Type:"Specter",     HP:200,   ATK:1,     AtkCooldown:50},
    131:{Class:"Mob",       Variation:4,   Type:"Hoarder",     HP:100,   ATK:1,     AtkCooldown:40},
    // LVL 2
    "2-Wave-1":{Wave:[201,202,201],         BG:[1,4]},
    "2-Wave-2":{Wave:[202,202],             BG:[1,4]},
    "2-Wave-3":{Wave:[212,211,212],         BG:[2,4]},
    "2-Wave-4":{Wave:[211,211,211,211],     BG:[4,5]},
    "2-Wave-5":{Wave:[222,222],             BG:[6,6]},
    "2-Wave-6":{Wave:[221,221,221,221],     BG:[6,6]},
    "2-Wave-7":{Wave:[231,202,231],         BG:[4,6]},
    201:{Class:"Mob",       Variation:2,   Type:"Eremite",     HP:150,   ATK:1,     AtkCooldown:50},
    202:{Class:"Leader",    Variation:3,   Type:"Eremite",     HP:250,   ATK:1.5,   AtkCooldown:35},
    211:{Class:"Mob",       Variation:5,   Type:"Fatui",       HP:150,   ATK:1,     AtkCooldown:50},
    212:{Class:"Leader",    Variation:4,   Type:"Fatui",       HP:300,   ATK:1.5,   AtkCooldown:30},
    221:{Class:"Mob",       Variation:3,   Type:"Automaton",   HP:150,   ATK:1,     AtkCooldown:50},
    222:{Class:"Leader",    Variation:3,   Type:"Automaton",   HP:300,   ATK:1.5,   AtkCooldown:30},
    231:{Class:"Mob",       Variation:4,   Type:"Hoarder",     HP:150,   ATK:1,     AtkCooldown:50},
    // LVL 3
    "3-Wave-1":{Wave:[301,301,301,301],     BG:[1,3]},
    "3-Wave-2":{Wave:[302,301,302],         BG:[1,3]},
    "3-Wave-3":{Wave:[311,311,312,311],     BG:[2,4]},
    "3-Wave-4":{Wave:[312,311,312],         BG:[2,4]},
    "3-Wave-5":{Wave:[321,322,322,321],     BG:[4,5]},
    "3-Wave-6":{Wave:[322,322,322],         BG:[4,5]},
    "3-Wave-7":{Wave:[331,331,331],         BG:[4,5]},
    "3-Wave-8":{Wave:[341,341,341],         BG:[4,5]},
    301:{Class:"Mob",       Variation:2,   Type:"Eremite",     HP:250,   ATK:1.5,     AtkCooldown:45},
    302:{Class:"Leader",    Variation:3,   Type:"Eremite",     HP:400,   ATK:1.5,     AtkCooldown:30},
    311:{Class:"Mob",       Variation:5,   Type:"Fatui",       HP:200,   ATK:1.5,     AtkCooldown:45},
    312:{Class:"Leader",    Variation:4,   Type:"Fatui",       HP:300,   ATK:2,      AtkCooldown:30},
    321:{Class:"Mob",       Variation:4,   Type:"Hilichurl",   HP:200,   ATK:1.5,     AtkCooldown:45},
    322:{Class:"Leader",    Variation:3,   Type:"Hilichurl",   HP:350,   ATK:2.5,     AtkCooldown:40},
    331:{Class:"Leader",    Variation:4,   Type:"MAbyss",      HP:400,   ATK:1.5,     AtkCooldown:30},
    341:{Class:"Mob",       Variation:3,   Type:"SAutomaton",  HP:500,   ATK:1,       AtkCooldown:30},
    // LVL 4
    "4-Wave-1":{Wave:[401,402,401],         BG:[1,1]},
    "4-Wave-2":{Wave:[411,411,411],         BG:[2,3]},
    "4-Wave-3":{Wave:[412,412],             BG:[2,3]},
    "4-Wave-4":{Wave:[431,431,431,431],     BG:[2,3]},
    "4-Wave-5":{Wave:[431,432,431],         BG:[2,2]},
    401:{Class:"Leader",    Variation:2,   Type:"Fungi",       HP:400,    ATK:1.5,  AtkCooldown:35},
    402:{Class:"Boss",      Variation:1,   Type:"Fungi",       HP:1000,   ATK:2.5,    AtkCooldown:30},
    411:{Class:"Leader",    Variation:3,   Type:"Hilichurl",   HP:700,    ATK:2,    AtkCooldown:35},
    412:{Class:"Boss",      Variation:2,   Type:"Hilichurl",   HP:1000,   ATK:2.5,    AtkCooldown:35},
    // 421:{Class:"Superboss", Variation:1,   Type:"Fatui",       HP:2666,   ATK:2.5,    AtkCooldown:50},
    431:{Class:"Mob",       Variation:3,   Type:"SAutomaton",   HP:700,   ATK:1.5,    AtkCooldown:30},
    432:{Class:"Boss",      Variation:2,   Type:"SAutomaton",   HP:1700,  ATK:2.5,    AtkCooldown:40},
    // LVL 5
    "5-Wave-1":{Wave:[502,502,502],         BG:[3,5]},
    "5-Wave-2":{Wave:[501,503,501],         BG:[3,5]},
    // "5-Wave-3":{Wave:[504],                 BG:[3,6]},
    "5-Wave-4":{Wave:[511,512,512,511],     BG:[3,5]},
    "5-Wave-5":{Wave:[522,522,522],         BG:[1,1]},
    "5-Wave-6":{Wave:[521,523,521],         BG:[1,1]},
    "5-Wave-7":{Wave:[532,532,532],         BG:[2,3]},
    "5-Wave-8":{Wave:[531,532,532,531],     BG:[2,3]},
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
    "14-Wave-2":{Wave:[1411],         BG:[2,3]},
    "14-Wave-3":{Wave:[1421],         BG:[4,4]},
    "14-Wave-4":{Wave:[1431],         BG:[5,5]},
    1401:{Class:"Megaboss",       Variation:1,   Type:"FellBoss",      HP:7000,   ATK:2,     AtkCooldown:30},
    1411:{Class:"Megaboss",       Variation:1,   Type:"Unusual",      HP:9000,   ATK:0.5,     AtkCooldown:30},
    1412:{Class:"Minion",          Variation:3,   Type:"Unusual",      HP:850,   ATK:0.5,     AtkCooldown:45},
    1421:{Class:"Megaboss",       Variation:1,   Type:"Workshop",      HP:2000,   ATK:2,     AtkCooldown:35},
    1422:{Class:"Arm",           Variation:1,   Type:"Workshop",      HP:3000,   ATK:2,     AtkCooldown:70},
    1431:{Class:"Megaboss",       Variation:1,   Type:"Finale",      HP:9000,   ATK:2,     AtkCooldown:32.5},
    1432:{Class:"Minion",          Variation:1,   Type:"Finale",      HP:1850,   ATK:0.5,     AtkCooldown:30},
}

const upgradeDictDefault = {
    0:  {Row:-1,        Purchased: -1,   "Contribution": 0, "Level": 1, "BaseCost":20, Factor:1, BaseFactor:1},
// RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS// RMB TO UPDATE MAX CONSTANTS
};

export { upgradeDictDefault,SettingsDefault,expeditionDictDefault,saveValuesDefault,enemyInfo,persistentValuesDefault,permUpgrades,advDictDefault,storeInventoryDefault };