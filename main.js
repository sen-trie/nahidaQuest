import { upgradeDictDefault,SettingsDefault,enemyInfo,expeditionDictDefault,saveValuesDefault,persistentValuesDefault,permUpgrades,advDictDefault,storeInventoryDefault } from "./modules/defaultData.js"
import { blackShopDict,screenLoreDict,upgradeInfo,achievementListDefault,expeditionDictInfo,InventoryDefault,eventText,advInfo,charLoreObj,imgKey,adventureLoot,sceneInfo,challengeInfo,commisionInfo } from "./modules/dictData.js"
import { tryParseJSONObject,createArray,removeID,getTime,audioPlay,abbrNum,randomInteger,sortList,generateHeroPrices,getHighestKey,countdownText,updateObjectKeys,randomIntegerWrapper,rollArray,textReplacer,universalStyleCheck,challengeCheck,createTreeItems,convertTo24HourFormat,deepCopy } from "./modules/functions.js"
import { inventoryAddButton,dimMultiplierButton,floatText,multiplierButtonAdjust,inventoryFrame,choiceMax,popUpBox,slideBox,choiceBox,createProgressBar,createButton,createDom,createMedal,sidePop,errorMesg } from "./modules/adjustUI.js"
import { CONSTANTS } from "./modules/constants.js";
import * as Settings from "./modules/features/settings.js";
import * as Shop from "./modules/features/shop.js";
import * as Expedition from "./modules/features/expedition.js";
import * as Battle from "./modules/features/battle.js";
import * as Tree from "./modules/features/tree.js"
import Preload from 'https://unpkg.com/preload-it@latest/dist/preload-it.esm.min.js';

//------------------------------------------------------------------------INITIAL SETUP------------------------------------------------------------------------//
// START SCREEN
let mainBody = document.getElementById("game");   
let drawUI;
(async () => {
    drawUI = await import('./modules/drawUI.js');
})();

let currentlyClearing = false;
function clearLocalStorage() {
    if (currentlyClearing === true) return;
    currentlyClearing = true;

    let clearPromise = new Promise(function(myResolve, myReject) {
        localStorage.clear();
        localStorage.length === 0 ? myResolve() : myReject();
    });
    
    clearPromise.then(
        (value) => {
            setTimeout(location.reload(), 200);
        },
        function(error) {console.error("Error clearing local data")}
    ); 
}

let preloadStart = Preload();
let beta = false;
let testing = false;
//------------------------------------------------------------------------POST SETUP------------------------------------------------------------------------//
const startGame = (firstGame) => {

// GLOBAL VARIABLES
var saveValues;
const ENERGYCHANCE = 500;
var persistentValues;
const COSTRATIO = 1.15;
let clickDelay = 10;

const WEAPONMAX = 1500;
const ARTIFACTMAX = 2150;
const FOODMAX = 3150;
const XPMAX = 4004;
const GEMMAX = 5025;
const NATIONMAX = 6200;

const NONWISHHEROMAX = 250;
const WISHHEROMIN = 800;

const WISHCOST = 1;
let STARTINGWISHFACTOR = 25;
let wishMultiplier = 0;
let adventureType = 0;
let stopSpawnEvents = false;
let preventSave = false;
let timePassedSinceLast = null;
let foodTimer = null;
let autoClickTimer = null;
const EVENTCOOLDOWN = 90;
const BOUNTYCOOLDOWN = 60;
const SHOPCOOLDOWN = 15;
const SHOP_THRESHOLD = 600;

let MOBILE = false;
if (navigator.userAgentData && navigator.userAgentData.mobile) {
    MOBILE = true;
} else {
    MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ADVENTURE VARIABLES
const FRAMES_PER_SECOND = 60;
let adventureVariables = {};
let battleVariables = {};
let adventureScene = false;
let adventureScaraText = "";
let skillCooldownReset;
let worldQuestDict = {};

const suffixPreload = ['Blue', 'Red', 'Green', 'Purple'];
const prefixPreload = ['', 'Boomer-', 'Bullet-', 'Circle-', 'Warning-'];
let quicktimeAssetArray = [];
suffixPreload.forEach((color) => {
    prefixPreload.forEach((mod) => {
        quicktimeAssetArray.push(`./assets/expedbg/${mod}${color}.webp`);
    })
})

// SPECIAL UPGRADE VARIABLES
const PERM_UPGRADES_CUTOFF = 14;
let wishPower = 0;
let upperEnergyRate;
let lowerEnergyRate;
let specialClick = 1;
let costDiscount = 1;
let clickCritRate = 0;
let clickCritDmg = 0;
let idleRate = 0;
let timeLoaded = getTime();
let luckRate = 0;
let eventCooldownDecrease = 1;
let additionalPrimo = 1;
let additionalStrength = 1;
let additionalDefense = 1;
let additionalXP = 1;
let additionalTreeNut = 1;
let additionalTreeEnergy = 1;
let decreaseEnergyBless = 1;
let additionalPyroHydro = 1;
let additionalDendroGeoAnemo = 1;
let additionalCryoElectro = 1;
let convertXPPrimo = 0;

// ITEM VARIABLES
const weaponBuffPercent =   [0, 1.1, 1.3, 1.7, 2.1, 2.7, 4.6];
const artifactBuffPercent = [0, 1.05, 1.15, 1.35, 1.55, 1.85];
const foodBuffPercent =     [0, 1.4, 2.0, 3.1, 4.4, 6.2];
const nationBuffPercent =   [0, 0, 1.2, 1.5, 1.8];
const energyBuffPercent =   [0, 0, 0, 800, 2000, 4000];
const elementBuffPercent =  [0, 0, 0, 1.6, 2.2, 3.0, 3.0];
const buffLookUp = {
    "[wBuff]":weaponBuffPercent,
    "[aBuff]":artifactBuffPercent,
    "[fBuff]":foodBuffPercent,
    "[nBuff]":nationBuffPercent,
    "[eBuff]":elementBuffPercent,
}

// ACHIEVEMENT THRESHOLDS
let achievementData = {
    achievementTypeRawScore:      [100,1e4,1e6,1e8,1e9,1e11,1e12,1e14,1e15,1e17,1e18,1e20,1e21,1e23,1e24,1e26,1e27,1e29,1e30,1e32],
    achievementTypeRawDPS:        [10,100,1000,1e5,1e6,1e8,1e9,1e11,1e12,1e14,1e15,1e17,1e18,1e20,1e21,1e23,1e24,1e26,1e27,1e29],
    achievementTypeRawClick:      [1e1,1e2,5e2,1e3,2.5e3,5e3,7.5e3,1e4,1.5e4,2e4,2.5e4,3e4,3.5e4,4e4,5e4],
    achievementTypeRawCollection: [1,10,100,250,500,750,1000,1250,1500,1750,2000,2250,2500,2750,3000],
    achievementTypeGolden:        [1,10,25,50,100,200,350,500,750,1000],
}
let scoreAchievement = [1,101,201,301,401];
let challengeMultiplier = 0;

let foodBuff = 1;
let clickerEvent = "none";
let shopTime = 1e20;
let shopTimerElement = null;
let filteredHeroes = [];
let filteredInv = [];
let rowTempDict = [];
let milestoneOn = false;
let currentDimMultiplier = 0;
let currentMultiplier = 1;
let activeLeader;

let bountyObject = {};
let lootArray = {};
let selectHeroType = null;
const upgradeThreshold = [0,0,50,101,150,200];
const MORALE_THRESHOLD_1 = 80;
const MORALE_THRESHOLD_2 = 60;
const MORALE_THRESHOLD_3 = 30;
const moraleLore = [
    "Nahida is feeling [s]Really Happy[/s]! [mor]<br><br> XP gains are increased by 10% and <br>party deals 20% additional DMG in combat.",
    "Nahida is feeling [s]Happy[/s]! [mor]<br><br> Party deals 10% additional DMG in combat.",
    "Nahida feels [s]Neutral[/s] [mor]<br><br> No additional buffs to the party, <br> increase morale by eating food.",
    "Nahida feels [s]Sad[/s]... [mor]<br><br> Party deals 50% less DMG; recover party morale <br> by resting or eating food.",
]

const blackMarketFunctions = {
    changeBigNahida: changeBigNahida,
    changeSkinCollection: changeSkinCollection,
    buyShop: buyShop,
    autoConsumeFood: autoConsumeFood,
    autoClickNahida: autoClickNahida,
};

const boxElement = ["Any","Pyro","Hydro","Dendro","Electro","Anemo","Cryo","Geo"];
const specialText = ["Ah! It's Bongo-Head!","'Thank you for releasing Arapacati!'","Woah, a treasure-seeking Seelie!","Woah, a shikigami was trapped inside!"];

let demoContainer = document.getElementById("demo-container");
let score = document.getElementById("score");
let energyDisplay = document.getElementById("energy");
let dpsDisplay = document.getElementById("dps");
let primogemDisplay = document.getElementById("primogem");

let leftDiv = document.getElementById("left-div");
let midDiv = document.getElementById("mid-div");
let rightDiv = document.getElementById("right-div");
let multiplierButtonContainer;
let currentPopUps = [];

// MAIN BODY VARIABLES
drawUI.drawMainBody();
createAdventure();

let table1 = document.getElementById("table1");
let table2 = document.getElementById("table2");
let filterDiv = document.getElementById("filter-button");
let table3 = document.getElementById("table3");
let table4 = document.getElementById("table4");
let table5 = document.getElementById("table5");
let table5Container = document.getElementById("table5-container");
let table6 = document.getElementById("table6");
let table7 = document.getElementById("table7");
let TABS = [table1,table2,table3,table4,table5Container,table7];
let tooltipName,toolImgContainer,toolImg,toolImgOverlay,tooltipText,tooltipLore,tooltipWeaponImg,tooltipElementImg,table6Background;

// INITIAL LOADING
var recentlyLoaded = true;
var InventoryMap;
var achievementMap;
let advDict;
let storeInventory;

loadSaveData();
postSaveData();
loadingAnimation();
var upgradeDict;
var expeditionDict;
var Inventory;
var achievementList;

let WISHHEROMAX = getHighestKey(upgradeDict) + 1;
let wishCounter = WISHHEROMAX - WISHHEROMIN;
drawWish();
refresh();

saveValues["realScore"]++;
saveValues["realScore"]--;

createMultiplierButton();
createExpMap();
createExpedition();
Expedition.expedInfo("exped-7", expeditionDict, saveValues, persistentValues);
let advButtonTemp = document.getElementById("adventure-button");
advButtonTemp.classList.remove("expedition-selected");

let tooltipTable = 1;
let heroTooltip = -1;
let itemTooltip = -1;
createTooltip();

settings();
var settingsValues;
var currentBGM;
var bgmElement = new Audio();
let fightBgmElement = new Audio();

let tabElement = new Audio("./assets/sfx/tab-change.mp3");
let demoElement = new Audio("./assets/sfx/click.mp3");
let upgradeElement = new Audio("./assets/sfx/upgrade.mp3");
let mailElement = new Audio("./assets/sfx/mail.mp3");
let achievementElement = new Audio("./assets/sfx/achievement.mp3");
let eventElement = new Audio("./assets/sfx/event.mp3");
let reactionStartElement = new Audio("./assets/sfx/timestart.mp3");
let reactionCorrectElement = new Audio("./assets/sfx/timesup.mp3");
let weaselBurrow = new Audio("./assets/sfx/weasel-pop.mp3");
let weaselDecoy = new Audio("./assets/sfx/weasel-decoy.mp3");
let adventureElement = new Audio("./assets/sfx/adventure.mp3");
let shopElement = new Audio("./assets/sfx/dori-buy.mp3");
let fightWinElement = new Audio("./assets/sfx/battle-success.mp3");
let fightLoseElement = new Audio("./assets/sfx/battle-failure.mp3");
let fightEnemyDownElement = new Audio("./assets/sfx/battle-enemyDown.mp3");
let fightEncounter = new Audio("./assets/sfx/battle-encounter.mp3");
let parrySuccess = new Audio("./assets/sfx/battle-parry-success.mp3");
let parryFailure = new Audio("./assets/sfx/battle-parry-fail.mp3");
let simonElement = new Audio();
let sfxArray = [
    tabElement,demoElement,upgradeElement,mailElement,
    achievementElement,eventElement,reactionStartElement,
    reactionCorrectElement,weaselBurrow,weaselDecoy,
    adventureElement,shopElement,
    fightEncounter,fightEnemyDownElement,fightLoseElement,fightWinElement,
    parrySuccess,parryFailure,simonElement
];

let timerLoad = setInterval(timerEventsLoading,50);
let timer;
const timeRatio = 500;
var timerSeconds = 0;

let milestoneCount = 0;
milestoneHeroAdd();
createFilter();
createTabs();
updateMilestoneNumber();
tabChange(1);

//------------------------------------------------------------------------GAME FUNCTIONS------------------------------------------------------------------------//
window.oncontextmenu = function (){
    return false;
}

// ALL TIME-EVENTS SYNC TO THIS FUNCTION (TIME REFRESH FREQUENCY SET TO TIME RATIO)
// 1 timerSeconds = 1 SECOND IN REAL TIME
function timerEvents() {
    let timeRatioTemp = timeRatio / 1000;
    timerSeconds += timeRatioTemp;
    
    saveValues["realScore"] += timeRatioTemp * saveValues["dps"] * foodBuff * (100 + challengeMultiplier) / 100;
    if (!stopSpawnEvents) {
        checkAchievement();
        refresh();
        dimHeroButton();
        addNewRow(true);
    } else if (beta) {
        console.log('stopSpawnEvents is enabled!');
    }
    
    randomEventTimer(timerSeconds);
    timerSave(timerSeconds);
    shopCheck();
    shopTimerFunction();
    checkTimerBounty();
    if (persistentValues.tutorialAscend) {
        growTree('add');
        document.getElementById('bless-bar').updateCharge();
    }
    document.getElementById('commision-menu').updateAllTime(getTime());
}

// TEMPORARY TIMER
function timerEventsLoading() {
    refresh();
}

// SAVE DATA TIMER
let saveTimeMin = getTime() + 3;
function timerSave() {
    // SAVES DATA EVERY settingsValues.saveTime MINUTES
    if (getTime() > saveTimeMin) {
        saveData();
        console.log("Saved!");
    }
}

// LOAD SAVE DATA
function loadSaveData() {
    if (localStorage.getItem('save-0') === null) { 
        settingsValues = SettingsDefault;
        saveValues = saveValuesDefault;
        saveValues.versNumber = CONSTANTS.VERSIONNUMBER;
        upgradeDict = generateHeroPrices(upgradeDictDefault, NONWISHHEROMAX, upgradeInfo);
        InventoryMap = new Map();
        expeditionDict = expeditionDictDefault;
        advDict = (() => {
            let temp = advDictDefault;
            temp.rankDict = createArray(19, false, [null, true]);
            return temp;
        })();
        achievementMap = (() => {
            let temp = new Map();
            for (let key in achievementListDefault) {
                temp.set(parseInt(key), false);
            }
            return temp;
        })();
        persistentValues = (() => {
            let temp = persistentValuesDefault;
            for (let key in upgradeInfo) {
                let heroName = upgradeInfo[key].Name;
                temp.ascendDict[heroName] = 0;
            }
            temp.upgrade = createArray(Object.keys(permUpgrades).length, 0, [null]);
            return temp;
        })();
        storeInventory = storeInventoryDefault;
    } else {
        let loadedSave = JSON.parse(window.atob(localStorage.getItem('save-0')));
        settingsValues = loadedSave.settingsTemp;
        saveValues = loadedSave.saveValuesTemp;
        upgradeDict = loadedSave.upgradeDictTemp;
        InventoryMap = new Map(loadedSave.InventoryTemp);
        expeditionDict = loadedSave.expeditionDictTemp;
        advDict = loadedSave.advDictTemp;
        achievementMap = new Map(loadedSave.achievementListTemp);
        persistentValues = loadedSave.persistentValues;
        storeInventory = loadedSave.localStoreTemp;
    }

    Inventory = InventoryDefault;
    achievementList = achievementListDefault;    
    updateObjectKeys(settingsValues, SettingsDefault);
    updateObjectKeys(saveValues, saveValuesDefault);
    updateObjectKeys(expeditionDict, expeditionDictDefault);
    updateObjectKeys(advDict, advDictDefault);
    updateObjectKeys(persistentValues, persistentValuesDefault);
    Shop.updateBlackMarket(persistentValues.blackMarketDict);

    for (let key in upgradeInfo) {
        let heroName = upgradeInfo[key].Name;
        if (persistentValues.ascendDict[heroName] === undefined) {
            persistentValues.ascendDict[heroName] = 0;
        }
    }

    for (let [key, value] of InventoryMap.entries()) {
        if (value === null || value < 0) { InventoryMap.delete(key) }
    }

    if (storeInventory.active == true) {
        setShop("load");
    }

    setTimeout(loadRow, 1000);
    inventoryload();

    const upgradeLength = Object.keys(permUpgrades).length;
    if (persistentValues.upgrade.length != (upgradeLength + 1)) {
        const lengthDiff = (upgradeLength + 1) - persistentValues.upgrade.length;
        persistentValues.upgrade = persistentValues.upgrade.concat([...Array(lengthDiff).keys()].map(x => 0));
    }
}

// BIG BUTTON FUNCTIONS
let clickAudioDelay = null;
let currentClick = 1;

let autoClick = undefined;
let demoImg = document.createElement("img");
demoImg.skin = persistentValues.nahidaSkin;
demoImg.src = `./assets/bg/nahida${demoImg.skin}.webp`;
demoImg.classList.add("demo-img");
demoImg.id = "demo-main-img";
demoImg.critInARow = 0;

demoImg.revertPicture = () => {
    demoImg.src = `./assets/bg/nahida${demoImg.skin}.webp`;
}

demoContainer.addEventListener('mousedown', () => {
    if (settingsValues.autoClickBig) {
        if (autoClick === undefined) {
            autoClick = setInterval(touchDemo, 400);
        }
    }
})

demoContainer.addEventListener("mouseup", (e) => {
    touchDemo(e.detail);
});

document.addEventListener("mouseup", () => {
    if (autoClick !== undefined) {
        clearInterval(autoClick);
        autoClick = undefined;
    }
});

function touchDemo(autoClicked = false) {
    let clickEarn;
    let crit = false;
    saveValues.clickCount++;
    persistentValues.lifetimeClicksValue++;

    let critRole = randomInteger(1,100);
    if (critRole <= clickCritRate) {
        crit = true;
        clickDelay -= 3;
        if (clickerEvent !== "none") {
            clickDelay -= 2;
            clickEarn = Math.ceil((currentClick * 5) * clickCritDmg);
        } else {
            clickEarn = Math.ceil((saveValues.dps + saveValues["clickFactor"]) * 5 * clickCritDmg);
        }

        if (randomInteger(0, 100) < 3 && autoClicked !== true) {
            addTreeCore(randomInteger(1, 3), 0);
        }

        demoImg.critInARow++;
        if (demoImg.critInARow > 2) {
            challengeNotification(({category: 'specific', value: [0, 4]}));
        } 
    } else {
        if (clickerEvent !== "none") {
            clickDelay -= 2;
            clickEarn = currentClick;
        } else {
            clickEarn = Math.ceil(saveValues["clickFactor"]);
        }

        if (demoImg.critInARow > 0) {demoImg.critInARow = 0}
    }

    if (randomInteger(0, 1000) < 3 && autoClicked !== true) {
        addTreeCore(randomInteger(1, 3), 0);
    }

    saveValues["realScore"] += clickEarn;
    if (clickEarn > 1e9) {
        challengeNotification(({category: 'specific', value: [3, 1]}))
    }
    energyRoll(autoClicked);

    if (clickAudioDelay === null && autoClicked !== true) {
        if (timerSeconds !== 0) {
            audioPlay(demoElement);

            clickAudioDelay = true;
            setTimeout(() => {clickAudioDelay = null}, 155);
        }
    }

    if (document.visibilityState === 'visible') {
        if (crit) {
            floatText("crit",true,leftDiv,clickEarn,randomInteger(20,45),60,abbrNum,clickerEvent);
        } else {
            if (settingsValues.combineFloatText) {
                floatText("normal",true,leftDiv,clickEarn,43,43,abbrNum,clickerEvent);
            } else {
                floatText("normal",false,leftDiv,clickEarn,randomInteger(30,70),randomInteger(50,70),abbrNum,clickerEvent);
            }
        }
        if (!settingsValues.showFallingNuts) {spawnFallingNut()};
    }
    
};

drawUI.demoFunction(demoContainer,demoImg);
demoContainer.append(demoImg);

function spawnFallingNut() {
    let number = randomInteger(2,6);
    let animation = `fall ${number}s cubic-bezier(1,.05,.55,1.04) forwards`;
    let img = document.createElement("img");
    img.src = "./assets/icon/nut.webp";
    img.style.left = `${randomInteger(0,100)}%`;
    img.style.animation = animation;
    img.addEventListener('animationend', () => {img.remove();});
    img.classList.add("falling-image");
    leftDiv.appendChild(img);
}

function spawnEnergy() {
    const img = createDom("img", {
        class: ['raining-image'],
        src: './assets/icon/stamina.webp',
        style: {
            width: 'unset',
            height: '10%',
            top: "-10%",
            left: `${randomInteger(5,95)}%`,
            animation: `rain-rotate ${(randomInteger(7,10)/2)}s linear forwards`,
        },
        event: ['animationend', () => {
            if (img) img.remove();
        }]
    });

    const clickFunction = () => {
        if (img) {

            const energyGain = randomInteger(lowerEnergyRate, upperEnergyRate);
            saveValues.energy += energyGain;
            persistentValues.lifetimeEnergyValue += energyGain;
    
            floatText("energy",false,leftDiv,energyGain,randomInteger(30,70),randomInteger(70,90),abbrNum);
            challengeNotification(({category: 'energy', value: saveValues.energy}));
            img.remove();
        }
    }

    img.addEventListener('mousedown', clickFunction, { once: true });
    img.addEventListener('click', clickFunction, { once: true });
    img.addEventListener('touchstart', clickFunction, { once: true });
    leftDiv.appendChild(img);
}

// ROLL FOR ENERGY
function energyRoll(autoClicked = false) {
    let randInt = Math.floor(Math.random() * 1000);
    if (autoClicked === true) {
        clickDelay -= 0.075;
    } else {
        clickDelay--;
    }
    
    if (clickDelay < 1){
        if (randInt < ENERGYCHANCE) {
            spawnEnergy();
            clickDelay = 40;
        }
    }
}

// SCREEN TIPS
function screenTips() {
    let screenTips = document.getElementById("screen-tips");
    let maxInt = 13;
    if (expeditionDict[5] != '1') {
        maxInt = 38;
    } else if (expeditionDict[4] != '1') {
        maxInt = 30;
    } else if (expeditionDict[3] != '1') {
        maxInt = 23;
    } 

    screenTips.style.animation = "textFadeOut 2s ease-in-out";
    setTimeout(() => {
        let changeText = screenLoreDict[randomInteger(0,maxInt)];
        while (screenTips.innerText == changeText) {
            changeText = screenLoreDict[randomInteger(0,maxInt)];
        }
        screenTips.innerText = changeText;
        
    },1000);
    resetAnimationListener(screenTips);
}

function resetAnimationListener(elem) {
    elem.addEventListener('animationend',resetAnimation)
    function resetAnimation() {
        elem.style.animation = "none";
        void elem.offsetWidth;
        elem.removeEventListener('animationend',resetAnimation);
    }
}

function calcPermEffect(id) {
    return (persistentValues.upgrade[id] * permUpgrades[id].Effect / 100);
}

// UPDATES VALUES WITH PERSISTENT VALUES
function specialValuesUpgrade(loading = false, valueUpdate) {
    if (loading === true) {
        for (let i = 1; i < getHighestKey(permUpgrades + 1); i++) {
            specialValuesUpgrade(false, i);
        }
    } else if (loading == false) {
        switch (valueUpdate) {
            case 1:
                upperEnergyRate = Math.ceil(200 * (100 + persistentValues.upgrade[1] * 2.5) / 100);
                lowerEnergyRate = Math.ceil(upperEnergyRate * 0.65);
                break;
            case 2:
                specialClick = (1 + calcPermEffect(valueUpdate)).toFixed(3);
                break;
            case 3:
                wishPower = (1 - calcPermEffect(valueUpdate)).toFixed(3);
                break;
            case 4:
                costDiscount = (1 - calcPermEffect(valueUpdate)).toFixed(3);
                break;
            case 5:
                clickCritRate = persistentValues.upgrade[5];
                clickCritDmg = Math.round((Math.log(persistentValues.upgrade[5] + 1) * 18));
                break;
            case 6:
                idleRate = calcPermEffect(valueUpdate).toFixed(2); // 0-1
                break;
            case 7:
                luckRate = (calcPermEffect(valueUpdate) * 100).toFixed(3); // 0-100
                break;
            case 8:
                eventCooldownDecrease = (1 - calcPermEffect(valueUpdate)).toFixed(1);
                break;
            case 9:
                additionalPrimo = (1 + calcPermEffect(valueUpdate)).toFixed(3);
                break;
            case 10:
                additionalStrength = (1 + calcPermEffect(valueUpdate)).toFixed(3);
                break;
            case 11:
                additionalDefense = (1 + calcPermEffect(valueUpdate)).toFixed(3);
                break;
            case 12:
                additionalXP = (1 + calcPermEffect(valueUpdate)).toFixed(3);
                break;
            case 13:
                additionalTreeNut = (1 + calcPermEffect(valueUpdate)).toFixed(3);
                break;
            case 14:
                additionalTreeEnergy = (1 + calcPermEffect(valueUpdate)).toFixed(3);
                break;
            case 15:
                decreaseEnergyBless = (1 - calcPermEffect(valueUpdate)).toFixed(3);
                break;
            case 16:
                additionalPyroHydro = (1 + calcPermEffect(valueUpdate)).toFixed(3);
                break;
            case 17:
                additionalDendroGeoAnemo = (1 + calcPermEffect(valueUpdate)).toFixed(3);
                break;    
            case 18:
                additionalCryoElectro = (1 + calcPermEffect(valueUpdate)).toFixed(3);
                break;
            case 19:
                convertXPPrimo = (calcPermEffect(valueUpdate)).toFixed(3);
                break;    
            default:
                console.error('Upgrade error: Invalid value to update');
                break;
        }
    }
}

function idleCheck(idleAmount = 0) {
    let timePassed = Math.min(timeLoaded - saveValues.currentTime, 1400);
    if (timePassed >= 60) {
        idleAmount = timePassed * saveValues.dps * 60 * idleRate;
    }
    return idleAmount;
}

// POST-SETUP GAME CONFIG
function postSaveData() {
    const newTime = getTime();
    timePassedSinceLast = newTime - persistentValues.lastRecordedTime;
    persistentValues.lastRecordedTime = newTime;
    
    if (persistentValues.tutorialAscend) {
        createTreeMenu();
    }

    if (persistentValues.challengeCheck === undefined) {
        persistentValues.challengeCheck = challengeCheck('populate', challengeInfo);
    } else {
        persistentValues.challengeCheck = challengeCheck('checkKeys', persistentValues.challengeCheck, challengeInfo);
    }
    updateObjectKeys(saveValues.treeObj, saveValuesDefault.treeObj);
    achievementListload();
    specialValuesUpgrade(true);
    if (saveValues.goldenTutorial === true) {
        addNutStore();
    }

    const leftHandCSS = document.getElementById('toggle-css');
    leftHandCSS.disabled = (settingsValues.leftHandMode ? undefined : 'disabled');

    if (firstGame) {
        if (localStorage.getItem('fontSize') !== null) {
            try {
                settingsValues.fontSizeLevel = parseInt(localStorage.getItem('fontSize'));
            } catch {}
        }
    }

    CONSTANTS.CHANGEFONTSIZE(settingsValues.fontSizeLevel);
    
    if (persistentValues.autoFood) {
        autoConsumeFood('check');
    }

    if (persistentValues.autoClickNahida) {
        autoClickNahida('use');
    }

    if (persistentValues.collectionSkin !== 0) {
        changeSkinCollection('S' + persistentValues.collectionSkin);
    }

    if (settingsValues.fullscreenOn && settingsValues.fullscreenOn === true) {
        if (document.fullscreenEnabled && !document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
    }

    const sidePopContainer = createDom('div', {
        id: 'side-pop-container',
        class: ['side-pop-container', 'flex-column']
    });

    mainBody.append(sidePopContainer);
}

//--------------------------------------------------------------------------RANDOM EVENTS----------------------------------------------------------------------//
// RANDOM EVENTS TIMER
let eventTimes = 1;
let eventChance = 0;
let worldQuestCooldown = null;
let skrimishCooldown = null;
function randomEventTimer(timerSeconds) {
    let eventTimeMin = EVENTCOOLDOWN * eventTimes * eventCooldownDecrease;
    if (eventChance !== 0) {
        let upperLimit = 10 ** (1 + (timerSeconds - eventTimeMin)/((EVENTCOOLDOWN * eventCooldownDecrease)/2))
        if (Math.ceil(upperLimit) >= eventChance) {
            eventChance = 0;
            eventTimes++;
            startRandomEvent();
            updateMorale("recover", 5);

            const currentTime = getTime();
            persistentValues.timeSpentValue += currentTime - persistentValues.lastRecordedTime;
            persistentValues.lastRecordedTime = currentTime;
        } else {
            if (worldQuestCooldown === null) {
                let worldQuestRoll = randomInteger(1, 101) - luckRate;
                worldQuestCooldown = true;
                if (worldQuestRoll < 30) {
                    if (document.getElementById('world-quest-button')) {
                        document.getElementById('world-quest-button').remove();
                        notifPop("clearAll","quest");
                    } else if (!document.getElementById("skirmish-button")) {
                        console.log('World Quest Spawned!');
                        spawnWorldQuest();
                    }

                    setTimeout(() => {worldQuestCooldown = null}, 7 * 60 * 1000)
                } else {
                    setTimeout(() => {worldQuestCooldown = null}, 1 * 60 * 1000)
                }
            } else if (persistentValues.tutorialAscend && !document.getElementById('world-quest-button') && skrimishCooldown === null) {
                let skirmishRoll = randomInteger(1, 101) - luckRate;
                skrimishCooldown = true;
                if (skirmishRoll < 30) {
                    if (document.getElementById('skirmish-button')) {
                        document.getElementById('skirmish-button').remove();
                        notifPop("clearAll","skirmish");
                    } else if (!document.getElementById('world-quest-button')) {
                        console.log('Skirmish Spawned!');
                        spawnSkirmish();
                    }
                    
                    setTimeout(() => {worldQuestCooldown = null}, 15 * 60 * 1000)
                } else {
                    setTimeout(() => {worldQuestCooldown = null}, 0.5 * 60 * 1000)
                }
            }
        }
        return;
    }
    
    if (timerSeconds > eventTimeMin) {eventChance = randomInteger(0,100)}
}

// START A RANDOM EVENT
function startRandomEvent(forceNum = 0) {
    if (stopSpawnEvents === true) {return};
    let eventPicture = document.createElement("div");
    let aranaraNumber = randomInteger(1, 4);
    if (forceNum != 0) {
        aranaraNumber = forceNum;
    } else if (persistentValues.fellBossDefeat) {
        aranaraNumber = randomInteger(1, 10); // 3RD SET ARE LOCKED TO FELL BOSS
    } else if (expeditionDict[4] != '1') {
        aranaraNumber = randomInteger(1, 7); // 2ND SET ARE LOCKED TO 4TH EXPEDITION UNLOCK
    }
     
    eventPicture.classList.add("random-event");
    eventPicture.addEventListener("click", () => {
        clickedEvent(aranaraNumber);
        eventPicture.remove();
        toggleSettings(true);
    });

    setTimeout(() => {eventPicture.remove()}, 8000);
    eventPicture.style.left = randomInteger(5,95) + "%";
    eventPicture.style.top = randomInteger(10,75) + "%";

    let eventPictureImg = document.createElement("img");
    eventPictureImg.classList.add("event-pic-img");
    if (aranaraNumber > 6) {
        eventPictureImg.src = "./assets/icon/event-three.webp";
        eventPictureImg.classList.add("vibrate-more");
    } else if (aranaraNumber > 3) {
        eventPictureImg.src = "./assets/icon/event-hard.webp";
        eventPictureImg.classList.add("vibrate-more");
    } else {
        eventPictureImg.src = "./assets/icon/event-easy.webp";
    }
    eventPicture.appendChild(eventPictureImg);
    mainBody.appendChild(eventPicture);
}

function clickedEvent(aranaraNumber) {
    let specialEvent = randomIntegerWrapper(luckRate * 2, 200);
    eventElement.load();
    eventElement.play();

    let eventDropdown = document.createElement("div");
    eventDropdown.classList.add("flex-row","event-dropdown");
    let eventDropdownBackground = document.createElement("img");
    eventDropdownBackground.src = "./assets/tutorial/eventPill.webp";

    if (specialEvent) {
        if (aranaraNumber === 1) {
            aranaraNumber = 1.5;
        }
    }

    let eventDropdownText = document.createElement("div");
    eventDropdownText.innerText = eventText[aranaraNumber];
    eventDropdownText.classList.add("flex-column","event-dropdown-text");

    let eventDropdownImage = createDom('div', {
        classList: ["event-dropdown-image"],
        style: {
            background: "url(./assets/tutorial/aranara-"+(aranaraNumber)+".webp)",
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat"
        }
    })
    
    eventDropdown.append(eventDropdownBackground, eventDropdownText, eventDropdownImage);
    eventDropdown.addEventListener("animationend", () => {
        persistentValues.aranaraEventValue++;
        eventDropdown.remove();
        chooseEvent(aranaraNumber, specialEvent);
    });
    
    mainBody.appendChild(eventDropdown);
}

function startEvent(type, specialMode, hardMode = false) {
    switch (type) {
        case 1:
        case 1.5:
            clickEvent(specialMode);
            break;
        case 2:
            reactionEvent(hardMode);
            break;
        case 3:
            boxFunction(specialMode);
            break;
        case 4:
            minesweeperEvent(hardMode);
            break;
        case 5:
            weaselEvent(specialMode, hardMode);
            break;
        case 6:
            rainEvent();
            break;
        case 7:
            simonEvent(hardMode);
            break;
        case 8:
            battleshipEvent();
            break;
        case 9:
            snakeEvent(hardMode);
            break;
        default:
            console.error(`Event error: Invalid event ${type}`);
            break;
    }
}

function chooseEvent(type, specialMode) {
    if (stopSpawnEvents === true) {return};
    if ((persistentValues.blackMarketDict && persistentValues.blackMarketDict.kusava.level === 1 && CONSTANTS.ARANARA_HARD.includes(type)) || beta) {
        const aranaraImg = createDom('img', { src: `./assets/tutorial/aranara-${type}.webp`});
        const buttonContainer = createDom('div', {
            classList: ['flex-row', 'menu-container-two'],
            child: [
                createDom('button', { innerText: 'Normal', event: ['click', () => {startEvent(type, specialMode, false)}] }),
                createDom('button', { innerText: 'Hard', event: ['click', () => {startEvent(type, specialMode, true)} ]})
            ]
        });
        popUpBox(mainBody, 'Select Aranara Difficulty', aranaraImg, buttonContainer, ['menu-small'], 'Pick2');
    } else {
        startEvent(type, specialMode);
    }    
}

// EVENT 1 (ENERGY OVERLOAD)
let clickEventDelay;
function clickEvent(wandererMode) {
    stopSpawnEvents = true;
    let button = document.getElementById("demo-main-img");
    if (clickEventDelay !== null) {clearTimeout(clickEventDelay)};
    
    clickerEvent = wandererMode === true ? "scara" : "event";
    currentClick = 15 * (saveValues["dps"] + 1);

    button.style.animation = "rotation 3.5s infinite linear forwards";
    if (wandererMode === true) {
        button.src = "./assets/event/scara.webp";
        if (!leftDiv.classList.contains("vignette-blue")) {leftDiv.classList.add("vignette-blue")};
        challengeNotification(({category: 'specific', value: [2,4]}))
    } else {
        if (!leftDiv.classList.contains("vignette")) {leftDiv.classList.add("vignette")};
    }
    foodButton(2);
}

function stopClickEvent() {
    let scaraMode = false;
    let button = document.getElementById("demo-main-img");
    button.style.animation =  "rotation 18s infinite linear forwards";

    if (leftDiv.classList.contains("vignette-blue")) {
        scaraMode = true;
        leftDiv.classList.remove("vignette-blue");
    };

    if (scaraMode) {
        leftDiv.style.animation = "none";
        void leftDiv.offsetWidth;
        leftDiv.style.animation = "darkness-transition 0.3s linear";

        setTimeout(()=>{
            button.revertPicture();
        },150)
    } else {
        if (leftDiv.classList.contains("vignette")) {leftDiv.classList.remove("vignette")};
    }

    clickerEvent = "none";
    clickEventDelay = null;
    stopSpawnEvents = false;
}

// EVENT 2 (REACTION TIME)
function reactionEvent(hardMode = false) {
    stopSpawnEvents = true;
    const eventBackdrop = createDom("div", { 
        classList: ["cover-all","flex-column","event-dark"],
        reactionGame: false,
        maxCount: hardMode ? 3 : 1,
        currentCount: 0,
    });

    const eventDescription = createDom("p", {
        classList: ["event-description"],
        innerText: "Click the button just \n when the clock stops ticking!"
    });

    let currentCount = 0;
    const randomTime = randomInteger(6000, 10500 - 1000 * eventBackdrop.maxCount);
    const createContainer = () => {
        const reactionImageArrow = createDom("img", {
            src: "./assets/event/clock-arrow.webp",
            id: "reaction-image-arrow",
            ready: false,
            style: {
                animationDuration: (randomInteger(30, 60) / 10) + "s",
            }
        });
    
        const reactionButton = createDom("div", {
            id: "reaction-button",
            classList: ["background-image-cover", "flex-row"],
            innerText: "Not yet...",
            event: ["click", () => {
                reactionImageArrow.style.animationPlayState = "paused";
                reactionFunction(eventBackdrop, reactionImageArrow, reactionButton, hardMode);
            }]
        });

        const reactionImage = createDom("div", { 
            id: "reaction-image",
            child: [
                createDom("img", {
                    src: "./assets/event/clock-back.webp",
                    id: "reaction-image-bot"
                }),
                reactionImageArrow,
                createDom("img", {
                    src: "./assets/event/clock-top.webp",
                    classList: ["flex-column"],
                    id: "reaction-image-top",
                })]
        });
    
        reactionImageArrow.onload = () => {
            eventBackdrop.reactionGame = true;
    
            setTimeout(() => {
                if (eventBackdrop.reactionGame === true) {
                    reactionImageArrow.reactionReady = true;
                    reactionImageArrow.style.animationPlayState = "paused";
    
                    reactionButton.innerText = "Now!";
                    reactionButton.classList.add("glow");
                    setTimeout(() => {
                        if (eventBackdrop.reactionGame && reactionImageArrow.reactionReady) {
                            reactionImageArrow.reactionReady = false;
                            reactionButton.innerText = "Too Slow!";
                            reactionFunction(eventBackdrop, reactionImageArrow, reactionButton, hardMode);
                        }
                    }, hardMode ? 950 : 800);
                }
            }, randomTime + currentCount * randomInteger(600, 1000));
            currentCount++;
        }

        return createDom('div', {
            classList: ["flex-column", "reaction-div"],
            child: [reactionImage, reactionButton],
            style: {
                width: 100 / eventBackdrop.maxCount + "%"
            }
        })
    }

    const reactionContainer = createDom('div', {
        classList: ["flex-row", "reaction-container"],
        child: Array.from({ length: eventBackdrop.maxCount }, () => createContainer())
    });

    reactionStartElement.load();
    reactionStartElement.play();

    eventBackdrop.append(eventDescription, reactionContainer);
    mainBody.append(eventBackdrop);
}

function reactionFunction(eventBackdrop, reactionImageArrow, reactionButton, hardMode) {
    if (eventBackdrop.reactionGame == false) {return}

    reactionImageArrow.style.animationPlayState = "paused";
    if (reactionImageArrow.reactionReady) {
        reactionButton.innerText = "Success!";
        reactionCorrectElement.load();
        reactionCorrectElement.play();

        if ((eventBackdrop.currentCount + 1) === eventBackdrop.maxCount) {
            genericItemLoot();
            reactionStop("You did it!", eventBackdrop, randomInteger(40, 60), hardMode);
        } else {
            eventBackdrop.currentCount++;
        }        
    } else {
        reactionButton.innerText = "You missed!";
        persistentValues.aranaraLostValue++;
        reactionStop("You missed!", eventBackdrop, 0, hardMode);
    }

    reactionImageArrow.reactionReady = false;
}

function reactionStop(outcomeText, eventBackdrop, primogem, hardMode) {
    reactionStartElement.pause();
    eventBackdrop.reactionGame = false;
    stopSpawnEvents = false;

    setTimeout(() => {
        eventOutcome(outcomeText, eventBackdrop, "reaction", primogem);
        if (hardMode) {
            addTreeCore(randomInteger(1, 4), 0);
        }
    }, 400);
}

// EVENT 3 (7 BOXES)
function boxFunction(specialBox) {
    stopSpawnEvents = true;
    let eventBackdrop = document.createElement("div");
    eventBackdrop.classList.add("cover-all","flex-column","event-dark");

    let boxOuterDiv = document.createElement("div");
    boxOuterDiv.id = "box-outer-div";
    boxOuterDiv.classList.add("box-outer-div","flex-row","box-event");

    let count = 8;
    while (count--) {
        let boxImageDiv = document.createElement("div");
        boxImageDiv.classList.add("flex-row","box-image-div");

        let boxImageImg = document.createElement("img");
        boxImageImg.src = "./assets/event/box-" + count + ".webp";
        boxImageImg.id = ("box-" + count);
        boxImageImg.addEventListener("click", function() {
            boxOpen(eventBackdrop,specialBox);
        })
        boxImageDiv.appendChild(boxImageImg);
        boxOuterDiv.appendChild(boxImageDiv);
        if (count === 1) {break}
    }
    mainBody.append(eventBackdrop,boxOuterDiv);
}

function boxOpen(eventBackdrop,specialBox) {
    let boxOuter = document.getElementById("box-outer-div")
    let boxOuterNew = boxOuter.cloneNode(true);
    boxOuter.parentNode.replaceChild(boxOuterNew, boxOuter);

    let boxOutcome = document.createElement("img");
    boxOutcome.classList.add("box-outcome","slide-in-blurred-top");
    let outcomeText;
    let outcomeNumber = 0;
    
    if (specialBox) {
        let randomSpecial = randomInteger(2,6);
        outcomeNumber = randomInteger(5,15);
        genericItemLoot();
        boxOutcome.src = `./assets/event/verygood-${randomSpecial}.webp`;
        outcomeText = specialText[randomSpecial-2];
    } else {
        let boxChance = randomInteger(1,101);
        if (saveValues.goldenTutorial && boxChance >= 90) {
            outcomeNumber = randomInteger(5, 15);
            boxOutcome.src = "./assets/icon/goldenNut.webp";
            outcomeText = `Oh! It had Golden Nuts!`;
        } else if (boxChance >= 60) {
            outcomeNumber = randomInteger(40,60);
            boxOutcome.src = "./assets/icon/primogemLarge.webp";
            outcomeText = "The box contained primogems!";
        } else if (boxChance >= 25) {
            let goodOutcome = randomInteger(1,8);
            boxOutcome.src = "./assets/event/good-" + goodOutcome + ".webp";
            outcomeText = "Oh, it had a gemstone! (+Power for " +boxElement[goodOutcome]+ " characters)";
            outcomeNumber = 5009.1 + goodOutcome;
        } else if (boxChance >= 15) {
            boxOutcome.src = "./assets/event/bad-" + randomInteger(1,6) + ".webp";
            outcomeText = "Uh oh, an enemy was hiding in the box!";
            persistentValues.aranaraLostValue++;
        } else if (boxChance >= 5) {
            boxOutcome.src = "./assets/event/verygood-1.webp";
            outcomeText = "It had a precious gemstone!! (+Power for all characters)";
            outcomeNumber = 5002.1;
        }  else {
            boxOutcome.src = "./assets/event/verybad-" + randomInteger(1,5) + ".webp";
            let badOutcomePercentage = randomInteger(70,85);
            outcomeText = "Uh oh! Run away!! (Lost " +(100 - badOutcomePercentage)+ "% of Energy)";
            persistentValues.aranaraLostValue++;
            outcomeNumber = badOutcomePercentage;
        }
    }

    eventOutcome(outcomeText, eventBackdrop, "box", outcomeNumber);
    boxOuterNew.appendChild(boxOutcome);
    setTimeout(()=> {
        boxOuterNew.remove();
        eventBackdrop.remove();
    },4000);
}

// EVENT 4 (MINESWEEPER)
function minesweeperEvent(hardMode = false) {
    const ROWS = hardMode === true ? 9 : 8;
    const COLS = hardMode === true ? 18 : 8;
    const mines = hardMode === true ? randomInteger(28, 30) : randomInteger(6, 10);

    stopSpawnEvents = true;
    const startTimestamp = performance.now();
    let eventBackdrop = document.createElement("div");
    eventBackdrop.classList.add("cover-all","flex-row","event-dark","minesweeper-backdrop");
    eventBackdrop.style.flexWrap = "wrap";
    eventBackdrop.style.columnGap = "1%";

    let eventDescription = document.createElement("p");
    eventDescription.innerText = "Reveal all the tiles \n without whopperflowers!";
    eventDescription.classList.add("event-description");

    let mineInfo = document.createElement("div");
    mineInfo.id = "mine-info";
    mineInfo.classList.add("flex-column");
    let mineInfoTop = createDom('img');
    mineInfoTop.src = "./assets/event/minesweeper-top.webp";
    let mineInfoBot = createDom('img');
    mineInfoBot.src = "./assets/event/minesweeper-bot.webp";
    mineInfo.append(mineInfoTop,mineInfoBot);
    
    let mineBackground = document.createElement("table");    
    let board;
    let firstClick = true;
    let cellsLeft = ROWS * COLS - mines;
    mineBackground.classList.add("event-mine-bg");
    mineBackground.style.aspectRatio = hardMode ? '2' : '1';
    initializeBoard();

    // INITIALIZE BOARD
    function initializeBoard() {
        board = [];
        for (let r = 0; r < ROWS; r++) {
          board[r] = [];
          for (let c = 0; c < COLS; c++) {
            board[r][c] = { mine: false, revealed: false, flagged: false, adjMines: 0 }
          }
        }
      
        for (let i = 0; i < mines; i++) {
            let r = Math.floor(Math.random() * ROWS);
            let c = Math.floor(Math.random() * COLS);
            if (board[r][c].mine) {
                i--;
            } else {
                board[r][c].mine = true;
            }
        }
      
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (!board[r][c].mine) {
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            if (r + dr >= 0 && r + dr < ROWS && c + dc >= 0 && c + dc < COLS) {
                                if (board[r + dr][c + dc].mine) {
                                    board[r][c].adjMines++;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // COUNT ADJACENT NUMBER OF CELLS
    function countAdjacentMines(row, col) {
        let count = 0;
        for (let r = Math.max(0, row - 1); r <= Math.min(ROWS - 1, row + 1); r++) {
          for (let c = Math.max(0, col - 1); c <= Math.min(COLS - 1, col + 1); c++) {
            if (board[r][c].mine && (r !== row || c !== col)) {
              count++;
            }
          }
        }
        return count;
    }

    // REVEAL CELL + NEIGHBOURS RECURSIVELY IF EMPTY
    function revealCell(r, c) {
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && !board[r][c].revealed) {
            board[r][c].revealed = true;
            cellsLeft--;
            const tr = mineBackground.children[r];
            const td = tr.children[c];
            if (countAdjacentMines(r, c) === 0) {
                td.innerText = "-";
                td.style.backgroundImage = "url(./assets/event/mine-empty.webp)";
                for (let r2 = r - 1; r2 <= r + 1; r2++) {
                    for (let c2 = c - 1; c2 <= c + 1; c2++) {
                        revealCell(r2, c2);
                    }
                }
            } else {
                td.innerText = countAdjacentMines(r, c);
                td.style.backgroundImage = "url(./assets/event/mine-empty.webp)";
            }
        }
    }
        
    // RENDER MINESWEEPER TO SCREEN
    for (let r = 0; r < ROWS; r++) {
        const tr = document.createElement("tr");
        for (let c = 0; c < COLS; c++) {
            const td = createDom('td', {
                style: {
                    width: 100/COLS + '%',
                    height: 100/ROWS + '%',
                }
            });
            td.innerText = board[r][c].revealed
                ? countAdjacentMines(r, c) || "-"
                : "";
            td.addEventListener("contextmenu", function(event) {
                event.preventDefault();
                if (!board[r][c].revealed) {
                    if (board[r][c].flagged) {
                        td.innerText = "";
                        td.style.backgroundImage = "url(./assets/event/mine-unclicked.webp)";
                        board[r][c].flagged = false;
                    } else {
                        td.innerText = "";
                        td.style.backgroundImage = "url(./assets/event/mine-flag.webp)";
                        board[r][c].flagged = true;
                    }
                }
            });
            td.addEventListener("click", function() {
                if (firstClick) {
                    while (board[r][c].mine) {
                        initializeBoard();
                    }
                    firstClick = false;
                }

                if (board[r][c].mine) {
                    td.innerText = "";
                    td.style.backgroundImage = "url(./assets/event/mine-wrong.webp)";

                    let mineFileOutcome = document.createElement("img");
                    let whopperInt = randomInteger(1,4);
                    mineFileOutcome.src = "./assets/event/whopperflower-"+whopperInt+".webp";
                    mineFileOutcome.classList.add("mine-outcome","slide-in-blurred-bottom");

                    eventBackdrop.append(mineFileOutcome);
                    eventOutcome("The whopperflowers were alerted!",eventBackdrop);
                    persistentValues.aranaraLostValue++;
                } else {
                    revealCell(r, c);
                    td.style.backgroundImage = "url(./assets/event/mine-empty.webp)";
                }

                if (cellsLeft <= 0) {
                    let randomPrimo = randomInteger(200, 400);
                    genericItemLoot();
                    newPop(1);
                    sortList("table2");

                    eventOutcome(`All whopperflowers have been revealed!`,eventBackdrop);
                    const endTimestamp = performance.now();
                    setTimeout(()=> {
                        currencyPopUp([["items", 0], ["primogem", randomPrimo]]);
                        if (hardMode) {
                            addTreeCore(randomInteger(3, 6), 20);
                        }
                        if (endTimestamp - startTimestamp < 15 * 1000) {
                            challengeNotification(({category: 'specific', value: [2, 7]}));
                        }
                    },4000)
                }
            });
            tr.appendChild(td);
        }
        mineBackground.appendChild(tr);
    }

    let cancelBox = document.createElement("button");
    cancelBox.classList.add("cancel-event");
    cancelBox.innerText = "Give Up...";
    cancelBox.addEventListener("click",()=>{
        if (eventBackdrop != null) {
            eventBackdrop.remove();
            stopSpawnEvents = false;
        }
    })

    eventBackdrop.append(eventDescription,mineBackground,cancelBox);
    hardMode ? null : eventBackdrop.append(mineInfo);
    mainBody.append(eventBackdrop);
}

let weaselCount = 0;
let goldWeaselCount = 0;
// EVENT 5 (WHACK-A-MOLE)
function weaselEvent(specialWeasel, hardMode) {
    stopSpawnEvents = true;
    
    const weaselElementMax = hardMode ? 27 : 18;
    let weaselElement = weaselElementMax;
    weaselCount = 0;
    goldWeaselCount = 0;

    let eventBackdrop = document.createElement("div");
    eventBackdrop.classList.add("cover-all","event-dark","flex-row","event-dark-row","weasel-backdrop");
    eventBackdrop.style.flexWrap = "wrap";
    eventBackdrop.hardMode = hardMode;
    let eventDescription = document.createElement("p");
    eventDescription.innerText = "Catch the glowing weasel!";
    eventDescription.classList.add("event-description");
    eventDescription.style.width = "100%";
    eventDescription.style.position = "relative";
    eventDescription.style.top = "5%";
    let weaselBack = document.createElement("div");
    weaselBack.classList.add("flex-row","weasel-back");
    weaselBack.style.width = hardMode ? '80%' : '60%';

    while (weaselElement--) {
        let weaselContainer = document.createElement("div");
        weaselContainer.classList.add("weasel");
        weaselContainer.style.width = `${(100 * 3 / weaselElementMax)}%`;

        let weaselBackImage = document.createElement("img");
        weaselBackImage.src = './assets/event/weasel-10.webp';
        weaselContainer.append(weaselBackImage)
        weaselBack.append(weaselContainer);
    }

    let delay = 2000;
    setTimeout(() => {
        addWeasel(weaselBack,delay,specialWeasel,hardMode);
        weaselBurrow.load();
        weaselBurrow.play();
    },2000)

    let weaselTimerDiv = document.createElement("div");
    weaselTimerDiv.classList.add("weasel-timer-div");
    let weaselTimer = document.createElement("div");
    weaselTimer.classList.add("weasel-timer");
    let weaselCountText = document.createElement("p");
    weaselCountText.id = "visible-weasel-count";
    weaselCountText.innerText = weaselCount;

    let weaselClock = document.createElement("img");
    weaselClock.src = "./assets/icon/hourglass.webp"
    weaselClock.classList.add("weasel-hourglass");
    let weaselTimerOutline = document.createElement("img");
    weaselTimerOutline.src = "./assets/event/timer-bar.webp";
    weaselTimerOutline.classList.add("weasel-outline");
    let weaselTimerImage = document.createElement("img");
    weaselTimerImage.src = "./assets/event/timer-sand.webp";
    weaselTimerImage.classList.add("weasel-sand");
    weaselTimerImage.style.animationDuration = hardMode ? '40s' : '25s';
    weaselTimerImage.addEventListener("animationend",() => {
        let eventText = `You caught ${weaselCount} weasel thieves!`;
        if (goldWeaselCount > 0) {
            eventOutcome(eventText, eventBackdrop, "weasel", weaselCount, goldWeaselCount);
        } else {
            eventOutcome(eventText, eventBackdrop, "weasel", weaselCount, 0);
        }
    })

    weaselTimer.append(weaselTimerImage,weaselTimerOutline,weaselCountText);
    weaselTimerDiv.append(weaselTimer,weaselClock)

    let fakeWeaselAlert = document.createElement("div");
    fakeWeaselAlert.id = "fake-weasel-alert";
    fakeWeaselAlert.classList.add("flex-row");
    fakeWeaselAlert.innerText = "Beware of the fake weasel thieves!";

    eventBackdrop.append(eventDescription,weaselBack,weaselTimerDiv,fakeWeaselAlert);
    mainBody.append(eventBackdrop);
}

function addWeasel(weaselBack,delay,specialWeasel,hardMode) {
    let weaselDiv = weaselBack.children;
    let realWeasel = hardMode ? randomInteger(0, 27) : randomInteger(0,18);
    let currentWeaselSrc = 0;
    let specialWeaselSpawns = false;
    if (specialWeasel) {specialWeaselSpawns = randomIntegerWrapper(luckRate + 45, 100)}

    for (let i = 0, len = weaselDiv.length; i < len; i++) {
        let weaselImage = weaselDiv[i].querySelector('img');
        if (i === realWeasel) {
            weaselImage.style.filter = 'unset';
            if (specialWeaselSpawns) {
                weaselImage.src = "./assets/event/weasel-1.webp";
            } else {
                currentWeaselSrc = randomInteger(2,4);
                weaselImage.src = "./assets/event/weasel-"+currentWeaselSrc+".webp";
            }

            let springInterval = (randomInteger(20,25) / 100);
            weaselImage.classList.add("spring");
            weaselImage.style["animation-duration"] = springInterval + "s";
            const brightness = hardMode ? randomInteger(85, 95) : 100;
            weaselImage.style.filter = `brightness(${brightness / 100})`;

            const weaselFunc = () => {
                mailElement.load();
                mailElement.playbackRate = 1.35;
                mailElement.play();

                delay *= 0.65;
                delay = Math.max(delay, 450);

                clearWeasel(weaselBack, delay, specialWeasel,hardMode);
                weaselCount++;
                if (specialWeaselSpawns) {goldWeaselCount++}

                let weaselCountText = document.getElementById("visible-weasel-count");
                weaselCountText.innerText = weaselCount;
            };

            weaselImage.addEventListener("click", weaselFunc);
            weaselImage.addEventListener("mousedown", weaselFunc);
            weaselImage.addEventListener("touchstart", weaselFunc);
        } else {
            let emptyWeasel = hardMode ? randomInteger(7, 9) : randomInteger(7, 11);
            
            if (emptyWeasel != 10 & emptyWeasel != 9) {
                let springInterval = (randomInteger(15, 20) / 100);
                weaselImage.classList.add("spring");
                weaselImage.style["animation-duration"] = springInterval + "s";
                const brightness = hardMode ? randomInteger(75, 100) : randomInteger(65, 90);
                weaselImage.style.filter = `brightness(${brightness / 100})`;
            }
            weaselImage.src = "./assets/event/weasel-"+emptyWeasel+".webp";
        }
    }

    let fakeAmount = Math.floor(2000/(delay / (hardMode ? 3 : 1)) + 0.3);
    if (fakeAmount > 10) {
        fakeAmount = hardMode ? Math.min(20, fakeAmount) : 10;
    }

    let combination = generateCombination(fakeAmount);
    for (let j = 0, len = combination.length; j < len; j++) {
        if ((combination[j] - 1) === realWeasel) {continue}
        let weaselImage = weaselDiv[combination[j] - 1].querySelector('img');
        let fakeWeasel = randomInteger(5, 7);
        if (specialWeasel) {fakeWeasel = randomInteger(4, 7)}
        if (hardMode) {
            fakeWeasel = specialWeasel ? 4 : (currentWeaselSrc + 3);
        }

        weaselImage.src = "./assets/event/weasel-"+fakeWeasel+".webp";
        weaselImage.style.filter = 'unset';

        let springInterval = (randomInteger(15,35) / 100);
        weaselImage.classList.add("spring");
        weaselImage.style["animation-duration"] = springInterval + "s";

        const weaselFunc = () => {
            let fakeWeaselAlert = document.getElementById("fake-weasel-alert");
            fakeWeaselAlert.style.animation = "none";
            setTimeout(() => { fakeWeaselAlert.style.animation = "fadeOutWeasel 3s linear forwards"}, 10);
            weaselDecoy.load();
            weaselDecoy.play();
            clearWeasel(weaselBack, delay, specialWeasel,hardMode);
        };

        weaselImage.addEventListener("click", weaselFunc);
        weaselImage.addEventListener("mousedown", weaselFunc);
        weaselImage.addEventListener("touchstart", weaselFunc);
    }
}

function clearWeasel(weaselBack,delay,specialWeasel,hardMode) {
    let weaselDiv = weaselBack.children;
    for (let i=0, len=weaselDiv.length; i < len; i++) {
        let weaselImage = weaselDiv[i].querySelector('img');
        weaselImage.src = './assets/event/weasel-10.webp';
        if (weaselImage.classList.contains("spring")) {
            weaselImage.classList.remove("spring");
        }
        let new_weaselImage = weaselImage.cloneNode(true);
        weaselImage.parentNode.replaceChild(new_weaselImage, weaselImage);
    }

    setTimeout(()=>{
        addWeasel(weaselBack, delay, specialWeasel,hardMode);
        weaselBurrow.load();
        weaselBurrow.play();
    },delay)
}

// CHOOSE FAKE WEASEL POSITIONS FROM 18 SPOTS
function generateCombination(n) {
    let positions = Array.from({ length: 18 }, (_, i) => i + 1);
    let combination = [];
  
    for (let i = 0; i < n; i++) {
      const randomIndex = Math.floor(Math.random() * positions.length);
      combination.push(positions[randomIndex]);
      positions.splice(randomIndex, 1);
    }

    combination.sort((a,b) => a - b)
    return combination;
}
 
// EVENT 6 (RAIN)
function rainEvent() {
    stopSpawnEvents = true;
    let eventBackdrop = document.createElement("div");
    eventBackdrop.classList.add("cover-all","flex-column","event-dark");

    let rainText = document.createElement("div");
    let rainTextBackground = document.createElement("div");
    let rainTextDiv = document.createElement("p");

    let eventDescription = document.createElement("p");
    eventDescription.innerText = "Catch the falling nuts!";
    eventDescription.classList.add("event-description");
    eventDescription.style.position = "absolute";
    eventDescription.style.top = "1%";
    eventBackdrop.append(eventDescription);

    let nutCount = 0;
    let scarabCount = 0;

    rainText.classList.add("event-rain-text");
    let dpsMultiplier = (saveValues.dps + 1) * 10;
    let tempScore = 0;
    let tempPrimogem = 0;
    let tempGolden = 0;
    rainTextDiv.innerText = tempScore;
    rainText.append(rainTextBackground,rainTextDiv)
    mainBody.appendChild(rainText);

    function spawnRain() {
        let animation = `rain ${(randomInteger(8,12)/2)}s linear forwards`
        let type = randomInteger(1,101);
        var img = document.createElement("img");

        let clickFunction;

        if (type >= 95 && saveValues.goldenTutorial) {
            img.src = "./assets/icon/goldenIcon.webp";
            animation = `rain-rotate ${(randomInteger(6,10)/2)}s linear forwards`;
            clickFunction = () => {
                reactionCorrectElement.load();
                reactionCorrectElement.play();
                img.remove();

                tempGolden++;
                nutCount++;
            }
        } else if (type >= 85) {
            img.src = "./assets/icon/primogemLarge.webp"
            animation = `rain-rotate ${(randomInteger(3,8)/2)}s linear forwards`;
            clickFunction = () => {
                img.remove();
                tempPrimogem += randomInteger(10,20);
                rainTextDiv.innerText = abbrNum(tempScore * dpsMultiplier) + " Nuts | " + Math.round(tempPrimogem * additionalPrimo) + " Primos";
            }
        } else if (type >= 65) {
            img.src = "./assets/icon/scarab.webp";
            clickFunction = () => {
                weaselDecoy.load();
                weaselDecoy.play();
                img.remove();

                tempScore -= 10;
                tempScore = Math.max(0, tempScore);
                tempPrimogem -= randomInteger(50,80);
                tempPrimogem = Math.max(0, tempPrimogem);
                scarabCount++;

                rainTextDiv.innerText = abbrNum(tempScore * dpsMultiplier)+ " Nuts | " + Math.round(tempPrimogem * additionalPrimo) + " Primos";
            }
        } else {
            img.src = "./assets/icon/nut.webp";
            clickFunction = () => {
                img.remove();
                tempScore++;
                nutCount++;

                rainTextDiv.innerText = abbrNum(tempScore * dpsMultiplier)+ " Nuts | " + tempPrimogem + " Primos";
            }
        }

        img.addEventListener('click', clickFunction);
        img.addEventListener('mousedown', clickFunction);
        img.addEventListener('touchstart', clickFunction);

        img.style.top = "-15%";
        img.style.left = `${randomInteger(5,95)}%`
        img.style.animation = animation;
        img.addEventListener('animationend', () => {img.remove()});
        img.classList.add("raining-image");
        eventBackdrop.append(img);
    }

    let rainTimer = setInterval(() => {
        spawnRain();
    }, randomInteger(250,350));

    setTimeout(()=>{
        clearInterval(rainTimer);
        setTimeout(()=>{
            rainText.classList.add("text-pop");
            rainText.addEventListener('animationend', () => {
                eventBackdrop.remove();
                if (nutCount >= 60) {
                    challengeNotification(({category: 'specific', value: [1, 9]}));
                }
                if (scarabCount >= 15) {
                    challengeNotification(({category: 'specific', value: [0, 7]}));
                }

                stopSpawnEvents = false;
                saveValues.realScore += tempScore * dpsMultiplier;
                if (tempPrimogem != 0 && tempGolden != 0) {
                    currencyPopUp([["primogem", tempPrimogem],["nuts", tempGolden]]);
                } else if (tempPrimogem != 0) {
                    currencyPopUp([["primogem", tempPrimogem]]);
                } else if (tempGolden != 0) {
                    currencyPopUp([["nuts", tempGolden]]);
                }

                rainText.remove();
            });
        },2500)
    }, 28000);
    mainBody.append(eventBackdrop);
}

// EVENT 7 (SIMON SAYS)
function simonEvent(hardMode) {
    const hexMode = randomInteger(1,3) === 2 ? true : false;

    stopSpawnEvents = true;
    let eventBackdrop = document.createElement("div");
    eventBackdrop.classList.add("cover-all","flex-column","event-dark");

    let eventDescription = document.createElement("p");
    eventDescription.innerText = "Follow the sequence!";
    eventDescription.classList.add("event-description");
    eventDescription.style.position = "absolute";
    eventDescription.style.top = "2%";
    eventBackdrop.append(eventDescription);

    let saysContainer = document.createElement('div');
    saysContainer.sequenceArray = [];
    saysContainer.activeArray = [];
    saysContainer.ready = false;

    let scoreCounter = createDom('p', {
        class: ['simon-class', 'flex-row'],
        innerText: '[1]'
    });

    let currentScore = 1;
    let requiredAmount;
    let firstTime = true;

    if (hexMode) {
        requiredAmount = 6;
        if (hardMode) { requiredAmount = 9 }

        saysContainer.classList.add('hex-container');
        const hexArray = {
            1:[-46,-74.5], 2:[53.5,-74.5], 3:[103,0], 4:[53,74.5], 5:[-47,74], 6:[-96,0]
        }
        for (let i = 1; i < 7; i++) {
            let saysImg = document.createElement('img');
            saysImg.src = `./assets/event/hex-${i}.webp`;
            saysImg.id = `says-${i}`;
            saysImg.classList.add('say-img');
            saysImg.style.filter = 'brightness(0.1)';
            saysImg.style.transform = `translate(${hexArray[i][0]}%, ${hexArray[i][1]}%)`;
            saysImg.addEventListener('click',()=>{
                saysClick(i);
            })
            saysContainer.appendChild(saysImg);
        }
    } else {
        requiredAmount = 7;
        if (hardMode) { requiredAmount = 10 }

        saysContainer.classList.add('say-container');
        for (let i = 1; i < 5; i++) {
            let saysImg = document.createElement('img');
            saysImg.src = `./assets/event/says-${i}.webp`;
            saysImg.id = `says-${i}`;
            saysImg.classList.add('say-img');
            saysImg.style.filter = 'brightness(0.1)';
            saysImg.style.transform = `translate(${(((i === 1) || (i === 4)) ? -1 : 1) * 55}%, ${(i < 3 ? -1 : 1) * 55}%)`;
            saysImg.addEventListener('click',()=>{
                saysClick(i);
            })
            saysContainer.appendChild(saysImg);
        }
    }

    setTimeout(()=>{
        addSequence();
    },2000);

    function showSequence(array) {
        let colorPick = array[0];
        let activeElement = document.getElementById(`says-${colorPick}`);
        activeElement.style.filter = 'brightness(1)';

        simonElement.src = `./assets/sfx/simon-${colorPick}.mp3`;
        simonElement.load();
        simonElement.play();

        setTimeout(()=>{
            activeElement.style.filter = 'brightness(0.1)';
            array.shift();
            if (currentScore === 1) {
                saysContainer.ready = true;
                setTimeout(() => {
                    if (firstTime) {
                        saysContainer.ready = false;
                        showSequence([colorPick]);
                    }
                }, 2550);   
            } else {
                if (array.length === 0) {
                    saysContainer.ready = true;
                } else {
                    setTimeout(() => {showSequence(array)}, hardMode ? 350 : 550);   
                }
            }
        },  hardMode ? 550 : 750);
    }

    function addSequence() {
        let colorPick = randomInteger(1,5);
        if (hexMode) {colorPick = randomInteger(1,7)}
        saysContainer.sequenceArray.push(colorPick);
        // JAVASCRIPT PASSES REFERENCES SO THIS IS NEEDED TO PREVENT MODIFICATIONS TO THE ORIGINAL
        showSequence(Array.from(saysContainer.sequenceArray));
    }

    function saysClick(number) {
        if (!saysContainer.ready) {return}
        if (firstTime) {!firstTime};
        saysContainer.ready = false;
        saysContainer.activeArray.push(number);

        let activeElement = document.getElementById(`says-${number}`);
        activeElement.style.filter = 'brightness(1)';

        simonElement.src = `./assets/sfx/simon-${number}.mp3`;
        simonElement.load();
        simonElement.play();

        for (let i = 0; i < saysContainer.activeArray.length; i++) {
            if (saysContainer.activeArray[i] !== saysContainer.sequenceArray[i]) {
                let eventText = `You missed the sequence!`;
                persistentValues.aranaraLostValue++;
                eventOutcome(eventText, eventBackdrop, "simon", 0);
                return;
            }
        }
        
        setTimeout(()=>{
            activeElement.style.filter = 'brightness(0.1)';
            if (saysContainer.sequenceArray.length === saysContainer.activeArray.length) {
                setTimeout(()=>{
                    saysContainer.activeArray = [];
                    currentScore++;
                    if (currentScore >= requiredAmount) {
                        let eventText = `You win!`;
                        eventOutcome(eventText, eventBackdrop, "simon", hexMode ? randomInteger(120, 160) : randomInteger(90, 130));
                        if (hardMode) {
                            addTreeCore(randomInteger(4, 6), 25);           
                        }
                        return;
                    } else {
                        scoreCounter.innerText = `[${currentScore}]`;
                        addSequence();
                    }
                }, 300);
            } else {
                saysContainer.ready = true;
            }
        },300);
    }

    saysContainer.append(scoreCounter);
    eventBackdrop.append(saysContainer);
    mainBody.append(eventBackdrop);
}

// EVENT 8 (BATTLESHIP)
function battleshipEvent() {
    stopSpawnEvents = true;
    let eventBackdrop = document.createElement("div");
    eventBackdrop.classList.add("cover-all","flex-column","event-dark");

    let eventDescription = document.createElement("p");
    eventDescription.innerText = "Hide your keys!";
    eventDescription.classList.add("event-description");
    eventDescription.style.position = "absolute";
    eventDescription.style.top = "5%";
    eventBackdrop.append(eventDescription);

    const battleshipContainer = document.createElement('div');
    battleshipContainer.classList.add('battleship-div','flex-row');
    battleshipContainer.gameStarted = false;
    battleshipContainer.transition = false;
    const battleshipLeft = document.createElement('div');
    battleshipLeft.classList.add('battleship-left','flex-column');
    const battleshipRight = document.createElement('div');
    battleshipRight.classList.add('battleship-right','flex-column');

    let keyContainer = document.createElement('div');
    keyContainer.classList.add('key-container');
    keyContainer.disp;
    keyContainer.activeKey;
    keyContainer.horizontal = true;

    let rotateButton = document.createElement('button');
    rotateButton.style.transform = 'rotate(90deg)';
    rotateButton.addEventListener('click',() => {
        keyContainer.horizontal = !(keyContainer.horizontal);
        rotateButton.style.transform = keyContainer.horizontal ? 'rotate(90deg)' : 'rotate(180deg)';
    })

    let confirmButton = document.createElement('button');
    confirmButton.addEventListener('click',() => {
        if (enemyKeys.length !== 3) {return}
        eventDescription.innerText = "Find the Aranara's keys!"
        startBattleship(rotateButton, confirmButton, keyContainer);
    })
    confirmButton.innerText = 'Confirm Placement';
    confirmButton.style.gridColumn = 'span 3';
    confirmButton.style.display = 'none';
    keyContainer.append(rotateButton, confirmButton);

    for (let i = 0; i < 3; i++) {
        let key = createDom('img');
        key.src = `./assets/event/key-${i+1}.webp`;
        key.disp = i + 1;
        key.horizontal;
        key.pos = [];

        // key.id = `event-key-${i}`;
        key.classList.add('dim-filter');
        key.style.gridColumn = `span ${key.disp}`;
        key.addEventListener('click',() => {selectKey(key)})
        keyContainer.appendChild(key);
    }

    const friendlyDiv = document.createElement('div');
    friendlyDiv.id = 'friendly-div'
    friendlyDiv.classList.add('battleship-container');
    friendlyDiv.grid = {};
    for (let i = 0; i < 5; i++) {
        friendlyDiv.grid[i+1] = [false,false,false,false,false];
        for (let j = 0; j < 5; j++) {
            let container = document.createElement('div');
            container.pos = i * 5 + j;
            container.addEventListener('click',(event) => {
                event.stopPropagation();
                addKey(container, i, j);  
            })
            friendlyDiv.append(container);
        }
    }

    function selectKey(key) {
        if (keyContainer.activeKey) {
            if (keyContainer.activeKey != key) {
                keyContainer.activeKey.classList.add('dim-filter');
            }
        }

        if (key.pos.length !== 0) {
            returnKey(key);
        } else {
            if (key.classList.contains('dim-filter')) key.classList.remove('dim-filter');
            keyContainer.activeKey = key;
            keyContainer.disp = key.disp;
        }
    }

    function returnKey(key) {
        let length = key.disp;
        if (key.horizontal) {
            while (length > 0) {
                friendlyDiv.grid[key.pos[0] + 1][key.pos[1] + length - 1] = false;
                length--;
            }
        } else {
            while (length > 0) {
                friendlyDiv.grid[key.pos[0] + length][key.pos[1]] = false;
                length--;
            }
        }

        key.pos = [];
        key.style.width = '90%';
        key.style.transform = 'unset';
        key.style.gridColumn = `span ${key.disp}`;
        if (!key.classList.contains('dim-filter')) key.classList.add('dim-filter');
        setTimeout(() => {
            keyContainer.append(key);
            checkKeyContainer();
        },0);
    }

    function keyCollision(type, objectInfo) {
        let row = objectInfo.row;
        let column = objectInfo.column;
        let horizontal = objectInfo.horizontal;
        let key = objectInfo.key;
        let length = keyContainer.disp;

        if (horizontal) {
            if (column + length > 5) {
                let offset = column + length - 5;
                let newCell = getSiblingAbove(objectInfo.cell, offset, 1);
                keyCollision('friendly',{
                    ...objectInfo, cell: newCell, column: (column - offset)
                    }
                )
                return;
            }

            // THIS TO CHECK IF THE CELLS HAS KEYS FIRST
            // COMBINING THEM WILL NOT UNDO ANY CELLS ALREADY SET TO TRUE
            // IF A CELL IS DETERMINED TO HAVE A KEY HALFWAY
            while (length > 0) {
                if (friendlyDiv.grid[row + 1][column + length - 1]) {return};
                length--;
            }
            length = keyContainer.disp;
            
            while (length > 0) {
                friendlyDiv.grid[row + 1][column + length - 1] = true;
                length--;
            }
            key.horizontal = true;
        } else {
            if (row + length > 5) {
                let offset = row + length - 5;
                let newCell = getSiblingAbove(objectInfo.cell, offset, 5);
                keyCollision('friendly',{
                    ...objectInfo, cell: newCell, row: (row - offset)
                    }
                )
                return;
            }

            while (length > 0) {
                if (friendlyDiv.grid[row + length][column]) {return};
                length--;
            }
            length = keyContainer.disp;
            
            while (length > 0) {
                friendlyDiv.grid[row + length][column] = true;
                length--;
            }
            key.horizontal = false;
            key.style.transform = 'rotate(90deg) translate(0, -100%)';
            key.style.transformOrigin = '0 0';
        }

        key.pos = [row, column];
        key.style.padding = '0';
        key.style.width = `${keyContainer.disp}00%`;
        keyContainer.disp = null;
        keyContainer.activeKey = null;

        if (key.classList.contains('dim-filter')) key.classList.remove('dim-filter');
        objectInfo.cell.appendChild(key);
        checkKeyContainer();
    }

    function addKey(cell, row, column) {
        if (keyContainer.activeKey) {
            let key = keyContainer.activeKey;
            key.style.transform = 'unset';

            keyCollision('friendly',{
                row: row,
                column: column,
                horizontal: keyContainer.horizontal,
                key: key,
                cell: cell,
            })
        }
    }

    function getSiblingAbove(element, offset, multiples) {
        let sibling = element.previousElementSibling;
        offset *= multiples;
        offset--;

        while (offset > 0) {
            sibling = sibling.previousElementSibling;
            offset--;
        }

        return sibling;
    }

    function checkKeyContainer() {
        if (keyContainer.children.length === 2) {
            confirmButton.style.display = 'block';
        } else {
            confirmButton.style.display = 'none';
        }
    }

    const enemyDiv = document.createElement('div');
    enemyDiv.classList.add('battleship-container','battleship-cover');
    const textSide = document.createElement('p');
    textSide.innerText = 'Aranara Side';
    textSide.id = 'enemy-battleship-text';
    
    enemyDiv.grid = {};
    for (let i = 0; i < 5; i++) {
        enemyDiv.grid[i + 1] = [false,false,false,false,false];
        for (let j = 0; j < 5; j++) {
            let container = document.createElement('div');
            container.pos = i * 5 + j;
            container.addEventListener('click',(event) => {
                event.stopPropagation();
                if (battleshipContainer.gameStarted) {markTile('enemy', i, j)}
            })
            enemyDiv.append(container);
        }
    }

    const friendChildren = friendlyDiv.children;
    friendlyDiv.score = 3 + 2 + 1;
    const enemyChildren = enemyDiv.children;
    enemyDiv.score = 3 + 2 + 1;
    let choicesTaken = 0;
    
    const enemyKeys = [];
    for (let i = 0; i < 3; i++) {
        let key = createDom('img');
        key.src = `./assets/event/key-${i+1}.webp`;
        key.classList.add('enemy-key');
        key.disp = i + 1;

        enemyKeys.push({
            key: key,  
            pos: []
        })
        populateEnemy(enemyDiv.grid, i + 1);
    }

    async function populateEnemy(grid, length) {
        let column = randomInteger(0,5);
        let row = randomInteger(1,6);
        let horizontal = randomInteger(1,3) === 1 ? true : false;

        let tempLength = length;
        if (horizontal) {
            if (column + length > 5) {
                populateEnemy(grid, length);
                return;
            }

            while (tempLength > 0) {
                if (grid[row][column + tempLength - 1]) {
                    populateEnemy(grid, length);
                    return;
                }
                tempLength--;
            }

            tempLength = length;
             
            while (tempLength > 0) {
                grid[row][column + tempLength - 1] = true;
                tempLength--;
            }
        } else {
            if (row + length > 5) {
                populateEnemy(grid, length);
                return;
            }

            while (tempLength > 0) {
                if (grid[row + tempLength - 1][column]) {
                    populateEnemy(grid, length);
                    return;
                }
                tempLength--;
            }

            tempLength = length;
            while (tempLength > 0) {
                grid[row + tempLength - 1][column] = true;
                tempLength--;
            }
        }

        enemyKeys[length - 1].pos = [row, column, horizontal];
        let key = enemyKeys[length - 1].key;
        key.style.width = `${length}00%`;
        
        enemyChildren[(row - 1) * 5 + column].appendChild(key);
        if (!horizontal) {
            key.style.transform = 'rotate(90deg) translate(0, -100%)';
            key.style.transformOrigin = '0 0';
            while (length > 0) {
                enemyChildren[(row + length - 2) * 5 + column].key = key;
                length--;
            }
        } else {
            while (length > 0) {
                enemyChildren[(row - 1) * 5 + column + (length - 1)].key = key;
                length--;
            }
        }
    }

    function startBattleship(rotateButton, confirmButton, keyContainer) {
        friendlyDiv.classList.add('block-input');
        enemyDiv.classList.remove('battleship-cover');
        rotateButton.remove();
        confirmButton.remove();

        const textSide = document.createElement('p');
        textSide.innerText = 'Your Side';
        textSide.id = 'friendly-battleship-text';
        keyContainer.appendChild(textSide);

        battleshipContainer.gameStarted = true;
        transitionTurn('enemy');
    }

    function transitionTurn(type) {
        battleshipContainer.transition = true;
        const enemySide = document.getElementById('enemy-battleship-text');
        const friendSide = document.getElementById('friendly-battleship-text');

        if (type === 'enemy') {
            enemySide.classList.add('dim-filter');
            if (friendSide.classList.contains('dim-filter')) {friendSide.classList.remove('dim-filter');}
            setTimeout(() => {
                battleshipContainer.transition = false;
                markTile('friendly');
            }, 1000)
        } else {
            friendSide.classList.add('dim-filter');
            if (enemySide.classList.contains('dim-filter')) {enemySide.classList.remove('dim-filter');}
            setTimeout(() => {battleshipContainer.transition = false}, 400);
        }
    }

    function markTile(type, row, column) {
        if (!battleshipContainer.gameStarted || battleshipContainer.transition) {return}
        let source;
        if (type === 'enemy') {
            choicesTaken++;
            if (enemyDiv.grid[row + 1][column] === true) {
                source = './assets/event/cross.webp';
                shopElement.load();
                shopElement.play();
                enemyDiv.score--;
                checkScore('enemy');
            } else if (enemyDiv.grid[row + 1][column] === false) {
                source = './assets/event/circle.webp';
                mailElement.load();
                mailElement.play();
            } else {
                return;
            }
            
            let cross = createDom('img');
            cross.classList.add('battleship-cross');
            cross.src = source;

            enemyChildren[row * 5 + column].appendChild(cross);
            enemyDiv.grid[row + 1][column] = 0;
            showEnemyKey(enemyChildren[row * 5 + column]);
            transitionTurn(type);
        } else if (type === 'friendly') {
            let row = randomInteger(0,5);
            let column = randomInteger(0,5);
            if (friendlyDiv.grid[row + 1][column] === true) {
                source = './assets/event/cross.webp';
                shopElement.load();
                shopElement.play();
                friendlyDiv.score--;
                checkScore('friendly')
            } else if (friendlyDiv.grid[row + 1][column] === false) {
                source = './assets/event/circle.webp';
                mailElement.load();
                mailElement.play();
            } else {
                markTile('friendly');
                return;
            }
            
            let cross = createDom('img');
            cross.classList.add('battleship-cross');
            cross.src = source;

            friendChildren[row * 5 + column].appendChild(cross);
            friendlyDiv.grid[row + 1][column] = 0;
            transitionTurn(type);
        }
    }

    function showEnemyKey(cell) {
        if (cell.key) {
            cell.key.disp--;
            if (cell.key.disp === 0) {
                cell.key.style.opacity = '1';
            }
        }
    }

    function checkScore(type) {
        if (type === 'friendly') {
            if (friendlyDiv.score === 0) {
                eventOutcome("You lost! You didn't win any treasure...", eventBackdrop, 0);
                persistentValues.aranaraLostValue++;
                battleshipContainer.gameStarted = false;
            }
        } else {
            if (enemyDiv.score === 0) {
                eventOutcome("You won! You earned some treasure!", eventBackdrop, "battleships", 1);
                battleshipContainer.gameStarted = false;

                setTimeout(() => {
                    if (choicesTaken <= 10) {
                        challengeNotification(({category: 'specific', value: [4, 5]}));
                    }
                }, 3750)
                
            }
        }
    }

    battleshipLeft.append(keyContainer,friendlyDiv);
    battleshipRight.append(textSide,enemyDiv);
    battleshipContainer.append(battleshipLeft,battleshipRight);
    eventBackdrop.append(battleshipContainer);
    mainBody.append(eventBackdrop);
}

// EVENT 9
function snakeEvent(hardMode) {
    stopSpawnEvents = true;
    let eventBackdrop = createDom('div', {
        classList: ["cover-all","flex-column","event-dark","minesweeper-backdrop"],
        hardMode: hardMode,
        style: {
            columnGap: '1%',
            flexDirection: 'column'
        }
    })

    const eventDescription = createDom('p', {
        innerText: 'Collect as many fruits as you can!',
        classList: ['event-description'],
        style: {
            width: '100%',
            flexBasis: 'unset',
            top: '4.5%'
        }
    });

    const canvasRatio = [8, 5];
    const imgArray = [];
    const foodArray = [];
    const cellCount = 15; // ON HEIGHT SIDE

    let width;
    let height;
    let cellLength;
    let currentFruit = 0;

    let loadedImageCount = 0;
    const allImagesLoaded = () => {
        setTimeout(() => {
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            cellLength = height / cellCount;

            generateRandomFood();
            canvas.width = width;
            canvas.height = height;
            draw();
        }, 100);
    }

    for (let i = 1; i < 10; i++) {
        const aranaraImg = createDom('img', {
            src: `./assets/tutorial/aranara-${10 - i}.webp`,
        })

        imgArray.push(aranaraImg);
        aranaraImg.onload = () => {
            loadedImageCount++;
            if (loadedImageCount === 14) {
                allImagesLoaded();
            }
        }
    }

    for (let j = 1; j < 6; j++) {
        const foodImg = createDom('img', {
            src: `./assets/event/snake-fruit-${j}.webp`,
        })

        foodArray.push(foodImg);
        foodImg.onload = () => {
            loadedImageCount++;
            if (loadedImageCount === 14) {
                allImagesLoaded();
            }
        }
    }

    const canvas = createDom('canvas', {
        brightness: 0,
        style: {
            aspectRatio: canvasRatio[0] / canvasRatio[1],
            background: 'url(./assets/event/snake-bg.webp) no-repeat center center/cover',
            height: '85%',
            border: '0.2rem solid var(--bright-dark-green)'
        }
    });

    const ctx = canvas.getContext("2d");
    let foodPosition;
    let initSnake = [
        [0, 0],
        [1, 0],
        [2, 0],
    ];
    
    let snake = [...initSnake];
    let frameCount = 0;
    let extraLife = true;
    let stopGame = false;

    let direction = "right";
    let canChangeDirection = false;
    const changeDirection = (dir) => {
        switch (dir) {
            case "up":
              if (direction === "down" || !canChangeDirection) return
              direction = "up";
              canChangeDirection = false;
              break
            case "down":
              if (direction === "up" || !canChangeDirection) return
              direction = "down";
              canChangeDirection = false;
              break
            case "left":
              if (direction === "right" || !canChangeDirection) return
              direction = "left";
              canChangeDirection = false;
              break
            case "right":
              if (direction === "left" || !canChangeDirection) return
              direction = "right";
              canChangeDirection = false;
              break
        }
    };

    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowUp":
            case "w":
                changeDirection("up");
                break;
            case "ArrowDown":
            case "s":
                changeDirection("down");
                break;
            case "ArrowLeft":
            case "a":
                changeDirection("left");
                break;
            case "ArrowRight":
            case "d":
                changeDirection("right");
                break;
        }
    });

    let heartCounter = createDom('img', {
        src: './assets/icon/heart-full.webp',
        classList: ['snake-heart'],
        style: {
            filter: 'none'
        }
    })
  
    // snake
    function drawSnake() {
        frameCount++;
        for (let i = 0; i < snake.length; i++) {
            ctx.shadowBlur = 3;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
            ctx.shadowOffsetX = cellLength * 0.075;
            ctx.shadowOffsetY = cellLength * 0.075;

            ctx.drawImage(
                imgArray[Math.min(8, (snake.length - i - 1) % 9)], 
                snake[i][0] * cellLength - cellLength * 0.125, snake[i][1] * cellLength - cellLength * 0.125,
                cellLength * 1.25, cellLength * 1.25
            );
        }
    }
    
    // random food position
    function generateRandomFood() {
        let randomX = randomInteger(0, width / cellLength);
        let randomY = randomInteger(0, height / cellLength);

        if (!hardMode && 
            (randomX === 0 || randomX === Math.ceil(width / cellLength - 1) || 
             randomY === 0 || randomY === Math.ceil(height / cellLength - 1))) {
            return generateRandomFood();
        }

        if (hardMode) {
            let wallRoll = randomInteger(0, 80);
            if (wallRoll < 5) {
                randomX = 0;
            } else if (wallRoll < 10) {
                randomY = 0;
            } else if (wallRoll < 15) {
                randomX = Math.ceil(width / cellLength - 1);
            } else if (wallRoll < 20) {
                randomY = Math.ceil(height / cellLength - 1);
            }
        }

        for (let i = 0; i < snake.length; i++) {
            if (snake[i][0] === randomX && snake[i][1] === randomY) {
                return generateRandomFood();
            }
        };

        foodPosition = [randomX, randomY];
        currentFruit = randomInteger(0, 5);
    }
    
    // draw food
    function drawFood() {
        ctx.shadowBlur = 2;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
        ctx.shadowOffsetX = cellLength * 0.05;
        ctx.shadowOffsetY = cellLength * 0.05;

        ctx.drawImage(
            foodArray[currentFruit], 
            foodPosition[0] * cellLength - cellLength * 0.125, foodPosition[1] * cellLength - cellLength * 0.125,
            cellLength * 1.25, cellLength * 1.25
        );
    }

    function snakeMove() {
        let next;
        let last = snake[snake.length - 1];
        // set new snake head by direction
        switch (direction) {
            case "up":
                next = [last[0], last[1] - 1];
                break;
            case "down":
                next = [last[0], last[1] + 1];
                break;
            case "left":
                next = [last[0] - 1, last[1]];
                break;
            case "right": 
                next = [last[0] + 1, last[1]];
                break;
            default:
                break;
        }
      
        // boundary collision
        const boundary =
            next[0] < 0 ||
            next[0] >= width / cellLength ||
            next[1] < 0 ||
            next[1] >= height / cellLength
        
        // self collision
        const selfCollision = snake.some(([x, y]) => next[0] === x && next[1] === y);
      
        // if collision, restart
        if (boundary || selfCollision) {
            stopGame = true;
            if (extraLife) {
                return restart();
            } else {
                eventDescription.innerText = 'Game Over!';
                heartCounter.style.opacity = '0.2';
                canvas.style.filter = 'brightness(0.6) saturate(0.5)';
                setTimeout(() => {
                    eventOutcome("", eventBackdrop, "snake", scoreCounter.realScore);
                }, 300)
            }
        }
      
        snake.push(next);
      
        // if next movement is food, push head, do not shift
        if (next[0] === foodPosition[0] && next[1] === foodPosition[1]) {
            updateScore();
            generateRandomFood();

            if (snake.length < ((cellCount - 1) * (cellCount / canvasRatio[1] * canvasRatio[0] - 1) - 5)) {
                return;
            }
        }

        snake.shift();
        canChangeDirection = true;
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const FRAMES_PER_SECOND = 60;
    const interval = Math.floor(1000 / FRAMES_PER_SECOND);
    let startTime = performance.now();
    let previousTime = startTime;

    let currentTime = 0;
    let deltaTime = 0;

    function animate() {
        function loop(timestamp) {
            currentTime = timestamp;
            deltaTime = currentTime - previousTime;
            if (deltaTime > interval) {
                if (stopGame) return;

                let scoreMultiplier = hardMode 
                                    ? Math.min(MOBILE ? 10 : 12, scoreCounter.score * (MOBILE ? 0.45 : 0.6))
                                    : Math.min(MOBILE ? 10 : 12, scoreCounter.score * (MOBILE ? 0.3 : 0.4));

                canvas.brightness += 0.03 + 0.005 * (scoreMultiplier);

                if (canvas.brightness > 1) {
                    snakeMove();
                    clearCanvas();
                    draw();
                    canvas.brightness = 0;
                }
            }
            window.requestAnimationFrame(loop);
        }
        window.requestAnimationFrame(loop);
    }

    // MINIGAME EVENT LOOP
    const draw = () => {
        drawSnake();
        drawFood();
    }

    const startButton = createDom('button', {
        innerText: 'Start!',
        classList: ['snake-start'],
    });

    const restart = () => {
        snake = [...initSnake];
        direction = "right";
        generateRandomFood();

        heartCounter.src = './assets/icon/heart-empty.webp';
        scoreCounter.score = 0;
        canvas.brightness = 0;
        extraLife = false;

        startButton.innerText = 'Start Again!';
        startButton.addEventListener('click', () => {
            stopGame = false;
            canChangeDirection = true;
            direction = "right";

            animate();
            updateStartButton();
        }, {once : true});
    }

    // BUTTONS UI
    const controlsBox = createDom('div', {
        class: ['snake-button-container'],
    });

    const buttonDirections = ["up", "left", "down", "right"];
    const directionKey = ["W", "A", "S", "D"];
    for (let i = 0; i < buttonDirections.length; i++) {
        const str = buttonDirections[i] + '<br/>' + (!MOBILE ? `(${directionKey[i]})` : '');
        let emptyCell = createDom('b');
        let dirButton = createDom('button', {
            innerHTML: str,
        });

        dirButton.addEventListener('click', () => {
            changeDirection(buttonDirections[i]);
        });

        if (buttonDirections[i] === "up" || buttonDirections[i] === "left") {
            controlsBox.append(emptyCell, dirButton);
        } else {
            controlsBox.append(dirButton);
        }
    };

    const scoreCounter = createDom('p', {
        innerHTML: 'Score: 0',
        score: 0,
        realScore: 0,
    });

    const updateStartButton = () => {
        if (scoreCounter.realScore > 1000) {
            startButton.innerHTML = "Max Reward";
        } else if (scoreCounter.realScore > 650) {
            startButton.innerHTML = "High Reward";
        } else if (scoreCounter.realScore > 300) {
            startButton.innerHTML = "Medium Reward";
        } else if (scoreCounter.realScore > 150) {
            startButton.innerHTML = "Low Reward";
        } else {
            startButton.innerHTML = "No Reward...";
        }
    }

    startButton.addEventListener('click', () => {
        animate();
        canChangeDirection = true;
        startButton.innerHTML = 'No Reward...';
    }, { once : true });


    const updateScore = () => {
        scoreCounter.score++;
        scoreCounter.realScore += (10 + Math.floor(scoreCounter.score / 4) * 5);
        scoreCounter.innerHTML = 'Score: ' + scoreCounter.realScore;
        updateStartButton();
    };

    const snakeRightDiv = createDom('div', {
        class: ['snake-right-div', 'flex-column'],
        children: [scoreCounter, startButton, heartCounter, controlsBox],
    });

    const snakeBottomDiv = createDom('div', {
        class: ['flex-row', 'snake-description'],
        child: [canvas, snakeRightDiv]
    });

    const cancelBox = document.createElement("button");
    cancelBox.classList.add("cancel-event");
    cancelBox.innerText = "Give Up...";
    cancelBox.addEventListener("click", () => {
        if (eventBackdrop != null) {
            eventBackdrop.remove();
            stopSpawnEvents = false;
        }
    });

    eventBackdrop.append(eventDescription, snakeBottomDiv, cancelBox);
    mainBody.append(eventBackdrop);
}

// EVENT OUTCOME (BLACK BAR THAT APPEARS IN THE MIDDLE OF SCREEN)
function eventOutcome(innerText, eventBackdrop, type, amount, amount2) {
    stopSpawnEvents = false;
    let removeClick = createDom('div', { class: ["cover-all"], id: "prevent-clicker" });
    let boxText = createDom('div', { class: ["event-rain-text"], id: "outcome-text" });
    let boxTextDiv = document.createElement("p");
    let outcomeDelay = 500;

    if (type === "weasel") {
        outcomeDelay = 0;
        let weaselCount = amount;
        let innerTextTemp;
        boxText.style.height = "13%";

        if (weaselCount >= 10) {
            innerTextTemp = `\n You received some items!`;
            genericItemLoot();
            newPop(1);
            amount = randomInteger(100,140);
            
            if (eventBackdrop.hardMode) {
                addTreeCore(randomInteger(3, 6), 20);           
            }
        } else if (weaselCount >= 7) {
            innerTextTemp = `\n You received a few items!`;
            genericItemLoot();
            newPop(1);
            amount = randomInteger(60,100);
        } else if (weaselCount >= 4) {
            innerTextTemp = `\n You received a few primogems!`;
            amount = randomInteger(20,60);
        } else {
            innerTextTemp = `\n Catch more to get a reward!`;
            amount = 0;
        }

        if (amount2 > 0) {
            amount2 *= 2;
            innerTextTemp = `\n Some of them were carrying Golden Nuts!`;
        }

        if (weaselCount >= 16) {
            challengeNotification(({category: 'specific', value: [0, 8]}));
            challengeNotification(({category: 'specific', value: [2, 6]}));
        } else if (weaselCount >= 13) {
            challengeNotification(({category: 'specific', value: [0, 8]}));
        }

        if ((amount2 / 2) > 12) {
            challengeNotification(({category: 'specific', value: [4, 7]}));
        }

        innerText += innerTextTemp;
    } else if (type === "snake") {
        let snakeScore = amount;
        if (snakeScore > 1000) {
            if (eventBackdrop.hardMode) addTreeCore(randomInteger(5, 8), 20);    
            innerText += "You received the max reward!!";
            amount = randomInteger(220,300);
        } else if (snakeScore > 650) {
            if (eventBackdrop.hardMode) addTreeCore(randomInteger(4, 7), 15);    
            innerText += "You received a high reward!";
            amount = randomInteger(140,220);
        } else if (snakeScore > 300) {
            if (eventBackdrop.hardMode) addTreeCore(randomInteger(2, 5), 10);    
            innerText += "You received a medium reward!";
            amount = randomInteger(80,140);
        } else if (snakeScore > 150) {
            if (eventBackdrop.hardMode) addTreeCore(randomInteger(1, 3), 5);    
            innerText += "You received a low reward!";
            amount = randomInteger(40,80);
        } else {
            innerText += "You received no reward...";
            amount = 0;
        }

        if (snakeScore >= 2000) {
            challengeNotification(({category: 'specific', value: [3, 5]}));
            challengeNotification(({category: 'specific', value: [4, 6]}));
        } else if (snakeScore >= 1400) {
            challengeNotification(({category: 'specific', value: [3, 5]}));
        }
    } else if (type === "reaction") {
        outcomeDelay = 0;
    }

    boxTextDiv.innerText = innerText;
    boxText.append(boxTextDiv);
    setTimeout(() => {
        removeClick.append(boxText);
        mainBody.appendChild(removeClick);
        setTimeout(() => {
            boxText.classList.add("slide-out-animation");
            setTimeout(() => {
                removeClick.style.pointerEvents = "none";
            },1500)

            boxText.addEventListener("animationend",() => {
                if (type === "primogem") {
                    currencyPopUp([["primogem",amount]]);
                } else if (type === "weasel") {
                    if (amount == 0 && amount2 == 0) {
                        void(0);
                    } else if (amount == 0 && amount2 > 0) {
                        currencyPopUp([["nuts",amount2]]);
                    } else if (amount < 60 && amount2 > 0) {
                        currencyPopUp([["primogem",amount],["nuts",amount2]]);
                    }  else if (amount < 100 && amount2 > 0) {
                        currencyPopUp([["items",0],["nuts",amount2]]);
                    }  else if (amount < 140 && amount2 > 0) {
                        currencyPopUp([["items",0],["nuts",amount2]]);
                    } else if (amount < 60) {
                        currencyPopUp([["primogem",amount]]);
                    }  else if (amount < 100) {
                        currencyPopUp([["primogem",amount],["items",0]]);
                    }  else if (amount < 140) {
                        currencyPopUp([["primogem",amount],["items",0]]);
                    } 
                } else if (type === "box") {
                    if (amount < 40 && amount > 0) {
                        currencyPopUp([["nuts",amount]]);
                    } else if (amount >= 40 && amount <= 60) {
                        currencyPopUp([["primogem",amount]]);
                    } else if (amount > 60 && amount <= 100) {
                        saveValues.energy = Math.floor(saveValues.energy * amount / 100);
                    } else if (amount > 100) {
                        itemUse(amount.toString())
                    }
                } else if (type === "reaction") {
                    if (amount != 0) {
                        currencyPopUp([["items",0],["primogem",amount]]);
                    }
                } else if (type === "simon") {
                    if (amount != 0) {
                        currencyPopUp([["primogem",amount],["items",0]]);
                        genericItemLoot();
                        newPop(1);
                        sortList("table2");
                    }
                } else if (type === "battleship") {
                    if (amount != 0) {
                        currencyPopUp([["items",0]]);
                        genericItemLoot();
                        genericItemLoot();
                        genericItemLoot();
                        newPop(1);
                        sortList("table2");
                    }
                } else if (type === "snake") {
                    if (amount < 80 && amount > 0) {
                        currencyPopUp([["primogem",amount]]);
                    }  else if (amount < 140) {
                        currencyPopUp([["primogem",amount],["items",0]]);
                        genericItemLoot();
                        newPop(1);
                        sortList("table2");
                    }  else if (amount < 220) {
                        currencyPopUp([["primogem",amount],["items",0]]);
                        genericItemLoot();
                        newPop(1);
                        sortList("table2");
                    } else if (amount < 305) {
                        currencyPopUp([["primogem",amount],["items",0]]);
                        genericItemLoot();
                        genericItemLoot();
                        newPop(1);
                        sortList("table2");
                    }
                }
                removeClick.remove();
            });
        },3000)
    },outcomeDelay);

    setTimeout(()=> {
        if (eventBackdrop != null) {
            eventBackdrop.remove();
        }
    },4000)
}

//--------------------------------------------------------------------------MAIN BODY----------------------------------------------------------------------//
function loadingAnimation() {
    // CAUSES MOBILE USERS TO ZOOM IN (NOT NEEDED ANYMORE)
    // var siteWidth = 1080;
    // var scale = screen.width / (siteWidth);
    // document.querySelector('meta[name="viewport"]').setAttribute('content', 'width='+siteWidth+', initial-scale='+scale/1.85+', user-scalable=no');

    let loadingNumber = document.getElementById('loading-number');
    let value = parseInt(loadingNumber.loadingValue);
    let preloadArray = drawUI.preloadMinimumArray(upgradeInfo);
    preloadStart.fetch(preloadArray).then(() => {
        setTimeout(() => {
            removeLoading(loadingNumber);
        }, 2000);
    });

    preloadStart.onprogress = event => {
        if (value != event.progress) {
            value = event.progress;
            loadingNumber.innerText = `${value}%`;
        }
    }

    preloadStart.onerror = item => {
        console.error(`Error preloading '${item.url}'`);
    }
}

function removeLoading(loadingNumber) {
    let screenTipsDiv = document.getElementById("screen-tips");
    screenTipsDiv.innerText = screenLoreDict[0];
    let screenTipsInterval = setInterval(()=>{
        screenTips();
    },30000);
    setTimeout(() => {
        let overlay = document.getElementById("loading");
        let idleAmount = 0;

        overlay.removeChild(overlay.firstElementChild);
        overlay.classList.remove("overlay");
        loadingNumber.remove();
        if (persistentValues.upgrade[6] > 0) {
            idleAmount = idleCheck(idleAmount);
        }

        tutorial(idleAmount);
        if (testing && document.getElementById('play-button')) document.getElementById('play-button').click(); 
        if (CONSTANTS.DBNUBMER - saveValues.versNumber > 0) {
            let string = saveValues.versNumber.toString().split("").reverse().join("");
            string = string.slice(0, 3) + '-' + string.slice(3);
            string = string.slice(0, 6) + '-' + string.slice(6);
            string = string.split("").reverse().join("");

            sidePop('/icon/patchIco.webp', `Update: V.${string} -> ${CONSTANTS.VERSIONNUMBER}`, 10000, true);
            if (CONSTANTS.DBNUBMER - saveValues.versNumber >= 900) {
                document.getElementById('setting-button').click()
                document.getElementById('patch-notes-button').click();
                document.querySelector('#patch-container > div').click();
            }
        }
    }, 200);
}

// SETUP AUDIO API
let currentSong = randomInteger(1,6);
let nextSong = "";
function playAudio() {
    bgmElement.src = "./assets/sfx/bgm"+currentSong+".mp3";
    bgmElement.id = "bgm";
    bgmElement.volume = settingsValues.bgmVolume;
    bgmElement.load();
    bgmElement.addEventListener('ended', () => {
        if (currentSong === 5) {
            currentSong = 1;
        } else {
            currentSong++;
        }
        nextSong = "./assets/sfx/bgm" + currentSong + ".mp3";
        bgmElement.src = nextSong;
        bgmElement.load();
    });

    bgmElement.addEventListener('canplaythrough', () => {
        bgmElement.play();
    });

    for (let i=0,len=sfxArray.length; i < len; i++) {
        sfxArray[i].volume = settingsValues.sfxVolume;
    }
    return bgmElement;
}

// TUTORIAL UPON FIRST LOAD
function tutorial(idleAmount) {
    let overlay = document.getElementById("loading");
    setTimeout(() => {recentlyLoaded = false}, 10000)
    if (firstGame === true) {
        drawUI.customTutorial("tut", 5, 'Introduction', () => { 
            clearInterval(timerLoad);
            timer = setInterval(timerEvents,timeRatio);
            currentBGM = playAudio();
            settingsVolume(); 
        });
    } else if (firstGame === false) {
        let tutorialDark = document.createElement("div");
        tutorialDark.classList.add("cover-all","flex-column","tutorial-dark");

        if (idleAmount != 0) {
            let tutorialIdle = document.createElement("div");
            tutorialIdle.classList.add("flex-row","idle-dark");
            tutorialIdle.id = "idle-nuts-div";
            let idleAmountText = document.createElement("p");
            idleAmountText.innerText = `+${abbrNum(idleAmount)}`;
            let idleNuts = document.createElement("img");
            idleNuts.src = "./assets/icon/nut.webp";
            idleNuts.classList.add("icon","primogem");

            tutorialIdle.append(idleAmountText,idleNuts);
            tutorialDark.append(tutorialIdle);
        }

        let playButton = document.createElement("img");
        playButton.src = "./assets/tutorial/play-button.webp";
        playButton.id = 'play-button';
        playButton.classList.add("play-button");
        playButton.addEventListener("click",() => {
            overlay.style.display = 'none';

            clearInterval(timerLoad);
            timer = setInterval(timerEvents,timeRatio);
            currentBGM = playAudio();
            settingsVolume();

            setTimeout(() => {
                if (document.getElementById('idle-nuts-div')) {document.getElementById('idle-nuts-div').remove()}
                saveValues.realScore += idleAmount;

                // FOR GOLDEN CORE CHALLENGE
                if (persistentValues.transitionCore !== undefined) {
                    if (persistentValues.transitionCore !== null && 
                            persistentValues.tutorialAscend === false && 
                            persistentValues.goldenCore > 1000) {
                        drawUI.customTutorial('ascendTut', 13, 'Leyline Outbreak!');
                        persistentValues.tutorialAscend = true;
                        createChallenge();
                        createAscend();
                        createTreeMenu();
                    }

                    challengeNotification(({category: 'core', value: persistentValues.transitionCore}));
                    delete persistentValues.transitionCore;
                } else if (parseInt(saveValues.versNumber) < 200003 && persistentValues.tutorialAscend === true) {
                    drawUI.customTutorial('ascendTut', 13, 'Leyline Outbreak');
                }
            }, 250);
        });

        tutorialDark.appendChild(playButton);
        overlay.append(tutorialDark);
    }
}

function saveData(skip = false, saveSlot = 0, customArray = []) {
    if (preventSave) {return};
    const currentTime = getTime();
    saveTimeMin = currentTime + settingsValues.saveTime;

    saveValues.currentTime = currentTime;
    saveValues.versNumber = CONSTANTS.DBNUBMER;
    persistentValues.timeSpentValue += currentTime - persistentValues.lastRecordedTime;
    persistentValues.lastRecordedTime = getTime();

    if (!document.getElementById("currently-saving") && skip != true) {
        let saveCurrently = document.createElement("img");
        saveCurrently.src = "./assets/settings/saving.webp";
        saveCurrently.id = "currently-saving";
        saveCurrently.addEventListener("animationend", ()=> {
            saveCurrently.remove();
        });
        mainBody.append(saveCurrently);
    }

    const localStorageDict = {
        "settingsTemp":settingsValues,
        "saveValuesTemp":saveValues,
        "upgradeDictTemp":upgradeDict,
        "InventoryTemp": Array.from(InventoryMap),
        "expeditionDictTemp":expeditionDict,
        "advDictTemp":advDict,
        "achievementListTemp": Array.from(achievementMap),
        "persistentValues":persistentValues,
        "localStoreTemp":storeInventory,
        "tester":testing,
    }

    customArray.forEach((item) => {
        localStorageDict[item[0]] = item[1];
    });

    localStorage.setItem(`save-${saveSlot}`, window.btoa(JSON.stringify(localStorageDict)));
}

//------------------------------------------------------------------------ON-BAR BUTTONS------------------------------------------------------------------------//
// TAB UI
function createTabs() {
    let tabFlex = document.getElementById("flex-container-TAB");
    for (let i=0, len = (TABS.length - 1); i < len; i++){
        let tabButton = document.createElement("div");
        tabButton.classList += " tab-button-div";

        let tabButtonImage = document.createElement("img");
        tabButtonImage.src = "./assets/icon/tab"+ (i + 1) +".webp";
        tabButtonImage.classList += " tab-button";

        tabButton.id = "tab-" + (i);
        tabButton.addEventListener('click', () =>{
            tabChange(i + 1);
        })
        tabButton.appendChild(tabButtonImage);
        tabFlex.appendChild(tabButton);
    }

    if (storeInventory.active == true) {
        Shop.addShop(tabChange);
    }
}

// CHANGE TABS
function tabChange(x) {
    if (adventureScene) {return}
    if (timerSeconds !== 0) {
        tabElement.load();
        tabElement.play();
    }

    let i = 7;
    let tabButton;
    while (i--) {
        if (document.getElementById("tab-" + (i))) {
            tabButton = document.getElementById("tab-" + (i));
            if (!tabButton.firstChild.classList.contains("darken")) { tabButton.firstChild.classList.add("darken");}
            if (i === x - 1) {
                if (tabButton.firstChild.classList.contains("darken")) {
                    tabButton.firstChild.classList.remove("darken");
                }
            }
        } else {
            continue;
        }
    }
    
    for (let i = 0, len = TABS.length; i < len; i++){
        if (TABS[i].style.display !== "none") {
            TABS[i].style.display = "none";
        }
    }

    if (heroTooltip !== -1) {
        if (upgradeDict[heroTooltip] != undefined) {
            heroTooltip = upgradeDict[heroTooltip].Row;
            let removeActiveHero = document.getElementById(`but-${heroTooltip}`);
            if (removeActiveHero.classList.contains("active-hero")) {
                removeActiveHero.classList.remove("active-hero");
            }
        } else if (document.getElementById(`milestone-${heroTooltip}`)) {
            let oldMilestoneButton = document.getElementById(`milestone-${heroTooltip}`);
            if (oldMilestoneButton.classList.contains("milestone-selected")) {
                oldMilestoneButton.classList.remove("milestone-selected");
            }
        }
    } else if (heroTooltip !== -2) {
        if (document.getElementById(itemTooltip)) { 
            let buttonInv = document.getElementById(itemTooltip);
            if (buttonInv.classList.contains("inventory-selected")) {
                buttonInv.classList.remove("inventory-selected");
            }
        }
        itemTooltip = -1;
    }

    clearTooltip();
    x--;
    TABS[x].style.display = "flex";
    filterDiv.style.display = "none";
    table6.style.display = "none";

    let filterMenuOne = document.getElementById("filter-menu-one");
    if (filterMenuOne.style.display !== "none") {filterMenuOne.style.display = "none"};
    let filterMenuTwo = document.getElementById("filter-menu-two");
    if (filterMenuTwo.style.display !== "none") {filterMenuTwo.style.display = "none"};
    if (document.getElementById('upgrade-menu-button')) {
        document.getElementById('upgrade-menu-button').style.display = "none";
        universalStyleCheck(document.getElementById('upgrade-selection'), 'display', 'flex', 'none', true);
    }

    if (document.getElementById("nut-store-table")) {
        let nutStoreTemp = document.getElementById("nut-store-table");
        if (nutStoreTemp.style.display === "flex") {nutStoreTemp.style.display = "none"}
    }

    if (document.getElementById('tree-table')) {
        let treeTable = document.getElementById("tree-table");
        if (treeTable.style.display === "flex") {treeTable.style.display = "none";}
        let treeSide = document.getElementById("tree-side");
        if (treeSide.style.display === "flex") {treeSide.style.display = "none";}
    }
    
    if (x == 0) {
        if (filterDiv.style.display !== "flex") {filterDiv.style.display = "flex"};
        if (table6.style.display !== "flex") {table6.style.display = "flex"};

        milestoneToggle("close");
        tooltipTable = 1;
        updateFilter(filteredHeroes);
        if (document.getElementById("tool-tip-button")) {
            let tooltipButtonText = document.getElementById("tool-tip-button");
            tooltipButtonText.innerText = currentMultiplier === 1 ? 'Purchase' : `Purchase ${currentMultiplier}`;
        }
        if (document.getElementById('upgrade-menu-button')) {
            document.getElementById('upgrade-menu-button').style.display = "block";
        }
    } else if (x == 1) {
        universalStyleCheck(filterDiv, 'display', 'none', 'flex', true);
        universalStyleCheck(table6, 'display', 'none', 'flex', true);

        tooltipTable = 2;
        updateFilter(filteredInv);
        if (document.getElementById("tool-tip-button")) {
            let tooltipButtonText = document.getElementById("tool-tip-button");
            tooltipButtonText.innerText = "Use";
        }
    } else if (x == 5) {
        Shop.changeStoreDialog(persistentValues.tutorialAscend ? 'ascendWelcome' : 'normWelcome')
    }

    if (x != 3 && wishCounter != saveValues["wishCounterSaved"]) {
        let mailImageTemp = document.getElementById("mailImageID")
        mailImageTemp.style.opacity = 1;
    }
    updateWishDisplay();

    universalStyleCheck(document.getElementById('hero-breakdown'), 'display', 'flex', 'none', true);
    if (document.getElementById("adventure-map")) {
        if (x == 2) {
            document.getElementById("adventure-map").style.zIndex = 11;
        } else {
            document.getElementById("adventure-map").style.zIndex = -1;
        }
    }
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        toggleSettings();
        if (document.getElementById("confirm-box")) {
            let deleteBox = document.getElementById("confirm-box");
            if (deleteBox.style.display !== 'none') {deleteBox.style.display = 'none'};
        }
    }

    if (!stopSpawnEvents && !settingsOpen) {
        if (event.key === "1") {
            tabChange(1);
        } else if (event.key === "2") {
            tabChange(2);
        } else if (event.key === "3") {
            tabChange(3);
        } else if (event.key === "4") {
            tabChange(4);
        } else if (event.key === "5") {
            tabChange(5);
        } else if (event.key === "6") {
            if (table7.innerHTML != "") {
                tabChange(6);
            }
        } else if (event.key === "Enter") {
            event.preventDefault();
            // if (event.repeat) { return }
            if (table4.style.display === "flex") {
                let wishButton = document.getElementById("wishButton");
                if (!wishButton.locked) {
                    wish();
                    updateWishDisplay();
                }
            } else {
                tooltipFunction();
            }
        }
    };
    
})

// SETTINGS MENU - SAVES & VOLUME CONTROL
function settings() {
    settingsBox("create");
    // JUST THE BUTTON FOR SETTING MENU
    const settingButton = Settings.settingButton();

    // RELATED TO SETTINGS MENU
    const settingsNameObject = {'General': 'block', 'Advanced': 'block', 'Saves': 'flex', 'Console': 'flex'};
    const settingsTabArray = [];
    const settingsButtonArray = [];
    const settingsHeader = createDom('div', {
        classList: ['flex-row', 'settings-header']
    })

    const settingsMenu = createDom('div', {
        class:["flex-column","settings-menu"],
        id: 'settings-menu',
        child: [settingsHeader],
        style: {
            display: 'none',
        }
    });

    for (const [tabKey, styleValue] of Object.entries(settingsNameObject)) {
        const tabMenu = createDom('div', {
            class:['settings-tab', 'green-scrollbar', (styleValue === 'flex' ? 'flex-column' : null), (styleValue === 'flex' ? 'settings-tab-box' : null)],
            id: `settings-tab-${tabKey.toLowerCase()}`,
            defaultStyle: styleValue,
            style: {
                display: tabKey === 'General' ? 'block' : 'none'
            }
        });

        const tabButton = createDom('button', {
            class:["settings-tab-button", (tabKey === 'General' ? null : 'inactive-tab')],
            id: `settings-button-${tabKey.toLowerCase()}`,
            innerText: tabKey,
        });

        tabButton.addEventListener('click', () => {
            settingsTabArray.forEach((tab) => { tab.style.display = 'none' });
            settingsButtonArray.forEach((item) => { item.classList.add('inactive-tab')});
            if (tabButton.classList.contains('inactive-tab')) { tabButton.classList.remove('inactive-tab')}
            if (tabKey === 'Advanced') {
                const advancedStats = document.getElementById('settings-stats');
                advancedStats.generateStats(persistentValues);
            }

            tabMenu.style.display = styleValue;
        })

        settingsButtonArray.push(tabButton)
        settingsTabArray.push(tabMenu);
        settingsHeader.append(tabButton);
        settingsMenu.append(tabMenu);
    }

    mainBody.appendChild(settingsMenu);

    generalSettings(settingsMenu);
    advancedSettings();

    settingButton.addEventListener("click", () => {
        toggleSettings();
        if (settingButton.classList.contains('settings-button-img-glow')) {
            settingButton.classList.remove('settings-button-img-glow')
        }
    })
    multiplierButtonContainer.prepend(settingButton);
}

function generalSettings(settingsMenu) {
    let generalSettingsMenu = document.getElementById('settings-tab-general');
    // TOP OF GENERAL
    const volumeScrollerContainer = Settings.volumeScrollerCreate(settingsValues);
    
    // MIDDLE OF GENERAL
    let settingsMiddle = document.createElement("div");
    settingsMiddle.classList.add("flex-row","settings-bottom");

    let settingsMiddleRight = document.createElement("div");
    settingsMiddleRight.classList.add("settings-bottom-right");

    let infoSetting = document.createElement("button");
    infoSetting.classList.add("setting-info");
    infoSetting.addEventListener("click", () => {
        if (document.fullscreenEnabled) {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    });

    let saveSetting = document.createElement("button");
    saveSetting.classList.add("setting-save");
    saveSetting.addEventListener("click",() => {saveData()})

    let clearSetting = document.createElement("button");
    clearSetting.classList.add("setting-clear");
    clearSetting.addEventListener("click",() => {choiceBox(mainBody, {text: 'Are you sure? This will delete ALL of your saves.  <br> It cannot be undone!!'}, null, 
                                                () => {clearLocalStorage()}, undefined, null, ['choice-ele']);
    });

    const cancelButton = document.createElement("button");
    cancelButton.classList.add("cancel-button");
    cancelButton.addEventListener("click",() => {
        settingsMenu.style.display = 'none';
        settingsOpen = false;
    })

    const patchNotesDiv = document.getElementById('patch-container');
    patchNotesDiv.style.display = 'none';

    const patchBack = createDom('button', {
        innerText: 'Back',
        event: ['click', () => {patchNotesDiv.style.display = patchNotesDiv.style.display === 'none' ? 'flex' : 'none'}]
    });

    patchNotesDiv.prepend(patchBack);
    generalSettingsMenu.append(patchNotesDiv);

    const patchNotesButton = createDom("button", {
        classList: ["patch-button", 'clickable', "flex-row"],
        id: 'patch-notes-button',
        event: ["click", () => {
            patchNotesDiv.style.display = patchNotesDiv.style.display === 'none' ? 'flex' : 'none';
        }],
        child: [
            createDom('img', {
                src: './assets/icon/patch.webp'
            }), 
            createDom('p', {
                innerText: 'Patch Notes',
            })
        ]
    });

    settingsMiddleRight.append(infoSetting, saveSetting, clearSetting);
    settingsMiddle.append(patchNotesButton, settingsMiddleRight);

    // BOTTOM OF GENERAL
    const settingsBottom = createDom('div', {
        class: ["flex-row", "settings-bottom"],
    });

    const settingsBottomBadge = createDom('div', {
        class: ['settings-badges', 'green-scrollbar'],
        id: 'badges-div'
    });

    if (saveValues.goldenTutorial) { settingsBottomBadge.append(createMedal(1, choiceBox, mainBody, stopSpawnEvents))}
    if (persistentValues.finaleBossDefeat) { settingsBottomBadge.append(createMedal(2, choiceBox, mainBody, stopSpawnEvents))}
    if (persistentValues.allChallenges) { settingsBottomBadge.append(createMedal(3, choiceBox, mainBody, stopSpawnEvents))}

    const settingsBottomButtons = Settings.settingsBottomLinks();
    const gameText = document.getElementById('vers-number');
    gameText.innerText += ("\n" + document.getElementById('copyright-number').innerText);
    document.getElementById('copyright-number').remove();

    const creatorDiv = createDom('div', {
        classList: ['creator-div', 'flex-row', 'clickable'],
        child: [
            createDom('img', { src: './assets/title/creator.webp'}),
            createDom('p', { innerText: 'Contact \n the dev!'})
        ],
        event: ['click', () => {
            window.open("https://github.com/sen-trie/nahidaQuest", "_blank");
        }]
    })

    const settingsCredits = createDom('div', {
        class: ['flex-column', 'settings-bottom'],
        child: [gameText, creatorDiv]
    });

    settingsBottom.append(settingsBottomBadge, settingsBottomButtons);
    generalSettingsMenu.append(volumeScrollerContainer, settingsMiddle, settingsBottom, settingsCredits);
    settingsMenu.append(cancelButton);
}

function advancedSettings() {
    // ADVANCED SETTINGS
    const advSettingsDict = [
        {id: 'nahida-preference',  default: 'preferOldPic', text: "Prefer Old 'Big Nahida'"},
        {id: 'falling-preference',  default: 'showFallingNuts', text: "No Falling Nuts on Click"},
        {id: 'clicking-preference',  default: 'combineFloatText', text: "Combine Click Counts"},
        {id: 'wish-preference',  default: 'showWishAnimation', text: "No Wish Animation"},
        {id: 'auto-preference',  default: 'autoClickBig', text: "Hold to Click 'Big Nahida'"},
        {id: 'wide-combat-preference',  default: 'wideCombatScreen', text: "Wide Battle Screen"},
        {id: 'left-hand-mode',  default: 'leftHandMode', text: "Left Handed Mode"},
        {id: 'fullscreen-on',  default: 'fullscreenOn', text: "Auto Fullscreen on Launch"},
        {id: 'font-size-level',  default: 'fontSizeLevel', text: "Font Size (1-10)"},
        {id: 'save-time',  default: 'saveTime', text: "Save Interval (min)"},
        {id: 'reset-level',  default: 'resetLevel', text: "Reset Adv. Settings"},
    ]; 

    let advancedSettingsMenu = document.getElementById('settings-tab-advanced');
    let advancedSettingsGrid = createDom('div', { class: ['advanced-grid']});

    advSettingsDict.forEach(advItem => {
        const preferLabel = document.createElement('label');
        preferLabel.classList.add('switch', 'flex-row');
        preferLabel.setAttribute('for', advItem.id);

        const preferText = document.createElement('p');
        preferText.innerText = advItem.text;

        const prefer = document.createElement('input');
        if (advItem.id === 'reset-level') {
            const addButton = createDom('button', { classList:['flex-row', 'adv-reset'], innerText: 'Reset'});
            addButton.addEventListener('click', () => {
                advSettingsDict.forEach(key => {
                    const keyInput = document.getElementById(key.id);
                    if (key.id === 'font-size-level') {
                        keyInput.value = SettingsDefault[key.default];
                        keyInput.dispatchEvent(new Event('change'));
                    } else if (key.id !== 'reset-level') {
                        keyInput.checked = SettingsDefault[key.default];
                        keyInput.dispatchEvent(new Event('change'));
                    }
                });
                saveData(true);
            });
            preferLabel.append(preferText, addButton);
        } else if (advItem.id === 'font-size-level') {
            prefer.classList.add('font-setting-input', 'flex-row');
            prefer.changeValue = (newValue) => {
                if (isNaN(newValue)) {
                    prefer.value = 5;
                    } else {
                        newValue = Math.min(Math.max(newValue, 1), 10);
                        prefer.value = Math.round(newValue * 10) / 10;
                }

                settingsValues.fontSizeLevel = Number(newValue);
                CONSTANTS.CHANGEFONTSIZE(Number(newValue));
            }
                
            prefer.addEventListener('change', () => {prefer.changeValue()});
            prefer.value = settingsValues[advItem.default];
            prefer.type = 'text';
            prefer.id = advItem.id;

            const addButton = createDom('button', { classList:['flex-row', 'font-add'], innerText: '+'});
            const minusButton = createDom('button', { classList:['flex-row', 'font-add'], innerText: '-'});
            addButton.addEventListener('click', () => {prefer.changeValue(Number(prefer.value) + 1)});
            minusButton.addEventListener('click', () => {prefer.changeValue(Number(prefer.value) - 1)});

            preferLabel.append(preferText, addButton, prefer, minusButton);
        } else if (advItem.id === 'save-time') {
            prefer.classList.add('font-setting-input', 'flex-row');
            prefer.changeValue = (newValue) => {
                if (isNaN(newValue)) {
                    prefer.value = 3;
                } else {
                    newValue = Math.min(Math.max(newValue, 1), 10);
                    prefer.value = Math.round(newValue * 10) / 10;
                }
                settingsValues.saveTime = Number(newValue);
            }

            prefer.addEventListener('change', () => {prefer.changeValue()});
            prefer.value = settingsValues[advItem.default];
            prefer.type = 'text';
            prefer.id = advItem.id;

            const addButton = createDom('button', { classList:['flex-row', 'font-add'], innerText: '+'});
            const minusButton = createDom('button', { classList:['flex-row', 'font-add'], innerText: '-'});
            addButton.addEventListener('click', () => {prefer.changeValue(Number(prefer.value) + 1)});
            minusButton.addEventListener('click', () => {prefer.changeValue(Number(prefer.value) - 1)});

            preferLabel.append(preferText, addButton, prefer, minusButton);
        } else {
            const checkSpan = document.createElement('span');
            checkSpan.classList.add('slider');

            prefer.checked = settingsValues[advItem.default];
            prefer.type = 'checkbox';
            prefer.id = advItem.id;

            preferLabel.append(preferText, prefer, checkSpan);
        }

        switch (advItem.id) {
            case 'nahida-preference':
                prefer.addEventListener('change', () => {
                    settingsValues.preferOldPic = prefer.checked;
                    let demoImg = document.getElementById('demo-main-img');
                    demoImg.skin = prefer.checked ? 'Old' : 'New';
                    persistentValues.nahidaSkin = demoImg.skin;

                    if (demoImg.src != "./assets/event/scara.webp") {
                        demoImg.revertPicture();
                    }
                });
                break;
            case 'wide-combat-preference':
                prefer.addEventListener('change', () => {
                    const adventureVideo = document.getElementById('adventure-video');
                    if (adventureVideo) {
                        adventureVideo.style.width = prefer.checked ? '95%' : '60%';
                    }
                    settingsValues.wideCombatScreen = prefer.checked;
                });
                break;
            case 'left-hand-mode':
                prefer.addEventListener('change', () => {
                    const leftHandCSS = document.getElementById('toggle-css');
                    if (prefer.checked) {
                        leftHandCSS.disabled = undefined;
                    } else {
                        leftHandCSS.disabled = 'disabled';
                    }
                    settingsValues.leftHandMode = prefer.checked;
                });
                break;
            case 'font-size-level':
                prefer.addEventListener('change', () => {
                    prefer.changeValue(prefer.value);
                })
                break;
            case 'reset-level':
                break;
            default:
                prefer.addEventListener('change', () => {
                    settingsValues[advItem.default] = prefer.checked;
                });
                break;
        }

        setTimeout(() => {
            advancedSettingsGrid.append(preferLabel);
        }, 1000)
    });

    const advancedStats = Settings.advancedStats();
    advancedSettingsMenu.append(advancedSettingsGrid, advancedStats);
}

let settingsOpen = false;
function toggleSettings(closeOnly) {
    let settingsMenu = document.getElementById("settings-menu");
    if (settingsOpen == true) {
        settingsMenu.style.display = 'none';
        settingsOpen = false;
    } else {
        if (closeOnly !== true) {
            settingsMenu.style.display = 'flex';
            settingsOpen = true;
        }
    }
}

function settingsVolume() {
    let volumeScroller = document.getElementById('volume-scroller-bgm');
    volumeScroller.addEventListener("input", function() {
        bgmElement.volume = this.value / 100;
        fightBgmElement.volume = this.value / 100;
        settingsValues.bgmVolume = this.value / 100;
    });

    let sfxScroller = document.getElementById('volume-scroller-sfx');
    sfxScroller.addEventListener("input", function() {
        for (let i=0,len=sfxArray.length; i < len; i++) {
            sfxArray[i].volume = this.value / 100;
            settingsValues.sfxVolume = this.value / 100;
        }
    });
}

function settingsBox() {
    // PATCH NOTES
    const patchDiv = document.createElement("div");
    patchDiv.classList.add("text-box","patch-notes-div","flex-column");
    patchDiv.id = "patch-box";
    patchDiv.style.display = 'none';

    drawUI.patchNotes(patchDiv);

    const patchCmdButton = document.createElement("button");
    patchCmdButton.addEventListener("click",() => {
        patchDiv.style.display = 'none';
    })

    patchDiv.append(patchCmdButton);
    mainBody.appendChild(patchDiv);

    setTimeout(() => {
        const saveSettingsMenu = document.getElementById('settings-tab-saves');
        const settingsHeader = createDom('div', { class: ['flex-row', 'settings-inner-tab', 'settings-header']});
        const exportHeaderButton = createDom('button', { 
            class: ['settings-header-button', 'settings-tab-button', 'inactive-tab'],
            innerText: 'Export'
        });

        const importHeaderButton = createDom('button', { 
            class: ['settings-header-button', 'settings-tab-button'],
            innerText: 'Import'
        });

        const exportBox = createDom('div', {
            class: ['export-box'],
            child: [Settings.buildSaves(localStorage)],
            style: {
                display: 'none'
            }
        });

        const uploadSave = (uploadButton, i) => {
            uploadButton.progressText();
            saveData(true, i);
            setTimeout(() => {
                uploadButton.updateText();
                uploadButton.updateDiv();
            }, 500);
        }

        setTimeout(() => {
            for (let i = 0; i < 6; i++) {
                const uploadButton = document.getElementById(`settings-upload-${i}`);
                uploadButton.addEventListener('click', () => {
                    if (uploadButton.checkSaved()) {
                        choiceBox(mainBody, {text: 'Do you want to overwrite this save? <br> This action cannot be undone.'}, stopSpawnEvents, 
                                  () => { uploadSave(uploadButton, i) }, undefined, null, ['choice-ele']
                        );   
                    } else {
                        uploadSave(uploadButton, i);
                    }
                });
            };
        }, 100);

        const importBox = createDom('div', {
            class: ['settings-box'],
            style: {
                display: 'block'
            }
        });

        const importBoxText = createDom('textarea', {
            class: ['settings-textarea', 'green-scrollbar'],
            placeholder: "Paste save data here.",
        });

        const importBoxButton = createDom('button', {
            class: ['settings-inner-button'],
            innerText: 'Import Save'
        });

        const importFileButton = createDom('input', {
            class: ['settings-inner-button', 'import-file'],
            innerText: 'Upload File',
            type: 'file',
            accept: '.txt'
        });

        importFileButton.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file && file.type === "text/plain") {
                const reader = new FileReader();
                reader.onload = function(event) {
                    try {
                        const fileContent = event.target.result;
                        importBoxText.value = fileContent;
                    } catch {
                        importBoxText.value = 'Invalid save data loaded.';
                    }
                };
    
                reader.readAsText(file);
            } else {
                importBoxText.value = 'Invalid save data loaded.';
            }
        });

        importBoxButton.addEventListener("click", () => {
            let promptSave = importBoxText.value;
            if (promptSave != null) {
                let localStorageTemp = tryParseJSONObject(window.atob(promptSave));
                preventSave = true;
                if (localStorageTemp === false) {
                    alert("Invalid save data.")
                    console.error("Invalid save data.");
                } else {
                    let clearPromise = new Promise(function(myResolve, myReject) {
                        localStorage.removeItem('save-0');
                        if (localStorage.getItem('save-0') == null) {
                            myResolve(); 
                        } else {
                            myReject();
                        }
                    });
                    
                    clearPromise.then(
                        function(value) {
                            localStorage.setItem('save-0', (promptSave));
                            location.reload();
                        },
                        function(err) {console.error("Error clearing local data")}
                    ); 
                }
                preventSave = false;
            }
        });
        
        importBox.append(importBoxText, importBoxButton, importFileButton);
        
        exportHeaderButton.addEventListener('click', () => {
            if (exportHeaderButton.classList.contains('inactive-tab')) {
                exportHeaderButton.classList.remove('inactive-tab');
                importHeaderButton.classList.add('inactive-tab')
            }
            importBox.style.display = 'none';
            exportBox.style.display = 'block';
            document.getElementById(`settings-upload-0`).updateText();
        });

        importHeaderButton.addEventListener('click', () => {
            if (importHeaderButton.classList.contains('inactive-tab')) {
                importHeaderButton.classList.remove('inactive-tab');
                exportHeaderButton.classList.add('inactive-tab')
            }

            importBox.style.display = 'block';
            exportBox.style.display = 'none';
        });

        settingsHeader.append(importHeaderButton, exportHeaderButton);
        saveSettingsMenu.append(settingsHeader, exportBox, importBox);

        /////////////////// CONSOLE TAB ////////////////////////////////////////
        const consoleSettingsMenu = document.getElementById('settings-tab-console');
        const consoleHeader = createDom('div', { class: ['flex-row', 'settings-inner-tab', 'settings-header']});
        const errorHeaderButton = createDom('button', { 
            class: ['settings-header-button', 'settings-tab-button'],
            innerText: 'Error Log'
        });

        const consoleHeaderButton = createDom('button', { 
            class: ['settings-header-button', 'settings-tab-button','inactive-tab'],
            innerText: 'Commands'
        });

        const errorBox = createDom('div', {
            class: ['settings-box'],
            style: {
                display: 'block'
            }
        });

        const errorBoxText = createDom('textarea', {
            class: ['settings-textarea'],
            value: `Any errors logged will appear below the line! Please report such errors through 'Report a Bug' at the bottom right. Thank you! :) 
                    \n---------------------------------\n`,
            readOnly: true,
        })

        const errorBoxButton = createDom('button', {
            class: ['settings-inner-button'],
            innerText: 'Report a Bug!',
            event: ['click', () => {window.open('https://nahidaquest.com/feedback',"_blank")}]
        })

        window.onerror = (message, source, lineno, colno, error) => {
            errorBoxText.value += `${error}\nLine:${lineno}, Column:${colno}\n\n`;
            errorMesg(error);
            return false;
        };

        errorBox.append(errorBoxText, errorBoxButton);

        const consoleBox = createDom('div', {
            class: ['settings-box'],
            style: {
                display: 'none'
            }
        });

        const consoleBoxText = createDom('textarea', {
            class: ['settings-textarea'],
            placeholder: "Type your command here!",
            style: {
                fontSize: '1rem'
            }
        });

        const consoleBoxButton = createDom('button', {
            class: ['settings-inner-button'],
            innerText: 'Execute Command'
        });

        consoleBoxButton.addEventListener("click",() => {
            let commandText = consoleBoxText.value.toLowerCase();
            consoleBoxText.value = '';
            if (commandText === "transcend") {
                nutPopUp();
                toggleSettings(true);
            } else if (commandText === "ascend skip") {
                persistentValues.tutorialAscend = true;
                saveData(true);
                location.reload();
            } else if (commandText === "tester on") {
                saveData(true, 0, [['tester', true]]);
                location.reload();
            } else if (commandText === "tester off") {
                saveData(true, 0, [['tester', false]]);
                location.reload();
            } else if (commandText === "beta on") {
                saveData(true, 0, [['beta', true]]);
                location.reload();
            } else if (commandText === "beta off") {
                saveData(true, 0, [['beta', false]]);
                location.reload();
            } else if (commandText === "dropbox") {
                genericItemLoot();
                genericItemLoot();
                genericItemLoot();
                genericItemLoot();
                genericItemLoot();
            } else if (commandText === "all the seeds") {
                addTreeCore(10);
            } else if (commandText === "all the mail") {
                saveValues["mailCore"] += 30;
            } else if (commandText === "all the riches") {
                currencyPopUp([["primogem", randomInteger(19999, 29999)]]);
            } else if (commandText === "all the energy") {
                saveValues.energy += randomInteger(9999, 19999);
            } else if (commandText === "max level") {
                document.getElementById('tab-2').click();
                gainXP(99999);
            } else if (commandText.startsWith("spawn boss") && !isNaN(commandText.slice(-1))) {
                let bossNumber = Math.round(commandText.slice(-1));
                if (bossNumber > 0 && bossNumber < 5) {
                    document.getElementById('tab-2').click();
                    spawnBossQuest(bossNumber);
                } else {
                    invalidCommand();
                }
            } else if (commandText === "all the cores") {
                persistentValues.goldenCore = 1e3;
            } else if (commandText === "skip nuts") {
                saveValues.realScore += 1e40;
            } else if (commandText === "skip nuts squared") {
                saveValues.realScore += 1e100;
            } else if (commandText === "skip tree") {
                growTree('add', Math.round(100));
            } else {
                invalidCommand(commandText);
            }
        });



        const invalidCommand = (commandText) => {
            alert("Invalid command.");
            console.warn(`Invalid command: ${commandText}.`);
        }
        
        consoleBox.append(consoleBoxText, consoleBoxButton);
        
        errorHeaderButton.addEventListener('click', () => {
            if (errorHeaderButton.classList.contains('inactive-tab')) {
                errorHeaderButton.classList.remove('inactive-tab');
                consoleHeaderButton.classList.add('inactive-tab')
            }

            consoleBox.style.display = 'none';
            errorBox.style.display = 'block';
        })

        consoleHeaderButton.addEventListener('click', () => {
            if (consoleHeaderButton.classList.contains('inactive-tab')) {
                consoleHeaderButton.classList.remove('inactive-tab');
                errorHeaderButton.classList.add('inactive-tab')
            }

            consoleBox.style.display = 'block';
            errorBox.style.display = 'none';
        })

        consoleHeader.append(errorHeaderButton, consoleHeaderButton);
        consoleSettingsMenu.append(consoleHeader, errorBox, consoleBox);
        patchDiv.remove();
    }, 400);
}

function createMultiplierButton() {
    multiplierButtonContainer = document.createElement("div");
    multiplierButtonContainer.classList.add("multiplier-button-container");

    let multiplierButton1 = document.createElement("button");
    multiplierButton1 = multiplierButtonAdjust(multiplierButton1,1);
    multiplierButton1.addEventListener("click",() => {costMultiplier(10),currentDimMultiplier = dimMultiplierButton(1, currentDimMultiplier)});

    let multiplierButton2 = document.createElement("button");
    multiplierButton2 = multiplierButtonAdjust(multiplierButton2,2);
    multiplierButton2.addEventListener("click",() => {costMultiplier(25),currentDimMultiplier = dimMultiplierButton(2, currentDimMultiplier)});
    
    let multiplierButton3 = document.createElement("button");
    multiplierButton3 = multiplierButtonAdjust(multiplierButton3,3);
    multiplierButton3.addEventListener("click",() => {costMultiplier(100),currentDimMultiplier = dimMultiplierButton(3, currentDimMultiplier)});

    multiplierButtonContainer.append(multiplierButton3, multiplierButton2, multiplierButton1);
    midDiv.appendChild(multiplierButtonContainer);

    document.addEventListener('keyup', (event) => {
        event.preventDefault();
        if (event.key === "Shift") {
            multiplierButton1.click();
        } else if (event.key === "Alt") {
            multiplierButton2.click();
        } else if (event.key === "Control") {
            multiplierButton3.click();
        }
    })
}

function updateMilestoneNumber() {
    if (!document.getElementById("upgrade-menu-button")) {return};
    let milestoneButton = document.getElementById("upgrade-menu-button");
    if (milestoneCount == 0) {
        milestoneButton.innerText = `No Upgrades Available`;
    } else {
        milestoneButton.innerText = `${milestoneCount} Upgrades Available!`;
    }
}

function createFilter() {
    let filterButton = document.createElement("button");
    filterButton.innerText = "Filter:";
    let filterCurrently = document.createElement("div");
    filterCurrently.id = "filter-currently";
    let filterMenuOne = document.createElement("div");
    filterMenuOne.id = "filter-menu-one";
    let filterMenuTwo = document.createElement("div");
    filterMenuTwo.id = "filter-menu-two";

    let upgradeMenu = document.createElement("button");
    upgradeMenu.id = "upgrade-menu-button";
    upgradeMenu.innerText = `Upgrades:`;
    upgradeMenu.style.filter = "brightness(1)";
    
    filterButton.addEventListener("click",()=>{
        if (table1.style.display == "flex") {
            filterMenuOne = universalStyleCheck(filterMenuOne,"display","grid","none");
        } else if (table2.style.display == "flex") {
            filterMenuTwo = universalStyleCheck(filterMenuTwo,"display","grid","none");
        }
    })

    upgradeMenu.addEventListener("click",()=>{
        upgradeMenu.style.filter == "brightness(1)" ? upgradeMenu.style.filter = "brightness(0.4)" : upgradeMenu.style.filter = "brightness(1)";
        universalStyleCheck(document.getElementById('upgrade-selection'), 'display', 'flex', 'none');
        
        milestoneToggle("toggle");
        if (heroTooltip !== -1) {
            if (upgradeDict[heroTooltip] != undefined) {
                heroTooltip = upgradeDict[heroTooltip].Row;
                let removeActiveHero = document.getElementById(`but-${heroTooltip}`);
                if (removeActiveHero.classList.contains("active-hero")) {
                    removeActiveHero.classList.remove("active-hero");
                }
            } else if (document.getElementById(`milestone-${heroTooltip}`)) {
                let milestoneButton = document.getElementById(`milestone-${heroTooltip}`);
                if (milestoneButton.classList.contains("milestone-selected")) {
                    milestoneButton.classList.remove("milestone-selected");
                }
            }
        }
        clearTooltip();
    });

    const heroOptions = ['Pyro','Hydro','Anemo','Electro','Dendro','Cryo','Geo','Sword','Claymore','Catalyst','Polearm','Bow','Sumeru','Mondstadt','Liyue','Inazuma', 'Fontaine'];
    const invOptions = ['Artifact','Food','Level','Gemstone','Talent','Sword','Claymore','Catalyst','Polearm','Bow'];
    for (let i = 0, len = heroOptions.length; i < len; i++) {
        let filterPicture = document.createElement("button");
        filterPicture.style.backgroundImage = "url(./assets/tooltips/elements/" +heroOptions[i]+ ".webp)";
        filterPicture.classList.add("background-image-cover")
        filterPicture.addEventListener("click",()=> {
            // IF IMPORTANT, ALLOW UPGRADES TO FILTER HERE
            if (document.getElementById('upgrade-selection') && document.getElementById('upgrade-selection').style.display === "flex") {
                return;
            }

            if (filterPicture.classList.contains("dim-filter")) {
                filterPicture.classList.remove("dim-filter");
                filterHeroes(heroOptions[i]);
            } else {
                filterPicture.classList.add("dim-filter");
                filterHeroes(heroOptions[i]);
            }
            updateFilter(filteredHeroes);
        })

        filterMenuOne.appendChild(filterPicture);
    }

    for (let i=0,len=invOptions.length; i < len; i++) {
        let filterPicture;
        filterPicture = document.createElement("button");
        filterPicture.style.backgroundImage = "url(./assets/tooltips/elements/" +invOptions[i]+ ".webp)";
        filterPicture.classList.add("background-image-cover")

        filterPicture.addEventListener("click",()=> {
            if (filterPicture.classList.contains("dim-filter")) {
                filterPicture.classList.remove("dim-filter");
                filterInv(invOptions[i]);
            } else {
                filterPicture.classList.add("dim-filter");
                filterInv(invOptions[i]);
            }
            updateFilter(filteredInv);
        })
        filterMenuTwo.appendChild(filterPicture);
    }
    
    filterDiv.append(filterButton, filterMenuOne, filterMenuTwo, filterCurrently, upgradeMenu);
}


function filterHeroes(options) {
    if (filteredHeroes.includes(options)) {
        filteredHeroes = filteredHeroes.filter(e => e !== options)
    } else {
        filteredHeroes.push(options);
    }

    for (let i = 0, len=WISHHEROMAX; i < len; i++) {
        if (upgradeDict[i] == undefined) continue;
        if (i < WISHHEROMIN && i > NONWISHHEROMAX && i != 1) continue;
        let upgradeDictTemp = upgradeDict[i];
        let upgradeInfoTemp = upgradeInfo[i];

        if (upgradeDictTemp.Purchased >= 0) {
            let filterButton = document.getElementById("but-" + upgradeDictTemp.Row);

            if (filteredHeroes.length === 0) {
                filterButton.style.display = "flex";
                continue;
            } else {
                filterButton.style.display = "none";
            }

            for (let j=0,len=filteredHeroes.length; j < len; j++) {
                if (upgradeInfoTemp.Ele === filteredHeroes[j] || upgradeInfoTemp.Nation === filteredHeroes[j] || upgradeInfoTemp.Type === filteredHeroes[j]) {
                    filterButton.style.display = "flex";
                }
            }
        }
    }
}

function filterInv(options) {
    if (filteredInv.includes(options)) {
        filteredInv = filteredInv.filter(e => e !== options)
    } else {
        filteredInv.push(options);
    }

    let inventoryItems = table2.children;
    for (let i=0,len=inventoryItems.length; i < len ; i++) {
        let currentID = inventoryItems[i];
        if (filteredInv.length === 0) {
            currentID.style.display = "flex";
            continue;
        } else {
            currentID.style.display = "none";
        }

        let inventoryTemp = Inventory[currentID.id];
        
        for (let j=0,len=filteredInv.length; j < len; j++) {
            if (inventoryTemp.Type === filteredInv[j]) {
                currentID.style.display = "flex";
                break;
            }
        }
    }
}

function updateFilter(tab) {
    let filterCurrently = document.getElementById("filter-currently");
    if (tab.length !== 0) {
        filterCurrently.innerText = tab.length + " Applied";
    } else {
        filterCurrently.innerText = '';
    }
}

//------------------------------------------------------------------------TABLE 1 (HEROES)------------------------------------------------------------------------//
// LOAD SAVED HEROES IN TABLE1
function loadRow() {
    let i = WISHHEROMAX;
    while (i--) {
        if (upgradeDict[i] == undefined) continue;
        if (i < WISHHEROMIN && i > NONWISHHEROMAX) continue;
        if (upgradeDict[i].Row > -1){
            rowTempDict[upgradeDict[i].Row] = i;
        }
    }
    
    for (let j = 0, len=rowTempDict.length; j < len; j++) {
        let loadedHeroID = rowTempDict[j];
        let heroTextLoad;
        let heroID = "but-" + j;
        
        if (document.getElementById(heroID)) {continue}

        let upgradeDictTemp = upgradeDict[loadedHeroID];
        let formatCost = upgradeDictTemp["BaseCost"];
        let formatATK = upgradeDictTemp["Factor"];

        // FOR NAN BUG;
        if (formatATK == null) {
            upgradeDict[loadedHeroID]['Factor'] = formatCost / 1300;
            upgradeDict[loadedHeroID]['Contribution'] = upgradeDict[loadedHeroID]['Factor'] * upgradeDictTemp["Purchased"];
            upgradeDict[loadedHeroID]['BaseFactor'] = upgradeDictTemp["Factor"];
            formatATK = upgradeDictTemp["Factor"];
        }

        if (upgradeDictTemp["Purchased"] > 0) {
            formatCost *= (COSTRATIO**upgradeDictTemp["Purchased"])
            formatCost = abbrNum(formatCost,2);
            formatATK = abbrNum(formatATK,2);
            if (j == 0) {
                let singular = ` Nut${formatATK !== 1 ? 's' : ''} per click`;
                heroTextLoad =  upgradeInfo[loadedHeroID].Name + ": " + formatCost + ", " + formatATK + singular;
            } else {
                heroTextLoad =  upgradeInfo[loadedHeroID].Name + ": " + formatCost + ", +" + formatATK + " NpS";
            }
        } else {
            if (upgradeDictTemp["Level"] == 0) {
                heroTextLoad = "Summon " + upgradeInfo[loadedHeroID].Name + " for help. (" + abbrNum(formatCost,2) + ")";
            } else if (j == 0) {
                heroTextLoad = "Level Up Nahida (" + abbrNum(formatCost,2) + ")";
            } else {
                heroTextLoad = "Call for " + upgradeInfo[loadedHeroID].Name + "'s help... (" + abbrNum(formatCost,2) + ")";
            }
        }

        const selectHero = () => {
            changeTooltip(upgradeInfo[loadedHeroID], "hero", loadedHeroID);
            if (heroTooltip !== -1) {
                if (upgradeDict[heroTooltip] != undefined) {
                    heroTooltip = upgradeDict[heroTooltip].Row;
                    let removeActiveHero = document.getElementById(`but-${heroTooltip}`);
                    if (removeActiveHero.classList.contains("active-hero")) {
                        removeActiveHero.classList.remove("active-hero");
                    }
                } else if (document.getElementById(`milestone-${heroTooltip}`)) {
                    let milestoneButton = document.getElementById(`milestone-${heroTooltip}`);
                    if (milestoneButton.classList.contains("milestone-selected")) {
                        milestoneButton.classList.remove("milestone-selected");
                    }
                }
            }
            heroTooltip = loadedHeroID;
            heroButtonContainer.classList.add("active-hero");
        }

        let heroButtonContainer = drawUI.createHeroButtonContainer(heroID);
        heroButtonContainer.addEventListener("click", selectHero);
        heroButtonContainer.addEventListener('contextmenu', () => {
            selectHero();
            document.getElementById("tool-tip-button").click();
        });

        heroButtonContainer.innerText = heroTextLoad;
        if (upgradeDictTemp["Purchased"] > 0) {
            heroButtonContainer.style.background = `url('./assets/nameplates/${upgradeInfo[loadedHeroID].Name}.webp')`;  
            heroButtonContainer.style.backgroundSize = "125%"; 
            heroButtonContainer.style.backgroundPosition = "99% center"; 
            heroButtonContainer.style.backgroundRepeat = "no-repeat";
        } else {
            heroButtonContainer.classList += " not-purchased";
        }

        table1.appendChild(heroButtonContainer);
    }
}

// ADD NEW HEROES TO TABLE1
function addNewRow(onlyOnce) {
    for (let i = 0, len=WISHHEROMAX; i < len; i++) {
        if (upgradeDict[i] === undefined) continue;
        if (i < WISHHEROMIN && i > NONWISHHEROMAX) {
            i -= (WISHHEROMIN - NONWISHHEROMAX - 2);
            continue;
        };
        if (upgradeDict[i].Row != -1) continue;
        if (saveValues["realScore"] >= upgradeDict[i]["Level"] && upgradeDict[i].Purchased === -1) {
            upgradeDict[i].Row = saveValues["rowCount"];
            upgradeDict[i].Purchased = 0;

            let heroText;
            if (upgradeDict[i]["Level"] === 0) {
                heroText = "Summon " + upgradeInfo[i].Name + " for help. (" + abbrNum(upgradeDict[i]["BaseCost"],2) + ")";
            } else if (i === 0) {
                heroText = "Level Up Nahida (" + abbrNum(upgradeDict[i]["BaseCost"]) + ")";
            } else {
                heroText = "Call for " + upgradeInfo[i].Name + "'s help... (" + abbrNum(upgradeDict[i]["BaseCost"],2) + ")";
            }
            
            let heroID = "but-" + saveValues["rowCount"];
            if (document.getElementById(heroID)) {
                continue;
            }

            const selectHero = () => {
                changeTooltip(upgradeInfo[i], "hero", i);
                if (heroTooltip !== -1) {
                    if (upgradeDict[heroTooltip] != undefined) {
                        heroTooltip = upgradeDict[heroTooltip].Row;
                        let removeActiveHero = document.getElementById(`but-${heroTooltip}`);
                        if (removeActiveHero.classList.contains("active-hero")) {
                            removeActiveHero.classList.remove("active-hero");
                        }
                    } else if (document.getElementById(`milestone-${heroTooltip}`)) {
                        let milestoneButton = document.getElementById(`milestone-${heroTooltip}`);
                        if (milestoneButton.classList.contains("milestone-selected")) {
                            milestoneButton.classList.remove("milestone-selected");
                        }
                    }
                }
                heroTooltip = i;
                heroButtonContainer.classList.add("active-hero");
            }
    
            let heroButtonContainer = drawUI.createHeroButtonContainer(heroID);
            heroButtonContainer.addEventListener("click", selectHero);
            heroButtonContainer.addEventListener('contextmenu', () => {
                selectHero();
                document.getElementById("tool-tip-button").click();
            });

            saveValues["rowCount"]++;
            heroButtonContainer.innerText = heroText;
            if (milestoneOn) {heroButtonContainer.style.display = "none"}
            table1.appendChild(heroButtonContainer);

            if(onlyOnce) {return};
        }
    }
}

// UPGRADE HEROES
function upgrade(clicked_id) {
    let upgradeDictTemp = upgradeDict[clicked_id];
    var butIdArray = "but-" + upgradeDictTemp.Row;
    let realScoreCurrent = saveValues["realScore"];

    let costCurrent;
    let currentPurchasedLocal = upgradeDictTemp.Purchased;
    let currentMultiplierLocal = currentMultiplier;
    let requiredFree = 0;

    if (upgradeDictTemp.Purchased === 0) {
        currentMultiplierLocal = 1;
    }
    
    if (currentMultiplierLocal != 1) {
        costCurrent = Math.round(upgradeDictTemp["BaseCost"] * ((COSTRATIO** currentPurchasedLocal) - COSTRATIO**(currentPurchasedLocal + currentMultiplierLocal)) / (1 - COSTRATIO));
        requiredFree = currentMultiplierLocal;
    } else {
        costCurrent = Math.round(upgradeDictTemp["BaseCost"] * (COSTRATIO ** currentPurchasedLocal));
        requiredFree = 1;
    }

    if (realScoreCurrent >= costCurrent) {
        if (requiredFree) {
            if (saveValues["freeLevels"] >= requiredFree) {
                realScoreCurrent += (costCurrent * 0.5);
                saveValues["freeLevels"] -= requiredFree;
            }
        }
        
        realScoreCurrent -= costCurrent;
        let heroIncrease = upgradeDictTemp["Factor"] * currentMultiplierLocal;
        if (clicked_id === 0) {
            saveValues["clickFactor"] += heroIncrease;
        } else {
            saveValues["dps"] += heroIncrease;
        }

        if (randomInteger(0, 1000) < 0.5 * currentMultiplierLocal) {
            addTreeCore(randomInteger(1, 3));
        }

        upgradeDictTemp.Contribution += heroIncrease;
        upgradeDictTemp.Purchased += 1 * currentMultiplierLocal;
        saveValues.heroesPurchased += 1 * currentMultiplierLocal;
        persistentValues.lifetimeLevelsValue += 1 * currentMultiplierLocal;

        if (clicked_id === 0 && upgradeDictTemp.Purchased >= 700) {challengeNotification(({category: 'specific', value: [4, 1]}))}
        if (clicked_id === 1 && upgradeDictTemp.Contribution >= 1e9) {challengeNotification(({category: 'specific', value: [2, 1]}))}

        checkExpeditionUnlock(saveValues["dps"]);                                        
        refresh(butIdArray, upgradeDictTemp["BaseCost"], clicked_id);
        milestoneCheck(clicked_id,upgradeDictTemp.Purchased)
            
        changeTooltip(upgradeInfo[clicked_id],"hero",clicked_id);                   
        saveValues["realScore"] = realScoreCurrent;
        upgradeElement.load();
        upgradeElement.play();
    } else {
        weaselDecoy.load();
        weaselDecoy.play();
    }
}

function costMultiplier(multi) {
    if (currentMultiplier == multi) {
        currentMultiplier = 1;
    } else {
        currentMultiplier = multi;
    }

    updatePurchaseText();

    let i = WISHHEROMAX;
    while (i--) {
        if (i < WISHHEROMIN && i > NONWISHHEROMAX) {
            i -= (WISHHEROMIN - NONWISHHEROMAX - 2);
            continue;
        }
        if (upgradeDict[i] == undefined) continue;
        if (upgradeDict[i].Locked === true) continue;
        if (upgradeDict[i]["Purchased"] > 0) {
            let buttID = "but-" + upgradeDict[i].Row;
            refresh(buttID, upgradeDict[i]["BaseCost"], i);
        }
    } 
}

function updatePurchaseText() {
    if (document.getElementById("tool-tip-button")) {
        let tooltipButtonText = document.getElementById("tool-tip-button");
        if (table2.style.display === "flex") {
            return;
        } else if (milestoneOn) {
            tooltipButtonText.innerText = `Buy`;
        } else if (currentMultiplier == 1) {
            tooltipButtonText.innerText = `Purchase`;
        } else {
            tooltipButtonText.innerText = `Purchase ${currentMultiplier}`;
        }
    }
}

// MILESTONE UPGRADES
function milestoneHeroAdd() {
    let mileStoneReference = {
        10:false, 25:false, 50:false, 75:false, 100:false, 150:false, 200:false,250:false,300:false,350:false,400:false,450:false,500:false
    };
    let upgradeDictTemp = upgradeDict;
    let i = WISHHEROMAX;
    while (i--) {
        if (i < WISHHEROMIN && i > NONWISHHEROMAX) {
            i -= (WISHHEROMIN - NONWISHHEROMAX - 2);
            continue;
        }
        if (upgradeDictTemp[i] == undefined) continue;
        if (upgradeDictTemp[i].Locked === true) continue;
        if (upgradeDictTemp[i].milestone === undefined) {
            let mileStoneUpgrades = {
                10:false, 25:false, 50:false, 75:false, 100:false, 150:false, 200:false,250:false,300:false,350:false,400:false,450:false,500:false
            };
            upgradeDictTemp[i].milestone = mileStoneUpgrades;
        } else {
            upgradeDictTemp[i].milestone = updateObjectKeys(upgradeDictTemp[i].milestone,mileStoneReference)
        }
    }
    upgradeDict = upgradeDictTemp;
    milestoneLoad();
}

function milestoneLoad() {
    for (let key in upgradeDict) {
        let upgradeHeroTemp = upgradeDict[key];
        if (upgradeHeroTemp.Locked === true) continue;
        if (upgradeHeroTemp.Purchased === -10) continue;
        for (let secondKey in upgradeHeroTemp.milestone) {
            if (upgradeHeroTemp.milestone[secondKey] === false) {
                if (upgradeHeroTemp.Purchased >= secondKey) {
                    milestoneAdd(secondKey,key);
                }
            }
        }
    }
}

const elemItemID = {
    "Pyro":1,
    "Hydro":2,
    "Dendro":3,
    "Electro":4,
    "Anemo":5,
    "Cryo":6,
    "Geo":7,
}

const constNation = {
    Liyue: 1,
    Mondstadt: 2,
    Sumeru: 3,
    Inazuma: 4,
    Fontaine: 5,
}

function milestoneBuy(heroTooltip) {
    if (document.getElementById(`milestone-${heroTooltip}`).classList.contains("milestone-selected")) {document.getElementById(`milestone-${heroTooltip}`).classList.remove("milestone-selected")}
    const heroID = heroTooltip.split("-")[0];
    const level = parseInt(heroTooltip.split("-")[1]);
    const cost = (4 * upgradeDict[heroID]["BaseCost"] * (COSTRATIO ** (level - 1)));

    const currentSelection = document.getElementById('upgrade-selection').currentValue;
    let elementItemID = 5002;
    let nationItemID = 6000;
    let itemArray = [];

    let buff = 0.5;
    let itemStar = -1;
    if (level >= 350) {
        itemStar = 0;
        buff = 4;
    } else if (level >= 200) {
        itemStar = 1;
        buff = 2;
    } else if (level >= 75) {
        itemStar = 2;
        buff = 1;
    }

    if (itemStar === -1) {
        if (saveValues.realScore >= cost) {
            milestoneSuccess(true);
        } else {
            weaselDecoy.load();
            weaselDecoy.play();
            return;
        }
    } else {
        // TRAVELER ONLY
        if (upgradeInfo[heroID].Ele === "Any") {
            if (currentSelection === 'prefer-book') {
                weaselDecoy.load();
                weaselDecoy.play();
                return;
            } else {
                for (let i = 1; i < 8; i++) {
                    if (InventoryMap.has(elementItemID + i + 7 * itemStar) && InventoryMap.get(elementItemID + i + 7 * itemStar) > 0) {
                        itemArray.push(elementItemID + i + 7 * itemStar);
                    }
                }

                if (itemArray.length === 0 || saveValues.realScore < cost) {
                    weaselDecoy.load();
                    weaselDecoy.play();
                    return;
                }

                let tempID = rollArray(itemArray, 0);
                reduceItem(tempID);
                milestoneSuccess(true);
            }
        } else {
            let heroElement = upgradeInfo[heroID].Ele;
            let heroNation = upgradeInfo[heroID].Nation;

            let tempElement = InventoryMap.get(elementItemID + elemItemID[heroElement] + 7 * itemStar);
            if (tempElement && tempElement > 0) {
                itemArray.push(elementItemID + elemItemID[heroElement] + 7 * itemStar);
            }

            if (currentSelection === 'prefer-gem') {
                if (itemArray.length === 0) {
                    weaselDecoy.load();
                    weaselDecoy.play();
                } else {
                    let inventoryCount = InventoryMap.get(itemArray[0]);
                    inventoryCount--;
                    InventoryMap.set(itemArray[0], inventoryCount);
                    if (inventoryCount <= 0) {(document.getElementById(itemArray[0])).remove()}
                    milestoneSuccess(false);
                }
                return;
            } else {
                if (currentSelection === 'prefer-none') {
                    if (itemArray.length > 0) {
                        let inventoryCount = InventoryMap.get(itemArray[0]);
                        inventoryCount--;
                        InventoryMap.set(itemArray[0], inventoryCount);
                        if (inventoryCount <= 0) {(document.getElementById(itemArray[0])).remove()}
                        milestoneSuccess(false);
                        return;
                    }
                }

                const nationArray = [];
                const nationItem = nationItemID + constNation[heroNation] + 50 * (4 - itemStar);
                let tempBook = InventoryMap.get(nationItem);
                if (tempBook && tempBook > 0) {
                    nationArray.push(nationItem);
                }

                if (nationArray.length === 0 || saveValues.realScore < cost) {
                    weaselDecoy.load();
                    weaselDecoy.play();
                    return;
                } else if (nationArray.length >= 0 && saveValues.realScore >= cost) {
                    reduceItem(nationArray[0]);
                    milestoneSuccess(true);
                }
            }
        }
    }

    function milestoneSuccess(useGem = false) {
        let upgradeDictTemp = upgradeDict[heroID];
        let additionPower = Math.ceil(upgradeDictTemp["Factor"] * upgradeDictTemp.Purchased * buff);
        if (heroID != 0) {saveValues["dps"] += additionPower} else {saveValues["clickFactor"] += additionPower};
        
        upgradeDict[heroID]["Contribution"] += additionPower;
        upgradeDict[heroID]["BaseFactor"] = Math.ceil(upgradeDict[heroID]["BaseFactor"]) * (buff+1);
        upgradeDict[heroID]["Factor"] = Math.ceil(upgradeDictTemp["Factor"] * (buff+1));
        upgradeDict[heroID].milestone[level] = true;

        if (heroID == 1 && upgradeDict[heroID]["Contribution"] >= 1e9) {challengeNotification(({category: 'specific', value: [2, 1]}))}

        let currentEle = document.getElementById(`milestone-${heroTooltip}`);
        if (currentEle.nextSibling !== null) {
            let nextEle = currentEle.nextSibling;
            nextEle.classList.contains('milestone-upgrade') ? nextEle.click() : clearTooltip();
        } else {
            clearTooltip();
        }
        
        setTimeout(()=> {
            currentEle.remove();
            refresh("hero", heroID);
            updatedHero(heroID);

            if (useGem) {saveValues.realScore -= cost};
            milestoneCount--;
            updateMilestoneNumber();  
        }, 0);

        try {
            upgradeElement.load();
            upgradeElement.play();
        } catch {}
    }
}

function milestoneCheck(heroID,level) {
    let upgradeHeroTemp = upgradeDict[heroID];
    if (upgradeHeroTemp.milestone === undefined) {
        upgradeHeroTemp.milestone = mileStoneUpgrades;
    }

    for (let key in upgradeHeroTemp.milestone) {
        if (upgradeHeroTemp.milestone[key] === false) {
            if (level > key) {
                milestoneAdd(key,heroID);
            }
        }
    }
}

function milestoneAdd(lowestKey,heroID) {
    if (document.getElementById(`milestone-${heroID}-${lowestKey}`)) {return}
    let milestoneButton = document.createElement("div");
    milestoneButton.id = `milestone-${heroID}-${lowestKey}`
    milestoneButton.classList.add("milestone-upgrade","flex-row");
    milestoneButton.style.display = "none";

    if (lowestKey >= 350) {
        milestoneButton.style.backgroundColor = "#684052";
        milestoneButton.style.border = "0.2em solid #B17B94";
    } else if (lowestKey >= 200) {
        milestoneButton.style.backgroundColor = "#685E19";
        milestoneButton.style.border = "0.2em solid #ADA346";
    } else if (lowestKey >= 75) {
        milestoneButton.style.backgroundColor = "#2c2c4c";
        milestoneButton.style.border = "0.2em solid #777898";
    }

    let milestoneImg = createDom('img');
    milestoneImg.src = `./assets/tooltips/milestone/${upgradeInfo[heroID].Name}.webp`;

    milestoneButton.append(milestoneImg);

    const milestoneBuy = () => {
        if (document.getElementById(`milestone-${heroTooltip}`)) {
            let oldMilestoneButton = document.getElementById(`milestone-${heroTooltip}`);
            if (oldMilestoneButton.classList.contains("milestone-selected")) {
                oldMilestoneButton.classList.remove("milestone-selected");
            }
        }

        heroTooltip = heroID + "-" + lowestKey;
        changeTooltip(upgradeInfo[heroID],"milestone",lowestKey);
        milestoneButton.classList.add("milestone-selected");
    }
    
    milestoneButton.addEventListener("click", milestoneBuy);
    milestoneButton.addEventListener("contextmenu",() => {
        milestoneBuy();
        document.getElementById('tool-tip-button').click();
        if (milestoneButton) {
            milestoneBuy();
        }
    });


    table1.appendChild(milestoneButton);
    milestoneCount++;
    updateMilestoneNumber();
}

function milestoneToggle(type) {
    if (type === "toggle") {
        let heroChildren = table1.querySelectorAll(".upgrade");
        for (let i = 0; i < heroChildren.length; i++) {
            if (milestoneOn) {heroChildren[i].style.display = "flex"}
            else {heroChildren[i].style.display = "none"}
        }

        let milestoneChildren = table1.querySelectorAll(".milestone-upgrade");
        for (let i = 0; i < milestoneChildren.length; i++) {
            if (!milestoneOn) {milestoneChildren[i].style.display = "flex"}
            else {milestoneChildren[i].style.display = "none"}
        }

        milestoneOn ? milestoneOn = false : milestoneOn = true;
        let tooltipButtonText = document.getElementById("tool-tip-button");
        if (milestoneOn) {
            tooltipButtonText.innerText = `Buy`;
        } else {
            tooltipButtonText.innerText = `Purchase ${currentMultiplier}`;
            if (currentMultiplier === 1) {tooltipButtonText.innerText = `Purchase`}
        }
    } else if (type === "close") {
        let heroChildren = table1.querySelectorAll(".upgrade");
        for (let i = 0; i < heroChildren.length; i++) {
            if (milestoneOn) {heroChildren[i].style.display = "flex"}
        }

        let milestoneChildren = table1.querySelectorAll(".milestone-upgrade");
        for (let i = 0; i < milestoneChildren.length; i++) {
            if (milestoneOn) {milestoneChildren[i].style.display = "none"}
        }

        let tooltipButtonText = document.getElementById("tool-tip-button");
        tooltipButtonText.innerText = `Purchase ${currentMultiplier}`
        if (currentMultiplier == 1) {tooltipButtonText.innerText = `Purchase`}

        document.getElementById('upgrade-menu-button').style.filter = "brightness(1)";
        milestoneOn = false;
    }
}

// CHECK IF PRICE IS LOWER THAN CURRENT SCORE
function dimHeroButton() {
    let i = WISHHEROMAX;
    while (i--) {
        if (i < WISHHEROMIN && i > NONWISHHEROMAX) {
            i -= (WISHHEROMIN - NONWISHHEROMAX - 2);
            continue;
        }
        if (upgradeDict[i] == undefined) continue;
        if (upgradeDict[i].Locked === true) continue;
        if (upgradeDict[i]["Purchased"] < 0) continue;

        let checkPrice;
        let upgradeDictTemp = upgradeDict[i];
        if (currentMultiplier > 1 && upgradeDictTemp["Purchased"] > 0) {
                checkPrice = Math.round(upgradeDictTemp["BaseCost"] * ((COSTRATIO**upgradeDictTemp["Purchased"]) - COSTRATIO**(upgradeDictTemp["Purchased"] + currentMultiplier)) / (1 - COSTRATIO));
            } else {
                checkPrice = upgradeDictTemp["BaseCost"] * (COSTRATIO ** (upgradeDictTemp["Purchased"]));
            }

        let heroID = "but-" + upgradeDictTemp.Row;
        let heroElem = document.getElementById(heroID);
        if (checkPrice > saveValues["realScore"]) {
            if (heroElem.classList.contains("dim")) {
                continue;
            } else {
                heroElem.classList.add("dim");
                heroElem.classList.remove("not-dim");
            }
        } else {
            if (heroElem.classList.contains("not-dim")) {
                continue;
            } else {
                heroElem.classList.add("not-dim");
                heroElem.classList.remove("dim");
            }
        }
    }
}

//------------------------------------------------------------------------TABLE 2 (INVENTORY)------------------------------------------------------------------------//
// LOAD SAVED INVENTORY
function inventoryload() {
    for (let i = 0; i < 10000; i++) {
        if (InventoryMap.has(i)) {
            if (Inventory[i] == undefined) {continue}
            let x = InventoryMap.get(i);
            if (x > 0) {
                inventoryAdd(i, "load");
            }
        } else {
            continue;
        }
    }
}

// ADD TO INVENTORY 
function inventoryAdd(idNum, type) {
    let itemUniqueID;
    idNum = parseInt(idNum);
    if (type != "load") {
        let currentValue = 0;
        if (InventoryMap.has(idNum)) {
            currentValue = InventoryMap.get(idNum);
        }
        currentValue++;
        InventoryMap.set(idNum,currentValue);
        if (currentValue > 1) {
            let newIcon = document.createElement("img");
            newIcon.classList.add("new-item");
            newIcon.src = "./assets/icon/new-item.webp";

            if (!document.getElementById(idNum)) {return}
            let updatedButton = document.getElementById(idNum);
            updatedButton.updateNumber();
            updatedButton.appendChild(newIcon);
            updatedButton.addEventListener("click",()=>{newIcon.remove()})
            return;
        }
    }

    itemUniqueID = idNum;
    let buttonInv = document.createElement("button");
    // SEED CHECKER (SKIRMISH ONLY)
    if (itemUniqueID >= 4019 && itemUniqueID < 4021) {
        if (type === "load") {
            InventoryMap.delete(itemUniqueID);
            return;
        }
        addTreeCore(randomInteger(8, 15), itemUniqueID - 4018, true);
        return;
    } else {
        buttonInv.classList.add("button-container");
        buttonInv.id = itemUniqueID;

        const itemNumberText = createDom('p', {
            classList: ['item-frame-text'],
            innerText: InventoryMap.get(itemUniqueID),
        });
        
        buttonInv.appendChild(itemNumberText);
        buttonInv.updateNumber = () => {
            itemNumberText.innerText = InventoryMap.get(itemUniqueID);
        }

        const changeItem = () => {
            buttonInv.updateNumber();
            changeTooltip(Inventory[idNum], "item", idNum);
            if (itemTooltip === -1) {
                buttonInv.classList.add("inventory-selected");
            } else if (idNum !== itemTooltip) {
                let buttonDocument = document.getElementById(itemTooltip);
                buttonDocument.classList.remove("inventory-selected");
                buttonInv.classList.add("inventory-selected");
            }
            
            itemTooltip = idNum;
        }

        buttonInv.addEventListener('click', changeItem);
        buttonInv.addEventListener('contextmenu', () => {
            changeItem();
            document.getElementById('tool-tip-button').click();
        });
    }

    if (type != "load") {
        let newIcon = document.createElement("img");
        newIcon.classList.add("new-item");
        newIcon.src = "./assets/icon/new-item.webp";
        buttonInv.appendChild(newIcon);
        buttonInv.addEventListener("click",()=>{newIcon.remove()})
    }
    
    buttonInv = inventoryAddButton(buttonInv,Inventory[idNum]);
    table2.appendChild(buttonInv);
}

// SKIPS PARTS OF HERO DICTIONARY
function heroSkipper(itemFunction, itemID) {
    for (let i = 0, len = WISHHEROMAX; i < len; i++) {
        if (upgradeDict[i] == undefined) continue;
        if (upgradeDict[i].Locked === true) continue;
        if (i < WISHHEROMIN && i > NONWISHHEROMAX) {
            i -= (WISHHEROMIN - NONWISHHEROMAX - 2);
            continue;
        };

        let upgradeDictTemp = upgradeDict[i];
        if (upgradeDictTemp.Purchased > 0) {
            itemFunction(i, upgradeDictTemp, itemID);
        }
    }
}

// INVENTORY FUNCTIONALITY
function itemUse(itemUniqueId) {
    let itemID;
    if (typeof itemUniqueId === 'string') {
        itemID = itemUniqueId.split(".")[0];
    } else {
        itemID = itemUniqueId;
    }
    
    // WEAPON
    if (itemID >= 1001 && itemID < WEAPONMAX) {
        const weaponFunction = (i, upgradeDictTemp) => {
            if (upgradeInfo[i].Type == Inventory[itemID].Type) {
                let additionPower = Math.ceil(upgradeDictTemp["BaseFactor"] * upgradeDictTemp.Purchased * (weaponBuffPercent[Inventory[itemID].Star] - 1));
                additionPower = Math.round(additionPower * additionalStrength);

                if (i !== 0) {saveValues["dps"] += additionPower} else {saveValues["clickFactor"] += additionPower}
                upgradeDict[i]["Contribution"] += additionPower;
                upgradeDict[i]["Factor"] = parseInt(upgradeDict[i]["Factor"]) + Math.ceil(additionPower / upgradeDictTemp.Purchased);

                if (i === 1 && upgradeDict[i]["Contribution"] >= 1e9) {challengeNotification(({category: 'specific', value: [2, 1]}))}

                refresh("hero", i);
                updatedHero(i);
            }
        }

        heroSkipper(weaponFunction);
    // ARTIFACT
    } else if (itemID >= 2001 && itemID < ARTIFACTMAX){
        const artifactFunction = (i, upgradeDictTemp) => {
            let additionPower = Math.ceil(upgradeDictTemp["BaseFactor"] * upgradeDictTemp.Purchased * (artifactBuffPercent[Inventory[itemID].Star] - 1));
            additionPower = Math.round(additionPower * additionalDefense);

            if (i !== 0) {saveValues["dps"] += additionPower} else {saveValues["clickFactor"] += additionPower}
            upgradeDict[i]["Contribution"] += additionPower;
            upgradeDict[i]["Factor"] = parseInt(upgradeDict[i]["Factor"]) + Math.ceil(additionPower / upgradeDictTemp.Purchased);

            if (i === 1 && upgradeDict[i]["Contribution"] >= 1e9) {challengeNotification(({category: 'specific', value: [2, 1]}))}

            refresh("hero", i);
        }

        heroSkipper(artifactFunction);
    // FOOD
    } else if (itemID >= 3001 && itemID < FOODMAX){
        foodButton(1);
        foodBuff = foodBuffPercent[Inventory[itemID].Star];
        foodBuff *= additionalDefense;
        updateMorale("add",(Inventory[itemID].Star ** 2));
    // LEVEL BOOKS
    } else if (itemID >= 4001 && itemID < XPMAX){
        saveValues["freeLevels"] += randomInteger(Inventory[itemID].BuffLvlLow,Inventory[itemID].BuffLvlHigh);
        challengeNotification(({category: 'discount', value: saveValues.freeLevels}))
        refresh();
    } else if (itemID === 4010) {
        saveValues["mailCore"]++;
        newPop(3)
    // ENERGY POTS
    } else if (itemID >= 4011 && itemID < 4014) {
        const energyGain = energyBuffPercent[Inventory[itemID].Star]
        saveValues.energy += energyGain;
        persistentValues.lifetimeEnergyValue += energyGain;

        challengeNotification(({category: 'energy', value: saveValues.energy}))
        refresh();
    // BUNDLES
    } else if (itemID >= 4014 && itemID < 4018) {
        switch (itemID) {
            case 4014:
                inventoryDraw("talent", 2, 2);
                inventoryDraw("talent", 2, 3);
                inventoryDraw("talent", 3, 3);
                break;
            case 4015:
                inventoryDraw("talent", 2, 2);
                inventoryDraw("talent", 3, 3);
                inventoryDraw("talent", 3, 3);
                inventoryDraw("talent", 4, 4);
                inventoryDraw("talent", 4, 4);
                break;
            case 4016:
                inventoryDraw("gem", 3, 3);
                inventoryDraw("gem", 3, 4);
                inventoryDraw("gem", 4, 4);
                break;
            case 4017:
                inventoryDraw("gem", 3, 3);
                inventoryDraw("gem", 3, 4);
                inventoryDraw("gem", 4, 4);
                inventoryDraw("gem", 5, 5);
                inventoryDraw("gem", 5, 5);
                break;
            default:
                break;
        }

        newPop(1);
        currencyPopUp([["items", 0]]);
        sortList("table2");
    } else if (itemID === 4018) {
        inventoryDraw("xp", 2, 3);
        inventoryDraw("xp", 2, 3);
        inventoryDraw("xp", 3, 3);
        inventoryAdd(4010);
        inventoryAdd(4010);

        newPop(1);
        currencyPopUp([["items", 0]]);
        sortList("table2");
    // ELEMENT GEMS
    } else if (itemID === 5001 || itemID === 5002){
        const gemFunction = (i, upgradeDictTemp, itemID) => {
            let power = (Inventory[itemID].Star === 5) ? 2 : 3;
            let additionPower = Math.ceil(upgradeDictTemp["BaseFactor"] * upgradeDictTemp.Purchased * (power - 1));
            additionPower = Math.round(additionPower * additionalDefense);

            if (i !== 0) {saveValues["dps"] += additionPower} else {saveValues["clickFactor"] += additionPower}
            upgradeDict[i]["Contribution"] += additionPower;
            upgradeDict[i]["Factor"] = parseInt(upgradeDict[i]["Factor"]) + Math.ceil(additionPower / upgradeDictTemp.Purchased);

            if (i === 1 && upgradeDict[i]["Contribution"] >= 1e9) {challengeNotification(({category: 'specific', value: [2, 1]}))}

            refresh("hero", i);
        }

        heroSkipper(gemFunction, itemID);
    // ELEMENT GEMS
    } else if (itemID >= 5001 && itemID < GEMMAX){
        const gemFunction = (i, upgradeDictTemp, itemID) => {
            let power = elementBuffPercent[Inventory[itemID].Star];
            let elem = Inventory[itemID].element;

            if (upgradeInfo[i].Ele == elem || upgradeInfo[i].Ele == "Any") {
                let additionPower = Math.ceil(upgradeDictTemp["BaseFactor"] * upgradeDictTemp.Purchased * (power - 1));
                additionPower = Math.round(additionPower * additionalDefense);

                if (i !== 0) {saveValues["dps"] += additionPower} else {saveValues["clickFactor"] += additionPower}
                upgradeDict[i]["Contribution"] += additionPower;
                upgradeDict[i]["Factor"] = parseInt(upgradeDict[i]["Factor"]) + Math.ceil(additionPower / upgradeDictTemp.Purchased);

                if (i === 1 && upgradeDict[i]["Contribution"] >= 1e9) {challengeNotification(({category: 'specific', value: [2, 1]}))}

                refresh("hero", i);
                updatedHero(i);
            }
        }

        heroSkipper(gemFunction, itemID);
    // NATION BOOKS
    } else if (itemID >= 6001 && itemID < NATIONMAX){
        const bookFunction = (i, upgradeDictTemp, itemID) => {
            let power = nationBuffPercent[Inventory[itemID].Star];
            let nation = Inventory[itemID].nation;

            if (upgradeInfo[i].Nation === nation || upgradeInfo[i].Nation == "Any") {
                let additionPower = Math.ceil(upgradeDictTemp["BaseFactor"] * upgradeDictTemp.Purchased * (power - 1));
                additionPower = Math.round(additionPower * additionalStrength);

                if (i !== 0) {saveValues["dps"] += additionPower} else {saveValues["clickFactor"] += additionPower}
                upgradeDict[i]["Contribution"] += additionPower;
                upgradeDict[i]["Factor"] = parseInt(upgradeDict[i]["Factor"]) + Math.ceil(additionPower / upgradeDictTemp.Purchased);

                if (i === 1 && upgradeDict[i]["Contribution"] >= 1e9) {challengeNotification(({category: 'specific', value: [2, 1]}))}

                refresh("hero", i);
                updatedHero(i);
            }
        }

        heroSkipper(bookFunction, itemID);
        return;
    }
}

// FOR BUFFS SPECIFIC TO NATION/WEAPON TYPE/ELEMENT
function updatedHero(i) {
    let id = "but-" + upgradeDict[i].Row;
    let heroButton = document.getElementById(id);

    let updatedIcon = document.createElement("img")
    updatedIcon.src = "./assets/icon/hero-upgraded.webp";
    updatedIcon.classList.add("new-hero");
    heroButton.appendChild(updatedIcon);
    heroButton.addEventListener("click",()=>{updatedIcon.remove()})
}

function foodButton(type) {
    let container = document.getElementById("app" + type);
    let currentTime = getTime();
    let foodCooldown = createDom('div', {
        id: `temp-buff-${type}`,
        creationTime: currentTime
    });

    if (type === 1) {
        container.innerHTML = '';
        foodCooldown = countdownText(foodCooldown, 1);
        foodCooldown.addEventListener("animationend",() => {
            foodCooldown.remove();
            foodBuff = 1;
        })
        container.appendChild(foodCooldown);
    } else if (type === 2) {
        container.innerHTML = '';
        foodCooldown = countdownText(foodCooldown, 2);
        foodCooldown.addEventListener("animationend",() => {
            stopClickEvent();
            foodCooldown.remove();
        });
        container.appendChild(foodCooldown);
    }
}

//-------------------------------------------------------------TABLE 3 (EXPEDITION + TOOLTIPS)----------------------------------------------------------//
// EXPEDITION MECHANICS
const ADVENTURECOSTS = [0, 100, 250, 500, 750, 1000];
function adventure(advType) {
    let type = parseInt(advType.split("-")[0]);
    if (expeditionDict[type] != '1') {
        let wave = rollArray(JSON.parse(advType.split("-")[1]), 0);
        if (saveValues["energy"] >= ADVENTURECOSTS[type <= 5 && type > 1 ? type : 0]) {
            adventureElement.load();
            adventureElement.play();
            saveValues["energy"] -= ADVENTURECOSTS[type <= 5 && type > 1  ? type : 0];
            updateMorale("add", (randomInteger(7, 15) * -1));

            if (activeLeader == "Paimon" && type <= 5 && type > 1) {saveValues["energy"] += Math.round(ADVENTURECOSTS[type] * 0.15)}
            if (!persistentValues.tutorialBasic) {
                drawUI.customTutorial("advTut", 6, 'Expedition Tutorial', () => { drawAdventure(type, wave) });
                persistentValues.tutorialBasic = true;
            } else if (type >= 3 && type < 6 && persistentValues.tutorialRanged != true) {
                drawUI.customTutorial("rangTut", 2, 'Expedition Tutorial', () => { drawAdventure(type, wave) });
                persistentValues.tutorialRanged = true;
            } else if ((type === 13 || type === 15) && persistentValues.tutorialSkirmish != true) {
                drawUI.customTutorial("skirTut", 4, 'Skirmish Tutorial', () => { drawAdventure(type, wave) });
                persistentValues.tutorialSkirmish = true;
            } else {
                drawAdventure(type, wave);
            }
        } else {
            Expedition.expedInfo("exped-9", expeditionDict, saveValues, persistentValues);
            weaselDecoy.load();
            weaselDecoy.play();
        } 
    } else {
        console.error(`Invalid Expedition Type: ${type}`);
        return;  
    }
} 

function genericItemLoot() {
    let type = 2;
    if (expeditionDict[5] != '1') {
        type = 5;
    } else if (expeditionDict[4] != '1') {
        type = 4;
    } else if (expeditionDict[3] != '1') {
        type = 3;
    }

    drawLoot(type);
    sortList("table2");
    newPop(1);
}

function drawLoot(type) {
    let randomDraw = randomInteger(1,3);
    switch (type) {
        case 1:
            inventoryDraw("artifact", 1, 2);
            inventoryDraw("weapon", 1, 2);
            inventoryDraw("food", 1, 2);
            break;
        case 2:
            inventoryDraw("food", 2, 3);
            inventoryDraw("artifact", 1, 3);
            inventoryDraw("weapon", 1, 3);

            if (randomDraw == 1) {
                inventoryDraw("food", 1, 3);
            }
            break;
        case 3:
            inventoryDraw("artifact", 2, 4);
            inventoryDraw("weapon", 2, 4);
            inventoryDraw("talent", 2, 4);
            inventoryDraw("talent", 2, 4);

            if (randomDraw == 1) {
                inventoryDraw("food", 2, 4);
            }
            break;
        case 4:
            inventoryDraw("xp", 2, 2);
            inventoryDraw("artifact", 3, 4);
            inventoryDraw("weapon", 3, 4);
            inventoryDraw("artifact", 3, 3);
            inventoryDraw("gem", 3, 5);

            if (randomDraw == 1) {
                inventoryDraw("food", 3, 5);
            }
            
            break;
        case 5:
            inventoryDraw("xp", 2, 3);
            inventoryDraw("weapon", 4, 5);
            inventoryDraw("weapon", 4, 4);
            inventoryDraw("talent", 4, 4);
            inventoryDraw("talent", 4, 4);
            inventoryDraw("artifact", 4, 5);  
            inventoryDraw("gem", 4, 5);

            if (randomDraw == 1) {
                inventoryDraw("food", 4, 5);
            } 
            break;
        default:
            console.error("Inventory error: Invalid item spawned");
            break;
    }
}

// ADVENTURE SEGMENT DRAW
function createAdventure() {
    const adventureVideo = Expedition.createTopHalf();
    const adventureTextBox = createDom('div', {
        id: "adventure-text",
        class: ["adventure-text", "flex-row"],
        questNumber: null,
    });

    const [adventureEncounter, adventureChoiceOne] = Expedition.createEncounterHalf();
    const [adventureFightDiv, adventureFightDodge, adventureFightSkill, adventureFightBurst] = Expedition.createBattleHalf(MOBILE);

    adventureFightDodge.addEventListener("click",()=>{
        dodgeOn("toggle", adventureFightDodge);
    });

    adventureFightSkill.addEventListener("click",()=>{
        skillUse();
    });

    adventureFightBurst.addEventListener("click",()=>{
        attackAll(adventureFightBurst);
    });
    
    document.addEventListener("keydown", function(event) {
        if (adventureScene) {
            if (event.key === "z" || event.key === "q") {
                adventureFightDodge.click();
            } else if (event.key === "x" || event.key === "w") {
                adventureFightSkill.click();
            } else if (event.key === "c" || event.key === "e") {
                adventureFightBurst.click();
            }
        }
    });

    adventureTextBox.switchToBattle = () => {
        adventureEncounter.style.display = "none";
        adventureChoiceOne.style.display = "none";
        adventureFightDiv.style.display = "flex";
    }

    adventureChoiceOne.switchWorldQuest = (advType) => {
        adventureChoiceOne.style.display = "block";
        adventureChoiceOne.pressAllowed = false;
        adventureChoiceOne.innerText = "Next";
        adventureChoiceOne.advType = advType;
        adventureChoiceOne.maxScene = null;
        adventureChoiceOne.currentScene = null;
    }

    adventureChoiceOne.addEventListener("click",()=>{
        if (adventureChoiceOne.pressAllowed) {
            if (adventureChoiceOne.advType != 12) {
                adventureChoiceOne.pressAllowed = false;
                triggerFight();
                adventureTextBox.switchToBattle();
            } else {
                if (adventureChoiceOne.currentScene === 'Finale') {
                    return;
                } else if (adventureChoiceOne.currentScene < adventureChoiceOne.maxScene) {
                    continueQuest(adventureTextBox.questNumber);
                } else if (adventureChoiceOne.currentScene === adventureChoiceOne.maxScene) {
                    finishQuest(adventureTextBox.questNumber);
                } else {
                    console.error(`drawWorldQuest Error: ${adventureTextBox.questNumber}`)
                }
            }
        }
    });
    
    adventureTextBox.append((createDom('img', { src: './assets/expedbg/table.webp' })), adventureEncounter, adventureFightDiv);
    mainBody.append(
        createDom('div', {
            id: "adventure-area",
            class: ["adventure-area", "flex-column"],
            style: { display: 'none' },
            child: [adventureVideo, adventureTextBox]
        })
    );
}


// DRAWS FOR RANDOM INVENTORY LOOT
function inventoryDraw(itemType, min, max, type, itemClass){
    itemType = itemType.toLowerCase();
    let attempts = 0;
    let upperInventoryType = {
        "weapon": WEAPONMAX, 
        "artifact": ARTIFACTMAX, 
        "food": FOODMAX, 
        "xp": XPMAX,
        "gem": GEMMAX,
        "talent": NATIONMAX,
        "potion": 4013,
    }
    let lowerInventoryType = {
        "weapon": 1001, 
        "artifact": 2001, 
        "food": 3001, 
        "xp": 4001,
        "gem": 5001,
        "talent": 6001,
        "potion": 4011,
    }
    let drawnItem = 0;
    while (true) {
        attempts++;
        if (attempts >= 10000) {
            throw new Error(`Error drawing item with properties [${itemType},${type}${itemClass ? `,${itemClass}` : ','}]. Please submit this bug in the feedback form`);
        }

        drawnItem = randomInteger(lowerInventoryType[itemType], upperInventoryType[itemType]);
        if (Inventory[drawnItem] == undefined) {continue}
        if (Inventory[drawnItem].Star < min || Inventory[drawnItem].Star > max) {continue}
        if (type === "shop") {
            return drawnItem;
        } else if (typeof type === 'string') {
            if (type.split("-")[0] === "adventure" || type === "Bonus" || type === "Bonus2") {
                if (itemClass === "Any") {
                    lootArray[type] = drawnItem;
                } else {
                    let checkedProperty = "Type";
                    if (itemType === "talent") {
                        checkedProperty = "nation";
                    } else if (itemType === "gem") {
                        checkedProperty = "element";
                    }

                    if (Array.isArray(itemClass)) {
                        let randomEle = rollArray(itemClass, 0);
                        if (Inventory[drawnItem][checkedProperty] != randomEle) {
                            continue;
                        }
                        lootArray[type] = drawnItem;
                    } else {
                        if (Inventory[drawnItem][checkedProperty] != itemClass) {
                            continue;
                        }
                        lootArray[type] = drawnItem;
                    }
                }
                return;
            } else if (type === "itemLoot") {
                let checkedProperty = "Type";
                if (Inventory[drawnItem][checkedProperty] != itemClass) {
                    continue;
                }
                return drawnItem;
            } 
        } else {
            return inventoryAdd(drawnItem);
        }
    }
}

// CREATING EXPEDITION UI
function createExpedition() {
    const advButtonFunction = () => {
        if (adventureType == 0) return;
        if (adventureType == "10-[]") {
            guildTable.toggle();
        } else if (adventureType.split("-")[0] === "12") {
            drawWorldQuest(adventureType);
        } else {
            adventure(adventureType);
        }
    }

    Expedition.createExpedition(advButtonFunction);
    let guildTable = createGuild();
    updateMorale("load");
}

function moraleCheck(currentATK) {
    if (advDict.morale > MORALE_THRESHOLD_1) { 
        currentATK *= 1.2;
    } else if (advDict.morale > MORALE_THRESHOLD_2) { 
        currentATK *= 1.1;
    } else if (advDict.morale > MORALE_THRESHOLD_3) { 
        currentATK *= 0.5;
    }
    return currentATK;
}

function updateMorale(type,amount) {
    let moraleEle = document.getElementById("char-morale");
    if (type == "add") {
        advDict.morale += amount;
        if (advDict.morale >= 100) {
            advDict.morale = 100;
        } else if (advDict.morale < 0) {
            advDict.morale = 0;
        }
    } else if (type == "recover") {
        if (advDict.morale < 60) {
            advDict.morale += amount;
        }
    }

    let happinessNumber = 4;
    let morale = advDict.morale;
    if (morale > MORALE_THRESHOLD_1) { happinessNumber = 1 } 
    else if (morale > MORALE_THRESHOLD_2) { happinessNumber = 2 } 
    else if (morale > MORALE_THRESHOLD_3) { happinessNumber = 3 }

    moraleEle.style.backgroundImage = `url(./assets/expedbg/morale-${happinessNumber}.webp)`;
    let text = moraleLore[happinessNumber-1];
    moraleEle.children[0].innerHTML = textReplacer({
        '[mor]':`(Morale: ${Math.round(morale)})`,
        "[s]":`<span style='color:#ffe5d2'>`,
        "[/s]":`</span>`,
    },text);
}

function createGuild() {
    let guildTable = document.createElement("div");
    guildTable.activeTable = 0;
    guildTable.id = "guild-table";
    guildTable.classList.add("flex-row","guild-table","cover-all");
    guildTable.style.display = "none";
    guildTable.toggle = function() {
        universalStyleCheck(this, "display", "flex", "none");
    }

    guildTable.close = function() {
        if (this.style.display == "flex") {
            this.style.display = "none";
        }
    }

    guildTable.open = function() {
        if (this.style.display == "none") {
            this.style.display = "flex";
        }
    }

    const bountyMenu = createDom("div");
    bountyMenu.classList.add("flex-row","bounty-menu");
    bountyMenu.id = "bounty-menu";
    buildBounty(bountyMenu);

    const rankMenu = document.createElement("div");
    rankMenu.classList.add("flex-column","rank-menu");
    const rankDiv = document.createElement("div");
    rankDiv.classList.add("flex-row","rank-div","blue-scrollbar");
    rankDiv.activeLevel;
    const rankLore = document.createElement("div");
    rankLore.classList.add("rank-lore");
    rankLore.innerText = `Select a level to get more information!`;
    const rankClaim = document.createElement("button");
    rankClaim.classList.add("flex-row");

    rankMenu.append(rankDiv,rankLore,rankClaim)
    for (let i = 1; i < 21; i++) {
        let rankButton = document.createElement("div");
        rankButton.classList.add("rank-button","flex-column", 'clickable');
        rankButton.id = `rank-button-${i}`;
        let rankText = document.createElement("p");
        let rankImg = createDom('img');
        rankImg.src = "./assets/expedbg/rankImg.webp";
        rankText.innerText = i;
        rankButton.append(rankImg,rankText);

        if (advDict.adventureRank < i && advDict.rankDict[i] === false) {
            let rankIco = createDom('img');
            rankIco.classList.add("rank-ico");
            rankIco.src = "./assets/icon/lock.webp";
            rankButton.append(rankIco);
        } else if (advDict.rankDict[i] === true) {
            let rankIco = createDom('img');
            rankIco.classList.add("rank-ico");
            rankIco.src = "./assets/icon/tick.webp";
            rankButton.append(rankIco);
        } else {
            advDict.rankDict[i] = "unclaimed";
            notifPop("add", "rank", i);
        }
        
        rankButton.addEventListener("click",()=>{
            rankLore.innerHTML = "";
            if (advInfo[i].Item.length > 0) {
                for (let j = 0; j < advInfo[i].Item.length; j++) {
                    let rankInventoryRewards = document.createElement("div");
                    rankInventoryRewards = inventoryFrame(rankInventoryRewards,Inventory[advInfo[i].Item[j]]);
                    rankLore.append(rankInventoryRewards);
                }
                rankLore.innerHTML += "<hr style='border-top: 0.2em solid #b9a47f;border-radius: 1em;margin-bottom: 2%;'>"
            }

            let loreHTML = advInfo[i].Desc.replace("[hp]",`<div style='height:1.4em;gap:1%;white-space: nowrap;' class='flex-row'>
                                                          +1 HP <img style="height: 100%;margin-right:10%" src=./assets/icon/health.webp> 
                                                          +6 ATK <img style='height: 100%;' src=./assets/icon/atkIndicator.webp></div>`
            );

            rankLore.innerHTML += textReplacer({
                "[s]":`<span style='color:#A97803'>`,
                "[/s]":`</span>`,
            },loreHTML);

            if (rankDiv.activeLevel != undefined) {rankDiv.activeLevel.classList.remove("active-rank")}
            rankClaim.buttonLevel = i;
            if (advDict.rankDict[i] === false) {
                rankClaim.innerText = "Locked";
                rankClaim.available = false;
                rankClaim.classList.add("rank-button-claimed");
                if (rankClaim.classList.contains("rank-button-available")) {rankClaim.classList.remove("rank-button-available")}
            } else if (advDict.rankDict[i] === true) {
                rankClaim.innerText = "Rank Claimed";
                rankClaim.available = false;
                rankClaim.classList.add("rank-button-claimed");
                if (rankClaim.classList.contains("rank-button-available")) {rankClaim.classList.remove("rank-button-available")}
            } else {
                rankClaim.innerText = "Claim Rank";
                rankClaim.available = true;
                rankClaim.classList.add("rank-button-available");
                if (rankClaim.classList.contains("rank-button-claimed")) {rankClaim.classList.remove("rank-button-claimed")}
            }

            rankButton.classList.add("active-rank");
            rankDiv.activeLevel = rankButton;
        })

        rankDiv.appendChild(rankButton);
    }

    rankDiv.children[0].click();
    rankClaim.addEventListener("click",()=>{
        if (rankClaim.available) {
            let level = rankClaim.buttonLevel;
            rankClaim.innerText = "Rank Claimed";
            rankClaim.available = false;
            rankClaim.classList.add("rank-button-claimed");
            if (rankClaim.classList.contains("rank-button-available")) {rankClaim.classList.remove("rank-button-available")}
            advDict.rankDict[level] = true;

            let itemArray = advInfo[level].Item;
            if (itemArray.length > 0) {
                for (let i = 0; i < itemArray.length; i++) {
                    inventoryAdd(itemArray[i]);
                }
                newPop(1);
                currencyPopUp([["items"]]);
            }
            sortList("table2");

            let rankButton = document.getElementById(`rank-button-${level}`);
            let rankIco = createDom('img');
            rankIco.classList.add("rank-ico");
            rankIco.src = "./assets/icon/tick.webp";
            rankButton.append(rankIco);
            notifPop("clear","rank",level);

            if (level === 9) {
                document.getElementById('commision-menu').removeBlock();
                setTimeout(() => {
                    drawUI.customTutorial('commission', 3, 'Commission Unlocked!');
                }, 3000);
            }
        }
    });

    const commissionBlock = createDom('p', { 
        classList: ['cover-all', 'flex-column'],
        id: 'commission-blocker',
        innerText: '[Locked. Come back later!]'
    });

    const commisionMenu = document.createElement("div");
    commisionMenu.id = 'commision-menu';
    commisionMenu.classList.add('commision-menu', 'flex-column');
    commisionMenu.notif = notifPop;
    
    if (advDict.rankDict[9] !== true) {
        commisionMenu.appendChild(commissionBlock);
    }

    commisionMenu.removeBlock = () => {
        if (commisionMenu.contains(commissionBlock)) {
            commisionMenu.removeChild(commissionBlock);
        }
    }

    Expedition.buildComm(commisionMenu, saveValues);

    const guildArray = [rankMenu, bountyMenu, commisionMenu];
    const buttonArray = ["Adventure Rank", "Bounties", "Commisions"];
    const notifPopArray = ['rank', 'bounty', 'comm'];
    guildTable.activeButton;

    for (let i = 0; i < 3 ; i++) {
        let menuButton = document.createElement("div");
        menuButton.id = `guild-button-${notifPopArray[i]}`
        menuButton.innerText = buttonArray[i];
        menuButton.classList.add("flex-column","guild-button");
        menuButton.addEventListener("click",() => {
            if (guildTable.activeTable) {guildArray[guildTable.activeTable - 1].style.display = "none"};
            guildArray[i].style.display = "flex";
            guildTable.activeTable = i + 1;

            if (guildTable.activeButton != undefined) {
                if (guildTable.activeButton.classList.contains("guild-selected")) {
                    guildTable.activeButton.classList.remove("guild-selected");
                }
            }
            menuButton.classList.add("guild-selected");
            guildTable.activeButton = menuButton;
        })
        guildTable.appendChild(menuButton)
    }

    for (let i = 0; i < 3; i++) {
        guildArray[i].style.display = "none";
        guildArray[i].classList.add("guild-menu");
        guildTable.appendChild(guildArray[i]);
    }
    table3.appendChild(guildTable);
    buildComm(commisionMenu);
    return guildTable;
}

function createFoodChar() {
    let noFood = true;
    const pickItems = createDom('div', {
        classList: ['notif-item', 'comm-div-img'],
    });

    InventoryMap = new Map([...InventoryMap.entries()].sort());
    InventoryMap.forEach((value, key) => {
        if (value > 0 && Inventory[key].Type === "Food") {
            noFood = false;
            const foodImg = createDom('div', {
                itemName: key,
                itemStar: Inventory[key].Star,
                id: `food-char-${key}`,
                src: `./assets/tooltips/inventory/${Inventory[key].File}.webp`,
                classList: ['comm-img'],
            });
            pickItems.appendChild(inventoryFrame(foodImg, Inventory[key]));
        }
    });
    return noFood ? null : pickItems;
}

function createCommChar() {
    let noCharacters = true;
    const pickItems = createDom('div', {
        classList: ['notif-item', 'comm-div-img'],
    });

    for (let key in upgradeDict) {
        if (upgradeDict[key].Purchased <= 0) continue;
        const heroName = upgradeInfo[key].Name;

        // ADD DIM FOR USED CHARACTERS
        if (commisionInfo[heroName] === undefined || saveValues.charDict[heroName].restEnd !== 0) continue;
        const heroImg = createDom('img', {
            itemName: heroName,
            src: `./assets/tooltips/hero/${heroName}.webp`,
            classList: ['comm-img'],
        });
        noCharacters = false;
        pickItems.appendChild(heroImg);
    }

    return noCharacters ? null : pickItems;
}

function buildComm(commisionMenu) {
    for (let i = 0; i < 3; i++) {
        const commItem = document.getElementById(`commission-${i}`);
        commItem.addEventListener('click', () => {
            if (saveValues.commDict[i].timeEnd === 0) {
                commisionMenu.activate(i, saveValues);
            } else if (saveValues.commDict[i].timeEnd - getTime() < 0) {
                commisionMenu.notif("clear", "comm", i);
                const commRewards = Expedition.generateCommRewards(saveValues, i, inventoryDraw, inventoryFrame, getTreeItems(), persistentValues);
                const lootItems = Array.from(commRewards.children[0].children);
                const addToLoot = () => {
                    lootItems.forEach((item) => {
                        const itemProp = item.itemName;
                        if (itemProp[0] === 'nuts') {
                            saveValues["realScore"] += itemProp[1];
                        } else if (itemProp[0] === 'primogem') {
                            currencyPopUp([["primogem", itemProp[1]]]);
                        } else if (itemProp[0] === 'tree') {
                            for (let i = 0; i < itemProp[1]; i++) {
                                addTreeCore(randomInteger(4, 6), 0);
                            }
                        } else {
                            for (let i = 0; i < itemProp[1]; i++) {
                                inventoryAdd(itemProp[0]);
                            }
                        }
                    });
                    newPop(1);
                    sortList("table2");
                    currencyPopUp([["items", 0]]);
                }
                
                choiceBox(mainBody, {text: 'Items obtained:'}, stopSpawnEvents, 
                          ()=>{ addToLoot() }, null, commRewards, ['notif-ele']
                );   
                if (!testing) saveData(true);

                saveValues.commDict[i].ele = rollArray(boxElement, 1);
                saveValues.commDict[i].nuts = 0;
                saveValues.commDict[i].timeEnd = 0;
                saveValues.commDict[i].char.forEach((char) => {
                    saveValues.charDict[char].currentComm = ``;
                    saveValues.charDict[char].restEnd = 0;
                });
                saveValues.commDict[i].char.length = 0;

                document.getElementById(`commission-${i}`).updatePic(saveValues.commDict[i], 0);
                return;
            }
        });
    }

    const noChar = createDom('img', { classList: ['no-char'], src: './assets/expedbg/exped-Nahida-loss.webp' });
    const commChar = document.getElementById(`commission-select-char`);
    commChar.addEventListener('click', () => {
        const pickItems = createCommChar();
        let maxChar = 1;
        advDict.rankDict[19] === true ? maxChar++ : void(0);
        advDict.rankDict[17] === true ? maxChar++ : void(0);
        advDict.rankDict[13] === true ? maxChar++ : void(0);

        if (pickItems === null) {
            choiceBox(mainBody, {text: 'There are no available Sumeru characters!'}, stopSpawnEvents, ()=>{}, null, noChar, ['notif-ele']);
        } else {
            choiceMax(mainBody, {text: `Pick (max ${maxChar}) characters:`}, stopSpawnEvents, 
                      (res) => { commisionMenu.addChar(res) }, () => {}, pickItems, 
                      ['notif-ele', 'pick-items', 'choice-ele'], false, maxChar);
        }
    });

    const commFood = document.getElementById(`commission-select-food`);
    commFood.addEventListener('click', () => {
        const pickItems = createFoodChar();
        let maxChar = 1;
        advDict.rankDict[19] === true ? maxChar++ : void(0);
        advDict.rankDict[17] === true ? maxChar++ : void(0);
        advDict.rankDict[13] === true ? maxChar++ : void(0);

        maxChar += maxChar * persistentValues.blackMarketDict.stove.level;

        if (pickItems === null) {
            choiceBox(mainBody, {text: 'There is no available food!'}, stopSpawnEvents, ()=>{}, null, noChar, ['notif-ele']);
        } else {
            choiceMax(mainBody, {text: `Pick (max ${maxChar}) food items:`}, stopSpawnEvents, 
                      (res) => { commisionMenu.addFood(res) }, () => {}, pickItems, 
                      ['notif-ele', 'pick-items', 'choice-ele'], false, maxChar);
        }
    });

    const commConfirm = document.getElementById('commission-confirm');
    commConfirm.addEventListener('click', () => {
        const res = commisionMenu.confirmAdd();
        if (res != null) {
            let cancelConfirm = false;
            const charAdd = Array.from(res[0]);
            const foodAdd = Array.from(res[1]);

            foodAdd.forEach((food) => {
                if (InventoryMap.get(food.itemName) <= 0) {
                    choiceBox(mainBody, {text: `Food "${Inventory[food.itemName].Name}" is missing!`}, null, 
                                        () => {}, null, null, ['choice-ele']);
                    cancelConfirm = true;
                }
            });

            charAdd.forEach((char) => {
                if (saveValues.charDict[char.itemName].currentComm !== '') {
                    choiceBox(mainBody, {text: `"${char.itemName}" is not available!`}, null, 
                                     () => {}, null, null, ['choice-ele']);
                    cancelConfirm = true;
                }
            });

            if (cancelConfirm) return;
            const commissionNum = commisionMenu.currentComm;
            commisionMenu.clearAdd();
            document.getElementById('commission-back').click();

            const commTime = getTime() + commisionMenu.calculateHour(foodAdd, charAdd.length) * 60;
            foodAdd.forEach(food => reduceItem(food.itemName));
            charAdd.forEach((char) => {
                saveValues.charDict[char.itemName].currentComm = `comm-${commissionNum + 1}`;
                saveValues.charDict[char.itemName].restEnd = commTime;
            });

            saveValues.commDict[commissionNum].nuts = saveValues.dps;
            saveValues.commDict[commissionNum].timeStart = getTime();
            saveValues.commDict[commissionNum].timeEnd = commTime;
            saveValues.commDict[commissionNum].char = charAdd.map((char) => char.itemName);
            document.getElementById(`commission-${commissionNum}`)
                    .updatePic(saveValues.commDict[commissionNum], commisionMenu.calculateHour(foodAdd, charAdd.length));
        }
    })
}

function buildBounty(bountyMenu) {
    while (bountyMenu.firstChild) {
        bountyMenu.removeChild(bountyMenu.lastChild);
    }
    
    let timeLeft;
    if (advDict.bountyTime == 0) {
        advDict.bountyTime = getTime();
        timeLeft = BOUNTYCOOLDOWN;
        resetBounty(bountyMenu,"create");
    } else {
        timeLeft = Math.round(BOUNTYCOOLDOWN - (getTime() - advDict.bountyTime));
        if (timeLeft <= 0) {
            resetBounty(bountyMenu,"create");
            timeLeft = BOUNTYCOOLDOWN;
            advDict.bountyTime = getTime();
        } else {
            resetBounty(bountyMenu,"load");
        }
    }

    let bountyTimer = document.createElement("p");
    bountyTimer.classList.add("flex-column");
    bountyTimer.innerText = `Bounty board resets in ${timeLeft} minutes`;
    bountyTimer.id = "bounty-time";
    bountyMenu.prepend(bountyTimer);
}

function checkTimerBounty() {
    let timeLeft = Math.round(BOUNTYCOOLDOWN - (getTime() - advDict.bountyTime));
    if (timeLeft <= 0) {
        let bountyMenu = document.getElementById("bounty-menu");
        while (bountyMenu.firstChild) {
            bountyMenu.removeChild(bountyMenu.lastChild);
        }
        resetBounty(bountyMenu,"create");
        timeLeft = BOUNTYCOOLDOWN;
        advDict.bountyTime = getTime();

        let bountyTimer = document.createElement("p");
        bountyTimer.classList.add("flex-column");
        bountyTimer.innerText = `Bounty board resets in ${timeLeft} minutes`;
        bountyTimer.id = "bounty-time";
        bountyMenu.prepend(bountyTimer);
    } else {
        let bountyTimer = document.getElementById("bounty-time");
        bountyTimer.innerText = `Bounty board resets in ${timeLeft} minutes`;
    }
}

function resetBounty(bountyMenu,type) {
    if (type == "load") {
        bountyObject = {};
        bountyObject = advDict.bounty;
        for (let i = 1; i < 7; i++) {
            let bountyButton = document.createElement("div");
            bountyButton.classList.add("flex-column","bounty-button");
            let bountyStar = document.createElement("div");
            bountyStar.classList.add("flex-row");
            for (let j = 0; j < i; j++) {
                let starImg = createDom('img');
                starImg.src = "./assets/expedbg/bountyStar.webp";
                bountyStar.appendChild(starImg);
            }

            let bountyImg = document.createElement("img");
            let path;
            for (let key in bountyObject) {
                if (bountyObject[key].Level == i) {
                    bountyImg.src = `./assets/expedbg/enemy/${key}.webp`;
                    path = key;
                    break;
                }
            }

            bountyButton.id = `bounty-${path}`;
            bountyButton.append(bountyStar,bountyImg);
            bountyMenu.appendChild(bountyButton);
            if (bountyObject[path].Completed == true) {
                bountyImg.style.filter = "grayscale(0.9) brightness(0.1)";
                completeBounty(path,"load",bountyButton);
            } else if (bountyObject[path].Completed == "claimed") {
                bountyImg.style.filter = "grayscale(0.9) brightness(0.1)";
                let markImg = createDom('img');
                markImg.src = "./assets/expedbg/bountyDone.webp"
                bountyButton.appendChild(markImg);
                bountyButton.style.backgroundColor = "rgb(152 132 91)";
            }
        }
    } else if (type == "create") {
        notifPop("clearAll","bounty");
        let bountyDict = enemyInfo.bountyKey;
        bountyObject = {};
        for (let i = 1; i < 7; i++) {
            let bountyButton = document.createElement("div");
            bountyButton.classList.add("flex-column","bounty-button");

            let bountyStar = document.createElement("div");
            bountyStar.classList.add("flex-row");
            for (let j = 0; j < i; j++) {
                let starImg = createDom('img');
                starImg.src = "./assets/expedbg/bountyStar.webp";
                bountyStar.appendChild(starImg);
            }

            let bountyImg = document.createElement("img");
            let randomEnemy = rollArray(bountyDict[i-1],0);
            let bountyPath;
    
            do {
                bountyPath = `${randomEnemy.split(".")[0]}-${randomInteger(1, parseInt(randomEnemy.split(".")[1]) + 1)}`;
            } while (
                bountyObject.hasOwnProperty(bountyPath)
            );
    
            bountyObject[bountyPath] = {primoReward: (25 * (2**i)), xpReward: (10 * (i**2)), Completed: false, Level: i};
            bountyImg.src = `./assets/expedbg/enemy/${bountyPath}.webp`;
            bountyButton.id = `bounty-${bountyPath}`;
            bountyButton.append(bountyStar,bountyImg);
            bountyMenu.appendChild(bountyButton);
        }
        advDict.bounty = bountyObject;
    }
}

function completeBounty(bountyID,type,ele) {
    let button;
    if (type == "load") {
        button = ele;
    } else {
        if (bountyObject[bountyID].Completed == "claimed") {return}
        if (bountyObject[bountyID].Completed != true) {
            button = document.getElementById(`bounty-${bountyID}`);
            bountyObject[bountyID].Completed = true;
       }
    }

    if (button == undefined) {return}
    let img = button.children[1];
    img.style.filter = "grayscale(0.9) brightness(0.1)";
    button.style.backgroundColor =  "rgb(152 132 91)";
    notifPop("add","bounty",bountyID);
    
    let claim = document.createElement("button");
    claim.innerText = "Claim Reward";
    claim.primoReward = bountyObject[bountyID].primoReward;
    claim.xpReward = bountyObject[bountyID].xpReward;

    if (advDict.rankDict[11] === true) {
        claim.xpReward *= 1.50;
        claim.primoReward *= 1.50;
    } else if (advDict.rankDict[3] === true) {
        claim.xpReward *= 1.25;
        claim.primoReward *= 1.25;
    }

    claim.addEventListener("click",()=>{
        notifPop("clear","bounty",bountyID);
        currencyPopUp([["primogem", Math.round(claim.primoReward)]]);
        gainXP(Math.round(claim.xpReward));
        bountyObject[bountyID].Completed = "claimed";
        claim.remove();

        let markImg = createDom('img');
        markImg.src = "./assets/expedbg/bountyDone.webp"
        button.appendChild(markImg);

        for (let key in advDict.bounty) {
            if (advDict.bounty[key].Completed !== true) {return}
        }
        challengeNotification(({category: 'specific', value: [1, 7]}));
    })

    button.appendChild(claim);
}

function clearExped() {
    let guildTable = document.getElementById("guild-table");
    guildTable.close();

    if (adventureType != 0) {
        let id = "exped-" + adventureType;
        let old_exped = document.getElementById(id);
        if (old_exped && old_exped.classList.contains("expedition-selected")) {
            old_exped.classList.remove("expedition-selected");
        }

        adventureType = 0;
        Expedition.expedInfo("exped-7", expeditionDict, saveValues, persistentValues);
        let advButton = document.getElementById("adventure-button");
        if (advButton.classList.contains("expedition-selected")) {
            advButton.classList.remove("expedition-selected");
        }
    }
}

//------------------------------------------------ ADVENTURE & FIGHTS ----------------------------------------------------------//
function createExpMap() {
    let advImageDiv = document.createElement("div");
    advImageDiv.classList.add("adventure-map");
    advImageDiv.id = "adventure-map";
    advImageDiv.style.zIndex = -1;
    let advImage = document.createElement("div");
    advImage.id = "sumeru-map";

    let expedXP = document.createElement("div");
    expedXP.classList.add("flex-column","exped-xpbar");
    let expedXPBar = document.createElement("div");
    expedXPBar.id = "exped-xp-bar"
    expedXPBar.maxXP = advDict.adventureRank * 100;
    expedXPBar.currentXP = advDict.advXP;
    expedXPBar.style.width = `${Math.round((advDict.advXP / expedXPBar.maxXP)*100)}%`;
    expedXPBar.classList.add("xpbar-bar","cover-all");

    let expedXPInfo = document.createElement("p");
    expedXPInfo.id = "exped-xp";
    expedXPInfo.innerText = `Rank ${advDict.adventureRank} (${advDict.advXP}/${expedXPBar.maxXP} XP)`;
    if (advDict.adventureRank >= 20) {
        expedXPInfo.innerText = "Rank 20 (MAX)";
        expedXPBar.maxXP = 1e20;
        expedXPBar.style.width = "100%";
    }
    expedXPInfo.classList.add("flex-row");
    expedXP.append(expedXPBar,expedXPInfo);

    let expedMesgDiv = document.createElement("div");
    expedMesgDiv.classList.add("flex-column","exped-mesg-div");
    expedMesgDiv.id = "exped-mesg-div";

    let charSelect = document.createElement("div");
    charSelect.id = "char-selected";
    charSelect.innerText = "Select Party Leader";
    charSelect.classList.add("flex-row","char-select");
    charSelect.currentHero = 0;
    charSelect.addEventListener("click",()=>{
        if (charMenu.style.display === "none") {
            notifPop("clearAll","char");
            charMenu.style.display = "flex";
        } else {
            charMenu.style.display = "none";
        }
    })

    let notifSelect = document.createElement("div");
    notifSelect.id = "notif-selected";
    notifSelect.bountyArray = [];
    notifSelect.rankArray = [];
    notifSelect.charArray = [];
    notifSelect.questArray = [];
    notifSelect.commArray = [];
    notifSelect.bossArray = [];
    notifSelect.skirmishArray = [];
    notifSelect.classList.add("flex-column","notif-select");
    
    let charMenu = document.createElement("div");
    let activeChar;
    charMenu.classList.add("flex-column","char-menu");
    charMenu.style.display = "none";
    for (let k = 0; k < (CONSTANTS.MAX_LEADER + 1); k++) {
        let charImg = createDom('img');
        charImg.src = `./assets/expedbg/leader-${k}.webp`;
        let charLore = document.createElement("p");
        charLore.classList.add("flex-column");
        charLore.innerText = `${charLoreObj[k].Name} \n ${charLoreObj[k].Desc}`;

        let charDiv = document.createElement("div");
        charDiv.id = `char-select-${k}`;
        charDiv.classList.add("flex-row");
        charDiv.locked = false;

        if (k > 1) {
            if (upgradeDict[upgradeThreshold[k]].Purchased <= 0) {
                charDiv.locked = true;
                charLore.innerText = `???`;
                charImg.src = `./assets/expedbg/leader-none.webp`;
            }
        }
    
        charDiv.addEventListener("click",() => {
            if (!charDiv.locked) {
                charSelect.innerText = "";
                charSelect.style.backgroundImage = `url(./assets/expedbg/leader-${k}.webp)`;

                activeLeader = charLoreObj[k].Name;
                if (activeChar) {activeChar.classList.remove("char-selected");}
                charDiv.classList.add("char-selected");
                activeChar = charDiv;
            }
        })
        charDiv.append(charImg,charLore);
        charMenu.append(charDiv);
    }

    let dragIcon = createDom('img');
    dragIcon.classList.add("drag-icon");
    dragIcon.src = "./assets/expedbg/reset.webp";

    let mapZoom = document.createElement("div");
    mapZoom.classList.add('flex-column')
    mapZoom.id = "zoom-scroller"

    let mapZoomIn = document.createElement("button");
    mapZoomIn.innerText = '+';
    mapZoomIn.classList.add('flex-column');
    let mapZoomOut = document.createElement("button");
    mapZoomOut.innerText = '-';
    mapZoomOut.classList.add('flex-column');
    mapZoom.append(mapZoomIn,mapZoomOut);

    if (isNaN(settingsValues.defaultZoom)) {settingsValues.defaultZoom = 0}
    mapZoom.value = settingsValues.defaultZoom;

    advImageDiv.append(advImage,dragIcon,charSelect,notifSelect,expedMesgDiv,charMenu,expedXP,mapZoom);
    leftDiv.appendChild(advImageDiv);

    let mapInstance = Panzoom(advImage, {
        canvas: true,
        zoomSpeed: 1,
    })

    let zoomValue = 0.3 + (2/100) * settingsValues.defaultZoom;
    mapInstance.zoom(zoomValue);

    let img = createDom('img');
    img.src = "./assets/expedbg/adventureMap.webp";
    img.onload = function() {
        advImage.style.width = "unset";
        advImage.style.height = this.naturalHeight  + "px";
        advImage.style.aspectRatio = `${this.naturalWidth / this.naturalHeight}`;
        advImage.classList.add('adventure-image');
    }

    for (let key in imgKey) {
        if (key > 17) {break}
        spawnKey(advImage,imgKey,key);
    }

    const changeZoom = () => {
        zoomValue = 0.2 + (2/100) * settingsValues.defaultZoom;
        mapInstance.zoom(zoomValue);

        const mapPins = advImage.childNodes;
        for (let i = 0; i < mapPins.length; i++) {
            const mapPin = mapPins[i];
            mapPin.style.transform = `scale(${Math.min(1 / zoomValue * (MOBILE ? 0.75 : 1), 4)})`;
        }
    }

    mapZoomIn.addEventListener('click',()=>{
        settingsValues.defaultZoom += 10;
        if (settingsValues.defaultZoom >= 100) {
            settingsValues.defaultZoom = 100
        }
        changeZoom();
    })

    mapZoomOut.addEventListener('click',()=>{
        settingsValues.defaultZoom -= 10;
        if (settingsValues.defaultZoom <= 0) {
            settingsValues.defaultZoom = 1
        }
        changeZoom();
    })

    changeZoom();

    dragIcon.addEventListener("click",()=>{
        mapInstance.reset();
        mapInstance.zoom(zoomValue);
    })
}

function gainXP(xpAmount, multiplier) {
    if (xpAmount == "variable") {
        if (advDict.adventureRank > 15) {
            xpAmount = 55;
        } else if (advDict.adventureRank > 10) {
            xpAmount = 35;
        } else if (advDict.adventureRank > 5) {
            xpAmount = 20;
        } else {
            xpAmount = 10;
        }
    }

    if (multiplier > 1) {
        xpAmount *= multiplier;
    }

    xpAmount = (xpAmount * randomInteger(98,103) / 100);
    xpAmount = moraleCheck(xpAmount);
    xpAmount = Math.round(xpAmount);

    let xpBar = document.getElementById('exped-xp-bar');
    xpBar.maxXP = advDict.adventureRank * 100;
    xpBar.currentXP = parseInt(xpBar.currentXP);
    xpBar.currentXP += xpAmount;
    expedPop("xp", xpAmount);

    while (xpBar.currentXP >= xpBar.maxXP) {
        xpBar.currentXP -= xpBar.maxXP;
        advDict.advXP = xpBar.currentXP;
    
        if (advDict.adventureRank >= 20) {
            advDict.adventureRank = 20;
            break;
        }
    
        advDict.adventureRank++;
        advDict.rankDict[advDict.adventureRank] = "unclaimed";
        let rankButton = document.getElementById(`rank-button-${advDict.adventureRank}`);
        rankButton.lastChild.remove();
        notifPop("add", "rank", advDict.adventureRank);
    
        xpBar.maxXP = advDict.adventureRank * 100;
        xpBar.style.width = `${Math.round((advDict.advXP / xpBar.maxXP) * 100)}%`;
    }
    
    advDict.advXP = xpBar.currentXP;
    xpBar.style.width = `${Math.round((advDict.advXP / xpBar.maxXP) * 100)}%`;

    let expedXPInfo = document.getElementById('exped-xp');
    expedXPInfo.innerText = `Level ${advDict.adventureRank} (${advDict.advXP}/${xpBar.maxXP} XP)`;
    if (advDict.adventureRank >= 20) {
        advDict.adventureRank = 20;
        expedXPInfo.innerText = "Level 20 (MAX)";
        challengeNotification(({category: 'specific', value: [1, 3]}));

        xpBar.maxXP = 1e20;
        xpBar.style.width = "100%";
        xpBar.currentXP = 0;
        advDict.advXP = xpBar.currentXP;

        if (convertXPPrimo > 0 && xpAmount * convertXPPrimo > 1) {
            currencyPopUp([["primogem", Math.round(xpAmount * convertXPPrimo)]]);
        }
    }
}

function expedPop(type,text) {
    let expedMesg = document.getElementById('exped-mesg-div');
    let mesgPop = document.createElement("p");
    mesgPop.classList.add('flex-row');
    mesgPop.style.animation = 'pop-up-animation 0.5s ease-in-out';

    if (type == "xp") {
        mesgPop.innerText = `+${text} XP`;
    }
    
    mesgPop.addEventListener("animationend",()=>{
        setTimeout(function() {
            mesgPop.remove();
        }, 4000);
    })
    expedMesg.appendChild(mesgPop);
}

function notifPop(type,icon,count) {
    let notifSelect = document.getElementById('notif-selected');
    if (type == "add") {
        const guildButton = ['comm', 'bounty', 'rank'];
        let notifDiv = document.createElement("div");
        notifDiv.classList.add("flex-column");
        notifDiv.id = `${icon}-notif`;

        if (document.getElementById(notifDiv.id)) {return};

        let notifContainer = document.createElement("div");
        notifContainer.classList.add("flex-row","notif-div");
        notifContainer.id = `notif-${icon}-div`
        let notifImg = createDom('img');
        let notifText = document.createElement("p");

        if (icon === "bounty") {
            notifImg.src = "./assets/icon/bountyComplete.webp";
            notifText.innerText = "Bounty Rewards";
            notifSelect.bountyArray.push(count);
        } else if (icon === "rank") {
            notifImg.src = "./assets/icon/advRank.webp";
            notifText.innerText = "Adv. Rank \n Rewards";
            notifSelect.rankArray.push(count);
        } else if (icon === "char") {
            notifImg.src = "./assets/icon/newChar.webp";
            notifText.innerText = "New Leader \n Unlocked";
            notifSelect.charArray.push(count);
        } else if (icon === "quest") {
            notifImg.src = "./assets/expedbg/adv-12.webp";
            notifText.innerText = "World Quest \n Available";
            notifSelect.questArray.push(count);
        } else if (icon === "comm") {
            notifImg.src = "./assets/icon/comm.webp";
            notifText.innerText = "Commission \n Complete";
            notifSelect.commArray.push(count);
        } else if (icon === "boss") {
            notifImg.src = "./assets/expedbg/adv-14.webp";
            notifText.innerText = "Boss \n Battle";
            notifSelect.bossArray.push(count);
        } else if (icon === "skirmish") {
            notifImg.src = "./assets/expedbg/adv-13.webp";
            notifText.innerText = "Skirmish \n Battle";
            notifSelect.skirmishArray.push(count);
        }

        if (guildButton.includes(icon)) {
            notifDiv.addEventListener('click',()=>{
                if (!activeLeader) {
                    let advButton = document.getElementById("adventure-button");
                    adventureType = 0;
                    advButton.key = 0;
                    Expedition.expedInfo("exped-11", expeditionDict, saveValues, persistentValues);
                    if (advButton.classList.contains("expedition-selected")) {
                        advButton.classList.remove("expedition-selected");
                    }
                } else {
                    let guildTable = document.getElementById("guild-table");
                    guildTable.open();
                    document.getElementById(`guild-button-${icon}`).click();
                }
            })
        }
        
        notifContainer.append(notifText,notifImg)
        notifDiv.append(notifContainer);
        notifSelect.append(notifDiv);
    } else if (type === "clear") {
        let array = `${icon}Array`;
        let eleId = `${icon}-notif`;
        let index = notifSelect[array].indexOf(count);

        notifSelect[array].splice(index, 1);
        if (notifSelect[array].length <= 0) {
            let ele = document.getElementById(eleId);
            if(ele) {ele.remove()};
        }
    } else if (type == "clearAll") {
        let array = `${icon}Array`;
        let eleId = `${icon}-notif`;

        notifSelect[array] = [];
        let ele = document.getElementById(eleId);
        if (ele) {ele.remove()};
    }
}

function charScan() {
    for (let i = 2; i < (CONSTANTS.MAX_LEADER + 1); i++) {
        let charDiv = document.getElementById(`char-select-${i}`);
        if (charDiv.locked) {
            if (upgradeDict[upgradeThreshold[i]].Purchased > 0) {
                notifPop("add","char",upgradeThreshold[i]);
                charDiv.locked = false;
                charDiv.children[0].src = `./assets/expedbg/leader-${i}.webp`;
                charDiv.children[1].innerText = `${charLoreObj[i].Name} \n ${charLoreObj[i].Desc}`;
                break;
            }
        }
    }
}

// UNLOCKS EXPEDITION (REQUIRES PASSING OF EXPEDITION DICT AS WELL)
function unlockExpedition(i,expeditionDict) {
    expeditionDict[i] = '0';
    let advButtonDiv = document.getElementById("adventure-map").children[0];
    for (let j = 0; j < advButtonDiv.children.length; j++) {
        let button = advButtonDiv.children[j];

        if (advButtonDiv.children[j].style.zIndex == -1) {
            if (button.level == i) {
                button.style.zIndex = 6; 
                button.locked = false;
                button.addEventListener("click",()=>{
                    if (adventureType == `${button.level}-[${button.wave}]`) {
                        adventureType = 0;
                        Expedition.expedInfo("exped-7", expeditionDict, saveValues, persistentValues);
                        let advButton = document.getElementById("adventure-button");
                        if (advButton.classList.contains("expedition-selected")) {
                            advButton.classList.remove("expedition-selected");
                        }
                    } else {
                        clearExped();
                        adventureType = `${button.level}-[${button.wave}]`;
                        Expedition.expedInfo(`exped-${button.level}-${j+1}`, expeditionDict, saveValues, persistentValues);
                    }  
                })
            }
        }
    }
}

function spawnKey(advImage, imgKey, key, type = 'normal') {
    let button = createDom('button', {
        class: ['adv-image-btn'],
        style: {
            left: imgKey[key].Left + "%",
            top: imgKey[key].Top + "%",
        },
        id: `adv-button-${key}`,
        level: imgKey[key].Level,
        
    });

    button.wave = imgKey[key].Wave;
    if (type === 'worldQuest') {
        button.id = "world-quest-button";
        button.style.transform = `scale(${1 / (0.2 + (2/100) * settingsValues.defaultZoom) * (MOBILE ? 1.5 : 1)})`;
    } else if (type === 'skirmish') {
        button.id = "skirmish-button";
        button.style.transform = `scale(${1 / (0.2 + (2/100) * settingsValues.defaultZoom) * (MOBILE ? 1.5 : 1)})`;
    } else if (type === 'boss') {
        button.style.transform = `scale(${1 / (0.2 + (2/100) * settingsValues.defaultZoom) * (MOBILE ? 1.5 : 1)})`;
    }

    let level = imgKey[key].Level;
    let wave = imgKey[key].Wave;
    button.style.backgroundImage = `url(./assets/expedbg/adv-${level}.webp)`;
    button.locked = false;

    if (expeditionDict[button.level] == 1 && level != 12) {
        button.style.zIndex = -1;
        button.locked = true;
    } else {
        button.addEventListener("click",()=>{
            let advButton = document.getElementById("adventure-button");
            if (!activeLeader) {
                adventureType = 0;
                advButton.key = 0;
                Expedition.expedInfo("exped-11", expeditionDict, saveValues, persistentValues);
                if (advButton.classList.contains("expedition-selected")) {
                    advButton.classList.remove("expedition-selected");
                }
            } else if (adventureType == `${level}-[${wave}]`) {
                adventureType = 0;
                advButton.key = 0;
                clearExped();
                Expedition.expedInfo("exped-7", expeditionDict, saveValues, persistentValues);
                if (advButton.classList.contains("expedition-selected")) {
                    advButton.classList.remove("expedition-selected");
                }
            } else {
                clearExped();
                adventureType = `${level}-[${wave}]`;
                advButton.key = key;
                Expedition.expedInfo(`exped-${level}-${key}`, expeditionDict, saveValues, persistentValues);
            }  
        })
    }
    advImage.appendChild(button);
    return advImage;
}

function spawnWorldQuest() {
    if (document.getElementById("world-quest-button")) {
        document.getElementById("world-quest-button").remove();
        notifPop("clearAll","quest");
    }

    let rollQuest = randomInteger(18, 26);
    let mapImage = document.getElementById('sumeru-map');
    spawnKey(mapImage, imgKey, rollQuest, 'worldQuest');
    notifPop("add", "quest", 1);
    sidePop('/expedbg/adv-12.webp', 'New World Quest');
}

function spawnSkirmish() {
    if (document.getElementById("skirmish-button")) {
        document.getElementById("skirmish-button").remove();
        notifPop("clearAll","skirmish");
    }

    let rollQuest = 28;
    let mapImage = document.getElementById('sumeru-map');
    spawnKey(mapImage, imgKey, rollQuest, 'skirmish');
    notifPop("add", "skirmish", 1);
    sidePop('/expedbg/adv-13.webp', 'Skirmish Quest');
}

function spawnBossQuest(num) {
    const val = 30 + num;
    if (document.getElementById(`adv-button-${val}`)) {
        return;
    } else {
        let mapImage = document.getElementById('sumeru-map');
        spawnKey(mapImage, imgKey, val, "boss");
        notifPop("add", "boss", val);
        sidePop('/expedbg/adv-14.webp', 'Boss Quest');
    }
}

function drawWorldQuest(advType) {
    let adventureChoiceOne = document.getElementById("adv-button-one");
    adventureChoiceOne.switchWorldQuest(advType.split("-")[0]);

    advType = advType.split("-")[1];
    advType = JSON.parse(advType).map(Number);
    let questId = rollArray(advType, 0);

    //TODO: FIX SHOP
    while (questId === 22 || questId === 6) {
        questId = rollArray(advType, 0);
    }

    let adventureVideo = document.getElementById("adventure-video");
    adventureVideo.style.backgroundImage = `url(./assets/expedbg/choice/${questId}-1.webp`;

    let adventureArea = document.getElementById("adventure-area");
    let adventureTextBox = document.getElementById("adventure-text");
    adventureTextBox.questNumber = questId;
    let adventureRewards = document.getElementById("adventure-rewards");
    adventureRewards.style.opacity = "0";
    adventureRewards.style.flexGrow = "0";
    
    let adventureHeading = document.getElementById("adventure-header");
    adventureHeading.style.flexGrow = "1";
    adventureHeading.style.overflowY = "auto";

    let preloadedImage = createDom('img');
    preloadedImage.src = `./assets/expedbg/choice/${questId}-1.webp`;
    preloadedImage.onload = ()=> {
        adventureArea.style.display = 'flex';
        adventureTextBox.style.animation = "flipIn 1s ease-in-out forwards";
        adventureTextBox.addEventListener("animationend",textFadeIn,true);
    }
    
    function textFadeIn() {
        let sceneDict = sceneInfo[questId];

        adventureHeading.style.top = "10%";
        adventureHeading.style.animation = "fadeOut 0.8s ease-out reverse";
        adventureChoiceOne.maxScene = sceneDict.Scenes;
        adventureChoiceOne.currentScene = 1;
        adventureChoiceOne.pressAllowed = true;

        let text = sceneDict.Lore[0];
        adventureHeading.innerHTML = textReplacer({
            "[s]":`<span style='color:#A97803'>`,
            "[/s]":`</span>`,
        },text)

        adventureTextBox.style.animation = "";
        adventureTextBox.removeEventListener("animationend", textFadeIn, true);
    }
}

function continueQuest(advType) {
    const adventureChoiceOne = document.getElementById('adv-button-one');

    let infoDict = sceneInfo[advType].Lore;
    let adventureVideo = document.getElementById("adventure-video");
    adventureVideo.style.backgroundImage = `url(./assets/expedbg/choice/${advType}-${adventureChoiceOne.currentScene + 1}.webp`;

    let adventureHeading = document.getElementById("adventure-header");
    adventureHeading.innerHTML = textReplacer({
        "[s]":`<span style='color:#A97803'>`,
        "[/s]":`</span>`,
    }, infoDict[adventureChoiceOne.currentScene]);

    adventureChoiceOne.currentScene++;
}

function finishQuest(advType) {
    const adventureChoiceOne = document.getElementById('adv-button-one');
    adventureChoiceOne.currentScene = 'Finale';

    let infoDict = sceneInfo[advType];
    if (infoDict.Type === "LuckCheck") {
        let rollChance = randomInteger(1,101) + luckRate;
        let rollOutcome;
        if (rollChance > 50) {
            rollOutcome = "Success";
        } else {
            rollOutcome = "Fail";
        }

        let res = () => {
            if (rollOutcome === "Fail") {
                saveValues.energy -= 100;
                saveValues.energy = Math.max(saveValues.energy, 0);
            } else {
                gainXP("variable", 2);
                if (worldQuestDict.currentWorldQuest === "15_B") {
                    challengeNotification(({category: 'specific', value: [0,5]}))
                }
            }
        }
       
        let adventureVideo = document.getElementById("adventure-video");
        adventureVideo.style.backgroundImage = `url(./assets/expedbg/choice/${advType}-${rollOutcome}.webp`;

        let adventureHeading = document.getElementById("adventure-header");
        adventureHeading.innerHTML = textReplacer({
            "[s]":`<span style='color:#A97803'>`,
            "[/s]":`</span>`,
        }, infoDict[rollOutcome === "Fail" ? 'FailLore' : 'SuccessLore']);

        adventureChoiceOne.addEventListener('click', () => {quitQuest(res)}, { once: true });
    } else if (infoDict.Type === "Meeting") {
        updateMorale("add", randomInteger(6,10));
        quitQuest();
        gainXP("variable");
    } else if (infoDict.Type === "Exploration") {
        quitQuest();
        gainXP("variable");
        if (advType === 17 || advType === 3) {
            let energyRoll = randomInteger(750, 1550);
            saveValues.energy += energyRoll;
            persistentValues.lifetimeEnergyValue += energyRoll;

            challengeNotification(({category: 'energy', value: saveValues.energy}))
            currencyPopUp([["energy", energyRoll]]);
        }
    } else if (infoDict.Type === "Treasure") {
        quitQuest();
        if (advType === 10) {
            genericItemLoot();

            currencyPopUp([["items", 0]]);
            newPop(1);
            sortList("table2");
        } else if (advType === 7 || advType === 9) {
            inventoryDraw("food", 2, 4);
            inventoryDraw("food", 2, 4);

            currencyPopUp([["items", 0]]);
            newPop(1);
            sortList("table2");
        }
    } else if (infoDict.Type === "Trade") {
        let adventureHeading = document.getElementById("adventure-header");
        let adventureVideo = document.getElementById("adventure-video")
        adventureVideo.classList.add("transcend-dark");

        let inventoryOffer = document.createElement("div");
        inventoryOffer.id = "inventory-offer";
        inventoryOffer.offer = null;
        let offerCurrency = document.createElement("p");
        offerCurrency.value = 0;
        offerCurrency.id = "offer-amount";

        let acceptButton = createDom('img');
        acceptButton.src = "./assets/icon/thumbsUp.webp";
        acceptButton.classList.add("dim-filter");
        let rejectButton = createDom('img');
        rejectButton.classList.add("dim-filter");
        rejectButton.src = "./assets/icon/thumbsDown.webp";

        acceptButton.addEventListener("click",() => {
            if (saveValues.primogem > offerCurrency.value) {
                inventoryOffer.offer = true;
                adventureHeading.innerHTML = "You are accepting the trade. <br><br>Click 'Next' to confirm.";
                if (acceptButton.classList.contains("dim-filter")) {acceptButton.classList.remove("dim-filter")}
                if (!rejectButton.classList.contains("dim-filter")) {rejectButton.classList.add("dim-filter")}
            } else {
                adventureHeading.innerHTML = "You do not have enough primogems for the trade.";
                weaselDecoy.load();
                weaselDecoy.play();
            }
        });

        rejectButton.addEventListener("click",()=>{
            inventoryOffer.offer = false;
            adventureHeading.innerHTML = "You are rejecting the trade. <br><br>Click 'Next' to confirm.";
            if (!acceptButton.classList.contains("dim-filter")) {acceptButton.classList.add("dim-filter")}
            if (rejectButton.classList.contains("dim-filter")) {rejectButton.classList.remove("dim-filter")}
        });

        let currencyAmount = document.createElement("div");
        currencyAmount.innerText = saveValues.primogem;
        currencyAmount.classList.add("flex-row")
        currencyAmount.id = "currency-amount";

        let primogem = createDom('img');
        primogem.src = "./assets/icon/primogemIcon.webp";
        currencyAmount.appendChild(primogem);
        
        const itemRoll = ["weapon","gem","artifact"]
        for (let i = 0; i < 3; i++) {
            let itemNumber;
            if (advType === 6) {
                itemNumber = inventoryDraw("gem", 3, 5, "shop");
            } else if (advType === 22) {
                let maxStar = 5;
                let item = rollArray(itemRoll,0);
                if (item === "weapon" || item === 'gem') {
                    maxStar = 6;
                }
                itemNumber = inventoryDraw(item,5,maxStar, "shop");
            }

            let offerItem = document.createElement("div");
            offerItem = inventoryFrame(offerItem, Inventory[itemNumber]);
            offerCurrency.value += Math.round(Shop.calculateShopCost(Inventory[itemNumber].Star) * costDiscount / 5 * 0.30) * 5;
            inventoryOffer.appendChild(offerItem);
            lootArray[i] = itemNumber;
        }

        offerCurrency.innerText = `Cost: \n ${offerCurrency.value} Primogems`;
        inventoryOffer.append(offerCurrency, acceptButton, rejectButton);
        adventureVideo.append(inventoryOffer, currencyAmount);

        adventureChoiceOne.addEventListener('click', () => {
            let tradeOffer = document.getElementById('inventory-offer');
            if (tradeOffer.offer === null) {return}

            for (let key in lootArray) {
                if (tradeOffer.offer) {inventoryAdd(lootArray[key])};
                delete lootArray[key];
            }

            if (tradeOffer.offer === true) {
                shopElement.load();
                shopElement.play();

                saveValues.primogem -= document.getElementById("offer-amount").value;
                newPop(1);
                currencyPopUp([["items", 0]])
                sortList("table2");
            }

            let adventureVideo = document.getElementById("adventure-video");
            if (adventureVideo.classList.contains("transcend-dark")) { adventureVideo.classList.remove("transcend-dark")}
            
            document.getElementById('currency-amount').remove();
            document.getElementById('inventory-offer').remove();
            quitQuest();

            if (tradeOffer.offer === true) {
                challengeNotification(({category: 'specific', value: [0, 6]}))
            }
            return;
        }, { once: true });
    }

    function quitQuest(res) {
        let adventureArea = document.getElementById("adventure-area");
        adventureArea.style.display = 'none';
        let adventureHeading = document.getElementById("adventure-header");
        adventureHeading.innerHTML = "";
        adventureHeading.style.animation = "";

        if (document.getElementById("world-quest-button")) {
            document.getElementById("world-quest-button").remove();
            notifPop("clearAll","quest");
        } 

        if (res) {
            res();
        }

        let advButton = document.getElementById("adventure-button");
        adventureType = 0;
        advButton.key = 0;
        clearExped();
        Expedition.expedInfo("exped-7", expeditionDict, saveValues, persistentValues);
        if (advButton.classList.contains("expedition-selected")) {
            advButton.classList.remove("expedition-selected");
        }
    }
}


function spawnMob(adventureVideo, waveInfo, adjacentSibling = null) {
    let decoy = null;
    let arm = null;
    if (typeof(waveInfo[1]) === 'string') {
        if (waveInfo[1].includes('decoy')) {
            decoy = waveInfo[1].split('-')[1];
            waveInfo.pop();
        } else if (waveInfo[1].includes('arm')) {
            arm = waveInfo[1].split('-')[1];
            waveInfo.pop(); 
        }
    }

    for (let i = 0; i < waveInfo.length; i++) {
        let singleEnemyInfo = enemyInfo[waveInfo[i]];
        let mobDiv = document.createElement("div");
        let mobImg =  document.createElement("div");
        mobImg.classList.add("enemyImg");

        let randMob = `${singleEnemyInfo.Type}-${singleEnemyInfo.Class}-${randomInteger(1, singleEnemyInfo.Variation+1)}`;

        if (arm === null) {
            mobImg.style.backgroundImage = `url(./assets/expedbg/enemy/${randMob}.webp)`;
        } else {
            mobImg.style.backgroundImage = `url(./assets/expedbg/enemy/Workshop-Arm-${arm}.webp)`;
        }
        
        mobDiv.append(mobImg);

        mobDiv.decoyNumber = null;
        mobDiv.enemyType = randMob;
        mobDiv.enemyID = singleEnemyInfo;
        mobDiv.classList.add("enemy");
        (adventureVariables.specialty === 'Workshop') || (adventureVariables.specialty === 'FellBoss') ? mobDiv.classList.add("wide-enemy") : null;

        switch (singleEnemyInfo.Class) {
            case 'Megaboss':
                mobDiv.classList.add("megaboss");
                break;
            case 'Minion':
                mobDiv.classList.add("minion");
                break;
            case 'Arm':
                mobDiv.classList.remove("wide-enemy");
                break;
            default:
                break;
        }

        if (decoy === null && adventureVariables.specialty === 'Unusual') {
            mobDiv.decoyNumber = 3;
        }

        if (adjacentSibling) {
            const nextSibling = adjacentSibling.nextElementSibling;
            const previousSibling = adjacentSibling.previousElementSibling;
            
            let positionCount = 3;
            if (nextSibling && !nextSibling.classList.contains('enemy')) {
                adjacentSibling.after(mobDiv);
                positionCount += 2;
            } else if (previousSibling && !previousSibling.classList.contains('enemy')) {
                adjacentSibling.before(mobDiv);
                positionCount -= 2;
            } else if (nextSibling && !nextSibling.nextElementSibling.classList.contains('enemy')) {
                adjacentSibling.after(mobDiv);
                positionCount++;
            } else if (previousSibling && !previousSibling.previousElementSibling.classList.contains('enemy')) {
                adjacentSibling.before(mobDiv);
                positionCount--;
            } else {
                randomInteger(1, 3) === 1 ? adjacentSibling.after(mobDiv) : adjacentSibling.before(mobDiv);
            }

            if (decoy !== null) {
                mobDiv.classList.remove("megaboss");
                mobDiv.classList.add("decoy");
                mobDiv.decoyNumber = positionCount;
            }

            return mobDiv;
        } else {
            adventureVideo.append(mobDiv);
        }
    }
}

// ADVENTURE PROCESS
const adventurePreload = new Preload();
const adventureWorker = new Worker('./modules/workers.js');
function drawAdventure(advType, wave) {
    if (adventureScene) {return}
    adventureScaraText = (advType === 5 || (advType === 14 && wave === 3)) ? "-scara" : "";
    lootArray = {};

    adventureScene = true;
    stopSpawnEvents = true;

    let removeEle = document.querySelectorAll('.adventure-atk-cooldown, .adventure-atk-cooldown-scara');
    removeEle.forEach((element) => {
        element.remove();
    });

    let quickType;
    if ((advType >= 3 && advType < 6) || advType >= 13) {
        quickType = enemyInfo.quicktimeDict[advType];
    } else {
        quickType = advType;
    }
    
    const waveType = enemyInfo[`${advType}-Wave-${wave}`];
    const quicktimeEnabled = ((advType >= 3 && advType < 6) || advType >= 13);
    let specialty = null;
    if (advType === 14) {
        switch (wave) {
            case 1:
                specialty = 'FellBoss';
                break;
            case 2:
                specialty = 'Unusual';
                quickType = enemyInfo.quicktimeDict['Unusual'];
                break;
            case 3:
                specialty = 'Workshop';
                break;
            case 4:
                specialty = 'Finale';
                break;
            default:
                break;
        }
    }

    // NAHIDA UPGRADE CHECKER
    let nahidaMultiplier = 0;
    for (let key in upgradeDict[0]["milestone"]) {
        if (upgradeDict[0]["milestone"][key]) {nahidaMultiplier += 3}
    }

    adventureVariables = {
        quicktimeEnabled: quicktimeEnabled,  // BOOL
        quickType: quicktimeEnabled ? quickType : null, // ARRAY
        advType: advType, // INTEGER
        specialty: specialty,
        waveType: waveType, // TWO ARRAYS
        currentEnemyAmount: waveType.Wave.length, // INT
        maxEnemyAmount: waveType.Wave.length, // INT
        treeDefense: advType === 15 ? true : false, // INT
        fightSceneOn: false,
        pheonixMode: false,
        nahidaMultiplier: nahidaMultiplier,
        skirmish: advType === 13 || advType === 15,
    }

    let adventureVideo = document.getElementById("adventure-video");
    if (settingsValues.wideCombatScreen) {adventureVideo.style.width = '95%'}
    const adventureFightImg = document.getElementById("adventure-fight").children;

    // SCARA MODE
    const imageGif = document.getElementById("adventure-gif");
    imageGif.src = `./assets/expedbg/exped${adventureScaraText ? '-scara' : '-Nahida'}.webp`;
    adventureVideo.style.border = `0.2em ridge ${adventureScaraText === '-scara' ? '#C0C5ED' : '#AEDF7D'}`;

    for (let i = 0; i < adventureFightImg.length; i++) {
        if (adventureFightImg[i].classList.contains(`fight-button${!adventureScaraText}`)) {adventureFightImg[i].classList.remove(`fight-button${!adventureScaraText}`)};
        adventureFightImg[i].classList.add(`fight-button${adventureScaraText}`);
    }
    
    const adventureChoiceOne = document.getElementById("adv-button-one");
    adventureChoiceOne.style.display = "block";
    adventureChoiceOne.pressAllowed = false;
    adventureChoiceOne.innerText = "Fight!";
    adventureChoiceOne.advType = advType;

    const adventureRewards = document.getElementById("adventure-rewards");
    adventureRewards.style.opacity = "0";
    adventureRewards.style.flexGrow = "1";
    const adventureHeading = document.getElementById("adventure-header");
    adventureHeading.style.flexGrow = "0";
 
    const adventureArea = document.getElementById("adventure-area");
    const adventureTextBox = document.getElementById("adventure-text");
    adventureTextBox.style.animation = '';
    void adventureTextBox.offsetWidth;
    
    const bgRoll = randomInteger(waveType.BG[0],waveType.BG[1] + 1);
    adventureVideo.style.backgroundImage = `url(./assets/expedbg/scene/${advType}-B-${bgRoll}.webp)`;
    spawnMob(adventureVideo, waveType.Wave, false);

    if (adventureVariables.treeDefense) {
        const timerWidth = createDom('div', { classList: ['defense-width'], brightness: 100 });
        const timerDefense = createDom('div', { id: 'timer-defense', classList: ['defense-timer'], child: [timerWidth], style: {opacity: 0} });
        timerDefense.activate = () => { 
            timerDefense.style.opacity = 1;
            window.requestAnimationFrame(decreaseTime);
        }

        timerDefense.readProgress = () => {
            return timerWidth.brightness;
        }

        timerDefense.killMob = () => {
            timerWidth.brightness -= 5;
            timerWidth.style.width = `${timerWidth.brightness}%`;
        }

        const FRAMES_PER_SECOND = 60;
        const interval = Math.floor(1000 / FRAMES_PER_SECOND);
        let startTime = performance.now();
        let previousTime = startTime;

        let currentTime = 0;
        let deltaTime = 0;

        function decreaseTime(timestamp) {
            if (!adventureVariables.fightSceneOn) {return}
            currentTime = timestamp;
            deltaTime = currentTime - previousTime;

            if (deltaTime > interval) {
                previousTime = currentTime - (deltaTime % interval);
                if (battleVariables.quicktimeAttack) {
                    window.requestAnimationFrame(decreaseTime);
                    return;
                }
              
                timerWidth.brightness -= 0.005;
                timerWidth.style.width = `${timerWidth.brightness}%`;

                if (timerWidth.brightness < 0) {
                    winAdventure();
                    return;
                }
            }
            window.requestAnimationFrame(decreaseTime);
        }

        adventureVideo.append(timerDefense);
    }

    const preloadedImage = createDom('img');
    preloadedImage.src = `./assets/expedbg/scene/${advType}-B-${bgRoll}.webp`;
    preloadedImage.onload = () => {
        adventureArea.style.display = 'flex';
        adventureTextBox.style.animation = "flipIn 1s ease-in-out forwards";
        adventureTextBox.addEventListener("animationend",textFadeIn, { once: true });
        bgmElement.pause();
        fightEncounter.load();
        fightEncounter.play();
    }

    function textFadeIn() {
        adventureHeading.style.top = "10%";
        adventureHeading.style.overflowY = "hidden";
        adventureHeading.style.animation = "fadeOut 1s ease-out reverse";

        const fightTextbox = document.getElementById('fight-text');
        if (adventureVariables.maxEnemyAmount > 1) {
            adventureHeading.innerText = "You encounter a bunch of hostile enemies.";
            fightTextbox.innerText = "Prepare for a fight!";
            if (adventureVariables.advType === 13) {
                adventureHeading.innerText = "Prepare for a tough fight!";
            } else if (adventureVariables.advType === 15) {
                adventureHeading.innerText = "Protect the trees at all costs!";
                fightTextbox.innerText = "Try to hold out as best you can!";
            }
        } else {
            adventureHeading.innerText = "You encounter a hostile mob.";
            fightTextbox.innerText = "Prepare for a fight!";
            switch (specialty) {
                case 'FellBoss':
                    fightTextbox.innerText = "Watch out for its magic circles!";
                    adventureHeading.innerText = "The excess energy from the Leyline Outbreak has caused this Whoppperflower to grow uncontrollably..."
                    break;
                case 'Unusual':
                    fightTextbox.innerText = "Beware of its decoys!";
                    adventureHeading.style.animation = "fadeOut 0.4s ease-out reverse";
                    adventureHeading.innerText = "After stepping into the domain, you...Watch out! Something is being launched towards you!!"
                    break;
                case 'Workshop':
                    fightTextbox.innerText = "Be prepared for anything!";
                    adventureHeading.innerText = "Before you stands the re-animated machine of the Prodigal, Everlasting Lord of Arcane Wisdom."
                    break;
                case 'Finale':
                    fightTextbox.innerText = "Do not give up!";
                    adventureHeading.innerText = "You stand before the Doctor, Second of the Fatui Harbingers, mastermind behind the Leyline Outbreak."
                    break;
                default:
                    break;
            }
        }

        adventureTextBox.style.animation = "";
        adventureChoiceOne.pressAllowed = true;

        if (specialty === 'Unusual') {
            setTimeout(() => {
                adventureChoiceOne.click();
            }, 1500)
        }
    }
}


function triggerFight() {
    if (!adventureScene) {return}
    adventureVariables.fightSceneOn = true;
    adventureVariables.pheonixMode = advDict.rankDict[20] === true ? true : false;

    skillCooldownReset = false;

    adventureWorker.postMessage({
        function: 'calculateDamage',
        args:[advDict.adventureRank, advDict.morale]
    })

    adventureWorker.onmessage = function(event) {
        if (event.data.function === 'calculateDamage') {
            battleVariables.currentATK = event.data.result;
        }
    }

    let adventureVideo = document.getElementById("adventure-video");
    adventureVideo = Battle.comboHandler("create",adventureVideo);
    let adventureVideoChildren = adventureVideo.children;

    battleVariables = {
        iframe: null,
        defenseMob: null,
        guardtime: null,
        doubleAtkCooldown: null,
        healthLost: 0,
        maxHealth: Math.ceil((5 + Math.floor(advDict.adventureRank / 4)) * (activeLeader === "Nahida" ? 1.2 : 1)),
        artificalSpeedUp: 0,
        quicktime: 0,
        quicktimeAttack: false,
        summonTime: null,
        rainTime: null,
        floatTime: null,
        floatNumber: 0,
        decoyTime: null,
        decoyNumber: null,
        chargeTime: null,
        currentDeflect: null,
        deflectTime: null,
        burstAttack: null,
        burstTime: null,
        eatTime: null,
        currentEaten: null,
        bossHealth: adventureVariables.advType === 14 ? 100 : null,
        lastStand: false,
        triggerConstants: {quicktimeCheck, summonMob, rainTimeCheck, floatTimeCheck, burstTimeCheck, burstTimeEnd, eatTimeCheck},
    }

    // SPECIALTY CHCKER
    if (adventureVariables.skirmish) {
        battleVariables.doubleAtkCooldown = 1;
        battleVariables.guardtime = 0;
        if (persistentValues.workshopBossDefeat) {
            battleVariables.deflectTime = 0;
        }
        if (persistentValues.fellBossDefeat) {
            battleVariables.floatTime = 0.5;
        }
        if (adventureVariables.treeDefense) {
            document.getElementById('timer-defense').activate();
        }
    } else if (adventureVariables.advType === 14) {
        if (adventureVariables.specialty === 'FellBoss') {
            battleVariables.floatTime = 0.5;
            battleVariables.doubleAtkCooldown = 1;
        } else if (adventureVariables.specialty === 'Unusual') {
            battleVariables.quicktime = 100;
        } else if (adventureVariables.specialty === 'Workshop') {
            battleVariables.deflectTime = 0;
            battleVariables.burstTime = 0.25;
        } else if (adventureVariables.specialty === 'Finale') {
            battleVariables.guardtime = 0;
            battleVariables.summonTime = 0;
            battleVariables.doubleAtkCooldown = 1;
        }
    }
    
    let currentSong = randomInteger(1, 4); 
    if (adventureScaraText) {
        currentSong = 4;
    } else if (adventureVariables.advType === 15) {
        currentSong = randomInteger(1, 7);
    } else if (adventureVariables.advType >= 13) {
        currentSong = randomInteger(5, 7);
    }
    
    bgmElement.pause();
    fightBgmElement.src = `./assets/sfx/battleTheme-${currentSong}.mp3`;
    fightBgmElement.volume = settingsValues.bgmVolume;
    fightBgmElement.loop = true;
    fightBgmElement.load();
    fightBgmElement.addEventListener('canplaythrough', () => {fightBgmElement.play();})

    Battle.drawBattleHealth(adventureScaraText, battleVariables);

    const adventureFightImg = document.getElementById("adventure-fight").children;
    for (let i = 1; i < 4; i++) {
        let advImage = adventureFightImg[i].children[0];
        advImage.src = `./assets/expedbg/battle${adventureScaraText}${i}.webp`;
        advImage.id = `adventure-image-${i}`;
        if (advImage.classList.contains('dim-filter')) {advImage.classList.remove('dim-filter')}

        const adventureAtkCooldown = document.createElement("div");
        adventureAtkCooldown.classList.add(`adventure-atk-cooldown${adventureScaraText}`,"flex-row");

        let normalAtkCooldown = document.createElement("div");
        normalAtkCooldown.classList.add(`inner-cooldown${adventureScaraText}`);
        normalAtkCooldown.id = `adventure-cooldown-${i}`;
        normalAtkCooldown.amount = 0;
        normalAtkCooldown.maxAmount = 1;
        normalAtkCooldown.style.width = `${normalAtkCooldown.amount}%`;
        adventureAtkCooldown.appendChild(normalAtkCooldown);

        let amountInterval = 0.2;
        if (i == 1) {
            amountInterval *= 4;
            normalAtkCooldown.maxAmount = 2;
            if (advDict.rankDict[16] === true) {
                amountInterval *= 1.1;
            }

            if (advDict.rankDict[9] === true) {
                normalAtkCooldown.maxAmount = 3;
            }

            if (advDict.rankDict[2] === true) {
                normalAtkCooldown.amount = 100 * normalAtkCooldown.maxAmount;
            }

            if (activeLeader == "Venti") {
                amountInterval *= 1.10;
            }
        } else if (i == 2) {
            amountInterval *= 0.65;
            if (advDict.rankDict[5] !== true) {
                advImage.classList.add('dim-filter');
                continue;
            }
        } else if (i == 3) {
            if (advDict.rankDict[10] !== true) {
                advImage.classList.add('dim-filter');
                continue;
            } else {
                amountInterval = 0;
            }
        }

        for (let j = 0; j < normalAtkCooldown.maxAmount; j++) {
            let barBit = document.createElement("div");
            barBit.classList.add(`cooldown-bit${adventureScaraText}`);
            adventureAtkCooldown.appendChild(barBit);
        }

        const FRAMES_PER_SECOND = 60;
        const interval = Math.floor(1000 / FRAMES_PER_SECOND);
        let startTime = performance.now();
        let previousTime = startTime;

        let currentTime = 0;
        let deltaTime = 0;
        window.requestAnimationFrame(increaseCooldownBar);

        function increaseCooldownBar(timestamp) {
            if (!adventureVariables.fightSceneOn) {return}
            currentTime = timestamp;
            deltaTime = currentTime - previousTime;
          
            if (deltaTime > interval) {
                previousTime = currentTime - (deltaTime % interval);
                if (!battleVariables.quicktimeAttack) {normalAtkCooldown.amount += amountInterval}
                normalAtkCooldown.style.width = `${normalAtkCooldown.amount / (normalAtkCooldown.maxAmount)}%`

                if (normalAtkCooldown.amount > 100) {
                    if (normalAtkCooldown.amount > (100 * normalAtkCooldown.maxAmount)) {
                        normalAtkCooldown.amount = 100 * normalAtkCooldown.maxAmount;
                        normalAtkCooldown.style.width = `${100}%`;
                    }
                    if (advImage.classList.contains('dim-filter')) {
                        advImage.classList.remove('dim-filter')}
                } else if (normalAtkCooldown.amount < 100){
                    if (!advImage.classList.contains('dim-filter')) {
                        advImage.classList.add('dim-filter')}
                }
            }
            window.requestAnimationFrame(increaseCooldownBar);
        }
        adventureFightImg[i].appendChild(adventureAtkCooldown);
    }

    for (let i = 0; i < adventureVideoChildren.length; i++) {
        let mobDiv = adventureVideoChildren[i];
        if (mobDiv.tagName != 'DIV' || !mobDiv.classList.contains('enemy')) {continue};

        activateMob(mobDiv, i,  adventureVideoChildren.length);
    }

    // SPAWNS QUICKTIME EVENT AFTER TIME
    function quicktimeCheck() {
        if (adventureVariables.quicktimeEnabled && battleVariables.quicktime >= (2.5 * adventureVariables.maxEnemyAmount) && !document.getElementById('warning-quicktime')) {
            const quicktimeArray = adventureVariables.quickType;
            battleVariables.quicktime = 0;

            let variant = '';
            if (adventureVariables.specialty === 'FellBoss') {
                variant = '-osu';
            } else if (adventureVariables.specialty === 'Workshop') {
                variant = '-cytus';
            } else if (adventureVariables.specialty === 'Finale') {
                if (battleVariables.bossHealth <= CONSTANTS.FINALE_THRESHOLD_TWO) {
                    variant = '-cytus';
                } else if (battleVariables.bossHealth <= CONSTANTS.FINALE_THRESHOLD) {
                    variant = '-osu';
                }
            } else if (adventureVariables.skirmish) {
                if (persistentValues.workshopBossDefeat) {
                    variant = rollArray(['', '-osu', '-cytus']);
                } else if (persistentValues.fellBossDefeat) {
                    variant = rollArray(['', '-osu']);
                }
            }

            let warningImg = createDom('img');
            warningImg.id = "warning-quicktime";
            warningImg.src = `./assets/icon/warning${variant}.webp`;
            warningImg.classList.add("quicktime-warning");
            adventureVideo.appendChild(warningImg);

            adventurePreload.fetch(quicktimeAssetArray);

            const startQuicktime = () => {
                battleVariables.quicktime = 0;
                quicktimeEvent(quicktimeArray[randomInteger(1, Object.keys(quicktimeArray).length + 1)], battleVariables.currentATK, variant);
                warningImg.remove();

                if (battleVariables.rainTime > 0.8) {
                    battleVariables.rainTime -= 0.25;
                }
            }


            warningImg.onload = () => {
                if ((adventureVariables.specialty === 'Unusual')) {
                    setTimeout(() => {startQuicktime()}, 1000);
                } else {
                    warningImg.addEventListener("animationend", () => {
                        startQuicktime();
                    })
                }
                
            }
        } 
    }

    // SUMMONS NEW MOBS 
    function summonMob(type) {
        if (type === 'Workshop') {
            const bossEle = adventureVideo.querySelector('.megaboss');
            for (let i = 0; i < 4; i++) {
                const armEle = spawnMob(adventureVideo, [1422, `arm-${i + 1}`], bossEle);
                armEle.classList.add('workshop-arm');
                activateMob(armEle, i, adventureVideoChildren.length);
                adventureVariables.currentEnemyAmount++;
            }
            return;
        } else if (type === 'decoy') {
            //pass
        } else {
            if (battleVariables.summonTime === null || battleVariables.summonTime <= (2.5 * adventureVariables.maxEnemyAmount)) {return}
            if (adventureVariables.currentEnemyAmount >= 5) {
                battleVariables.summonTime = 0;
                return;
            }
            battleVariables.summonTime = 0;
        }

        for (let i = 0; i < adventureVideoChildren.length; i++) {
            let mobDiv = adventureVideoChildren[i];
            if (mobDiv.classList.contains('enemy')) {
                const bossEle = adventureVideo.querySelector('.megaboss');

                if (type === 'decoy') {
                    for (let i = 0; i < 4; i++) {
                        activateMob(spawnMob(adventureVideo, [1411, `decoy-${i + 1}`], mobDiv), bossEle, adventureVideoChildren.length);
                        adventureVariables.currentEnemyAmount++;
                    }
                    adventureVariables.currentEnemyAmount--;
                } else if (adventureVariables.specialty === 'Finale') {
                    activateMob(spawnMob(adventureVideo, [1432], bossEle), 1, adventureVideoChildren.length);
                } else {
                    activateMob(spawnMob(adventureVideo, [1412], bossEle), 1, adventureVideoChildren.length);
                }

                adventureVariables.currentEnemyAmount++;
                break;
            }
        }
    }

    // FOR OSU QUICKTIME EVENTS
    function rainTimeCheck() {
        if (battleVariables.rainTime > 1 && adventureVariables.specialty === 'FellBoss' && !document.getElementById('warning-quicktime')) {
            battleVariables.rainTime = 0;
            quicktimeEvent(null, battleVariables.currentATK, '-rain');
        }
    }

    // FOR SCREEN TRAPS
    function floatTimeCheck() {
        if (battleVariables.floatTime > 1 && !document.getElementById('warning-quicktime')) {
            battleVariables.floatTime = 0;
            if (adventureVariables.specialty === 'FellBoss') {
                summonBattleFloat(5, 1);
                if (battleVariables.bossHealth <= CONSTANTS.FELLBOSS_THRESHOLD && randomInteger(1, 3) === 1) {
                    summonBattleFloat(4, 1.5);
                } else if (randomInteger(1, 4) === 1) {
                    summonBattleFloat(6, 1);
                }
            } else {
                if (battleVariables.bossHealth <= CONSTANTS.FINALE_THRESHOLD) {
                    if (battleVariables.bossHealth <= CONSTANTS.FINALE_THRESHOLD_TWO) {
                        battleVariables.floatTime = -0.5;
                    } else {
                        randomInteger(1, 3) === 1 ? summonBattleFloat(5, 0.75, true) : null;
                    }

                    summonBattleFloat(4, 1.5, true);
                    summonBattleFloat(3, 1, true);
                }
            }  
        }
    }

    // FOR WORKSHOP SPECIAL BURST
    function burstTimeCheck() {
        if (battleVariables.burstTime > 1 && !document.getElementById('warning-quicktime')) {
            battleVariables.burstAttack = 0;
            battleVariables.burstTime = 0;
            battleVariables.currentDeflect = null;
            battleVariables.deflectTime = 0;

            const armEleCanvas = adventureVideo.querySelectorAll('.workshop-arm > .atk-indicator');
            armEleCanvas.forEach((canvas) => {
                canvas.brightness = -0.15 * randomInteger(0, 50) / 10;
                canvas.changeSrc(`./assets/icon/burstDoubleAtk.webp`);
                canvas.burstMode = true;
                canvas.deflecting = false;
                canvas.style.animation = `tada 1.5s linear`;

                canvas.addEventListener('animationend', () => {
                    canvas.style.animation = '';
                    void canvas.offsetWidth;
                }, { once: true });
            })

            const bossEle = adventureVideo.querySelector('.megaboss');
            bossEle.style.pointerEvents = 'none';
            const bossEleImg = bossEle.querySelector('.enemyImg');
            bossEleImg.style.filter = 'grayscale(100%) brightness(20%)';

            const bossEleCanvas = bossEle.querySelector('.atk-indicator');
            bossEleCanvas.changeSrc(`./assets/icon/burstCharge.webp`);
            bossEleCanvas.style.animation = `tada 1.5s linear`;
            bossEleCanvas.brightness = 0;
            bossEleCanvas.deflecting = false;

            bossEleCanvas.addEventListener('animationend', () => {
                bossEleCanvas.style.animation = '';
                void bossEleCanvas.offsetWidth;
            }, { once: true });

            const energyBurst = createDom('img', {
                id: 'energy-ball',
                src: './assets/expedbg/energyBall.webp',
                class: ['energy-burst'],
                startingValue: 0,
                changeValue: () => {
                    const newWidth = Math.min(40 + energyBurst.startingValue * 5, 100);
                    energyBurst.style.width = (newWidth) + '%';
                    energyBurst.style.left = ((100 - newWidth) / 2) + '%';
                }
            });

            bossEle.appendChild(energyBurst);
            const fightText = document.getElementById('fight-text');
            fightText.innerText = 'Counter as many attacks as possible before Setsuna Shoumetsu is unleashed!';
        }
    }

    // WORKSHOP BURST END
    function burstTimeEnd() {
        adventureVideo.style.pointerEvents = 'none';

        const energyBall = document.getElementById('energy-ball');
        energyBall.style.animation = 'explosion 4s linear forwards';
        const fightText = document.getElementById('fight-text');
        fightText.innerText = 'Setsuna Shoumetsu cometh...';
        
        const armEleCanvas = adventureVideo.querySelectorAll('.workshop-arm > .atk-indicator');
        armEleCanvas.forEach((canvas) => {
            canvas.brightness = -1000;
            canvas.style.transform = '';
            canvas.style.filter = 'brightness(0)';
        })

        const bossEle = adventureVideo.querySelector('.megaboss');
        const bossEleImg = bossEle.querySelector('.enemyImg');
        bossEleImg.style.filter = 'drop-shadow(0 0 0.3em rgba(255, 255, 255, 0.463))';

        setTimeout(() => {
            adventureVideo.style.animation = "darkness-transition-slow 4s ease-in-out";
            setTimeout(() => {
                adventureVideo.style.animation = "none";
                adventureVideo.style.pointerEvents = 'unset';
                void adventureVideo.offsetWidth;

                if (energyBall.startingValue > 0 && energyBall.startingValue <= 3) {
                    energyBall.startingValue++
                }

                loseHP(energyBall.startingValue, 'normal', false, 'energy ball');
                Expedition.sapEnergy(energyBall.startingValue, 25);

                battleVariables.burstAttack = null;
                battleVariables.burstTime = 0.15;

                armEleCanvas.forEach((canvas) => {
                    canvas.brightness = -0.10 * randomInteger(0, 50) / 10;
                    canvas.changeSrc(`./assets/icon/atkIndicator${adventureScaraText}.webp`);
                    canvas.burstMode = false;
                });

                bossEle.style.pointerEvents = 'auto';
                const bossEleCanvas = bossEle.querySelector('.atk-indicator');
                if (bossEleCanvas) {
                    bossEleCanvas.changeSrc(`./assets/icon/atkIndicator${adventureScaraText}.webp`);
                    bossEleCanvas.brightness = 0;
                    fightText.innerText = 'Take down its limbs to damage the core!';
                }

                energyBall.remove();
            }, 2000);
        }, 2200);
    }

    // EATING FUNCTION FOR FINALE
    function eatTimeCheck() {
        if (battleVariables.currentEaten !== null) {
            const eatenMark = battleVariables.currentEaten.querySelector('.mark-button');
            if (eatenMark) {
                if (battleVariables.eatTime > 1) {
                    battleVariables.eatTime = -0.5;
                    eatenMark.remove();

                    killMob(battleVariables.currentEaten, battleVariables.currentEaten.querySelector('.health-bar'))
                    battleVariables.currentEaten = null;

                    const bossEle = document.querySelector('.megaboss > .health-bar');
                    bossEle.health += 0.10 * bossEle.maxHP;
                    bossEle.health = Math.min(bossEle.health, CONSTANTS.FINALE_THRESHOLD_TWO)
                    bossEle.style.width = `${bossEle.health / bossEle.maxHP * 100}%`
                    bossUpdate(bossEle.health);
                } else if (battleVariables.eatTime > 0.95) {
                    const enemyImg = battleVariables.currentEaten.querySelector('.enemyImg');
                    if (enemyImg.style.transition !== 'filter 0.4s ease-out') {
                        enemyImg.style.transition = 'filter 0.4s ease-out';
                        enemyImg.style.filter = 'grayscale(1) brightness(0.7) sepia(1) hue-rotate(313deg) saturate(1.5)';
                    }
                } else if (battleVariables.eatTime > 0.8) {
                    if (eatenMark.glowing === false) {
                        eatenMark.style.transform = `translate(-50%, 0) scale(1.2)`;
                        eatenMark.style.filter = `brightness(0.99) contrast(1) drop-shadow(0 0 5px #ffffff) drop-shadow(0 0 4px #ffffff)`;
                        eatenMark.glowing = true;
                    }
                } else {
                    eatenMark.style.filter = `brightness(${battleVariables.eatTime})`;
                }

                return;
            } else {
                const mobDiv = battleVariables.currentEaten;
                if (battleVariables.defenseMob === mobDiv) {
                    mobDiv.guardStance(mobDiv, "exit");
                }

                const eatenMark = createDom('div', {
                    class: ['counter-button', 'mark-button'],
                    glowing: false,
                });
    
                mobDiv.append(eatenMark);
            }
        } else if (battleVariables.eatTime > 1 && !document.getElementById('warning-quicktime')) {
            const currentEle = adventureVideo.querySelectorAll('.minion');
            let foundHealthyEnemy = null;

            for (let i = 0; i < currentEle.length; i++) {
                const mobDiv = currentEle[i];
                const currentEleHealth = mobDiv.querySelector('.health-bar');

                if (currentEleHealth.health / currentEleHealth.maxHP > 0.70) {
                    const currentEleCanvas = mobDiv.querySelector('.atk-indicator');
                    if (!mobDiv.querySelector('.counter-img') && currentEleCanvas.eaten === false) {
                        foundHealthyEnemy = mobDiv;
                        currentEleCanvas.eaten = true;
                        break;
                    }
                }
            }

            if (foundHealthyEnemy !== null) {
                battleVariables.currentEaten = foundHealthyEnemy;
                battleVariables.eatTime = 0;
            } else {
                battleVariables.eatTime = 0.7;
            }
        }
    }

    // BOSS SPECIAL PROPS
    if (adventureVariables.specialty === 'Unusual') {
        setTimeout(() => {
            // SUMMONS DECOYS
            summonMob('decoy');
            battleVariables.decoyNumber = 3;
        }, 5000)
    }
}

// STARTS COMBAT FOR MOB
function activateMob(mobDiv, position, adventureVideoChildrenLength) {
    const decoy = mobDiv.classList.contains('decoy') ? true : false;
    const arm = mobDiv.classList.contains('workshop-arm') ? true : false;
    const enemyImg = mobDiv.querySelector('.enemyImg');

    Battle.animateMob(mobDiv, enemyImg, adventureVariables);

    let mobHealth = createDom('div', { classList: [`health-bar${adventureScaraText}`] });
    let singleEnemyInfo = mobDiv.enemyID;

    if (adventureVariables.treeDefense) {
        let timerLeft = document.getElementById('timer-defense').readProgress();
        if (timerLeft < 10) {
            singleEnemyInfo.HP *= 1.25;
            singleEnemyInfo.AtkCooldown *= 0.9;
        } else if (timerLeft < 25) {
            singleEnemyInfo.HP *= 1.2;
            singleEnemyInfo.AtkCooldown *= 0.95;
        } else if (timerLeft < 50) {
            singleEnemyInfo.HP *= 1.1;
        }
    }
    
    mobHealth.maxHP = singleEnemyInfo.HP;
    if (decoy) mobHealth.maxHP = 1e10;
    mobHealth.health = mobHealth.maxHP;
    mobHealth.atk = singleEnemyInfo.ATK;
    mobHealth.class = singleEnemyInfo.Class;
    mobHealth.dead = false;
    
    let animationTime = singleEnemyInfo.AtkCooldown * (mobDiv.classList.contains('megaboss') ? 0.1 : (randomInteger(90, 110) / 1000));
    mobDiv.attackTime = animationTime;
    mobDiv.guardStance = guardStance;
    mobDiv.deflectStance = deflectStance;
    mobDiv.doubleAttack = doubleAttack;

    let mobAtkIndicator = createDom('img', {
        src: `./assets/icon/atkIndicator${adventureScaraText}.webp`,
        defence: false,
        firstLoad: true,
        doubleAtk: false,
    });

    let decoyLoad = false;
    const changeSrc = (newSrc) => { mobAtkIndicator.src = newSrc }
    const canvas = Battle.enemyCanvas({
        changeSrc: changeSrc, 
        brightness: (0 - 0.1 * (position * randomInteger(1, adventureVideoChildrenLength) - 2)),
        specialty: adventureVariables.specialty,
        arm: arm,
        position: position,
    });
    
    mobAtkIndicator.onload = () => {
        canvas.width = mobAtkIndicator.naturalWidth;
        canvas.height = mobAtkIndicator.naturalHeight;

        let ctx = canvas.getContext("2d");
        ctx.drawImage(mobAtkIndicator, 0, 0);
        let brightnessIncrement = decoy ? 0 : Math.round(1 / animationTime * 100)/10000;
        let maxBrightness = 1;

        if (decoyLoad) {return};
        canvas.style.filter = `brightness(0)`;
        canvas.style.transform = ``;
        canvas.attackState = false;

        // REQUESTANIMATIONFRAME TRIGGERS AGAIN WHEN CHANGING IMG SRC IF ONLOAD IS NOT CLEARED
        if (mobAtkIndicator.firstLoad) {
            window.requestAnimationFrame(increaseBrightness);
            mobAtkIndicator.firstLoad = false;
        }

        const FRAMES_PER_SECOND = 60;
        const interval = Math.floor(1000 / FRAMES_PER_SECOND);
        let startTime = performance.now();
        let previousTime = startTime;

        let currentTime = 0;
        let deltaTime = 0;

        function increaseBrightness(timestamp) {
            if (!adventureVariables.fightSceneOn || mobHealth.dead) {return}
            currentTime = timestamp;
            deltaTime = currentTime - previousTime;
            
            // ATTACKS ARE FASTER WHEN MORE ENEMIES ARE DOWN
            if (deltaTime > interval) {
                previousTime = currentTime - (deltaTime % interval);
                if (canvas.paused) {
                    window.requestAnimationFrame(increaseBrightness);
                    return;
                }

                const speedUpFactor = 1 + Math.max((adventureVariables.maxEnemyAmount - adventureVariables.currentEnemyAmount) * 0.75, 0) + battleVariables.artificalSpeedUp;
                if (!battleVariables.quicktimeAttack) {
                    if (mobAtkIndicator.defence) {
                        if (battleVariables.guardtime !== null) {battleVariables.guardtime += (brightnessIncrement * speedUpFactor * randomInteger(95,106) / 100);}
                        if (adventureVariables.currentEnemyAmount === 1) {
                            mobDiv.guardStance(mobDiv, "exit");
                        } else {
                            canvas.style.filter = `brightness(1)`;
                            mobDiv.guardStance(mobDiv, "refresh");
                        }
                        window.requestAnimationFrame(increaseBrightness);
                        return;
                    } else if (battleVariables.guardtime !== null && battleVariables.defenseMob === null) {
                        battleVariables.guardtime += (brightnessIncrement * speedUpFactor * randomInteger(95,106) / 100);
                    }

                    canvas.brightness += (brightnessIncrement * speedUpFactor * (mobAtkIndicator.doubleAtk == true ? 2.5 : 1));
                    // FOR WORKSHOP BURST ATTACK
                    if (!mobDiv.classList.contains('minion') && !arm && battleVariables.burstAttack === null) {
                        battleVariables.quicktime += (brightnessIncrement * speedUpFactor);
                    } else if (arm && canvas.burstMode === true) {
                        canvas.brightness += canvas.brightness > 0.8 ? brightnessIncrement * 0.75 : brightnessIncrement * 2.5;
                    }

                    // FOR BOSSES ONLY
                    if (mobDiv.classList.contains('megaboss')) {
                        if (battleVariables.summonTime !== null) {
                            battleVariables.summonTime += (brightnessIncrement * speedUpFactor * 0.8);
                        }
                        
                        if (adventureVariables.specialty === 'Unusual') {
                            if (battleVariables.bossHealth > CONSTANTS.UNUSUAL_THRESHOLD) {
                                battleVariables.quicktime -= brightnessIncrement * 0.1;
                                battleVariables.decoyTime = canvas.brightness;
                                canvas.brightness += brightnessIncrement * 0.5;
                            } else {
                                battleVariables.summonTime += (brightnessIncrement * speedUpFactor * 0.5);
                                canvas.brightness += (brightnessIncrement * speedUpFactor * 0.2);
                            }
                        } else if (adventureVariables.specialty === 'FellBoss') {
                            if (battleVariables.bossHealth <= CONSTANTS.FELLBOSS_THRESHOLD) {
                                canvas.brightness -= brightnessIncrement * 0.15;
                                battleVariables.rainTime += brightnessIncrement * 0.4;
                                battleVariables.triggerConstants.rainTimeCheck();
                            } else {
                                battleVariables.quicktime += brightnessIncrement * 0.5;
                            }

                            battleVariables.floatTime += brightnessIncrement * 0.6;
                            battleVariables.triggerConstants.floatTimeCheck();
                        } else if (adventureVariables.specialty === 'Workshop') {
                            if (battleVariables.burstAttack !== null) {
                                canvas.brightness -= (brightnessIncrement * (speedUpFactor - 1) + brightnessIncrement * 0.75);
                            } else {
                                battleVariables.deflectTime += brightnessIncrement * 2 * speedUpFactor;
                                if (battleVariables.bossHealth <= CONSTANTS.WORKSHOP_THRESHOLD) {
                                    canvas.brightness -= brightnessIncrement * 0.25;

                                    battleVariables.burstTime += brightnessIncrement * 0.2;
                                    battleVariables.quicktime -= brightnessIncrement * (speedUpFactor - 1);
                                    battleVariables.triggerConstants.burstTimeCheck();
                                } else {
                                    battleVariables.quicktime += brightnessIncrement * 0.15;
                                    canvas.brightness += brightnessIncrement * 0.25;
                                }
                            }
                        } else if (adventureVariables.specialty === 'Finale') {
                            if (battleVariables.floatTime !== null) {
                                battleVariables.floatTime += brightnessIncrement * 0.3;
                                battleVariables.triggerConstants.floatTimeCheck();
                            }
                            
                            if (battleVariables.deflectTime !== null) {
                                battleVariables.deflectTime += brightnessIncrement * 2.3;
                            }

                            if (battleVariables.eatTime !== null) {
                                battleVariables.summonTime += (brightnessIncrement * speedUpFactor * 0.2);
                                if (battleVariables.currentEaten === null) {
                                    battleVariables.eatTime += brightnessIncrement * 10.3;
                                } else {
                                    battleVariables.eatTime += brightnessIncrement * 0.3;
                                }
                            
                                battleVariables.triggerConstants.eatTimeCheck();
                            }
                        }
                    }

                    battleVariables.triggerConstants.quicktimeCheck();
                    battleVariables.triggerConstants.summonMob();
                    if (canvas.brightness < 0.8 && adventureVariables.currentEnemyAmount > 1 && !mobDiv.classList.contains('megaboss')) mobDiv.guardStance(mobDiv,"check");
                }

                // IF THERES DECOYS AND THAT IT IS NOT THE CHOSEN DECOY, THE CANVAS IGNORES THE ATTACK
                attack: if (canvas.attackState) {
                    if (battleVariables.decoyNumber !== null) {
                        if (battleVariables.decoyNumber != mobDiv.decoyNumber) {
                            break attack;
                        } else {
                            const enemyEle = document.querySelectorAll('.enemy');
                            Array.from(enemyEle).forEach((ele) => {
                                const eleCanvas = ele.querySelector('.atk-indicator');
                                eleCanvas.attackState = false;
                                eleCanvas.brightness = 0;
                                setTimeout(() => {
                                    // DOUBLE ENSURES CANVAS STATE IS REMOVED
                                    eleCanvas.attackState = false;
                                    eleCanvas.brightness = 0;
                                }, 150);
                            });
                            
                        }
                    }

                    if (mobAtkIndicator.doubleAtk == true) {
                        mobAtkIndicator.doubleAtk = false;
                        mobAtkIndicator.src = `./assets/icon/atkIndicator${adventureScaraText}.webp`;
                        canvas.style.animation = ``;
                        void canvas.offsetWidth;
                    } else if (mobAtkIndicator.doubleAtk == "parry") {
                        mobAtkIndicator.doubleAtk = true;
                    } else if (battleVariables.deflectTime !== null && battleVariables.deflectTime > 1 && battleVariables.burstAttack === null) {
                        mobDiv.deflectStance();
                    } else if (!(guardCheck()) || adventureVariables.specialty === 'FellBoss') {
                        mobDiv.doubleAttack();
                    }

                    const evadeRoll = randomInteger(1,101);
                    let evadeMax = -1;
                    if (advDict.rankDict[19] === true) {
                        evadeMax = 15;
                    } else if (advDict.rankDict[13] === true) {
                        evadeMax = 10;
                    } else if (advDict.rankDict[6] === true) {
                        evadeMax = 5;
                    }

                    if (battleVariables.burstAttack !== null && mobDiv.classList.contains('megaboss')) {
                        battleVariables.triggerConstants.burstTimeEnd();
                    } else {
                        if ((evadeRoll <= evadeMax && !decoy) || battleVariables.iframe === true) {
                            Battle.createBattleText("dodge", animationTime * 150 * 2, mobDiv);
                        } else {
                            if (canvas.burstMode) {
                                const energyBurst = document.getElementById('energy-ball');
                                energyBurst.startingValue++;
                                energyBurst.changeValue();

                                Battle.createBattleText("chargedMiss", animationTime * 150 * 2, mobDiv);
                            } else {
                                let mobAtk = mobHealth.atk;
                                Battle.comboHandler("reset");
                                if (battleVariables.decoyNumber !== null) { mobAtk += 1}
                                loseHP(mobAtk, "normal", false, 'normal attack');
                            }
                        }
                    }
                    
                    canvas.attackState = false;
                }

                if (decoy) {
                    canvas.brightness = battleVariables.decoyTime;
                } else if (canvas.deflecting) {
                    canvas.brightness += 0.3 * brightnessIncrement;
                }

                if (canvas.brightness > maxBrightness) {
                    if (canvas.classList.contains("attack-ready")) {canvas.classList.remove("attack-ready")}
                    if (canvas.classList.contains("decoy-ready")) {canvas.classList.remove("decoy-ready")}
                    canvas.attackState = true;
                    canvas.brightness = 0;
                    canvas.style.transform = ``;
                    canvas.style.filter = `brightness(0)`;

                    if (battleVariables.decoyNumber !== null) {
                        if (battleVariables.decoyNumber == mobDiv.decoyNumber) {
                            setTimeout(() => {
                                let randomRoll = randomInteger(1, 4);
                                while (battleVariables.decoyNumber == randomRoll) {
                                    randomRoll = randomInteger(1, 4);
                                }
                                battleVariables.decoyNumber = randomRoll;
                            }, 150);
                        }

                        mobAtkIndicator.src = (`./assets/icon/atkIndicator${adventureScaraText}.webp`);
                        decoyLoad = true;
                    }
                } else if (canvas.brightness > 0.8) {
                    if (battleVariables.decoyTime != null) {
                        if (battleVariables.decoyNumber && battleVariables.decoyTime > 0.8) {
                            decoyLoad = true;

                            if (battleVariables.decoyNumber == mobDiv.decoyNumber) {
                                if (!mobAtkIndicator.src.includes(`/assets/icon/atkIndicator${adventureScaraText}.webp`)) {
                                    mobAtkIndicator.src = `./assets/icon/atkIndicator${adventureScaraText}.webp`;
                                    canvas.style.transform = ``;
                                }

                                if (!canvas.classList.contains("attack-ready")) {
                                    canvas.classList.add("attack-ready");
                                }
                            } else if (battleVariables.decoyNumber != mobDiv.decoyNumber && !mobAtkIndicator.src.includes(`/assets/icon/fakeAtk.webp`)) {
                                mobAtkIndicator.src = `./assets/icon/fakeAtk.webp`;
                                canvas.classList.add("decoy-ready");
                                canvas.style.transform = ``;
                            }

                            canvas.style.transform = `scale(1.2)`;
                            canvas.style.filter = `brightness(0.99) contrast(1.5) drop-shadow(0 0 5px #ffffff) drop-shadow(0 0 4px #ffffff)`;
                        } else if (battleVariables.decoyTime < 0.2) {
                            if (canvas.classList.contains("decoy-ready")) {canvas.classList.remove("decoy-ready")};
                            if (!mobAtkIndicator.src.includes(`/assets/icon/atkIndicator${adventureScaraText}.webp`)) {
                                mobAtkIndicator.src = `./assets/icon/atkIndicator${adventureScaraText}.webp`;
                            }
                            
                            canvas.brightness = 0;
                            canvas.style.transform == ``;
                            canvas.style.filter = `brightness(${canvas.brightness})`;
                        }
                    } else {
                        if (canvas.style.transform == ``) {
                            canvas.style.transform = `scale(1.2)`;
                            canvas.style.filter = `brightness(0.99) contrast(1.5) drop-shadow(0 0 5px #ffffff) drop-shadow(0 0 4px #ffffff)`;
                            canvas.classList.add("attack-ready");
                        }
                    }
                } else {
                    if (canvas.style.transform != ``) {
                        canvas.style.transform = ``;
                        if (canvas.classList.contains("attack-ready")) {canvas.classList.remove("attack-ready")};
                        if (canvas.classList.contains("decoy-ready")) {canvas.classList.remove("decoy-ready")};
                    }

                    if (mobAtkIndicator.doubleAtk == false && mobAtkIndicator.defence == false && canvas.deflecting !== true && battleVariables.burstAttack === null) {
                        if (!mobAtkIndicator.src.includes(`/assets/icon/atkIndicator${adventureScaraText}.webp`)) {
                            mobAtkIndicator.src = `./assets/icon/atkIndicator${adventureScaraText}.webp`;
                        }
                    }

                    canvas.style.filter = `brightness(${canvas.brightness})`;
                }
            }
            window.requestAnimationFrame(increaseBrightness);
        }
    }

    // CHECK IF THERE IS CURRENTLY A GUARD AND THAT THE GUARD IS NOT THE MOB ITSELF
    function guardCheck() {
        return !(battleVariables.defenseMob != mobDiv && battleVariables.defenseMob != null)
    }

    // MOB NEXT ATTACK IS DOUBLE ATTACK
    function doubleAttack() {
        if (battleVariables.doubleAtkCooldown === null) {return}
        if (battleVariables.doubleAtkCooldown > 1) {
            battleVariables.doubleAtkCooldown -= 1;
        } else {
            battleVariables.doubleAtkCooldown = 5;
            if (adventureVariables.specialty === 'FellBoss') {
                battleVariables.doubleAtkCooldown = 2;
            }

            mobAtkIndicator.doubleAtk = "parry";
            mobAtkIndicator.src = `./assets/icon/doubleAtk.webp`;
            canvas.style.animation = `tada ${randomInteger(12,18)/10}s linear`;
        }
    }

    // MOB CHANGES INTO DEFENSE STANCE
    function guardStance(mobDiv, type) {
        if (battleVariables.guardtime === null) {return}
        if (type === "exit") {
            battleVariables.defenseMob = null;
            battleVariables.guardtime = 0;
            mobAtkIndicator.defence = false;

            canvas.brightness = 0.25;
            canvas.style.animation = ``;
            void canvas.offsetWidth;
            mobAtkIndicator.src = `./assets/icon/atkIndicator${adventureScaraText}.webp`;
        } else if (type === "check") {
            if (!(battleVariables.defenseMob)) {
                if (battleVariables.guardtime >= (2.5 * adventureVariables.currentEnemyAmount * 0.75) && battleVariables.currentEaten !== mobDiv) {
                    let guardRoll = randomInteger(1,101);
                    if (guardRoll > 1) {
                        battleVariables.defenseMob = mobDiv;
                        battleVariables.guardtime = 0;

                        mobAtkIndicator.defence = true;
                        mobAtkIndicator.src = `./assets/icon/shield.webp`;
                        canvas.style.animation = `tada ${randomInteger(12,18)/10}s linear`;
                    }
                }
            }
        } else if (type === "refresh") {
            if (battleVariables.guardtime >= (2.5 * adventureVariables.currentEnemyAmount * 0.75)) {
                guardStance(mobDiv, "exit");
                return;
            }
        }
    }

    // CHANGES TO DEFLECT STANCE
    function deflectStance() {
        if (battleVariables.currentDeflect === null && canvas.eaten === false && (mobHealth.health / mobHealth.maxHP) > 0.35) {
            battleVariables.deflectTime = 0;
            battleVariables.currentDeflect = mobDiv;
            canvas.deflecting = true;

            mobAtkIndicator.src = `./assets/icon/chargedAtk.webp`;
            canvas.style.animation = `tada ${randomInteger(12,18)/10}s linear`;
            canvas.addEventListener('animationend', () => {
                canvas.style.animation = '';
                void canvas.offsetWidth;
            }, { once: true });
        } else {
            battleVariables.deflectTime *= 0.75;
        }
    }

    const updateMobHealth = () => {
        if (mobHealth.health <= 0) {
            killMob(mobDiv, mobHealth);
        }

        let newHealth = Math.round(mobHealth.health/mobHealth.maxHP * 10000)/100;
        mobHealth.style.width = `${newHealth}%`
        if (mobDiv.classList.contains('megaboss')) {bossUpdate(newHealth)};
    }

    const parriedCorrectly = (attackMultiplier, guardCheckBool, type) => {
        canvas.attackState = false;
        canvas.classList.remove("attack-ready");
        enemyImg.classList.add("staggered");
        
        setTimeout(() => {
            enemyImg.classList.remove("staggered");
        }, Math.max(animationTime * 150, 500));

        if (battleVariables.decoyNumber != null) {
            canvas.brightness = 0 - (randomInteger(0,10) / 10);
            const allCanvas = document.getElementById('adventure-video').querySelectorAll('atk-indicator');
            allCanvas.forEach((canvas) => {
                canvas.brightness = 0;
            })
        } else {
            switch (type) {
                case 'strong':
                    canvas.brightness = 0 - randomInteger(10, 20) / 10;
                    break;
                case 'weak':
                    canvas.brightness = 0 + randomInteger(10, 30) / 10;
                    break;
                default:
                    canvas.brightness = 0;
                    break;
            }
        }

        if (canvas.burstMode === true) {
            attackMultiplier *= 0.65;
            canvas.brightness -= randomInteger(0, 15) / 10;
        }
        
        canvas.style.transform = ``;
        canvas.style.filter = `brightness(0)`;

        if (mobAtkIndicator.doubleAtk === true) {
            mobAtkIndicator.doubleAtk = false;
            mobAtkIndicator.src = `./assets/icon/atkIndicator${adventureScaraText}.webp`;

            canvas.style.animation = ``;
            void canvas.offsetWidth;
        } else if (mobAtkIndicator.doubleAtk == "parry") {
            mobAtkIndicator.doubleAtk = true;
        }
        
        // CHECKS IF SKILL MARKED
        if (enemyImg.querySelector('.skill-mark')) {
            if (guardCheckBool) {
                mobHealth.health -= (battleVariables.currentATK * attackMultiplier);
                loseHP(type === 'strong' ? 1 : 0.5, "inverse");
            } else {
                mobHealth.health -= (battleVariables.currentATK * attackMultiplier * 0.25);
            }

            enemyImg.querySelector('.skill-mark').remove()

            const cooldown = document.getElementById('adventure-cooldown-1');
            cooldown.amount += 15;
        }

        // CHECKS IF THERE IS AN ACTIVE GUARD
        if (guardCheckBool) {
            mobHealth.health -= (battleVariables.currentATK * attackMultiplier);
            battleVariables.burstAttack === null ? loseHP(1, "inverse") : null;

            switch (type) {
                case 'strong':
                    Battle.createBattleText("strongCounter", animationTime * 150 * 2, mobDiv);
                    break;
                case 'weak':
                    Battle.createBattleText("weakCounter", animationTime * 150 * 2, mobDiv);
                    break;
                default:
                    Battle.createBattleText("counter", animationTime * 150 * 2, mobDiv);
                    break;
            }

            if (battleVariables.deflectTime !== null && battleVariables.deflectTime > 1 && battleVariables.burstAttack === null) {
                mobDiv.deflectStance();
            }
        } else {
            mobHealth.health -= (battleVariables.currentATK * attackMultiplier * 0.25);
            Battle.createBattleText("guard", animationTime * 150 * 2, mobDiv);
        }

        if (advDict.rankDict[10] === true) {
            const cooldown = document.getElementById('adventure-cooldown-3');
            if (adventureVariables.specialty === 'Unusual') {
                cooldown.amount += 15;
            } else {
                cooldown.amount += 20 + (adventureVariables.skirmish ? 5 : 0);
            }
        }

        // CHECKS IF DECOYS ARE PRESEENT
        if (battleVariables.decoyTime != null) {
            const enemyEle = document.querySelectorAll('.enemy');
            Array.from(enemyEle).forEach((ele) => {
                const eleCanvas = ele.querySelector('.atk-indicator');
                eleCanvas.brightness = 0;
                eleCanvas.attackState = false;
            });
            battleVariables.decoyTime = 0;

            setTimeout(() => {
                let randomRoll = randomInteger(1, 4);
                while (battleVariables.decoyNumber == randomRoll) {
                    randomRoll = randomInteger(1, 4);
                }
                battleVariables.decoyNumber = randomRoll;
                battleVariables.decoyTime = 0;
            }, 150);
        }
        
        parrySuccess.load();
        parrySuccess.play();
        Battle.comboHandler("add");
    }

    const clickMob = () => {
        if (!adventureVariables.fightSceneOn || mobHealth.dead || battleVariables.quicktimeAttack || canvas.paused) {return}
        
        let attackMultiplier = 1;
        const guardCheckBool = guardCheck();

        // CHECK IF PARRY IS BEING USED
        if (document.getElementById('select-indicator')) {
            if (activeLeader == "Ei") {attackMultiplier = 2.00}
            // IF TIMING WAS CORRECT
            if (canvas.classList.contains("attack-ready")) {
                // FOR WHEN DEFLECTION IS AVAILABLE (OVERRIDES EATEN)
                if (canvas.deflecting === true) {
                    canvas.deflecting = false;
                    battleVariables.currentDeflect = null;

                    let cooldown = document.getElementById('adventure-cooldown-1');
                    cooldown.amount -= 100;
                    dodgeOn("close");

                    battleVariables.deflectTime = 0;
                    canvas.paused = true;
                    canvas.style.display = 'none';

                    let barWidth = 75 - Math.floor((mobHealth.health / mobHealth.maxHP) / 0.20) * 10;
                    if (battleVariables.bossHealth <= CONSTANTS.WORKSHOP_THRESHOLD) {
                        barWidth = Math.max(barWidth, 40);
                    }
                    const leftRoll = randomInteger(5, 95 - barWidth);

                    const counterBar = createDom('div', {
                        style: {
                            position: 'absolute',
                            top: 0,
                            left: leftRoll + '%',
                            width: barWidth + '%',
                            height: '100%',
                            backgroundColor: adventureScaraText === '-scara' ? '#333455' : '#2E510C',
                        }
                    });

                    const counterImg = createDom('img', {
                        class: ['counter-img'],
                        src: `./assets/icon/selectIndicator${adventureScaraText}.webp`,
                        style: {
                            left: 0,
                        }
                    });
                    
                    const removeCounter = () => {
                        counterBar.remove();
                        counterImg.remove();
                        counterButton.remove();

                        canvas.paused = false;
                        canvas.style.display = 'block';
                    };

                    const interval = Math.floor(1000 / FRAMES_PER_SECOND);
                    let previousTime = performance.now();
                    let currentTime = 0;
                    let deltaTime = 0;

                    let thresholdReached = 5;
                    let directionRight = true;
                    let progress = 0;
                    const speedUpFactor = 3.0 - Math.floor((mobHealth.health / mobHealth.maxHP) / 0.20) * 0.25;
            
                    function animateMovement(timestamp) {
                        currentTime = timestamp;
                        deltaTime = currentTime - previousTime;
                        
                        if (deltaTime > interval) {
                            if (!canvas.paused) {
                                return
                            } else if (battleVariables.quicktimeAttack) {
                                window.requestAnimationFrame(animateMovement);
                                return;
                            };

                            if (directionRight) {
                                progress += 0.4 * speedUpFactor * Math.max(progress / 50, 1);
                            } else {
                                progress -= 0.4 * speedUpFactor * Math.max(2 - progress / 50, 1); 
                            }

                            if ((progress > 100 && directionRight) || (progress < -1 && !directionRight)) {
                                directionRight = !directionRight;
                                thresholdReached--;

                                if (thresholdReached <= 0) {
                                    mobHealth.health -= battleVariables.currentATK * 0.5;

                                    removeCounter();
                                    parriedCorrectly(attackMultiplier, guardCheckBool, 'weak');
                                    updateMobHealth();
                                }
                            }

                            counterImg.style.left = progress + '%';
                        }
                    
                        window.requestAnimationFrame(animateMovement);
                    }
                    window.requestAnimationFrame(animateMovement);

                    const counterButton = createDom('button', {
                        class:['counter-button']
                    })

                    counterButton.addEventListener('click', () => {
                        mobHealth.health -= battleVariables.currentATK * 0.5;
                        removeCounter();
                        
                        if (progress >= leftRoll && progress <= (leftRoll + barWidth)) {
                            mobHealth.health -= battleVariables.currentATK * 0.5;
                            parriedCorrectly(attackMultiplier, guardCheckBool, 'strong');
                        } else {
                            parriedCorrectly(attackMultiplier, guardCheckBool, 'weak');
                        }

                        updateMobHealth();
                    }, { once: true})

                    mobHealth.append(counterBar, counterImg);
                    mobDiv.appendChild(counterButton);
                    return;
                } else {
                    parriedCorrectly(attackMultiplier, guardCheckBool);
                }
            } else if (canvas.classList.contains("decoy-ready")) {
                Battle.createBattleText("deflect", animationTime * 150 * 2, mobDiv);
                loseHP(mobHealth.atk, "normal", false, 'decoy');

                parryFailure.load();
                parryFailure.play();
                Battle.comboHandler("reset");

                if (advDict.rankDict[10] === true) {
                    const cooldown = document.getElementById('adventure-cooldown-3');
                    cooldown.amount += 15;
                }
            } else {
                enemyImg.classList.add("damaged");
                setTimeout(() => {enemyImg.classList.remove("damaged")}, Math.max(animationTime * 150, 500));

                parryFailure.load();
                parryFailure.play();
                Battle.comboHandler("reset");
                if (advDict.rankDict[10] === true) {
                    const cooldown = document.getElementById('adventure-cooldown-3');
                    cooldown.amount += 10;
                }
            }

            if (guardCheckBool) {
                mobHealth.health -= battleVariables.currentATK;
                if (adventureVariables.specialty === 'FellBoss') {
                    mobDiv.doubleAttack();
                }
            } else {
                mobHealth.health -= (battleVariables.currentATK * 0.25);
                Battle.createBattleText("guard", animationTime * 150 * 2, mobDiv);
                mobDiv.doubleAttack();
                if (advDict.rankDict[10] === true) {
                    const cooldown = document.getElementById('adventure-cooldown-3');
                    cooldown.amount += 10;
                }
            }

            let cooldown = document.getElementById('adventure-cooldown-1');
            cooldown.amount -= 100;
            dodgeOn("close");
        } else {
            // NO PARRY IS BEING USED
            attackMultiplier = Battle.comboHandler("check", attackMultiplier);

            if (mobDiv.classList.contains('megaboss')) {
                if (adventureVariables.specialty === 'Unusual') {
                    attackMultiplier *= (battleVariables.bossHealth > CONSTANTS.UNUSUAL_THRESHOLD) ? 2.25 : 1.75;
                } else if (mobDiv.querySelector('.health-shield') !== null) {
                    attackMultiplier *= 0.15;
                }
            } else if (canvas.burstMode) {
                attackMultiplier *= 0.35;
            }

            if (guardCheckBool) {
                mobHealth.health -= (((battleVariables.currentATK + adventureVariables.nahidaMultiplier) * attackMultiplier * specialClick)/ 5);
            } else {
                mobHealth.health -= (((battleVariables.currentATK + adventureVariables.nahidaMultiplier) * attackMultiplier * specialClick)/ 5 * 0.25);
            }
            attackMultiplier = 1;
        }

        updateMobHealth();
    }

    enemyImg.addEventListener("click", () => {
        clickMob();
    })

    if (decoy) {
        mobDiv.append(canvas);
    } else {
        mobDiv.append(mobHealth, canvas);
    }
}

function bossUpdate(updatedHealth) {
    battleVariables.bossHealth = updatedHealth;

    const changeAnimation = (phase) => {
        const specialty = adventureVariables.specialty;

        const adventureVideo = document.getElementById('adventure-video');
        const bossEle = adventureVideo.querySelector('.megaboss');
        bossEle.children[0].style.backgroundImage = `url(./assets/expedbg/enemy/${specialty}-Megaboss-${phase}.webp)`;
        bossEle.children[0].style.animation = `unset`;

        bossEle.style.animation = 'unset';
        void bossEle.children[0].offsetWidth;
        bossEle.children[0].style.animation = 'vibrate 0.8s linear';

        if (specialty === 'FellBoss' || specialty === 'Workshop') {
            const bossHealth = bossEle.querySelector('.health-bar, .health-bar-scara');

            if (specialty === 'FellBoss') {
                bossHealth.style.backgroundImage = 'linear-gradient(to right, #272400, #FEE651)';
                bossHealth.style.border = '0.1em outset #897C04';

                const healthShield = createDom('img', { src: './assets/icon/health-shield.webp', class:['health-shield']});
                bossHealth.appendChild(healthShield);
            } else {
                bossHealth.style.backgroundImage = 'linear-gradient(to right, #411758, #CCACE2)';
                bossHealth.style.border = '0.1em outset #462B63';

                const healthShield = createDom('img', { src: './assets/icon/health-shield-workshop.webp', class:['health-shield']});
                bossHealth.appendChild(healthShield);

                bossEle.classList.remove('wide-enemy');
                battleVariables.triggerConstants.summonMob('Workshop');
            }

            bossEle.addEventListener('animationend', () => {
                setTimeout(() => {
                    bossEle.children[0].style.animation = `unset`;
                    bossEle.style.animation = 'unset';
                    void bossEle.children[0].offsetWidth;
                    bossEle.children[0].style.animation = `vibrate ${randomInteger(2000,2400) / 100}s linear infinite both`;
                });
            }, { once: true });
        } else if (specialty === 'Unusual' || specialty === 'Finale') {
            const minionEle = adventureVideo.querySelectorAll('.minion > .health-bar');
            minionEle.forEach((ele) => {
                ele.dead = true;
            })

            const decoyEle = adventureVideo.querySelectorAll('.decoy, .minion');
            decoyEle.forEach((ele) => {
                ele.remove();
                adventureVariables.currentEnemyAmount--;
            })

            if (specialty === 'Finale') {
                bossEle.addEventListener('animationend', () => {
                    setTimeout(() => {
                        bossEle.children[0].style.animation = `unset`;
                        bossEle.style.animation = 'unset';
                        void bossEle.children[0].offsetWidth;
                        bossEle.children[0].style.animation = `vibrate ${(4 - phase) * randomInteger(400, 600) / 100}s linear infinite both`;
                    });
                }, { once: true });
            }
        }
    }

    if (adventureVariables.specialty === 'Unusual' && updatedHealth <= CONSTANTS.UNUSUAL_THRESHOLD) {
        if (battleVariables.summonTime === null) {
            battleVariables.summonTime = 0;
            battleVariables.decoyTime = null;
            battleVariables.decoyNumber = null;
            setTimeout(() => { battleVariables.decoyTime = null }, 500);
            changeAnimation(2);
        }
    } else if (adventureVariables.specialty === 'FellBoss' && updatedHealth <= CONSTANTS.FELLBOSS_THRESHOLD) {
        if (battleVariables.rainTime === null) {
            battleVariables.rainTime = 0;
            setTimeout(() => { battleVariables.rainTime = 0 }, 500);
            changeAnimation(2);
        }
    } else if (adventureVariables.specialty === 'Workshop' && updatedHealth <= CONSTANTS.WORKSHOP_THRESHOLD) {
        if (battleVariables.chargeTime === null) {
            battleVariables.chargeTime = 0;
            setTimeout(() => { battleVariables.chargeTime = 0 }, 500);
            changeAnimation(2);
        } else if (updatedHealth <= 0) {
            winAdventure();
        }
    } else if (adventureVariables.specialty === 'Finale' && updatedHealth <= CONSTANTS.FINALE_THRESHOLD) {
        if (updatedHealth <= CONSTANTS.FINALE_THRESHOLD_TWO) {
            if (updatedHealth <= 0) {
                winAdventure();
            } else if (battleVariables.summonTime === null) {
                battleVariables.summonTime = 0;
                battleVariables.eatTime = 0;

                changeAnimation(3);
            }
        } else {
            if (battleVariables.summonTime !== null) {
                battleVariables.summonTime = null;
                battleVariables.floatTime = 0;
                battleVariables.deflectTime = 10;
                battleVariables.doubleAtkCooldown = null;

                changeAnimation(2);

                if (battleVariables.defenseMob) {
                    const mobDiv = battleVariables.defenseMob;
                    mobDiv.guardStance(mobDiv, "exit");
                }
                battleVariables.defenseMob = null;

                setTimeout(() => {battleVariables.floatTime = 10}, 3000)
            }
        }
    }
}

function summonBattleFloat(HP, initialFactor, ignoreSpace = false) {
    const adventureVideo = document.getElementById('adventure-video');
    if (!adventureVariables.fightSceneOn) {
        let targetElements = adventureVideo.querySelectorAll('.raining-image');
        targetElements.forEach((item) => {
            item.remove();
        });
        return;
    }

    let sizeVariable = 27.5;
    if (battleVariables.floatNumber > 10) {
        return;
    } else if (adventureVariables.specialty === 'Finale' && battleVariables.bossHealth <= CONSTANTS.FINALE_THRESHOLD_TWO) {
        sizeVariable *= 1.1;
    }

    let speedUpFactor = 1;
    const popImage = createDom('img', {
        src: './assets/expedbg/core.webp',
        class: ['raining-image', 'combat-pop-up'],
        clicked: false,
        HP: HP,
        rotationNumber: 0,
        style: {
            left: (ignoreSpace ? randomInteger(0, 85) : randomInteger(0, 85, [33, 60])) + '%',
            top: randomInteger(20, 60) + '%',
            height: sizeVariable + '%',
        }
    });

    popImage.addEventListener('animationend', () => {
        popImage.style.pointerEvents = 'auto';
        if (adventureVariables.specialty === 'Finale') {
            popImage.style.animation = 'unset';
            void popImage.offsetWidth;
            popImage.style.animation = `horizontalSway ${randomInteger(15, 30) / 10}s ease-in-out infinite`
        }

        window.requestAnimationFrame(animateSpin);
    }, { once: true });

    popImage.addEventListener('click', () => {
        if (popImage.clicked) {return}
        popImage.HP--;
        
        if (popImage.HP <= 0) {
            popImage.clicked = true;
            popImage.remove();
            battleVariables.floatNumber--;
        } else if (popImage.HP === 2) {
            speedUpFactor = 1.5;
            popImage.src = './assets/expedbg/core-dmg.webp';
        }
    })

    const interval = Math.floor(1000 / FRAMES_PER_SECOND);
    let previousTime = performance.now();
    let currentTime = 0;
    let deltaTime = 0;

    function animateSpin(timestamp) {
        if (popImage.clicked) {return};

        currentTime = timestamp;
        deltaTime = currentTime - previousTime;
        
        if (deltaTime > interval && !battleVariables.quicktimeAttack) {
            if (popImage.rotationNumber > 720) {
                if (!adventureVariables.fightSceneOn) {
                    if (popImage) popImage.remove();
                    return;
                }
                popImage.rotationNumber = 0;
                loseHP(0.5, 'normal', false, 'magic circle');
                Expedition.sapEnergy(1, 25);
            } else {
                popImage.style.transform = `rotateZ(${popImage.rotationNumber}deg)`;
                popImage.rotationNumber += 1 * initialFactor * speedUpFactor;
            }
        }
    
        window.requestAnimationFrame(animateSpin);
    }
    
    battleVariables.floatNumber++;
    adventureVideo.appendChild(popImage);
}

function quicktimeEvent(waveQuicktime, advLevel, variant) {
    if (!adventureVariables.fightSceneOn) {return}
    if (disableQuicktime) {return}
    battleVariables.quicktimeAttack = true;

    let quicktimeBar = document.createElement("div");
    const videoOverlay = document.createElement("div");
    videoOverlay.id = "quicktime-overlay";
    videoOverlay.classList.add("flex-column");

    const adventureText = document.getElementById('adventure-text');
    const textOverlay = document.createElement("div");
    textOverlay.id = 'text-overlay';
    textOverlay.classList.add("text-overlay","cover-all","flex-row");

    const adventureVideo = document.getElementById('adventure-video');
    if (variant === '-cytus') {
        let usedDict = enemyInfo.skirmishCytusDict;
        if (adventureVariables.specialty === 'Workshop') {
            usedDict = battleVariables.bossHealth <= CONSTANTS.WORKSHOP_THRESHOLD ? enemyInfo.hardCytusDict : enemyInfo.easyCytusDict;
        } else if (adventureVariables.specialty === 'Finale') {
            usedDict = battleVariables.lastStand ? enemyInfo.veryHardCytusDict : enemyInfo.finaleCytusDict;
        }
        quicktimeBar = Battle.cytusQuicktime(quicktimeBar, textOverlay, usedDict, quitQuicktime, adventureScaraText, battleVariables, adventureVariables, bossUpdate);
    } else if (variant === '-rain') {
        const textBox = document.getElementById('fight-text');
        textBox.innerText = 'The Fellflower is dazed! Avoid all the spikes while catching all the falling spores!';

        const bossEle = adventureVideo.querySelector('.megaboss');
        bossEle.children[0].style.backgroundImage = `url(./assets/expedbg/enemy/FellBoss-Megaboss-3.webp)`;
        bossEle.children[0].style.animation = `unset`;
        void bossEle.children[0].offsetWidth;

        const bossEleCanvas = bossEle.querySelector('.atk-indicator');
        bossEleCanvas.brightness *= 0.5;
        bossEleCanvas.style.filter = `brightness(${bossEleCanvas.brightness})`;

        const bossHealth = bossEle.querySelector('.health-bar')
        bossHealth.style.backgroundImage = 'unset';
        bossHealth.style.border = '0.1em outset #2E510C';
        bossHealth.children[0].style.display = 'none';

        videoOverlay.style.backgroundColor = `rgb(0 0 0 / 65%)`;

        let spikeCaught = 0;
        let pollenCaught = 0;
        let minPollen = 0;

        const spawnRain = () => {
            let animation = `rain-rotate ${(randomInteger(65, 95) / 20)}s linear forwards`;
            let type = randomInteger(1,101);

            if (minPollen > 3) {
                type = 100;
            }

            const img = document.createElement("img");
            img.classList.add("raining-image");

            if (type < 50) {
                img.src = "./assets/expedbg/spike.webp";
                img.classList.add("raining-quicktime");

                img.addEventListener('click', () => {
                    spikeCaught++;
                    minPollen++;
                    weaselDecoy.load();
                    weaselDecoy.play();

                    img.style.pointerEvents = 'none';
                    img.style.animationPlayState = 'paused';
                    img.style.filter = `blur(0.5em) opacity(0)`;

                    setTimeout(() => {img.remove()}, 500)
                }, { once: true });
            } else {
                animation = `rain-rotate ${(randomInteger(65, 80) / 20)}s linear forwards`
                minPollen = 0;
                img.src = "./assets/expedbg/pollen.webp";

                img.addEventListener('click', () => {
                    pollenCaught++;
                    img.remove();
                }, { once: true });
            }

            img.style.top = "-25%";
            img.style.left = `${randomInteger(5, 90)}%`
            img.style.animation = animation;

            img.addEventListener('animationend', () => {img.remove()});
            videoOverlay.append(img);
        }
    
        const rainTimer = setInterval(() => {
            spawnRain();
        }, randomInteger(225, 275));
    
        setTimeout(() => {
            clearInterval(rainTimer);
            setTimeout(() => {
                textBox.innerText = 'Prepare for a fight!';
                bossEle.children[0].style.backgroundImage = `url(./assets/expedbg/enemy/FellBoss-Megaboss-2.webp)`;
                bossEle.children[0].style.animation = `vibrate ${randomInteger(2000,2400) / 100}s linear infinite both`;

                bossHealth.style.backgroundImage = 'linear-gradient(to right, #272400, #FEE651)';
                bossHealth.style.border = '0.1em outset #897C04';
                bossHealth.children[0].style.display = 'block';

                setTimeout(() => { battleVariables.quicktimeAttack = false }, 300);
                videoOverlay.remove();

                loseHP(spikeCaught, 'normal', 'false', 'spike');
                Expedition.sapEnergy(spikeCaught, 50);

                bossHealth.health -= (bossHealth.maxHP / 100 * Math.min((pollenCaught * 1), 15));
                if (bossHealth.health <= 0) {bossHealth.health = 1;}

                let newHealth = Math.round(bossHealth.health / bossHealth.maxHP * 10000)/100;
                bossHealth.style.width = `${newHealth}%`
                bossUpdate(newHealth);
            }, 2000);
        }, 8000)
    } else if (variant === '-osu') {
        const textBox = document.createElement('p');
        textBox.innerText = "Counter the attacks at the right time!";
        textOverlay.appendChild(textBox);

        quicktimeBar.id = "quicktime-bar";
        quicktimeBar.state = null;
        quicktimeBar.classList.add("flex-row","quicktime-block");

        const quickImg = createDom('img');
        quickImg.src = "./assets/expedbg/quicktime-block.webp";
        quickImg.classList.add("cover-all");
        quickImg.style.zIndex = 1;

        const quicktimeOsu = createDom('div', { class: ['quicktime-osu'] });
        quicktimeBar.append(quickImg, quicktimeOsu);

        let currentCellNumber = 0;     
        let placeholderTiming = 0;
        let reverseMode = randomInteger(1, 3) === 1 ? false : true;
        let mirrorMode = randomInteger(1, 3) === 1 ? false : true;

        // FORMAT: LEFT, TOP, TIMING (MS), DELAY (MS)
        let speedUpFactor = 1;
        if (adventureVariables.specialty === 'Finale') {
            speedUpFactor += 0.125;
        } else if (adventureVariables.skirmish) {
            speedUpFactor += 0.075;
        } 

        const posArray = rollArray(MOBILE ? enemyInfo.hardOsuArray : enemyInfo.easyOsuArray)
        let maxBeat = posArray.length;
        let correctBeat = 0;

        const addBeat = (pos, index, timing) => {
            const beatImg = createDom('button', { 
                class: ['osu-beat'],
                clicked: false,
                style: {
                    right: mirrorMode ? `${pos[0]}%` : 'unset',
                    left: mirrorMode ? 'unset': `${pos[0]}%`,
                    top: `${pos[1]}%`,
                    zIndex: (100 - index),
                    animation: `fadeOutCritOpacity ${timing * 3}ms linear reverse`,
                },
            });

            const beatGradient = createDom('div', { 
                class:['cover-all', 'osu-grad'], 
                gradColor: 0, 
                style: {
                    background: `linear-gradient(to top, #ffffff00, #ffffff00 0%, #333333b8 0%)`,
                }  
            });

            const mistimeBeat = () => {
                beatImg.clicked = true;
                beatImg.style.pointerEvents = 'none';

                const cross = createDom('img', { 
                    src: './assets/event/cross.webp', 
                    class:['osu-cross'],
                    style: {
                        right: mirrorMode ? `${pos[0]}%` : 'unset',
                        left: mirrorMode ? 'unset': `${pos[0]}%`,
                        top: `${pos[1]}%`,
                        zIndex: 10,
                        animation: `slideOutOsu ${Math.min(timing * 2, 1200)}ms linear forwards`,
                    }
                });

                cross.addEventListener('animationend', () => {
                    cross.remove();
                });

                quicktimeOsu.append(cross);

                beatImg.style.animation = '';
                void beatImg.offsetWidth;
                beatImg.style.animation = `puffOutSmall ${timing}ms linear forwards`;
                beatImg.addEventListener('animationend', () => {
                    beatImg.remove();
                });
            }

            if (!reverseMode && pos[3]) {
                currentCellNumber = 1;
            } else if (reverseMode && placeholderTiming > 0){
                currentCellNumber = 1;
            } else {
                currentCellNumber++;
            }

            const beatNumber = createDom('p', { 
                class:['flex-row'], 
                innerText: (currentCellNumber), 
                style: { position: 'relative', zIndex: 5 }});   

            beatImg.addEventListener('click', () => {
                if (beatImg.clicked) {return}
                beatImg.clicked = true;
                beatImg.style.pointerEvents = 'none';

                if (beatGradient.gradColor > 85) {
                    clearInterval(beatImg.gradientIncrease);
                    correctBeat++;

                    beatImg.style.animation = '';
                    void beatImg.offsetWidth;
                    beatImg.style.animation = `puffOutSmall ${timing}ms linear forwards`;
                    beatImg.addEventListener('animationend', () => {
                        beatImg.remove();
                    });
                } else {
                    mistimeBeat();
                }
            }, { once: true });

            beatImg.append(beatGradient, beatNumber);
            quicktimeOsu.append(beatImg);

            const interval = Math.floor(1000 / FRAMES_PER_SECOND);
            let previousTime = performance.now();
            let currentTime = 0;
            let deltaTime = 0;

            function animateMovement(timestamp) {
                if (beatImg.clicked) {return};

                currentTime = timestamp;
                deltaTime = currentTime - previousTime;
                
                if (deltaTime > interval) {
                    if (beatGradient.gradColor > 128) {
                        mistimeBeat();
                        return;
                    } else if (beatGradient.gradColor > 100) {
                        beatGradient.style.background = `linear-gradient(to top, #ffffff00, #ffffff00 100%, #333333b8 100%)`;
                        beatGradient.gradColor += 1 / (timing / 450);
                    } else {
                        beatGradient.style.background = `linear-gradient(to top, #ffffff00, #ffffff00 ${beatGradient.gradColor}%, #333333b8 ${beatGradient.gradColor + 1}%)`;
                        beatGradient.gradColor += 1 / (timing / 450) * speedUpFactor;
                    }
                }
                window.requestAnimationFrame(animateMovement);
            }
            window.requestAnimationFrame(animateMovement);
        }
   
        setTimeout(() => {
            let index = 0;
            const processItem = () => {
                if (reverseMode) {
                    addBeat(posArray[posArray.length - index - 1], index, posArray[posArray.length - index - 1][2]);
                } else {
                    addBeat(posArray[index], index, posArray[index][2]);
                }

                index++;

                if (index < posArray.length) {
                    if (reverseMode) {
                        setTimeout(() => {
                            if (posArray[index] && posArray[index][3] !== undefined) {
                                placeholderTiming = posArray[index][3];
                            } else if (placeholderTiming > 0) {
                                placeholderTiming = 0;
                            }
                            setTimeout(() => {
                                processItem();
                            }, placeholderTiming)
                        }, posArray[posArray.length - index - 1][2]);
                    } else {
                        if (posArray[index]) {
                            setTimeout(processItem, posArray[index][2] + (posArray[index][3] ? posArray[index][3] : 0));
                        } else {
                            return;
                        }
                    }
                } else {
                    setTimeout(() => {
                        textBox.innerHTML = `You successfully countered <span style='color:#A97803'>${correctBeat}</span> out of <span style='color:#A97803'>${maxBeat}</span> ranged attacks!`;
                        let atkLevel = 1.5;
                        if (adventureVariables.specialty === 'Finale') {
                            atkLevel = 2.5;
                        } else if (adventureVariables.skirmish) {
                            atkLevel = 2;
                        }
 
                        setTimeout(() => {quitQuicktime(atkLevel, maxBeat, correctBeat)}, 2000);
                    }, 1250);
                }
            }
            processItem();
        }, 500);
    } else {
        let textBox = document.createElement('p');
        textBox.innerText = "Counter with the right type at the center to avoid taking damage!";
        textOverlay.appendChild(textBox);

        if (adventureVariables.specialty === 'Finale') {
            const quicktimeArray = enemyInfo.quicktimeDict['Finale'];
            waveQuicktime = quicktimeArray[randomInteger(1, Object.keys(quicktimeArray).length + 1)];
        }

        let quicktimeDict = {
            maxBeat: waveQuicktime.length,
            currentBeat: 0,
            correctBeat: 0,
            removeBeat: false,
            advLevel: advLevel,
            waveQuicktime: waveQuicktime,
        }

        quicktimeBar = Battle.regularQuicktime({quicktimeBar: quicktimeBar, quicktimeDict: quicktimeDict, 
                                                quitQuicktime: quitQuicktime, textBox:textBox, 
                                                battleVariables:battleVariables, adventureVariables:adventureVariables, 
                                                bossUpdate: bossUpdate, textOverlay: textOverlay, persistentValues:persistentValues
        });
    }

    if (variant !== '-rain') {
        adventureText.appendChild(textOverlay);
        videoOverlay.append(quicktimeBar);
    }

    adventureVideo.appendChild(videoOverlay);
}

function quitQuicktime(atkNumber = 1, maxBeat = null, correctBeat) {
    removeID('quicktime-overlay');
    removeID('text-overlay');
    setTimeout(() => {battleVariables.quicktimeAttack = false}, 300);

    if (maxBeat !== null) {
        atkNumber = atkNumber * (maxBeat - correctBeat);
    } else {
        atkNumber *= correctBeat;
    }
    
    if (atkNumber > 0) {
        Battle.comboHandler("reset");
        loseHP(Math.round(atkNumber * 10) / 10, "normal", 'quicktime');
    }

    battleVariables.iframe = true;
    setTimeout(() => {
        battleVariables.iframe = false;
    }, 1000);
}


function loseHP(ATK, type = 'normal', resetCombo = true, src = null) {
    if (!adventureVariables.fightSceneOn) {return}
    // if (testing) {return}

    const healthBar = document.getElementById('health-bar');
    let hpInterval = (100 / battleVariables.maxHealth);
    let adventureHealth = document.getElementById('adventure-health');

    if (type === "inverse") {
        if (activeLeader === 'Furina') ATK = Math.round(ATK * 1.5);
        healthBar.currentWidth += (hpInterval * ATK);
        if (healthBar.currentWidth > 100) {healthBar.currentWidth = 100}
    } else {
        battleVariables.healthLost += ATK;
        healthBar.currentWidth -= (hpInterval * ATK);
        if (healthBar.currentWidth < 1) {healthBar.currentWidth = 0}
        if (resetCombo && type !== 'inverse') {Battle.comboHandler("reset");}

        if (testing && src != null) {`Lost ${hpInterval * ATK} HP to ${src}`}

        adventureHealth.style.animation = 'shake 1s infinite linear';
        setTimeout(()=>{
            void adventureHealth.offsetWidth;
            adventureHealth.style.animation = '';
        },1000);
    }

    healthBar.style.width = `${healthBar.currentWidth}%`;
    if (healthBar.currentWidth <= 0) {
        if (adventureVariables.pheonixMode) {
            adventureVariables.pheonixMode = false;

            healthBar.currentWidth += (hpInterval * 3);
            healthBar.style.width = `${healthBar.currentWidth}%`;
            Battle.createBattleText("endure",2000,document.getElementById('adventure-video'));
        } else {
            loseAdventure();
        }
    }
}

let dodgeAppearance = false;
function dodgeOn(type) {
    if (!adventureVariables.fightSceneOn || battleVariables.quicktimeAttack) {return}
    if (type === "toggle") {
        let cooldown = document.getElementById('adventure-cooldown-1')
        if (cooldown.amount < 100) {return}
        if (dodgeAppearance) {
            const adventureVideo = document.getElementById("adventure-video");
            let selectIndicator = adventureVideo.querySelectorAll('.select-indicator');
            selectIndicator.forEach((ele) => {
                ele.remove();
            })

            const button = document.getElementById("battle-toggle");
            if (button.classList.contains("battle-selected")) {button.classList.remove("battle-selected")}
            if (button.classList.contains("battle-selected-scara")) {button.classList.remove("battle-selected-scara")}
            dodgeAppearance = false;
        } else {
            const adventureVideo = document.getElementById("adventure-video");
            const adventureVideoChildren = Array.from(adventureVideo.children).filter((child) => child.tagName === "DIV");
            for (let i = 0; i < adventureVideoChildren.length; i++) {
                const mobDiv = adventureVideoChildren[i];
                if (!mobDiv.classList.contains('enemy') || mobDiv.children[1] == undefined) {continue};

                const mobAtkIndicator = document.createElement("img");
                mobAtkIndicator.classList.add("select-indicator");
                mobAtkIndicator.id = "select-indicator";
                mobAtkIndicator.src = `./assets/icon/selectIndicator${adventureScaraText}.webp`
                mobDiv.appendChild(mobAtkIndicator);
            }

            const button = document.getElementById("battle-toggle");
            button.classList.add(`battle-selected${adventureScaraText}`);
            dodgeAppearance = true;
        }
    } else if (type === "close") {
        const adventureVideo = document.getElementById("adventure-video");
        let selectIndicator = adventureVideo.querySelectorAll('.select-indicator');
        selectIndicator.forEach((ele) => {
            ele.remove();
        })

        const button = document.getElementById("battle-toggle");
        if (button.classList.contains("battle-selected")) {button.classList.remove("battle-selected")}
        if (button.classList.contains("battle-selected-scara")) {button.classList.remove("battle-selected-scara")}
        dodgeAppearance = false;
    }
}

function skillUse() {
    if (!adventureVariables.fightSceneOn || advDict.rankDict[5] !== true || battleVariables.quicktimeAttack) {return}
    
    const adventureVideoChildren = document.getElementById("adventure-video").querySelectorAll('.enemy');
    const cooldown = document.getElementById('adventure-cooldown-2');
    if (cooldown.amount < 100) {return}

    let resetChance = randomInteger(1,101);
    let resetRoll = -1;
    if (skillCooldownReset) {
        resetRoll = -1;
    } else if (advDict.rankDict[14] === true) {
        resetRoll = 50;
    } else if (advDict.rankDict[7] === true) {
        resetRoll = 20;
    }

    const screenEffect = createDom('img', {
        classList: ['screen-effect', 'cover-all'],
        src: `./assets/expedbg/skill${adventureScaraText}.webp?v=${Date.now()}`
    });

    if (resetChance <= resetRoll && skillCooldownReset === false) {
        skillCooldownReset = true;
        let resetButton = document.getElementById('battle-skill');
        const img = createDom('img', {
            classList: ['cover-all'],
            id: 'refresh-icon',
            src: './assets/expedbg/refresh.webp'
        });

        img.onload = () => {
            resetButton.appendChild(img);
            img.addEventListener("animationend", () => { img.remove() });
        }
    } else {
        cooldown.amount -= 100;
        skillCooldownReset = false;
    }

    for (let i = 0; i < adventureVideoChildren.length; i++) {
        const mobDiv = adventureVideoChildren[i];
        if (!mobDiv.querySelector('.health-bar, .health-bar-scara')) {continue};
        const enemyImg = mobDiv.querySelector('.enemyImg');
        if (enemyImg.querySelector('.skill-mark')) { enemyImg.querySelector('.skill-mark').remove()};

        let canvas = Battle.createCanvas(["skill-mark"]);
        canvas.style.filter = "drop-shadow(0 0 0.2em #ADDE7D)";
        canvas = Battle.canvasHandler(canvas, createDom('img', { src: `./assets/icon/mark${adventureScaraText}.webp` }), adventureVariables, {
            postCalc: () => {
                if (canvas.brightness > 3) {
                    canvas.exitCanvas = true;
                }
            }
        });
        enemyImg.appendChild(canvas);
    }

    document.getElementById("adventure-video").appendChild(screenEffect);
    setTimeout(() => {
        screenEffect.remove();
    }, 1100)
}

function attackAll() {
    if (!adventureVariables.fightSceneOn || advDict.rankDict[10] !== true || battleVariables.quicktimeAttack) {return}
    const cooldown = document.getElementById('adventure-cooldown-3');
    if (cooldown.amount < 100) {return}
    cooldown.amount -= 100;

    let currentATK = 10 + 6 * Math.floor(advDict.adventureRank / 4);
    if (activeLeader == "Zhongli") {currentATK *= 1.75};
    currentATK = moraleCheck(currentATK);

    let attackMultiplier = Battle.comboHandler("check", 1);
    currentATK *= attackMultiplier;

    const screenEffect = createDom('img', {
        classList: ['cover-all', 'explosion-effect'],
        src: `./assets/expedbg/burst${adventureScaraText}.webp?v=${Date.now()}`
    });

    document.getElementById("adventure-video").appendChild(screenEffect);
    setTimeout(() => {
        screenEffect.remove();
    }, 1100);

    setTimeout(() => {
        let cooldownTime;
        parryFailure.load();
        parryFailure.play();
    
        const adventureVideoChildren = document.getElementById("adventure-video").querySelectorAll('.enemy');
        if (battleVariables.defenseMob) {
            const mobDiv = battleVariables.defenseMob;
            mobDiv.guardStance(mobDiv, "exit");
        }
    
        for (let i = 0; i < adventureVideoChildren.length; i++) {
            const mobDiv = adventureVideoChildren[i];
            if (!mobDiv.querySelector('.health-bar, .health-bar-scara')) {continue};
            const enemyImg = mobDiv.querySelector('.enemyImg');
            const decoy = mobDiv.classList.contains('decoy') ? true : false;
    
            let critRoll = randomInteger(1,101);
            let critThreshold = -1;
            if (advDict.rankDict[18] === true) {
                critThreshold = 20;
            } else if (advDict.rankDict[15] === true) {
                critThreshold = 10;
            }
    
            if (battleVariables.defenseMob != null) {
                currentATK *= 0.5;
                critThreshold = -1;
                Battle.createBattleText("guard", 2000, mobDiv);
            } else if (battleVariables.burstAttack !== null) {
                currentATK *= 0.3;
            }
    
            const mobHealth = mobDiv.children[1];
            if (critRoll <= critThreshold && !decoy) {
                Battle.createBattleText("crit", 2000, mobDiv);
                mobHealth.health -= (currentATK * 4 * 1.5);
            } else {
                mobHealth.health -= (currentATK * 4);
            }
    
            if (!cooldownTime) {cooldownTime = Math.max(mobDiv.attackTime * 150, 500)}
            if (mobHealth.class != "Superboss") {
                enemyImg.classList.add("staggered");
                setTimeout(()=>{enemyImg.classList.remove("staggered")}, cooldownTime);
            } else {
                enemyImg.classList.add("damaged");
                setTimeout(()=>{enemyImg.classList.remove("damaged")}, cooldownTime);
            }
            
            if (mobHealth.health <= 0) {
                killMob(mobDiv, mobHealth);
            }
    
            let newHealth = Math.round(mobHealth.health/mobHealth.maxHP * 10000)/100;
            mobHealth.style.width = `${newHealth}%`
            if (mobDiv.classList.contains('megaboss')) {bossUpdate(newHealth)};
    
            let canvas = mobDiv.querySelector('.atk-indicator');
            if (canvas) {
                if (battleVariables.decoyNumber !== null) { return }
                if (mobDiv.classList.contains('megaboss')) {
                    if (battleVariables.burstAttack === null) {
                        canvas.brightness *= 0.45;
                        canvas.style.transform = ``;
                        canvas.style.filter = `brightness(${canvas.brightness})`;
                    }
                } else {
                    canvas.style.transform = ``;
                    if (battleVariables.burstAttack !== null) {
                        canvas.brightness *= 0.3;
                        canvas.style.filter = `brightness(${canvas.brightness})`;
                    } else {
                        canvas.brightness = -0.1 * randomInteger(1, 50) / 10;
                        canvas.style.filter = `brightness(0)`;
                    }
                }
            }
        }
    }, 500);
}

function killMob(mobDiv, mobHealth) {
    if (bountyObject.hasOwnProperty(mobDiv.enemyType)) {setTimeout(()=>{completeBounty(mobDiv.enemyType)}, randomInteger(1, 100))}
    if (mobDiv.classList.contains('minion')) {
        mobDiv.remove();
    } else if (mobDiv.classList.contains('workshop-arm')) {
        battleVariables.artificalSpeedUp += 0.5;
        const bossEle = document.querySelector('.megaboss > .health-bar-scara');

        if (bossEle) {
            bossEle.health -= 0.20 * bossEle.maxHP;
            bossEle.style.width = `${bossEle.health / bossEle.maxHP * 100}%`
            bossUpdate(bossEle.health);
        }
    } else if (mobDiv.classList.contains('megaboss')) {
        if (adventureVariables.specialty === 'Finale') {
            mobHealth.health = 1;
            mobHealth.style.width = `${1 / mobHealth.maxHP * 100}%`
            bossUpdate(1);

            battleVariables.quicktime = 10000;
            battleVariables.lastStand = true;
            return;
        }
    }

    const canvas = mobDiv.querySelector('.atk-indicator');
    if (canvas) {
        canvas.remove();
    }

    persistentValues.enemiesDefeatedValue++
    mobHealth.dead = true;
    fightEnemyDownElement.load();
    fightEnemyDownElement.play();

    mobDiv.style.animation = "";
    mobDiv.querySelector('.enemyImg').style.animation = "";
    mobDiv.style.filter = "grayscale(100%) brightness(20%)";
    mobHealth.remove();

    if (battleVariables.summonTime !== null) {
        battleVariables.summonTime *= 0.5;
    }

    if (battleVariables.defenseMob == mobDiv) {
        battleVariables.defenseMob = null;
        battleVariables.guardtime = 0;
    }

    if (advDict.rankDict[8] === true) {
        loseHP((mobDiv.classList.contains('minion') ? 0.5 : 1), "inverse");
    }

    if (adventureVariables.treeDefense) {
        setTimeout(() => {
            if (!adventureVariables.fightSceneOn) {return}
            const adventureVideo = document.getElementById("adventure-video");
            const adventureVideoChildren = adventureVideo.querySelectorAll('.enemy');
            const newMob = spawnMob(adventureVideo, adventureVariables.waveType.Wave, mobDiv);
            newMob.classList.add('new-spawn');
            activateMob(newMob, 1, adventureVideoChildren.length);
            mobDiv.remove();

            let timerDefense = document.getElementById('timer-defense');
            timerDefense.killMob();
        }, 5000);
    } else {
        adventureVariables.currentEnemyAmount--;
        if (adventureVariables.currentEnemyAmount === 0) {
            quitQuicktime(0, 0, 0);
            winAdventure();
        }
    }
}

function loseAdventure() {
    if (!adventureVariables.fightSceneOn) {return}
    adventureVariables.fightSceneOn = false;

    const adventureHeading = document.getElementById("adventure-header");
    adventureHeading.style.top = "10%";
    adventureHeading.innerText = "You passed out...";

    const adventureChoiceOne = document.getElementById("adv-button-one");
    adventureChoiceOne.addEventListener("click", () => {
        let level = imgKey[document.getElementById("adventure-button").key].Level;
        let xp = 5*(2**(level >= 1 && level <= 5 ? level : 7)) * additionalXP;
        gainXP(Math.round(xp));

        quitAdventure(false);
    }, { once: true });
    
    let imageGif = document.getElementById("adventure-gif");
    imageGif.src = `./assets/expedbg/exped-${adventureScaraText ? 'scara' : 'Nahida'}-loss.webp`;

    Expedition.resetAdventure(dodgeOn, fightBgmElement, fightLoseElement, adventureVariables, bgmElement, false);
}


function winAdventure() {
    if (!adventureVariables.fightSceneOn) {return}
    adventureVariables.fightSceneOn = false;

    const keyNumber = document.getElementById("adventure-button").key;

    const adventureHeading = document.getElementById("adventure-header");
    adventureHeading.style.top = "1%";
    adventureHeading.innerText = "You won! You received some loot:";

    switch (adventureVariables.specialty) {
        case 'FellBoss':
            adventureHeading.innerText = "You have stopped the rampaging Whopperflower!";
            persistentValuesDefault.fellBossDefeat = true;
            challengeNotification(({category: 'specific', value: [1, 8]}));
            break;
        case 'Unusual':
            adventureHeading.innerText = "You have survived the Unusual Hilichurl's onslaught!";
            persistentValuesDefault.unusualBossDefeat = true;
            challengeNotification(({category: 'specific', value: [2, 5]}));
            document.getElementById('shop-backdoor').style.display = 'block';
            break;
        case 'Workshop':
            adventureHeading.innerText = "You successfully put down the Shouki no Kami!";
            persistentValuesDefault.workshopBossDefeat = true;
            document.getElementById("nut-shop-div").activateWorkshopCell();
            challengeNotification(({category: 'specific', value: [3, 6]}));
            break;
        case 'Finale':
            adventureHeading.innerText = "You have ended the Leyline Outbreak Experiment, once and for all.";
            persistentValuesDefault.finaleBossDefeat = true;
            challengeNotification(({category: 'specific', value: [4, 3]}));
            drawAranaraWish();

            const settingsBottomBadge = document.getElementById('badges-div');
            if (!settingsBottomBadge.querySelector('medal-img-2')) {
                settingsBottomBadge.append(createMedal(2, choiceBox, mainBody, stopSpawnEvents));
            }
            break;
        default:
            break;
    }

    let levelLoot = adventureLoot[`Level-${imgKey[keyNumber].Level}`];
    let lootCounter = 0;
    for (let key in adventureLoot[keyNumber]) {
        levelLoot[key] = adventureLoot[keyNumber][key];
    }

    let itemFirstRoll = randomInteger(1,101);
    let itemFirstThreshold = 101;
    let itemSecondRoll = randomInteger(1,101);
    let itemSecondThreshold = 101;

    if (advDict.rankDict[17] === true) {
        itemSecondThreshold = 70;
        itemFirstThreshold = 65;
    } else if (advDict.rankDict[12] === true) {
        itemFirstThreshold = 70;
    } else if (advDict.rankDict[4] === true) {
        itemFirstThreshold = 90;
    }

    if (itemFirstRoll < itemFirstThreshold) {
        if (levelLoot && levelLoot.hasOwnProperty("Bonus")) {
            delete levelLoot["Bonus"];
        }   
    }

    if (itemSecondRoll < itemSecondThreshold) {
        if (levelLoot.hasOwnProperty("Bonus2")) {
            delete levelLoot["Bonus2"];
        }
    }

    // HACK FOR A WEIRD BUG WHERE LEVEL LOOT IS NOT CLEARED AFTER EXITING
    for (let key in levelLoot) {
        if (levelLoot[key][3] == "adventure") {
            levelLoot[key][3] = levelLoot[key][3] + `-${lootCounter}`;
        }
        inventoryDraw(...levelLoot[key]);
        lootCounter++;
    }

    let tempArray = compareTreeItems(Object.values(lootArray));
    lootArray = {};

    // SKIRMISH TO DO
    if (adventureVariables.advType === 13) {
        let treeSeedID;
        if (persistentValues.workshopBossDefeat) {
            treeSeedID = 4021;
        } else if (persistentValues.unusualBossDefeat) {
            treeSeedID = 4020;
        } else {
            treeSeedID = 4019;
        }

        tempArray[getHighestKey(tempArray) + 1] = [treeSeedID, false];
    }

    const adventureRewards = document.getElementById("adventure-rewards");
    for (let key in tempArray) {
        let itemInfo = Inventory[tempArray[key][0]];
        inventoryAdd(tempArray[key][0]);

        let lootDiv = document.createElement("div");
        lootDiv = inventoryFrame(lootDiv, itemInfo);

        if (tempArray[key][1] === true && (saveValues.treeObj.level > 0 && saveValues.treeObj.level < 5)) {
            let bonus = createDom('img');
            bonus.classList.add('tree-bonus')
            bonus.src = "./assets/expedbg/tree-item.webp";
            lootDiv.append(bonus);
        }
        
        adventureRewards.appendChild(lootDiv);
    };

    if (adventureRewards.children.length === 0) {
        adventureRewards.style.opacity = "0";
        adventureRewards.style.flexGrow = "0";
    } else {
        adventureRewards.style.opacity = "1";
        adventureRewards.style.flexGrow = "1";
    }

    const adventureVideo = document.getElementById('adventure-video');
    const nutReward = document.createElement('p');
    nutReward.classList.add("adventure-currency");
    nutReward.value = saveValues["dps"] * 60 * 3 * (1.5**(imgKey[keyNumber].Level > 5 ? imgKey[keyNumber].Level : 7)) * randomInteger(90,100) / 100 * additionalXP;

    if (imgKey[keyNumber].Level === 5) {
        nutReward.gValue = randomInteger(3, 10) * 3 + advDict.adventureRank;
        nutReward.innerHTML = `Gained:<br> ${abbrNum(nutReward.value)} [s]Nuts[/s]<br> ${nutReward.gValue} [s]Golden Nuts[/s]`;
    } else {
        nutReward.innerHTML = `Gained:<br> ${abbrNum(nutReward.value)} [s]Nuts[/s]`;
        nutReward.gValue = 0;
    }

    if (adventureScaraText === '-scara') {
        nutReward.style.color = '#333553';
        nutReward.style.backgroundColor = '#a8acd9';
        nutReward.style.border = '0.2em solid #494d81';
    }

    nutReward.innerHTML = textReplacer({
        "[s]":`<span style='color:#A97803'>`,
        "[/s]":`</span>`,
    }, nutReward.innerHTML);
    if (adventureVariables.specialty === null) adventureVideo.append(nutReward);

    const exitAdventure = () => {
        quitAdventure(true);
        charScan();
        updateMorale("recover",randomInteger(2,6));
        clearExped();

        let level = imgKey[keyNumber].Level;
        const xpGain = Math.round(15 * (2**(level >= 1 && level <= 5 ? level : 5)) * additionalXP);
        gainXP(xpGain);
        
        if (adventureRewards.children.length >= 0) {
            newPop(1);
            sortList("table2");
            nutReward.gValue === 0 ? currencyPopUp([["items", 0]]) : currencyPopUp([["items", 0], ["nuts", nutReward.gValue]]);
        }

        let rewardChildren = adventureRewards.children;
        while (rewardChildren.length > 0) {
            rewardChildren[0].remove();
        }
    }

    const adventureChoiceOne = document.getElementById("adv-button-one");
    adventureChoiceOne.addEventListener("click", () => {
        saveValues["realScore"] += nutReward.value;
        nutReward.remove();

        let tempSpecialty = adventureVariables.specialty;
        exitAdventure();
        switch (tempSpecialty) {
            case 'FellBoss':
                drawUI.customTutorial("flower", 2, 'Post-Boss');
                removeID('adv-button-31');
                notifPop("clearAll", "boss");
                break;
            case 'Unusual':
                drawUI.customTutorial("unusual", 4, 'Post-Boss');
                removeID('adv-button-32');
                notifPop("clearAll", "boss");
                break;
            case 'Workshop':
                drawUI.customTutorial("workshop", 4, 'Post-Boss');
                removeID('adv-button-33');
                notifPop("clearAll", "boss");
                break;
            case 'Finale':
                drawUI.customTutorial("finale", 9, 'Finale', persistentValues);
                removeID('adv-button-34');
                notifPop("clearAll", "boss");
                break;
            default:
                break;
        }
    }, { once: true });

    Expedition.resetAdventure(dodgeOn, fightBgmElement, fightWinElement, adventureVariables, bgmElement, true);
}

function quitAdventure(wonBattle) {
    const comboNumber = document.getElementById("combo-number");
    comboNumber.remove();
    challengeNotification(({category: 'combo', value: comboNumber.maxCombo}));
    stopSpawnEvents = false;

    if (wonBattle) {
        if (adventureVariables.advType === 5 && battleVariables.healthLost === 0) {
            challengeNotification(({category: 'specific', value: [1, 4]}));
        } else if (adventureVariables.advType === 13) {
            const healthBar = document.getElementById('health-bar');
            const hpInterval = (100 / battleVariables.maxHealth);
            if (healthBar.currentWidth <= hpInterval) {
                challengeNotification(({category: 'specific', value: [1, 5]}));
            }
        } else if (adventureVariables.treeDefense && battleVariables.healthLost === 0) {
            challengeNotification(({category: 'specific', value: [3, 9]}));
        }
    }

    if (document.getElementById("skirmish-button")) {
        document.getElementById("skirmish-button").remove();
        notifPop("clearAll","skirmish");
    }
    
    let adventureArea = document.getElementById("adventure-area");
    adventureArea.style.display = 'none';
    adventureScene = false;

    let adventureHeading = document.getElementById("adventure-header");
    adventureHeading.innerText = "";
    let imageGif = document.getElementById("adventure-gif");
    imageGif.src = "./assets/expedbg/exped-Nahida.webp";

    let adventureVideo = document.getElementById("adventure-video");
    adventureVideo.style.border = '0.2em ridge #AEDF7D';
    let enemyElements = adventureVideo.getElementsByClassName("enemy");
    while (enemyElements.length > 0) {
        enemyElements[0].remove();
    }

    let adventureHealth = document.getElementById("adventure-health");
    adventureHealth.style.opacity = 0;
    let healthElements = adventureHealth.getElementsByClassName("heart-bit");
    while (healthElements.length > 0) {
        healthElements[0].remove();
    }

    let adventureHealthbarDiv = document.createElement("div");
    adventureHealthbarDiv.style.width = "100%";
    adventureScaraText = "";
    if (document.getElementById('refresh-icon')) {document.getElementById('refresh-icon').remove()};

    if (adventureVariables.treeDefense) {
        enemyBlock(true, battleVariables.healthLost, battleVariables.maxHealth);
    }

    adventureVariables = {};
    battleVariables = {};
}

//------------------------------------------------------------------------TABLE 4 (WISH)------------------------------------------------------------------------//
// UNLOCK WISH SYSTEM
function wishUnlock() {
    let wishButtonText = document.getElementById("wishButtonText");
    let wishButton = document.getElementById("wishButton");
    let wishButtonPrimo = document.createElement("img");
    wishButtonPrimo.classList.add("wish-button-primo");
    wishButtonPrimo.src = "./assets/icon/mailLogo.webp";
    
    wishButtonText.innerText = "Write for help | " +WISHCOST;
    wishButtonText.append(wishButtonPrimo);
    wishButton.locked = false;
    wishButton.addEventListener("click",() => {
        wish();
        updateWishDisplay();
    })

    let wishContainer = document.getElementById("mail-image-div");
    let wishHelpText = document.createElement("div");
    wishHelpText.id = "wish-tutorial-text";
    wishHelpText.innerText = "Wish for new characters using primogems! \n Wished characters take a % of your current NpS.";

    let wishTutorial = document.createElement("img");
    wishTutorial.src = "./assets/icon/wish-help.webp";
    wishTutorial.id = "wish-tutorial";
    
    wishTutorial.addEventListener("click",()=>{
        universalStyleCheck(wishHelpText,"display","flex","none");
    });

    let wishNpsDisplay = document.createElement("div");
    wishNpsDisplay.id = "wish-nps-display";
    wishNpsDisplay.classList.add("flex-row");
    let wishCurrencyCounter = document.createElement("div");
    wishCurrencyCounter.id = "wish-counter-display";
    wishCurrencyCounter.classList.add("flex-row")
    wishCurrencyCounter.innerText = saveValues.mailCore;
    let wishCurrencyImage = document.createElement("img");
    wishCurrencyImage.src = "./assets/icon/mailLogo.webp";
    
    wishCurrencyCounter.appendChild(wishCurrencyImage);
    wishContainer.append(wishNpsDisplay,wishCurrencyCounter);
    wishContainer.parentNode.append(wishTutorial,wishHelpText)
    updateWishDisplay();
}

// DRAWS/WISH FOR SPECIAL HEROS
function drawWish() {
    var wishButton = document.createElement("div");
    wishButton.classList += " wish-button";
    wishButton.id = "wishButton";
    wishButton.locked = true;
    let wishButtonText = document.createElement("div");
    wishButtonText.id = "wishButtonText";
    wishButtonText.classList += " flex-row wish-button-text";
    wishButtonText.innerText = "???";

    table4 = drawUI.drawMailTable(table4);

    let mailImageDiv = document.getElementById("mail-image-div");
    let wishButtonImg = document.createElement("img");
    wishButtonImg.src = "./assets/frames/wishButton.webp";
    wishButtonImg.classList += " wish-button-img cover-all";
    wishButton.append(wishButtonImg, wishButtonText);
    mailImageDiv.append(wishButton);

    if (saveValues["wishCounterSaved"] === wishCounter) {
        wishUnlock();
        stopWish();
        wishMultiplier = saveValues["wishCounterSaved"];
    } else if (saveValues["wishUnlocked"] === true) {
        wishUnlock();
        wishMultiplier = saveValues["wishCounterSaved"];
    }

    if (persistentValues.finaleBossDefeat || beta) {
        drawAranaraWish();
    }
}

function drawAranaraWish() {
    const mailImageDiv = document.getElementById('mail-image-div');
    const wishButton = document.getElementById('wishButton');
    const wishButtonText = document.getElementById('wishButtonText');

    if (wishButtonText.innerText === '???') {
        return;
    }

    const wishAranara = wishButton.cloneNode(true);

    const wishAranaraDiv = wishAranara.querySelector('#wishButtonText');
    wishAranaraDiv.innerText = `Wish for dreams | ${WISHCOST}`
    let wishButtonPrimo = document.createElement("img");
    wishButtonPrimo.classList.add("wish-button-primo");
    wishButtonPrimo.src = "./assets/icon/mailLogo.webp";
    wishAranaraDiv.append(wishButtonPrimo);

    wishAranara.classList.add('wish-button-aranara');
    const pickItems = createDom('div', {
        classList: ['notif-item'],
    });

    for (let i = 1; i < 9; i++) {
        const aranaraImg = createDom('img', {
            src: `./assets/tutorial/aranara-${i}.webp`,
            classList: ['cover-all'],
        })

        const aranaraText = createDom('p', {
            classList: ['cover-all', 'flex-row'],
            style: {
                color: 'white',
                fontSize: '1.6em',
                textShadow: 'var(--text-shadow-075)',
            }
        })
        if (i < 4) {
            aranaraText.innerText = '?';
        } else if (i < 7) {
            aranaraText.innerText = '!';
        } else {
            aranaraText.innerText = '¿';
        }

        const aranaraDiv = createDom('div', {
            name: i,
            children: [aranaraImg, aranaraText],
            style: {
                backgroundColor: 'var(--bright-light-green)',
                borderRadius: '1em',
                transform: 'scale(0.95)'
            },
        });

        pickItems.appendChild(aranaraDiv);
    }


    wishAranara.addEventListener('click', async () => {
        if (saveValues["mailCore"] >= 1) {
            mailElement.load();
            mailElement.play();
            saveValues["mailCore"] -= 1;
            choiceBox(mainBody, {text: 'Pick one Aranara Event:'}, stopSpawnEvents, (value) => {clickedEvent(parseInt(value))}, null, pickItems, ['notif-ele', 'pick-items']);
        } else {
            weaselDecoy.load();
            weaselDecoy.play();
        }

        updateWishDisplay();
    })

    mailImageDiv.append(wishAranara);
}

function updateWishDisplay() {
    if (document.getElementById("wish-nps-display")) {
        let wishNpsDisplay = document.getElementById("wish-nps-display");
        if (saveValues["wishCounterSaved"] >= wishCounter) {
            wishNpsDisplay.innerText = "All Wish Heroes obtained!";
        } else {
            wishNpsDisplay.innerText = `Next character's NpS: ${abbrNum(Math.round(saveValues["dps"] * 0.01 * (STARTINGWISHFACTOR + wishMultiplier)/2 + 1))}`;
        }
        let wishCurrency = document.getElementById("wish-counter-display");
        wishCurrency.innerHTML = wishCurrency.innerHTML.replace(/[^<]+</g, `${saveValues.mailCore}<`);
    }
}

function stopWish() {
    let wishButton = document.getElementById("wishButton");
    let wishButtonText = document.getElementById("wishButtonText");
    wishButtonText.innerText = "Closed";
    wishButton.locked = true;

    let wishNpsDisplay = document.getElementById("wish-nps-display");
    wishNpsDisplay.innerText = "All Wish Heroes obtained!";

    var new_wishButton = wishButton.cloneNode(true);
    wishButton.parentNode.replaceChild(new_wishButton, wishButton);
    let mailImageTemp = document.getElementById("mailImageID");
    mailImageTemp.remove();
}

let stopWishAnimation = false;
function wish() {
    if (stopWishAnimation === true) {return};
    if (saveValues["wishCounterSaved"] >= wishCounter) {
        stopWish();
        return;
    }

    if (saveValues["mailCore"] >= 1) {
        stopWishAnimation = true;
        mailElement.load();
        mailElement.play();
        saveValues["mailCore"] -= 1;

        // SCARAMOUCHE WILL ALWAYS BE THE FIRST WISH HERO
        while (wishCounter) {
            let randomWishHero;
            if (upgradeDict[800].Purchased === -10) {
                randomWishHero = 800;
                if (expeditionDict[5] != '0') {
                    unlockExpedition(5, expeditionDict);
                    clearExped();
                    newPop(2);
                }
            } else {
                randomWishHero = randomInteger(WISHHEROMIN, WISHHEROMAX);
            }
        
            if (upgradeDict[randomWishHero].Purchased >= -1) {
                continue;
            } else {
                let upgradeDictTemp = upgradeDict[randomWishHero];
                upgradeDictTemp.Purchased = -1;
                upgradeDictTemp["Factor"] = Math.round(saveValues["dps"] * 0.01 * (STARTINGWISHFACTOR + wishMultiplier)/2 + 1);
                upgradeDictTemp["BaseCost"] = Math.round(saveValues["dps"] * (65) * wishPower + 1);
                upgradeDictTemp["BaseFactor"] = upgradeDictTemp["Factor"];
                upgradeDictTemp["Contribution"] = 0;

                const currentName = upgradeInfo[randomWishHero].Name;
                let ascendFactor = 0;
                if (persistentValues.ascendDict[currentName] !== undefined) {
                    ascendFactor = persistentValues.ascendDict[currentName]
                } else {
                    persistentValues.ascendDict[currentName] = 0;
                }
                upgradeDictTemp["BaseCost"] *= (1 + ascendFactor * 0.02);
                upgradeDictTemp["Factor"] *= (1 + ascendFactor * 0.1);
                upgradeDictTemp["BaseFactor"] = upgradeDictTemp["Factor"];
                
                wishMultiplier++;
                saveValues["wishCounterSaved"]++;
                if (saveValues["wishCounterSaved"] >= 10) {challengeNotification(({category: 'specific', value: [1, 2]}));}

                refresh();
                newPop(0);

                let mailImageTemp = document.getElementById("mailImageID");
                mailImageTemp.style.opacity = 0;
                if (!settingsValues.showWishAnimation) {
                    wishAnimation(randomWishHero);
                } else {
                    stopWishAnimation = false;
                }
                break;
            }
        }
    } else {
        weaselDecoy.load();
        weaselDecoy.play();
    }
}

function wishAnimation(randomWishHero) {
    stopSpawnEvents = true;
    let nameTemp = upgradeInfo[randomWishHero].Name;
    preloadStart.fetch([`./assets/tooltips/letter-${nameTemp}.webp`]);
    setTimeout(()=>{
        let wishBackdropDark = document.createElement("div");
        wishBackdropDark.classList.add("cover-all","flex-column","tutorial-dark");

        let wishImage = document.createElement("img");
        wishImage.classList.add("wish-img");
        wishImage.src = `./assets/tooltips/letter-${nameTemp}.webp`;
        wishImage.addEventListener("click",()=>{
            wishBackdropDark.remove();
            stopWishAnimation = false;
            stopSpawnEvents = false;
        })

        wishBackdropDark.appendChild(wishImage);
        mainBody.appendChild(wishBackdropDark);
    },750);
}

//------------------------------------------------------------------------TABLE 5 (ACHIEVEMENTS)------------------------------------------------------------------------//
// ACHIEVEMENTS
function achievementListload() {
    for (let key in achievementListDefault) {
        key = parseInt(key)
        if (achievementMap.has(key) === false) {
            achievementMap.set(key,false)
        } else if (achievementMap.get(key) === true){
            if (key < 40) {
                popAchievement("score",true);
                achievementData["achievementTypeRawScore"].shift();
            } else if (key > 100 && key < 140) {
                popAchievement("dps",true);
                achievementData["achievementTypeRawDPS"].shift();
            } else if (key > 200 && key < 240) {
                popAchievement("click",true);
                achievementData["achievementTypeRawClick"].shift();
            } else if (key > 300 && key < 320) {
                popAchievement("collection",true);
                achievementData["achievementTypeRawCollection"].shift();
            } else if (key > 400 && key < 420) {
                popAchievement("golden",true);
                achievementData["achievementTypeGolden"].shift();
            }
        }
    }

    let table5Image = document.getElementById('table5-Image');
    let tabDiv = document.createElement('div');
    tabDiv.classList.add('flex-row', 'table5-tab');
    tabDiv.active;

    let achievementTab = createDom('p', {
        classList: ['tab-chosen', 'tab-unchosen', 'flex-column'],
        innerText: 'Achievements',
    });

    let challengeTab = createDom('p', {
        classList: ['tab-unchosen', 'flex-column'],
        innerText: 'Challenges',
    });

    let tutorialTab = createDom('p', {
        classList: ['tab-unchosen', 'flex-column'],
        innerText: 'Tutorials',
    });

    [achievementTab, challengeTab, tutorialTab].forEach((tab) => {
        tab.addEventListener('click',()=>{
            changeAchTab(tab);
        });
    });

    table5.style.display = "flex";

    let challengeDiv = document.getElementById('challenge-div');
    challengeDiv.classList.add("flex-column");
    challengeDiv.innerText = "\n[Locked. Come back later!]";

    // TODO: ANY SKIRMISH TUTORIAL

    let tutorialDiv = document.getElementById('tutorial-div');
    drawUI.buildTutorial(saveValues, persistentValues, advDict);

    if (!persistentValues.tutorialAscend) challengeDiv.style.color = '#343030';
    if (persistentValues.tutorialAscend) {
        createChallenge();
    }
    
    function changeAchTab(ele) {
        if (tabDiv.active !== ele) {
            achievementTab.classList.remove('tab-chosen');
            challengeTab.classList.remove('tab-chosen');
            tutorialTab.classList.remove('tab-chosen');
            tabDiv.active = ele;

            table5.style.display = "none";
            challengeDiv.style.display = "none";
            tutorialDiv.style.display = "none";

            if (ele === achievementTab) {
                achievementTab.classList.add('tab-chosen');
                table5.style.display = "flex";
            } else if (ele === challengeTab) {
                challengeTab.classList.add('tab-chosen');
                challengeDiv.style.display = "flex";
            } else {
                tutorialTab.classList.add('tab-chosen');
                tutorialDiv.style.display = "flex";
            }
        }
    }

    tabDiv.active = achievementTab;
    tabDiv.append(achievementTab, challengeTab, tutorialTab);
    table5Image.append(tabDiv);
}

function createChallenge() {
    if (document.getElementById('tier-button-0')) {return}

    const challengeDiv = document.getElementById('challenge-div');
    challengeDiv.innerText = '';
    challengeDiv.style.color = '#D9BD85';
    
    const challengeText = createDom('p', {
        id: 'challenge-text',
        classList: ['challenge-text'],
        innerHTML: ``
    });

    challengeText.updateNumber = () => {
        challengeText.innerHTML =  `Earn Global NpS multipliers through challenges!
        Current Multiplier: [s]${challengeMultiplier}%[/s]`

        challengeText.innerHTML = textReplacer({
            "[s]":`<span style='color:#A97803'>`,
            "[/s]":`</span>`,
            "\n":`<br>`,
        }, challengeText.innerHTML);
    }

    challengeDiv.append(challengeText);

    const romanNum = ["I: Initiate's Journey",'II: Skillful Endeavors','III: Challenging Pursuits',"IV: Elites' Quest",'V: Ultimate Challenge'];
    let challengeDict = persistentValues.challengeCheck;

    for (let i = 0; i < challengeInfo.length; i++) {
        const tierButton = createDom('div', {
            classList: ['tier-button', 'flex-row'],
            id: `tier-button-${i}`,
            challengeCount: 0,
        });

        const tierText = createDom('p', {
            innerText: 'Tier ' + romanNum[i]
        });

        const tierCount = createDom('p');

        tierButton.append(tierText, tierCount);
        tierButton.updateChallengeCount = () => {
            tierCount.innerText = `[${tierButton.challengeCount}/10]`
            if (tierButton.challengeCount === 10) {
                tierCount.innerText = '[MAX]'
                challengeMultiplier += 50;
            }
        }

        let tierContainer = document.createElement("div");
        tierContainer.classList.add('tier-container');
        tierContainer.style.display = "none";
        
        for (let j = 0; j < challengeInfo[i].length; j++) {
            let challengeContainer = document.createElement("div");
            challengeContainer.classList.add('flex-row')

            const challengeInfoDiv = document.createElement("div");
            let challengeTitle = document.createElement("p");
            challengeTitle.id = `challenge-title-${i}-${j}`
            challengeTitle.innerText = challengeDict[i][j] === false ? '???' : `${challengeInfo[i][j]['title']}`;
            let challengeDesc = document.createElement("p");

            challengeDesc.innerText = `${challengeInfo[i][j].desc}`;
            const challengeButton = createDom('button', { id: `challenge-button-${i}-${j}`, class:['challenge-button']});
            
            if (challengeDict[i][j] === false) {
                challengeButton.innerText = 'Locked';
            } else {
                tierButton.challengeCount++;
                challengeMultiplier += (i + 1) * 5;
                challengeButton.innerText = 'Unlocked';
                challengeButton.classList.add('challenge-button-claimed');
            }

            challengeInfoDiv.append(challengeTitle, challengeDesc)
            challengeContainer.append(challengeButton, challengeInfoDiv);
            tierContainer.append(challengeContainer)
        }

        tierButton.updateChallengeCount();
        tierButton.addEventListener("click", () => {
            if (tierContainer.style.display === 'none') {
                tierContainer.style.display = 'block';
            } else {
                tierContainer.style.display = 'none';
            }
        })

        challengeDiv.append(tierButton,tierContainer);
    }
    challengeText.updateNumber();
}


function popAchievement(achievement, loading) {
    var oldAchievement = document.getElementById("tempAchievement");
    var achievementID = 10000;
    let achievementType = "";

    if (oldAchievement != null) {
        leftDiv.removeChild(oldAchievement); 
    }

    switch (achievement) {
        case "score":
            achievementType = scoreAchievement[0];
            scoreAchievement[0]++;
            break;
        case "dps":
            achievementType = scoreAchievement[1];
            scoreAchievement[1]++;
            break;
        case "click":
            achievementType = scoreAchievement[2];
            scoreAchievement[2]++;
            break;
        case "collection":
            achievementType = scoreAchievement[3];
            scoreAchievement[3]++;
            break;
        case "golden":
            achievementType = scoreAchievement[4];
            scoreAchievement[4]++;
            break;
        default:
            console.log("No more Achievements left!");
            return;
    }

    let achievementListTemp = achievementList[achievementType];
    let achievementText = achievementListTemp.Name;
    let achievementDesc = achievementListTemp.Description;
    achievementMap.set(achievementType,true);
    achievementID += achievementType;

    if (loading != true) {
        const gainPrimo = Math.round(20 * additionalPrimo)
        saveValues.primogem += gainPrimo;
        persistentValues.lifetimePrimoValue += gainPrimo;

        saveValues["achievementCount"]++;
        challengeNotification(({category: 'primogem', value: saveValues.primogem}))

        if (timerSeconds !== 0) {
            let achievementPopUp = drawUI.createAchievement(achievementText,achievementDesc);
            achievementPopUp.addEventListener("click", () => {achievementPopUp.remove()});
            achievementPopUp.addEventListener('animationend', () => {achievementPopUp.remove()});
            leftDiv.appendChild(achievementPopUp);
            audioPlay(achievementElement);
        }
    }

    //  ^^^ TEMP ACHIEVEMENT | PERMANENT ACHIEVEMENT vvv
    
    let achievementStored = drawUI.storeAchievement(achievementText,achievementDesc,achievementID);
    table5.appendChild(achievementStored); 
    sortList("table5");
}

function checkAchievement() {
    let saveValuesLocal = saveValues;
    if (achievementData["achievementTypeRawScore"].length !== 0) {
        if (saveValuesLocal["realScore"] >= achievementData["achievementTypeRawScore"][0]) {
            popAchievement("score");
            achievementData["achievementTypeRawScore"].shift();
            return;
        }
    } 

    if (achievementData["achievementTypeRawClick"].length !== 0) {
        if (saveValuesLocal["clickCount"] >= achievementData["achievementTypeRawClick"][0]) {
            popAchievement("click");
            achievementData["achievementTypeRawClick"].shift();
            return;
        }
    }
    
    if (achievementData["achievementTypeRawDPS"].length !== 0) {
        if (saveValuesLocal["dps"] >= achievementData["achievementTypeRawDPS"][0]) {
            popAchievement("dps");
            achievementData["achievementTypeRawDPS"].shift();
            return;
        }
    }

    if (achievementData["achievementTypeRawCollection"].length !== 0) {
        if (saveValuesLocal["heroesPurchased"] >= achievementData["achievementTypeRawCollection"][0]) {
            popAchievement("collection");
            achievementData["achievementTypeRawCollection"].shift();
            return;
        }
    }

    if (achievementData["achievementTypeGolden"].length !== 0) {
        if (saveValuesLocal["goldenNut"] >= achievementData["achievementTypeGolden"][0]) {
            popAchievement("golden");
            achievementData["achievementTypeGolden"].shift();
            return;
        }
    }
}

function challengeNotification(value) {
    if (!persistentValues.tutorialAscend) {return}
    const res = challengeCheck('check', persistentValues.challengeCheck, null, value);
    const challengeDict = persistentValues.challengeCheck;
    
    if (res !== false) {
        newPop(4);
        challengePop(res);
        res.forEach((posArray) => {
            const challengeButton = document.getElementById(`challenge-button-${posArray[0]}-${posArray[1]}`);
            challengeButton.innerText = 'Unlocked';
            challengeButton.classList.add('challenge-button-unclaimed');

            let tierButton = document.getElementById(`tier-button-${posArray[0]}`);
            tierButton.challengeCount++;
            tierButton.updateChallengeCount();
            challengeMultiplier += (posArray[0] + 1) * 5;

            const challengeTitle = document.getElementById(`challenge-title-${posArray[0]}-${posArray[1]}`)
            challengeTitle.innerText = `${challengeInfo[posArray[0]][posArray[1]].title}`;
        });

        document.getElementById('challenge-text').updateNumber();

        let getAllAchievements = true;
        outerLoop: for (let tier in challengeDict) {
            for (let challenge in challengeDict[tier]) {
                if (challengeDict[tier][challenge] === false) {
                    getAllAchievements = false;
                    break outerLoop;
                }
            }
        }

        if (getAllAchievements) {
            persistentValues.allChallenges = true;
            const settingsBottomBadge = document.getElementById('badges-div');
            if (!settingsBottomBadge.querySelector('medal-img-3')) {
                settingsBottomBadge.append(createMedal(3, choiceBox, mainBody, stopSpawnEvents))
            }
        }
    }
}

function challengePop(res) {
    let challengePopUp;
    if (document.getElementById('challenge-pop')) {
        challengePopUp = document.getElementById('challenge-pop');
        clearTimeout(challengePopUp.activeTime);
    } else {
        challengePopUp = createDom('button', { class: ['challenge-pop-up'], id:'challenge-pop' });
        const challengePopText = createDom('p', { class: ['flex-row']});
        challengePopUp.textChild = challengePopText;
        challengePopUp.append(challengePopText);
    }

    if (res.length === 1) {
        challengePopUp.textChild.innerText = `Challenge Completed \n ${challengeInfo[res[0][0]][res[0][1]].title}`;
    } else if (res.length >= 1) {
        challengePopUp.textChild.innerText = `Multiple Challenges Completed`;
    }

    challengePopUp.activeTime = setTimeout(() => {
        challengePopUp.remove();
    }, 4000)

    challengePopUp.addEventListener('click', () => {
        challengePopUp.remove();
        clearTimeout(challengePopUp.activeTime);
    });

    if (!document.getElementById('challenge-pop')) {mainBody.append(challengePopUp);}
}

//-----------------------------------------------------------------TABLE 6 (TOOLTIPS FOR TABLE 1 & 2)-----------------------------------------------------------//
// TOOLTIP UI
function createTooltip() {
    tooltipName = document.createElement("div");
    tooltipName.classList += " tool-tip-name";
    
    const toolInfo = document.createElement("div");
    toolInfo.classList.add("flex-column","toolInfo");
    toolImgContainer = document.createElement("div");
    toolImgContainer.classList.add("toolImgContainer","background-image-cover");
    toolImgContainer.style.display = "none";

    toolImg = document.createElement("img");
    toolImg.src = "./assets/tooltips/Empty.webp";
    toolImg.classList.add("toolImg");

    toolImgOverlay = document.createElement("img");
    toolImgOverlay.src = "./assets/tooltips/Empty.webp";
    toolImgOverlay.classList.add("toolImgOverlay");
    toolImgContainer.append(toolImg,toolImgOverlay);
    
    tooltipText = document.createElement("div");
    tooltipText.classList.add("tool-tip-text");
    tooltipLore = document.createElement("div");
    tooltipLore.classList.add("tool-tip-lore");

    const tooltipExtraImg = document.createElement("div");
    tooltipExtraImg.classList.add("flex-row","tool-tip-extraimg");
    tooltipWeaponImg = document.createElement("img");
    tooltipElementImg = document.createElement("img");
    tooltipExtraImg.append(tooltipWeaponImg,tooltipElementImg);

    const breakdownButton = createDom('button', {
        class: ['flex-column', 'clickable'],
        innerText: 'Breakdown',
        id: 'hero-breakdown',
        style: {
            display: 'none'
        }
    });

    breakdownButton.addEventListener('click', () => {
        if (heroTooltip !== -1) {
            let upgradeCount = 0;
            for (let key in upgradeDict[heroTooltip]["milestone"]) {
                if (upgradeDict[heroTooltip]["milestone"][key]) {upgradeCount++};
            }

            let overallText;
            if (upgradeDict[heroTooltip].Purchased === 0) {
                overallText = 0;
            } else if (saveValues.dps === 0) {
                overallText = 100;
            } else {
                overallText = (Math.round(upgradeDict[heroTooltip].Contribution / saveValues.dps * 100 * 100) / 100);
            }

            let listText = createDom('p', { 
                id:'notif-list', 
                innerText: 
                `${heroTooltip === 0 ? 'Base Nuts/Click' : "Base NpS"}: ${abbrNum(upgradeDict[heroTooltip].BaseFactor, 2)}/lvl (No Item Buffs)\n
                ${heroTooltip === 0 ? 'Buffed Nuts/Click' : 'Buffed NpS'}: ${abbrNum(upgradeDict[heroTooltip].Factor, 2)}/lvl (With Item Buffs)\n
                Upgrades: ${upgradeCount} (Built into ${heroTooltip === 0 ? 'Base Nuts/Click' : 'Base NpS'})\n
                Overall: ${abbrNum(upgradeDict[heroTooltip].Contribution, 2)} (${overallText}% of total NpS before global buffs)`
            });
            choiceBox(document.getElementById('main-table'), {text: upgradeInfo[heroTooltip].Name}, stopSpawnEvents, ()=>{}, null, listText, ['notif-ele', 'hero-breakdown']);
        }
    })

    const upgradeSelection = document.createElement("form");
    upgradeSelection.classList.add('flex-column');
    upgradeSelection.id = 'upgrade-selection';
    upgradeSelection.style.display = 'none';
    upgradeSelection.currentValue = 'prefer-none';

    const preferDict = [
        { id: 'prefer-gem', label: 'Gems Only' },
        { id: 'prefer-book', label: 'Mats + Nuts Only' },
        { id: 'prefer-none', label: 'Gems > Mats + Nuts' }
    ];

    preferDict.forEach(preferItem => {
        const prefer = document.createElement('input');
        prefer.type = 'radio';
        prefer.id = preferItem.id;
        prefer.name = 'upgrade-preference';

        const preferLabel = document.createElement('label');
        preferLabel.classList.add('prefer-container');
        preferLabel.setAttribute('for', preferItem.id);

        const preferText = document.createElement('p');
        preferText.innerText = preferItem.label;
        const checkSpan = document.createElement('span');
        checkSpan.classList.add('checked-prefer');

        if (preferItem.id === 'prefer-none') {
            prefer.checked = true;
        }

        prefer.addEventListener('change', function() {
            if (prefer.checked) {
                upgradeSelection.currentValue = preferItem.id;
            }
        });

        preferLabel.prepend(prefer, preferText, checkSpan);
        upgradeSelection.appendChild(preferLabel);
    });

    const tooltipButton = document.createElement("button");
    tooltipButton.id = "tool-tip-button";
    tooltipButton.classList.add("background-image-cover");
    tooltipButton.innerText = "Purchase";
    let isMouseDown = false;
    let holdInterval;

    tooltipButton.addEventListener("click", () => {
        tooltipFunction();
    });

    tooltipButton.addEventListener("mousedown", () => { 
        isMouseDown = true;
        holdInterval = setInterval(function() {
            if (isMouseDown) tooltipFunction();
        }, 175);
    });

    tooltipButton.addEventListener("mouseup", () => { 
        isMouseDown = false;
        clearInterval(holdInterval);
    });

    tooltipButton.addEventListener("mouseleave", () => { 
        isMouseDown = false;
        clearInterval(holdInterval);
    });

    table6Background = document.createElement("img");
    table6Background.src = "./assets/tooltips/background.webp"
    table6Background.classList.add("table6-background");
    toolInfo.append(toolImgContainer,tooltipText,tooltipExtraImg);
    table6.append(tooltipName, toolInfo, breakdownButton, tooltipLore, upgradeSelection, table6Background, tooltipButton);
}

var tooltipInterval = null;
function changeTooltip(dict, type, number) {
    if (tooltipInterval !== null) {
        clearInterval(tooltipInterval);
        tooltipInterval = null;
    }
    tooltipName.innerText = dict.Name;
    
    let lore = dict.Lore;
    tooltipLore.innerHTML = textReplacer({
        "[s]":`<span style='color:#A97803'>`,
        "[/s]":`</span>`,
        "\n":`<br>`,
        "[wBuff]":`${Math.round((buffLookUp["[wBuff]"][dict.Star] * 100 - 100) * additionalStrength)}%`,
        "[aBuff]":`${Math.round((buffLookUp["[aBuff]"][dict.Star] * 100 - 100) * additionalStrength)}%`,
        "[fBuff]":`${Math.round((buffLookUp["[fBuff]"][dict.Star] * 100 - 100) * additionalDefense)}%`,
        "[nBuff]":`${Math.round((buffLookUp["[nBuff]"][dict.Star] * 100 - 100) * additionalDefense)}%`,
        "[eBuff]":`${Math.round((buffLookUp["[eBuff]"][dict.Star] * 100 - 100) * additionalDefense)}%`,
        "[4eBuff]":`${Math.round((2 * 100 - 100) * additionalDefense)}%`,
    },lore);

    if (toolImgContainer.style.display != "block") {
        toolImgContainer.style.display = "block";
    }

    if (type == "hero") {
        universalStyleCheck(document.getElementById('hero-breakdown'), 'display', 'none', 'flex', true);
        toolImgOverlay.src = "./assets/tooltips/hero/"+dict.Name+".webp";
        let tooltipTextLocal = "Level: " + upgradeDict[number]["Purchased"] + 
                                "\n Discounted Lvls: " + saveValues["freeLevels"] + 
                                "\n" + abbrNum(upgradeDict[number]["Contribution"],2) + ` ${dict.Name === "Nahida" ? 'Nuts per Click' : 'Nps'}`;
        
        tooltipElementImg.src = "./assets/tooltips/elements/" +dict.Ele+ ".webp";
        if (tooltipElementImg.style.display != "block") {
            tooltipElementImg.style.display = "block";
        }
        tooltipWeaponImg.src = "./assets/tooltips/elements/" +dict.Type+ ".webp";
        if (tooltipWeaponImg.style.display != "block") {
            tooltipWeaponImg.style.display = "block";
        }
        
        tooltipText.innerText = tooltipTextLocal;
    } else if (type == "milestone") {
        universalStyleCheck(document.getElementById('hero-breakdown'), 'display', 'flex', 'none', true);
        toolImgOverlay.src = "./assets/tooltips/hero/"+dict.Name+".webp";

        let upgradeLevel = 50;
        let level = 0;
        if (number >= 350) {
            upgradeLevel = 400;
            level = 5;
        } else if (number >= 200) {
            upgradeLevel = 200;
            level = 4;
        } else if (number >= 75) {
            upgradeLevel = 100;
            level = 3;
        }

        let extraText = "";
        if (level > 0) {
            if (dict.Ele !== "Any") {
                extraText = `& ${level - 1}-Star <span style='color:#A97803'>${dict.Nation}</span> Materials
                            OR <span style='color:#A97803'> ${dict.Ele === "Any" ? "Any" : dict.Ele} </span> ${level}-Star Gem`;
            } else {
                extraText = `& <span style='color:#A97803'> ${dict.Ele === "Any" ? "Any" : dict.Ele} </span> ${level}-Star Gem`;
            }
        }

        let nahidaText = "";
        if (dict.Name === "Nahida") {
            nahidaText = "<br><br> Also, adds <span style='color:#A97803'>3 ATK</span> to clicking DMG during Expedition combat.";
        }

        tooltipText.innerHTML = `Level ${number} Upgrade`;
        tooltipLore.innerHTML = `${dict.Name} becomes <span style='color:#A97803'>${upgradeLevel}%</span> more efficient at gathering nuts. ${nahidaText}
                                <br><br> Cost: <span style='color:#A97803'> ${abbrNum((4 * upgradeDict[heroTooltip.split("-")[0]]["BaseCost"] * (COSTRATIO ** (number - 1))),2)} </span> Nuts
                                ${extraText}`;

        tooltipElementImg.src = "./assets/tooltips/elements/" +dict.Ele+ ".webp";
        if (tooltipElementImg.style.display != "block") {
            tooltipElementImg.style.display = "block";
        }
        tooltipWeaponImg.src = "./assets/tooltips/elements/" +dict.Type+ ".webp";
        if (tooltipWeaponImg.style.display != "block") {
            tooltipWeaponImg.style.display = "block";
        }

        
    } else if (type == "item") {
        toolImg.src = "./assets/frames/background-" + dict.Star + ".webp";
        toolImgOverlay.src = "./assets/tooltips/inventory/" + dict.File + ".webp";
        tooltipText.innerText = "Amount: " + InventoryMap.get(number);
        if (number < 2000) {
            tooltipWeaponImg.src = "./assets/tooltips/elements/" + dict.Type + ".webp";
        } else if (number > 2000 && number < 3000) {
            tooltipWeaponImg.src = "./assets/tooltips/elements/Artifact.webp";
        } else if (number > 3000 && number < 4000) {
            tooltipWeaponImg.src = "./assets/tooltips/elements/Food.webp";
        } else if (number > 4000 && number < 5000) {
            tooltipWeaponImg.src = "./assets/tooltips/elements/Level.webp";
        } else if (number > 5000 && number < 6000) {
            tooltipWeaponImg.src = "./assets/tooltips/elements/"+ dict.element + ".webp";
        } else {
            tooltipWeaponImg.src = "./assets/tooltips/elements/Talent.webp";
        }

        if (tooltipWeaponImg.style.display != "block") {
            tooltipWeaponImg.style.display = "block";
            tooltipWeaponImg.style.margin = "auto";
        }
        
        if (tooltipElementImg.style.display != "none") {
            tooltipElementImg.style.display = "none";
            tooltipElementImg.style.margin = "0";
        }

        return;
    }
}

function clearTooltip() {
    heroTooltip = -1;
    tooltipInterval = setTimeout(() => {
        if (table1.style.display !== "none") {
            tooltipName.innerText = "Tap a character for more info!";
            universalStyleCheck(document.getElementById('hero-breakdown'), 'display', 'flex', 'none', true);
        }

        if (table2.style.display !== "none") {
            tooltipName.innerHTML = `Go on Expeditions to get items!`;
        }

        tooltipText.innerText = "";
        tooltipLore.innerText = "";
        toolImgContainer.style.display = "none";
        tooltipWeaponImg.src = "./assets/tooltips/Empty.webp";
        tooltipWeaponImg.style.display = "none"
        tooltipElementImg.src = "./assets/tooltips/Empty.webp";
        tooltipElementImg.style.display = "none"
        toolImg.src = "./assets/tooltips/Empty.webp";
        toolImgOverlay.src = "./assets/tooltips/Empty.webp";
        tooltipInterval = null;
    }, 100)
}

function reduceItem(localItemTooltip, usingTooltip = false) {
    let itemButton = document.getElementById(localItemTooltip);
    let inventoryCount = InventoryMap.get(localItemTooltip);
    inventoryCount--;
    InventoryMap.set(localItemTooltip, Math.max(inventoryCount, 0));

    persistentValues.itemsUsedValue++;

    if (usingTooltip && itemButton) {
        if (inventoryCount > 0) {
            changeTooltip(Inventory[localItemTooltip],"item", localItemTooltip);
        } else if (inventoryCount <= 0) {
            let nextButton = itemButton.nextSibling;
            if (nextButton) {
                let idNum = parseInt(nextButton.id);
                itemTooltip = idNum;
                changeTooltip(Inventory[idNum],"item",idNum);
                nextButton.classList.add("inventory-selected");
            } else {
                itemTooltip = -1;
                clearTooltip();
            }
            itemButton.remove();
        }
    } else {
        if (inventoryCount <= 0 && itemButton) {
            itemButton.remove();
        }
    }
    if (itemButton) itemButton.updateNumber();
}

function tooltipFunction() {
    if (tooltipTable == 1) {
        if (heroTooltip === -1) {return}
        if (milestoneOn) {
            milestoneBuy(heroTooltip);
        } else {
            upgrade(heroTooltip);
        }
        
        return;
    } else if (tooltipTable == 2) {
        if (itemTooltip === -1) {return}
        if (timerSeconds !== 0) {
            upgradeElement.load();
            upgradeElement.play();
        }

        itemUse(itemTooltip);
        reduceItem(itemTooltip, true);
    } else {
        return;
    }
}

//------------------------------------------------------------------------TABLE 7 (STORE)------------------------------------------------------------------------//
// CHECK PRIMOGEMS TO SPAWN SHOP
function shopCheck() {
    if (storeInventory.active == false) {
        if (saveValues["primogem"] > SHOP_THRESHOLD) {
            // GENERATING A LOCAL SHOP
            Shop.addShop(tabChange);
            shopTime = getTime();
            storeInventory.storedTime = getTime();
            storeInventory.active = true;
            setShop("add");
            newPop(5);
            newPop(13);
        }
    }
}

// SHOP TIMER
function shopTimerFunction() {
    if (shopTimerElement != null) {
        const timePassed = Math.floor(getTime() - parseInt(storeInventory.storedTime));
        shopTimerElement.innerText = "Inventory resets in: " +Math.floor(SHOPCOOLDOWN-timePassed)+ " minutes";
        if (timePassed >= SHOPCOOLDOWN) {
            refreshShop();
        }
    }
}

function changeSkinCollection(key) {
    const keyNumber = key.charAt(key.length - 1);
    const currentKey = document.body.skinCollection;

    if (!document.getElementById(`skin-collection-${keyNumber}`)) {
        let link = createDom("link", {
            href: `./modules/features/set-${keyNumber}.css`,
            type: 'text/css',
            rel: 'stylesheet',
            id: `skin-collection-${keyNumber}`,
            disabled: false,
        });
        document.head.appendChild(link);
        document.body.skinCollection = keyNumber;
    } else {
        const skinCollection = document.getElementById(`skin-collection-${keyNumber}`);
        if (keyNumber === currentKey) {
            skinCollection.disabled = true;
            document.body.skinCollection = 0;
        } else {
            skinCollection.disabled = false;
            document.body.skinCollection = keyNumber;
        }
    }

    if (currentKey !== undefined && currentKey !== 0) {
        const oldSkinCollection = document.getElementById(`skin-collection-${currentKey}`);
        oldSkinCollection.disabled = true;
    }

    persistentValues.collectionSkin = document.body.skinCollection;
}

function changeBigNahida(key) {
    let demoButton = document.getElementById('demo-main-img');
    if (demoButton.skin === key) {
        demoButton.skin = settingsValues.preferOldPic ? 'Old' : 'New';
    } else {
        demoButton.skin = key;
    }

    persistentValues.nahidaSkin = demoButton.skin;
    demoButton.revertPicture();
}

function setShop(type) {
    table7.classList.add("table-without-tooltip");
    const shopImg = document.createElement("img");
    shopImg.src = "./assets/icon/shop-start.webp";

    const minutesPassed = (getTime() / (1000 * 60));
    shopTimerElement = document.createElement("div");
    shopTimerElement.classList.add("flex-column", "store-timer", "background-image-cover");
    shopTimerElement.id = "shop-timer";
    shopTimerElement.innerText = "Inventory resets in: " + (SHOPCOOLDOWN - (storeInventory.storedTime - minutesPassed)) + " minutes";

    const shopDiv = createDom("div", {
        class: ["store-div"],
        id: "shop-container",
        style: { display: 'flex' }
    });

    if (type === "load" && storeInventory.storedTime !== 0) {
        for (let i = Object.keys(storeInventory).length - 2; i > 0; i--) {
            loadShopItems(shopDiv, i, storeInventory[i]);
        }
    } else if (type === "add" || storeInventory.storedTime === 0) {
        storeInventory.storedTime = getTime();
        let i = 10;
        while (i--) {
            createShopItems(shopDiv, i, Shop.drawShopItem(i, persistentValues, inventoryDraw, saveValues));
        }
        saveData(true);
    }

    const shopDialogueDiv = document.createElement("div");
    shopDialogueDiv.classList.add("flex-row","store-dialog");

    const shopDialogueButton = document.createElement("div");
    shopDialogueButton.classList.add("flex-row","store-buy");
    shopDialogueButton.innerText = "Confirm Purchase";
    shopDialogueButton.id = "shop-confirm";

    const shopDialogueText = document.createElement("div");
    shopDialogueText.classList.add("flex-column");
    shopDialogueText.id = "table7-text";

    const shopBackdoor = createButton('dim-button', {
        id: 'shop-backdoor',
        class: ['shop-backdoor'],
        style: {
            display: persistentValues.unusualBossDefeat || beta ? 'block' : 'none',
        }
    });

    const shopBlackContainer = Shop.drawBlackMarket(persistentValues, blackMarketFunctions, choiceBox);
    shopBackdoor.addEventListener('click', () => {
        if (table7.classList.contains('table7-bg')) {
            table7.classList.add('table7-alt');
            table7.classList.remove('table7-bg');
        } else {
            table7.classList.add('table7-bg');
            table7.classList.remove('table7-alt');
        }

        if (document.getElementById('black-market-currency')) {
            document.getElementById('black-market-currency').updateValues();
        }

        universalStyleCheck(shopBlackContainer, 'display', 'flex', 'none');
        universalStyleCheck(shopDiv, 'display', 'none', 'flex');
    })

    shopDialogueDiv.append(shopDialogueText,shopDialogueButton);
    table7.append(shopImg,shopTimerElement,shopDiv,shopBlackContainer,shopDialogueDiv,shopBackdoor);
}

var shopId = null;
function buyShop(id, shopCost, blackDict) {
    let button = document.getElementById(id);
    let confirmButton = document.getElementById("shop-confirm");

    if (button.classList.contains("purchased")) {
        return;
    }

    if (shopId !== null) {
        let oldButton = document.getElementById(shopId);
        if (oldButton.classList.contains("shadow-pop-tr")) {
            oldButton.classList.remove("shadow-pop-tr");
        }
        if (oldButton.classList.contains("glowing-pop")) {
            oldButton.classList.remove("glowing-pop");
        }
        
        let confirmButtonNew = confirmButton.cloneNode(true);
        confirmButton.parentNode.replaceChild(confirmButtonNew, confirmButton);
        confirmButton = confirmButtonNew;
    }

    if (shopId == id) {
        Shop.changeStoreDialog(persistentValues.tutorialAscend ? 'ascendLoad' : 'normalLoad');
        
        shopId = null;
        let confirmButtonNew = confirmButton.cloneNode(true);
        confirmButton.parentNode.replaceChild(confirmButtonNew, confirmButton);
    } else {
        Shop.changeStoreDialog(persistentValues.tutorialAscend ? 'retryAscendConfirm' : 'retryConfirm');
        
        let itemType = id.split('-')[0];
        if (itemType === 'black') {
            button.classList.add("glowing-pop");
        } else {
            button.classList.add("shadow-pop-tr");
        }
        
        confirmButton.addEventListener("click", function() {
            confirmPurchase(shopCost, id, blackDict);
        });
        shopId = id;
    }
}

function refreshShop() {
    shopTime = getTime();
    shopId = null;

    let pressedButton = document.querySelector('.shadow-pop-tr, .glowing-pop');
    if (pressedButton) { 
        if (pressedButton.classList.contains('shadow-pop-tr')) {
            pressedButton.classList.remove('shadow-pop-tr'); 
        } else {
            pressedButton.classList.remove('glowing-pop'); 
        }
    }

    let shopContainer = document.getElementById("shop-container");
    shopContainer.innerHTML = "";

    let i = 10;
    while (i--) {
        createShopItems(shopContainer, i, Shop.drawShopItem(i, persistentValues, inventoryDraw, saveValues));
    }

    Shop.changeStoreDialog('clear');
    Shop.regenBlackPrice(persistentValues.blackMarketDict);
    storeInventory.storedTime = getTime();
    if (!recentlyLoaded) sidePop('/icon/tab7.webp', 'Shop Refreshed!');
}

function successPurchase(mainButton) {
    if (mainButton.classList.contains('shadow-pop-tr')) {
        mainButton.classList.remove('shadow-pop-tr'); 
    } else {
        mainButton.classList.remove('glowing-pop'); 
    }

    let confirmButton = document.getElementById("shop-confirm");
    let confirmButtonNew = confirmButton.cloneNode(true);
    confirmButton.parentNode.replaceChild(confirmButtonNew, confirmButton);

    Shop.changeStoreDialog(persistentValues.tutorialAscend ? 'purchaseSuccessAscend' : 'purchaseSuccessRegular');
    shopElement.load();
    shopElement.play();
}

function confirmPurchase(shopCost, id, blackDict) {
    let mainButton = document.getElementById(id);
    if (saveValues.primogem >= shopCost) {
        let typeShop = id.split("-")[0];
        let saveId = id.split("-")[1];
        let itemId = id.split("-")[2];

        if (typeShop === 'black') {
            if (persistentValues.ascendEle[blackDict.ele] >= blackDict.eleCost) {
                shopId = null;
                persistentValues.ascendEle[blackDict.ele] -= blackDict.eleCost;
                saveValues.primogem -= shopCost;
                document.getElementById('black-market-currency').updateValues();

                persistentValues.blackMarketDict[saveId].level++;
                let blackCard = document.getElementById(id);
                blackCard.level = persistentValues.blackMarketDict[saveId].level;

                if (persistentValues.blackMarketDict[saveId].level === persistentValues.blackMarketDict[saveId].maxLevel) {
                    blackCard.increaseLevel(persistentValues.blackMarketDict, saveId, false);
                } else {
                    blackCard.increaseLevel(persistentValues.blackMarketDict, saveId, true);
                }

                successPurchase(mainButton);
                let allItemsPurchased = true;
                for (let key in blackShopDict) {
                    if (blackShopDict[key].maxLevel !== persistentValues.blackMarketDict[key].level) {
                        allItemsPurchased = false;
                        break;
                    }
                }

                if (allItemsPurchased) {
                    challengeNotification(({category: 'specific', value: [3, 4]}));
                }
            } else {
                Shop.changeStoreDialog(persistentValues.tutorialAscend ? 'purchaseFailAscend' : 'purchaseFailRegular');
                return;
            }
        } else if (typeShop === 'shop') {
            shopId = null;
            itemId = parseInt(itemId);

            if (itemId >= 4019 && itemId < 4022) {
                addTreeCore(randomInteger(3, 6), itemId - 4018, true);
            } else {
                newPop(1);
                inventoryAdd(itemId);
                sortList("table2");
            }
            
            mainButton.classList.add("purchased");
            saveValues.primogem -= shopCost;
    
            successPurchase(mainButton);
    
            storeInventory[parseInt(saveId)].Purchased = true;
            let allItemsPurchased = true;
            for (let key in storeInventory) {
                if (storeInventory[key].Purchased !== undefined && storeInventory[key].Purchased === false) {
                    allItemsPurchased = false;
                    break;
                }
            }
    
            if (allItemsPurchased) {
                challengeNotification(({category: 'specific', value: [1, 1]}));
            }
        }
    } else {
        Shop.changeStoreDialog(persistentValues.tutorialAscend ? 'purchaseFailAscend' : 'purchaseFailRegular');
        return;
    }
}

function createShopButton(inventoryTemp, inventoryNumber, shopCost, purchased = false, slotNumber) {
    const shopButton = createDom('div', { 
        classList: ["flex-column", "shop-button"],
        id: `shop-${slotNumber + 1}-${inventoryNumber}-${shopCost}`
    });
    const shopButtonImage = createDom('img', { src: `./assets/tooltips/inventory/${inventoryTemp.File}.webp` });

    const shopButtonImageContainer = createDom('div', {
        classList: ["flex-column", "shop-button-container"],
        style: { background: `url(./assets/frames/background-${inventoryTemp.Star}.webp) center center / cover no-repeat` }
    });

    const shopButtonPrimo = createDom('img', {
        classList: ["shop-button-primo"],
        src: './assets/icon/primogemIcon.webp',
    })

    const shopButtonText = createDom('div', { 
        classList: ["flex-row","shop-button-text"],
        innerText: shopCost,
        child: [shopButtonPrimo]
    });

    if (!purchased) {
        shopButton.addEventListener("click", function() {
            buyShop(shopButton.id, shopCost);
        })
    } else {
        shopButton.classList.add('purchased');
    }
    
    shopButtonImageContainer.appendChild(shopButtonImage);
    shopButton.append(shopButtonImageContainer, shopButtonText);
    return shopButton;
}

function createShopItems(shopDiv, i, inventoryNumber) {
    const inventoryTemp = Inventory[inventoryNumber];

    const shopCost = Shop.calculateShopCost(inventoryTemp.Star, costDiscount);
    const shopButton = createShopButton(inventoryTemp, inventoryNumber, shopCost, false, i);
    shopDiv.append(shopButton);

    storeInventory[i + 1].Purchased = false;
    storeInventory[i + 1].Item = inventoryNumber;
    storeInventory[i + 1].Cost = shopCost;

    return shopDiv;
}

function loadShopItems(shopDiv, i, inventoryArray) {
    const purchased = inventoryArray.Purchased;
    const shopCost = inventoryArray.Cost;
    const inventoryNumber = inventoryArray.Item;

    const inventoryTemp = Inventory[inventoryNumber];
    shopDiv.append(createShopButton(inventoryTemp, inventoryNumber, shopCost, purchased, i));

    return shopDiv;
}

//------------------------------------------------------------------------ BLACK MARKET ITEMS ------------------------------------------------------------------------//
const mousedownAutoEvent = new CustomEvent('mousedown', {
    'detail': true,
    bubbles: true,
    cancelable: true,
    button: 0, 
});

const mouseupAutoEvent = new CustomEvent('mouseup', {
    'detail': true,
    bubbles: true,
    cancelable: true,
    button: 0,
});

function autoClickNahida(type = 'use') {
    if (type === 'equip') {
        persistentValues.autoClickNahida = !persistentValues.autoClickNahida;
        autoClickNahida('use');
        return persistentValues.autoClickNahida;
    } else {
        if (!persistentValues.autoClickNahida) {return}
        if (type === 'use') {
            if (autoClickTimer !== null) {
                clearTimeout(autoClickTimer);
                autoClickTimer = null;
            }

            let delay;
            if (persistentValues.blackMarketDict['materialCollector'].level === 3) {
                delay = 800;
            } else if (persistentValues.blackMarketDict['materialCollector'].level === 2) {
                delay = 1200;
            } else if (persistentValues.blackMarketDict['materialCollector'].level === 1) {
                delay = 1500;
            }

            let demoButton = document.getElementById('demo-main-img');
            if (demoButton) {
                demoButton.dispatchEvent(mousedownAutoEvent);
                setTimeout(() => {
                    demoButton.dispatchEvent(mouseupAutoEvent);
                    autoClickTimer = setTimeout(() => {autoClickNahida('use')}, delay);
                }, 100);
            } else {
                setTimeout(() => { autoClickNahida('use')}, 1000);
            }
        }
    }
}

function autoConsumeFood(type = 'check', foodID = null) {
    if (type === 'equip') {
        persistentValues.autoFood = !persistentValues.autoFood;
        autoConsumeFood('check');
        return persistentValues.autoFood;
    } else {
        if (!persistentValues.autoFood) {return}
        if (type === 'check') {
            if (foodTimer !== null) {
                clearTimeout(foodTimer);
                foodTimer = null;
            }
    
            // ALREADY CONSUMED FOOD
            const foodEle = document.getElementById('temp-buff-1');
            if (foodEle) {
                const timeElapsed = (getTime() - foodEle.creationTime) * 60;
                setTimeout(() => {autoConsumeFood('check')}, 1005 * (30 - timeElapsed));
                return;
            }
    
            const itemChildren = table2.children;
            // FOUND FOOD
            for (let i = 0; i < itemChildren.length; i++) {
                const childId = parseInt(itemChildren[i].id);
                if (!isNaN(childId) && childId >= 3001 && childId <= 4000) {
                    autoConsumeFood('use', childId);
                    return;
                }
            }
    
            // DID NOT FIND FOOD
            foodTimer = setTimeout(() => {autoConsumeFood('check')}, 1000 * 45);
        } else if (type === 'use') {
            console.log(`Auto Consuming Food: ${foodID}`);
            itemUse(foodID);
            reduceItem(foodID, false);
            foodTimer = setTimeout(() => {autoConsumeFood('check')}, 1005 * 30);
        }
    }
}

//------------------------------------------------------------------------ GOLDEN NUT STORE ------------------------------------------------------------------------//
// COSTS OF NUT PURCHASE
function nutCost(id) {
    let amount = persistentValues.upgrade[id];
    let scaleCeiling = permUpgrades[id].Max;
    let cost = 1;
    if (scaleCeiling === 50) {
        cost = Math.ceil((amount)**2.6);
    } else if (scaleCeiling === 25) {
        cost = Math.ceil((amount)**3.3);
    }

    if (id >= PERM_UPGRADES_CUTOFF) {
        cost += 100 * (amount + 1);
        if (scaleCeiling === 50) {
            cost = Math.ceil(cost*(amount + 1)**0.3);
        } else if (scaleCeiling === 25) {
            cost = Math.ceil(cost*(amount + 1)**0.5);
        }
    }

    cost = Math.max(cost, 1);
    return cost;
}

// ADDS ACCESS BUTTON AFTER 1 NUT
function addNutStore() {
    let preloadArray = [];
    for (let i=1; i < 8; i++) {
        preloadArray.push(`./assets/tooltips/nut-shop-${1}.webp`);
    }
    preloadStart.fetch(preloadArray);

    const mainTable = rightDiv.childNodes[1];
    const nutStoreTable = document.createElement("div");
    nutStoreTable.classList.add("table-without-tooltip","nut-store-table","flex-column");
    nutStoreTable.id = "nut-store-table";

    const nutStoreCurrency = document.createElement("div");
    nutStoreCurrency.id = "nut-store-currency";
    nutStoreCurrency.classList.add("flex-row");
    nutStoreCurrency.innerText = abbrNum(persistentValues["goldenCore"],2,true);
    const nutStoreCurrencyImage = document.createElement("img");
    nutStoreCurrencyImage.src = "./assets/icon/core.webp";
    nutStoreCurrency.appendChild(nutStoreCurrencyImage);

    const shopHeader = document.createElement("img");
    shopHeader.src = "./assets/tooltips/store-header.webp";

    const nutShopDiv = document.createElement("div");
    nutShopDiv.id = "nut-shop-div";
    const nutTranscend = document.createElement("div");
    nutTranscend.id = "nut-shop-transcend";
    nutTranscend.style.display = "none";
    const nutAscend = document.createElement("div");
    nutAscend.id = "nut-shop-ascend";
    nutAscend.innerText = "\n[Locked. Come back later!]";
    
    let nutButtonContainer = document.createElement("div");
    nutButtonContainer.classList.add('flex-row','nut-button-container');
    const buttonText = ["Blessings","Transcend","Ascend"];
    const nutArray = [nutShopDiv,nutTranscend,nutAscend];
    for (let i = 0; i < 3; i++) {
        let nutButton = document.createElement("button");
        nutButton.classList.add('clickable');
        nutButton.innerText = buttonText[i];
        nutButton.addEventListener("click",()=>{
            for (let j = 0; j < 3; j++) {
                if (nutArray[j].style.display !== "none") {
                    nutArray[j].style.display = "none";
                }
            }
            nutArray[i].style.display = "flex";
        })
        nutButtonContainer.appendChild(nutButton);
    }

    let nutStoreButton = createDom('button', {
        classList: ["nut-store-access"],
    });
    
    nutStoreButton.addEventListener("click",() => {
        updateCoreCounter();
        calculateGoldenCore();
        universalStyleCheck(nutStoreTable,"display","flex","none");
    })

    leftDiv.append(nutStoreButton);

    nutShopDiv.createCell = (i) => {
        let nutShopItem = document.createElement("div");
        nutShopItem.classList.add("nut-shop-button","flex-row");
        nutShopItem.id = "nut-shop-" + i;

        let nutShopTitle = createDom("p", { innerText: permUpgrades[i]["Name"] });
        let nutShopButton = createDom("div", { classList:["flex-column"] });
        let nutShopButtonBottom = createDom('div', {
            innerText: `${abbrNum(nutCost(i),2,true)}`,
            child: [createDom('img', { src:"./assets/icon/core.webp" })]
        });

        let nutShopLevel = createDom("p");
        if (permUpgrades[i].Cap === true) {
            if (persistentValues.upgrade[i] >= permUpgrades[i].Max) {
                nutShopLevel.innerText = `Level MAX`;
                nutShopButtonBottom.innerText = "MAXED";
            } else {
                nutShopLevel.innerText = `Level ${persistentValues.upgrade[i]}`;
                nutShopButton.addEventListener("click",()=>{nutPurchase(nutShopItem.id)});
            }
        } else {
            nutShopLevel.innerText = `Level ${persistentValues.upgrade[i]}`;
            nutShopButton.addEventListener("click",()=>{nutPurchase(nutShopItem.id)})
        }
        
        let nutShopImg = createDom('img', { src: `./assets/tooltips/nut-shop-${i}.webp` });
        let nutShopDesc = createDom("p");
        nutShopDesc.updateText = (index) => {
            if (permUpgrades[index]["zeroDescription"] !== undefined && persistentValues.upgrade[index] <= 0) {
                nutShopDesc.innerText = `${permUpgrades[index]["zeroDescription"]}
                                        (Effect: ${Math.round(10 * permUpgrades[index].Effect * persistentValues.upgrade[index]) / 10}%)`;
            } else {
                nutShopDesc.innerText = `${permUpgrades[index]["Description"]}
                                        (Effect: ${Math.round(10 * permUpgrades[index].Effect * persistentValues.upgrade[index]) / 10}%)`;
            }
        }
        nutShopDesc.updateText(i);
        
        nutShopButton.append(createDom("p", { innerText: `Upgrade` }), nutShopButtonBottom);
        nutShopItem.append(nutShopTitle,nutShopLevel,nutShopImg,nutShopDesc,nutShopButton);
        nutShopDiv.appendChild(nutShopItem);
    }

    for (let i = 1; i < 13; i++) {
        nutShopDiv.createCell(i);
    }

    nutShopDiv.activateWorkshopCell = () => {
        for (let i = PERM_UPGRADES_CUTOFF; i < getHighestKey(permUpgrades) + 1; i++) {
            if (document.getElementById("nut-shop-" + i)) { continue }
            nutShopDiv.createCell(i);
        }
    }

    if (persistentValues.workshopBossDefeat) {
        nutShopDiv.activateWorkshopCell();
    }

    nutShopDiv.style.display = "flex";
    nutAscend.style.display = "none";
    nutTranscend.classList.add("nut-transcend","flex-column");
    const titleText = document.createElement("p");
    titleText.innerText = "Do you wish to turn \n back time and transcend?";

    const bodyText = document.createElement("div");
    bodyText.classList.add("flex-row", 'transcend-body')
    const bodyTextLeft = document.createElement("p");
    bodyTextLeft.innerText = `You lose: \n All Nuts, \n All Items, \n Energy, \n Primogems`;
    bodyTextLeft.classList.add("flex-column");
    const bodyTextRight = document.createElement("p");
    bodyTextRight.id = "transcend-display";
    bodyTextRight.classList.add("flex-column");
    bodyText.append(bodyTextLeft,bodyTextRight);

    const bodyTextBottom = document.createElement("p");
    bodyTextBottom.innerText = "Gain more by upgrading heroes, getting \nachievements & nuts (golden or otherwise).";

    const transcendHelpbox = document.createElement("p");
    transcendHelpbox.id = 'transcend-helpbox';
    transcendHelpbox.style.display = 'block';
    transcendHelpbox.subtitle = 'Extra Info';
    transcendHelpbox.innerHTML = `What is the Golden Core amount affected by? <br/>------------------------------<br/>
                                Character Ascensions (V. High Priority)<br/>
                                Character Upgrades (V. High Priority)<br/>------------------------------<br/>
                                Character Levels (High Priority)<br/>
                                Achievements (High Priority)<br/>------------------------------<br/>
                                Golden Nuts (Low Priority)<br/>
                                Regular Nuts (Low Priority)</span>`;

    const transcendStats = createDom('button', { innerText:'Breakdown' })
    transcendStats.addEventListener('click', () => {
        const mostContributeDict = calculateGoldenCore('highestAmount');
        let listText;
        if (mostContributeDict !== 'Nothing') {
            let sortedEntries = Object.entries(mostContributeDict).sort((a, b) => b[1] - a[1]);
            sortedEntries = sortedEntries.slice(0, 7);
           
            let listInnerText = '';
            listInnerText += 'Golden Core Amounts: \n'
            for (let i = 0; i < sortedEntries.length; i++) {
                listInnerText += `${(i + 1)}. ${sortedEntries[i][0]}: ${abbrNum(sortedEntries[i][1],2,true)}\n`;
            }
            listText = createDom('p', { id:'notif-list', innerText: listInnerText });
        } else {
            listText = createDom('p', { id:'notif-list', innerText: 'Nothing...' });
        }

        listText.subtitle = 'Amounts';
        slideBox(mainBody, [listText, transcendHelpbox], stopSpawnEvents);
    })


    const trascendButton = document.createElement("button");
    trascendButton.innerText = "Transcend!";
    trascendButton.addEventListener("click",() => {
        calculateGoldenCore();
        choiceBox(mainBody, {text: 'Are you sure? Transcending cannot be undone!'}, null, 
        () => {transcendFunction()}, undefined, null, ['choice-ele']);
    })

    const transcendBottom = createDom('div', {
        class: ['flex-row', 'transcend-bottom'],
        child: [transcendStats, trascendButton]
    })

    nutTranscend.append(titleText,bodyText,bodyTextBottom,transcendBottom);

    nutStoreTable.append(shopHeader,nutTranscend,nutShopDiv,nutAscend,nutButtonContainer,nutStoreCurrency);
    mainTable.appendChild(nutStoreTable);
    calculateGoldenCore();

    if (persistentValues.tutorialAscend) createAscend();
}

function createAscend() {
    if (document.getElementById('ascend-text')) {return};
    let ascend = document.getElementById('nut-shop-ascend');
    ascend.innerText = '';

    let ascendText = document.createElement('p');
    ascendText.innerText = "Ascension (Effective after transcending)";
    ascendText.id = 'ascend-text';

    let elementContainer = document.createElement('div');
    elementContainer.classList.add('flex-row');
    elementContainer.activeElement;
    elementContainer.activeChar = null;
    
    const boxBeta = ["Pyro","Hydro","Dendro","Electro","Anemo","Cryo","Geo"];
    for (let i = 0; i < boxBeta.length; i++) {
        let text = document.createElement('img');
        text.classList.add("nut-element",'dim-filter');
        text.ele = boxBeta[i];
        text.src = `./assets/tooltips/elements/nut-${boxBeta[i]}.webp`;
        elementContainer.appendChild(text);

        text.addEventListener('click',()=>{
            if (elementContainer.activeElement) {
                if (!elementContainer.activeElement.classList.contains('dim-filter')) elementContainer.activeElement.classList.add('dim-filter');
            }

            if (text.classList.contains('dim-filter')) text.classList.remove('dim-filter');
            elementContainer.activeElement = text;
            showChar(boxBeta[i]);
        })
    }

    let characterContainer = document.createElement('div');
    characterContainer.classList.add('flex-row');
    let characterImgContainer = document.createElement('div');
    characterImgContainer.classList.add('nut-char-container');
    let ascendInfo = document.createElement('div');
    ascendInfo.classList.add('ascend-info');
    let ascendTooltips = document.createElement('p');

    let ascendCurency = document.createElement('div');
    ascendCurency.classList.add('flex-row');
    ascendCurency.ele = null;
    ascendCurency.addEventListener('click', (() => {ascendChar(elementContainer.activeChar)}))
    let ascendNumber = document.createElement('p');
    let ascendEle = createDom('img');
    ascendEle.src = '';
    ascendEle.classList.add('icon','primogem');

    ascendCurency.append(ascendNumber,ascendEle);
    ascendInfo.append(ascendTooltips,ascendCurency)
    characterContainer.append(characterImgContainer,ascendInfo);
    ascend.append(ascendText,elementContainer,characterContainer);

    function showChar(ele) {
        ascendTooltips.innerText = '';
        ascendNumber.innerText = `${abbrNum(persistentValues.ascendEle[ele], 2, true)}`;
        ascendEle.src = `./assets/tooltips/inventory/solid${ele}.webp`;

        characterImgContainer.style.opacity = 0;
        elementContainer.activeChar = null;
        while (characterImgContainer.firstChild) {
            characterImgContainer.removeChild(characterImgContainer.firstChild);
        }

        const charArray = [];
        for (let key in upgradeDict) {
            if (upgradeDict[key].Purchased > 0 && (upgradeInfo[key].Ele === ele || upgradeInfo[key].Ele === "Any")) {
                charArray.push(upgradeInfo[key].Name);
                let charImg = createDom('img');
                charImg.classList.add('dim-filter');
                charImg.src = `./assets/tooltips/hero/${upgradeInfo[key].Name}.webp`;
                charImg.addEventListener('click',()=>{
                    let level = persistentValues.ascendDict[upgradeInfo[key].Name];
                    ascendNumber.innerText = `${abbrNum(persistentValues.ascendEle[ele], 2, true)}/${(abbrNum(2**level, 2, true))}`;
                    charImg.classList.remove('dim-filter');
                    ascendTooltipsInfo(upgradeInfo[key].Name, level, ele);

                    if (elementContainer.activeChar) {
                        if (elementContainer.activeChar != charImg) elementContainer.activeChar.classList.add('dim-filter');
                    }

                    elementContainer.activeChar = charImg;
                })

                characterImgContainer.append(charImg);
            }
        }
        setTimeout(()=>{characterImgContainer.style.opacity = 1;},100)
    }

    function ascendTooltipsInfo(name, level, ele) {
        ascendCurency.ele = ele;
        let text = `${name}
                    <br> Ascension ${level}
                    <br>[yellow]Golden Cores: ${1 + level * 0.5}x</span>
                    <br><br> ${100 + level * 10}% >> [green]${100 + (level + 1) * 10}</span>%
                    <br>Base ${name === "Nahida" ? "Nuts per Click" : "NpS"}
                    <br><br> ${100 + level * 2}% >> [red]${100 + (level + 1) * 2}</span>%
                    <br>Base Cost
                    `;

        text = textReplacer({
            '[yellow]':`<span style='color:#b39300'>`,
            '[green]':`<span style='color:#417428'>`,
            '[red]':`<span style='color:#9E372D'>`,
        },text)
        ascendTooltips.innerHTML = text;
    }

    const ascendChar = (name) => {
        // NAME IS THE IMAGE ELEMENT
        if (name === null) {return}
        const heroName = name.src.split('/').slice(-1)[0].replace('.webp','').replace('%20',' ');
        const ele = ascendCurency.ele;

        if (persistentValues.ascendDict[heroName] == undefined) {
            persistentValues.ascendDict[heroName] = 0;
        }

        const level = persistentValues.ascendDict[heroName];
        const minCost = 2**level;

        if (minCost <= persistentValues.ascendEle[ele]) {
            persistentValues.ascendEle[ele] -= minCost;
            persistentValues.ascendDict[heroName] += 1;

            name.click();

            for (let key in persistentValues.ascendDict) {
                if (persistentValues.ascendDict[key] <= 6) {
                    return;
                }
            }
            challengeNotification(({category: 'specific', value: [4, 2]}));
        } else {
            weaselDecoy.load();
            weaselDecoy.play();
            return;
        }
    }
}

function calculateGoldenCore(type) {
    let calculateNuts = 0;
    if (saveValues.realScore > 1e6) {calculateNuts = Math.log(saveValues.realScore) / Math.log(1.7)}
    const contributionDict = {
        'Regular Nuts': Math.round(calculateNuts),
        'Golden Nuts':  Math.round(saveValues.goldenNut * 2),
        'Achievements':  Math.round(saveValues.achievementCount * 3),
    }

    let goldenNutValue = contributionDict['Regular Nuts'] + contributionDict['Golden Nuts'] + contributionDict['Achievements'];

    const sortByNestedValues = (obj) => {
        const filteredEntries = Object.entries(obj).filter(([, value]) => value.Row >= 0 && value.Purchased >= 1);
        const sortedEntries = filteredEntries.sort(([, a], [, b]) => a.Row - b.Row);
        return Object.fromEntries(sortedEntries);
    }

    const filteredDict = sortByNestedValues(upgradeDict);
    for (let key in filteredDict) {
        let corePerHero = 0;
        corePerHero += (Math.floor(filteredDict[key].Purchased / 25) + 1);
        let name = upgradeInfo[parseInt(key)].Name;

        let upgradeCore = 1;
        for (let Nestedkey in filteredDict[key].milestone) {
            if (filteredDict[key].milestone[Nestedkey]) {
                upgradeCore += 1 * Math.max(upgradeCore / 2, 1);
            }
        }

        corePerHero *= upgradeCore;
        corePerHero *= (1 + persistentValues.ascendDict[name] * 0.5);
        corePerHero *= (1 + Math.floor((upgradeDict[parseInt(key)].Row + 1) / 4.5)**1.6);

        goldenNutValue += Math.round(corePerHero);
        contributionDict[name] = Math.round(corePerHero);
    }
    
    if (type === "formula") {
        return goldenNutValue;
    } else if (type === "highestAmount") {
        return (calculateNuts === 0 ? 'Nothing' : contributionDict);
    } else {
        let transcendValue = document.getElementById("transcend-display");
        transcendValue.innerHTML = `You gain:<br><br> ${abbrNum(goldenNutValue)} 
                                             <br><img class="transcendLogo" src="./assets/icon/core.webp">`;
        return goldenNutValue;
    }
}

function transcendFunction() {
    let forceStop = true; 
    if (forceStop) {
        preventSave = true;
        forceStop = false;

        persistentValues.transcendValue++;
        drawUI.preloadImage(1, "transcend", true);

        setTimeout(() => {            
            let overlay = document.getElementById("loading");
            overlay.style.display = 'flex';
            overlay.style.zIndex = 10000;
            overlay.children[0].style.backgroundImage = "url(./assets/bg/wood.webp)";

            let oldGif = overlay.children[0].children[0];
            let newGif = oldGif.cloneNode(true);
            oldGif.parentNode.replaceChild(newGif, oldGif);
            newGif.src = "./assets/transcend.webp";
            newGif.classList.add("overlay-tutorial");
            newGif.classList.remove('play-button');

            const addCore = calculateGoldenCore("formula");
            persistentValues.goldenCore += addCore;
            persistentValues.transitionCore = addCore;

            let newSaveValues = saveValuesDefault;
            newSaveValues.goldenTutorial = true;
            newSaveValues.wishUnlocked = true;
            newSaveValues.versNumber = CONSTANTS.DBNUBMER;

            let newlocalStore = storeInventoryDefault;
            newlocalStore.active = true;

            const newAchievementMap = (() => {
                let temp = new Map();
                for (let key in achievementListDefault) {
                    temp.set(parseInt(key), false);
                }
                return temp;
            })();

            const localStorageDict = {
                "settingsTemp":settingsValues,
                "saveValuesTemp": newSaveValues,
                "upgradeDictTemp": generateHeroPrices(upgradeDictDefault, NONWISHHEROMAX, upgradeInfo, persistentValues),
                "InventoryTemp": Array.from(new Map()),
                "expeditionDictTemp":expeditionDict,
                "advDictTemp":advDict,
                "achievementListTemp": Array.from(newAchievementMap),
                "persistentValues":persistentValues,
                "localStoreTemp":newlocalStore,
                "tester":testing,
            }
        
            localStorage.setItem(`save-0`, window.btoa(JSON.stringify(localStorageDict)));

            setTimeout(()=>{
                location.reload();
            },3000);
        },500);
    }
}

function nutPurchase(fullId) {
    let id = fullId.split("-")[2];
    let cost = nutCost(id);
    if (persistentValues.goldenCore >= cost) {
        upgradeElement.load();
        upgradeElement.play();
        persistentValues.upgrade[id]++;
        persistentValues.goldenCore -= cost;

        let childArray = document.getElementById(fullId).children;
        childArray[1].innerText = `Level ${persistentValues.upgrade[id]}`;
        childArray[3].updateText(id);
        childArray[4].children[1].innerHTML = childArray[4].children[1].innerHTML.replace(/[^<]+</g, `${abbrNum(nutCost(id),2,true)}<`);
        updateCoreCounter();
        specialValuesUpgrade(false, parseInt(id));

        if (permUpgrades[id].Cap === true) {
            if (persistentValues.upgrade[id] >= permUpgrades[id].Max) {
                childArray[1].innerText = `Level MAX`;
                let buttonNew = childArray[4].cloneNode(true);
                childArray[4].parentNode.replaceChild(buttonNew, childArray[4]);
                childArray[4].children[1].innerText = "MAXED";
            } else {
                childArray[1].innerText = `Level ${persistentValues.upgrade[id]}`;
            }
        } else {
            childArray[1].innerText = `Level ${persistentValues.upgrade[id]}`;
        }
        
    }
}

function nutPopUp() {
    if (saveValues.goldenTutorial === true) {
        return;
    } else {
        saveValues.goldenTutorial = true;
        stopSpawnEvents = true;

        setTimeout(()=>{
            addNutStore();
            drawUI.customTutorial("goldenNut", 4, 'Golden Nut Obtained!!');
            const settingsBottomBadge = document.getElementById('badges-div');
            if (!settingsBottomBadge.querySelector('medal-img-1')) {
                settingsBottomBadge.append(createMedal(1, choiceBox, mainBody, stopSpawnEvents))
            }
        }, 2000);
    }
}

function updateCoreCounter() {
    if (!document.getElementById("nut-store-currency")) {return}
    let nutCounter = document.getElementById("nut-store-currency");
    let currentCount = abbrNum(persistentValues.goldenCore,2,true);
    nutCounter.innerHTML = nutCounter.innerHTML.replace(/[^<]+</g, `${currentCount}<`);
}

//-------------------------------------------- TREES ------------------------------------------------------//
function createTreeMenu() {
    const mainTable = rightDiv.childNodes[1];
    if (document.getElementById('tree-table')) {return}

    const treeTable = document.createElement('div');
    treeTable.classList.add('flex-column','table-without-tooltip');
    treeTable.id = 'tree-table';
    treeTable.style.display = "none";
    const treeSide = document.createElement('div');
    treeSide.classList.add('adventure-map');
    treeSide.id = 'tree-side';
    treeSide.style.display = "none";

    const sandImg = createDom('img');
    sandImg.src = './assets/tree/sand.webp';
    sandImg.classList.add('tree-sand');

    const backButton = createDom('button', {
        class: ['tree-back', 'clickable'],
        innerText: 'Back',
        event: ['click', () => {tabChange(1)}]
    })

    const treeContainer = document.createElement('div');
    treeContainer.classList.add('tree-container');
    treeContainer.id = 'tree-container';
    const treeImg = createDom('img');
    let treeLevel = saveValues.treeObj.level;
    treeImg.id = 'tree-img';
    treeImg.style.animation = 'unset';
    treeImg.classList.add('tree-image');

    if (treeLevel !== 0) {
        treeImg.src = `./assets/tree/tree-${treeLevel === 5 ? 4 : treeLevel}.webp`;
        treeContainer.classList.add(`tree-${treeLevel === 5 ? 4 : treeLevel}`);
    } else {
        treeImg.src = `./assets/tooltips/Empty.webp`;
        saveValues.treeObj.growthRate = 0;
    }

    const treeHealthContainer = document.createElement('div');
    treeHealthContainer.classList.add('tree-health');
    const treeNut = createDom('img');
    treeNut.src = './assets/icon/nut.webp';
    const treeHealthText = document.createElement('p');
    treeHealthText.id = 'tree-health-text';
    treeHealthText.health = saveValues.treeObj.health;
    treeHealthText.innerText = 'HP:\n' + treeHealthText.health + '%';
    treeHealthContainer.append(treeNut,treeHealthText);

    if (timePassedSinceLast) {
        saveValues.treeObj.growth += (saveValues.treeObj.growthRate / 100) / 2 * timePassedSinceLast;
    }

    const treeProgressBar = createProgressBar(
        { class: ['tree-progress', 'healthbar-container'] },
        { id: 'tree-progress',
          progress: parseFloat(saveValues.treeObj.growth),
          style: { width: (saveValues.treeObj.growth + '%'), backgroundColor: '#a4cf88' }},
        { style: { borderRight: '0.11em solid #182c0a' }},
        10
    );

    const treeProgressValue = document.createElement('p');
    treeProgressValue.classList.add('tree-progress-value');
    treeProgressValue.id = 'tree-progress-value';
    treeProgressValue.rate;

    treeContainer.appendChild(treeImg);
    treeSide.append(treeProgressBar,sandImg,backButton,treeContainer,treeHealthContainer,treeProgressValue);

    const palmText = document.createElement('p');
    palmText.id = 'palm-text';
    palmText.innerText = `Palm Energy: ${saveValues.treeObj.energy}`;
    treeTable.append(palmText);

    let container = document.createElement('div');
    container.classList.add('flex-row');
    let element = rollArray(boxElement, 1);
    container.style.background = `url(./assets/tooltips/elements/nut-${element.toLowerCase()}.webp) no-repeat center center/contain`;
    
    const seedContainer = Tree.createSeedContainer(treeTable, persistentValues, saveValues, growTree, toggleDestroyButton);
    const treeOffer = Tree.offerBox(treeTable, offerItemFunction, persistentValues);
    const leylineDisplay = leylineCreate(treeTable);
    const blessDisplay = blessCreate(treeTable);

    leftDiv.appendChild(treeSide);
    mainTable.appendChild(treeTable);

    let nutStoreButton = document.createElement("button");
    nutStoreButton.classList.add("tree-access","nut-store-access");
    nutStoreButton.addEventListener("click", () => {
        treeTable.updateSeeds();
        treeTable.updateGoldenCore();
        universalStyleCheck(treeTable, "display", "none", "flex", true);
        universalStyleCheck(treeSide, "display", "none", "flex", true);
        universalStyleCheck(document.getElementById('nut-store-table'),"display","flex","none",true);
    })
    leftDiv.appendChild(nutStoreButton);

    treeTable.updateLevel = () => {
        if (saveValues.treeObj.level === 0) {
            [treeOffer, leylineDisplay, blessDisplay].forEach((ele) => {
                ele.style.display = 'none';
            });
            seedContainer.style.display = 'flex';
        } else {
            [treeOffer, leylineDisplay, blessDisplay].forEach((ele) => {
                ele.style.display = 'flex';
            });
            seedContainer.style.display = 'none';
        }
    }

    treeTable.updateLevel();
    if (treeLevel === 0) {
        Tree.updateTreeValues(true, saveValues.treeObj);
    } else {
        Tree.updateTreeValues(false, saveValues.treeObj);
        if (saveValues.treeObj.defense === true) {
            enemyBlock(false);
        } 
    }

    toggleDestroyButton();
    populateTreeItems();
    if (saveValues.treeObj.level === 5) {
        changeHarvestButton();
    }
}

function rollTreeItems() {
    saveValues.treeObj.offer = createTreeItems(saveValues, randomInteger, inventoryDraw, rollArray);

    const treeItem = document.getElementById('tree-offer-items');
    while (treeItem.firstChild) {
        treeItem.firstChild.remove();
    }

    populateTreeItems();
}

function populateTreeItems() {
    const treeItem = document.getElementById('tree-offer-items');

    const coreContainer = document.createElement('div');
    coreContainer.id = 'core-container';
    coreContainer.currentItem = null;

    const coreContainerImg = createDom('img');
    coreContainerImg.src = "./assets/icon/core.webp"
    const coreContainerText = document.createElement('p');
    coreContainerText.innerText = abbrNum(saveValues.treeObj.offer[0], 2, true);

    const plusImage = createDom('img');
    plusImage.src = './assets/icon/plus.webp';

    coreContainer.append(coreContainerImg, coreContainerText);
    treeItem.append(coreContainer, plusImage);

    const itemOfferArray = [];
    for (let i = 1; i < saveValues.treeObj.offer.length; i++) {
        let itemContainer = document.createElement('div');
        itemContainer = inventoryFrame(itemContainer, Inventory[saveValues.treeObj.offer[i]]);
        itemContainer.classList.add('dim-filter', 'clickable');

        let itemAmount = createDom('p', {
            classList: ['item-frame-text'],
            innerText: (!InventoryMap.get(saveValues.treeObj.offer[i]) || InventoryMap.get(saveValues.treeObj.offer[i]) === 0) ? 0 : InventoryMap.get(saveValues.treeObj.offer[i]),
        });

        itemContainer.addEventListener('click', () => {
            coreContainer.currentItem = saveValues.treeObj.offer[i];

            if (!InventoryMap.get(coreContainer.currentItem) || InventoryMap.get(coreContainer.currentItem) === 0) {
                itemAmount.innerText = 0;
            } else {
                itemAmount.innerText = InventoryMap.get(saveValues.treeObj.offer[i]);
            }

            itemOfferArray.forEach((item) => {
                if (itemContainer === item) {
                    item.classList.remove('dim-filter');
                } else {
                    item.classList.add('dim-filter');
                }
            });
        })
        
        itemContainer.append(itemAmount);
        itemOfferArray.push(itemContainer);
        treeItem.append(itemContainer);
    }
}

function offerItemFunction() {
    const coreContainer = document.getElementById('core-container');
    const treeMissingText = document.getElementById('tree-missing-text');
    let treeInnerValue = '';

    if (saveValues.treeObj.offer[0] > persistentValues.goldenCore) {
        treeInnerValue += `You lack Golden Cores (${persistentValues.goldenCore}/${saveValues.treeObj.offer[0]})\n`;
    }

    if (coreContainer.currentItem === null) {
        treeInnerValue += `Pick an item to sacrifice\n`;
    } else {
        if (!InventoryMap.get(coreContainer.currentItem) || InventoryMap.get(coreContainer.currentItem) === 0) {
            treeInnerValue += `Missing item: '${Inventory[coreContainer.currentItem].Name}'\n`;
        }
    }
    // TODO: FIX CLICK
    treeMissingText.innerText = treeInnerValue;
    if (treeInnerValue !== '' && !testing) {return}
    persistentValues.goldenCore -= saveValues.treeObj.offer[0];
    for (let i = 1; i < saveValues.treeObj.offer.length; i++) {
        let itemNumber = saveValues.treeObj.offer[i];
        reduceItem(itemNumber);
    }

    const treeImg = document.getElementById('tree-img');
    treeImg.style.animation = 'glowEnhance 0.7s linear';
    treeImg.addEventListener('animationend', () => {
        treeImg.style.animation = 'unset';
    }, { once: true });

    const treeGrowth = (randomInteger(7, 10) + saveValues.treeObj.offerAmount) / Math.log(saveValues.treeObj.energy);
    saveValues.treeObj.growthRate = Math.round(saveValues.treeObj.growthRate * 1.05 * 100) / 100;
    Tree.updateTreeValues(false, saveValues.treeObj);
    growTree('add', Math.round(treeGrowth));

    let treeHealthText = document.getElementById('tree-health-text');
    saveValues.treeObj.health = Math.min(saveValues.treeObj.health + Math.round(randomInteger(7, 10) + saveValues.treeObj.offerAmount / 3), 100); ;
    treeHealthText.health = saveValues.treeObj.health;
    treeHealthText.innerText = 'HP:\n' + treeHealthText.health + '%';

    saveValues.treeObj.offerAmount++;
    challengeNotification(({category: 'offer', value: saveValues.treeObj.offerAmount}))
    saveValues.treeObj.energy = Math.round(saveValues.treeObj.energy * additionalTreeEnergy * randomInteger(105, 115) / 100);

    const palmText = document.getElementById('palm-text');
    palmText.innerText = `Palm Energy: ${saveValues.treeObj.energy}`;
    rollTreeItems();

    document.getElementById('tree-table').updateGoldenCore();
}

function treeOptions(planted, optionsContainer) {
    return;
    // while (optionsContainer.firstChild) { optionsContainer.firstChild.remove() }
    if (planted) {
        optionsContainer.classList.add('flex-row','options-container');
        optionsContainer.style.display = 'flex';
        const optionsTextArray = ['Offer', 'Absorb', 'Bless'];
        for (let i = 0; i < 3; i++) {
            let treeButton = document.createElement('div');
            let optionImg = createDom('img');
            optionImg.src = `./assets/tree/option-${i}.webp`;
            let optionText = document.createElement('p');
            optionText.innerText = optionsTextArray[i];
    
            switch (i) {
                case 0:
                    treeButton.addEventListener('click',() => {
                        universalStyleCheck(optionsContainer,"display","flex","none");
                        universalStyleCheck(document.getElementById('tree-offer-container'),"display","none","flex");

                        let nutCounter = document.getElementById("tree-store-currency");
                        let currentCount = abbrNum(persistentValues.goldenCore,2,true);
                        nutCounter.innerHTML = nutCounter.innerHTML.replace(/[^<]+</g, `${currentCount}<`);
                    })
                    break;
                case 1:
                    treeButton.addEventListener('click',() => {
                        universalStyleCheck(optionsContainer,"display","flex","none");
                        universalStyleCheck(document.getElementById('leyline-container'),"display","none","flex");
                    })
                    break;
                case 2:
                    treeButton.addEventListener('click',() => {
                        universalStyleCheck(optionsContainer,"display","flex","none");
                        universalStyleCheck(document.getElementById('bless-container'),"display","none","flex");
                    })
                    break;
                default:
                    break;
            }
    
            treeButton.append(optionImg, optionText);
            optionsContainer.appendChild(treeButton);
        }
    } else {
        optionsContainer.classList.add('flex-row','options-container');
        let treeButton = createDom('div', {
            child: [createDom('img', { src: `./assets/tree/plant.webp` }),
                createDom('p', { innerText: 'Plant' })
            ]
        });

        treeButton.addEventListener('click',() => {
            Tree.pickTree();
            Tree.updateSeedContainer(false, persistentValues, saveValues, growTree, treeOptions, toggleDestroyButton);
        });
        optionsContainer.appendChild(treeButton);
    }
}

function changeHarvestButton() {
    let destroyButton = document.getElementById('tree-destroy-button');
    if (destroyButton) {
        let destroyButtonNew = destroyButton.cloneNode(true);
        destroyButton.parentNode.replaceChild(destroyButtonNew, destroyButton);
        destroyButtonNew.innerText = 'Harvest';
        destroyButtonNew.classList.add('tree-harvest');
        destroyButtonNew.addEventListener('click', () => {
            persistentValues.harvestCount++;
            challengeNotification(({category: 'harvest', value: persistentValues.harvestCount}));
            destroyTree(true);
        })
    }
} 

function toggleDestroyButton() {
    if (saveValues.treeObj.level === 0) {
        if (document.getElementById('tree-destroy-button')) document.getElementById('tree-destroy-button').remove();
    } else if (!document.getElementById('tree-destroy-button')) {
        const treeSide = document.getElementById('tree-side');
        const destroyButton = createDom('button', {
            class: ['tree-back', 'clickable', 'tree-destroy'],
            id: 'tree-destroy-button',
            innerText: 'Destroy',
            event: ['click', () => {
                choiceBox(mainBody, {
                    text: 'Are you sure you want to destroy the tree? This cannot be undone.'
                }, stopSpawnEvents, destroyTree, undefined, null, ['choice-ele']);
            }]
        });

        treeSide.appendChild(destroyButton);
    }
}

function destroyTree(finalPhase = false) {
    const treeProgress = document.getElementById('tree-progress');
    const treeImg = document.getElementById('tree-img');
    const treeContainer = document.getElementById('tree-container');
    const treeMissingText = document.getElementById('tree-missing-text');

    if (finalPhase) { Tree.generateTreeExplosion(15) }
    
    treeMissingText.innerText = '';
    Tree.updateTreeValues(true, saveValues.treeObj);
    treeImg.src = `./assets/tooltips/Empty.webp`;

    if (saveValues.treeObj.defense) {
        enemyBlock(true);
    }

    setTimeout(()=>{
        mailElement.load();
        mailElement.play();

        let treeValue = saveValues.treeObj.energy * saveValues.treeObj.health / 100;
        switch (saveValues.treeObj.level) {
            case 5:
                break;
            case 4:
                treeValue *= 0.5;
                break;
            case 3:
                treeValue *= 0.25;
                break;
            case 2:
                treeValue *= 0.1;
                break;
            default:
                treeValue = 0;
                break;
        }
        
        let treeHealthText = document.getElementById('tree-health-text');
        saveValues.treeObj.health = 0;
        saveValues.treeObj.offerAmount = 0;
        treeHealthText.health = saveValues.treeObj.health;
        treeHealthText.innerText = 'HP:\n' + treeHealthText.health + '%';

        treeProgress.style.width = 0;
        treeContainer.classList.remove(`tree-${saveValues.treeObj.level === 5 ? 4 : saveValues.treeObj.level}`);
        saveValues.treeObj.level = 0;
        saveValues.treeObj.defense = false;

        document.getElementById("tree-table").updateLevel();

        const lootContainer = createDom('div', { class:['notif-item']});
        let lootArray = Array.from({ length: 7 }, () => randomInteger(Math.round(treeValue * 0.4), Math.round(treeValue * 0.7)));

        for (let i = 0; i < lootArray.length; i++) {
            if (lootArray[i] !== 0) {
                const rankInventoryReward = createDom('div', { class:['notif-item-number', 'flex-column']});
                let rankInventoryRewardsImg = document.createElement('div');
                rankInventoryRewardsImg = inventoryFrame(rankInventoryRewardsImg, { Star: 5, File: `solid${boxElement[i + 1]}` });
                if (additionalPyroHydro > 1) {
                    if (boxElement[i + 1] === 'Hydro' || boxElement[i + 1] === 'Pyro') {
                        lootArray[i] = Math.round(lootArray[i] * additionalPyroHydro);
                    } 
                }

                if (additionalDendroGeoAnemo > 1) {
                    if (boxElement[i + 1] === 'Dendro' || boxElement[i + 1] === 'Geo' || boxElement[i + 1] === 'Anemo') {
                        lootArray[i] = Math.round(lootArray[i] * additionalDendroGeoAnemo);
                    } 
                }

                if (additionalCryoElectro > 1) {
                    if (boxElement[i + 1] === 'Cryo' || boxElement[i + 1] === 'Hydro') {
                        lootArray[i] = Math.round(lootArray[i] * additionalCryoElectro);
                    } 
                }

                let rankInventoryRewardsText = createDom('p', { innerText: lootArray[i] });
                rankInventoryReward.append(rankInventoryRewardsImg, rankInventoryRewardsText);
                lootContainer.append(rankInventoryReward);
            }
        }

        const addLoot = (lootArray) => {
            for (let i = 0; i < lootArray.length; i++) {
                if (lootArray[i] !== 0) {
                    persistentValues.ascendEle[boxElement[i + 1]] += lootArray[i];
                }
            }
        }

        choiceBox(mainBody, {text: 'Materials harvested:'}, stopSpawnEvents, ()=>{addLoot(lootArray)}, null, lootContainer, ['notif-ele']);
        if (!testing) saveData(true);
        toggleDestroyButton();
    }, 100);
}

function addTreeCore(number = 1, increaseOdds = 0, override = false) {
    if (!persistentValues.tutorialAscend) {return}
    let maxCore = 1;
    let rolledCore;
    if (!override) {
        if (persistentValues.fellBossDefeat) {
            maxCore = 2;
        } else if (persistentValues.unusualBossDefeat) {
            maxCore = 3;
        } else if (persistentValues.workshopBossDefeat) {
            increaseOdds += 20;
        }
    
        if ((randomInteger(0, 100) + increaseOdds) > 50) {
            rolledCore = maxCore;
        } else {
            rolledCore = Math.max(maxCore - 1, 1)
        }
    } else {
        rolledCore = increaseOdds;
    }

    if (additionalTreeNut > 1) {
        if (luckRate + 100 * (additionalTreeNut - 1) / 6 + randomInteger(0, 100) > 50) {
            number = Math.round(number * additionalTreeNut);
        }
    }

    persistentValues.treeSeeds[rolledCore - 1] += number;
    if (document.getElementById('tree-table')) document.getElementById('tree-table').updateSeeds();
    sidePop(`/tooltips/inventory/seed-${rolledCore}.webp`, `${number}x Lvl. ${rolledCore} Seed`);
}

function enemyBlock(removeBlocker = false, damage = null, maxHP) {
    if (removeBlocker === true) {
        if (damage === null) {
            document.getElementById('tree-block').remove();
            saveValues.treeObj.defense = false;
        } else {
            let enemyContainer = document.getElementById('tree-block').firstChild;
            let enemyContainerChildren = enemyContainer.children;
            let lostHP = Math.min(50,(50 * Math.round(damage / maxHP / 1.5)));
    
            let endText = `You took ${damage} cumulative damage <br> The tree lost ` + (lostHP == 0 ? '0' : `<span style='color:#dd5548'>${lostHP}%</span>`) + ' of its HP.'
            enemyContainerChildren[2].innerHTML = endText;
            enemyContainerChildren[2].style.textAlign = 'center';
            enemyContainerChildren[2].style.margin = '2% 0';
            enemyContainerChildren[2].style.width = '100%';
            enemyContainer.style.width = 'fit-content';
    
            enemyContainerChildren[3].innerText = 'Okay';
            let enemyButtonNew = enemyContainerChildren[3].cloneNode(true);
            enemyContainer.replaceChild(enemyButtonNew, enemyContainerChildren[3]);
            enemyButtonNew.addEventListener('click', () => {
                document.getElementById('tree-block').remove();
                saveValues.treeObj.defense = false;
    
                let treeHealthText = document.getElementById('tree-health-text');
                saveValues.treeObj.health = Math.max(saveValues.treeObj.health - lostHP, 1); ;
                treeHealthText.health = saveValues.treeObj.health;
                treeHealthText.innerText = 'HP:\n' + treeHealthText.health + '%';
            })
    
            enemyContainerChildren[1].remove();
        }
    } else if (removeBlocker === false) {
        saveValues.treeObj.defense = true;

        let eventBackdrop = document.createElement('div');
        eventBackdrop.classList.add('event-dark', 'cover-all');
        eventBackdrop.id = 'tree-block';

        let enemyContainer = document.createElement('div');
        enemyContainer.classList.add('tree-enemy','flex-column');
    
        let treeEnemyHeader = createDom('p', { innerText: 'Tree Defense'});
        let treeEnemyImg = createDom('img', { src: './assets/tree/treeDefense.webp' });
        let treeEnemyText = createDom('p', { innerHTML: 
                `Recommended Rank: 17 <br><br> 
                Stop the monsters from destroying the leyline trees! <br>
                <span style='color:#dd5548'>Any damage inflicted upon you is inflicted on the trees as well! </span>`});
                
        let treeEnemyButton = createDom('button', { innerText: 'Defend!' });
        treeEnemyButton.addEventListener('click', () => {
            let advButton = document.getElementById("adventure-button");
            adventure('15-[1,2,3,4]');
            advButton.key = 35;
        })
    
        enemyContainer.append(treeEnemyHeader, treeEnemyImg, treeEnemyText, treeEnemyButton);
        eventBackdrop.append(enemyContainer);
        document.getElementById('tree-table').append(eventBackdrop);
    } 
}

function growTree(type, amount = 0) {
    const treeProgress = document.getElementById('tree-progress');
    const treeProgressValue = document.getElementById('tree-progress-value');
    if (type === 'add') {
        if (saveValues.treeObj.level === 5 || saveValues.treeObj.defense === true) {return}
        treeProgress.progress += treeProgressValue.rate + amount ;
        saveValues.treeObj.growth = treeProgress.progress;
        treeProgress.style.width = treeProgress.progress + '%';

        if (treeProgress.progress > 100) {
            // REMOVE MAXED TREE
            if (saveValues.treeObj.level === 4) {
                saveValues.treeObj.level = 5;
                changeHarvestButton();
                sidePop('/tree/harvest.webp', 'Tree has Matured!');
            } else {
                treeProgress.progress = 0;
                growTree('level');
            }
        }
    } else if (type === 'level') {
        const treeImg = document.getElementById('tree-img');
        const treeContainer = document.getElementById('tree-container');
        // PLANT NEW TREE
        if (saveValues.treeObj.level === 0) {
            let treeHealthText = document.getElementById('tree-health-text');
            saveValues.treeObj.health = 100;
            treeHealthText.health = saveValues.treeObj.health;
            treeHealthText.innerText = 'HP:\n' + treeHealthText.health + '%';

            const leylineMissingText = document.getElementById('leyline-missing-text');
            leylineMissingText.innerText = '';

            Tree.updateTreeValues(false, saveValues.treeObj);
            rollTreeItems();
            weaselBurrow.load();
            weaselBurrow.play();
        };

        saveValues.treeObj.level++;
        treeImg.src = `./assets/tree/tree-${saveValues.treeObj.level}.webp`;
        treeContainer.classList.remove(`tree-${saveValues.treeObj.level - 1}`);  
        treeContainer.classList.add(`tree-${saveValues.treeObj.level}`);

        // INTIATE TREE DEFENSE 
        if (saveValues.treeObj.defense) { enemyBlock(false) }
            // } else if (type === 'rate') {
    //     treeProgressValue.rate += (amount / 25);
    } else {
        console.error(`growTree: Missing Type ${type}`)
    }
}

function getTreeItems() {
    if (saveValues.treeObj.offer.length > 0) {
        const treeOffer = [...saveValues.treeObj.offer];
        treeOffer.shift();

        let itemTypeDict = {}
        treeOffer.forEach((item) => {
            itemTypeDict[item] = {
                Type: Inventory[item].Type,
                Star: Inventory[item].Star,
            }
        });
        
        return itemTypeDict;
    } else {
        return null;
    }
}

function compareTreeItems(itemArray) {
    const treeOffer = getTreeItems();
    if (treeOffer === null) {
        return itemArray.map(itemId => [itemId, false]);
    };

    const itemArrayCopy = [...itemArray];
    let replacedTreeItems = {};

    const sameTypeAndStar = (itemType, itemStar, i, itemArrayCopyItem) => {
        for (let itemKey in treeOffer) {
            if (treeOffer[itemKey].Type === itemType && treeOffer[itemKey].Star === itemStar) {
                let replaceWithTreeItem = randomIntegerWrapper(65 + luckRate, 100);
                if (replaceWithTreeItem || parseInt(itemKey) === parseInt(itemArrayCopyItem)) {
                    replacedTreeItems[i] = [parseInt(itemKey), true];
                    return;
                }
            }
        }

        replacedTreeItems[i] = [itemArrayCopyItem, false];
        return;
    }

    for (let i = 0; i < itemArrayCopy.length; i++) {
        let itemType = Inventory[itemArrayCopy[i]].Type;
        let itemStar = Inventory[itemArrayCopy[i]].Star;
        sameTypeAndStar(itemType, itemStar, i, itemArrayCopy[i]);
    }

    return replacedTreeItems;
}

function blessCreate(treeTable) {
    const blessDisplay = createDom('div', { class:['flex-column'], id: 'bless-container', style: { display: 'flex' } });
    const blessContainer = createDom('p', { innerText:'Under Construction!'})
    blessDisplay.append(blessContainer);

    let buttonContainer;
    const leylineTitle = createDom('p', { innerHTML: 'Blessing of Dendro' });
    const blessMissingText = createDom('p', { id: 'bless-missing-text', innerText: '' });
    blessContainer.remove();

    const chargePic = createDom('img', { classList:['bless-icon'], src: './assets/tree/bless.webp' });
    const blessBar = createProgressBar(
        { id:'bless-bar', class: ['leyline-progress', 'healthbar-container'] },
        { id: 'bless-progress', progress: parseFloat(persistentValues.blessPower),
        style: { width: (100 + '%'), background: '#25818E' }},
        { style: { borderRight: '0.2em solid #ADB3F6' }},
        persistentValues.maxBlessPower,
    );

    blessBar.useCharge = () => {
        const requiredCharge = 100 * decreaseEnergyBless;
        if (persistentValues.blessPower >= requiredCharge) {
            persistentValues.blessPower -= requiredCharge;
            blessBar.updateCharge();
            return true;
        } else {
            return false;
        }
    }

    const blessTree = () => {
        let additionalBless = 1;
        if (persistentValues.blackMarketDict && persistentValues.blackMarketDict.springWater) {
            additionalBless += (persistentValues.blackMarketDict.springWater.level + 0.2);
        }

        growTree('add', randomInteger(15, 20) * additionalBless);
        const enemyRoll = randomInteger(0, 100);
        if (enemyRoll < (15 - luckRate / 4)) {
            if (!testing) saveData();
            enemyBlock(false);
        }

        const treeImg = document.getElementById('tree-img');
        treeImg.style.animation = 'blessTree 1s linear forwards';
        treeImg.addEventListener('animationend', () => {
            treeImg.style.animation = 'unset';
        }, { once: true });
    }

    blessBar.updateCharge = () => {
        const rate = moraleCheck(0.2);
        persistentValues.blessPower += rate * (persistentValues.maxBlessPower / 1.5);
        persistentValues.blessPower = Math.min(persistentValues.blessPower, persistentValues.maxBlessPower * 100);
        const newWidth = persistentValues.blessPower / (persistentValues.maxBlessPower * 100);
        document.getElementById('bless-progress').style.width = (newWidth * 100) + "%";
    }

    const chargeContainer = createDom('div', { classList:['flex-row', 'charge-container'], children:[chargePic, blessBar] });
    const leylineText = createDom('p', { id:'blessing-text' });
    leylineText.innerHTML = `Using Nahida's power, bless the trees' growth. 
                        <br> Dendro accumulation may attract nearby <span style='color: var(--light-red)'>enemies</span>!
                        <br> <span style='font-size: 0.6em'>Note: Recharge rate is based on Nahida's morale.</span>`;
    blessDisplay.append(leylineTitle, leylineText, chargeContainer, blessMissingText);

    const blessButton = document.createElement('button');
    blessButton.innerText = 'Bless';
    blessButton.classList.add('fancy-button', 'clickable');
    blessButton.addEventListener('click', () => {
        if (blessBar.useCharge()) {
            blessTree();
            blessMissingText.innerText = '';
        } else {
            blessMissingText.innerText = 'Not enough charges!';
        }
    });

    buttonContainer = createDom('div', { class:['flex-row', 'tree-button-container'], child: [blessButton] });
    
    blessDisplay.append(buttonContainer);
    treeTable.append(blessDisplay);
    return blessDisplay;
}

function leylineCreate(treeTable) {
    const leylineDisplay = createDom('div', {class:[ 'flex-column' ], id:'leyline-container', style: { display: 'flex' }});
    const leylineTitle = createDom('p', { innerHTML: 'Leyline Outbreak Energy Level' });
    const leylineBar = createProgressBar(
            { id: 'leyline-bar', class: ['leyline-progress', 'healthbar-container'] },
            { id: 'leyline-progress', progress: parseFloat(persistentValues.leylinePower),
            style: { width: (parseFloat(persistentValues.leylinePower) + '%'), background: 'linear-gradient(90deg, rgba(204,12,12,1) 0%, rgba(235,225,15,1) 100%)' }},
            { style: { borderRight: '0.2em solid #C17D6D' }},
            4,
            { src: './assets/tree/skull.webp'}
    );
    
    let text = `Absorb energy from the <span style='color:#A97803'>Leyline Outbreak</span> 
                <br> at the cost of your tree's HP
                <br> <span style='font-size: 0.6em'>Note: Mature trees have better absorption.</span>`;
    const leylineText = createDom('p', { innerHTML: text, id:'leyline-text' });
    const leylineMissingText = createDom('p', { innerText: '', id:'leyline-missing-text' });
    const leylineEnergy = createDom('p', { innerHTML: `
            Current Energy Levels: ${Math.round(persistentValues.leylinePower * 100) / 100}%
    `, progress: persistentValues.leylinePower });
    checkAbsorbThreshold();

    const absorbButton = document.createElement('button');
    absorbButton.innerText = 'Absorb';
    absorbButton.classList.add('fancy-button', 'clickable');
    absorbButton.addEventListener('click', () => {
        if (saveValues.treeObj.health <= 15) {
            leylineMissingText.innerText = 'This tree is too weak to absorb excess energy!'
            weaselDecoy.load();
            weaselDecoy.play();
            return;
        }

        let treeAbsorbPower = Math.log(saveValues.treeObj.energy / 50) / (100 / persistentValues.leylinePower);
        switch (saveValues.treeObj.level) {
            case 5:
                treeAbsorbPower = Math.max(treeAbsorbPower, 0.1);
                break;
            case 4:
                treeAbsorbPower *= 0.5;
                break;
            case 3:
                treeAbsorbPower *= 0.25;
                break;
            case 2:
                treeAbsorbPower *= 0.05;
                break;
            case 1:
                treeAbsorbPower *= 0;
                leylineMissingText.innerText = 'A seed is too weak to absorb anything!'
                return;
            default:
                treeAbsorbPower *= 0;
                break;
        }

        if (treeAbsorbPower > 0) {
            leylineMissingText.innerText = '';
        }

        persistentValues.leylinePower -= treeAbsorbPower;
        checkAbsorbThreshold();
        leylineBar.updateHealth(parseFloat(persistentValues.leylinePower), 'progress')

        let treeHealthText = document.getElementById('tree-health-text');
        saveValues.treeObj.health = Math.max(saveValues.treeObj.health - randomInteger(20, 40), 1);
        treeHealthText.health = saveValues.treeObj.health;
        treeHealthText.innerText = 'HP:\n' + treeHealthText.health + '%';

        leylineEnergy.innerText = `Current Energy Levels: ${(Math.round(persistentValues.leylinePower * 10)/10)}%`
    });

    const buttonContainer = createDom('div', { class:['flex-row', 'tree-button-container'] });
    buttonContainer.append(absorbButton);
    
    leylineDisplay.append(leylineTitle, leylineText, leylineBar, leylineEnergy, leylineMissingText, buttonContainer);
    treeTable.append(leylineDisplay);
    return leylineDisplay;
}

function checkAbsorbThreshold() {
    const leylineText = document.getElementById('leyline-missing-text');
    if (persistentValues.leylinePower < 75 && persistentValues.fellBossDefeat === false) {
        spawnBossQuest(1);
        persistentValues.leylinePower = 75.0;
        leylineText.innerText = 'A force of nature has awoken as its energy from the Leyline was cutoff!';
    } else if (persistentValues.leylinePower < 50 && persistentValues.unusualBossDefeat === false) {
        spawnBossQuest(2);
        persistentValues.leylinePower = 50.0;
        leylineText.innerText = 'A mysterious portal has emerged, maybe it has something to do with the Leyline?';
    } else if (persistentValues.leylinePower < 25 && persistentValues.workshopBossDefeat === false) {
        spawnBossQuest(3);
        persistentValues.leylinePower = 25.0;
        leylineText.innerText = 'A dreadful roar was heard from the depths due to the energy given off by the Leyline!';
    }  else if (persistentValues.leylinePower < 0 && persistentValues.finaleBossDefeat === false) {
        spawnBossQuest(4);
        persistentValues.leylinePower = 0;
        leylineText.innerText = 'A powerful enemy has revealed itself as soon as all energy from the Leyline stopped!';
    }
}

//------------------------------------------------------------------------MISCELLANEOUS------------------------------------------------------------------------//
// REFRESH SCORES & ENERGY
function refresh() {
    let formatScore = abbrNum(saveValues["realScore"]);
    score.innerText = `${formatScore} Nut${saveValues["realScore"] !== 1 ? 's' : ''}`;
    let formatDps = abbrNum(saveValues["dps"] * foodBuff * (100 + challengeMultiplier) / 100);
    dpsDisplay.innerText = `${formatDps} per second`;

    energyDisplay.innerText = saveValues["energy"];
    primogemDisplay.innerText = saveValues["primogem"];
    
     // BUYING A HERO / UPDATING MULTIPLIERS
    if (arguments[0] != undefined) {
        if (arguments[0].includes("but-")){
            let heroTextFirst = "";
            let formatCost = arguments[1];
            let upgradeDictTemp = upgradeDict[arguments[2]];
            let upgradeInfoTemp = upgradeInfo[arguments[2]];
            let currentPurchased = upgradeDictTemp["Purchased"];
            let formatATK = upgradeDictTemp["Factor"];

            if (currentMultiplier != 1) {
                formatCost *= (((COSTRATIO**currentPurchased) - COSTRATIO**(currentPurchased + currentMultiplier)) / (1 - COSTRATIO));
                formatATK *= currentMultiplier;
            } else {
                formatCost *= (COSTRATIO**currentPurchased);
            }

            formatCost = abbrNum(formatCost,2);

            if (arguments[2] == 0) {
                let singular = ` Nut${formatATK !== 1 ? 's' : ''} per click`;
                formatATK = abbrNum(formatATK,2);
                heroTextFirst = upgradeInfoTemp.Name + ": " + formatCost + ", +" + formatATK + singular;
            } else {
                formatATK = abbrNum(formatATK,2);
                heroTextFirst = upgradeInfoTemp.Name + ": " + formatCost + ", +" + formatATK + " NpS";
            }
            
            let upgradedHeroButton = document.getElementById(arguments[0]);
            upgradedHeroButton.innerText = heroTextFirst;
            upgradedHeroButton.style = `background:url("./assets/nameplates/${upgradeInfoTemp.Name}.webp");  background-size: 125%; background-position: 99% center; background-repeat: no-repeat;`;
            if (milestoneOn) {upgradedHeroButton.style.display = "none"}
        } else if (arguments[0] == "hero") { // REFRESH FOR ARTIFACTS
            let hero = upgradeDict[arguments[1]];
            let formatATK = hero["Factor"];
            let formatCost = hero["BaseCost"];
            let currentPurchased = hero["Purchased"];

            if (currentMultiplier != 1) {
                formatCost *= (((COSTRATIO**currentPurchased) - COSTRATIO**(currentPurchased + currentMultiplier)) / (1 - COSTRATIO));
                formatATK *= currentMultiplier;
            } else {
                formatCost *= (COSTRATIO**currentPurchased);
            }

            let heroText;
            if (arguments[1] == 0) {
                heroText = upgradeInfo[arguments[1]].Name + ": " + abbrNum(formatCost,2) + ", +" + abbrNum(formatATK,2) + " Nuts per click";
            } else {
                heroText = upgradeInfo[arguments[1]].Name + ": " + abbrNum(formatCost,2) + ", +" + abbrNum(formatATK,2) + " NpS";
            }

            let id="but-" + hero.Row + "";
            document.getElementById(id).innerText = heroText;
        }
    }
}

// POP UPS FOR EXPEDITIONS UNLOCKS
// NUMBER OF UPGRADES NEEDED TO UNLOCK EXPEDITIONS
let heroUnlockLevels = [1e6,1e11,1e14];
let expeditionCounter = 0;
function checkExpeditionUnlock(heroesPurchasedNumber) {
    if (heroUnlockLevels.length == 0) {
        return;
    } else if (heroesPurchasedNumber >= heroUnlockLevels[0]) {
        if (expeditionDict[expeditionCounter + 3] == 1) {
            if (heroUnlockLevels.length != 1) {
                unlockExpedition(expeditionCounter + 3,expeditionDict);
                clearExped();
                newPop(2);
            } else {
                if (saveValues["wishUnlocked"] === true) {
                    return;
                } else {
                    newPop(3);
                    itemUse(4010);
                    currencyPopUp([["mail", 1]]);
                    saveValues.mailCore--;
                    wishUnlock();
                    saveValues["wishUnlocked"] = true;
                }
            }
            newPop(expeditionCounter + 10);
        }
        expeditionCounter++;
        heroUnlockLevels.shift();
    }
}

// POP UPS FOR SPECIAL CURRENCY
const createPopEle = (type, amount) => {
    let currencyPopImg;
    let text;
    switch (type) {
        case 'energy':
            currencyPopImg = "/icon/energyIcon.webp";
            saveValues.energy += amount;
            persistentValues.lifetimeEnergyValue += amount;
            challengeNotification(({category: 'energy', value: saveValues.energy}));
            text = `${amount} Energy Gained`;
            break;
        case 'primogem':
            currencyPopImg = "/icon/primogemIcon.webp";
            saveValues.primogem += amount;
            persistentValues.lifetimePrimoValue += amount;
            challengeNotification(({category: 'primogem', value: saveValues.primogem}));
            text = `${amount} Primogems Obtained`;
            break;
        case 'nuts':
            currencyPopImg = "/icon/goldenIcon.webp";
            saveValues.goldenNut += amount;
            persistentValues.goldenCore += amount;
            text = `${amount} Golden Nuts Obtained`;
            updateCoreCounter();
            nutPopUp();
            break;
        case 'mail':
            currencyPopImg = "/icon/mailLogo.webp";
            saveValues.mailCore += amount;
            text = `${amount} Wish Mail Obtained`;
            break;
        case 'items':
            text = "Items Obtained";
            currencyPopImg = "/icon/item.webp";
            break;
        default:
            console.error(`currencyPopUp Error: ${type} ${amount} ${additionalClass}`);
            break;
    }

    sidePop(currencyPopImg, text);
}

function currencyPopUp(currencyNestList) {
    const currencyNestedList = deepCopy(currencyNestList);
    if (currencyNestedList.length === 0) {
        return;
    }

    for (let i = 0; i < currencyNestedList.length; i++) {
        if (currencyNestedList[i][1] === undefined) currencyNestedList[i][1] = 0;
        let type = currencyNestedList[i][0];
        let amount = currencyNestedList[i][1];
        if (type === 'primogem') amount = Math.round(amount * additionalPrimo);
        createPopEle(type, amount);
    }
}

// POP UPS FOR NEW HEROES(WISH), INVENTORY AND EXPEDITION
function newPop(type) {
    var newPopUp;
    let className;
    let tabId;
    let place;

    if (type <=7 && type >=0) {
        if (newPopUp || currentPopUps.includes(type) == true) {
            return;
        }
        className = "pop-new-" + (type + 1);
        tabId = "tab-" +  (type).toString();
        place = "tab";
    } else if (type >= 10) {
        className = "pop-new-corner";
        place = "corner";
    } else {
        return;
    }
    
    newPopUp = document.createElement("div");
    if (place == "tab") {
        currentPopUps.push(type);
        newPopUp.classList.add("pop-new", className);
        let tab = document.getElementById(tabId);
        
        tab.addEventListener("click", () => {
            if (newPopUp != null) {
                newPopUp.remove();
                currentPopUps.splice(currentPopUps.indexOf(type),1);
                newPopUp = null;
            }
        });
        tab.appendChild(newPopUp);
    } else if (place == "corner"){
        newPopUp.classList.add(className);
        let newPopUpImg = document.createElement("img");
        type--;
        newPopUpImg.src = "./assets/tutorial/unlockExp-"+(type-6)+".webp";
        newPopUp.appendChild(newPopUpImg);

        setTimeout(() => {
            newPopUp.addEventListener("click", () => {
                if (newPopUp != null) {
                    newPopUp.remove();
                }
            });
        }, 1000);

        let mainBody = document.getElementById("game");    
        mainBody.append(newPopUp);
    }    
}

if (beta || testing) {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'f') {
            addTreeCore(randomInteger(10, 30), 0);
        } else if (e.key === 'g') {
            startRandomEvent(5);
        } else if (e.key === 'h') {
            document.getElementById('shop-backdoor').style.display = 'block';
        } else if (e.key === 'j') {
            spawnBossQuest(2)
        } else if (e.key === 'k') {
            spawnSkirmish();
        }
    });
}
}

// FOR TESTING PURPOSES ONLY
let disableQuicktime = false;
if (localStorage.getItem('save-0')) {
    try {
        const save = JSON.parse(window.atob(localStorage.getItem('save-0')));
        if (save.beta == true) {
            beta = true;
        }
        if (save.tester == true) {
            testing = true;
        }
    } catch {}
}

// if (testing || beta) {
//     if (document.getElementById('testerScreen')) document.getElementById('testerScreen').remove();
// } 

function startingFunction() {
    // PRESS A KEY
    const event = new KeyboardEvent('keydown', {
        key: 'h',
    });
    // const event2 = new KeyboardEvent('keydown', {
    //     key: '3',
    // });
    // document.dispatchEvent(event2);
    // document.dispatchEvent(event);
}

if (testing) {
    console.log('TESTING VERSION');
    mainBody.append(createDom('p', { innerText: 'TESTER', classList:['test-warning'] })); 
    
    setTimeout(()=>{
        let startButton = document.getElementById("start-button");
        if (startButton) startButton.click();
        setTimeout(() => { startingFunction(); },1500);
    }, 1200);
}

if (beta) {
    let link = document.createElement("link");
    link.href = './modules/beta.css';
    link.type = "text/css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    let warning = document.createElement('p');
    warning.innerText = 'BETA';
    warning.classList.add('beta-warning');
    mainBody.append(warning);

    setTimeout(()=>{
        let startButton = document.getElementById("start-button");
        if (startButton) startButton.click();
        setTimeout(()=>{
            let startButton = document.getElementById("play-button");
            if (startButton) startButton.click();
            setTimeout(()=>{ 
                startingFunction();
            },1500);
        }, 3500);
    }, 800);
}

export { startGame }