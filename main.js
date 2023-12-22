import { upgradeDictDefault,SettingsDefault,enemyInfo,expeditionDictDefault,saveValuesDefault,persistentValuesDefault,permUpgrades,advDictDefault,storeInventoryDefault } from "./modules/defaultData.js"
import { screenLoreDict,upgradeInfo,achievementListDefault,expeditionDictInfo,InventoryDefault,eventText,advInfo,charLoreObj,imgKey,adventureLoot,sceneInfo,challengeInfo,commisionText,commisionInfo } from "./modules/dictData.js"
import { abbrNum,randomInteger,sortList,generateHeroPrices,getHighestKey,countdownText,updateObjectKeys,randomIntegerWrapper,rollArray,textReplacer,universalStyleCheck,challengeCheck,createTreeItems,convertTo24HourFormat,deepCopy } from "./modules/functions.js"
import { inventoryAddButton,dimMultiplierButton,volumeScrollerAdjust,floatText,multiplierButtonAdjust,inventoryFrame,choiceBox,createProgressBar,createDom,createMedal } from "./modules/adjustUI.js"
import Preload from 'https://unpkg.com/preload-it@latest/dist/preload-it.esm.min.js'
// import * as drawUI from "./modules/drawUI.js"

const VERSIONNUMBER = "V.1-02-002";
const COPYRIGHT = "DISCLAIMER © HoYoverse.  \n All rights reserved. This site is not affiliated \n with Hoyoverse, nor Genshin Impact.";
const DBNUBMER = (VERSIONNUMBER.split(".")[1]).replaceAll("-","");
//------------------------------------------------------------------------INITIAL SETUP------------------------------------------------------------------------//
// START SCREEN
let mainBody = document.getElementById("game");   
let startText = document.getElementById("start-screen"); 
let startAlready = true;
setTimeout(()=>{startAlready = false},500);

if (localStorage.getItem("settingsValues") !== null) {
    let startChance = randomInteger(1,11);
    if (startChance === 1) {
        let startIdle = document.createElement("img");
        startIdle.src = "./assets/icon/nahida-start.webp";
        startIdle.id = "start-idle-nahida";
        startText.append(startIdle);
    } else if (startChance === 2) {
        let startIdle = document.createElement("img");
        startIdle.src = "./assets/icon/shop-start.webp";
        startIdle.id = "start-idle-dori";
        startText.append(startIdle);
    } else if (startChance === 3) {
        let startIdle = document.createElement("img");
        startIdle.src = "./assets/icon/scara-start.webp";
        startIdle.id = "start-idle-scara";
        startText.append(startIdle);
    }

    let startButton = document.getElementById("start-button");
    startButton.classList.remove("dim-filter");
    startButton.addEventListener("click",()=> {
        if (!startAlready) {
            startAlready = true;
            startGame(false);
        
            setTimeout(function() {
                let deleteBox = document.getElementById("confirm-box");
                if (deleteBox.style.zIndex == 1000) {deleteBox.style.zIndex = -1}
                startText.remove();
            },200)
        }
    });
}

let deleteButton = document.getElementById("start-delete");
deleteButton.addEventListener("click",()=> {
    if (localStorage.getItem("settingsValues") !== null) {
        deleteConfirmMenu("toggle","intro");
    } else {
        if (!startAlready) {
            startAlready = true;
            startGame(true);
            setTimeout(()=>startText.remove(),100);
        }
    }
});

let confirmationBox = document.createElement("div");
confirmationBox.classList.add("confirm-box");
confirmationBox.style.zIndex = -1;
confirmationBox.id = "confirm-box";

let textBox = document.createElement('p');
textBox.innerText = "Are you sure? Deleting your save cannot be undone.";

let confirmationBoxButton = document.createElement("div");
confirmationBoxButton.classList.add("confirm-button-div");
let confirmDeleteButton = document.createElement("button");
confirmDeleteButton.innerText = "Confirm";
confirmDeleteButton.addEventListener("click",()=>deleteConfirmButton(true));
let cancelDeleteButton = document.createElement("button");
cancelDeleteButton.innerText = "Cancel";
cancelDeleteButton.addEventListener("click",()=>deleteConfirmButton(false));

confirmationBoxButton.append(confirmDeleteButton,cancelDeleteButton);
confirmationBox.append(textBox,confirmationBoxButton);
mainBody.appendChild(confirmationBox);

let deleteType;
function deleteConfirmMenu(type,location) {
    let deleteBox = document.getElementById("confirm-box");
    deleteType = location;
    if (type == "toggle") {
        universalStyleCheck(deleteBox,"zIndex",1000,-1)
    } else if (type === "close") {
        if (deleteBox.style.zIndex !== -1) {
            deleteBox.style.zIndex = -1;
        } 
    }
}

let currentlyClearing = false;
function clearLocalStorage(forceReload) {
    if (currentlyClearing != true) {
        currentlyClearing = true;
        let clearPromise = new Promise(function(myResolve, myReject) {
            localStorage.clear();
            if(localStorage.length === 0) {
                myResolve(); 
            } else {
                myReject();
            }
        });
        
        clearPromise.then(
            function(value) {
                if (forceReload) {
                    setTimeout(location.reload(),200)
                }
            },
            function(error) {console.error("Error clearing local data")}
        ); 
    } 
}

function deleteConfirmButton(confirmed) {
    if (confirmed == true) {
        if (deleteType === "intro") {
            if (!startAlready) {
                startAlready = true;
                let clearPromise = new Promise(function(myResolve, myReject) {
                    localStorage.clear();
        
                    if(localStorage.length === 0) {
                        myResolve(); 
                    } else {
                        myReject();
                    }
                });
                
                clearPromise.then(
                    function(value) {
                        startGame(true);
                        setTimeout(()=>startText.remove(),200);
                    },
                    function(error) {console.error("Error clearing local data")}
                ); 
            }
        } else if (deleteType === "loaded") {
            clearLocalStorage(true);
        } 
    }
        
    let deleteBox = document.getElementById("confirm-box");
    if (deleteBox.style.zIndex == 1000) {deleteBox.style.zIndex = -1}
    return;
}

let drawUI;
(async () => {
    drawUI = await import('./modules/drawUI.js');
    mainBody = drawUI.buildGame(mainBody);
    mainBody.style.display = "block";
})();

let copyrightText = document.getElementById("copyright-number"); 
copyrightText.innerText = COPYRIGHT;
copyrightText.classList.add("copyright-text");

let versionText = document.getElementById("vers-number");
versionText.innerText = VERSIONNUMBER;
versionText.classList.add("version-text");

let versionTextStart = document.getElementById("vers-number-start");
versionTextStart.innerText = `[${VERSIONNUMBER}] \n ${COPYRIGHT}`;
versionText.classList.add("version-text-start");

let preloadStart = Preload();
//------------------------------------------------------------------------POST SETUP------------------------------------------------------------------------//
function startGame(firstGame) {

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

const NONWISHHEROMAX = 200;
const WISHHEROMIN = 800;

const WISHCOST = 1;
let STARTINGWISHFACTOR = 25;
let wishMultiplier = 0;
let adventureType = 0;
let goldenNutUnlocked = false;
let stopSpawnEvents = false;
let preventSave = false;
let timePassedSinceLast = null;
const EVENTCOOLDOWN = 90;
const BOUNTYCOOLDOWN = 60;
const SHOPCOOLDOWN = 15;
const SHOP_THRESHOLD = 600;

let MOBILE = false;
if (navigator.userAgentData) {
    if (navigator.userAgentData.mobile) {
        MOBILE = true;
    }
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
let adventureTreeDefense = false;
let worldQuestDict = {};
const transitionScene = ["0_Meeting", "0_Trade_Wait", "0_LuckCheck_Success", "0_LuckCheck_Failure"];

const FELLBOSS_THRESHOLD = 50;
const UNUSUAL_THRESHOLD = 65;
const WORKSHOP_THRESHOLD = 75;
const FINALE_THRESHOLD = 65;
const FINALE_THRESHOLD_TWO = 30;

const suffixPreload = ['Blue', 'Red', 'Green', 'Purple'];
const prefixPreload = ['', 'Boomer-', 'Bullet-', 'Circle-', 'Warning-'];
let quicktimeAssetArray = [];
suffixPreload.forEach((color) => {
    prefixPreload.forEach((mod) => {
        quicktimeAssetArray.push(`./assets/expedbg/${mod}${color}.webp`);
    })
})

// SPECIAL UPGRADE VARIABLES
let wishPower = 0;
let upperEnergyRate = 35;
let lowerEnergyRate = 15;
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

// ITEM VARIABLES
const weaponBuffPercent =   [0, 1.1, 1.3, 1.7, 2.1, 2.7, 4.6];
const artifactBuffPercent = [0, 1.05, 1.15, 1.35, 1.55, 1.85];
const foodBuffPercent =     [0, 1.4, 2.0, 3.1, 4.4, 6.2];
const nationBuffPercent =   [0, 0, 1.2, 1.5, 1.8];
const energyBuffPercent =   [0, 0, 0, 200, 500, 1000];
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
const upgradeThreshold = [0,0,64,113,160];
const moraleLore = [
    "Nahida is feeling [s]Really Happy[/s]! [mor]<br><br> XP gains are increased by 10% and party <br> deals 10% additional DMG in combat.",
    "Nahida is feeling [s]Happy[/s]! [mor]<br><br> XP gains are increased by 5%.",
    "Nahida feels [s]Neutral[/s] [mor]<br><br> No additional buffs to the party, <br> increase morale by eating food.",
    "Nahida feels [s]Sad[/s]... [mor]<br><br> XP gains are reduced by 15%, recover party morale <br> by resting or completing expeditions successfully.",
]
const extraInfoDict = {
    'Scavenger': '[Scavenger]: The party found additional items!',
    'Toughness': '[Toughness]: The party endured an attack!',
    'Loss': '[Attacked]: The party was attacked and lost some items...',
    'Keen-Eyed': '[Keen-Eyed]: One of your items have been upgraded!',
    'Proficient': '[Proficient] Certain items have been prioritized!',
    'Anti-Sync': "[Anti-Sync] It seems that the two of them didn't get along well...",
    'Sync': '[Sync] The two of them got along pretty well!'
}

const possibleItems = ['Bow', 'Catalyst', 'Claymore', 'Polearm', 'Sword', 'Artifact', 'Food', 'DendroGeoAnemo', 'ElectroCryo', 'PyroHydro', 'Inazuma', 'Liyue', 'Mondstadt', 'Sumeru'];
const boxElement = ["Any","Pyro","Hydro","Dendro","Electro","Anemo","Cryo","Geo"];
const specialText = ["Ah! It's Bongo-Head!","'Thank you for releasing Arapacati!'","Woah, a treasure-seeking Seelie!","Woah, a shikigami was trapped inside!"];
const itemFrameColors = ['#909090','#73ac9d','#94aee2','#b0a3db','#614934','#793233'];

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
let expedTooltip = document.getElementById("expedTooltip");
let expedDiv = document.getElementById("expedDiv");
let table4 = document.getElementById("table4");
let table5 = document.getElementById("table5");
let table5Container = document.getElementById("table5-container");
let table6 = document.getElementById("table6");
let table7 = document.getElementById("table7");
let TABS = [table1,table2,table3,table4,table5Container,table7];
let tooltipName,toolImgContainer,toolImg,toolImgOverlay,tooltipText,tooltipLore,tooltipWeaponImg,tooltipElementImg,table6Background;

// INITIAL LOADING
var InventoryMap;
var achievementMap;
let advDict;
let storeInventory;
loadSaveData();
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
addNewRow();
saveValues["realScore"]--;

createMultiplierButton();
createExpMap();
createExpedition();
expedInfo("exped-7");
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
function timerEvents() {
    // 1 timerSeconds = 1 SECOND IN REAL TIME
    let timeRatioTemp = timeRatio / 1000;
    timerSeconds += timeRatioTemp;
    
    saveValues["realScore"] += timeRatioTemp * saveValues["dps"] * foodBuff;
    if (!stopSpawnEvents) {
        checkAchievement();
        refresh();
        dimHeroButton();
        addNewRow(true);
    }
    
    randomEventTimer(timerSeconds);
    timerSave(timerSeconds);
    shopCheck();
    shopTimerFunction();
    checkTimerBounty();
    if (beta) {
        if (persistentValues.tutorialAscend) {
            growTree('add');
        }
        checkCommisions();
    };
}

// TEMPORARY TIMER
function timerEventsLoading() {
    addNewRow();
    refresh();
}

// SAVE DATA TIMER
var savedTimes = 1;
let saveTimeMin = 180 * savedTimes;
function timerSave(timerSeconds) {
    // SAVES DATA EVERY 3 MINUTES
    if (timerSeconds > saveTimeMin) {
        saveData();
        if (!beta) console.log("Saved!");

        savedTimes++;
        saveTimeMin = 180 * savedTimes;
    }
}

// GET CURRENT TIME IN MINUTES SINCE 1900
function getTime() {
    let startOfYear = new Date('1900-01-01T00:00:00');
    let now = new Date();
    let minutesPassedNow = (now - startOfYear) / (1000 * 60);
    return minutesPassedNow;
}

// LOAD SAVE DATA
function loadSaveData() {
    // LOAD SETTINGS
    if (localStorage.getItem("settingsValues") == null) {
        settingsValues = SettingsDefault;
    } else {
        let settingsTemp = localStorage.getItem("settingsValues");
        settingsValues = JSON.parse(settingsTemp);
        updateObjectKeys(settingsValues,SettingsDefault);
    }
    // LOAD VALUES DATA
    if (localStorage.getItem("saveValuesSave") == null) {
        saveValues = saveValuesDefault;
    } else {
        let saveValuesTemp = localStorage.getItem("saveValuesSave");
        saveValues = JSON.parse(saveValuesTemp);
        
        // if (beta) {
        //     delete saveValues.baseCommisions;
        //     delete saveValues.currentCommisions;
        // }

        updateObjectKeys(saveValues,saveValuesDefault);
    }
    // LOAD HEROES DATA
    if (localStorage.getItem("upgradeDictSave") === null) {
        let upgradeDictTemp = generateHeroPrices(upgradeDictDefault,NONWISHHEROMAX);
        upgradeDict = upgradeDictTemp;
    } else {
        let upgradeDictTemp = localStorage.getItem("upgradeDictSave");
        upgradeDict = JSON.parse(upgradeDictTemp);

        // FOR SAVE DATA BELOW 0.4.431 (WORKAROUND TO PREVENT EXPONENTIAL ITEM GROWTH)
        if (parseInt(saveValues.versNumber) < 44310) {
            for (let key in upgradeDict) {
                upgradeDict[key]["BaseFactor"] = upgradeDict[key]["Factor"];
            }
        }
        // FOR SAVE DATA BELOW 1.00.005 (WORKAROUND TO PREVENT ITEM NAN BUG FOR WISH HEROES)
        if (parseInt(saveValues.versNumber) < 100005) {
            for (let key in upgradeDict) {
                if (key > 799 || key == 0) {
                    if (upgradeDict[key]["Factor"]) {
                        upgradeDict[key]["BaseFactor"] = upgradeDict[key]["Factor"];
                    }
                } 
            }
        }

        setTimeout(loadRow,1000);
    }
    // LOAD INVENTORY DATA
    Inventory = InventoryDefault;
    if (localStorage.getItem("InventorySave") == null) {
        InventoryMap = new Map();
    } else {
        let InventoryTemp = localStorage.getItem("InventorySave");
        InventoryMap = new Map(JSON.parse(InventoryTemp));
        inventoryload();
    }
    // LOAD EXPEDITION DATA
    if (localStorage.getItem("expeditionDictSave") == null) {
        expeditionDict = expeditionDictDefault;
    } else {
        let expeditionDictTemp = localStorage.getItem("expeditionDictSave");
        expeditionDictTemp = JSON.parse(expeditionDictTemp);
        // FOR SAVE DATA BELOW 0.3.000 TO REFRESH EXPEDITIONS
        if (typeof(expeditionDictTemp[1]) != "string") {
            expeditionDict = expeditionDictDefault;
        } else {
            expeditionDict = expeditionDictTemp;
        }
        updateObjectKeys(expeditionDict,expeditionDictDefault);
    }
    // LOAD ADVENTURE DATA
    if (localStorage.getItem("advDictSave") == null) {
        advDict = advDictDefault;
    } else {
        let advDictTemp = localStorage.getItem("advDictSave");
        advDict = JSON.parse(advDictTemp);
        updateObjectKeys(advDict,advDictDefault);
        // FOR SAVE DATA BELOW 0.4.4281 TO REFRESH REWARDS
        if (parseInt(saveValues.versNumber) < 44290) {
            for (let key in advDict.rankDict) {
                advDict.rankDict[key].Locked = true;
            }
        }
    }
    // LOAD ACHIEVEMENT DATA
    achievementList = achievementListDefault;
    if (localStorage.getItem("achievementListSave") == null) {
        achievementMap = new Map();
        for (let key in achievementListDefault) {
            achievementMap.set(parseInt(key),false);
        }
    } else {
        let achievementListTemp = localStorage.getItem("achievementListSave");
        achievementMap = new Map(JSON.parse(achievementListTemp));
    }
    // LOAD STORE DATA
    if (localStorage.getItem("storeInventory") == null) {
        storeInventory = storeInventoryDefault;
    } else {
        // FOR SAVE DATA BELOW 0.3.411 TO FIX STORE BUG
        if (parseInt(saveValues.versNumber) < 34112) {
            storeInventory = storeInventoryDefault;
        } else {
            let localStoreTemp = localStorage.getItem("storeInventory");
            storeInventory = JSON.parse(localStoreTemp);
            if (storeInventory.active == true) {
                setShop("load");
            }
        }
    }
    // LOAD PERSISTENT VALUES 
    if (localStorage.getItem("persistentValues") == null) {
        persistentValues = persistentValuesDefault;
    } else {
        let persistentDictTemp = localStorage.getItem("persistentValues");
        if (persistentDictTemp == "undefined") {
            persistentValues = persistentValuesDefault;
        } else {
            persistentValues = JSON.parse(persistentDictTemp);
            updateObjectKeys(persistentValues, persistentValuesDefault);
            updateObjectKeys(persistentValues.ascendDict, persistentValuesDefault.ascendDict);

            // FOR SAVE DATA BELOW 2.0.001 TO ADD NEW VALUES
            if (parseInt(saveValues.versNumber) < 200001) {
                if (persistentValues.lifetimeClicksValue === 0) {
                    persistentValues.lifetimeClicksValue = saveValues.clickCount;
                } 
    
                if (persistentValues.lifetimeLevelsValue === 0) {
                    persistentValues.lifetimeLevelsValue = saveValues.heroesPurchased;
                } 
    
                if (persistentValues.lifetimeEnergyValue === 0) {
                    persistentValues.lifetimeEnergyValue = saveValues.energy;
                } 
    
                if (persistentValues.lifetimePrimoValue === 0) {
                    persistentValues.lifetimePrimoValue = saveValues.primogem;
                }
            }  
        }
    }

    const newTime = getTime();
    timePassedSinceLast = newTime - persistentValues.lastRecordedTime;
    persistentValues.lastRecordedTime = newTime;
    
    if (persistentValues.tutorialAscend) {
        createTreeMenu();
    }

    if (beta) {
        if (persistentValues.challengeCheck === undefined) {
            persistentValues.challengeCheck = challengeCheck('populate', challengeInfo);
        } else {
            persistentValues.challengeCheck = challengeCheck('checkKeys', persistentValues.challengeCheck, challengeInfo);
        }

        updateObjectKeys(saveValues.treeObj, saveValuesDefault.treeObj);
    }

    achievementListload();
    specialValuesUpgrade(true);
    if (saveValues.goldenTutorial === true) {
        addNutStore();
    }
}

// BIG BUTTON FUNCTIONS
let clickAudioDelay = null;
let currentClick = 1;

let autoClick = null;
let currentlyAutoClick = false;

let demoImg = document.createElement("img");
demoImg.src = settingsValues.preferOldPic ? "./assets/nahida.webp" : "./assets/nahidaTwo.webp";
demoImg.classList.add("demo-img");
demoImg.id = "demo-main-img";
demoImg.critInARow = 0;

demoContainer.addEventListener('mousedown', () => {
    if (settingsValues.autoClickBig) {
        autoClick = setInterval(touchDemo, 400);
        currentlyAutoClick = true;
    }
})

demoContainer.addEventListener("mouseup", () => {
    touchDemo();
});

document.addEventListener("mouseup", () => {
    currentlyAutoClick = false;
    if (autoClick !== null) {
        clearInterval(autoClick);
        autoClick = null;
    }
});

function touchDemo() {
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
            clickEarn = Math.ceil(currentClick * clickCritDmg);
        } else {
            clickEarn = Math.ceil(saveValues["clickFactor"] * clickCritDmg);
        }

        demoImg.critInARow++;
        challengeNotification(({category: 'nahidaCrit', value: demoImg.critInARow}))
    } else {
        if (clickerEvent !== "none") {
            clickDelay -= 2;
            clickEarn = currentClick;
        } else {
            clickEarn = Math.ceil(saveValues["clickFactor"]);
        }

        if (demoImg.critInARow > 0) {demoImg.critInARow = 0}
    }

    saveValues["realScore"] += clickEarn;
    if (clickEarn > 1e9) {
        challengeNotification(({category: 'specific', value: [3, 1]}))
    }
    energyRoll();

    if (clickAudioDelay === null) {
        if (timerSeconds !== 0) {
            demoElement.load();
            demoElement.play();

            clickAudioDelay = true;
            setTimeout(() => {clickAudioDelay = null}, 155);
        }
    }

    if (crit) {
        floatText("crit",true,leftDiv,clickEarn,randomInteger(40,55),60,abbrNum,clickerEvent);
    } else {
        if (settingsValues.combineFloatText) {
            floatText("normal",true,leftDiv,clickEarn,43,43,abbrNum,clickerEvent);
        } else {
            floatText("normal",false,leftDiv,clickEarn,randomInteger(30,70),randomInteger(50,70),abbrNum,clickerEvent);
        }
    }

    if (settingsValues.showFallingNuts) {spawnFallingNut()};
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

// ROLL FOR ENERGY
function energyRoll() {
    let randInt = Math.floor(Math.random() * 1000);
    clickDelay--;
    if (clickDelay < 1){
        if (randInt < ENERGYCHANCE) {
            const energyGain =  randomInteger(lowerEnergyRate, upperEnergyRate)
            saveValues.energy += energyGain;
            persistentValues.lifetimeEnergyValue += energyGain;

            challengeNotification(({category: 'energy', value: saveValues.energy}))
            clickDelay = 20;
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

// UPDATES VALUES WITH PERSISTENT VALUES
function specialValuesUpgrade(loading, valueUpdate) {
    if (loading === true) {
        upperEnergyRate = Math.ceil(35 * (10 + persistentValues.upgrade1.Purchased) / 10);
        lowerEnergyRate = Math.ceil(upperEnergyRate * 0.42);
        specialClick = (1 + (persistentValues.upgrade2.Purchased)/10).toFixed(3);
        wishPower = (1 - (persistentValues.upgrade3.Purchased)/200).toFixed(3);
        costDiscount = (1 - (persistentValues.upgrade4.Purchased)/50).toFixed(3);
        clickCritRate = persistentValues.upgrade5.Purchased;
        clickCritDmg = Math.round((Math.log(persistentValues.upgrade5.Purchased + 1) * 18));
        idleRate = (persistentValues.upgrade6.Purchased/100).toFixed(2);
        luckRate = persistentValues.upgrade7.Purchased/2;
        eventCooldownDecrease = (1 - persistentValues.upgrade8.Purchased/50).toFixed(1);
        additionalPrimo = (1 + persistentValues.upgrade9.Purchased/10).toFixed(3);
        additionalStrength = (1 + persistentValues.upgrade10.Purchased/10).toFixed(3);
        additionalDefense = (1 + persistentValues.upgrade11.Purchased/10).toFixed(3);
        additionalXP = (1 + persistentValues.upgrade12.Purchased/50).toFixed(3);
    } else if (loading == false) {
        switch (valueUpdate) {
            case 1:
                upperEnergyRate = Math.ceil(35 * (10 + persistentValues.upgrade1.Purchased) / 10);
                lowerEnergyRate = Math.ceil(upperEnergyRate * 0.42);
                break;
            case 2:
                specialClick = (1 + (persistentValues.upgrade2.Purchased)/10).toFixed(3);
                break;
            case 3:
                wishPower = (1 - (persistentValues.upgrade3.Purchased)/200).toFixed(3);
                break;
            case 4:
                costDiscount = (1 - (persistentValues.upgrade4.Purchased)/50).toFixed(3);
                break;
            case 5:
                clickCritRate = persistentValues.upgrade5.Purchased;
                clickCritDmg = Math.round((Math.log(persistentValues.upgrade5.Purchased + 1) * 18));
                break;
            case 6:
                idleRate = (persistentValues.upgrade6.Purchased/100).toFixed(2);
                break;
            case 7:
                luckRate = (persistentValues.upgrade7.Purchased/2).toFixed(3);
                break;
            case 8:
                eventCooldownDecrease = (1 - persistentValues.upgrade8.Purchased/50).toFixed(1);
                break;
            case 9:
                additionalPrimo = (1 + persistentValues.upgrade9.Purchased/10).toFixed(3);
                break;
            case 10:
                additionalStrength = (1 + persistentValues.upgrade10.Purchased/10).toFixed(3);
                break;
            case 11:
                additionalDefense = (1 + persistentValues.upgrade11.Purchased/10).toFixed(3);
                break;
            case 12:
                additionalXP = (1 + persistentValues.upgrade12.Purchased/50).toFixed(3);
                break;
            default:
                console.error('Upgrade error: Invalid value to update');
                break;
        }
    }
}

function idleCheck(idleAmount) {
    let timePassed = timeLoaded - saveValues.currentTime;
    if (timePassed > 1400) {
        timePassed = 1400;
    }
    if (timePassed >= 60) {
        idleAmount = timePassed * saveValues.dps * 60 * idleRate;
    }
    return idleAmount;
}

//--------------------------------------------------------------------------RANDOM EVENTS----------------------------------------------------------------------//
// RANDOM EVENTS TIMER
let eventTimes = 1;
let eventChance = 0;
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
        }
        return;
    }
    
    if (timerSeconds > eventTimeMin) {eventChance = randomInteger(0,100)}
}

// START A RANDOM EVENT
function startRandomEvent() {
    if (stopSpawnEvents === true) {return};
    let eventPicture = document.createElement("div");
    let aranaraNumber;
    // HARD EVENTS ARE LOCKED TO 4TH EXPEDITION UNLOCK
    if (expeditionDict[4] != '1') {
        aranaraNumber = randomInteger(1,7);
    } else {
        aranaraNumber = randomInteger(1,4);
    }
     
    eventPicture.classList.add("random-event");
    eventPicture.addEventListener("click", () => {
        clickedEvent(aranaraNumber);
        eventPicture.remove();
        toggleSettings(true);
        deleteConfirmMenu("close","loaded");
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
    let specialEvent = randomIntegerWrapper(luckRate*2, 200);
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

function chooseEvent(type,specialMode) {
    if (stopSpawnEvents === true) {return};
    switch (type) {
        case 1:
        case 1.5:
            clickEvent(specialMode);
            break;
        case 2:
            reactionEvent();
            break;
        case 3:
            boxFunction(specialMode);
            break
        case 4:
            minesweeperEvent();
            break;
        case 5:
            weaselEvent(specialMode);
            break;
        case 6:
            rainEvent();
            break;
        case 7:
            simonEvent(randomInteger(1,3) === 2 ? true : false);
            break;
        case 8:
            battleshipEvent();
            break;
        case 9:
            snakeEvent();
            break;
        default:
            console.error(`Event error: Invalid event ${type}`);
            break;
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

    if (wandererMode === true) {
        leftDiv.style.animation = "none";
        void leftDiv.offsetWidth;
        leftDiv.style.animation = "darkness-transition 0.3s linear";
        setTimeout(()=>{
            button.style.animation = "rotation 3.5s infinite linear forwards";
            if (!leftDiv.classList.contains("vignette-blue")) {leftDiv.classList.add("vignette-blue")};
            let leftBG = document.getElementById("left-bg");
            leftBG.src = "./assets/bg/scara-bg.webp";
            button.src = "./assets/event/scara.webp";
        },150);
        challengeNotification(({category: 'specific', value: [2,4]}))
    } else {
        button.style.animation = "rotation 3.5s infinite linear forwards";
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

        let leftBG = document.getElementById("left-bg");
        setTimeout(()=>{
            button.src = settingsValues.preferOldPic ? "./assets/nahida.webp" : "./assets/nahidaTwo.webp";
            leftBG.src = "./assets/bg/bg.webp";
        },150)
    } else {
        if (leftDiv.classList.contains("vignette")) {leftDiv.classList.remove("vignette")};
    }

    clickerEvent = "none";
    clickEventDelay = null;
    stopSpawnEvents = false;
}

// EVENT 2 (REACTION TIME)
var reactionReady = false;
var reactionGame = false;
function reactionEvent() {
    stopSpawnEvents = true;
    reactionGame = true;
    let eventBackdrop = document.createElement("div");
    eventBackdrop.classList.add("cover-all","flex-column","event-dark");

    let reactionImage = document.createElement("div");
    reactionImage.id = "reaction-image";

    let eventDescription = document.createElement("p");
    eventDescription.innerText = "Click the button just \n when the clock stops ticking!";
    eventDescription.classList.add("event-description");
    let reactionImageBottom = document.createElement("img");
    reactionImageBottom.src = "./assets/event/clock-back.webp";
    reactionImageBottom.id = "reaction-image-bot";
    let reactionImageArrow = document.createElement("img");
    reactionImageArrow.src = "./assets/event/clock-arrow.webp";
    reactionImageArrow.id = "reaction-image-arrow";
    let reactionImageTop = document.createElement("img");
    reactionImageTop.src = "./assets/event/clock-top.webp";
    reactionImageTop.classList.add("flex-column");
    reactionImageTop.id = "reaction-image-top";

    reactionStartElement.load();
    reactionStartElement.play();

    let reactionButton = document.createElement("div");
    reactionButton.id = "reaction-button";
    reactionButton.classList.add("background-image-cover");
    reactionButton.innerText = "Not yet...";
    reactionButton.addEventListener("click",()=>{
        reactionStartElement.pause();
        reactionImageArrow.style.animationPlayState = "paused";
        reactionFunction(eventBackdrop);
        setTimeout(()=> {
            eventBackdrop.remove();
        },2000)
    });

    let randomTime = randomInteger(6000,9500);
    setTimeout(() => {
        if (reactionGame === true) {
            reactionStartElement.pause();
            reactionReady = true;
            reactionButton.innerText = "Now!";
            reactionButton.classList.add("glow");
            reactionImageArrow.style.animationPlayState = "paused";
            setTimeout(() => {
                if (reactionGame == true) {
                    reactionReady = false;
                    reactionButton.innerText = "Too Slow!";
                    reactionFunction(eventBackdrop);
                }
            }, 800 * randomInteger(90,110) / 100)
        }
    }, randomTime);
    
    reactionImage.append(reactionImageBottom,reactionImageArrow,reactionImageTop)
    eventBackdrop.append(eventDescription,reactionImage,reactionButton);
    mainBody.append(eventBackdrop);
}

function reactionFunction(eventBackdrop) {
    stopSpawnEvents = false;
    if (reactionGame == false) {return}
    let outcomeText;
    let primogem = 0;

    reactionStartElement.pause();
    reactionCorrectElement.load();
    if (reactionReady == false) {
        persistentValues.aranaraLostValue++;
        outcomeText = "You missed!";
    } else if (reactionReady == true) {
        reactionCorrectElement.play();
        adventure("10-");
        primogem = randomInteger(40,60);
        outcomeText = "You did it!";
    }

    reactionReady = false;
    reactionGame = false;
    eventOutcome(outcomeText, eventBackdrop, "reaction", primogem);
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
        adventure("10-");
        boxOutcome.src = `./assets/event/verygood-${randomSpecial}.webp`;
        outcomeText = specialText[randomSpecial-2];
    } else {
        let boxChance = randomInteger(1,101);
        if (goldenNutUnlocked === true && boxChance >= 90) {
            outcomeNumber = randomInteger(5,15);
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
const ROWS = 8;
const COLS = 8;
function minesweeperEvent() {
    stopSpawnEvents = true;
    const mines = randomInteger(6,8);
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
    mineInfo.classList.add("flex-column")
    let mineInfoTop = new Image();
    mineInfoTop.src = "./assets/event/minesweeper-top.webp";
    let mineInfoBot = new Image();
    mineInfoBot.src = "./assets/event/minesweeper-bot.webp";
    mineInfo.append(mineInfoTop,mineInfoBot)
    
    let mineBackground = document.createElement("table");
    let board;
    let firstClick = true;
    let cellsLeft = ROWS * COLS - mines;
    mineBackground.classList.add("event-mine-bg");
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
            const td = document.createElement("td");
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
                    adventure("10-");
                    newPop(1);
                    sortList("table2");

                    eventOutcome(`All whopperflowers have been revealed!`,eventBackdrop);
                    const endTimestamp = performance.now();
                    setTimeout(()=> {
                        currencyPopUp("items",0,"primogem", randomPrimo);
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

    eventBackdrop.append(eventDescription,mineBackground,mineInfo,cancelBox);
    mainBody.append(eventBackdrop);
}

let weaselCount = 0;
let goldWeaselCount = 0;
// EVENT 5 (WHACK-A-MOLE)
function weaselEvent(specialWeasel) {
    stopSpawnEvents = true;
    let weaselElement = 18;
    weaselCount = 0;
    goldWeaselCount = 0;

    let eventBackdrop = document.createElement("div");
    eventBackdrop.classList.add("cover-all","event-dark","flex-row","event-dark-row");
    eventBackdrop.style.flexWrap = "wrap";
    let eventDescription = document.createElement("p");
    eventDescription.innerText = "Catch the glowing weasel!";
    eventDescription.classList.add("event-description");
    eventDescription.style.width = "100%";
    eventDescription.style.position = "relative";
    eventDescription.style.top = "5%";
    let weaselBack = document.createElement("div");
    weaselBack.classList.add("flex-row","weasel-back");

    while (weaselElement--) {
            let weaselContainer = document.createElement("div");
            weaselContainer.classList.add("weasel");

            let weaselBackImage = document.createElement("img");
            weaselBackImage.src = './assets/event/weasel-10.webp';
            weaselContainer.append(weaselBackImage)
            weaselBack.append(weaselContainer);
    }

    let delay = 2000;
    setTimeout(() => {
        addWeasel(weaselBack,delay,specialWeasel);
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

function addWeasel(weaselBack,delay,specialWeasel) {
    let weaselDiv = weaselBack.children;
    let realWeasel = randomInteger(0,18);
    let specialWeaselSpawns = false;
    if (specialWeasel) {specialWeaselSpawns = randomIntegerWrapper(luckRate*6, 200)}

    for (let i = 0, len = weaselDiv.length; i < len; i++) {
        let weaselImage = weaselDiv[i].querySelector('img');
        if (i === realWeasel) {
            weaselImage.style.filter = 'unset';
            if (specialWeaselSpawns) {
                weaselImage.src = "./assets/event/weasel-1.webp";
            } else {
                let realWeasel = randomInteger(2,4);
                weaselImage.src = "./assets/event/weasel-"+realWeasel+".webp";
            }

            let springInterval = (randomInteger(20,25) / 100);
            weaselImage.classList.add("spring");
            weaselImage.style["animation-duration"] = springInterval + "s";
            weaselImage.addEventListener("click",() => {
                mailElement.load();
                mailElement.playbackRate = 1.35;
                mailElement.play();

                delay *= 0.65;
                if (delay <= 450) {delay = 450}

                clearWeasel(weaselBack, delay, specialWeasel);
                weaselCount++;
                if (specialWeaselSpawns) {goldWeaselCount++}

                let weaselCountText = document.getElementById("visible-weasel-count");
                weaselCountText.innerText = weaselCount;
            })
        } else {
            let emptyWeasel = randomInteger(7,11);
            if (emptyWeasel != 10 & emptyWeasel != 9) {
                let springInterval = (randomInteger(15, 20) / 100);
                weaselImage.classList.add("spring");
                weaselImage.style["animation-duration"] = springInterval + "s";
                weaselImage.style.filter = `brightness(${randomInteger(65, 90) / 100})`;
            }
            weaselImage.src = "./assets/event/weasel-"+emptyWeasel+".webp"
        }
    }

    let fakeAmount = Math.floor(2000/delay + 0.3);
    if (fakeAmount > 10) {fakeAmount = 10}
    let combination = generateCombination(fakeAmount);
    for (let j = 0, len = combination.length; j < len; j++) {
        if ((combination[j] - 1) === realWeasel) {continue}
        let weaselImage = weaselDiv[combination[j] - 1].querySelector('img');
        let fakeWeasel = randomInteger(5, 7);
        if (specialWeasel) {fakeWeasel = randomInteger(4, 7)}

        weaselImage.src = "./assets/event/weasel-"+fakeWeasel+".webp";
        weaselImage.style.filter = 'unset';

        let springInterval = (randomInteger(15,35) / 100)
        weaselImage.classList.add("spring");
        weaselImage.style["animation-duration"] = springInterval + "s";
        weaselImage.addEventListener("click",()=> {
            let fakeWeaselAlert = document.getElementById("fake-weasel-alert");
            fakeWeaselAlert.style.animation = "none";
            setTimeout(() => { fakeWeaselAlert.style.animation = "fadeOutWeasel 3s linear forwards"}, 10)
            weaselDecoy.load();
            weaselDecoy.play();
            clearWeasel(weaselBack, delay, specialWeasel);
        })
    }
}

function clearWeasel(weaselBack,delay,specialWeasel) {
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
        addWeasel(weaselBack, delay, specialWeasel);
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
        if (type >= 95 && goldenNutUnlocked === true && tempGolden <= 5) {
            img.src = "./assets/icon/goldenIcon.webp";
            animation = `rain-rotate ${(randomInteger(6,10)/2)}s linear forwards`
            img.addEventListener('click', () => {
                reactionCorrectElement.load();
                reactionCorrectElement.play();
                img.remove();

                tempGolden++;
                nutCount++;
            });
        } else if (type >= 85) {
            img.src = "./assets/icon/primogemLarge.webp"
            animation = `rain-rotate ${(randomInteger(3,8)/2)}s linear forwards`
            img.addEventListener('click', () => {
                img.remove();
                tempPrimogem += randomInteger(10,20);
                rainTextDiv.innerText = abbrNum(tempScore * dpsMultiplier) + " Nuts | " + Math.round(tempPrimogem * additionalPrimo) + " Primos";
            });
        } else if (type >= 65) {
            img.src = "./assets/icon/scarab.webp";
            img.addEventListener('click', () => {
                weaselDecoy.load();
                weaselDecoy.play();
                img.remove();

                tempScore -= 10;
                tempScore = Math.max(0, tempScore);
                tempPrimogem -= randomInteger(50,80);
                tempPrimogem = Math.max(0, tempPrimogem);
                scarabCount++;

                rainTextDiv.innerText = abbrNum(tempScore * dpsMultiplier)+ " Nuts | " + Math.round(tempPrimogem * additionalPrimo) + " Primos";
            });
        } else {
            img.src = "./assets/icon/nut.webp";
            img.addEventListener('click', () => {
                img.remove();
                tempScore++;
                nutCount++;

                rainTextDiv.innerText = abbrNum(tempScore * dpsMultiplier)+ " Nuts | " + tempPrimogem + " Primos";
            });
        }
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
                    currencyPopUp("primogem", tempPrimogem, "nuts", tempGolden);
                } else if (tempPrimogem != 0) {
                    currencyPopUp("primogem", tempPrimogem);
                } else if (tempGolden != 0) {
                    currencyPopUp("nuts", tempGolden);
                }

                rainText.remove();
            });
        },2500)
    }, 28000);
    mainBody.append(eventBackdrop);
}

// EVENT 7 (SIMON SAYS)
function simonEvent(hexMode) {
    stopSpawnEvents = true;
    let eventBackdrop = document.createElement("div");
    eventBackdrop.classList.add("cover-all","flex-column","event-dark");

    let eventDescription = document.createElement("p");
    eventDescription.innerText = "Follow the sequence! [1]";
    eventDescription.classList.add("event-description");
    eventDescription.style.position = "absolute";
    eventDescription.style.top = "1%";
    eventBackdrop.append(eventDescription);

    let saysContainer = document.createElement('div');
    saysContainer.sequenceArray = [];
    saysContainer.activeArray = [];
    saysContainer.ready = false;
    let requiredAmount;

    if (hexMode) {
        requiredAmount = 7;
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
        requiredAmount = 8;
        saysContainer.classList.add('say-container');
        for (let i = 1; i < 5; i++) {
            let saysImg = document.createElement('img');
            saysImg.src = `./assets/event/says-${i}.webp`;
            saysImg.id = `says-${i}`;
            saysImg.classList.add('say-img');
            saysImg.style.filter = 'brightness(0.1)';
            saysImg.style.transform = `translate(${(((i === 1) || (i === 4)) ? -1 : 1) * 50}%, ${(i < 3 ? -1 : 1) * 50}%)`;
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
            if (array.length === 0) {
                saysContainer.ready = true;
            } else {
                setTimeout(() => {showSequence(array);},550);   
            }
        },750);
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
                eventOutcome(eventText, eventBackdrop, "simon");
                return;
            }
        }
        
        setTimeout(()=>{
            activeElement.style.filter = 'brightness(0.1)';
            if (saysContainer.activeArray.length >= requiredAmount) {
                let eventText = `You win!`;
                eventOutcome(eventText, eventBackdrop, "simon");
                return;
            } else if (saysContainer.sequenceArray.length === saysContainer.activeArray.length) {
                setTimeout(()=>{
                    saysContainer.activeArray = [];
                    eventDescription.innerText = `Follow the sequence! [${saysContainer.sequenceArray.length+1}]`;
                    addSequence();
                },500)
            } else {
                saysContainer.ready = true;
            }
        },350);
    }

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
        let key = new Image();
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
        let key = new Image();
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
            
            let cross = new Image();
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
            
            let cross = new Image();
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
                eventOutcome("You lost! You didn't win any treasure...", eventBackdrop);
                persistentValues.aranaraLostValue++;
                battleshipContainer.gameStarted = false;
            }
        } else {
            if (enemyDiv.score === 0) {
                eventOutcome("You won! You earned some treasure!", eventBackdrop);
                battleshipContainer.gameStarted = false;

                let finalHealth = friendlyDiv.score;
                setTimeout(() => {
                    if (finalHealth >= 4 && choicesTaken <= 12) {
                        challengeNotification(({category: 'specific', value: [4, 5]}));
                        challengeNotification(({category: 'specific', value: [4, 6]}));
                    } else if (finalHealth >= 4) {
                        challengeNotification(({category: 'specific', value: [4, 6]}));
                    } else if (choicesTaken <= 12) {
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
function snakeEvent() {
    stopSpawnEvents = true;
    let eventBackdrop = document.createElement("div");
    eventBackdrop.classList.add("cover-all","flex-column","event-dark","minesweeper-backdrop");
    eventBackdrop.style.columnGap = "1%";

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
        const randomX = randomInteger(0, width / cellLength);
        const randomY = randomInteger(0, height / cellLength);

        if ((randomX === 0 || randomX === Math.ceil(width / cellLength - 1)) || (randomY === 0 || randomY === Math.ceil(height / cellLength - 1))) {
            return generateRandomFood();
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
                if (stopGame) {
                    return;
                }

                let scoreMultiplier = Math.min(MOBILE ? 10 : 12, scoreCounter.score * (MOBILE ? 0.3 : 0.4))
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
        style: {
            width: '100%',
            flexBasis: '100%',
            zIndex: '10001',
            columnGap: '2%'
        },
        class: ['flex-row'],
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
            adventure("10-");
            newPop(1);
            amount = randomInteger(100,140);
        } else if (weaselCount >= 7) {
            innerTextTemp = `\n You received a few items!`;
            adventure("10-");
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
            innerText += "You received the max reward!!";
            amount = randomInteger(220,300);
        } else if (snakeScore > 650) {
            innerText += "You received a high reward!";
            amount = randomInteger(140,220);
        } else if (snakeScore > 300) {
            innerText += "You received a medium reward!";
            amount = randomInteger(80,140);
        } else if (snakeScore > 150) {
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
                    currencyPopUp("primogem",amount);
                } else if (type === "weasel") {
                    if (amount == 0 && amount2 == 0) {
                        void(0);
                    } else if (amount == 0 && amount2 > 0) {
                        currencyPopUp("nuts",amount2);
                    } else if (amount < 60 && amount2 > 0) {
                        currencyPopUp("primogem",amount,"nuts",amount2);
                    }  else if (amount < 100 && amount2 > 0) {
                        currencyPopUp("items",0,"nuts",amount2);
                    }  else if (amount < 140 && amount2 > 0) {
                        currencyPopUp("items",0,"nuts",amount2);
                    } else if (amount < 60) {
                        currencyPopUp("primogem",amount);
                    }  else if (amount < 100) {
                        currencyPopUp("primogem",amount,"items",0);
                    }  else if (amount < 140) {
                        currencyPopUp("primogem",amount,"items",0);
                    } 
                } else if (type === "box") {
                    if (amount < 40 && amount > 0) {
                        currencyPopUp("nuts",amount);
                    } else if (amount >= 40 && amount <= 60) {
                        currencyPopUp("primogem",amount);
                    } else if (amount > 60 && amount <= 100) {
                        saveValues.energy = Math.floor(saveValues.energy * amount / 100);
                    } else if (amount > 100) {
                        itemUse(amount.toString())
                    }
                } else if (type === "reaction") {
                    if (amount != 0) {
                        currencyPopUp("items",0,"primogem",amount);
                    }
                } else if (type === "snake") {
                    if (amount < 80 && amount > 0) {
                        currencyPopUp("primogem",amount);
                    }  else if (amount < 140) {
                        currencyPopUp("primogem",amount,"items",0);
                        adventure("10-");
                        newPop(1);
                        sortList("table2");
                    }  else if (amount < 220) {
                        currencyPopUp("primogem",amount,"items",0);
                        adventure("10-");
                        newPop(1);
                        sortList("table2");
                    } else if (amount < 305) {
                        currencyPopUp("primogem",amount,"items",0);
                        adventure("10-");
                        adventure("10-");
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
    var siteWidth = 1080;
    var scale = screen.width / (siteWidth);
    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width='+siteWidth+', initial-scale='+scale/1.85+', user-scalable=no');

    let loadingNumber = document.getElementById('loading-number');
    let value = parseInt(loadingNumber.loadingValue);
    let preloadArray = drawUI.preloadMinimumArray(upgradeInfo);
    preloadStart.fetch(preloadArray).then(() => {
        setTimeout(() => {removeLoading(loadingNumber)}, 300);
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
        if (persistentValues.upgrade6.Purchased > 0) {
            idleAmount = idleCheck(idleAmount);
        }

        tutorial(idleAmount);
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
    if (firstGame === true) {
        let currentSlide = 1;
        let tutorialDark = document.createElement("div");
        tutorialDark.classList.add("cover-all","flex-column","tutorial-dark");

        let tutorialImage = document.createElement("img");
        tutorialImage.classList.add("tutorial-img");
        tutorialImage.id = "tutorialImg";
        tutorialImage.src = "./assets/tutorial/tut-1.webp"
        
        let tutorialScreen = document.createElement("div");
        tutorialScreen.classList.add("flex-column","tutorial-screen");
        tutorialScreen.addEventListener("click", () => {
            if (currentSlide == 4) {
                overlay.style.zIndex = -1;
                clearInterval(timerLoad);
                timer = setInterval(timerEvents,timeRatio);
                currentBGM = playAudio();
                settingsVolume();
                return;
            }

            currentSlide++;
            tutorialImage.src = "./assets/tutorial/tut-"+currentSlide+".webp";
        })

        tutorialScreen.append(tutorialImage);
        tutorialDark.appendChild(tutorialScreen);
        overlay.appendChild(tutorialDark);
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
        playButton.addEventListener("click",()=>{
            overlay.style.zIndex = -1;
            // CHECK IF ITS PLAYER'S FIRST LOAD FOR THE DAY (ONLY WORKS ON DEPLOYMENT)
            const lastVisit = document.cookie.replace(/(?:(?:^|.*;\s*)lastVisit\s*\=\s*([^;]*).*$)|^.*$/, '$1');
            const today = new Date().toDateString();
            if (lastVisit === '' || lastVisit !== today) {
                settingsBox("toggle", "patch");
                document.cookie = 'lastVisit=' + today + '; expires=' + new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toUTCString() + '; path=/';
            }

            clearInterval(timerLoad);
            timer = setInterval(timerEvents,timeRatio);
            currentBGM = playAudio();
            settingsVolume();

            setTimeout(()=>{
                if (document.getElementById('idle-nuts-div')) {document.getElementById('idle-nuts-div').remove()}
                saveValues.realScore += idleAmount;

                // FOR GOLDEN CORE CHALLENGE
                if (persistentValues.transitionCore !== undefined || persistentValues.transitionCore !== null) {
                    if (persistentValues.tutorialAscend === false && persistentValues.goldenCore > 1000) {
                        persistentValues.tutorialAscend = true;
                        createChallenge();
                        createAscend();
                        createTreeMenu();
                    }

                    challengeNotification(({category: 'core', value: persistentValues.transitionCore}));
                    delete persistentValues.transitionCore;
                }
            },250)
        });

        tutorialDark.appendChild(playButton);
        overlay.append(tutorialDark);
    }
}

// CUSTOM TUTORIALS
const preloadTutorial = Preload();
function customTutorial(tutorialFile,maxSlide,exitFunction) {
    let currentSlide = 1;
    let customTutorialDiv = document.createElement("div");
    customTutorialDiv.classList.add("cover-all","flex-column","tutorial-dark");

    let slideArray = [];
    for (let i = 0; i < maxSlide; i++) {
        slideArray.push(`./assets/tutorial/${tutorialFile}-${i+1}.webp`);
    }
    preloadTutorial.fetch(slideArray);

    let tutorialImage = document.createElement("img");
    tutorialImage.classList.add("tutorial-img");
    tutorialImage.src = `./assets/tutorial/${tutorialFile}-1.webp`;
    
    let tutorialScreen = document.createElement("div");
    tutorialScreen.classList.add("flex-column","tutorial-screen");
    tutorialScreen.addEventListener("click",()=>{
        if (currentSlide === maxSlide) {
            customTutorialDiv.remove();
            stopSpawnEvents = false;

            if (exitFunction) {exitFunction()};
            return;
        }
        currentSlide++;
        tutorialImage.src = `./assets/tutorial/${tutorialFile}-${currentSlide}.webp`;
    })

    tutorialScreen.append(tutorialImage);
    customTutorialDiv.appendChild(tutorialScreen);
    mainBody.appendChild(customTutorialDiv);
}

function saveData(skip) {
    if (preventSave) {return};
    const currentTime = getTime();

    saveValues.currentTime = currentTime;
    saveValues.versNumber = DBNUBMER;
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
        "settingsValues":settingsValues,
        "saveValuesSave":saveValues,
        "upgradeDictSave":upgradeDict,
        "expeditionDictSave":expeditionDict,
        "InventorySave":Array.from(InventoryMap),
        "achievementListSave":Array.from(achievementMap),
        "persistentValues":persistentValues,
        "advDictSave":advDict,
        "storeInventory":storeInventory,
    }

    for (let key in localStorageDict) {
        localStorage.setItem(key,JSON.stringify(localStorageDict[key]));
    }
}

//------------------------------------------------------------------------ON-BAR BUTTONS------------------------------------------------------------------------//
// TAB UI
function createTabs() {
    let tabFlex = document.getElementById("flex-container-TAB");
    for (let i=0, len=(TABS.length - 1); i < len; i++){
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
        addShop();
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
            if (!tabButton.firstChild.classList.contains("darken")) {
                tabButton.firstChild.classList.add("darken");
            }
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

    // if (document.getElementById("pet-table")) {
    //     let petTemp = document.getElementById("pet-table");
    //     if (petTemp.style.display === "flex") {petTemp.style.display = "none"}
    // }

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
    } else if (x == 1){
        if (filterDiv.style.display !== "flex") {filterDiv.style.display = "flex"};
        if (table6.style.display !== "flex") {table6.style.display = "flex"};
        table6.style.display = "flex";  
        tooltipTable = 2;
        updateFilter(filteredInv);
        if (document.getElementById("tool-tip-button")) {
            let tooltipButtonText = document.getElementById("tool-tip-button");
            tooltipButtonText.innerText = "Use";
        }
    } else if (x == 5) {
        let dialog = document.getElementById("table7-text");
        if (persistentValues.tutorialAscend) {
            dialog.innerText = "Welcome back! I'm sure you'll be delighted to see my expanded catalogue! Hehehe."
        } else {
            dialog.innerText = "Welcome! Feel free to have a look. I'll even help package up your purchase, free of charge."
        }
    }

    if (x != 3 && wishCounter != saveValues["wishCounterSaved"]) {
        let mailImageTemp = document.getElementById("mailImageID")
        mailImageTemp.style.opacity = 1;
    }
    updateWishDisplay();

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
            if (deleteBox.style.zIndex == 1000) {deleteBox.style.zIndex = -1};
        }
    }

    if (!stopSpawnEvents) {
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
    let settingButton = document.createElement("button");
    settingButton.classList.add("settings-button");
    settingButton.id = 'setting-button'

    let settingButtonImg = document.createElement("img");
    settingButtonImg.src = "./assets/settings/settings-logo.webp";
    settingButtonImg.classList.add("settings-button-img");
    settingButtonImg.id = 'setting-button-img';
    settingButton.appendChild(settingButtonImg);

    // RELATED TO SETTINGS MENU
    const settingsMenu = createDom('div', {
        class:["flex-column","settings-menu"],
        id: 'settings-menu'
    });

    const settingsNameObject = {'General': 'block', 'Advanced':'block', 'Saves':'flex', 'Console':'flex'};
    const settingsTabArray = [];
    const settingsButtonArray = [];
    if (beta) {
        const settingsHeader = createDom('div', {
            classList: ['flex-row', 'settings-header']
        })

        settingsMenu.append(settingsHeader);

        for (const [tabKey, styleValue] of Object.entries(settingsNameObject)) {
            const tabMenu = createDom('div', {
                class:['settings-tab', (styleValue === 'flex' ? 'flex-column' : null), (styleValue === 'flex' ? 'settings-tab-box' : null)],
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
                settingsTabArray.forEach((tab) => {
                    tab.style.display = 'none';
                })

                settingsButtonArray.forEach((item) => {
                    item.classList.add('inactive-tab');
                });

                if (tabButton.classList.contains('inactive-tab')) {
                    tabButton.classList.remove('inactive-tab')
                }

                if (tabKey === 'Advanced') {
                    const advancedStats = document.getElementById('settings-stats');
                    advancedStats.innerHTML = '';

                    const statsArray = {
                        'timeSpentValue': 'Time Spent:', 
                        'lifetimeClicksValue': 'Big Nahida Clicks:',  
                        'itemsUsedValue': 'Items Used:', 
                        'lifetimeLevelsValue': 'Character Levels Purchased:', 
                        'lifetimeEnergyValue': 'Cumulative Energy:', 
                        'lifetimePrimoValue': 'Cumulative Primogems:', 
                        'aranaraEventValue': 'Aranara Events Witnessed:', 
                        'aranaraLostValue': 'Aranara Events Lost:', 
                        'enemiesDefeatedValue': 'Enemies Defeated:', 
                        'commissionsCompletedValue': 'Commisions Completed:', 
                        'transcendValue': 'Times Transcended:',
                        'harvestCount': 'Mature Trees Harvested:'
                    };
    
                    for (const [key, value] of Object.entries(statsArray)) {
                        advancedStats.innerHTML += `${value} ${key === 'timeSpentValue' ? convertTo24HourFormat(persistentValues[key] / 60) + ' hrs' : persistentValues[key]}<br>`;
                    }
                }

                tabMenu.style.display = styleValue;
            })

            settingsButtonArray.push(tabButton)
            settingsTabArray.push(tabMenu);

            settingsHeader.append(tabButton);
            settingsMenu.append(tabMenu);
        }
    }

    let settingsText = document.createElement("img");
    settingsText.classList.add("settings-text");
    settingsText.src = "./assets/settings/SettingsText.webp"
    
    let volumeScrollerContainer = document.createElement("div")
    volumeScrollerContainer.classList.add("volume-scroller-container");

    let volumeScrollerBGMContainer = document.createElement("div");
    volumeScrollerBGMContainer.classList.add("volume-scroller-container-children");
    let volumeScrollerBGM = document.createElement("input");
    volumeScrollerBGM = volumeScrollerAdjust(volumeScrollerBGM);
    volumeScrollerBGM.id = "volume-scroller-bgm";
    volumeScrollerBGM.setAttribute("type", "range");
    volumeScrollerBGM.value = settingsValues.bgmVolume * 100;

    let volumeScrollerBGMText = document.createElement("div");
    let volumeScrollerBGMTextImage = document.createElement("img");
    volumeScrollerBGMTextImage.src = "./assets/settings/BGM.webp"
    volumeScrollerBGMText.appendChild(volumeScrollerBGMTextImage)
    volumeScrollerBGMContainer.append(volumeScrollerBGMText,volumeScrollerBGM);

    let volumeScrollerSFXContainer = document.createElement("div");
    volumeScrollerSFXContainer.classList.add("volume-scroller-container-children");
    let volumeScrollerSFX = document.createElement("input");
    volumeScrollerSFX = volumeScrollerAdjust(volumeScrollerSFX);
    volumeScrollerSFX.setAttribute("type", "range");
    volumeScrollerSFX.id = "volume-scroller-sfx";
    volumeScrollerSFX.value = settingsValues.sfxVolume * 100;

    let volumeScrollerSFXText = document.createElement("div");
    let volumeScrollerSFXTextImage = document.createElement("img");
    volumeScrollerSFXTextImage.src = "./assets/settings/SFX.webp"
    volumeScrollerSFXText.appendChild(volumeScrollerSFXTextImage)
    volumeScrollerSFXContainer.append(volumeScrollerSFXText,volumeScrollerSFX);
    volumeScrollerContainer.append(volumeScrollerBGMContainer,volumeScrollerSFXContainer)
    
    let settingsMiddle = document.createElement("div");
    settingsMiddle.classList.add("flex-row","settings-bottom");

    // BOTTOM RIGHT OF SETTINGS
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
    })

    let saveSetting = document.createElement("button");
    saveSetting.classList.add("setting-save");
    saveSetting.addEventListener("click",() => {saveData()})

    let clearSetting = document.createElement("button");
    clearSetting.classList.add("setting-clear");
    clearSetting.addEventListener("click",() => {deleteConfirmMenu("toggle","loaded")})

    // BOTTOM LEFT OF SETTINGS
    let settingsMiddleLeft = document.createElement("div");
    settingsMiddleLeft.classList.add("settings-bottom-left");

    let label = document.createElement("label");
    label.innerText = "Combine Click Counts";
    label.classList.add("switch");
    
    let input = document.createElement("input");
    input.type = "checkbox";
    input.name = "color";
    input.value = "red";

    let slider = document.createElement("span");
    slider.classList.add("slider")
    if (settingsValues.combineFloatText === true) {
        input.checked = true;
    }

    input.addEventListener("change", function() {
        if (input.checked) {
            settingsValues.combineFloatText = true;
        } else {
            settingsValues.combineFloatText = false;
        }
    });

    label.append(input,slider);

    const advancedSettingButton = document.createElement("button");
    advancedSettingButton.innerText = "Advanced Settings";
    advancedSettingButton.addEventListener("click",()=>{settingsBox("toggle", "advanced")});

    const errorButton = document.createElement("button");
    errorButton.innerText = "Error Log";
    errorButton.addEventListener("click",()=>{settingsBox("toggle","error")});

    const extraButton = document.createElement("button");
    extraButton.innerText = "Command Console";
    extraButton.addEventListener("click",()=>{settingsBox("toggle","command")});

    const reportButton = document.createElement("button");
    reportButton.innerText = "Report a Bug!";
    reportButton.addEventListener("click",()=>{window.open('https://nahidaquest.com/feedback',"_blank")})

    const creditsButton = document.createElement("button");
    creditsButton.innerText = "Credits";
    creditsButton.addEventListener("click",()=>{window.open('https://nahidaquest.com/credits',"_blank")})

    settingsMiddleLeft.append(label);
    settingsMiddleLeft.append(errorButton, reportButton, extraButton, creditsButton);

    const exportSaveSetting = document.createElement("div");
    exportSaveSetting.innerText = "Export Save";
    exportSaveSetting.classList.add("flex-row");
    exportSaveSetting.addEventListener("click",()=>{settingsBox("toggle","export")})

    const importSaveSetting = document.createElement("div");
    importSaveSetting.innerText = "Import Data";
    importSaveSetting.classList.add("flex-row");
    importSaveSetting.addEventListener("click",()=>{settingsBox("toggle","import")})

    const cancelButton = document.createElement("button");
    cancelButton.classList.add("cancel-button");
    cancelButton.addEventListener("click",()=>{
        settingsMenu.style.zIndex = -1;
        settingsOpen = false;
        deleteConfirmMenu("close","loaded");
    })

    const patchNotesButton = document.createElement("button");
    patchNotesButton.classList.add("patch-button", 'clickable');
    
    if (beta) {
        const patchNotesDiv = document.getElementById('patch-container');
        patchNotesDiv.style.display = 'none';

        const patchBack = createDom('button', {
            innerText: 'Back'
        });

        patchBack.addEventListener('click', () => {
            patchNotesDiv.style.display = patchNotesDiv.style.display === 'none' ? 'flex' : 'none';
        })

        patchNotesDiv.prepend(patchBack)
        settingsTabArray[0].append(patchNotesDiv);

        patchNotesButton.addEventListener("click", () => {
            patchNotesDiv.style.display = patchNotesDiv.style.display === 'none' ? 'flex' : 'none';
        })
        patchNotesButton.classList.add("flex-row");

        const patchNoteImg = createDom('img', {
            src: './assets/icon/patch.webp'
        })

        const patchNoteText = createDom('p', {
            innerText: 'Patch Notes',
        })

        patchNotesButton.append(patchNoteImg, patchNoteText)

        settingsMiddleRight.append(infoSetting, saveSetting, clearSetting);
        settingsMiddle.append(patchNotesButton, settingsMiddleRight);

        const settingsBottom = createDom('div', {
            class: ["flex-row", "settings-bottom"],
        });

        const settingsBottomBadge = createDom('div', {
            class: ['settings-badges'],
            id: 'badges-div'
        })

        if (saveValues.goldenTutorial) {
            settingsBottomBadge.append(createMedal(1, choiceBox, mainBody, stopSpawnEvents))
        }

        if (persistentValues.finaleBossDefeat || beta) {
            settingsBottomBadge.append(createMedal(2, choiceBox, mainBody, stopSpawnEvents))
        }

        if (persistentValues.allChallenges) {
            settingsBottomBadge.append(createMedal(3, choiceBox, mainBody, stopSpawnEvents))
        }

        const settingsBottomButtons = createDom('div', {
            class: ['flex-column', 'settings-bottom-buttons']
        })

        const settingsCredit = createDom('button', {
            innerText: 'Credits',
            class: ['clickable'],
            event: ['click', () => {window.open('https://nahidaquest.com/credits',"_blank")}]
        })

        const settingsHelp = createDom('button', {
            innerText: 'Wiki',
            class: ['clickable'],
            event: ['click', () => {console.log('HELP!!!')}]
        })
    
        settingsBottomButtons.append(settingsHelp, settingsCredit);

        const settingsCredits = createDom('div', {
            class: ['flex-column', 'settings-bottom']
        })

        const copyrightText = document.getElementById('copyright-number');
        const versNumber = document.getElementById('vers-number');

        settingsCredits.append(copyrightText, versNumber)
        settingsBottom.append(settingsBottomBadge, settingsBottomButtons);
        settingsTabArray[0].append(settingsText, volumeScrollerContainer, settingsMiddle, settingsBottom, settingsCredits);
        settingsMenu.append(cancelButton);
    } else {
        patchNotesButton.addEventListener("click", () => {settingsBox("toggle","patch")})

        settingsMiddleRight.append(importSaveSetting, exportSaveSetting, infoSetting, saveSetting, clearSetting);
        settingsMiddle.append(settingsMiddleLeft, settingsMiddleRight);
        settingsMenu.append(settingsText, volumeScrollerContainer, settingsMiddle, cancelButton, patchNotesButton);
    }



    mainBody.appendChild(settingsMenu);

    settingButton.addEventListener("click", () => {
        toggleSettings();
        let deleteBox = document.getElementById("confirm-box");
        if (deleteBox.style.zIndex == 1000) {deleteBox.style.zIndex = -1};
        if (settingButton.classList.contains('settings-button-img-glow')) {
            settingButton.classList.remove('settings-button-img-glow')
        }
    })
    multiplierButtonContainer.prepend(settingButton);
}

let settingsOpen = false;
function toggleSettings(closeOnly) {
    let settingsMenu = document.getElementById("settings-menu");
    if (settingsOpen == true) {
        settingsMenu.style.zIndex = -1;
        settingsOpen = false;
        settingsBox("close");
    } else {
        if (closeOnly !== true) {
            settingsMenu.style.zIndex = 1000;
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

const settingsID = ["export", "import", "error", "command", "patch", "advanced"];
function settingsBox(type,eleId) {
    if (type === "create") {
        // EXPORT SAVE
        const exportBoxDiv = document.createElement("div");
        exportBoxDiv.classList.add("text-box");
        exportBoxDiv.id = "export-box";
        exportBoxDiv.style.zIndex = -1;

        const exportBox = document.createElement("textarea");
        exportBox.value = "Save your game to export it!"
        const cancelExportButton = document.createElement("button");
        cancelExportButton.addEventListener("click",() => {
            exportBoxDiv.style.zIndex = -1;
        })

        const copyExportButton = document.createElement("button");
        copyExportButton.innerText = "Download Save";
        copyExportButton.addEventListener("click",() => {
            let text = JSON.stringify(localStorage);
            text = JSON.stringify(JSON.parse(text), null, 2)

            let blob = new Blob([text], {type: "text/plain"});
            let link = document.createElement("a");
            link.download = `NQ Save ${DBNUBMER}.txt`;
            link.href = URL.createObjectURL(blob);
            link.click();
        })
        
        exportBoxDiv.append(exportBox,cancelExportButton,copyExportButton);
        mainBody.appendChild(exportBoxDiv);

        // IMPORT SAVE
        const importBoxDiv = document.createElement("div");
        importBoxDiv.classList.add("text-box");
        importBoxDiv.id = "import-box";
        importBoxDiv.style.zIndex = -1;

        const textBox = document.createElement("textarea");
        textBox.placeholder = "Paste save data here.";
        const cancelButton = document.createElement("button");
        cancelButton.addEventListener("click",() => {
            importBoxDiv.style.zIndex = -1;
        })

        const copyButton = document.createElement("button");
        copyButton.innerText = "Import Data";
        copyButton.addEventListener("click",()=>{
            let promptSave = textBox.value;
            if (promptSave != null) {
                let localStorageTemp = tryParseJSONObject(promptSave);
                preventSave = true;
                if (localStorageTemp === false) {
                    alert("Invalid save data.")
                    console.error("Invalid save data.");
                } else {
                    let clearPromise = new Promise(function(myResolve, myReject) {
                        localStorage.clear();
                        if (localStorage.length === 0) {
                            myResolve(); 
                        } else {
                            myReject();
                        }
                    });
                    
                    clearPromise.then(
                        function(value) {
                            for (let key in localStorageTemp) {
                                 localStorage.setItem(key, localStorageTemp[key]);
                            }
                            location.reload();
                        },
                        function(err) {console.error("Error clearing local data")}
                    ); 
                }
                preventSave = false;
            }
        })
        importBoxDiv.append(textBox,cancelButton,copyButton);
        mainBody.appendChild(importBoxDiv);

        // ERROR LOG
        const errorBoxDiv = document.createElement("div");
        errorBoxDiv.classList.add("text-box");
        errorBoxDiv.id = "error-box";
        errorBoxDiv.style.zIndex = -1;

        const errorBox = document.createElement("textarea");
        errorBox.value = "Any errors or bugs will appear below this line! \nPlease report such errors to the developer through 'Report a Bug'. Thank you! :) \n------------------------------------------------------------------------------------------\n"
        errorBox.readOnly = true;

        window.onerror = function(message, url, line, col, error) {
            errorBox.value += `${error}\nLine:${line}, Column:${col}\n\n`;
        };

        const cancelErrorButton = document.createElement("button");
        cancelErrorButton.addEventListener("click",() => {
            errorBoxDiv.style.zIndex = -1;
        })
        
        errorBoxDiv.append(errorBox,cancelErrorButton);
        mainBody.appendChild(errorBoxDiv);

        // COMMAND BOX
        const commandDiv = document.createElement("div");
        commandDiv.classList.add("text-box");
        commandDiv.id = "command-box";
        commandDiv.style.zIndex = -1;

        const commandBox = document.createElement("textarea");
        commandBox.value = "Type your command here!";
        const cancelCmdButton = document.createElement("button");
        cancelCmdButton.addEventListener("click",() => {
            commandDiv.style.zIndex = -1;
        })

        const commandButton = document.createElement("button");
        commandButton.innerText = "Execute Command";
        commandButton.addEventListener("click",()=>{
            let commandText = commandBox.value.toLowerCase();
            if (commandText === "transcend") {
                nutPopUp();
                toggleSettings(true);
            } else if (commandText === "ascend skip") {
                persistentValues.tutorialAscend = true;
                saveData();
            } else if (commandText === "beta tools activate") {
                localStorage.setItem('beta', true);
                location.reload();
            } else if (commandText === "beta tools off") {
                localStorage.setItem('beta', false);
                location.reload();
            } else {
                alert("Invalid command.");
            }
        })
        commandDiv.append(commandBox,cancelCmdButton,commandButton);
        mainBody.appendChild(commandDiv);

        // PATCH NOTES
        const patchDiv = document.createElement("div");
        patchDiv.classList.add("text-box","patch-notes-div","flex-column");
        patchDiv.id = "patch-box";
        patchDiv.style.zIndex = -1;

        drawUI.patchNotes(patchDiv,textReplacer);

        const patchCmdButton = document.createElement("button");
        patchCmdButton.addEventListener("click",() => {
            patchDiv.style.zIndex = -1;
        })

        patchDiv.append(patchCmdButton);
        mainBody.appendChild(patchDiv);

        if (beta) {
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
                    class: ['settings-box'],
                    style: {
                        display: 'none'
                    }
                });

                const exportBoxText = createDom('textarea', {
                    class: ['settings-textarea'],
                    placeholder: "Save your game to export it!",
                })

                const exportBoxButton = createDom('button', {
                    class: ['settings-inner-button'],
                    innerText: 'Download Save'
                })
                
                exportBoxButton.addEventListener("click",() => {
                    let text = JSON.stringify(localStorage);
                    text = JSON.stringify(JSON.parse(text), null, 2)
        
                    let blob = new Blob([text], {type: "text/plain"});
                    let link = document.createElement("a");
                    link.download = `NQ Save ${DBNUBMER}.txt`;
                    link.href = URL.createObjectURL(blob);
                    link.click();
                })

                exportBox.append(exportBoxText, exportBoxButton);

                const importBox = createDom('div', {
                    class: ['settings-box'],
                    style: {
                        display: 'block'
                    }
                });

                const importBoxText = createDom('textarea', {
                    class: ['settings-textarea'],
                    placeholder: "Paste save data here.",
                })

                const importBoxButton = createDom('button', {
                    class: ['settings-inner-button'],
                    innerText: 'Import Save'
                })
        
                importBoxButton.addEventListener("click", () => {
                    let promptSave = importBoxText.value;
                    if (promptSave != null) {
                        let localStorageTemp = tryParseJSONObject(promptSave);
                        preventSave = true;
                        if (localStorageTemp === false) {
                            alert("Invalid save data.")
                            console.error("Invalid save data.");
                        } else {
                            let clearPromise = new Promise(function(myResolve, myReject) {
                                localStorage.clear();
                                if (localStorage.length === 0) {
                                    myResolve(); 
                                } else {
                                    myReject();
                                }
                            });
                            
                            clearPromise.then(
                                function(value) {
                                    for (let key in localStorageTemp) {
                                         localStorage.setItem(key, localStorageTemp[key]);
                                    }
                                    location.reload();
                                },
                                function(err) {console.error("Error clearing local data")}
                            ); 
                        }
                        preventSave = false;
                    }
                });
                
                importBox.append(importBoxText, importBoxButton)
                
                exportHeaderButton.addEventListener('click', () => {
                    if (exportHeaderButton.classList.contains('inactive-tab')) {
                        exportHeaderButton.classList.remove('inactive-tab');
                        importHeaderButton.classList.add('inactive-tab')
                    }

                    importBox.style.display = 'none';
                    exportBox.style.display = 'block';
                    setTimeout(()=> {
                        exportBoxText.value = `I AM NOT RESPONSIBLE FOR ANY DAMAGES CAUSED BY EDITING SAVES. Beware! Directly changing 'realScore','rowCount' or adding non-integer values may result in the save file being corrupted!
                                              \n---------------------------------
                                              \n${JSON.stringify(localStorage)}\n\n`;
                    }, 300);
                })

                importHeaderButton.addEventListener('click', () => {
                    if (importHeaderButton.classList.contains('inactive-tab')) {
                        importHeaderButton.classList.remove('inactive-tab');
                        exportHeaderButton.classList.add('inactive-tab')
                    }

                    importBox.style.display = 'block';
                    exportBox.style.display = 'none';
                })

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

                window.onerror = (line, col, error) => {
                    errorBoxText.value += `${error}\nLine:${line}, Column:${col}\n\n`;
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
                        fontSize: '1em'
                    }
                })

                const consoleBoxButton = createDom('button', {
                    class: ['settings-inner-button'],
                    innerText: 'Execute Command'
                })
        
                consoleBoxButton.addEventListener("click",() => {
                    let commandText = consoleBoxText.value.toLowerCase();
                    if (commandText === "transcend") {
                        nutPopUp();
                        toggleSettings(true);
                    } else if (commandText === "ascend skip") {
                        persistentValues.tutorialAscend = true;
                        saveData();
                        location.reload();
                    } else if (commandText === "beta on") {
                        localStorage.setItem('beta', true);
                        location.reload();
                    } else if (commandText === "beta off") {
                        localStorage.setItem('beta', false);
                        location.reload();
                    } else {
                        alert("Invalid command.");
                        console.error(`Invalid command: ${consoleBoxText.value}.`);
                    }
                });
                
                consoleBox.append(consoleBoxText, consoleBoxButton)
                
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
            }, 500)
        }

        // ADVANCED SETTINGS
        const advancedSettings = document.createElement("div");
        advancedSettings.classList.add("advanced-settings-box", "patch-notes-div", "flex-column", "text-box");
        advancedSettings.id = "advanced-box";
        advancedSettings.style.zIndex = -1;

        const advancedMenu = document.createElement("form");
        advancedMenu.classList.add('advanced-menu-form')
        const advancedMenuText = new Image();
        advancedMenuText.src = './assets/settings/adv-settings.webp';
        advancedMenu.append(advancedMenuText)

        const advSettingsDict = [
            {id: 'nahida-preference',  default: 'preferOldPic', text: "Prefer Old 'Big Nahida'"},
            {id: 'falling-preference',  default: 'showFallingNuts', text: "Spawn Falling Nuts on Click"},
            {id: 'clicking-preference',  default: 'combineFloatText', text: "Combine Click Counts"},
            {id: 'wish-preference',  default: 'showWishAnimation', text: "Show Wish Animation"},
            {id: 'auto-preference',  default: 'autoClickBig', text: "Hold to Click 'Big Nahida'"},
            {id: 'wide-combat-preference',  default: 'wideCombatScreen', text: "Wide Battle Screen"},
        ]

        let advancedSettingsMenu;
        let advancedSettingsGrid;
        if (beta) {
            setTimeout(() => {
                advancedSettingsMenu = document.getElementById('settings-tab-advanced');
                advancedSettingsGrid = createDom('div', { class: ['advanced-grid']});
            }, 400)
        }

        advSettingsDict.forEach(advItem => {
            const prefer = document.createElement('input');
            prefer.checked = settingsValues[advItem.default];
            prefer.type = 'checkbox';
            prefer.id = advItem.id;
    
            const preferLabel = document.createElement('label');
            preferLabel.classList.add('switch', 'flex-row');
            preferLabel.setAttribute('for', advItem.id);
    
            const preferText = document.createElement('p');
            preferText.innerText = advItem.text;
            const checkSpan = document.createElement('span');
            checkSpan.classList.add('slider');

            switch (advItem.id) {
                case 'nahida-preference':
                    prefer.addEventListener('change', () => {
                        settingsValues.preferOldPic = prefer.checked;
                        let demoImg = document.getElementById('demo-main-img');
                        if (demoImg.src != "./assets/event/scara.webp") {
                            demoImg.src = settingsValues.preferOldPic ? "./assets/nahida.webp" : "./assets/nahidaTwo.webp";
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
                default:
                    prefer.addEventListener('change', () => {
                        settingsValues[advItem.default] = prefer.checked;
                    });
                    break;
            }
            
            preferLabel.append(preferText, prefer, checkSpan)
            advancedMenu.append(preferLabel);

            if (beta) {
                setTimeout(() => {
                    advancedSettingsGrid.append(preferLabel);
                }, 500)
            }
        });

        if (beta) {
            setTimeout(() => {
                const advancedStats = createDom('p', {
                    id: 'settings-stats',
                    class: ['settings-stats'],
                });

                const statsArray = {
                    'timeSpentValue': 'Time Spent:', 
                    'lifetimeClicksValue': 'Big Nahida Clicks:',  
                    'itemsUsedValue': 'Items Used:', 
                    'lifetimeLevelsValue': 'Character Levels Purchased:',
                    'lifetimeEnergyValue': 'Cumulative Energy:', 
                    'lifetimePrimoValue': 'Cumulative Primogems:', 
                    'aranaraEventValue': 'Aranara Events Witnessed:', 
                    'aranaraLostValue': 'Aranara Events Lost:', 
                    'enemiesDefeatedValue': 'Enemies Defeated:', 
                    'commissionsCompletedValue': 'Commisions Completed:', 
                    'transcendValue': 'Times Transcended:',
                    'harvestCount': 'Mature Trees Harvested:'
                };

                for (const [key, value] of Object.entries(statsArray)) {
                    advancedStats.innerHTML += `${value} ${key === 'timeSpentValue' ? convertTo24HourFormat(persistentValues[key] / 60) : persistentValues[key]}<br>`;
                }

                advancedSettingsMenu.append(advancedSettingsGrid, advancedStats);
            }, 550)
        }

        const closeAdvancedSettings = document.createElement("button");
        closeAdvancedSettings.addEventListener("click", () => {
            advancedSettings.style.zIndex = -1;
        })

        advancedSettings.append(advancedMenu, closeAdvancedSettings);
        mainBody.appendChild(advancedSettings);
    } else if (type === "toggle") {
        let textBox = document.getElementById(`${eleId}-box`);
        if (textBox.style.zIndex == -1) {
            if (eleId === "export") {
                saveData(true);
                setTimeout(()=>{
                    textBox.children[0].value = `Please use a JSON reader like JSONHERO if you like to manipulate the save values. Beware! Directly changing 'realScore','rowCount' or adding non-integer values may result in the save file being corrupted!\n---------------------------------\n\n${JSON.stringify(localStorage)}`;
                },300)
            }
            settingsBox("close");
            textBox.style.zIndex = 10000;
        } else {
            textBox.style.zIndex = -1;
        }
    } else if (type === "close") {
        for (let i = 0; i < settingsID.length; i++) {
            let eleId = settingsID[i];
            let textBox = document.getElementById(`${eleId}-box`);
            if (textBox.style.zIndex != -1) {
                textBox.style.zIndex = -1;
            }
        }
    }
}

function tryParseJSONObject(jsonString) {
    try {
        let o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }
    return false;
};

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
    })

    const heroOptions = ['Pyro','Hydro','Anemo','Electro','Dendro','Cryo','Geo','Sword','Claymore','Catalyst','Polearm','Bow','Sumeru','Mondstadt','Liyue','Inazuma'];
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
       
        let heroID = "but-" + j;
        let heroButtonContainer = drawUI.createHeroButtonContainer(heroID);
        heroButtonContainer.addEventListener("click", () => {
            changeTooltip(upgradeInfo[loadedHeroID], "hero",loadedHeroID);
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
            let heroButtonContainer = drawUI.createHeroButtonContainer(heroID);
            saveValues["rowCount"]++;

            heroButtonContainer.addEventListener("click", () => {
                changeTooltip(upgradeInfo[i], "hero",i);
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
            });
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
        costCurrent = Math.round(upgradeDictTemp["BaseCost"] * ((COSTRATIO**currentPurchasedLocal) - COSTRATIO**(currentPurchasedLocal + currentMultiplierLocal)) / (1 - COSTRATIO));
        requiredFree = currentMultiplierLocal;
    } else {
        costCurrent = Math.round(upgradeDictTemp["BaseCost"] * (COSTRATIO **currentPurchasedLocal));
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
}

function milestoneBuy(heroTooltip) {
    if (document.getElementById(`milestone-${heroTooltip}`).classList.contains("milestone-selected")) {document.getElementById(`milestone-${heroTooltip}`).classList.remove("milestone-selected")}
    const heroID = heroTooltip.split("-")[0];
    const level = heroTooltip.split("-")[1];
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
            if (currentSelection === 'prefer-book' || saveValues.realScore < cost) {
                weaselDecoy.load();
                weaselDecoy.play();
                return;
            } else {
                for (let i = 1; i < 8; i++) {
                    if (InventoryMap.has(elementItemID + i + 7 * itemStar) && InventoryMap.get(elementItemID + i + 7 * itemStar) > 0) {
                        itemArray.push(elementItemID + i + 7 * itemStar);
                    }
                }

                if (itemArray.length === 0) {
                    weaselDecoy.load();
                    weaselDecoy.play();
                    return;
                }

                let tempID = rollArray(itemArray, 0);
                let inventoryCount = InventoryMap.get(tempID);
                inventoryCount--;
                InventoryMap.set(tempID, inventoryCount)

                if (inventoryCount <= 0) { (document.getElementById(tempID)).remove()}
                milestoneSuccess(true);
            }
        } else {
            let heroElement = upgradeInfo[heroID].Ele;
            let heroNation = upgradeInfo[heroID].Nation;

            let tempElement = InventoryMap.get(elementItemID + elemItemID[heroElement] + 7 * itemStar);
            if (tempElement && tempElement > 0) {
                itemArray.push(elementItemID + elemItemID[heroElement] + 7 * itemStar);
            }

            if (itemArray.length === 0 && currentSelection === 'prefer-gem') {
                weaselDecoy.load();
                weaselDecoy.play();
                return;
            } else if (itemArray.length >= 0 && currentSelection !== 'prefer-book') {
                let inventoryCount = InventoryMap.get(itemArray[0]);
                inventoryCount--;
                InventoryMap.set(itemArray[0], inventoryCount);

                if (inventoryCount <= 0) {(document.getElementById(itemArray[0])).remove()}
                milestoneSuccess(false);
                return;
            }

            itemArray = [];
            let tempBook = InventoryMap.get(nationItemID + constNation[heroNation] + 4 * (4 - itemStar));
            if (tempBook && tempBook > 0) {
                itemArray.push(nationItemID + constNation[heroNation] + 4 * (4 - itemStar));
            }

            if (itemArray.length === 0 || saveValues.realScore < cost) {
                weaselDecoy.load();
                weaselDecoy.play();
                return;
            } else if (itemArray.length >= 0 && saveValues.realScore >= cost) {
                let inventoryCount = InventoryMap.get(itemArray[0]);
                inventoryCount--;
                InventoryMap.set(itemArray[0], inventoryCount);

                if (inventoryCount <= 0) {(document.getElementById(itemArray[0])).remove()}
                milestoneSuccess(true);
            }
        }
    }

    function milestoneSuccess(useGem) {
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

    let milestoneImg = new Image();
    milestoneImg.src = `./assets/tooltips/milestone/${upgradeInfo[heroID].Name}.webp`;

    milestoneButton.append(milestoneImg);
    milestoneButton.addEventListener("click",()=>{
        if (document.getElementById(`milestone-${heroTooltip}`)) {
            let oldMilestoneButton = document.getElementById(`milestone-${heroTooltip}`);
            if (oldMilestoneButton.classList.contains("milestone-selected")) {
                oldMilestoneButton.classList.remove("milestone-selected");
            }
        }

        heroTooltip = heroID + "-" + lowestKey;
        changeTooltip(upgradeInfo[heroID],"milestone",lowestKey);
        milestoneButton.classList.add("milestone-selected");
    })
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
            updatedButton.appendChild(newIcon);
            updatedButton.addEventListener("click",()=>{newIcon.remove()})
            return;
        }
    }

    itemUniqueID = idNum;
    let buttonInv = document.createElement("button");
    buttonInv.classList.add("button-container");
    buttonInv.id = itemUniqueID;
    buttonInv.addEventListener('click', function() {
        changeTooltip(Inventory[idNum], "item", idNum);
        if (itemTooltip === -1) {
            buttonInv.classList.add("inventory-selected");
        } else if (idNum !== itemTooltip) {
            let buttonDocument = document.getElementById(itemTooltip);
            buttonDocument.classList.remove("inventory-selected");
            buttonInv.classList.add("inventory-selected");
        }
        
        itemTooltip = idNum;
    });

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

// INVENTORY FUNCTIONALITY
function itemUse(itemUniqueId) {
    let itemID;
    if (typeof itemUniqueId === 'string') {
        itemID = itemUniqueId.split(".")[0];
    } else {
        itemID = itemUniqueId;
    }
    
    // WEAPON
    if (itemID >= 1001 && itemID < WEAPONMAX){
        for (let i = 0, len=WISHHEROMAX; i < len; i++) {
            if (upgradeDict[i] == undefined) continue;
            if (upgradeDict[i].Locked === true) continue;
            if (i < WISHHEROMIN && i > NONWISHHEROMAX) {
                i -= (WISHHEROMIN - NONWISHHEROMAX - 2);
                continue;
            };
            let upgradeDictTemp = upgradeDict[i];
            if (upgradeDictTemp.Purchased > 0){
                if (upgradeInfo[i].Type == Inventory[itemID].Type){
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
        }
    // ARTIFACT
    } else if (itemID >= 2001 && itemID < ARTIFACTMAX){
        for (let i = 0, len=WISHHEROMAX; i < len; i++) {
            if (upgradeDict[i] == undefined) continue;
            if (upgradeDict[i].Locked === true) continue;
            if (i < WISHHEROMIN && i > NONWISHHEROMAX) {
                i -= (WISHHEROMIN - NONWISHHEROMAX - 2);
                continue;
            };
            let upgradeDictTemp = upgradeDict[i];
            if (upgradeDictTemp.Purchased > 0){
                let additionPower = Math.ceil(upgradeDictTemp["BaseFactor"] * upgradeDictTemp.Purchased * (artifactBuffPercent[Inventory[itemID].Star] - 1));
                additionPower = Math.round(additionPower * additionalDefense);

                if (i !== 0) {saveValues["dps"] += additionPower} else {saveValues["clickFactor"] += additionPower}
                upgradeDict[i]["Contribution"] += additionPower;
                upgradeDict[i]["Factor"] = parseInt(upgradeDict[i]["Factor"]) + Math.ceil(additionPower / upgradeDictTemp.Purchased);

                if (i === 1 && upgradeDict[i]["Contribution"] >= 1e9) {challengeNotification(({category: 'specific', value: [2, 1]}))}

                refresh("hero", i);
            }
        }
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
        currencyPopUp("items", 0);
        sortList("table2");
    } else if (itemID === 4018) {
        inventoryDraw("xp", 2, 3);
        inventoryDraw("xp", 2, 3);
        inventoryDraw("xp", 3, 3);
        inventoryAdd(4010);
        inventoryAdd(4010);

        newPop(1);
        currencyPopUp("mail", 2, "items", 0);
        sortList("table2");
    // ELEMENT GEMS
    } else if (itemID === 5001 || itemID === 5002){
        let power = 1;
        if (Inventory[itemID].Star === 5) {
            power = 2;
        } else {
            power = 3;
        }

        for (let i = 0, len=WISHHEROMAX; i < len; i++) {
            if (upgradeDict[i] == undefined) continue;
            if (upgradeDict[i].Locked === true) continue;
            if (i < WISHHEROMIN && i > NONWISHHEROMAX) {
                i -= (WISHHEROMIN - NONWISHHEROMAX - 2);
                continue;
            };
            let upgradeDictTemp = upgradeDict[i];
            if (upgradeDictTemp.Purchased > 0){
                let additionPower = Math.ceil(upgradeDictTemp["BaseFactor"] * upgradeDictTemp.Purchased * (power - 1));
                additionPower = Math.round(additionPower * additionalDefense);

                if (i !== 0) {saveValues["dps"] += additionPower} else {saveValues["clickFactor"] += additionPower}
                upgradeDict[i]["Contribution"] += additionPower;
                upgradeDict[i]["Factor"] = parseInt(upgradeDict[i]["Factor"]) + Math.ceil(additionPower / upgradeDictTemp.Purchased);

                if (i === 1 && upgradeDict[i]["Contribution"] >= 1e9) {challengeNotification(({category: 'specific', value: [2, 1]}))}

                refresh("hero", i);
            }
        }

        clearTooltip();
        return;
    // ELEMENT GEMS
    } else if (itemID >= 5001 && itemID < 5050){
        let power = elementBuffPercent[Inventory[itemID].Star];
        let elem = Inventory[itemID].element;

        for (let i = 0, len=WISHHEROMAX; i < len; i++) {
            if (upgradeDict[i] == undefined) continue;
            if (upgradeDict[i].Locked === true) continue;
            if (i < WISHHEROMIN && i > NONWISHHEROMAX) {
                i -= (WISHHEROMIN - NONWISHHEROMAX - 2);
                continue;
            };
            if (upgradeDict[i].Purchased > 0) {
                if (upgradeInfo[i].Ele == elem || upgradeInfo[i].Ele == "Any") {
                    let upgradeDictTemp = upgradeDict[i];
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
        }
    // NATION BOOKS
    } else if (itemID >= 6001 && itemID < 6050){
        let power;
        let nation = Inventory[itemID].nation;
        power = nationBuffPercent[Inventory[itemID].Star]
        for (let i = 0, len=WISHHEROMAX; i < len; i++) {
            if (upgradeDict[i] == undefined) continue;
            if (upgradeDict[i].Locked === true) continue;
            if (i < WISHHEROMIN && i > NONWISHHEROMAX && i != 1) {
                i -= (WISHHEROMIN - NONWISHHEROMAX - 2);
                continue;
            };
            if (upgradeDict[i].Purchased > 0){
                if (upgradeInfo[i].Nation === nation || upgradeInfo[i].Nation == "Any") {
                    let upgradeDictTemp = upgradeDict[i];
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
        }
    }
    clearTooltip();
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
    let container = document.getElementById("app"+type);
    let foodCooldown = document.createElement("div");

    if (type == 1) {
        container.innerHTML = '';
        foodCooldown = countdownText(foodCooldown, 1);
        foodCooldown.addEventListener("animationend",() => {
            foodCooldown.remove();
            foodBuff = 1;
        })
        container.appendChild(foodCooldown);
    } else if (type =2) {
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
    if (type !== 10 && expeditionDict[type] != '1') {
        let wave = rollArray(JSON.parse(advType.split("-")[1]),0);
        if (saveValues["energy"] >= ADVENTURECOSTS[type <= 5 && type > 1 ? type : 0]) {
            adventureElement.load();
            adventureElement.play();
            saveValues["energy"] -= ADVENTURECOSTS[type <= 5 && type > 1  ? type : 0];
            updateMorale("add",(randomInteger(7,10) * -1));

            if (activeLeader == "Paimon" && type <= 5 && type > 1) {saveValues["energy"] += (ADVENTURECOSTS[type] * 0.15)}

            if (!persistentValues.tutorialBasic) {
                customTutorial("advTut", 6, ()=>{drawAdventure(type,wave)});
                persistentValues.tutorialBasic = true;
            } else if (type >= 3 && type < 6 && persistentValues.tutorialRanged != true) {
                customTutorial("rangTut", 2, ()=>{drawAdventure(type,wave)});
                persistentValues.tutorialRanged = true;
            } else {
                drawAdventure(type,wave);
            }
        } else {
            expedInfo("exped-9");
            weaselDecoy.load();
            weaselDecoy.play();
        }
    } else if (type === 10) {
        if (expeditionDict[5] != '1') {
            type = 5;
        } else if (expeditionDict[4] != '1') {
            type = 4;
        } else if (expeditionDict[3] != '1') {
            type = 3;
        } else {
            type = 2;
        }

        drawLoot(type);
        sortList("table2");
        newPop(1);
    } else if (expeditionDict[type] == '1'){
        console.error(`Invalid Expedition Type: ${type}`);
        return;  
    }
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
    let adventureArea = document.createElement("div");
    adventureArea.id = "adventure-area";
    adventureArea.style.zIndex = -1;
    adventureArea.classList.add("adventure-area","flex-column");

    let adventureVideo = document.createElement("div");
    adventureVideo.id = "adventure-video";
    adventureVideo.classList.add("adventure-video","flex-row");

    let adventureTextBox = document.createElement("div");
    adventureTextBox.id = "adventure-text";
    adventureTextBox.classList.add("adventure-text","flex-row");
    adventureTextBox.questNumber = null;

    let adventureTextBG = new Image();
    adventureTextBG.src = "./assets/expedbg/table.webp";
    let adventureHealth = document.createElement("div");
    adventureHealth.id = "adventure-health";
    adventureHealth.classList.add("flex-row");
    adventureHealth.style.opacity = 0;
    let adventureHealthbarDiv = document.createElement("div");
    adventureHealthbarDiv.id = "health-bar";
    
    adventureHealth.append(adventureHealthbarDiv);
    let adventureGif = new Image();
    adventureGif.id = "adventure-gif";
    adventureGif.classList.add('adventure-gif');
    adventureGif.src = "./assets/expedbg/exped-Nahida.webp";
    adventureVideo.append(adventureGif, adventureHealth);

    let adventureEncounter = document.createElement("div");
    adventureEncounter.id = "adventure-encounter";
    adventureEncounter.classList.add("flex-column");
    adventureEncounter.style.display = "flex";

    let adventureHeading = document.createElement("p");
    adventureHeading.id = "adventure-header";
    let adventureRewards = document.createElement("div");
    adventureRewards.classList.add("adventure-rewards","flex-row");
    adventureRewards.id = "adventure-rewards";
    let adventureChoiceOne = document.createElement("button");
    adventureChoiceOne.innerText = "Fight!";
    adventureChoiceOne.id = "adv-button-one";
    adventureChoiceOne.pressAllowed = false;
    // let adventureChoiceTwo = document.createElement("button");
    // adventureChoiceTwo.id = "adv-button-two";

    let adventureFight = document.createElement("div");
    adventureFight.id = "adventure-fight";
    adventureFight.classList.add("adventure-fight");
    adventureFight.style.display = "none";

    let fightTextbox = document.createElement("p");
    fightTextbox.classList.add("flex-column")
    fightTextbox.id = "fight-text";
    fightTextbox.innerText = "Prepare for a fight!";

    let adventureFightDodge = document.createElement("div");
    let adventureFightDodgeImg = new Image();
    adventureFightDodgeImg.src = "./assets/expedbg/battle1.webp";
    adventureFightDodge.append(adventureFightDodgeImg);

    adventureFightDodge.id = "battle-toggle";
    adventureFightDodge.addEventListener("click",()=>{
        dodgeOn("toggle",adventureFightDodge);
    })
    
    let adventureFightSkill = document.createElement("div");
    adventureFightSkill.id = "battle-skill";
    let adventureFightSkillImg = new Image();
    adventureFightSkillImg.src = "./assets/expedbg/battle2.webp";
    adventureFightSkill.append(adventureFightSkillImg);
    adventureFightSkill.addEventListener("click",()=>{
        skillUse();
    })

    let adventureFightBurst = document.createElement("div");
    let adventureFightBurstImg = new Image();
    adventureFightBurstImg.src = "./assets/expedbg/battle3.webp";
    adventureFightBurst.append(adventureFightBurstImg)
    adventureFightBurst.addEventListener("click",()=>{
        attackAll(adventureFightBurst);
    })

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
    })

    adventureFight.append(fightTextbox,adventureFightDodge,adventureFightSkill,adventureFightBurst);
    adventureFight.style.display = "none";
    const adventureFightChild = adventureFight.childNodes;
    const keyCodes = [0,"Q","W","E"];
    for (let i = 0; i < adventureFightChild.length; i++) {
        if (adventureFightChild[i].tagName === "DIV") {
            if (!MOBILE) {
                let keyImg = document.createElement("p");
                keyImg.innerText = keyCodes[i];
                adventureFightChild[i].appendChild(keyImg);
            }
        }
    }


    adventureChoiceOne.addEventListener("click",()=>{
        if (adventureChoiceOne.pressAllowed) {
            if (adventureChoiceOne.advType != 12) {
                adventureChoiceOne.pressAllowed = false;
                triggerFight();
                adventureEncounter.style.display = "none";
                adventureFight.style.display = "flex";
                adventureChoiceOne.style.display = "none";
            } else {
                if (!transitionScene.includes(adventureTextBox.questNumber)) {worldQuestDict.currentWorldQuest = adventureTextBox.questNumber}
                continueQuest(adventureTextBox.questNumber);
            }
        }
    })

    adventureEncounter.append(adventureHeading,adventureRewards,adventureChoiceOne);
    adventureTextBox.append(adventureTextBG,adventureEncounter,adventureFight)
    adventureArea.append(adventureVideo,adventureTextBox)
    mainBody.append(adventureArea);
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
        "gem": 5025,
        "talent": 6013,
    }
    let lowerInventoryType = {
        "weapon": 1001, 
        "artifact": 2001, 
        "food": 3001, 
        "xp": 4001,
        "gem": 5001,
        "talent": 6001,
    }
    let drawnItem = 0;
    while (true){
        attempts++;
        if (attempts >= 2000) {
            console.error(`Error drawing item with properties [${itemType},${type}${itemClass ? `,${itemClass}` : ','}]. Please inform the developer using the feedback form :)`);
            return;
        }

        drawnItem = randomInteger(lowerInventoryType[itemType], upperInventoryType[itemType]);
        if (Inventory[drawnItem] == undefined) {continue}
        if (Inventory[drawnItem].Star >= min && Inventory[drawnItem].Star < (max + 1)) {
            if (type === "shop") {
                return drawnItem;
            } else if (typeof type === 'string') {
                if (type.split("-")[0] === "adventure" || type === "Bonus" || type === "Bonus2"){
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
                            let randomEle = rollArray(itemClass,0);
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
                } else if (type === "itemLoot") {
                    let checkedProperty = "Type";
                    if (Inventory[drawnItem][checkedProperty] != itemClass) {
                        continue;
                    }
                    return drawnItem;
                } 
            } else {
                inventoryAdd(drawnItem);
            }
            break;
        } else {
            continue;
        }
    }
}

// CREATING EXPEDITION UI
function createExpedition() {
    let expedTable = document.createElement("div");
    expedTable.classList.add("flex-column","tooltipTABLEEXPED");
    let expedBottom = document.createElement("div");
    expedBottom.id = "exped-bottom";
    expedBottom.classList.add("flex-row","exped-bottom");
    let expedContainer = document.createElement("div");
    expedContainer.id = "exped-container";
    expedContainer.classList.add("exped-container","flex-row");

    let expedLoot = document.createElement("div");
    expedLoot.id = "exped-loot";
    expedLoot.classList.add("exped-loot","flex-column");
    let expedLore = document.createElement("div");
    expedLore.classList.add("exped-lore","flex-column");
    expedLore.id = "exped-lore";

    let expedImgDiv = document.createElement("div");
    let expedImg = new Image();
    expedImg.id = "exped-img";
    let expedText = document.createElement("div");
    expedText.id = "exped-text";
    expedText.classList.add("flex-row");
    expedImgDiv.classList.add("flex-row","exped-text");
    expedImgDiv.append(expedImg,expedText);

    expedBottom.append(expedContainer,expedLoot);
    expedTable.append(expedImgDiv,expedLore,expedBottom);
    expedTooltip.append(expedTable);
    table3.appendChild(expedTooltip);
    expedDiv.remove();

    let charMorale = document.createElement("div");
    charMorale.id = "char-morale";
    charMorale.classList.add("char-morale");
    let moraleLore = document.createElement("p");
    moraleLore.style.display = "none";
    charMorale.append(moraleLore);

    charMorale.addEventListener("click",()=>{
        universalStyleCheck(moraleLore,"display","block","none");
    })

    let guildTable = createGuild();
    let advButton = document.createElement("div");
    advButton.id = "adventure-button";
    advButton.classList.add("background-image-cover");
    advButton.innerText = "Adventure!"
    advButton.addEventListener("click",() => {
        if (adventureType != 0) {
            if (adventureType == "10-[]") {
                guildTable.toggle();
            } else if (adventureType.split("-")[0] === "12") {
                drawWorldQuest(adventureType);
            } else {
                adventure(adventureType);
            }
        }
    })

    let advTutorial = document.createElement("img");
    advTutorial.src = "./assets/icon/help.webp";
    advTutorial.id = "adventure-tutorial";
    advTutorial.addEventListener("click", () => {
        customTutorial("advTut",6)
    })
    table3.append(charMorale,advButton,advTutorial);
    updateMorale("load");
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

    if (morale > 80) {
        happinessNumber = 1;
    } else if (morale > 60) {
        happinessNumber = 2;
    } else if (morale > 30) {
        happinessNumber = 3;
    }

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
        universalStyleCheck(this,"display","flex","none");
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

    const bountyMenu = document.createElement("div");
    bountyMenu.classList.add("flex-row","bounty-menu");
    bountyMenu.id = "bounty-menu";
    buildBounty(bountyMenu);

    const rankMenu = document.createElement("div");
    rankMenu.classList.add("flex-column","rank-menu");
    const rankDiv = document.createElement("div");
    rankDiv.classList.add("flex-row","rank-div");
    rankDiv.activeLevel;
    const rankLore = document.createElement("div");
    rankLore.classList.add("rank-lore");
    rankLore.innerText = `Select a level to get more information!`;
    const rankClaim = document.createElement("button");
    rankClaim.classList.add("flex-row");

    rankMenu.append(rankDiv,rankLore,rankClaim)
    for (let i = 1; i < 21; i++) {
        let rankButton = document.createElement("div");
        rankButton.classList.add("rank-button","flex-column");
        rankButton.id = `rank-button-${i}`;
        let rankText = document.createElement("p");
        let rankImg = new Image();
        rankImg.src = "./assets/expedbg/rankImg.webp";
        rankText.innerText = i;
        rankButton.append(rankImg,rankText);

        if (advDict.adventureRank < i && advDict.rankDict[i].Locked == true) {
            let rankIco = new Image();
            rankIco.classList.add("rank-ico");
            rankIco.src = "./assets/icon/lock.webp";
            rankButton.append(rankIco);
        } else if (advDict.rankDict[i].Locked == false) {
            let rankIco = new Image();
            rankIco.classList.add("rank-ico");
            rankIco.src = "./assets/icon/tick.webp";
            rankButton.append(rankIco);
        } else {
            advDict.rankDict[i].Locked = "unclaimed";
            notifPop("add","rank",i);
        }
        
        rankButton.addEventListener("click",()=>{
            rankLore.innerHTML = "";
            if (advInfo[i].Item.length > 0) {
                for (let j = 0; j < advInfo[i].Item.length; j++) {
                    let rankInventoryRewards = document.createElement("div");
                    rankInventoryRewards = inventoryFrame(rankInventoryRewards,Inventory[advInfo[i].Item[j]],itemFrameColors);
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
            if (advDict.rankDict[i].Locked == true) {
                rankClaim.innerText = "Locked";
                rankClaim.available = false;
                rankClaim.classList.add("rank-button-claimed");
                if (rankClaim.classList.contains("rank-button-available")) {rankClaim.classList.remove("rank-button-available")}
            } else if (advDict.rankDict[i].Locked == false) {
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
            advDict.rankDict[level].Locked = false;

            
            let itemArray = advInfo[level].Item;
            if (itemArray.length > 0) {
                for (let i = 0; i < itemArray.length; i++) {
                    inventoryAdd(itemArray[i]);
                }
                newPop(1);
                currencyPopUp("items");
            }
            sortList("table2");

            let rankButton = document.getElementById(`rank-button-${level}`);
            let rankIco = new Image();
            rankIco.classList.add("rank-ico");
            rankIco.src = "./assets/icon/tick.webp";
            rankButton.append(rankIco);
            notifPop("clear","rank",level);
        }
    })

    const commisionMenu = document.createElement("div");
    commisionMenu.id = 'commision-menu';
    if (!beta) commisionMenu.innerText = '??? \n In Development. Stay Tuned!';
    if (beta) {
        commisionMenu.classList.add('commision-menu', 'flex-column');

        const commisionList = document.createElement('div');
        commisionList.id = 'commision-list'
        commisionList.classList.add('commision-list');

        if (saveValues.baseCommisions.length === 0) {
            generateCommisions();
        }

        const selectComission = document.createElement('div');
        selectComission.classList.add('flex-column');
        selectComission.style.display = 'none';
        selectComission.id = 'select-comission';
        const commissionSetting = document.createElement('div');
        commissionSetting.classList.add('commision-setting', 'flex-row');

        const commTitle = document.createElement('p');
        const commItems = createDom('div', {
            classList: ['select-commision-items', 'flex-column'],
            id: 'select-comm-items'
        })
        const commRewards = document.createElement('div');
        const commStars = document.createElement('img');
        commItems.append(commRewards, commStars)

        const commHeroes = document.createElement('div');
        commHeroes.classList.add('comm-heroes');
        const textArray = ['Leader', 'Support', 'Boon'];
        textArray.forEach((text) => {
            let barText = document.createElement('p');
            barText.innerText = text
            commHeroes.append(barText);
        })

        const heroContainer = createDom('div', {
            hero: null,
            id: 'select-hero-leader',
            style:{ background: 'url(./assets/icon/charPlus.webp) no-repeat center center/contain' }
        });

        const suppContainer = createDom('div', {
            hero: null,
            id: 'select-hero-support',
            style:{ background: 'url(./assets/icon/charPlus.webp) no-repeat center center/contain' }
        });

        heroContainer.addEventListener('click',() => {
            selectHeroType = 'leader';
            heroContainer.style.animation = 'tallyCount 0.5s ease-in-out infinite both';
            suppContainer.style.animation = 'unset';
            suppContainer.offsetWidth;
        });

        suppContainer.addEventListener('click',() => {
            selectHeroType = 'support';
            suppContainer.style.animation = 'tallyCount 0.5s ease-in-out infinite both';
            heroContainer.style.animation = 'unset';
            heroContainer.offsetWidth;
        });
        
        const perkText = document.createElement('p');
        perkText.id = 'comm-perk-test';
        perkText.innerText = 'None Curently';
        
        commHeroes.append(heroContainer, suppContainer, perkText);
        commissionSetting.append(commTitle, commItems, commHeroes);

        const commissionChar = document.createElement('div');
        commissionChar.id = 'commission-char';
        commissionChar.classList.add('commision-char');
        selectComission.append(commissionSetting, commissionChar);

        const currentCommisions = document.createElement('div');
        currentCommisions.classList.add('current-commision', 'flex-row');

        for (let i = 0; i < 3; i++) {
            const currentCommisionsCell = createDom('div', {
                id: `commision-cell-${i}`,
                class: ['current-commision-cell', 'flex-row'],
                style: { display: 'flex' },
            });

            const currentCommisionsLeader = document.createElement('img');
            const currentCommisionsSupport = document.createElement('img');
            const currentCommisionsTime = createDom('button', { class:['current-commision-button'] });

            currentCommisionsTime.ready = false;
            currentCommisionsTime.addEventListener('click', () => {
                if (currentCommisionsTime.ready === true) {
                    currentCommisionsTime.ready = false;
                    currentCommisionsLeader.style.display = 'none';
                    currentCommisionsSupport.style.display = 'none';
                    currentCommisionsTime.innerText = 'Available';
                    if (currentCommisionsTime.classList.contains('rank-button-available')) currentCommisionsTime.classList.remove('rank-button-available');

                    const commId = currentCommisionsTime.commId.split('/');
                    let commInfo;
                    
                    if (commId[1].includes('base')) {
                        saveValues.currentCommisions.splice(saveValues.currentCommisions.indexOf(commId[1]), 1)
                        commInfo = saveValues.baseCommisions[commId[1].split('-')[1]]
                    }

                    for (let key in saveValues.commisionDict) {
                        if (saveValues.commisionDict[key].currentComm === commId[1]) {
                            saveValues.commisionDict[key].currentComm = '';
                        }
                    }

                    const lootContainer = createDom('div', { class:['notif-item'] });
                    let lootArray = [];
                    let markedItems = [];
                    let extraInfo = [];

                    let upgradeItem = null;
                    if (commInfo.perk === 'Keen-Eyed') {
                        upgradeItem = rollArray(commInfo.possibleItems);
                    }

                    commInfo.possibleItems.forEach((item) => {
                        let itemType;
                        let minLevel = commInfo.rating - 2;
                        let maxLevel = commInfo.rating;
                        let specialType = null;

                        if (Object.keys(constNation).includes(item)) {
                            itemType = 'talent';
                            minLevel = Math.min(minLevel, 2);
                            maxLevel = Math.max(minLevel, 4);
                        } else if (item === "PyroHydro" || item === "DendroGeoAnemo" || item === "ElectroCryo") {
                            itemType = 'gem';
                            minLevel = Math.min(minLevel, 3);
                        } else if (['bow', 'catalyst', 'claymore', 'polearm', 'sword'].includes(item.toLowerCase())) {
                            itemType = 'weapon';
                            specialType = item.charAt(0).toUpperCase() + item.slice(1);
                        } else {
                            itemType = item;
                        }

                        let itemId1 = specialType ? inventoryDraw(itemType, minLevel, maxLevel, 'itemLoot', specialType) : inventoryDraw(itemType, minLevel, maxLevel, 'shop');
                        const itemId2 = specialType ? inventoryDraw(itemType, minLevel, maxLevel, 'itemLoot', specialType) : inventoryDraw(itemType, minLevel, maxLevel, 'shop');

                        let lossRoll = randomInteger(1, 15);
                        // SYNC AND ANTI-SYNC
                        if ((commInfo.char[0] === 'Nahida' || commInfo.char[1] === 'Nahida') && randomInteger(1, 5) === 1) {
                            const itemId1 = specialType ? inventoryDraw(itemType, minLevel, maxLevel, 'itemLoot', specialType) : inventoryDraw(itemType, minLevel, maxLevel, 'shop');
                            lootArray.push(itemId1);
                            markedItems.push(itemId1);
                            extraInfo.push('Sync');
                        } else if (commInfo.char[1] === 'Wanderer' || commInfo.char[0] === 'Wanderer') {
                            lossRoll -= 5;
                            extraInfo.push('Anti-Sync');
                        } else if (commisionInfo[commInfo.char[0]].charLikes.includes(commInfo.char[1]) && randomInteger(1, 5) === 1) {
                            const itemId1 = specialType ? inventoryDraw(itemType, minLevel, maxLevel, 'itemLoot', specialType) : inventoryDraw(itemType, minLevel, maxLevel, 'shop');
                            lootArray.push(itemId1);
                            markedItems.push(itemId1);
                            extraInfo.push('Sync');
                        } else if (commisionInfo[commInfo.char[0]].charDislikes.includes(commInfo.char[1])) {
                            lossRoll -= 5;
                            extraInfo.push('Anti-Sync');
                        }

                        if (lossRoll < 3) {
                            if (commInfo.perk === 'Toughness') {
                                lossRoll = false;
                                extraInfo.push('Toughness');
                            } else {
                                lossRoll = true;
                                extraInfo.push('Loss');
                            }
                        } else {
                            lossRoll = false;
                        }

                        
                        if (!lossRoll) {
                            lootArray.push(itemId2);
                        }

                        // LOSS ROLL
                        if (randomInteger(1,3) === 1 && !lossRoll) {
                            const itemId3 = specialType ? inventoryDraw(itemType, minLevel, maxLevel, 'itemLoot', specialType) : inventoryDraw(itemType, minLevel, maxLevel, 'shop');
                            lootArray.push(itemId3);
                        }

                        // KEEN-EYED PERK
                        if (upgradeItem !== null && upgradeItem == item) {
                            itemId1 = specialType ? inventoryDraw(itemType, Math.min(minLevel + 2, 5), maxLevel, 'itemLoot', specialType) : inventoryDraw(itemType, Math.min(minLevel + 2, 5), maxLevel, 'shop');
                            markedItems.push(itemId1);
                            extraInfo.push('Keen-Eyed');
                        }
                        
                        if (commInfo.perk === 'Proficient') {
                            if (commInfo.priority === item) {
                                const itemIdPro1 = specialType ? inventoryDraw(itemType, minLevel, maxLevel, 'itemLoot', specialType) : inventoryDraw(itemType, minLevel, maxLevel, 'shop');
                                const itemIdPro2 = specialType ? inventoryDraw(itemType, minLevel, maxLevel, 'itemLoot', specialType) : inventoryDraw(itemType, minLevel, maxLevel, 'shop');
                                
                                markedItems.push(itemIdPro1);
                                markedItems.push(itemIdPro2);
                                lootArray.push(itemIdPro1);
                                lootArray.push(itemIdPro2);
                                lootArray.push(itemId1);

                                extraInfo.push('Proficient');
                            }
                        } else {
                            lootArray.push(itemId1);
                        }

                        // SCAVENGER PERK
                        if (commInfo.perk === 'Scavenger' && randomInteger(1,4) === 1) {
                            const itemId4 = specialType ? inventoryDraw(itemType, minLevel, maxLevel, 'itemLoot', specialType) : inventoryDraw(itemType, minLevel, maxLevel, 'shop');
                            lootArray.push(itemId4);
                            markedItems.push(itemId4);
                            extraInfo.push('Scavenger');
                        }
                    });

                    const postTreeItems = compareTreeItems(lootArray);
                    lootArray = [];
                    for (let key in postTreeItems) {
                        const itemFrame = inventoryFrame(document.createElement("div"), Inventory[postTreeItems[key][0]],itemFrameColors);

                        if (postTreeItems[key][1]) {
                            itemFrame.classList.add('extra-item-tree');
                        } else if (markedItems.includes(postTreeItems[key][0])) {
                            markedItems.splice(markedItems.indexOf(postTreeItems[key][0]), 1);
                            itemFrame.classList.add('extra-item');
                        }
                        
                        lootArray.push(postTreeItems[key][0])
                        lootContainer.append(itemFrame);
                    }

                    const lootText = createDom('p', {
                        style: {
                            color: 'var(--dull-green)',
                            marginBottom: '1em'
                        }
                    });

                    for (let text in extraInfoDict) {
                        if (extraInfo.includes(text)) {
                            lootText.innerText = `${extraInfoDict[text]}\n`
                        }
                    }

                    const lootDiv = createDom('div', {
                        class: ['flex-column'],
                        children: [lootContainer, lootText],
                        style: {
                            width: '100%'
                        }
                    })


                    const addLoot = (lootArray) => {
                        lootArray.forEach((item) => {
                            inventoryAdd(item);
                        });

                        newPop(1);
                        sortList("table2");
                        saveValues.baseCommisions[commId[1].split('-')[1]].progress = true;
                        notifPop("clear","comm",commId[1]);
                    }

                    persistentValues.commissionsCompletedValue++;
                    choiceBox(mainBody, {text: 'Loot obtained:'}, stopSpawnEvents, () => {addLoot(lootArray)}, null, lootDiv, ['notif-ele']);
                    document.getElementById('guild-button-comm').click();
                }
            })

            currentCommisionsCell.leader = currentCommisionsLeader;
            currentCommisionsCell.support = currentCommisionsSupport;
            currentCommisionsCell.time = currentCommisionsTime;
            
            currentCommisionsCell.append(currentCommisionsLeader, currentCommisionsSupport, currentCommisionsTime);
            currentCommisions.appendChild(currentCommisionsCell);
        }

        const currentCommisionsBack = createDom('button', { class:['commision-footer', 'flex-column'], innerText: 'Back', style: { display:'none' }})
        currentCommisionsBack.addEventListener('click', () => {focusNewComm(true, null)});
        const enterCommision = createDom('button', { class:['commision-footer', 'flex-column'], innerText: 'Confirm!', style: { display:'none' }})
        enterCommision.addEventListener('click', () => {enterNewComm()});
        const commFeedback = createDom('p', {class:['commision-footer', 'flex-column'], style: { display:'none' }, id:'comm-feedback', chosenComm: null})

        currentCommisions.append(currentCommisionsBack, commFeedback, enterCommision);
        commisionMenu.append(commisionList, selectComission, currentCommisions);
    }

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

            if (i === 2) {focusNewComm(true, null)}
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

    if (beta) {showCommisions()};
    return guildTable;
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
                let starImg = new Image();
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
                let markImg = new Image();
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
                let starImg = new Image();
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
    
            bountyObject[bountyPath] = {primoReward: (5 * (2**i)), xpReward: (10 * (i**2)), Completed: false, Level: i};
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

    if (!advDict.rankDict[11].Locked) {
        claim.xpReward *= 1.15;
        claim.primoReward *= 1.15;
    } else if (!advDict.rankDict[3].Locked) {
        claim.xpReward *= 1.05;
        claim.primoReward *= 1.05;
    }

    claim.addEventListener("click",()=>{
        notifPop("clear","bounty",bountyID);
        currencyPopUp("primogem",Math.round(claim.primoReward));
        gainXP(Math.round(claim.xpReward));
        bountyObject[bountyID].Completed = "claimed";
        claim.remove();

        let markImg = new Image();
        markImg.src = "./assets/expedbg/bountyDone.webp"
        button.appendChild(markImg);

        for (let key in advDict.bounty) {
            if (advDict.bounty[key].Completed !== true) {return}
        }
        challengeNotification(({category: 'specific', value: [1, 7]}));
    })

    button.appendChild(claim);
}

function showCommisions() {
    const commisionList = document.getElementById('commision-list');
    while (commisionList.firstChild) {
        commisionList.firstChild.remove();
    }

    saveValues.baseCommisions.forEach((item) => {
        if (item.progress == false) {
            const newCommisionsCell = createDom('div', { class:['commision-cell', 'flex-row'], style:{ display: 'flex' }})
            newCommisionsCell.addEventListener('click',() => {focusNewComm(false, item)})

            if (saveValues.currentCommisions[0] != undefined && saveValues.currentCommisions[1] != undefined && saveValues.currentCommisions[2] != undefined) {
                newCommisionsCell.classList.add('dim-filter');
            };

            const commText = createDom('div', { class:['flex-column', 'commision-text']});
            const commTitle = document.createElement('p');

            commTitle.innerText = item.title;
            const newCommisionsTime = document.createElement('p');
            newCommisionsTime.innerText = convertTo24HourFormat(item.duration);

            const commItems = document.createElement('div');
            commItems.classList.add('commision-items', 'flex-row');
            
            item.possibleItems.forEach((reward) => {
                let itemPic = new Image();
                itemPic.src = `./assets/expedbg/loot/${reward}.webp`;
                commItems.appendChild(itemPic);
            })

            const commLevel = document.createElement('p');
            commLevel.innerText = `Rank ${item.rank}`;
            const itemStar = new Image();
            itemStar.src = `./assets/frames/star-${item.rating}.webp`;

            commText.append(commTitle, newCommisionsTime);
            newCommisionsCell.append(commLevel, commText, commItems, itemStar);
            commisionList.appendChild(newCommisionsCell);
        }
    });

    if (commisionList.children.length < 3) {
        generateCommisions();
    }

    for (let i = 0; i < 3; i++) {
        let commCell = document.getElementById(`commision-cell-${i}`);
        if (saveValues.currentCommisions[i] != undefined) {
            let commId = saveValues.currentCommisions[i];
            if (commId.split('-')[0] === 'base') {
                let commInfo = saveValues.baseCommisions[commId.split('-')[1]];

                commCell.leader.style.display = 'flex';
                commCell.leader.src = `./assets/tooltips/emoji/${commInfo.char[0]}.webp`;
                commCell.support.style.display = 'flex';
                commCell.support.src = `./assets/tooltips/emoji/${commInfo.char[1]}.webp`;

                let timeLeft = (commInfo.endTime - getTime()) / 60;
                let ready = timeLeft <= 0;
                commCell.time.ready = ready;
                commCell.time.commId = `commision-cell-${i}/${commId}`;
                commCell.time.innerText = ready ? 'Done!' : convertTo24HourFormat(timeLeft);

                if (ready) {
                    if (!commCell.time.classList.contains('rank-button-available')) commCell.time.classList.add('rank-button-available');
                } else {
                    if (commCell.time.classList.contains('rank-button-available')) commCell.time.classList.remove('rank-button-available');
                }
            }
        } else {
            commCell.leader.style.display = 'none'
            commCell.support.style.display = 'none'
            commCell.time.innerText = 'Available';
            commCell.time.ready = false;
            commCell.time.commId = null;
            if (commCell.time.classList.contains('rank-button-available')) commCell.time.classList.remove('rank-button-available');
        }
    }
}

function focusNewComm(forceShowComm, item) {
    const commisionList = document.getElementById('commision-list');
    const selectComission = document.getElementById('select-comission');
    const commissionChar = document.getElementById('commission-char');
    while (commissionChar.firstChild) {
        commissionChar.firstChild.remove();
    }
    
    const selectComissionChildren = selectComission.firstChild.children;
    while (selectComissionChildren[1].firstChild.firstChild) {
        selectComissionChildren[1].firstChild.firstChild.remove();
    }

    const commisionMenu = document.getElementById('commision-menu');
    let currentCommArray = commisionMenu.querySelectorAll('.current-commision-cell');
    let footerCommArray = commisionMenu.querySelectorAll('.commision-footer');
    const footFeedback = document.getElementById('comm-feedback');
    footFeedback.innerText = '';

    if (forceShowComm) {
        footFeedback.chosenComm = null;
        selectComission.style.display = 'none';
        showCommisions();
        commisionList.style.display = 'grid';

        currentCommArray.forEach((commItem) => {
            commItem.style.display = 'flex';
        })
        footerCommArray.forEach((commItem) => {
            commItem.style.display = 'none';
        })
    } else {
        if (saveValues.currentCommisions[0] != undefined && saveValues.currentCommisions[1] != undefined && saveValues.currentCommisions[2] != undefined) {return};
        footFeedback.chosenComm = item;
        commisionList.style.display = 'none';
        selectComission.style.display = 'flex';
        selectComissionChildren[0].innerHTML = `[Rank: ${item.rank}]
                                                <hr style="height:10px; visibility:hidden;" />${item.title}
                                                <br>${convertTo24HourFormat(item.duration)}`;

        selectComissionChildren[1].lastChild.src = `./assets/frames/star-${item.rating}.webp`;
        item.possibleItems.forEach((reward) => {
            let itemPic = new Image();
            itemPic.src = `./assets/expedbg/loot/${reward}.webp`;
            itemPic.name = reward;
            selectComissionChildren[1].firstChild.appendChild(itemPic);
        })

        const commisionKeys = Object.keys(saveValues.commisionDict)
        for (let key in upgradeInfo) {
            const name = upgradeInfo[key].Name;
            if (commisionKeys.includes(name) && upgradeDict[key].Purchased >= 1) {
                if (saveValues.commisionDict[name].currentComm !== '') {continue}

                const charButton = createDom('button', { class:['flex-row','commision-button'] });
                charButton.addEventListener('click', () => {selectCommHero(name)})

                let charLeft = createDom('div', { class:['commision-picture', 'flex-row'] });
                let charImg = createDom('img', { src: `./assets/tooltips/emoji/${name}.webp`});

                let charText = createDom('p');
                charText.innerHTML = `${name}<br><br> Boon: ${commisionInfo[name].perk}`

                charLeft.append(charImg);
                charButton.append(charLeft, charText);
                commissionChar.append(charButton);
            }
        }

        currentCommArray.forEach((commItem) => {
            commItem.style.display = 'none';
        });
        footerCommArray.forEach((commItem) => {
            commItem.style.display = 'flex';
        });
    }
}

function selectCommHero(name) {
    if (selectHeroType !== null) {
        const heroLeader = document.getElementById(`select-hero-leader`);
        const heroSupp = document.getElementById(`select-hero-support`);
        const perkText = document.getElementById('comm-perk-test');

        const comparison = selectHeroType === 'leader' ? heroSupp : heroLeader;
        const antiComparison = selectHeroType === 'leader' ? heroLeader : heroSupp;

        if (comparison.hero === name) {
            comparison.style.background = `url(./assets/icon/charPlus.webp) no-repeat center center/contain`;
            comparison.hero = null;
        }

        antiComparison.style.background = `url(./assets/tooltips/emoji/${name}.webp) no-repeat center center/contain`;
        antiComparison.style.animation = 'unset';
        antiComparison.hero = name;
        antiComparison.offsetWidth;

        if (heroLeader.hero) {
            let currentPerk = commisionInfo[heroLeader.hero].perk;
            perkText.innerText = commisionInfo[currentPerk];
        } else {
            perkText.innerText = 'None Curently';
        }
        selectHeroType = null;
    }
}

function enterNewComm() {
    const heroLeader = document.getElementById(`select-hero-leader`);
    const heroSupp = document.getElementById(`select-hero-support`);
    const perkText = document.getElementById('comm-perk-test');
    const footFeedback = document.getElementById('comm-feedback');

    if (!heroLeader.hero) {
        footFeedback.innerText = 'Please select a leader';
        return;
    } else if (!heroSupp.hero) {
        footFeedback.innerText = 'Please select a support';
        return;
    } else if (!footFeedback.chosenComm) {
        return;
    }

    const commId = footFeedback.chosenComm.id;
    const id = commId.split('-')[1];

    saveValues.baseCommisions[id].progress = 'ongoing';
    saveValues.baseCommisions[id].endTime = getTime() + saveValues.baseCommisions[id].duration * 60 * (commisionInfo[heroLeader.hero].perk === 'Lightweight' ? 0.85 : 1)
    saveValues.baseCommisions[id].char = [heroLeader.hero, heroSupp.hero];
    saveValues.baseCommisions[id].perk = commisionInfo[heroLeader.hero].perk;
    saveValues.baseCommisions[id].priority = null;

    saveValues.commisionDict[heroLeader.hero].currentComm = commId;
    saveValues.commisionDict[heroSupp.hero].currentComm = commId;
    saveValues.currentCommisions.push(commId);

    if (commisionInfo[heroLeader.hero].perk === 'C') {
        const commItems = document.getElementById('select-comm-items').firstChild;
        const pickItems = commItems.cloneNode(true);
        pickItems.id = 'pick-items';

        choiceBox(mainBody, {text: 'Pick one to prioritize:'}, stopSpawnEvents, (value) => {saveValues.baseCommisions[id].priority = value}, null, pickItems, ['notif-ele', 'pick-items']);
    }

    heroLeader.style.background = `url(./assets/icon/charPlus.webp) no-repeat center center/contain`;
    heroLeader.style.animation = 'unset';
    heroLeader.hero = null;
    heroLeader.offsetWidth;

    heroSupp.style.background = `url(./assets/icon/charPlus.webp) no-repeat center center/contain`;
    heroSupp.style.animation = 'unset';
    heroSupp.hero = null;
    heroSupp.offsetWidth;

    perkText.innerText = 'None Curently';
    focusNewComm(true, null);
}


function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex != 0) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}
  
function generateCommisions() {
    const baseCommisions = [];
    let textArray = [];

    // CHECKS IF THERE ARE CURRENT COMMISSIONS
    let currentCommisionsDict = {}
    if (saveValues.baseCommisions.length > 1) {
        for (let i = 0; i < saveValues.baseCommisions.length; i++) {
            if (saveValues.baseCommisions[i].progress === 'ongoing') {
                currentCommisionsDict[i] = saveValues.baseCommisions[i];
            }
        }
    }

    for (let i = 0; i < 10; i++) {
        if (currentCommisionsDict[i] !== undefined) {
            baseCommisions.push(saveValues.baseCommisions[i])
            continue;
        }

        let text = '';
        while (textArray.includes(text) || text === '') {
            text = rollArray(commisionText, 0);
        }
        textArray.push(text);

        let rating = Math.floor(i / 3) + 3;
        let shuffledItems = shuffle(possibleItems);
        let possibleCommItems = [shuffledItems[0], shuffledItems[1]];
        let extraItem = randomInteger(0,2);
        if (extraItem === 1) {possibleCommItems.push(shuffledItems[2])}

        baseCommisions.push({
            title: text,
            rating: Math.min(rating, 5),
            rank: 5 + rating * 2 + extraItem * 2 + randomInteger(0,2),
            duration: (Math.round(randomInteger(2, 6) / 2 * 10) / 10),
            possibleItems: possibleCommItems,
            priority: null,
            char: [],
            id: `base-${i}`,
            progress: false,
            endTime: null,
        })
    }

    saveValues.baseCommisions = baseCommisions;
}

function checkCommisions() {
    if (saveValues.currentCommisions && saveValues.currentCommisions.length > 0) {
        saveValues.currentCommisions.forEach((item) => {
            if (item.split('-')[0] === 'base') {
                const baseId = item.split('-')[1];
                const timeLeft = saveValues.baseCommisions[baseId].endTime - getTime();
                if (timeLeft <= 0) {
                    notifPop("add","comm", item);
                }
            }
        })
    }
}

function clearExped() {
    let guildTable = document.getElementById("guild-table");
    guildTable.close();

    if (adventureType != 0) {
        let id = "exped-" + adventureType;
        let old_exped = document.getElementById(id);
        if (!old_exped) {return}
        if (old_exped.classList.contains("expedition-selected")) {
            old_exped.classList.remove("expedition-selected");
        }
        adventureType = 0;
        expedInfo("exped-7");
        let advButton = document.getElementById("adventure-button");
            if (advButton.classList.contains("expedition-selected")) {
                advButton.classList.remove("expedition-selected");
        }
    }
}

const recommendedLevel = [0,1,4,7,10,13,16,20];
function expedInfo(butId) {
    let expedRow1 = document.getElementById("exped-text");
    let expedRow2 = document.getElementById("exped-lore");
    let expedBottom = document.getElementById("exped-bottom");

    let level = butId.split("-")[1];
    let id = butId.split("-")[2];

    if (expeditionDict[level] == 0 || level == 7) {
        let advButton = document.getElementById("adventure-button");
        if (!advButton.classList.contains("expedition-selected")) {
            advButton.classList.add("expedition-selected");
        }
        expedRow1.innerHTML = `<p>${expeditionDictInfo[level]["Text"]}</p>`;

        let textHTML = expeditionDictInfo[level]["Lore"];

        if (level == 7) {
            if (saveValues.goldenTutorial === false) {
                textHTML = 'Current Objective: Obtain a Golden Nut [Expedition]';
            } else if (persistentValues.tutorialAscend === false) {
                textHTML = 'Current Objective: Get a lot of Golden Cores [Transcend]';
            } else if (persistentValues.finaleBossDefeat === false) {
                textHTML = 'Current Objective: Stop the Leyline Outbreak [Trees]';
            } else if (persistentValues.allChallenges === false) {
                textHTML = 'Current Objective: Complete all Challenges [5 Tiers]';
            } else {
                textHTML = 'Current Objective: All done!';
            }
        }
        
        expedRow2.innerHTML = textHTML;
    } else if (level >= 8 && level <= 11) {
        expedRow1.innerHTML =  `<p>${expeditionDictInfo[level]["Text"]}</p>`;
        expedRow2.innerHTML = expeditionDictInfo[level]["Lore"];
    } else {
        expedRow1.innerHTML = `<p>${expeditionDictInfo[6]["Text"]}</p>`;
        expedRow2.innerHTML = expeditionDictInfo[6]["Lore"];
    }

    let enemyInfo = document.getElementById("exped-container");
    let lootInfo = document.getElementById("exped-loot");
    let expedImg = document.getElementById("exped-img");
    if (enemyInfo.currentWave != id) {
        while (enemyInfo.firstChild) {
            enemyInfo.removeChild(enemyInfo.firstChild);
        }
        lootInfo.innerText = "";
    } 

    if ((level < 6 && level > 0) || level >= 13) {
        expedRow1.innerHTML += `<img class="icon primogem" src="./assets/icon/energyIcon.webp"></img>`;
        let heads = imgKey[id].Heads;
        for (let j = 0; j < heads.length; j++) {
            let img = new Image();
            img.classList.add("enemy-head");
            img.src = `./assets/expedbg/heads/${heads[j]}.webp`;
            enemyInfo.appendChild(img);
        }

        let lootHTML = `<span style='font-size:1.2em'>Recommended Rank: ${recommendedLevel[level >= 13 ? (level - 7) : level]}</span>  <br> Max Potential Rewards: <br> [container]`;
        let lootTable = imgKey[id].Loot;
        let invDiv = document.createElement("div");
        invDiv.classList.add("inv-div","flex-row");
        invDiv.activeInfo = null;
        invDiv.activeImg = null;
        for (let key in lootTable) {
            let lootDiv = document.createElement("div");
            lootDiv.classList.add('flex-column');
            let img = new Image();
            img.src = `./assets/expedbg/loot/${key}.webp`;
            img.addEventListener("click",()=>{
                let popUpLoot = document.createElement("div");
                popUpLoot.classList.add("flex-column",'pop-up-loot');
                popUpLoot.innerText = lootTable[key][1];

                if (invDiv.activeInfo != null) {
                    if (invDiv.activeInfo.outerHTML == popUpLoot.outerHTML) {
                        invDiv.activeInfo.remove();
                        invDiv.activeInfo = null;
    
                        invDiv.activeImg.style.filter = "none";
                        invDiv.activeImg = null;
                        return;
                    } else {
                        invDiv.activeImg.style.filter = "none";
                        invDiv.activeInfo.remove();
                    }
                }

                img.style.filter = "brightness(0.1)";
                invDiv.activeImg = img;
                lootDiv.appendChild(popUpLoot);
                invDiv.activeInfo = popUpLoot;
            })
            let star = new Image();
            star.src = `./assets/frames/star-${lootTable[key][0]}.webp`;

            lootDiv.append(star, img);
            invDiv.appendChild(lootDiv);
        }

        lootHTML = lootHTML.replace('[container]','');
        lootInfo.innerHTML = `${lootHTML}`;
        lootInfo.appendChild(invDiv)

        expedImg.src = `./assets/expedbg/header/${id}.webp`;
        expedRow2.style.borderBottom = "0.2em solid #8B857C";
        enemyInfo.style.borderRight = "0.2em solid #8B857C";
        expedBottom.style.display = "flex";
    } else if (level == 10) {
        expedImg.src = `./assets/expedbg/header/1.webp`;
        expedRow2.style.borderBottom = "none";
        enemyInfo.style.borderRight = "none";
        expedBottom.style.display = "none";
    } else {
        expedImg.src = `./assets/expedbg/header/0.webp`;
        expedRow2.style.borderBottom = "none";
        enemyInfo.style.borderRight = "none";
        expedBottom.style.display = "none";
    }
    enemyInfo.currentWave = id;
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
    notifSelect.classList.add("flex-column","notif-select");
    
    let charMenu = document.createElement("div");
    let activeChar;
    charMenu.classList.add("flex-column","char-menu");
    charMenu.style.display = "none";
    for (let k = 0; k < 5; k++) {
        let charImg = new Image();
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
    
        charDiv.addEventListener("click",()=>{
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

    let dragIcon = new Image();
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

    if (isNaN(settingsValues.defaultZoom)) {settingsValues.defaultZoom = 25}
    mapZoom.value = settingsValues.defaultZoom;

    advImageDiv.append(advImage,dragIcon,charSelect,notifSelect,expedMesgDiv,charMenu,expedXP,mapZoom);
    leftDiv.appendChild(advImageDiv);

    let mapInstance = Panzoom(advImage, {
        canvas: true,
        zoomSpeed: 1,
    })

    let zoomValue = 0.3 + (2/100) * settingsValues.defaultZoom;
    mapInstance.zoom(zoomValue);

    let img = new Image();
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
            mapPin.style.transform = `scale(${Math.min(1 / zoomValue * (MOBILE ? 1.5 : 1), 4)})`;
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

function gainXP(xpAmount,multiplier) {
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
    let xpBar = document.getElementById('exped-xp-bar');
    xpBar.maxXP = advDict.adventureRank * 100;
    let morale = advDict.morale;

    if (morale > 80) {
        xpAmount *= 1.10;
    } else if (morale > 60) {
        xpAmount *= 1.05;
    } else if (morale <= 30) {
        xpAmount *= 0.85;
    }

    xpAmount = Math.round(xpAmount)
    xpBar.currentXP = parseInt(xpBar.currentXP);
    xpBar.currentXP += xpAmount;
    expedPop("xp",xpAmount);

    while (xpBar.currentXP >= xpBar.maxXP) {
        xpBar.currentXP -= xpBar.maxXP;
        advDict.advXP = xpBar.currentXP;
    
        if (advDict.adventureRank >= 20) {
            advDict.adventureRank = 20;
            break;
        }
    
        advDict.adventureRank++;
        advDict.rankDict[advDict.adventureRank].Locked = "unclaimed";
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
        let notifImg = new Image();
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
            notifText.innerText = "Commision \n Complete";
            notifSelect.questArray.push(count);
        } else if (icon === "boss") {
            notifImg.src = "./assets/expedbg/adv-14.webp";
            notifText.innerText = "Boss \n Battle";
            notifSelect.questArray.push(count);
        }

        if (guildButton.includes(icon)) {
            notifDiv.addEventListener('click',()=>{
                let guildTable = document.getElementById("guild-table");
                guildTable.open();
                document.getElementById(`guild-button-${icon}`).click();
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
    for (let i = 2; i < 5; i++) {
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
                        expedInfo("exped-7");
                        let advButton = document.getElementById("adventure-button");
                        if (advButton.classList.contains("expedition-selected")) {
                            advButton.classList.remove("expedition-selected");
                        }
                    } else {
                        clearExped();
                        adventureType = `${button.level}-[${button.wave}]`;
                        expedInfo(`exped-${button.level}-${j+1}`);
                    }  
                })
            }
        }
    }
}

// ADVENTURE PROCESS
const adventurePreload = new Preload();
const adventureWorker = new Worker('./modules/workers.js');
function drawAdventure(advType, wave) {
    adventureScaraText = (advType === 5 || (advType === 14 && wave === 3)) ? "-scara" : "";
    lootArray = {};

    if (adventureScene) {return}
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

    adventureVariables = {
        quicktimeEnabled: quicktimeEnabled,  // BOOL
        quickType: quicktimeEnabled ? quickType : null, // ARRAY
        advType: advType, // INTEGER
        specialty: specialty,
        waveType: waveType, // TWO ARRAYS
        currentEnemyAmount: waveType.Wave.length,
        maxEnemyAmount: waveType.Wave.length,
        lootArray: {},
        fightSceneOn: false,
        pheonixMode: false,
    }

    // NAHIDA UPGRADE CHECKER
    let nahidaMultiplier = 0;
    for (let key in upgradeDict[0]["milestone"]) {
        if (upgradeDict[0]["milestone"][key]) {nahidaMultiplier += 3}
    }
    adventureVariables.nahidaMultiplier = nahidaMultiplier;

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
    
    const bgRoll = randomInteger(waveType.BG[0],waveType.BG[1] + 1);
    adventureVideo.style.backgroundImage = `url(./assets/expedbg/scene/${advType}-B-${bgRoll}.webp)`;
    spawnMob(adventureVideo, waveType.Wave, false);

    const preloadedImage = new Image();
    preloadedImage.src = `./assets/expedbg/scene/${advType}-B-${bgRoll}.webp`;
    preloadedImage.onload = () => {
        adventureArea.style.zIndex = 500;
        adventureTextBox.style.animation = "flipIn 1s ease-in-out forwards";
        adventureTextBox.addEventListener("animationend",textFadeIn,true);
        bgmElement.pause();
        fightEncounter.load();
        fightEncounter.play();
    }

    function textFadeIn() {
        adventureHeading.style.top = "10%";
        adventureHeading.style.overflowY = "hidden";
        adventureHeading.style.animation = "fadeOut 1s ease-out reverse";

        // TODO: DIFFERENT TEXT BASED ON ADV TYPE
        if (adventureVariables.maxEnemyAmount > 1) {
            adventureHeading.innerText = "You encounter a bunch of hostile enemies.";
        } else {
            adventureHeading.innerText = "You encounter a hostile mob.";
            switch (specialty) {
                case 'FellBoss':
                    adventureHeading.innerText = "The excess energy from the Leyline Outbreak has caused this Whoppperflower to grow uncontrollably..."
                    break;
                case 'Unusual':
                    adventureHeading.style.animation = "fadeOut 0.4s ease-out reverse";
                    adventureHeading.innerText = "After stepping into the domain, you...Watch out! Something is being launched towards you!!"
                    break;
                case 'Workshop':
                    adventureHeading.innerText = "Before you stands the re-animated machine of the Prodigal, Everlasting Lord of Arcane Wisdom."
                    break;
                case 'Finale':
                    adventureHeading.innerText = "You stand before the Doctor, Second of the Fatui Harbingers, mastermind behind the Leyline Outbreak."
                    break;
                default:
                    break;
            }
        }

        const fightTextbox = document.getElementById('fight-text');
        fightTextbox.innerText = "Prepare for a fight!";

        adventureTextBox.style.animation = "";
        adventureChoiceOne.pressAllowed = true;
        adventureTextBox.removeEventListener("animationend", textFadeIn, true);

        if (specialty === 'Unusual') {
            setTimeout(() => {
                adventureChoiceOne.click();
            }, 1500)
        }
    }
}

function spawnKey(advImage,imgKey,key,worldQuest) {
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
    if (worldQuest) {
        button.id = "world-quest-button";
        button.style.transform = `scale(${1 / (0.2 + (2/100) * settingsValues.defaultZoom) * (MOBILE ? 1.5 : 1)})`;
    };

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
                expedInfo("exped-11");
                if (advButton.classList.contains("expedition-selected")) {
                    advButton.classList.remove("expedition-selected");
                }
            } else if (adventureType == `${level}-[${wave}]`) {
                adventureType = 0;
                advButton.key = 0;
                clearExped();
                expedInfo("exped-7");
                if (advButton.classList.contains("expedition-selected")) {
                    advButton.classList.remove("expedition-selected");
                }
            } else {
                clearExped();
                adventureType = `${level}-[${wave}]`;
                advButton.key = key;
                expedInfo(`exped-${level}-${key}`);
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

    let rollQuest = randomInteger(18,26);
    let mapImage = document.getElementById('sumeru-map');
    spawnKey(mapImage, imgKey, rollQuest, true);
    notifPop("add", "quest", 1);
}

function spawnBossQuest(num) {
    const val = 26 + num;
    if (document.getElementById(`adv-button-${val}`)) {
        return;
    } else {
        let mapImage = document.getElementById('sumeru-map');
        spawnKey(mapImage, imgKey, val, true);
        notifPop("add", "boss", val);
    }
}

function drawWorldQuest(advType) {
    let adventureChoiceOne = document.getElementById("adv-button-one");
    adventureChoiceOne.style.display = "block";
    adventureChoiceOne.pressAllowed = false;
    adventureChoiceOne.innerText = "Next";
    adventureChoiceOne.advType = advType.split("-")[0];

    advType = advType.split("-")[1];
    advType = advType.substring(1, advType.length-1).split(",");
    advType = rollArray(advType,0);

    let adventureArea = document.getElementById("adventure-area");
    let adventureTextBox = document.getElementById("adventure-text");
    adventureTextBox.questNumber = advType;
    let adventureRewards = document.getElementById("adventure-rewards");
    adventureRewards.style.opacity = "0";
    adventureRewards.style.flexGrow = "0";

    let adventureVideo = document.getElementById("adventure-video");
    adventureVideo.style.backgroundImage = `url(./assets/expedbg/choice/${advType}.webp`;
    let adventureHeading = document.getElementById("adventure-header");
    adventureHeading.style.flexGrow = "1";
    adventureHeading.style.overflowY = "auto";

    let preloadedImage = new Image();
    preloadedImage.src = `./assets/expedbg/choice/${advType}.webp`;
    preloadedImage.onload = ()=> {
        adventureArea.style.zIndex = 500;
        adventureTextBox.style.animation = "flipIn 1s ease-in-out forwards";
        adventureTextBox.addEventListener("animationend",textFadeIn,true);
    }
    
    function textFadeIn() {
        adventureHeading.style.top = "10%";
        adventureHeading.style.animation = "fadeOut 0.8s ease-out reverse";
        adventureChoiceOne.pressAllowed = true;

        let text = sceneInfo[advType].Lore;
        adventureHeading.innerHTML = textReplacer({
            "[s]":`<span style='color:#A97803'>`,
            "[/s]":`</span>`,
        },text)

        adventureTextBox.style.animation = "";
        adventureTextBox.removeEventListener("animationend", textFadeIn,true);
    }
}

function continueQuest(advType) {
    let infoDict = sceneInfo[advType];
    if (infoDict.Type === "LuckCheck") {
        if (advType === "0_LuckCheck_Failure") {
            saveValues.energy -= 100;
            saveValues.energy = Math.max(saveValues.energy, 0);
            quitQuest();
            return;
        } else if (advType === "0_LuckCheck_Success") {
            gainXP("variable",2);
            quitQuest();

            if (worldQuestDict.currentWorldQuest === "15_B") {
                challengeNotification(({category: 'specific', value: [0,5]}))
            }
            return;
        }

        let adventureVideo = document.getElementById("adventure-video");
        let adventureHeading = document.getElementById("adventure-header");
        let adventureTextBox = document.getElementById("adventure-text");

        let rollChance = randomInteger(1,101) + luckRate;
        let rollOutcome;
        if (rollChance > 50) {
            rollOutcome = "Success";
            adventureTextBox.questNumber = "0_LuckCheck_Success";
        } else {
            rollOutcome = "Fail";
            adventureTextBox.questNumber = "0_LuckCheck_Failure";
        }

        adventureVideo.style.backgroundImage = `url(./assets/expedbg/choice/${advType}_${rollOutcome}.webp`;
        let text = sceneInfo[`${advType}_${rollOutcome}`].Lore;
        adventureHeading.innerHTML = textReplacer({
            "[s]":`<span style='color:#A97803'>`,
            "[/s]":`</span>`,
        },text);
    } else if (infoDict.Type === "Meeting") {
        updateMorale("add",randomInteger(6,10));
        quitQuest();
        gainXP("variable");
    } else if (infoDict.Type === "Exploration") {
        quitQuest();
        gainXP("variable");
        if (advType === "17_A" || advType === "3_A") {
            let energyRoll = Math.round(randomInteger(150,250) / 5) * 5;
            saveValues.energy += energyRoll;
            persistentValues.lifetimeEnergyValue += energyRoll;

            challengeNotification(({category: 'energy', value: saveValues.energy}))
            currencyPopUp("energy",energyRoll);
        }
    } else if (infoDict.Type === "Treasure") {
        quitQuest();
        if (advType === "10_A") {
            adventure("10-");

            currencyPopUp("items",0);
            newPop(1);
            sortList("table2");
        } else if (advType === "7_A" || advType === "9_A") {
            inventoryDraw("food", 2, 4);
            inventoryDraw("food", 2, 4);

            currencyPopUp("items",0);
            newPop(1);
            sortList("table2");
        }
    } else if (infoDict.Type === "Trade") {
        if (advType === "0_Trade_Wait") {
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
                currencyPopUp("items",0)
                sortList("table2");
            }

            let adventureVideo = document.getElementById("adventure-video");
            if (adventureVideo.classList.contains("transcend-dark")) {
                adventureVideo.classList.remove("transcend-dark");
            }
            
            document.getElementById('currency-amount').remove();
            document.getElementById('inventory-offer').remove();
            quitQuest();

            if (tradeOffer.offer === true) {
                challengeNotification(({category: 'specific', value: [0, 6]}))
            }
            return;
        }

        let adventureHeading = document.getElementById("adventure-header");
        let adventureVideo = document.getElementById("adventure-video")
        adventureVideo.classList.add("transcend-dark");

        let inventoryOffer = document.createElement("div");
        inventoryOffer.id = "inventory-offer";
        inventoryOffer.offer = null;
        let offerCurrency = document.createElement("p");
        offerCurrency.value = 0;
        offerCurrency.id = "offer-amount";

        let acceptButton = new Image();
        acceptButton.src = "./assets/icon/thumbsUp.webp";
        acceptButton.classList.add("dim-filter");
        let rejectButton = new Image();
        rejectButton.classList.add("dim-filter");
        rejectButton.src = "./assets/icon/thumbsDown.webp";

        acceptButton.addEventListener("click",()=>{
            if (saveValues.primogem > offerCurrency.value) {
                inventoryOffer.offer = true;
                adventureHeading.innerHTML = "You are accepting the trade. <br><br>Click 'Next' to confirm.";
                if (acceptButton.classList.contains("dim-filter")) {
                    acceptButton.classList.remove("dim-filter");
                }
                if (!rejectButton.classList.contains("dim-filter")) {
                    rejectButton.classList.add("dim-filter");
                }
            } else {
                adventureHeading.innerHTML = "You do not have enough primogems for the trade.";
                weaselDecoy.load();
                weaselDecoy.play();
            }
        });

        rejectButton.addEventListener("click",()=>{
            inventoryOffer.offer = false;
            adventureHeading.innerHTML = "You are rejecting the trade. <br><br>Click 'Next' to confirm.";
            if (!acceptButton.classList.contains("dim-filter")) {
                acceptButton.classList.add("dim-filter");
            }
            if (rejectButton.classList.contains("dim-filter")) {
                rejectButton.classList.remove("dim-filter");
            }
        });

        let currencyAmount = document.createElement("div");
        currencyAmount.innerText = saveValues.primogem;
        currencyAmount.classList.add("flex-row")
        currencyAmount.id = "currency-amount";
        let primogem = new Image();
        primogem.src = "./assets/icon/primogemIcon.webp";
        currencyAmount.appendChild(primogem);
        
        const itemCost = [0,0,0,70,140,300,600];
        const itemRoll = ["weapon","gem","artifact"]
        for (let i = 0; i < 3; i++) {
            let itemNumber;
            if (advType === "6_A") {
                itemNumber = inventoryDraw("gem", 3,5, "shop");
            } else if (advType === "22_A") {
                let maxStar = 5;
                let item = rollArray(itemRoll,0)
                if (item === "weapon" || item === 'gem') {
                    maxStar = 6;
                }
                itemNumber = inventoryDraw(item,5,maxStar, "shop");
            }

            let offerItem = document.createElement("div");
            offerItem = inventoryFrame(offerItem,Inventory[itemNumber],itemFrameColors);

            offerCurrency.value += Math.round(itemCost[Inventory[itemNumber].Star] * costDiscount / 5 * 0.65) * 5;
            inventoryOffer.appendChild(offerItem);
            lootArray[i] = itemNumber;
        }
        offerCurrency.innerText = `Cost: \n ${offerCurrency.value} Primogems`;

        inventoryOffer.append(offerCurrency, acceptButton, rejectButton);
        adventureVideo.append(inventoryOffer, currencyAmount);
        let adventureTextBox = document.getElementById("adventure-text");
        adventureTextBox.questNumber = "0_Trade_Wait";
    }

    function quitQuest() {
        let adventureArea = document.getElementById("adventure-area");
        adventureArea.style.zIndex = -1;
        let adventureHeading = document.getElementById("adventure-header");
        adventureHeading.innerHTML = "";
        adventureHeading.style.animation = "";

        if (document.getElementById("world-quest-button")) {
            document.getElementById("world-quest-button").remove();
            notifPop("clear","quest",1);
        }
    }
}

function comboHandler(type, ele) {
    if (type === "create") {
        let comboNumber = document.createElement("p");
        comboNumber.id = "combo-number";
        comboNumber.combo = 0;
        comboNumber.maxCombo = 0;
        comboNumber.innerText = `Combo: \n ${comboNumber.combo}`;
        ele.appendChild(comboNumber);
        return ele;
    } else if (type === "add") {
        let comboNumber = document.getElementById("combo-number");
        comboNumber.combo++;
        comboNumber.innerText = `Combo: \n ${comboNumber.combo}`;
        if (comboNumber.maxCombo < comboNumber.combo) {comboNumber.maxCombo = comboNumber.combo}

        comboNumber.style.animation = "";
        void comboNumber.offsetWidth;
        comboNumber.style.animation = "tallyCount 1s ease";
    } else if (type === "reset") {
        let comboNumber = document.getElementById("combo-number");
        comboNumber.combo = 0;
        comboNumber.innerText = `Combo: \n ${comboNumber.combo}`;

        comboNumber.style.animation = "";
        void comboNumber.offsetWidth;
        comboNumber.style.animation = "tallyCount 1s ease";
    } else if (type === "check") {
        let comboNumber = document.getElementById("combo-number");
        let multiplierThreshold = Math.floor(comboNumber.combo / 3) * 0.25;
        return (ele + multiplierThreshold);
    }
}

function spawnMob(adventureVideo, waveInfo, adjacentSibling) {
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

function triggerFight() {
    if (!adventureScene) {return}
    adventureVariables.fightSceneOn = true;
    adventureVariables.pheonixMode = advDict.rankDict[20].Locked ? false : true;

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
    adventureVideo = comboHandler("create",adventureVideo);
    let adventureVideoChildren = adventureVideo.children;

    battleVariables = {
        defenseMob: null,
        guardtime: adventureVariables.advType === 13 || adventureVariables.specialty === 'Finale' ? 0 : null,
        doubleAtkCooldown: adventureVariables.advType === 13 || adventureVariables.specialty === 'FellBoss' || adventureVariables.specialty === 'Finale' ? 1 : null,
        healthLost: 0,
        maxHealth: Math.ceil((5 + Math.floor(advDict.adventureRank / 4)) * (activeLeader == "Nahida" ? 1.2 : 1)),
        artificalSpeedUp: 0,
        quicktime: adventureVariables.specialty === 'Unusual' ? 100 : 0,
        quicktimeAttack: false,
        summonTime: adventureVariables.specialty === 'Finale' ? 0 : null,
        rainTime: null,
        floatTime: null,
        floatNumber: 0,
        decoyTime: null,
        decoyNumber: null,
        chargeTime: null,
        currentDeflect: null,
        deflectTime: adventureVariables.specialty === 'Workshop' ? 0 : null,
        burstAttack: null,
        burstTime: adventureVariables.specialty === 'Workshop' ? 0.25 : null,
        eatTime: null,
        currentEaten: null,
        bossHealth: adventureVariables.advType === 14 ? 100 : null,
        lastStand: false,
        triggerConstants: {quicktimeCheck, summonMob, rainTimeCheck, floatTimeCheck, burstTimeCheck, burstTimeEnd, eatTimeCheck},
    }
    
    let currentSong = randomInteger(1, 4); 
    if (adventureScaraText) {
        currentSong = 4;
    } else if (adventureVariables.advType >= 13) {
        currentSong = randomInteger(5, 7);
    }
    
    bgmElement.pause();
    fightBgmElement.src = `./assets/sfx/battleTheme-${currentSong}.mp3`;
    fightBgmElement.volume = settingsValues.bgmVolume;
    fightBgmElement.loop = true;
    fightBgmElement.load();
    fightBgmElement.addEventListener('canplaythrough', () => {fightBgmElement.play();})

    let healthDiv = document.getElementById("adventure-health");
    healthDiv.style.opacity = 1;

    let healthBar = document.getElementById("health-bar");
    healthBar.currentWidth = 100;
    healthBar.classList.add("adventure-health");
    healthBar.style.width = "100%";

    if (adventureScaraText) {
        healthDiv.classList.add("adventure-scara-health");
        healthBar.classList.add("adventure-scara-barHealth");
    } else {
        if (healthDiv.classList.contains("adventure-scara-health")) {healthDiv.classList.remove("adventure-scara-health")}
        if (healthBar.classList.contains("adventure-scara-barHealth")) {healthBar.classList.remove("adventure-scara-barHealth")}
    };

    for (let i = 0; i < battleVariables.maxHealth; i++) {
        let health = document.createElement("div");
        health.classList.add("heart-bit","flex-column");
        if (adventureScaraText) {health.style.borderRight = "0.1em solid #333553"};

        let healthImg = new Image();
        healthImg.src = `./assets/icon/health${adventureScaraText}.webp`;
        health.appendChild(healthImg)
        healthDiv.append(health);
    }

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
            if (!advDict.rankDict[16].Locked) {
                amountInterval *= 1.1;
            }

            if (!advDict.rankDict[9].Locked) {
                normalAtkCooldown.maxAmount = 3;
            }

            if (!advDict.rankDict[2].Locked) {
                normalAtkCooldown.amount = 100 * normalAtkCooldown.maxAmount;
            }

            if (activeLeader == "Venti") {
                amountInterval *= 1.10;
            }
        } else if (i == 2) {
            amountInterval *= 0.65;
            if (advDict.rankDict[5].Locked) {
                advImage.classList.add('dim-filter');
                continue;
            }
        } else if (i == 3) {
            if (advDict.rankDict[10].Locked) {
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
            }  else if (adventureVariables.specialty === 'Finale') {
                if (battleVariables.bossHealth <= FINALE_THRESHOLD_TWO) {
                    variant = '-cytus';
                } else if (battleVariables.bossHealth <= FINALE_THRESHOLD) {
                    variant = '-osu';
                }
            }

            let warningImg = new Image();
            warningImg.id = "warning-quicktime";
            warningImg.src = `./assets/icon/warning${variant}.webp`;
            warningImg.classList.add("quicktime-warning");
            adventureVideo.appendChild(warningImg);

            adventurePreload.fetch(quicktimeAssetArray);
            warningImg.onload = () => {
                warningImg.addEventListener("animationend", () => {
                    battleVariables.quicktime = 0;
                    quicktimeEvent(quicktimeArray[randomInteger(1, Object.keys(quicktimeArray).length + 1)], battleVariables.currentATK, variant);
                    warningImg.remove();

                    if (battleVariables.rainTime > 0.8) {
                        battleVariables.rainTime -= 0.25;
                    }
                })
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
        if (!beta) {return}
        if (battleVariables.floatTime > 1 && !document.getElementById('warning-quicktime')) {
            battleVariables.floatTime = 0;
            if (adventureVariables.specialty === 'FellBoss') {
                summonBattleFloat(5, 1);
                if (battleVariables.bossHealth <= FELLBOSS_THRESHOLD && randomInteger(1, 3) === 1) {
                    summonBattleFloat(4, 1.5);
                } else if (randomInteger(1, 4) === 1) {
                    summonBattleFloat(6, 1);
                }
            } else {
                if (battleVariables.bossHealth <= FINALE_THRESHOLD) {
                    if (battleVariables.bossHealth <= FINALE_THRESHOLD_TWO) {
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

                loseHP(energyBall.startingValue, 'normal');
                sapEnergy(energyBall.startingValue, 25);

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
                } else if (battleVariables.eatTime > 0.95) {
                    const enemyImg = battleVariables.currentEaten.querySelector('.enemyImg');
                    if (enemyImg.style.transition !== 'filter 0.4s ease-out') {
                        enemyImg.style.transition = 'filter 0.4s ease-out';
                        enemyImg.style.filter = 'grayscale(1) brightness(0.7) sepia(1) hue-rotate(313deg) saturate(1.5)';
                    }
                } else if (battleVariables.eatTime > 0.8) {
                    if (eatenMark.glowing === false) {
                        eatenMark.style.transform = `translate(-50%, -65%) scale(1.2)`;
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
    } else if (adventureVariables.specialty === 'FellBoss') {
        battleVariables.floatTime = 0;
    }

}

// STARTS COMBAT FOR MOB
function activateMob(mobDiv, position, adventureVideoChildrenLength) {
    const decoy = mobDiv.classList.contains('decoy') ? true : false;
    const arm = mobDiv.classList.contains('workshop-arm') ? true : false;

    mobDiv.children[0].style.animation = `vibrate ${randomInteger(600,1200) / 100}s linear infinite both`;
        if (mobDiv.classList.contains('wide-enemy')) {
            mobDiv.children[0].style.animation = `vibrate ${randomInteger(2000,2400) / 100}s linear infinite both`;
        } else if (adventureVariables.specialty === 'Unusual') {
            if (mobDiv.classList.contains('minion')) {
                mobDiv.children[0].style.animation = 'slit-in-horizontal 0.6s ease-out both';
                mobDiv.children[0].addEventListener('animationend', () => {
                    mobDiv.children[0].style.animation = '';
                    void mobDiv.children[0].offsetWidth;
                    mobDiv.children[0].style.animation = `vibrate ${randomInteger(600, 900) / 100}s linear infinite both`;
                }, {once: true})
            } else if (mobDiv.classList.contains('decoy')) {
                mobDiv.children[0].style.animation = 'slit-in-horizontal 0.6s ease-out both';
                mobDiv.style.animation = `sway ${randomInteger(26, 46) / 10}s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`;
            } else {
                mobDiv.children[0].style.animation = 'unset';
                mobDiv.style.animation = 'sway 3s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite';
            }
        } else if (adventureVariables.specialty === 'Finale') {
            if (mobDiv.classList.contains('minion')) {
                mobDiv.children[0].style.animation = 'slit-in-horizontal 0.6s ease-out both';
                mobDiv.children[0].addEventListener('animationend', () => {
                    mobDiv.children[0].style.animation = '';
                    void mobDiv.children[0].offsetWidth;
                    mobDiv.children[0].style.animation = `vibrate ${randomInteger(600, 900) / 100}s linear infinite both`;
                }, {once: true})
            }
        }

        let singleEnemyInfo = mobDiv.enemyID;
        let mobHealth = document.createElement("div");
        mobHealth.classList.add(`health-bar${adventureScaraText}`);

        if (decoy) {
            singleEnemyInfo.HP = 1e10;
        };
        
        mobHealth.maxHP = singleEnemyInfo.HP;
        mobHealth.health = singleEnemyInfo.HP;
        mobHealth.atk = singleEnemyInfo.ATK;
        mobHealth.class = singleEnemyInfo.Class;
        mobHealth.dead = false;
        
        let animationTime = singleEnemyInfo.AtkCooldown * (mobDiv.classList.contains('megaboss') ? 0.1 : (randomInteger(90, 110) / 1000));
        mobDiv.attackTime = animationTime;

        let mobAtkIndicator = createDom('img', {
            src: `./assets/icon/atkIndicator${adventureScaraText}.webp`,
            defence: false,
            firstLoad: true,
            doubleAtk: false,
        });

        const changeSrc = (newSrc) => {
            mobAtkIndicator.src = newSrc;
        }

        let decoyLoad = false;
        const canvas = createDom("canvas", {
            class: ["atk-indicator"],
            brightness: 0 - 0.1 * (position * randomInteger(1, adventureVideoChildrenLength) - 2),
            paused: false,
            eaten: false,
            deflecting: false,
            burstMode: false,
            changeSrc: changeSrc,
        });

        switch (adventureVariables.specialty) {
            case 'Unusual':
                canvas.brightness = 0.65;
                break;
            case 'Workshop':
                canvas.brightness = 0.15;
                break;
            default:
                break;
        }

        if (arm) {
            canvas.brightness -= 0.05 * randomInteger(1, position * 10);
        }
        
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
                if (!adventureVariables.fightSceneOn) {return}
                if (mobHealth.dead) {return}

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
                                guardStance(mobDiv, "exit");
                            } else {
                                canvas.style.filter = `brightness(1)`;
                                guardStance(mobDiv, "refresh");
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
                                battleVariables.summonTime += (brightnessIncrement * speedUpFactor * 1.7);
                            }
                            
                            if (adventureVariables.specialty === 'Unusual') {
                                if (battleVariables.bossHealth > UNUSUAL_THRESHOLD) {
                                    battleVariables.quicktime += brightnessIncrement * 0.3;
                                    battleVariables.decoyTime = canvas.brightness;
                                } else {
                                    canvas.brightness += (brightnessIncrement * speedUpFactor * 0.2);
                                }
                            } else if (adventureVariables.specialty === 'FellBoss') {
                                if (battleVariables.bossHealth <= FELLBOSS_THRESHOLD) {
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
                                    if (battleVariables.bossHealth <= WORKSHOP_THRESHOLD) {
                                        canvas.brightness -= brightnessIncrement * 0.25;
    
                                        battleVariables.burstTime += brightnessIncrement * 0.2;
                                        battleVariables.quicktime -= brightnessIncrement * (speedUpFactor - 1);
                                        battleVariables.triggerConstants.burstTimeCheck();
                                    } else {
                                        battleVariables.quicktime += brightnessIncrement * 0.4;
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
                        if (canvas.brightness < 0.8 && adventureVariables.currentEnemyAmount > 1 && !mobDiv.classList.contains('megaboss')) guardStance(mobDiv,"check");
                    }

                    // IF THERES DECOYS AND THAT IT IS NOT THE CHOSEN DECOY, THE CANVAS IGNORES THE ATTACK
                    if (canvas.attackState && !(battleVariables.decoyNumber !== null && battleVariables.decoyNumber != mobDiv.decoyNumber)) {
                        if (mobAtkIndicator.doubleAtk == true) {
                            mobAtkIndicator.doubleAtk = false;
                            mobAtkIndicator.src = `./assets/icon/atkIndicator${adventureScaraText}.webp`;
                            canvas.style.animation = ``;
                            void canvas.offsetWidth;
                        } else if (mobAtkIndicator.doubleAtk == "parry") {
                            mobAtkIndicator.doubleAtk = true;
                        } else if (battleVariables.deflectTime !== null && battleVariables.deflectTime > 1 && battleVariables.burstAttack === null) {
                            deflectStance();
                        } else if (!(guardCheck()) || adventureVariables.specialty === 'FellBoss') {
                            doubleAttack();
                        }

                        const evadeRoll = randomInteger(1,101);
                        let evadeMax = -1;
                        if (!advDict.rankDict[19].Locked) {
                            evadeMax = 15;
                        } else if (!advDict.rankDict[13].Locked) {
                            evadeMax = 10;
                        } else if (!advDict.rankDict[6].Locked) {
                            evadeMax = 5;
                        }

                        if (battleVariables.burstAttack !== null && mobDiv.classList.contains('megaboss')) {
                            battleVariables.triggerConstants.burstTimeEnd();
                        } else {
                            if (evadeRoll <= evadeMax && !decoy) {
                                createBattleText("dodge", animationTime * 150 * 2, mobDiv);
                            } else {
                                if (canvas.burstMode) {
                                    const energyBurst = document.getElementById('energy-ball');
                                    energyBurst.startingValue++;
                                    energyBurst.changeValue();

                                    createBattleText("chargedMiss", animationTime * 150 * 2, mobDiv);
                                } else {
                                    loseHP(mobHealth.atk, "normal");
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

                        if (battleVariables.decoyTime != null) {
                            canvas.style.filter = `brightness(${canvas.brightness * 0.65})`;
                        } else {
                            canvas.style.filter = `brightness(${canvas.brightness})`;
                        }
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
                // I HAVE NO IDEA WHAT THIS DOES
                // let doubleRoll = randomInteger(1,101);
                // if (doubleRoll > -1) {
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
        mobDiv.guardStance = guardStance;
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
                fightEnemyDownElement.load();
                fightEnemyDownElement.play();

                killMob(mobDiv, mobHealth);
            }

            let newHealth = Math.round(mobHealth.health/mobHealth.maxHP * 10000)/100;
            mobHealth.style.width = `${newHealth}%`
            if (mobDiv.classList.contains('megaboss')) {bossUpdate(newHealth)};
        }

        const parriedCorrectly = (attackMultiplier, guardCheckBool, type) => {
            canvas.attackState = false;
            canvas.classList.remove("attack-ready");
            mobDiv.children[0].classList.add("staggered");
            
            setTimeout(()=>{
                mobDiv.children[0].classList.remove("staggered");
            }, Math.max(animationTime * 150, 500));

            if (battleVariables.decoyNumber != null) {
                canvas.brightness = 0 - (randomInteger(0,10) / 10);
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
            if (mobDiv.children[0].querySelector('.skill-mark')) {
                if (guardCheckBool) {
                    mobHealth.health -= (battleVariables.currentATK * attackMultiplier);
                    loseHP(type === 'strong' ? 1 : 0.5, "inverse");
                } else {
                    mobHealth.health -= (battleVariables.currentATK * attackMultiplier * 0.25);
                }

                mobDiv.children[0].querySelector('.skill-mark').remove()

                const cooldown = document.getElementById('adventure-cooldown-1');
                cooldown.amount += 15;
            }

            // CHECKS IF THERE IS AN ACTIVE GUARD
            if (guardCheckBool) {
                mobHealth.health -= (battleVariables.currentATK * attackMultiplier);
                battleVariables.burstAttack === null ? loseHP(1, "inverse") : null;

                switch (type) {
                    case 'strong':
                        createBattleText("strongCounter", animationTime * 150 * 2, mobDiv);
                        break;
                    case 'weak':
                        createBattleText("weakCounter", animationTime * 150 * 2, mobDiv);
                        break;
                    default:
                        createBattleText("counter", animationTime * 150 * 2, mobDiv);
                        break;
                }

                if (battleVariables.deflectTime !== null && battleVariables.deflectTime > 1 && battleVariables.burstAttack === null) {
                    deflectStance();
                }
            } else {
                mobHealth.health -= (battleVariables.currentATK * attackMultiplier * 0.25);
                createBattleText("guard", animationTime * 150 * 2, mobDiv);
            }

            if (!advDict.rankDict[10].Locked) {
                const cooldown = document.getElementById('adventure-cooldown-3');
                if (adventureVariables.specialty === 'Unusual') {
                    cooldown.amount += 15;
                } else {
                    cooldown.amount += 20 + (adventureVariables.advType === 13 ? 5 : 0);
                }
            }

            // CHECKS IF DECOYS ARE PRESEENT
            if (battleVariables.decoyTime != null) {
                const bossEle = document.querySelector('.megaboss');
                const bossEleCanvas = bossEle.querySelector('.atk-indicator');
                bossEleCanvas.brightness = 0;
                battleVariables.decoyTime = 0;

                setTimeout(() => {
                    let randomRoll = randomInteger(1, 4);
                    while (battleVariables.decoyNumber == randomRoll) {
                        randomRoll = randomInteger(1, 4);
                    }
                    battleVariables.decoyNumber = randomRoll;
                }, 150)
            }
            
            parrySuccess.load();
            parrySuccess.play();
            comboHandler("add");
        }

        const clickMob = () => {
            if (!adventureVariables.fightSceneOn || mobHealth.dead || battleVariables.quicktimeAttack || canvas.paused) {return}
            
            let attackMultiplier = 1;
            const guardCheckBool = guardCheck();

            // CHECK IF PARRY IS BEING USED
            if (document.getElementById('select-indicator')) {
                if (activeLeader == "Ei") {attackMultiplier = 1.35}
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
                        if (battleVariables.bossHealth <= WORKSHOP_THRESHOLD) {
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
                    createBattleText("deflect", animationTime * 150 * 2, mobDiv);
                    loseHP(mobHealth.atk, "normal");

                    parryFailure.load();
                    parryFailure.play();
                    comboHandler("reset");

                    if (!advDict.rankDict[10].Locked) {
                        const cooldown = document.getElementById('adventure-cooldown-3');
                        cooldown.amount += 15;
                    }
                } else {
                    mobDiv.children[0].classList.add("damaged");
                    setTimeout(()=>{mobDiv.children[0].classList.remove("damaged")}, Math.max(animationTime * 150, 500));

                    parryFailure.load();
                    parryFailure.play();
                    comboHandler("reset");
                    if (!advDict.rankDict[10].Locked) {
                        const cooldown = document.getElementById('adventure-cooldown-3');
                        cooldown.amount += 10;
                    }
                }

                if (guardCheckBool) {
                    mobHealth.health -= battleVariables.currentATK;
                    if (adventureVariables.specialty === 'FellBoss') {
                        doubleAttack();
                    }
                } else {
                    mobHealth.health -= (battleVariables.currentATK * 0.25);
                    createBattleText("guard", animationTime * 150 * 2, mobDiv);
                    doubleAttack();
                    if (!advDict.rankDict[10].Locked) {
                        const cooldown = document.getElementById('adventure-cooldown-3');
                        cooldown.amount += 10;
                    }
                }

                let cooldown = document.getElementById('adventure-cooldown-1');
                cooldown.amount -= 100;
                dodgeOn("close");
            } else {
                // NO PARRY IS BEING USED
                attackMultiplier = comboHandler("check", attackMultiplier);

                if (mobDiv.classList.contains('megaboss')) {
                    if (adventureVariables.specialty === 'Unusual') {
                        attackMultiplier *= (battleVariables.bossHealth > UNUSUAL_THRESHOLD) ? 2.25 : 1.75;
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

        mobDiv.children[0].addEventListener("mouseup", () => {
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

    if (adventureVariables.specialty === 'Unusual' && updatedHealth <= UNUSUAL_THRESHOLD) {
        if (battleVariables.summonTime === null) {
            battleVariables.summonTime = 0;
            battleVariables.decoyTime = null;
            battleVariables.decoyNumber = null;
            changeAnimation(2);
        }
    } else if (adventureVariables.specialty === 'FellBoss' && updatedHealth <= FELLBOSS_THRESHOLD) {
        if (battleVariables.rainTime === null) {
            battleVariables.rainTime = 0;
            changeAnimation(2);
        }
    } else if (adventureVariables.specialty === 'Workshop' && updatedHealth <= WORKSHOP_THRESHOLD) {
        if (battleVariables.chargeTime === null) {
            battleVariables.chargeTime = 0;
            changeAnimation(2);
        } else if (updatedHealth <= 0) {
            winAdventure();
        }
    } else if (adventureVariables.specialty === 'Finale' && updatedHealth <= FINALE_THRESHOLD) {
        if (updatedHealth <= FINALE_THRESHOLD_TWO) {
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
                battleVariables.floatTime = 10;
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

function createBattleText(text, timer, container) {
    let textBox = document.createElement("img");
    textBox.classList.add("flex-column","battle-text")
    textBox.src = `./assets/expedbg/${text}.webp`;
    setTimeout(()=>{textBox.remove()}, timer);
    container.append(textBox);
    return container;
}

function summonBattleFloat(HP, initialFactor, ignoreSpace=false) {
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
    } else if (adventureVariables.specialty === 'Finale' && battleVariables.bossHealth <= FINALE_THRESHOLD_TWO) {
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
            if (popImage.rotationNumber > 360) {
                popImage.rotationNumber = 0;
                loseHP(0.5, 'normal', false);
                sapEnergy(1, 25);
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
    if (beta) {return}
    battleVariables.quicktimeAttack = true;

    const quicktimeBar = document.createElement("div");

    const videoOverlay = document.createElement("div");
    videoOverlay.id = "quicktime-overlay";
    videoOverlay.classList.add("flex-column");

    const adventureText = document.getElementById('adventure-text');
    const textOverlay = document.createElement("div");
    textOverlay.classList.add("text-overlay","cover-all","flex-row");

    const adventureVideo = document.getElementById('adventure-video');
    if (variant === '-cytus') {
        textOverlay.classList.add("flex-column");
        textOverlay.style.justifyContent = 'space-around';
        textOverlay.style.padding = '0 15%';
        textOverlay.style.boxSizing = 'border-box';

        const textBox = document.createElement('p');
        textBox.classList.add('flex-column')
        textBox.innerText = "Avoid being hit by the attacks!";
        textBox.style.width = '50%'
        textBox.style.height = '100%';
        textOverlay.appendChild(textBox);

        quicktimeBar.id = "quicktime-bar";
        quicktimeBar.state = null;
        quicktimeBar.classList.add("flex-row","quicktime-block");

        const quickImg = new Image();
        quickImg.src = "./assets/expedbg/quicktime-block.webp";
        quickImg.classList.add("cover-all");
        quickImg.style.zIndex = 1;

        const quicktimeCytus = createDom('div', { class: ['quicktime-osu'] });
        for (let i = 0; i < 3; i++) {
            const cytusLine = createDom('b', {
                class: ['cytus-line'],
                style: {
                    top: ((i + 1) * 25) + '%',
                }
            })
            quicktimeCytus.append(cytusLine);
        }

        const adventureGif = document.getElementById('adventure-gif');
        const cytusHead = adventureGif.cloneNode(false);
        adventureGif.style.display = 'none';

        cytusHead.classList.add('cytus-head');
        cytusHead.style.top = '50%';
        quicktimeCytus.appendChild(cytusHead);

        let activeRow = 1;
        let finalSequence = false;
        let hitCount = 0;
        let invincibleFrame = false;
        const controlledRows = [[], [], []];

        const arrowArray = ['down','up'];
        for (let i = 1; i > -1; i--) {
            const img = createDom('img', {
                src: `./assets/expedbg/battle-${arrowArray[i]}${adventureScaraText}.webp`,
                style: {
                    height: '49%',
                    position: 'unset',
                }
            });

            img.addEventListener("click",() => {
                if (i === 1) {
                    activeRow = Math.max(--activeRow, 0);
                } else {
                    activeRow = Math.min(++activeRow, 2);
                }

                cytusHead.style.top = ((activeRow + 1) * 25) + '%';
            })
            textOverlay.appendChild(img);
        }


        const checkCollision = () => {
            if (controlledRows[activeRow].length > 0) {
                if (invincibleFrame) {
                    return;
                } else {
                    invincibleFrame = true;
                    cytusHead.classList.add("damaged");
                    cytusHead.damagedState = setTimeout(() => {
                        cytusHead.classList.remove("damaged");
                        invincibleFrame = false;
                        hitCount++;
                    }, 300);
                }
            }
        }

        let usedDict;
        if (adventureVariables.specialty === 'Workshop') {
            usedDict = battleVariables.bossHealth <= WORKSHOP_THRESHOLD ? enemyInfo.hardCytusDict : enemyInfo.easyCytusDict;
        } else if (adventureVariables.specialty === 'Finale') {
            if (battleVariables.lastStand) {
                usedDict = enemyInfo.veryHardCytusDict;
            } else {
                usedDict = enemyInfo.hardCytusDict;
            }
        }

        let beatArray = deepCopy(rollArray(usedDict, 0));
        const maxBeat = beatArray.length;
        let mirrorAll = randomInteger(1, 3) === 1 ? true : false;
        let beatCount = 10;

        const spawnBeat = (counter) => {
            const currentBeat = beatArray[0];
            beatArray.shift();   

            const re = new RegExp('X', 'g');
            const XCount = currentBeat[2].match(re).length;

            const activeBeats = [];
            let progress = 0;
            let spawnNextBeat = 0;
            let spawnedAlready = false;

            const modifier = currentBeat[3] === null ? '' : currentBeat[3];
            let mirrorSequence = currentBeat[4] === undefined ? false : true;
            mirrorSequence = mirrorAll === true ? !(mirrorSequence) : mirrorSequence;

            for (let i = 0; i < currentBeat[2].length; i++) {
                if (currentBeat[2][i] === 'X') {
                    const rowBeat = createDom('img', {
                        src: `./assets/expedbg/${modifier}Purple.webp`,
                        row: i,
                        class: ['cytus-beat'],
                        style: {
                            zIndex: beatCount,
                            left: mirrorSequence ? 'unset' : 0,
                            right: mirrorSequence ? 0 : 'unset',
                            top: ((i + 1) * 25) + '%',
                            transform: mirrorSequence ? `translate(50%, -55%) scaleX(-1)` : `translate(-50%, -55%)`,
                        }
                    });

                    beatCount++;

                    if (modifier === 'Bullet-') {
                        rowBeat.style.transform = mirrorSequence ? 'translate(50%, -55%)' : `translate(-50%, -55%) scaleX(-1)`; 
                        let warnImage = createDom('img', { 
                            src: `./assets/expedbg/Warning-Purple.webp`,
                            class: ["cytus-warn", 'cytus-beat'],
                            style: {
                                left: mirrorSequence ? 'unset' : 0,
                                right: mirrorSequence ? 0 : 'unset',
                                top: ((i + 1) * 25) + '%',
                                transform: mirrorSequence ? `translate(50%, -55%) scaleX(-1)` : `translate(-50%, -55%)` ,
                            }
                        });

                        warnImage.addEventListener('animationend', () => {
                            quicktimeCytus.appendChild(rowBeat);
                            activeBeats.push(rowBeat)
                            warnImage.remove();
                        })
                        
                        quicktimeCytus.append(warnImage);
                    } else {
                        rowBeat.onload = () => {
                            activeBeats.push(rowBeat)
                            quicktimeCytus.appendChild(rowBeat);
                            
                        }
                    }
                }
            }

            const interval = Math.floor(1000 / FRAMES_PER_SECOND);
            let previousTime = performance.now();
            let currentTime = 0;
            let deltaTime = 0;
            let thresholdReached = false;
    
            function animateMovement(timestamp) {
                currentTime = timestamp;
                deltaTime = currentTime - previousTime;
                
                if (deltaTime > interval) {
                    activeBeats.forEach((beat) => {
                        const progressIncrement = currentBeat[0] / 1000 / XCount;
                        if (modifier === 'Boomer-') {
                            if (thresholdReached) {
                                beat.style.transform = `${mirrorSequence ? 'translate(50%, -55%)' : 'translate(-50%, -55%) scaleX(-1)'} rotate(${progress / 95 * 360 * 2}deg)`;
                                progress -= progressIncrement * 1.7;
                                spawnNextBeat += progressIncrement;
                            } else if (progress < 95) {
                                beat.style.transform = `${mirrorSequence ? 'translate(50%, -55%)' : 'translate(-50%, -55%) scaleX(-1)'} rotate(${progress / 95 * 360 * 2}deg)`;
                                progress += progressIncrement * 1.4;
                                spawnNextBeat += progressIncrement;
                            } else {
                                thresholdReached = true;
                            }
                        // ACCELERATIING AND DECELERATING MOTION
                        } else if (modifier === 'Bullet-') {
                            progress += progressIncrement * (3 - 0.8 * (progress / 100));
                            spawnNextBeat += progressIncrement;
                        } else if (modifier === 'Circle-') {
                            progress += progressIncrement * (0.3 + 2 * (progress / 100));
                            spawnNextBeat += progressIncrement;
                        // STANDARD MOTION
                        } else {
                            progress += progressIncrement;
                            spawnNextBeat += progressIncrement;
                        }

                        mirrorSequence === true ? (beat.style.right = progress + '%') : (beat.style.left = progress + '%');
    
                        if (progress > 41 && progress < 53) {
                            if (!controlledRows[beat.row].includes(beat)) {
                                controlledRows[beat.row].push(beat);
                            }
                        } else {
                            if (controlledRows[beat.row].includes(beat)) {
                                controlledRows[beat.row].splice(controlledRows[beat.row].indexOf(beat), 1);
                            }

                            if (progress > 100 || progress < 0) {
                                beat.style.display = 'none';
                                if (spawnedAlready) {
                                    beat.remove();
                                    return;
                                } else if (maxBeat === counter && !finalSequence) {
                                    beat.remove();
                                    finalSequence = true;

                                    textBox.innerHTML = `You were hit ${hitCount}</span> times!`;
                                    setTimeout(() => {
                                        quitQuicktime(advLevel, null, hitCount / 2, videoOverlay, textOverlay);
                                        if (battleVariables.lastStand) {
                                            const bossEleHealth = adventureVideo.querySelector('.megaboss > .health-bar');
                                            if (bossEleHealth) {
                                                bossEleHealth.style.width = `0%`;
                                            }
                                            bossUpdate(0);
                                        }
                                        adventureGif.style.display = 'block';
                                    }, 2000);
                                    return;
                                }
                            }
                        }
                    })

                    if (beatArray.length > 0 && !spawnedAlready && spawnNextBeat >= beatArray[0][1]) {
                        counter++;
                        spawnBeat(counter);
                        spawnedAlready = true;
                    }
                }
            
                checkCollision();
                window.requestAnimationFrame(animateMovement);
            }

            window.requestAnimationFrame(animateMovement);
        }

        setTimeout(() => {
            spawnBeat(1);
        }, 500)

        quicktimeBar.append(quickImg, quicktimeCytus);
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

                setTimeout(() => {battleVariables.quicktimeAttack = false}, 300);
                videoOverlay.remove();

                loseHP(spikeCaught, 'normal');
                sapEnergy(spikeCaught, 50);

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

        const quickImg = new Image();
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
        }

        reverseMode = false;
        mirrorMode = false;

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
                        setTimeout(() => {quitQuicktime(advLevel, maxBeat, correctBeat, videoOverlay, textOverlay)}, 2000);
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
    
        let maxBeat = waveQuicktime.length;
        let currentBeat = 0;
        let correctBeat = 0;
        let removeBeat = false;
        
        quicktimeBar.id = "quicktime-bar";
        quicktimeBar.state = null;
        quicktimeBar.classList.add("flex-row","quicktime-bar");
    
        let colorArray = ["Red","Green","Blue"];
        if (adventureVariables.specialty === 'Unusual') {
            for (let i = colorArray.length - 1; i > 0; i--) {
                const j = randomInteger(0, i);
                [colorArray[i], colorArray[j]] = [colorArray[j], colorArray[i]];
            }

            if (battleVariables.bossHealth < UNUSUAL_THRESHOLD) {
                waveQuicktime = waveQuicktime.slice(0, (randomInteger(1, 3) * -1));
                maxBeat = waveQuicktime.length;
            }
        }
    
        for (let i = 0; i < 3; i++) {
            let img = new Image();
            img.src = `./assets/expedbg/${colorArray[i]}.webp`;
            img.addEventListener("click",() => {
                if (quicktimeBar.state !== null) {
                    if (quicktimeBar.state === colorArray[i]) {
                        correctBeat++;
                    } else {
                        createBattleText("miss", 2000, videoOverlay);
                    }

                    quicktimeBar.state = null;
                    currentBeat++;
                    removeBeat = true;
                }   
            })
            textOverlay.appendChild(img);
        }
    
        let quickImg = new Image();
        quickImg.src = "./assets/expedbg/quicktime.webp";
        quickImg.classList.add("cover-all");
        quickImg.style.zIndex = 1;
        createBeat(advLevel);
        
        function createBeat(advLevel) {
            let modifier = '';
            if (adventureVariables.specialty === 'Unusual') {
                let roll = randomInteger(1, 101);
                if (battleVariables.bossHealth && battleVariables.bossHealth <= UNUSUAL_THRESHOLD && roll < 60) {
                    modifier = 'Boomer-';
                } else if (battleVariables.bossHealth && battleVariables.bossHealth > UNUSUAL_THRESHOLD && roll < 40) {
                    modifier = 'Bullet-';
                } else if (roll < 85) {
                    modifier = 'Circle-';
                }
            } else if ((adventureVariables.specialty === 'Finale')) {
                let roll = randomInteger(1, 101);
                if (roll < 25) {
                    modifier = 'Boomer-';
                } else if (roll < 55) {
                    modifier = 'Bullet-';
                } else if (roll < 85) {
                    modifier = 'Circle-';
                }
            } else {
                modifier = '';
            }
    
            let beatImage = new Image();
            beatImage.classList.add("quicktime-img");
            beatImage.color = rollArray(colorArray, 0);
            beatImage.src = `./assets/expedbg/${modifier}${beatImage.color}.webp`;
            beatImage.position = 0;
            beatImage.style.left = "100%";
    
            let brightnessIncrement = waveQuicktime[currentBeat] * randomInteger(90,110) / 100;
            let thresholdReached = false;
    
            // ALLOWS BEAT TO GO IN REVERSE DIRECTION
            let inverseDirection = false;
            let inverseRoll = randomInteger(1,101);
            if ((advLevel >= 13 && inverseRoll > 50) || (advLevel == 5 && inverseRoll > 75)) {
                inverseDirection = true;
                beatImage.style.transform = `scaleX(-1)`;
                beatImage.style.left = '-10%';
            }
            
            // ADDS WARNING FOR BULLET QUICKTIME
            if (modifier === 'Bullet-') {
                brightnessIncrement = Math.max(brightnessIncrement, 0.54);
                let warnImage = createDom('img', { src: `./assets/expedbg/Warning-${beatImage.color}.webp` });
                warnImage.classList.add("quicktime-warn");
                inverseDirection ? (warnImage.style.left = '0') : (warnImage.style.right = '0');
    
                warnImage.addEventListener('animationend', () => {
                    startQuicktime();
                    warnImage.remove();
                })
                quicktimeBar.append(warnImage);
            } else {
                beatImage.onload = () => {
                    startQuicktime();
                }
            }
    
            function startQuicktime() {
                const FRAMES_PER_SECOND = 60;
                const interval = Math.floor(1000 / FRAMES_PER_SECOND);
                let previousTime = performance.now();
    
                let currentTime = 0;
                let deltaTime = 0;
                window.requestAnimationFrame(increaseGlow);
    
                function increaseGlow(timestamp) {
                    if (!adventureVariables.fightSceneOn) {return}
                    if (removeBeat) {
                        removeBeat = false;
                    
                        if (beatImage.style.transform === `scaleX(-1)`) {
                            beatImage.style.animation = "puffOutMirror 0.25s linear";
                        } else {
                            beatImage.style.animation = "puffOut 0.25s linear";
                        }
    
                        beatImage.addEventListener("animationend",() => {
                            beatImage.remove();
                            outcomeCheck(advLevel, currentBeat, maxBeat);
                        })
                        return;
                    }
                    
                    currentTime = timestamp;
                    deltaTime = currentTime - previousTime;
                    
                    if (deltaTime > interval) {
                        // BOOMERANG MOTION
                        if (modifier === 'Boomer-') {
                            if (thresholdReached) {
                                beatImage.style.transform = `scaleX(-1) rotate(${beatImage.position / 95 * 360 * 2}deg)`;
                                beatImage.position -= brightnessIncrement * 1.25;
                            } else if (beatImage.position < 95) {
                                beatImage.style.transform = `scaleX(-1) rotate(${beatImage.position / 95 * 360 * 2}deg)`;
                                beatImage.position += brightnessIncrement * 2;
                            } else {
                                thresholdReached = true;
                            }
                        // ACCELERATIING AND DECELERATING MOTION
                        } else if (modifier === 'Bullet-') {
                            beatImage.position += brightnessIncrement * (1.7 - 1 * (beatImage.position / 100));
                        } else if (modifier === 'Circle-') {
                            beatImage.position += brightnessIncrement * (0.3 + 2 * (beatImage.position / 100));
                        // STANDARD MOTION
                        } else {
                            beatImage.position += brightnessIncrement;
                        }
    
                        beatImage.style.left = inverseDirection ? `${beatImage.position}%` : `${100 - beatImage.position}%`;
                        let leftPos = parseFloat(beatImage.style.left);
    
                        if (leftPos <= 60 && leftPos > 35) {
                            quicktimeBar.state = beatImage.color;
                        } else if (leftPos < -15 || leftPos > 115) {
                            currentBeat++;
                            quicktimeBar.state = null;
                            createBattleText("miss", 2000, videoOverlay);
                            outcomeCheck(advLevel, currentBeat, maxBeat);
                            return;
                        } else {
                            quicktimeBar.state = "ready";
                        }
                    }
                    window.requestAnimationFrame(increaseGlow);
                }
            }
    
            quicktimeBar.append(quickImg, beatImage);
        }
    
        function outcomeCheck(advLevel, currentBeat, maxBeat) {
            if (currentBeat === maxBeat) {
                textBox.innerHTML = `You successfully countered <span style='color:#A97803'>${correctBeat}</span> out of <span style='color:#A97803'>${maxBeat}</span> ranged attacks!`;
                setTimeout(() => {
                    // LOSE HALF HP FOR OSU QUICKTIMES
                    quitQuicktime(advLevel, maxBeat, (maxBeat + correctBeat) / 2, videoOverlay, textOverlay);
                },2000)
            } else if (currentBeat < maxBeat) {
                createBeat(advLevel);
            }
        }
    }

    function quitQuicktime(advLevel, maxBeat, correctBeat, videoOverlay, textOverlay) {
        videoOverlay.remove();
        textOverlay.remove();
        setTimeout(() => {battleVariables.quicktimeAttack = false}, 300);

        let atkNumber;
        switch (advLevel) {
            case 13:
                atkNumber = 2.5;
                break;
            case 5:
                atkNumber = 2;
                break;
            case 4:
                atkNumber = 1.5;
                break;
            case 3:
                atkNumber = 1;
                break;
            default:
                atkNumber = 1;
                break;
        }

        if (maxBeat !== null) {
            atkNumber = atkNumber * (maxBeat - correctBeat);
        } else {
            atkNumber *= correctBeat;
        }
        
        if (atkNumber > 0) {
            loseHP(Math.round(atkNumber * 10) / 10, "normal");
        }
    }

    if (variant !== '-rain') {
        adventureText.appendChild(textOverlay);
        videoOverlay.append(quicktimeBar);
    }

    adventureVideo.appendChild(videoOverlay);
}

function sapEnergy(quantityAmount, energyAmount) {
    const cooldown = document.getElementById('adventure-cooldown-1');
    const cooldown2 = document.getElementById('adventure-cooldown-2');
    const cooldown3 = document.getElementById('adventure-cooldown-3');

    cooldown.amount = Math.max(cooldown.amount - quantityAmount * energyAmount, 0);
    cooldown2.amount = Math.max(cooldown2.amount - quantityAmount * (energyAmount / 3), 0);
    cooldown3.amount = Math.max(cooldown3.amount - quantityAmount * (energyAmount / 10), 0);
}

function loseHP(ATK, type='normal', resetCombo=true) {
    if (beta) {return}
    if (!adventureVariables.fightSceneOn) {return}

    const healthBar = document.getElementById('health-bar');
    let hpInterval = (100 / battleVariables.maxHealth);
    let adventureHealth = document.getElementById('adventure-health');

    if (type === "inverse") {
        healthBar.currentWidth += (hpInterval * ATK);
        if (healthBar.currentWidth > 100) {healthBar.currentWidth = 100}
    } else {
        battleVariables.healthLost += ATK;
        healthBar.currentWidth -= (hpInterval * ATK);
        if (healthBar.currentWidth < 1) {healthBar.currentWidth = 0}
        if (resetCombo && type !== 'inverse') {comboHandler("reset");}

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
            createBattleText("endure",2000,document.getElementById('adventure-video'));
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
    if (!adventureVariables.fightSceneOn || advDict.rankDict[5].Locked || battleVariables.quicktimeAttack) {return}
    
    const adventureVideoChildren = Array.from(document.getElementById("adventure-video").children).filter((child) => child.tagName === "DIV");
    const cooldown = document.getElementById('adventure-cooldown-2');
    if (cooldown.amount < 100) {return}

    let resetChance = randomInteger(1,101);
    let resetRoll = -1;
    if (skillCooldownReset) {
        resetRoll = -1;
    } else if (!advDict.rankDict[14].Locked) {
        resetRoll = 50;
    } else if (!advDict.rankDict[7].Locked) {
        resetRoll = 20;
    }

    if (resetChance <= resetRoll && skillCooldownReset === false) {
        let resetButton = document.getElementById('battle-skill');
        let img = new Image();
        img.classList.add("cover-all");
        img.id = "refresh-icon";
        img.src = "./assets/expedbg/refresh.webp";
        img.onload = ()=>{
            resetButton.appendChild(img);
            img.addEventListener("animationend",()=>{
                img.remove();
            })
        }
        skillCooldownReset = true;
    } else {
        cooldown.amount -= 100;
        skillCooldownReset = false;
    }

    for (let i = 0; i < adventureVideoChildren.length; i++) {
        const mobDiv = adventureVideoChildren[i];
        if (!mobDiv.classList.contains('enemy') || mobDiv.children[1] == undefined) {continue};

        if (mobDiv.querySelector('.skill-mark')) {
            mobDiv.querySelector('.skill-mark').remove();
        };

        let skillMark = new Image();
        skillMark.src = `./assets/icon/mark${adventureScaraText}.webp`;

        let canvas = document.createElement("canvas");
        canvas.classList.add("skill-mark");
        canvas.brightness = 1;

        mobDiv.children[0].appendChild(canvas);

        skillMark.onload = ()=> {
            canvas.width = skillMark.naturalWidth;
            canvas.height = skillMark.naturalHeight;

            let ctx = canvas.getContext("2d");
            ctx.drawImage(skillMark, 0, 0);
            let brightnessIncrement = 0.001;
            canvas.style.filter = "drop-shadow(0 0 0.2em #ADDE7D)";

            const FRAMES_PER_SECOND = 60;
            const interval = Math.floor(1000 / FRAMES_PER_SECOND);
            let previousTime = performance.now();

            let currentTime = 0;
            let deltaTime = 0;

            window.requestAnimationFrame(increaseGlow);
            function increaseGlow(timestamp) {
                if (!adventureVariables.fightSceneOn) {return}
                currentTime = timestamp;
                deltaTime = currentTime - previousTime;
                
                if (deltaTime > interval) {
                    canvas.brightness += brightnessIncrement;
                    if (canvas.brightness > 3) {
                        canvas.remove();
                        return;
                    }
                }
                window.requestAnimationFrame(increaseGlow);
            }
        }
    }
}

function attackAll() {
    if (!adventureVariables.fightSceneOn || advDict.rankDict[10].Locked || battleVariables.quicktimeAttack) {return}

    const cooldown = document.getElementById('adventure-cooldown-3');
    if (cooldown.amount < 100) {return}
    cooldown.amount -= 100;

    let currentATK = 10 + 6 * Math.floor(advDict.adventureRank / 4);
    if (activeLeader == "Zhongli") {currentATK *= 1.50};
    if (advDict.morale > 80) {currentATK *= 1.10};

    let attackMultiplier = comboHandler("check", 1);
    currentATK *= attackMultiplier;

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
        if (mobDiv.children[1] === undefined) {continue};
        const decoy = mobDiv.classList.contains('decoy') ? true : false;

        let critRoll = randomInteger(1,101);
        let critThreshold = -1;
        if (!advDict.rankDict[18].Locked) {
            critThreshold = 20;
        } else if (!advDict.rankDict[15].Locked) {
            critThreshold = 10;
        }

        if (battleVariables.defenseMob != null) {
            currentATK *= 0.5;
            critThreshold = -1;
            createBattleText("guard", 2000, mobDiv);
        } else if (battleVariables.burstAttack !== null) {
            currentATK *= 0.3;
        }

        const mobHealth = mobDiv.children[1];
        if (critRoll <= critThreshold && !decoy) {
            createBattleText("crit", 2000, mobDiv);
            mobHealth.health -= (currentATK * 4 * 1.5);
        } else {
            mobHealth.health -= (currentATK * 4);
        }

        if (!cooldownTime) {cooldownTime = Math.max(mobDiv.attackTime * 150, 500)}
        if (mobHealth.class != "Superboss") {
            mobDiv.children[0].classList.add("staggered");
            setTimeout(()=>{mobDiv.children[0].classList.remove("staggered")}, cooldownTime);
        } else {
            mobDiv.children[0].classList.add("damaged");
            setTimeout(()=>{mobDiv.children[0].classList.remove("damaged")}, cooldownTime);
        }
        
        if (mobHealth.health <= 0) {
            killMob(mobDiv, mobHealth);
        }

        let newHealth = Math.round(mobHealth.health/mobHealth.maxHP * 10000)/100;
        mobHealth.style.width = `${newHealth}%`
        if (mobDiv.classList.contains('megaboss')) {bossUpdate(newHealth)};

        let canvas = mobDiv.querySelector('.atk-indicator');
        if (canvas) {
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

    mobDiv.style.animation = "";
    mobDiv.children[0].style.animation = "";
    mobDiv.style.filter = "grayscale(100%) brightness(20%)";
    mobHealth.remove();

    if (battleVariables.summonTime !== null) {
        battleVariables.summonTime *= 0.5;
    }

    if (battleVariables.defenseMob == mobDiv) {
        battleVariables.defenseMob = null;
        battleVariables.guardtime = 0;
    }

    if (!advDict.rankDict[8].Locked) {
        loseHP((mobDiv.classList.contains('minion') ? 0.5 : 1), "inverse");
    }

    adventureVariables.currentEnemyAmount--;
    if (adventureVariables.currentEnemyAmount === 0) {
        winAdventure();
    }
}

function loseAdventure() {
    if (!adventureVariables.fightSceneOn) {return}
    adventureVariables.fightSceneOn = false;

    const adventureHeading = document.getElementById("adventure-header");
    adventureHeading.style.top = "10%";
    adventureHeading.innerText = "You passed out...";

    const adventureChoiceOne = document.getElementById("adv-button-one");
    adventureChoiceOne.style.display = "block";
    adventureChoiceOne.innerText = "Leave";
    adventureChoiceOne.addEventListener("click", quitButton);

    let advButton = document.getElementById("adventure-button");
    let keyNumber = advButton.key;
    function quitButton() {
        let level = imgKey[keyNumber].Level;
        let xp = 5*(2**(level >= 1 && level <= 5 ? level : 5)) * additionalXP;
        gainXP(Math.round(xp));

        quitAdventure(false);
        adventureChoiceOne.removeEventListener("click", quitButton);
    }

    const adventureVideo = document.getElementById("adventure-video");
    const targetElements = adventureVideo.querySelectorAll('.atk-indicator, .select-indicator, .raining-image, .health-bar, .health-bar-scara, .skill-mark, .counter-button, .energy-burst');
    targetElements.forEach((item) => {
        item.remove();
    });

    // const leftOverEnemy = adventureVideo.querySelectorAll('.enemyImg');
    // leftOverEnemy.forEach((ele) => {
    //     ele.style.animation = '';
    //     ele.style.filter= 'grayscale(100%) brightness(20%)';
    // })

    let adventureFight = document.getElementById("adventure-fight");
    adventureFight.style.display = "none";
    let adventureEncounter = document.getElementById("adventure-encounter");
    adventureEncounter.style.display = "flex";
    let imageGif = document.getElementById("adventure-gif");
    if (adventureScaraText) {
        imageGif.src = "./assets/expedbg/exped-scara-loss.webp"} 
    else {
        imageGif.src = "./assets/expedbg/exped-Nahida-loss.webp";
    }
    
    setTimeout(()=>{
        dodgeOn("close");
        fightBgmElement.pause();
        fightLoseElement.load();
        fightLoseElement.play();
        fightLoseElement.addEventListener('ended',()=>{
            setTimeout(()=>{if (!adventureVariables.fightSceneOn) {bgmElement.play()}},300)
        })
    },300)
}

function winAdventure() {
    if (!adventureVariables.fightSceneOn) {return}
    adventureVariables.fightSceneOn = false;

    const keyNumber = document.getElementById("adventure-button").key;
    let adventureHeading = document.getElementById("adventure-header");
    adventureHeading.style.top = "1%";
    adventureHeading.innerText = "You won! You received some loot:";
    switch (adventureVariables.specialty) {
        case 'FellBoss':
            adventureHeading.innerText = "You have stopped the rampaging Whopperflower!";
            persistentValuesDefault.fellBossDefeat = true;
            challengeNotification(({category: 'specific', value: [1, 8]}))
            break;
        case 'Unusual':
            adventureHeading.innerText = "You have survived the Unusual Hilichurl's onslaught!";
            persistentValuesDefault.unusualBossDefeat = true;
            challengeNotification(({category: 'specific', value: [2, 5]}))
            break;
        case 'Workshop':
            adventureHeading.innerText = "You successfully put down the Shouki no Kami!";
            persistentValuesDefault.workshopBossDefeat = true;
            challengeNotification(({category: 'specific', value: [3, 6]}))
            break;
        case 'Finale':
            adventureHeading.innerText = "You have stopped the Leyline Outbreak Experiment, once and for all.";
            persistentValuesDefault.finaleBossDefeat = true;
            drawAranaraWish();

            const settingsBottomBadge = document.getElementById('badges-div');
            if (!settingsBottomBadge.querySelector('medal-img-2')) {
                settingsBottomBadge.append(createMedal(2, choiceBox, mainBody, stopSpawnEvents));
                challengeNotification(({category: 'specific', value: [4, 3]}))
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

    if (!advDict.rankDict[17].Locked) {
        itemSecondThreshold = 70;
        itemFirstThreshold = 65;
    } else if (!advDict.rankDict[12].Locked) {
        itemFirstThreshold = 70;
    } else if (!advDict.rankDict[4].Locked) {
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

    const adventureRewards = document.getElementById("adventure-rewards");
    for (let key in lootArray) {
        let itemInfo = Inventory[lootArray[key]];
        inventoryAdd(lootArray[key]);

        let lootDiv = document.createElement("div");
        lootDiv = inventoryFrame(lootDiv, itemInfo, itemFrameColors);

        if (key === "Bonus" || key === "Bonus2") {
            let bonus = new Image();
            bonus.src = "./assets/expedbg/bonus.webp";
            lootDiv.append(bonus)
        }
        adventureRewards.appendChild(lootDiv);
        delete lootArray[key];
    }

    if (adventureRewards.children.length === 0) {
        adventureRewards.style.opacity = "0";
        adventureRewards.style.flexGrow = "0";
    } else {
        adventureRewards.style.opacity = "1";
        adventureRewards.style.flexGrow = "1";
    }

    const adventureChoiceOne = document.getElementById("adv-button-one");
    adventureChoiceOne.style.display = "block";
    adventureChoiceOne.innerText = "Leave";
    adventureChoiceOne.addEventListener("click", quitButton);

    const adventureVideo = document.getElementById('adventure-video');
    const nutReward = document.createElement('p');
    nutReward.classList.add("adventure-currency");
    nutReward.value = saveValues["dps"] * 60 * 3 * (1.5**(imgKey[keyNumber].Level)) * randomInteger(90,100) / 100;

    if (imgKey[keyNumber].Level === 5) {
        nutReward.gValue = randomInteger(3,10)*3 + advDict.adventureRank;
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
    adventureVideo.append(nutReward);

    function quitButton() {
        saveValues["realScore"] += nutReward.value;
        nutReward.remove();

        quitAdventure(true);
        charScan();
        updateMorale("recover",randomInteger(2,6));

        let level = imgKey[keyNumber].Level;
        gainXP(Math.round(15 * (2**(level >= 1 && level <= 5 ? level : 5)) * additionalXP));

        adventureChoiceOne.removeEventListener("click", quitButton);
        
        if (adventureRewards.children.length >= 0) {
            newPop(1);
            sortList("table2");
            nutReward.gValue === 0 ? currencyPopUp("items") : currencyPopUp("items", 0, "nuts", nutReward.gValue);
        }

        let rewardChildren = adventureRewards.children;
        while (rewardChildren.length > 0) {
            rewardChildren[0].remove();
        }
    }

    const targetElements = adventureVideo.querySelectorAll('.atk-indicator, .select-indicator, .raining-image, .health-bar, .health-bar-scara, .skill-mark, .counter-button, .energy-burst');
    targetElements.forEach((item) => {
        item.remove();
    });

    const leftOverEnemy = adventureVideo.querySelectorAll('.enemy');
    leftOverEnemy.forEach((ele) => {
        ele.style.filter = 'grayscale(100%) brightness(20%)';
    })

    const leftOverImg = adventureVideo.querySelectorAll('.enemyImg');
    leftOverImg.forEach((ele) => {
        ele.style.animation = '';
    })

    const adventureFight = document.getElementById("adventure-fight");
    adventureFight.style.display = "none";
    const adventureEncounter = document.getElementById("adventure-encounter");
    adventureEncounter.style.display = "flex";

    setTimeout(()=>{
        fightBgmElement.pause();
        fightWinElement.load();
        fightWinElement.play();
        fightWinElement.addEventListener('ended',()=>{
            setTimeout(()=>{if (!adventureVariables.fightSceneOn) {bgmElement.play()}},300)
        })
    },300)
}

function quitAdventure(wonBattle) {
    let worldQuestRoll = randomInteger(1,101) - luckRate;
    if (worldQuestRoll < 30) {
        spawnWorldQuest();
    }

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
        }
    }
    
    adventureVariables = {};
    battleVariables = {};
    let adventureArea = document.getElementById("adventure-area");
    adventureArea.style.zIndex = -1;
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

    if (adventureTreeDefense) {
        adventureTreeDefense = false;
        enemyBlock(true, battleVariables.healthLost, battleVariables.maxHealth);
    }
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
    goldenNutUnlocked = true;
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
    wishButton.append(wishButtonImg, wishButtonText)
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
            aranaraText.innerText = '?'
        } else if (i < 7) {
            aranaraText.innerText = '!'
        } else {
            aranaraText.innerText = '¿'
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
            wishNpsDisplay.innerText = `Next character's NpS: ${abbrNum(Math.round(saveValues["dps"] * 0.01 * (STARTINGWISHFACTOR + wishMultiplier)/2500 + 1))}`;
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
                unlockExpedition(5,expeditionDict);
                clearExped();
                newPop(2);
            } else {
                randomWishHero = randomInteger(WISHHEROMIN, WISHHEROMAX);
            }
        
            if (upgradeDict[randomWishHero].Purchased >= -1) {
                continue;
            } else {
                let upgradeDictTemp = upgradeDict[randomWishHero];
                upgradeDictTemp.Purchased = -1;
                upgradeDictTemp["Factor"] = Math.round(saveValues["dps"] * 0.01 * (STARTINGWISHFACTOR + wishMultiplier)/2500 + 1);
                upgradeDictTemp["BaseCost"] = Math.round(saveValues["dps"] * (65) * wishPower + 1);
                upgradeDictTemp["BaseFactor"] = upgradeDictTemp["Factor"];
                upgradeDictTemp["Contribution"] = 0;
                
                wishMultiplier++;
                saveValues["wishCounterSaved"]++;
                if (saveValues["wishCounterSaved"] >= 10) {challengeNotification(({category: 'specific', value: [1, 2]}));}

                refresh();
                newPop(0);

                let mailImageTemp = document.getElementById("mailImageID");
                mailImageTemp.style.opacity = 0;
                if (settingsValues.showWishAnimation) {
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
    preloadStart.fetch([`./assets/tooltips/letter-${nameTemp}.webp`])
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
    tabDiv.classList.add('flex-row');
    tabDiv.active;

    let achievementTab = document.createElement('img');
    achievementTab.src = './assets/achievement/achieve-tab1-clicked.webp';
    let challengeTab = document.createElement('img');
    challengeTab.src = './assets/achievement/achieve-tab2.webp';

    achievementTab.addEventListener('click',()=>{
        changeAchTab(achievementTab);
    })

    challengeTab.addEventListener('click',()=>{
        changeAchTab(challengeTab);
    })

    table5.style.display = "flex";

    let challengeDiv = document.getElementById('challenge-div');
    challengeDiv.classList.add("flex-column");
    challengeDiv.innerText = "\n[Locked. Come back later!]";
    challengeDiv.id = 'challenge-div';

    if (!persistentValues.tutorialAscend) challengeDiv.style.color = '#343030';
    if (persistentValues.tutorialAscend) {
        createChallenge();
    }
    
    function changeAchTab(ele) {
        if (tabDiv.active !== ele) {
            achievementTab.src = './assets/achievement/achieve-tab1.webp';
            challengeTab.src = './assets/achievement/achieve-tab2.webp';
            tabDiv.active = ele;

            if (ele === achievementTab) {
                achievementTab.src = './assets/achievement/achieve-tab1-clicked.webp';
                table5.style.display = "flex";
                challengeDiv.style.display = "none";
            } else {
                challengeTab.src = './assets/achievement/achieve-tab2-clicked.webp';
                table5.style.display = "none";
                challengeDiv.style.display = "flex";
            }
        }
    }

    tabDiv.active = achievementTab;
    tabDiv.append(achievementTab,challengeTab)
    table5Image.append(tabDiv);
}

function createChallenge() {
    if (document.getElementById('tier-button-0')) {return}

    const challengeDiv = document.getElementById('challenge-div');
    challengeDiv.innerText = '';
    challengeDiv.style.color = '#D9BD85';

    const romanNum = ["I: Initiate's Journey",'II: Skillful Endeavors','III: Challenging Pursuits',"IV: Elites' Quest",'V: Ultimate Challenge'];
    let challengeDict = persistentValues.challengeCheck;

    for (let i = 0; i < challengeInfo.length; i++) {
        const tierButton = document.createElement("div");
        tierButton.classList.add('tier-button');
        tierButton.id = `tier-button-${i}`;
        tierButton.innerText = 'Tier ' + romanNum[i];

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
                challengeButton.innerText = 'Claimed';
                challengeButton.classList.add('challenge-button-claimed');
            }

            challengeInfoDiv.append(challengeTitle, challengeDesc)
            challengeContainer.append(challengeButton, challengeInfoDiv);
            tierContainer.append(challengeContainer)
        }

        tierButton.addEventListener("click", () => {
            if (tierContainer.style.display === 'none') {
                tierContainer.style.display = 'block';
            } else {
                tierContainer.style.display = 'none';
            }
        })

        challengeDiv.append(tierButton,tierContainer)
    }
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
            achievementElement.load();
            achievementElement.play();
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
            challengeButton.innerText = 'Claimed';
            challengeButton.classList.add('challenge-button-unclaimed');

            const challengeTitle = document.getElementById(`challenge-title-${posArray[0]}-${posArray[1]}`)
            challengeTitle.innerText = `${challengeInfo[posArray[0]][posArray[1]].title}`;
        });

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
        challengePopUp.append(challengePopText)
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
    tooltipButton.addEventListener("click",()=>{tooltipFunction()})

    table6Background = document.createElement("img");
    table6Background.src = "./assets/tooltips/background.webp"
    table6Background.classList.add("table6-background");
    toolInfo.append(toolImgContainer,tooltipText,tooltipExtraImg);
    table6.append(tooltipName, toolInfo, tooltipLore, upgradeSelection, table6Background, tooltipButton);
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
        
        let itemButton = document.getElementById(itemTooltip);
        let inventoryCount = InventoryMap.get(itemTooltip);
        inventoryCount--;
        InventoryMap.set(itemTooltip,inventoryCount);

        persistentValues.itemsUsedValue++;

        if (inventoryCount > 0) {
            changeTooltip(Inventory[itemTooltip],"item",itemTooltip);
        } else if (inventoryCount <= 0) {
            let nextButton = itemButton.nextSibling;
            itemButton.remove();
            if (nextButton) {
                let idNum = parseInt(nextButton.id);
                itemTooltip = idNum;
                changeTooltip(Inventory[idNum],"item",idNum);
                nextButton.classList.add("inventory-selected");
            } else {
                itemTooltip = -1;
                clearTooltip();
            }
        }
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
            addShop();
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
        let time_passed = Math.floor(getTime() - parseInt(storeInventory.storedTime));
        shopTimerElement.innerText = "Inventory resets in: " +Math.floor(SHOPCOOLDOWN-time_passed)+ " minutes";
        if (time_passed >= SHOPCOOLDOWN) {
            refreshShop(getTime());
        }
    }
}

// ADDS MID-GAME SHOP TAB
function addShop() {
    let tabFlex = document.getElementById("flex-container-TAB");
    let tabButton = document.createElement("div");
    tabButton.classList += " tab-button-div";

    let tabButtonImage = document.createElement("img");
    tabButtonImage.src = "./assets/icon/tab"+ (7) +".webp";
    tabButtonImage.classList += " tab-button";
    tabButtonImage.classList.add("darken")
    tabButton.id = "tab-" + (5);

    tabButton.addEventListener('click', () =>{
            tabChange(6);
    })

    tabButton.appendChild(tabButtonImage);
    tabFlex.appendChild(tabButton);
}

function setShop(type) {
    table7.classList.add("table-without-tooltip");
    let shopImg = document.createElement("img");
    shopImg.src = "./assets/icon/shop-start.webp";

    shopTimerElement = document.createElement("div");
    shopTimerElement.classList.add("flex-column","store-timer","background-image-cover");
    shopTimerElement.id = "shop-timer";
    let minutesPassed = (getTime() / (1000 * 60));
    shopTimerElement.innerText = "Inventory resets in: " + (SHOPCOOLDOWN - (storeInventory.storedTime - minutesPassed)) + " minutes";

    let shopDiv = document.createElement("div");
    shopDiv.classList.add("store-div");
    shopDiv.id = "shop-container";

    if (type === "load") {
        for (let i = Object.keys(storeInventory).length - 2; i > 0; i--) {
            loadShopItems(shopDiv, i, storeInventory[i]);
        }
    } else if (type === "add") {
        storeInventory.storedTime = getTime();
        let i = 10;
        let upgradedShop = persistentValues.tutorialAscend === true;

        while (i--) {
            createShopItems(shopDiv, i, drawShopItem(i, upgradedShop));
        }
        saveData(true);
    }

    let shopDialogueDiv = document.createElement("div");
    shopDialogueDiv.classList.add("flex-row","store-dialog");

    let shopDialogueButton = document.createElement("div");
    shopDialogueButton.classList.add("flex-row","store-buy");
    shopDialogueButton.innerText = "Confirm Purchase";
    shopDialogueButton.id = "shop-confirm";
    let shopDialogueText = document.createElement("div");
    shopDialogueText.classList.add("flex-column");
    shopDialogueText.id = "table7-text";

    shopDialogueDiv.append(shopDialogueText,shopDialogueButton);
    table7.append(shopImg,shopTimerElement,shopDiv,shopDialogueDiv);
}

var shopId = null;
function buyShop(id,shopCost) {
    let dialog = document.getElementById("table7-text");
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
        let confirmButtonNew = confirmButton.cloneNode(true);
        confirmButton.parentNode.replaceChild(confirmButtonNew, confirmButton);
        confirmButton = confirmButtonNew;
    }

    if (shopId == id) {
        if (persistentValues.tutorialAscend) {
            dialog.innerText = "Dori's Deals now come with extra value!";
        } else {
            dialog.innerText = "Any questions or troubles? I'm here to personally assist you!";
        }
        
        shopId = null;
        let confirmButtonNew = confirmButton.cloneNode(true);
        confirmButton.parentNode.replaceChild(confirmButtonNew, confirmButton);
    } else {
        if (persistentValues.tutorialAscend) {
            dialog.innerText = "Maybe if you beg, I'll allow a refund within 24 hours! Hehe, just kidding."
        } else {
            dialog.innerText = "Are you sure? Remember, no refunds!";
        }
        
        button.classList.add("shadow-pop-tr");
        confirmButton.addEventListener("click", function() {
            confirmPurchase(shopCost,id);
        })
        shopId = id;
    }
}

function refreshShop(minutesPassed) {
    shopTime = minutesPassed;
    shopId = null;

    let shopContainer = document.getElementById("shop-container");
    shopContainer.innerHTML = "";
    let i = 10;
    let upgradedShop = persistentValues.tutorialAscend === true;

    while (i--) {
        createShopItems(shopContainer, i, drawShopItem(i, upgradedShop));
    }
    storeInventory.storedTime = getTime();
}

function drawShopItem(i, upgradedShop = false) {
    let inventoryNumber;
    if (i >= 7 && i <= 9) {
        if (upgradedShop) {
            if (i === 9) {
                inventoryNumber = 4015;
            } else {
                inventoryNumber = 4014;
            }
        } else {
            inventoryNumber = inventoryDraw("talent", 2, 4, "shop");
        }
    } else if (i === 6) {
        inventoryNumber = randomInteger(4011,4014);
    } else if (i === 5) {
        if (upgradedShop) {
            inventoryNumber = 4018;
        } else if (saveValues["wishUnlocked"] === true) {
            inventoryNumber = 4010;
        } else {
            inventoryNumber = inventoryDraw("gem", 3, 6, "shop");
        }
    } else if (i >= 3 && i <= 4) {
        if (upgradedShop) {
            if (i === 3) {
                inventoryNumber = 4017;
            } else {
                inventoryNumber = 4016;
            }
        } else {
            inventoryNumber = inventoryDraw("gem", 3, 6, "shop");
        }
    } else {
        inventoryNumber = inventoryDraw("weapon", 5, 6, "shop");
    }

    return inventoryNumber;
}

function confirmPurchase(shopCost,id) {
    let mainButton = document.getElementById(id);
    let dialog = document.getElementById("table7-text");
    if (saveValues.primogem >= shopCost) {
        let saveId = id.split("-")[1];
        let itemId = id.split("-")[2];
        
        newPop(1);
        inventoryAdd(itemId);
        sortList("table2");
        mainButton.classList.remove("shadow-pop-tr");
        mainButton.classList.add("purchased");
        saveValues.primogem -= shopCost;

        let confirmButton = document.getElementById("shop-confirm");
        let confirmButtonNew = confirmButton.cloneNode(true);
        confirmButton.parentNode.replaceChild(confirmButtonNew, confirmButton);
        if (persistentValues.tutorialAscend) {
            dialog.innerText = "See you again soon! Hehe."
        } else {
            dialog.innerText = "Hehe, you've got good eyes.";
        }

        shopElement.load();
        shopElement.play();

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
    } else {
        if (persistentValues.tutorialAscend) {
            dialog.innerText = "Now, now, I can't make it any cheaper than that. It'll be daylight robbery!"
        } else {
            dialog.innerText = "Hmph, come back when you're a little richer."
        }
        return;
    }
}

function createShopItems(shopDiv, i, inventoryNumber) {
    let shopButton = document.createElement("div");
    shopButton.classList.add("flex-column","shop-button");
    let inventoryTemp = Inventory[inventoryNumber];

    let shopButtonImage = document.createElement("img");
    shopButtonImage.src = "./assets/tooltips/inventory/" + inventoryTemp.File + ".webp";

    let shopButtonImageContainer = document.createElement("div");
    shopButtonImageContainer.classList.add("flex-column","shop-button-container");
    shopButtonImageContainer.style.background = "url(./assets/frames/background-" + inventoryTemp.Star + ".webp)";
    shopButtonImageContainer.style.backgroundSize = "cover";
    shopButtonImageContainer.style.backgroundPosition = "center center";
    shopButtonImageContainer.style.backgroundRepeat = "no-repeat";
    
    let shopButtonText = document.createElement("div");
    shopButtonText.classList.add("flex-row","shop-button-text");

    let shopCost = 0;
    switch (inventoryTemp.Star) {
        case 2:
            shopCost = Math.round(randomInteger(35,55) * costDiscount / 5) * 5;
            break;
        case 3: 
            shopCost = Math.round(randomInteger(70,100) * costDiscount / 5) * 5;
            break;
        case 4:
            shopCost = Math.round(randomInteger(140,210) * costDiscount / 5) * 5;
            break;
        case 5:
            shopCost = Math.round(randomInteger(300,400) * costDiscount / 5) * 5;
            break;
        case 6:
            shopCost = Math.round(randomInteger(600,750) * costDiscount / 5) * 5;
            break;
        default:
            console.error("Shop error: Invalid shop cost");
            break;
    }

    let shopButtonPrimo = document.createElement("img");
    shopButtonPrimo.classList.add("shop-button-primo");
    shopButtonPrimo.src = "./assets/icon/primogemIcon.webp";
    shopButtonText.innerText = shopCost;
    shopButtonText.appendChild(shopButtonPrimo);

    shopButton.id = ("shop-" + (i + 1) + "-" + inventoryNumber + "-" + shopCost);
    shopButton.addEventListener("click", function() {
        buyShop(shopButton.id,shopCost)
    })
    
    shopButtonImageContainer.appendChild(shopButtonImage);
    shopButton.append(shopButtonImageContainer,shopButtonText);
    shopDiv.append(shopButton);

    storeInventory[i+1].Purchased = false;
    storeInventory[i+1].Item = inventoryNumber;
    storeInventory[i+1].Cost = shopCost;

    return shopDiv;
}

function loadShopItems(shopDiv, i, inventoryArray) {
    let purchased = inventoryArray.Purchased;
    let shopCost = inventoryArray.Cost;
    let inventoryNumber = inventoryArray.Item;

    let shopButton = document.createElement("div");
    shopButton.classList.add("flex-column","shop-button");
    let inventoryTemp = Inventory[inventoryNumber];

    let shopButtonImage = document.createElement("img");
    shopButtonImage.src = "./assets/tooltips/inventory/"+ inventoryTemp.File+ ".webp";

    let shopButtonImageContainer = document.createElement("div");
    shopButtonImageContainer.classList.add("flex-column","shop-button-container");
    shopButtonImageContainer.style.background = "url(./assets/frames/background-" +inventoryTemp.Star+ ".webp)";
    shopButtonImageContainer.style.backgroundSize = "cover";
    shopButtonImageContainer.style.backgroundPosition = "center center";
    shopButtonImageContainer.style.backgroundRepeat = "no-repeat";
    
    let shopButtonText = document.createElement("div");
    shopButtonText.classList.add("flex-row","shop-button-text");

    let shopButtonPrimo = document.createElement("img");
    shopButtonPrimo.classList.add("shop-button-primo");
    shopButtonPrimo.src = "./assets/icon/primogemIcon.webp";
    shopButtonText.innerText = shopCost;
    shopButtonText.appendChild(shopButtonPrimo);

    shopButton.id = ("shop-" + i + "-" + inventoryNumber + "-" + shopCost);
    if (purchased == false) {
        shopButton.addEventListener("click", function() {
            buyShop(shopButton.id,shopCost)
        })
    } else {
        shopButton.classList.add("purchased");
    }
    
    shopButtonImageContainer.appendChild(shopButtonImage);
    shopButton.append(shopButtonImageContainer,shopButtonText);
    shopDiv.append(shopButton);
    return shopDiv;
}

//------------------------------------------------------------------------ GOLDEN NUT STORE ------------------------------------------------------------------------//
// COSTS OF NUT PURCHASE
function nutCost(id) {
    let amount = persistentValues["upgrade"+id].Purchased;
    let scaleCeiling = permUpgrades[id].Max;
    let cost;

    if (scaleCeiling === 50) {
        cost = Math.ceil((amount)**2.6) + 1;
    } else if (scaleCeiling === 25) {
        cost = Math.ceil((amount)**3.3) + 1;
    }

    return cost;
}

// ADDS ACCESS BUTTON AFTER 1 NUT
function addNutStore() {
    createTranscendMenu();
    let preloadArray = [];
    for (let i=1; i < 8; i++) {
        preloadArray.push(`./assets/tooltips/nut-shop-${1}.webp`);
    }
    preloadStart.fetch(preloadArray)

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

    

    let nutStoreButton = document.createElement("button");
    nutStoreButton.classList = "nut-store-access";
    nutStoreButton.addEventListener("click",()=>{
        calculateGoldenCore();
        universalStyleCheck(nutStoreTable,"display","flex","none");
    })

    leftDiv.append(nutStoreButton);

    let len = (getHighestKey(permUpgrades) + 1);
    for (let i = 1; i < len; i++) {
        let nutShopItem = document.createElement("div");
        nutShopItem.classList.add("nut-shop-button","flex-row");
        nutShopItem.id = "nut-shop-" + i;

        let nutShopTitle = document.createElement("p");
        nutShopTitle.innerText = permUpgrades[i]["Name"];
        let nutShopButton = document.createElement("div");
        nutShopButton.classList.add("flex-column");

        let nutShopButtonTop = document.createElement("p");
        nutShopButtonTop.innerText = `Upgrade`;
        let nutShopButtonBottom = document.createElement("div");
        nutShopButtonBottom.innerText = `${abbrNum(nutCost(i),2,true)}`;
        let nutShopMail = new Image();
        nutShopMail.src = "./assets/icon/core.webp";
        nutShopButtonBottom.appendChild(nutShopMail);

        let nutShopLevel = document.createElement("p");
        if (permUpgrades[i].Cap === true) {
            if (persistentValues["upgrade"+i].Purchased >= permUpgrades[i].Max) {
                nutShopLevel.innerText = `Level MAX`;
                nutShopButtonBottom.innerText = "MAXED";
            } else {
                nutShopLevel.innerText = `Level ${persistentValues["upgrade"+i].Purchased}`;
                nutShopButton.addEventListener("click",()=>{nutPurchase(nutShopItem.id)});
            }
        } else {
            nutShopLevel.innerText = `Level ${persistentValues["upgrade"+i].Purchased}`;
            nutShopButton.addEventListener("click",()=>{nutPurchase(nutShopItem.id)})
        }
        
        let nutShopImg = new Image();
        nutShopImg.src = "./assets/tooltips/nut-shop-" +i+ ".webp";
        let nutShopDesc = document.createElement("p");
        if (permUpgrades[i]["zeroDescription"] !== undefined && persistentValues["upgrade"+i].Purchased <= 0) {
            nutShopDesc.innerText = `${permUpgrades[i]["zeroDescription"]}
                                    (Effect: ${permUpgrades[i].Effect*persistentValues["upgrade"+i].Purchased}%)`;
        } else {
            nutShopDesc.innerText = `${permUpgrades[i]["Description"]}
                                    (Effect: ${permUpgrades[i].Effect*persistentValues["upgrade"+i].Purchased}%)`;
        }
        
        nutShopButton.append(nutShopButtonTop,nutShopButtonBottom);
        nutShopItem.append(nutShopTitle,nutShopLevel,nutShopImg,nutShopDesc,nutShopButton);
        nutShopDiv.appendChild(nutShopItem);
    }

    nutShopDiv.style.display = "flex";
    nutAscend.style.display = "none";
    nutTranscend.classList.add("nut-transcend","flex-column");
    const titleText = document.createElement("p");
    titleText.innerText = "Do you wish to turn \n back time and transcend?";

    const bodyText = document.createElement("div");
    bodyText.classList.add("flex-row")
    const bodyTextLeft = document.createElement("p");
    bodyTextLeft.innerText = `You lose: \n\n All Nuts, \n All Items, \n Energy, \n Primogems`;
    bodyTextLeft.classList.add("flex-column");
    const bodyTextRight = document.createElement("p");
    bodyTextRight.id = "transcend-display";
    bodyTextRight.classList.add("flex-column");
    bodyText.append(bodyTextLeft,bodyTextRight);

    const bodyTextBottom = document.createElement("p");
    bodyTextBottom.innerText = "Gain more by upgrading heroes, getting \nachievements & nuts (golden or otherwise).";

    const transendHelp = document.createElement("button");
    const transcendHelpbox = document.createElement("p");
    transcendHelpbox.style.display = "none";
    transcendHelpbox.innerText = `What is the Golden Core amount affected by? \n 
                                Character Ascensions (V. High Priority)
                                Character Upgrades (V. High Priority)\n------------------------------
                                Character Levels (High Priority)
                                Achievements (High Priority)\n------------------------------
                                Golden Nuts (Low Priority)
                                Regular Nuts (Low Priority)`;

    transendHelp.addEventListener("click",()=>{
        if (transcendHelpbox.style.display == "none") {
            transcendHelpbox.style.display = "block";
            if (!nutTranscend.classList.contains("transcend-dark")) {
                nutTranscend.classList.add("transcend-dark");
            }
        } else {
            transcendHelpbox.style.display = "none";
            if (nutTranscend.classList.contains("transcend-dark")) {
                nutTranscend.classList.remove("transcend-dark");
            }
        }
    });

    const transcendStats = createDom('button', { innerText:'Stats' })
    transcendStats.addEventListener('click', () => {
        const mostContributeDict = calculateGoldenCore('highestAmount');
        let listText;
        if (mostContributeDict !== 'Nothing') {
            let sortedEntries = Object.entries(mostContributeDict).sort((a, b) => b[1] - a[1]);
            sortedEntries = sortedEntries.slice(0, 5);
           
            let listInnerText = '';
            for (let i = 0; i < sortedEntries.length; i++) {
                listInnerText += `${(i + 1)}. ${sortedEntries[i][0]}: ${abbrNum(sortedEntries[i][1],2,true)}\n`;
            }
            listText = createDom('p', { id:'notif-list', innerText: listInnerText });
        } else {
            listText = createDom('p', { id:'notif-list', innerText: 'Nothing...' });
        }

        choiceBox(nutStoreTable, {text: 'Top Contribution to \nCore Amounts:'}, stopSpawnEvents, ()=>{}, null, listText, ['notif-ele']);
    })


    const trascendButton = document.createElement("button");
    trascendButton.innerText = "Transcend";
    trascendButton.addEventListener("click",()=>{
        calculateGoldenCore();
        toggleTranscendMenu();
    })

    const transcendBottom = createDom('div', {
        class: ['flex-row', 'transcend-bottom'],
        child: [transcendStats, trascendButton]
    })

    nutTranscend.append(titleText,bodyText,bodyTextBottom,transcendBottom,transcendHelpbox,transendHelp);

    nutStoreTable.append(shopHeader,nutTranscend,nutShopDiv,nutAscend,nutButtonContainer,nutStoreCurrency);
    mainTable.appendChild(nutStoreTable);
    calculateGoldenCore();

    if (persistentValues.tutorialAscend) {
        createAscend();
    }
}

function createAscend() {
    if (document.getElementById('ascend-text')) {return};

    let ascend = document.getElementById('nut-shop-ascend');
    ascend.innerText = '';

    let ascendText = document.createElement('p');
    ascendText.innerText = "Mark characters for Ascension";
    ascendText.id = 'ascend-text'

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
    let ascendEle = new Image();
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
                let charImg = new Image();
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
    let heroCount = 1;

    const sortByNestedValues = (obj) => {
        const filteredEntries = Object.entries(obj).filter(([, value]) => value.Row >= 0 && value.Purchased >= 1);
        const sortedEntries = filteredEntries.sort(([, a], [, b]) => a.Row - b.Row);
        return Object.fromEntries(sortedEntries);
    }

    const filteredDict = sortByNestedValues(upgradeDict)
    for (let key in filteredDict) {
        let corePerHero = 0;
        corePerHero += (Math.floor(upgradeDict[key].Purchased / 25) + 1);
        let name = upgradeInfo[parseInt(key)].Name;

        if (upgradeDict[key].Purchased <= 0) {continue}
        heroCount++;

        let upgradeCore = 1;
        for (let Nestedkey in upgradeDict[key].milestone) {
            if (upgradeDict[key].milestone[Nestedkey]) {
                upgradeCore += 1 * Math.max(upgradeCore / 2, 1);
            }
        }

        corePerHero *= upgradeCore;
        corePerHero *= (1 + persistentValues.ascendDict[name] * 0.5);
        corePerHero *= (1 + Math.floor(heroCount / 4.5)**1.6);

        goldenNutValue += Math.round(corePerHero);
        contributionDict[name] = Math.round(corePerHero);
    }

    if (goldenNutValue < 100) {goldenNutValue = 0}
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

function createTranscendMenu() {
    let deleteMenu = document.getElementById("confirm-box")
    let transcendMenu = deleteMenu.cloneNode(true);
    transcendMenu.firstChild.innerText = "Are you sure? Transcending cannot be undone.";
    transcendMenu.id = "transcend-menu";

    transcendMenu.children[1].children[0].addEventListener("click",()=>{
        transcendFunction();
    })
    transcendMenu.children[1].children[1].addEventListener("click",()=>{
        transcendMenu.style.zIndex = -1;
    })

    mainBody.appendChild(transcendMenu);
}

let transcendDelay = null;
function toggleTranscendMenu(forceClose) {
    toggleSettings(true);
    deleteConfirmMenu("close","loaded");
    let transcendMenu = document.getElementById("transcend-menu");
    if (transcendMenu.style.zIndex == -1) {
        transcendMenu.style.zIndex = 200;

        if(transcendDelay != null) {clearTimeout(transcendDelay)};
        transcendDelay = setTimeout(()=>{
            transcendDelay = null;
            if (transcendMenu.style.zIndex != -1) transcendMenu.style.zIndex = -1;
        },6000);
    } else {
        transcendMenu.style.zIndex = -1;
    }
}

function transcendFunction() {
    let forceStop = true; 
    if (forceStop) {
        preventSave = true;
        forceStop = false;

        persistentValues.transcendValue++;
        saveData(true);
        drawUI.preloadImage(1,"transcend",true);

        setTimeout(()=>{
            let clearPromise = new Promise(function(myResolve, myReject) {
                localStorage.clear();
                if (localStorage.length === 0) {
                    myResolve(); 
                } else {
                    myReject();
                }
            });
            
            clearPromise.then(
                function(value) {
                    let overlay = document.getElementById("loading");
                    overlay.style.zIndex = 100000;
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
                    localStorage.setItem("settingsValues", JSON.stringify(settingsValues));
                    localStorage.setItem("persistentValues", JSON.stringify(persistentValues));
                    localStorage.setItem("advDictSave", JSON.stringify(advDict));

                    let newSaveValues = saveValuesDefault;
                    newSaveValues.goldenTutorial = true;
                    newSaveValues.versNumber = DBNUBMER;
                    localStorage.setItem("saveValuesSave", JSON.stringify(newSaveValues));
                    
                    setTimeout(()=>{
                        location.reload();
                    },3000);
                },
                function(error) {console.error("Error clearing local data")}
            ); 
        },500);
    }
}

function nutPurchase(fullId) {
    let id = fullId.split("-")[2];
    let cost = nutCost(id);
    if (persistentValues.goldenCore >= cost) {
        upgradeElement.load();
        upgradeElement.play();
        persistentValues["upgrade"+id].Purchased++;
        persistentValues.goldenCore -= cost;

        let childArray = document.getElementById(fullId).children;
        childArray[1].innerText = `Level ${persistentValues["upgrade"+id].Purchased}`;
        childArray[3].innerText = `${permUpgrades[id]["Description"]}
                                    (Effect: ${permUpgrades[id]["Effect"] * persistentValues["upgrade"+id]["Purchased"]}%)`;
        childArray[4].children[1].innerHTML = childArray[4].children[1].innerHTML.replace(/[^<]+</g, `${abbrNum(nutCost(id),2,true)}<`);
        updateCoreCounter();
        specialValuesUpgrade(false,parseInt(id));

        if (permUpgrades[id].Cap === true) {
            if (persistentValues["upgrade"+id].Purchased >= permUpgrades[id].Max) {
                childArray[1].innerText = `Level MAX`;
                let buttonNew = childArray[4].cloneNode(true);
                childArray[4].parentNode.replaceChild(buttonNew, childArray[4]);
                childArray[4].children[1].innerText = "MAXED";
            } else {
                childArray[1].innerText = `Level ${persistentValues["upgrade"+id].Purchased}`;
            }
        } else {
            childArray[1].innerText = `Level ${persistentValues["upgrade"+id].Purchased}`;
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
            customTutorial("goldenNut", 4);
            const settingsBottomBadge = document.getElementById('badges-div');
            if (!settingsBottomBadge.querySelector('medal-img-1')) {
                settingsBottomBadge.append(createMedal(1, choiceBox, mainBody, stopSpawnEvents))
            }
        },3000);
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

    const sandImg = new Image();
    sandImg.src = './assets/tree/sand.webp';
    sandImg.classList.add('tree-sand');

    const treeContainer = document.createElement('div');
    treeContainer.classList.add('tree-container');
    treeContainer.id = 'tree-container';
    const treeImg = new Image();
    let treeLevel = saveValues.treeObj.level;
    treeImg.id = 'tree-img';
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
    const treeNut = new Image();
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

    function createCloud(range) {
        let cloudImg = new Image();
        cloudImg.classList.add('cloud');
        cloudImg.style.top = (randomInteger(range * 100, (range + 1) * 100)/10) + '%';
        cloudImg.style.animation = `slide ${randomInteger(2000,9000)/100}s linear`;
        cloudImg.style.width = `${randomInteger(150,350)/10}%`;
        cloudImg.src = `assets/tree/cloud${randomInteger(1,5)}.webp`;

        cloudImg.addEventListener('animationend',() => {
            cloudImg.style.animation = 'unset';
            void cloudImg.offsetWidth;
            cloudImg.style.top = (randomInteger(range * 100, (range + 1) * 100)/10) + '%';
            cloudImg.style.animation = `slide ${randomInteger(2000,9000)/100}s linear`;
            cloudImg.style.width = `${randomInteger(150,350)/10}%`;
        })
        treeSide.appendChild(cloudImg);
    }

    const cloudArray = [0,0.5,1,1.5,2.5,4];
    cloudArray.forEach((num) => {
        createCloud(num);
    })

    treeContainer.appendChild(treeImg);
    treeSide.append(treeProgressBar,sandImg,treeContainer,treeHealthContainer,treeProgressValue);

    const palmText = document.createElement('p');
    palmText.id = 'palm-text';
    palmText.innerText = `Palm Energy: ${saveValues.treeObj.energy}`;
    const optionsContainer = document.createElement('div');
    optionsContainer.id = 'options-container';
    treeOptions(treeLevel === 0 ? false : true, optionsContainer)

    let container = document.createElement('div');
    container.classList.add('flex-row');
    let element = rollArray(boxElement,1);
    container.style.background = `url(./assets/tooltips/elements/nut-${element.toLowerCase()}.webp) no-repeat center center/contain`;
    
    treeTable.append(palmText, optionsContainer);
    offerBox(treeTable, optionsContainer);
    leylineCreate(treeTable, optionsContainer);

    leftDiv.appendChild(treeSide);
    mainTable.appendChild(treeTable);

    let nutStoreButton = document.createElement("button");
    nutStoreButton.classList.add("tree-access","nut-store-access");
    nutStoreButton.addEventListener("click", () => {
        universalStyleCheck(treeTable,"display","none","flex",true);
        universalStyleCheck(treeSide,"display","none","flex",true);
        universalStyleCheck(document.getElementById('nut-store-table'),"display","flex","none",true);
    })
    leftDiv.appendChild(nutStoreButton);

    updateTreeValues(treeLevel === 0 ? true : false);
    if (saveValues.treeObj.defense === 'block') {
        enemyBlock();
    } else if (treeLevel === 5) {
        treeOptions(true, document.getElementById('options-container'), true);
    }

    populateTreeItems();
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

    const coreContainerImg = new Image();
    coreContainerImg.src = "./assets/icon/core.webp"
    const coreContainerText = document.createElement('p');
    coreContainerText.innerText = abbrNum(saveValues.treeObj.offer[0], 2, true);

    const plusImage = new Image();
    plusImage.src = './assets/icon/plus.webp';

    coreContainer.append(coreContainerImg, coreContainerText);
    treeItem.append(coreContainer, plusImage);

    const itemOfferArray = [];
    for (let i = 1; i < saveValues.treeObj.offer.length; i++) {
        let itemContainer = document.createElement('div');
        itemContainer = inventoryFrame(itemContainer, Inventory[saveValues.treeObj.offer[i]], itemFrameColors);
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
        
        itemContainer.append(itemAmount)
        itemOfferArray.push(itemContainer)
        treeItem.append(itemContainer);
    }
}

function offerBox(treeTable, optionsContainer) {
    const treeOffer = document.createElement('div');
    treeOffer.id = 'tree-offer-container';
    treeOffer.classList.add('flex-column');
    treeOffer.style.display = 'none';

    const nutStoreCurrency = document.createElement("div");
    nutStoreCurrency.id = "tree-store-currency";
    nutStoreCurrency.classList.add("flex-row");
    nutStoreCurrency.innerText = abbrNum(persistentValues["goldenCore"],2,true);
    const nutStoreCurrencyImage = document.createElement("img");
    nutStoreCurrencyImage.src = "./assets/icon/core.webp";
    nutStoreCurrency.appendChild(nutStoreCurrencyImage);

    const treeOfferText = document.createElement('p');
    treeOfferText.innerHTML = `The Tree wishes for power, pick one item to sacrifice.
                               <br><span style='font-size: 0.6em'>Note: Anytime you receive new loot, you have a higher chance to <br>get these items, which can increased through
                                your <span style='color:#b39300'>luck rate</span>!</span>
                                `;
    const treeItem = document.createElement('div');
    treeItem.id = 'tree-offer-items';
    treeItem.classList.add('flex-row');

    const treeMissingText = document.createElement('p');
    treeMissingText.id = 'tree-missing-text';

    const buttonContainer = document.createElement('container');
    buttonContainer.classList.add('flex-row')

    const backButton = document.createElement('button');
    backButton.innerText = 'Back';
    backButton.addEventListener('click', () => {
        universalStyleCheck(optionsContainer,"display","flex","none");
        universalStyleCheck(treeOffer,"display","none","flex");
    });

    const offerButton = document.createElement('button');
    offerButton.innerText = 'Offer';
    offerButton.addEventListener('click', () => {
        offerItemFunction();
    });

    buttonContainer.append(backButton, offerButton);
    treeOffer.append(treeOfferText, treeItem, treeMissingText, buttonContainer, nutStoreCurrency);
    treeTable.append(treeOffer);
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

    treeMissingText.innerText = treeInnerValue;
    if (!beta) {
        if (treeInnerValue !== '') {return}
        saveValues.treeObj.offer[0] -= persistentValues.goldenCore;
        for (let i = 1; i < saveValues.treeObj.offer.length; i++) {
            let itemNumber = saveValues.treeObj.offer[i];
            let newAmount = InventoryMap.get(itemNumber) - 1;
    
            InventoryMap.set(itemNumber, newAmount);
            if (newAmount === 0) {(document.getElementById(itemNumber)).remove();}
        }
    }

    saveValues.treeObj.offerAmount++;
    challengeNotification(({category: 'offer', value: saveValues.treeObj.offerAmount}))
    saveValues.treeObj.energy = Math.round(saveValues.treeObj.energy * randomInteger(105, 110) / 100);

    const palmText = document.getElementById('palm-text');
    palmText.innerText = `Palm Energy: ${saveValues.treeObj.energy}`;
    rollTreeItems();
}

function treeOptions(planted, optionsContainer, lastPhase) {
    while (optionsContainer.firstChild) {
        optionsContainer.firstChild.remove();
    }

    if (lastPhase) {
        optionsContainer.classList.add('flex-row','options-container');
        let treeButton = document.createElement('div');
        let optionImg = new Image();
        optionImg.src = `./assets/tree/harvest.webp`;
        let optionText = document.createElement('p');
        optionText.innerText = 'Harvest';

        treeButton.addEventListener('click',() => {
            persistentValues.harvestCount++;
            challengeNotification(({category: 'harvest', value: persistentValues.harvestCount}))
            destroyTree();
        })
        treeButton.append(optionImg,optionText);
        optionsContainer.appendChild(treeButton);
    } else if (planted) {
        optionsContainer.classList.add('flex-row','options-container');
        optionsContainer.style.display = 'flex';
        const optionsTextArray = ['Offer','Absorb','Destroy'];
        for (let i = 0; i < 3; i++) {
            let treeButton = document.createElement('div');
            let optionImg = new Image();
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
                        choiceBox(mainBody,{
                            text: 'Are you sure you want to destroy the tree? This cannot be undone.'
                        }, stopSpawnEvents, destroyTree, undefined, null, ['choice-ele']);
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
        let treeButton = document.createElement('div');
        let optionImg = new Image();
        optionImg.src = `./assets/tree/plant.webp`;
        let optionText = document.createElement('p');
        optionText.innerText = 'Plant';

        treeButton.addEventListener('click',() => {pickTree()})
        treeButton.append(optionImg,optionText);
        optionsContainer.appendChild(treeButton);
    }
}

function destroyTree() {
    const treeProgress = document.getElementById('tree-progress');
    const treeImg = document.getElementById('tree-img');
    const treeContainer = document.getElementById('tree-container');
    const optionsContainer = document.getElementById('options-container');
    const treeMissingText = document.getElementById('tree-missing-text');
    
    treeMissingText.innerText = ''
    treeOptions(false, optionsContainer);
    updateTreeValues(true);
    treeImg.src = `./assets/tooltips/Empty.webp`;

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

        const lootContainer = createDom('div', { class:['notif-item']});
        let lootArray = Array.from({ length: 7 }, () => randomInteger(Math.round(treeValue * 0.4), Math.round(treeValue * 0.7)));

        for (let i = 0; i < lootArray.length; i++) {
            if (lootArray[i] !== 0) {
                const rankInventoryReward = createDom('div', { class:['notif-item-number', 'flex-column']});
                let rankInventoryRewardsImg = document.createElement('div');
                rankInventoryRewardsImg = inventoryFrame(rankInventoryRewardsImg, { Star: 5, File: `solid${boxElement[i + 1]}` }, itemFrameColors);
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
        if (!beta) {
            saveData(true);
        }
    },100);
}

function updateTreeValues(turnZero) {
    const treeProgress = document.getElementById('tree-progress');
    const treeProgressValue = document.getElementById('tree-progress-value');
    const palmEnergy = document.getElementById('palm-text');

    if (turnZero) {
        treeProgress.progress = 0;
        treeProgress.style.width = 0;
        treeProgressValue.rate = 0;
        treeProgressValue.innerText = 'Growth: 0x';
        palmEnergy.innerText = 'Palm Energy: 0';
    } else {
        treeProgressValue.rate = saveValues.treeObj.growthRate / 25;
        treeProgressValue.innerText = 'Growth: ' + saveValues.treeObj.growthRate + 'x';
        palmEnergy.innerText = `Palm Energy: ${saveValues.treeObj.energy}`;
    }
}

function enemyBlock(remove, damage, maxHP) {
    if (remove === true) {
        let enemyContainer = document.getElementById('tree-block').firstChild;
        let enemyContainerChildren = enemyContainer.children;
        let lostHP = Math.min(50,(50 * (damage / maxHP)));

        // TODO: add a funny picture or smth depending on amount of lost HP
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
            enemyBlock('confirm');
            let treeHealthText = document.getElementById('tree-health-text');
            saveValues.treeObj.health = Math.max(saveValues.treeObj.health - lostHP, 1); ;
            treeHealthText.health = saveValues.treeObj.health;
            treeHealthText.innerText = 'HP:\n' + treeHealthText.health + '%';
        })

        enemyContainerChildren[1].remove();
    } else if (remove === 'confirm') {
        document.getElementById('tree-block').remove();
        universalStyleCheck(document.getElementById('tree-offer-container'),"display","flex","none", true);
        saveValues.treeObj.defense = false;
    } else {
        universalStyleCheck(document.getElementById('tree-offer-container'),"display","flex","none", true);
        const treeTable = document.getElementById('tree-table');

        let eventBackdrop = document.createElement('div');
        eventBackdrop.classList.add('event-dark', 'cover-all');
        eventBackdrop.id = 'tree-block';

        let enemyContainer = document.createElement('div');
        enemyContainer.classList.add('tree-enemy','flex-column')
    
        let treeEnemyHeader = document.createElement('p');
        treeEnemyHeader.innerText = 'Tree Defense';
        let treeEnemyImg = new Image();
        treeEnemyImg.src = './assets/tree/treeDefense.webp';
    
        let treeEnemyText = document.createElement('p');
        treeEnemyText.innerHTML = `Recommended Rank: 16 <br><br> 
                                  Stop the monsters from destroying your leyline tree! <br>
                                  <span style='color:#dd5548'>Any damage inflicted upon you is inflicted on the tree as well! </span>`;
        let treeEnemyButton = document.createElement('button');
        treeEnemyButton.innerText = 'Defend!';
        treeEnemyButton.addEventListener('click',() => {
            let advButton = document.getElementById("adventure-button");
            advButton.key = 26;
            adventure('13-[2]');
            adventureTreeDefense = true;
        })
    
        enemyContainer.append(treeEnemyHeader,treeEnemyImg,treeEnemyText,treeEnemyButton);
        eventBackdrop.append(enemyContainer);
        treeTable.append(eventBackdrop);
    } 
}

function pickTree() {
    const palmEnergy = document.getElementById('palm-text');
    palmEnergy.innerText = 'How much are you planting?';

    while (document.getElementById('options-container').firstChild) {document.getElementById('options-container').firstChild.remove()}

    const seedContainer = document.createElement('div');
    seedContainer.classList.add('flex-row');
    seedContainer.id = 'seed-container';
    document.getElementById('tree-table').appendChild(seedContainer);

    updateSeedContainer(false);
    // growTree('level');
}

function updateSeedContainer(updateValueOnly) {
    if (document.getElementById('seed-container')) {
        const seedContainer = document.getElementById('seed-container');
        if (updateValueOnly) {

        } else {
            let seedAdded = [0,0,0];
            for (let i = 0; i < 3; i++) {
                let seedColumnContainer = document.createElement('div');
                seedColumnContainer.classList.add('seed-column')
                
                let seedImg = new Image();
                seedImg.src = `./assets/tree/seed-${i+1}.webp`

                let seedNumber = document.createElement('p');
                seedNumber.amount = 0;
                seedNumber.innerText = `0 / ${persistentValues.treeSeeds[i]}`;

                let seedDecrement = document.createElement('button');
                let seedIncrement = document.createElement('button');
                let seedMegaDecrement = document.createElement('button');
                let seedMegaIncrement = document.createElement('button');

                const incrementValue = (change) => {
                    if (seedNumber.amount + change >= 0 && seedNumber.amount + change <= persistentValues.treeSeeds[i]) {
                        seedNumber.amount += change;
                    } else if (change > 1 && persistentValues.treeSeeds[i] - seedNumber.amount < change) {
                        seedNumber.amount = persistentValues.treeSeeds[i];
                    } else if (change < -1 && seedNumber.amount < (change * -1)) {
                        seedNumber.amount = 0;
                    }

                    seedNumber.innerText = `${seedNumber.amount} / ${persistentValues.treeSeeds[i]}`;
                    seedAdded[i] = seedNumber.amount;
                }


                seedDecrement.innerText = '-';
                seedDecrement.addEventListener('click', () => {
                    incrementValue(-1);
                });
                
                seedIncrement.innerText = '+';
                seedIncrement.addEventListener('click', () => {
                    incrementValue(1);
                });

                seedMegaDecrement.innerText = '--';
                seedMegaDecrement.addEventListener('click', () => {
                    incrementValue(-10);
                });

                seedMegaIncrement.innerText = '++';
                seedMegaIncrement.addEventListener('click', () => {
                    incrementValue(10);
                });

                seedColumnContainer.append(seedImg, seedNumber, seedMegaDecrement, seedDecrement, seedIncrement, seedMegaIncrement);
                seedContainer.append(seedColumnContainer)
            }

            const backButton = createDom('button', {
                innerText: 'Back',
                style: {
                    transform: 'translateX(-105%)',
                }
            });

            backButton.addEventListener('click', () => {
                updateTreeValues(true);
                seedContainer.remove();
                treeOptions(false, document.getElementById('options-container'));
            })

            const plantButton = createDom('button', {
                innerText: 'Plant!',
                style: {
                    transform: 'translateX(5%)',
                }
            });
            plantButton.addEventListener('click', () => {
                let seedValue = 0;
                let seedNum = 1;
                for (let i = 0; i < seedAdded.length; i++) {
                    seedValue += seedAdded[i] * (i + 1)**3;
                    seedNum *= Math.max(Math.log(((seedAdded[i] * (i + 1)) + 1)), 1);
                }

                if (seedValue > 0) {
                    saveValues.treeObj.growthRate = Math.round(seedNum * 100) / 100;
                    seedContainer.remove();

                    saveValues.treeObj.energy = 100 * seedValue;
                    growTree('level');

                    for (let i = 0; i < 3; i++) {
                        persistentValues.treeSeeds[i] -= seedAdded[i];
                    }
                }
            })
            seedContainer.append(backButton, plantButton)
        }
    }
}

function growTree(type, amount) {
    const treeProgress = document.getElementById('tree-progress');
    const treeProgressValue = document.getElementById('tree-progress-value');
    if (type === 'add') {
        if (saveValues.treeObj.level === 5) {return}
        if (saveValues.treeObj.defense !== 'block') {
            treeProgress.progress += treeProgressValue.rate;
            saveValues.treeObj.growth = treeProgress.progress;
            treeProgress.style.width = treeProgress.progress + '%';
            if (treeProgress.progress > 100) {
                // REMOVE MAXED TREE
                if (saveValues.treeObj.level === 4) {
                    saveValues.treeObj.level = 5;
                    treeOptions(true, document.getElementById('options-container'), true);
                } else {
                    treeProgress.progress = 0;
                    growTree('level');
                }
            }
        }
    } else if (type === 'rate') {
        treeProgressValue.rate += (amount / 25);
    } else if (type === 'level') {
        const treeImg = document.getElementById('tree-img');
        const treeContainer = document.getElementById('tree-container');
        // PLANT NEW TREE
        if (saveValues.treeObj.level === 0) {
            treeOptions(true, document.getElementById('options-container'));
            
            let treeHealthText = document.getElementById('tree-health-text');
            saveValues.treeObj.health = 100;
            treeHealthText.health = saveValues.treeObj.health;
            treeHealthText.innerText = 'HP:\n' + treeHealthText.health + '%';

            const leylineText = document.getElementById('leyline-text');
            leylineText.innerText = '';

            updateTreeValues(false);
            saveValues.treeObj.defense = randomIntegerWrapper(0);
            rollTreeItems();
            weaselBurrow.load();
            weaselBurrow.play();
        };

        treeContainer.classList.remove(`tree-${saveValues.treeObj.level}`);
        saveValues.treeObj.level++;
        treeImg.src = `./assets/tree/tree-${saveValues.treeObj.level}.webp`;
        treeContainer.classList.add(`tree-${saveValues.treeObj.level}`);

        // INTIATE TREE DEFENSE 
        if (saveValues.treeObj.level === 3) {
            if (saveValues.treeObj.defense) {
                saveValues.treeObj.defense = 'block';
                enemyBlock();
            }
        }
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
    if (treeOffer === null) {return};

    const itemArrayCopy = [...itemArray];
    let replacedTreeItems = {};

    const sameTypeAndStar = (itemType, itemStar, i, itemArrayCopyItem) => {
        for (let itemKey in treeOffer) {
            if (treeOffer[itemKey].Type === itemType && treeOffer[itemKey].Star === itemStar) {
                let replaceWithTreeItem = randomIntegerWrapper(35 + luckRate * 1.5, 100);
                if (replaceWithTreeItem || parseInt(itemKey) === parseInt(itemArrayCopyItem)) {
                    replacedTreeItems[i] = [parseInt(itemKey), true];
                    return;
                }
            }
        }

        replacedTreeItems[i] = [itemArrayCopyItem, false];
        return
    }

    for (let i = 0; i < itemArrayCopy.length; i++) {
        let itemType = Inventory[itemArrayCopy[i]].Type;
        let itemStar = Inventory[itemArrayCopy[i]].Star;

        sameTypeAndStar(itemType, itemStar, i, itemArrayCopy[i]);
    }

    return replacedTreeItems;
}

function leylineCreate(treeTable, optionsContainer) {
    const leylineDisplay = createDom('div', {class:['flex-column'], id:'leyline-container', style:{ display:'none' }});

    const leylineTitle = createDom('p', { innerHTML: 'Leyline Outbreak Energy Level' });
    const leylineBar = createProgressBar(
        { class: ['leyline-progress', 'healthbar-container'] },
        { id: 'leyline-progress',
          progress: parseFloat(persistentValues.leylinePower),
          style: { width: (parseFloat(persistentValues.leylinePower) + '%'), background: 'linear-gradient(90deg, rgba(204,12,12,1) 0%, rgba(235,225,15,1) 100%)' }},
        { style: { borderRight: '0.2em solid #C17D6D' }},
        4,
        { src: './assets/tree/skull.webp'}
    );
     
    let text = `<br>Absorb energy from the <span style='color:#A97803'>Leyline Outbreak</span> at the
                <br> cost of your tree's HP (More effective at higher phases)`
    const leylineText = createDom('p', { innerHTML: text, id:'leyline-text' });
    const leylineEnergy = createDom('p', { innerText: `Current Energy Levels: ${Math.round(persistentValues.leylinePower * 10) / 10}%`, progress: persistentValues.leylinePower });
    checkAbsorbThreshold();

    const absorbButton = document.createElement('button');
    absorbButton.innerText = 'Absorb';

    absorbButton.addEventListener('click', () => {
        if (saveValues.treeObj.health <= 15) {
            leylineText.innerText = 'The tree is too weak to absorb excess energy!'
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
                leylineText.innerText = 'A seed is too weak to absorb anything!'
                return;
            default:
                treeAbsorbPower *= 0;
                break;
        }

        let leylineProgress = document.getElementById('leyline-progress');
        persistentValues.leylinePower -= treeAbsorbPower;

        checkAbsorbThreshold();

        leylineProgress.progress = parseFloat(persistentValues.leylinePower);
        leylineProgress.style.width = leylineProgress.progress + '%';

        let treeHealthText = document.getElementById('tree-health-text');
        saveValues.treeObj.health = Math.max(saveValues.treeObj.health - randomInteger(20, 40), 1);
        treeHealthText.health = saveValues.treeObj.health;
        treeHealthText.innerText = 'HP:\n' + treeHealthText.health + '%';

        leylineEnergy.innerText = `Current Energy Levels: ${(Math.round(persistentValues.leylinePower * 10)/10)}%`
    });

    const backButton = document.createElement('button');
    backButton.innerText = 'Back';
    backButton.addEventListener('click', () => {
        universalStyleCheck(optionsContainer,"display","flex","none");
        universalStyleCheck(leylineDisplay,"display","none","flex");
    });

    const buttonContainer = createDom('div', { class:['flex-row'] })
    buttonContainer.append(backButton, absorbButton)

    
    leylineDisplay.append(leylineTitle, leylineBar, leylineEnergy, leylineText, buttonContainer);
    treeTable.append(leylineDisplay);
}

function checkAbsorbThreshold() {
    const leylineText = document.getElementById('leyline-text');
    if (persistentValues.leylinePower < 75 && persistentValues.fellBossDefeat === false) {
        spawnBossQuest(1)
        persistentValues.leylinePower = 75.0;
        leylineText.innerText = 'A force of nature has awoken as its energy from the Leyline was cutoff!';
    } else if (persistentValues.leylinePower < 50 && persistentValues.unusualBossDefeat === false) {
        spawnBossQuest(2)
        persistentValues.leylinePower = 50.0;
        leylineText.innerText = 'A mysterious portal has emerged, maybe it has something to do with the Leyline?';
    } else if (persistentValues.leylinePower < 25 && persistentValues.workshopBossDefeat === false) {
        spawnBossQuest(3)
        persistentValues.leylinePower = 25.0;
        leylineText.innerText = 'A dreadful roar was heard from the depths due to the energy given off by the Leyline!';
    }  else if (persistentValues.leylinePower < 0 && persistentValues.finaleBossDefeat === false) {
        spawnBossQuest(4)
        persistentValues.leylinePower = 0;
        leylineText.innerText = 'A powerful enemy has revealed itself as soon as all energy from the Leyline stopped!';
    }
}

//------------------------------------------------------------------------MISCELLANEOUS------------------------------------------------------------------------//
// REFRESH SCORES & ENERGY
function refresh() {
    let formatScore = abbrNum(saveValues["realScore"]);
    score.innerText = `${formatScore} Nut${saveValues["realScore"] !== 1 ? 's' : ''}`;
    let formatDps = abbrNum(saveValues["dps"] * foodBuff);
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
                    currencyPopUp("mail",1);
                    saveValues.mailCore--;
                    wishUnlock();
                    saveValues["wishUnlocked"] = true;
                    goldenNutUnlocked = true;
                }
            }
            newPop(expeditionCounter + 10);
        }
        expeditionCounter++;
        heroUnlockLevels.shift();
    }
}

// POP UPS FOR SPECIAL CURRENCY
function currencyPopUp(type1, amount1, type2, amount2) {
    if (type1 === 'primogem') {amount1 = Math.round(amount1 * additionalPrimo)};
    if (type2 === 'primogem') {amount2 = Math.round(amount2 * additionalPrimo)};
    let currencyPop = document.createElement("div");
    currencyPop.classList.add("flex-column","currency-pop");
    currencyPop.innerText = 'Obtained';

    let currencyPopFirst = document.createElement("div");
    currencyPopFirst.classList.add("flex-row","currency-pop-first");
    currencyPopFirst.innerHTML = amount1 + "   ";
    let currencyPopFirstImg = document.createElement("img");

    if (type1 === "energy") {
        currencyPopFirstImg.src = "./assets/icon/energyIcon.webp";
        currencyPopFirstImg.classList.add("icon");
        saveValues.energy += amount1;
        persistentValues.lifetimeEnergyValue += amount1;

        challengeNotification(({category: 'energy', value: saveValues.energy}))
    } else if (type1 === "primogem") {
        currencyPopFirstImg.src = "./assets/icon/primogemIcon.webp";
        currencyPopFirstImg.classList.add("icon","primogem");
        saveValues.primogem += amount1;
        persistentValues.lifetimePrimoValue += amount1;

        challengeNotification(({category: 'primogem', value: saveValues.primogem}))
    } else if (type1 === "nuts") {
        currencyPopFirstImg.src = "./assets/icon/goldenIcon.webp";
        currencyPopFirstImg.classList.add("icon","primogem");
        saveValues.goldenNut += amount1;
        persistentValues.goldenCore += amount1;
        updateCoreCounter();
        nutPopUp();
    } else if (type1 === "mail") {
        currencyPopFirstImg.src = "./assets/icon/mailLogo.webp";
        currencyPopFirstImg.classList.add("icon","primogem");
        saveValues.mailCore += amount1;
    } else if (type1 === "items") {
        currencyPopFirst.innerText = "Items";
        currencyPopFirstImg.src = "./assets/icon/item.webp";
        currencyPopFirstImg.classList.add("icon","primogem");
    }

    currencyPopFirst.append(currencyPopFirstImg);
    currencyPop.append(currencyPopFirst);
    if (type2 !== undefined) {
        let currencyPopSecond = document.createElement("div");
        currencyPopSecond.classList.add("flex-row","currency-pop-first");
        currencyPopSecond.innerHTML = amount2 + "   ";

        let currencyPopSecondImg = document.createElement("img");
        if (type2 === "energy") {
            currencyPopSecondImg.src = "./assets/icon/energyIcon.webp";
            currencyPopSecondImg.classList.add("icon");
            saveValues.energy += amount2;
            persistentValues.lifetimeEnergyValue += amount2;

            challengeNotification(({category: 'energy', value: saveValues.energy}))
        } else if (type2 === "primogem") {
            currencyPopSecondImg.src = "./assets/icon/primogemIcon.webp";
            currencyPopSecondImg.classList.add("icon","primogem");
            saveValues.primogem += amount2;
            persistentValues.lifetimePrimoValue += amount2;

            challengeNotification(({category: 'primogem', value: saveValues.primogem}))
        } else if (type2 === "nuts") {
            currencyPopSecondImg.src = "./assets/icon/goldenIcon.webp";
            currencyPopSecondImg.classList.add("icon","primogem");
            saveValues.goldenNut += amount2;
            persistentValues.goldenCore += amount2;
            updateCoreCounter();
            nutPopUp();
        } else if (type2 === "items") {
            currencyPopSecond.innerText = "Items";
            currencyPopSecondImg.src = "./assets/icon/item.webp";
            currencyPopSecondImg.classList.add("icon","primogem");
        }

        currencyPop.style.height = "13%"
        currencyPopFirst.style.height = "30%";
        currencyPopSecond.style.height = "30%";
        currencyPopSecond.append(currencyPopSecondImg);
        currencyPop.append(currencyPopSecond);
    }

    setTimeout(()=> {
        currencyPop.style.animation = "fadeOut 2s cubic-bezier(.93,-0.24,.93,.81) forwards";
        currencyPop.addEventListener("animationend",() => {
            currencyPop.remove();
        })
    },1000)
    mainBody.appendChild(currencyPop);
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

}

// FOR TESTING PURPOSES ONLY
let beta = false;
if (localStorage.getItem('beta') == 'true') {
    beta = true;
}

if (beta) {
    let link = document.createElement("link");
    link.href = 'beta.css';
    link.type = "text/css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    let warning = document.createElement('p');
    warning.innerText = 'BETA';
    warning.classList.add('beta-warning');
    mainBody.append(warning);

    setTimeout(()=>{
        let startButton = document.getElementById("start-button");
        startButton.click();
        setTimeout(()=>{
            let startButton = document.getElementById("play-button");
            if (startButton) startButton.click();
            setTimeout(()=>{startingFunction();},500)
        },2500);
    },800);

    function startingFunction() {
        // PRESS A KEY
        const event = new KeyboardEvent('keydown', {
            key: '3',
        });
          
        // document.dispatchEvent(event);

        // BETA FUNCTIONS
        
    }
}