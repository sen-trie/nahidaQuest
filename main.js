import { upgradeDictDefault,SettingsDefault,InventoryDefault,enemyInfo,expeditionDictDefault,achievementListDefault,saveValuesDefault,eventText,upgradeInfo,persistentValuesDefault,permUpgrades,screenLoreDict,expeditionDictInfo } from "./defaultData.js"
import { abbrNum,randomInteger,sortList,generateHeroPrices,unlockExpedition,getHighestKey,countdownText,updateObjectKeys,randomIntegerWrapper } from "./functions.js"
import { inventoryAddButton,expedButtonAdjust,dimMultiplierButton,volumeScrollerAdjust,floatText,multiplierButtonAdjust } from "./adjustUI.js"
import Preload from 'https://unpkg.com/preload-it@latest/dist/preload-it.esm.min.js'
import * as drawUI from "./drawUI.js"

const VERSIONNUMBER = "v0.3-3-270";
const COPYRIGHT = "DISCLAIMER © HoYoverse. All rights reserved. \n HoYoverse and Genshin Impact  are trademarks, \n services marks, or registered trademarks of HoYoverse.";
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
        if (deleteBox.style.zIndex == -1) {
            deleteBox.style.zIndex = 1000;
        } else {
            deleteBox.style.zIndex = -1;
        }
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

setTimeout(()=>{
    mainBody = drawUI.buildGame(mainBody);
    mainBody.style.display = "block";
},300)

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
const EVENTCOOLDOWN = 70;
const SHOPCOOLDOWN = 15;
const SHOP_THRESHOLD = 600;

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

let demoContainer = document.getElementById("demo-container");
let score = document.getElementById("score");
let energyDisplay = document.getElementById("energy");
let dpsDisplay = document.getElementById("dps");
let primogemDisplay = document.getElementById("primogem");

let leftDiv = document.getElementById("left-div");
let midDiv = document.getElementById("mid-div");
let rightDiv = document.getElementById("right-div");
let multiplierButtonContainer;

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
let TABS = [table1,table2, table3, table4, table5Container,table7];
let tooltipName,toolImgContainer,toolImg,toolImgOverlay,tooltipText,tooltipLore,tooltipWeaponImg,tooltipElementImg,table6Background;

// INITIAL LOADING
var InventoryMap;
var achievementMap;
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
createExpedition();
drawUI.createExpedTable(expedTooltip);
table3.appendChild(expedTooltip);
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
var bgmElement;
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
let sfxArray = [
    tabElement,demoElement,upgradeElement,mailElement,
    achievementElement,eventElement,reactionStartElement,
    reactionCorrectElement,weaselBurrow,weaselDecoy,
    adventureElement,shopElement,
    fightEncounter,fightEnemyDownElement,fightLoseElement,fightWinElement,
    parrySuccess,parryFailure
];

let timerLoad = setInterval(timerEventsLoading,50);
let timer;
const timeRatio = 500;
var timerSeconds = 0;
createFilter();
createTabs();
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
    checkAchievement();
    refresh();
    dimHeroButton();
    addNewRow(true);
    randomEventTimer(timerSeconds);
    timerSave(timerSeconds);
    shopCheck();
    shopTimerFunction();
}

// TEMPORARY TIMER
function timerEventsLoading() {
    addNewRow();
    refresh();
}

// SAVE DATA TIMER
var savedTimes = 1;
function timerSave(timerSeconds) {
    // SAVES DATA EVERY 3 MINUTES
    let saveTimeMin = 180 * savedTimes;
    if (timerSeconds > saveTimeMin) {
        saveData();        
        console.log("Saved!");
        savedTimes++;
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
    // LOAD SETTIGNS
    if (localStorage.getItem("settingsValues") == null) {
        settingsValues = SettingsDefault;
    } else {
        let settingsTemp = localStorage.getItem("settingsValues");
        settingsValues = JSON.parse(settingsTemp)
        updateObjectKeys(settingsValues,SettingsDefault);
    }
    // LOAD VALUES DATA
    if (localStorage.getItem("saveValuesSave") == null) {
        saveValues = saveValuesDefault;
    } else {
        let saveValuesTemp = localStorage.getItem("saveValuesSave");
        saveValues = JSON.parse(saveValuesTemp);
        updateObjectKeys(saveValues,saveValuesDefault);
    }
    // LOAD HEROES DATA
    if (localStorage.getItem("upgradeDictSave") === null) {
        let upgradeDictTemp = generateHeroPrices(upgradeDictDefault,NONWISHHEROMAX);
        upgradeDict = upgradeDictTemp;
    } else {
        let upgradeDictTemp = localStorage.getItem("upgradeDictSave");
        upgradeDict = JSON.parse(upgradeDictTemp);
        updateObjectKeys(upgradeDict,upgradeDictDefault);
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
        // FOR SAVE DATA 0.3.0 
        if (typeof(expeditionDictTemp[1]) != "string") {
            expeditionDict = expeditionDictDefault;
        } else {
            expeditionDict = expeditionDictTemp;
        }
        updateObjectKeys(expeditionDict,expeditionDictDefault);
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
        achievementListload();
    }
    // LOAD STORE DATA
    if (localStorage.getItem("storeInventory") != null) {
        let localStore = localStorage.getItem("storeInventory");
        let currentMin = localStorage.getItem("shopStartMinute");
        localStore = JSON.stringify(localStore);
        shopTime = currentMin;
        loadShop();
    }
    // LOAD PERSISTENT VALUES 
    if (localStorage.getItem("persistentValues") === null) {
        persistentValues = persistentValuesDefault;
    } else {
        let persistentDictTemp = localStorage.getItem("persistentValues");
        persistentValues = JSON.parse(persistentDictTemp);
        updateObjectKeys(persistentValues,persistentValuesDefault);
    }

    specialValuesUpgrade(true);
    if (saveValues.goldenTutorial === true) {
        addNutStore();
    }
}

// BIG BUTTON FUNCTIONS
let clickAudioDelay = null;
let currentClick = 1;
let demoImg = document.createElement("img");
demoImg.src = "./assets/nahida.webp";
demoImg.classList.add("demo-img");
demoImg.id = "demo-main-img";

demoContainer.addEventListener("mouseup", () => {
    let clickEarn;
    let crit = false;
    saveValues["clickCount"] += 1;

    let critRole = randomInteger(1,100);
    if (critRole <= clickCritRate) {
        crit = true;
        clickDelay -= 3;
        if (clickerEvent !== "none") {
            clickDelay -= 2;
            clickEarn = Math.ceil(currentClick * clickCritDmg);
        } else {
            clickEarn = Math.ceil(specialClick * saveValues["clickFactor"] * clickCritDmg);
        }
    } else {
        if (clickerEvent !== "none") {
            clickDelay -= 2;
            clickEarn = currentClick;
        } else {
            clickEarn = Math.ceil(specialClick * saveValues["clickFactor"]);
        }
    }

    saveValues["realScore"] += clickEarn;
    energyRoll();

    if (clickAudioDelay === null) {
        if (timerSeconds !== 0) {
            let randomInt = (randomInteger(9,15) / 10);
            demoElement.load();
            demoElement.playbackRate = randomInt;
            demoElement.play();
            clickAudioDelay = setTimeout(function() {clickAudioDelay = null}, 75);
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

    spawnFallingNut();
});

drawUI.demoFunction(demoContainer,demoImg);
demoContainer.append(demoImg);

function spawnFallingNut() {
    let number = randomInteger(2,6);
    let animation = `fall ${number}s cubic-bezier(1,.05,.55,1.04) forwards`;
    let img = document.createElement("img");
    img.src = "./assets/icon/nut.webp";
    img.style.left = `${randomInteger(0,100)}%`
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
        if (randInt < ENERGYCHANCE){
            saveValues["energy"] += randomInteger(lowerEnergyRate, upperEnergyRate);
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
        wishPower = (1 + (persistentValues.upgrade3.Purchased)/50).toFixed(3);
        costDiscount = (1 - (persistentValues.upgrade4.Purchased)/50).toFixed(3);
        clickCritRate = persistentValues.upgrade5.Purchased;
        clickCritDmg = Math.round((Math.log(persistentValues.upgrade5.Purchased + 1) * 18));
        idleRate = (persistentValues.upgrade6.Purchased/100).toFixed(2);
        luckRate = persistentValues.upgrade7.Purchased/2;
        eventCooldownDecrease = (1 - persistentValues.upgrade8.Purchased/50).toFixed(1);
        additionalPrimo = (1 + persistentValues.upgrade9.Purchased/10).toFixed(3);
        additionalStrength = (1 + persistentValues.upgrade10.Purchased/10).toFixed(3);
        additionalDefense = (1 + persistentValues.upgrade11.Purchased/10).toFixed(3);
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
                wishPower = (1 + (persistentValues.upgrade3.Purchased)/50).toFixed(3);
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
    if (aranaraNumber < 4) {
        eventPictureImg.src = "./assets/icon/event-easy.webp";
    } else {
        eventPictureImg.src = "./assets/icon/event-hard.webp";
        eventPictureImg.classList.add("vibrate-more");
    }
    eventPicture.appendChild(eventPictureImg);
    mainBody.appendChild(eventPicture);
}

function clickedEvent(aranaraNumber) {
    let specialEvent = randomIntegerWrapper(luckRate*2,200);
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

    let eventDropdownImage = document.createElement("div");
    eventDropdownImage.style.background = "url(./assets/tutorial/aranara-"+(aranaraNumber)+".webp)";
    eventDropdownImage.style.backgroundPosition = "center";
    eventDropdownImage.style.backgroundSize = "contain";
    eventDropdownImage.style.backgroundRepeat = "no-repeat";
    eventDropdownImage.classList.add("event-dropdown-image");
    
    eventDropdown.append(eventDropdownBackground, eventDropdownText,eventDropdownImage);
    eventDropdown.addEventListener("animationend", () => {
        eventDropdown.remove();
        chooseEvent(aranaraNumber,specialEvent);
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
        default:
            console.error("Event error: Invalid event");
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
    currentClick = 15 * (saveValues["dps"] + 1) * specialClick;

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
            button.src = "./assets/nahida.webp";
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
    setTimeout(()=>{
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
            }, 700)
        }
    },randomTime);
    
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
        outcomeText = "You missed!";
    } else if (reactionReady == true) {
        reactionCorrectElement.play();
        adventure(10);
        primogem = randomInteger(40,60);
        outcomeText = "You did it!";
    }

    reactionReady = false;
    reactionGame = false;
    eventOutcome(outcomeText,eventBackdrop,"reaction",primogem);
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

const boxElement = ["Any","Pyro","Hydro","Dendro","Electro","Anemo","Cryo","Geo"];
const specialText = ["Ah! It's Bongo-Head!","'Thank you for releasing Arapacati!'","Woah, a treasure-seeking Seelie!","Woah, a shikigami was trapped inside!"];
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
        adventure(10);
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
        } else if (boxChance >= 5) {
            boxOutcome.src = "./assets/event/verygood-1.webp";
            outcomeText = "It had a precious gemstone!! (+Power for all characters)";
            outcomeNumber = 5002.1;
        }  else {
            boxOutcome.src = "./assets/event/verybad-" + randomInteger(1,5) + ".webp";
            let badOutcomePercentage = randomInteger(70,85);
            outcomeText = "Uh oh! Run away!! (Lost " +(100 - badOutcomePercentage)+ "% of Energy)";
            outcomeNumber = badOutcomePercentage;
        }
    }

    eventOutcome(outcomeText,eventBackdrop,"box",outcomeNumber);
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
    var mines = randomInteger(6,8);
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
                } else {
                    revealCell(r, c);
                    td.style.backgroundImage = "url(./assets/event/mine-empty.webp)";
                }
                if (cellsLeft <= 0) {
                    let randomPrimo = randomInteger(200,400);
                    adventure(10);
                    newPop(1);
                    eventOutcome(`All whopperflowers have been revealed!`,eventBackdrop);
                    setTimeout(()=>{currencyPopUp("items",0,"primogem", randomPrimo)},4000)
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
    setTimeout(()=>{
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
    weaselTimerImage.addEventListener("animationend",()=> {
        let eventText = `You caught ${weaselCount} weasel thieves!`;
        if (goldWeaselCount > 0) {
            eventOutcome(eventText,eventBackdrop,"weasel",weaselCount,goldWeaselCount);
        } else {
            eventOutcome(eventText,eventBackdrop,"weasel",weaselCount);
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
    if (specialWeasel) {specialWeaselSpawns = randomIntegerWrapper(luckRate*6,200)}

    for (let i=0, len=weaselDiv.length; i < len; i++) {
        let weaselImage = weaselDiv[i].querySelector('img');
        if (i === realWeasel) {
            if (specialWeaselSpawns) {
                weaselImage.src = "./assets/event/weasel-1.webp";
            } else {
                let realWeasel = randomInteger(2,4);
                weaselImage.src = "./assets/event/weasel-"+realWeasel+".webp";
            }

            let springInterval = (randomInteger(20,25) / 100);
            weaselImage.classList.add("spring");
            weaselImage.style["animation-duration"] = springInterval + "s";
            weaselImage.addEventListener("click",()=>{
                mailElement.load();
                mailElement.playbackRate = 1.35;
                mailElement.play();

                delay *= 0.65;
                if (delay <= 450) {delay = 450}

                clearWeasel(weaselBack,delay,specialWeasel);
                weaselCount++;
                if (specialWeaselSpawns) {goldWeaselCount++}

                let weaselCountText = document.getElementById("visible-weasel-count");
                weaselCountText.innerText = weaselCount;
            })
        } else {
            let emptyWeasel = randomInteger(7,11);
            if (emptyWeasel != 10 & emptyWeasel != 9) {
                let springInterval = (randomInteger(15,20) / 100);
                weaselImage.classList.add("spring");
                weaselImage.style["animation-duration"] = springInterval + "s";
            }
            weaselImage.src = "./assets/event/weasel-"+emptyWeasel+".webp"
        }
    }

    let fakeAmount = Math.floor(2000/delay + 0.3);
    if (fakeAmount > 10) {fakeAmount = 10}
    let combination = generateCombination(fakeAmount);
    for (let j=0, len=combination.length; j < len; j++) {
        if ((combination[j] - 1) === realWeasel) {continue}
        let weaselImage = weaselDiv[combination[j] - 1].querySelector('img');
        let fakeWeasel = randomInteger(5,7);
        if (specialWeasel) {fakeWeasel = randomInteger(4,7)}
        weaselImage.src = "./assets/event/weasel-"+fakeWeasel+".webp";

        let springInterval = (randomInteger(15,35) / 100)
        weaselImage.classList.add("spring");
        weaselImage.style["animation-duration"] = springInterval + "s";
        weaselImage.addEventListener("click",()=> {
            let fakeWeaselAlert = document.getElementById("fake-weasel-alert");
            fakeWeaselAlert.style.animation = "none";
            setTimeout(()=>{fakeWeaselAlert.style.animation = "fadeOutWeasel 3s linear forwards"},10)
            weaselDecoy.load();
            weaselDecoy.play();
            clearWeasel(weaselBack,delay,specialWeasel);
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
        addWeasel(weaselBack,delay,specialWeasel);
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
    eventBackdrop.append(eventDescription)

    rainText.classList.add("event-rain-text");
    let dpsMultiplier = (saveValues.dps + 1)* 10;
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
                img.remove();
                tempGolden++;
                reactionCorrectElement.load();
                reactionCorrectElement.play();
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
                tempPrimogem = Math.max(0, tempPrimogem)
                rainTextDiv.innerText = abbrNum(tempScore * dpsMultiplier)+ " Nuts | " + Math.round(tempPrimogem * additionalPrimo) + " Primos";
            });
        } else {
            img.src = "./assets/icon/nut.webp";
            img.addEventListener('click', () => {
                img.remove();
                tempScore++;
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

    let rainTimer = setInterval(() => {spawnRain()}, 300);
    setTimeout(()=>{
        clearInterval(rainTimer);
        setTimeout(()=>{
            setTimeout(()=>{eventBackdrop.remove();},3000)
            rainText.classList.add("text-pop");
            rainText.addEventListener('animationend', () => {
                rainText.remove();
                stopSpawnEvents = false;
                saveValues.realScore += tempScore * dpsMultiplier;
                if (tempPrimogem != 0) {
                    if (tempGolden == 0) {
                        currencyPopUp("primogem",tempPrimogem);
                    } else {
                        currencyPopUp("primogem",tempPrimogem,"nuts",tempGolden);
                    }
                }
        }),8000})
    }, 28000);
    mainBody.append(eventBackdrop);
}

// EVENT OUTCOME (BLACK BAR THAT APPEARS IN THE MIDDLE OF SCREEN)
function eventOutcome(innerText,eventBackdrop,type,amount,amount2) {
    stopSpawnEvents = false;
    let removeClick = document.createElement("div");
    let boxText = document.createElement("div");
    let boxTextDiv = document.createElement("p");
    let outcomeDelay = 500;

    removeClick.classList.add("cover-all");
    removeClick.id = "prevent-clicker";
    boxText.classList.add("event-rain-text");
    boxText.id = "outcome-text";
    if (type == "weasel") {
        outcomeDelay = 0;
        let weaselCount = amount;
        let innerTextTemp;
        boxText.style.height = "13%";

        if (weaselCount >= 10) {
            innerTextTemp = `\n You received some items!`;
            newPop(1);
            amount = randomInteger(100,140);
        } else if (weaselCount >= 7) {
            innerTextTemp = `\n You received a few items!`;
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

        innerText += innerTextTemp;
    } else if (type == "reaction") {
        outcomeDelay = 0;
    }

    boxTextDiv.innerText = innerText;
    boxText.append(boxTextDiv);
    setTimeout(()=> {
        removeClick.append(boxText);
        mainBody.appendChild(removeClick);
        setTimeout(()=> {
            boxText.classList.add("slide-out-animation");
            setTimeout(()=> {
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

    let preloadArray = drawUI.preloadMinimumArray(upgradeInfo);
    preloadStart.fetch(preloadArray).then(() => {
        setTimeout(() => {removeLoading()}, 300);
    });

    preloadStart.onerror = item => {
        console.error(`Error preloading '${item.url}'`);
    }
}

function removeLoading() {
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
        if (persistentValues.upgrade6.Purchased > 0) {
            idleAmount = idleCheck(idleAmount);
        }

        tutorial(idleAmount);
    }, 200);
}

// SETUP AUDIO API
var currentSong = randomInteger(1,6);
var nextSong = "";
function playAudio() {
    bgmElement = new Audio("./assets/sfx/bgm"+currentSong+".mp3");
    bgmElement.id = "bgm";
    bgmElement.volume = settingsValues.bgmVolume;
    bgmElement.play();
    bgmElement.addEventListener('ended', () => {
        if (currentSong === 5) {
            currentSong = 1;
        } else {
            currentSong++;
        }
        nextSong = "./assets/sfx/bgm"+currentSong+".mp3";
        bgmElement.src = nextSong;
        bgmElement.load();
        bgmElement.play();
    }, false); 

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
        playButton.src = "./assets/tutorial/play-button.webp"
        playButton.classList.add("play-button");
        playButton.addEventListener("click",()=>{
            overlay.style.zIndex = -1;
            clearInterval(timerLoad);
            timer = setInterval(timerEvents,timeRatio);
            currentBGM = playAudio();
            settingsVolume();
            setTimeout(()=>{
                if (document.getElementById('idle-nuts-div')) {document.getElementById('idle-nuts-div').remove()}
                saveValues.realScore += idleAmount;
            },250)
        });

        tutorialDark.appendChild(playButton);
        overlay.append(tutorialDark);
    }
}

function saveData(skip) {
    if (preventSave) {return};
    saveValues["currentTime"] = getTime();
    saveValues["versNumber"] = DBNUBMER;
    if (!document.getElementById("currently-saving") && skip != true) {
        let saveCurrently = document.createElement("img");
        saveCurrently.src = "./assets/settings/saving.webp";
        saveCurrently.id = "currently-saving";
        saveCurrently.addEventListener("animationend", ()=> {
            saveCurrently.remove();
        });
        mainBody.append(saveCurrently);
    }

    localStorage.setItem("settingsValues", JSON.stringify(settingsValues));
    localStorage.setItem("saveValuesSave", JSON.stringify(saveValues));
    localStorage.setItem("upgradeDictSave", JSON.stringify(upgradeDict));
    localStorage.setItem("expeditionDictSave", JSON.stringify(expeditionDict));
    localStorage.setItem("InventorySave", JSON.stringify(Array.from(InventoryMap)));
    localStorage.setItem("achievementListSave", JSON.stringify(Array.from(achievementMap)));
    localStorage.setItem("persistentValues", JSON.stringify(persistentValues));

    if (table7.innerHTML != "") {
        let savedTable7 = (table7.innerHTML).replace('shadow-pop-tr','')
        localStorage.setItem("storeInventory",JSON.stringify(savedTable7));
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

    if (localStorage.getItem("storeInventory") != null) {
        addShop();
    }
}

// CHANGE TABS
function tabChange(x) {
    if (timerSeconds !== 0) {
        tabElement.load();
        tabElement.play();
    }

    let i = 7;
    let tabButton;
    while (i--) {
        if (document.getElementById("tab-" + (i)) != null) {
            tabButton = document.getElementById("tab-" + (i));
        } else {
            continue;
        }
        
        if (!tabButton.firstChild.classList.contains("darken")) {
            tabButton.firstChild.classList.add("darken");
        }
        if (i == x - 1) {
            if (tabButton.firstChild.classList.contains("darken")) {
                tabButton.firstChild.classList.remove("darken");
            }
        }
    }
    
    for (let i=0, len=TABS.length; i < len; i++){
        if (TABS[i].style.display !== "none") {
            TABS[i].style.display = "none";
        }
    }

    if (heroTooltip !== -1) {
        heroTooltip = upgradeDict[heroTooltip].Row;
        let removeActiveHero = document.getElementById(`but-${heroTooltip}`);
        if (removeActiveHero.classList.contains("active-hero")) {
            removeActiveHero.classList.remove("active-hero");
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
    if (document.getElementById("nut-store-table")) {
        let nutStoreTemp = document.getElementById("nut-store-table");
        if (nutStoreTemp.style.display === "flex") {nutStoreTemp.style.display = "none"}
    }

    if (x == 0) {
        if (filterDiv.style.display !== "flex") {filterDiv.style.display = "flex"};
        if (table6.style.display !== "flex") {table6.style.display = "flex"};
        tooltipTable = 1;
        updateFilter(filteredHeroes);
        if (document.getElementById("tool-tip-button")) {
            let tooltipButtonText = document.getElementById("tool-tip-button");
            tooltipButtonText.innerText = "Purchase";
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
        dialog.innerText = "Welcome! Feel free to have a look. I'll even help package up your purchase, free of charge."
    }

    if (x != 3 && wishCounter != saveValues["wishCounterSaved"]) {
        let mailImageTemp = document.getElementById("mailImageID")
        mailImageTemp.style.opacity = 1;
    }

    updateWishDisplay();
}

// SETTINGS MENU - SAVES & VOLUME CONTROL
function settings() {
    importClipboard("create");
    toggleClipboard("create");
    // JUST THE BUTTON FOR SETTING MENU
    let settingButton = document.createElement("button");
    settingButton.classList.add("settings-button");
    let settingButtonImg = document.createElement("img");
    settingButtonImg.src = "./assets/settings/settings-logo.webp";
    settingButtonImg.classList.add("settings-button-img")
    settingButton.appendChild(settingButtonImg);

    // RELATED TO SETTINGS MENU
    var settingsMenu = document.createElement("div");
    settingsMenu.id = "settings-menu";
    settingsMenu.classList.add("flex-column","settings-menu");

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
    
    let settingsBottom = document.createElement("div");
    settingsBottom.classList.add("flex-row","settings-bottom");

    // BOTTOM RIGHT OF SETTINGS
    let settingsBottomRight = document.createElement("div");
    settingsBottomRight.classList.add("settings-bottom-right");

    let infoSetting = document.createElement("button");
    infoSetting.classList.add("setting-info");
    infoSetting.addEventListener("click", ()=> {
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
    let settingsBottomLeft = document.createElement("div");
    settingsBottomLeft.classList.add("settings-bottom-left");

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
    settingsBottomLeft.appendChild(label);

    let exportSaveSetting = document.createElement("div");
    exportSaveSetting.innerText = "Export Save";
    exportSaveSetting.classList.add("flex-row");
    exportSaveSetting.addEventListener("click",()=>{toggleClipboard("toggle")})

    let importSaveSetting = document.createElement("div");
    importSaveSetting.innerText = "Import Save";
    importSaveSetting.classList.add("flex-row");
    importSaveSetting.addEventListener("click",()=>{importClipboard("toggle")})

    let cancelButton = document.createElement("button");
    cancelButton.classList.add("cancel-button");
    cancelButton.addEventListener("click",()=>{
        settingsMenu.style.zIndex = -1;
        settingsOpen = false;
        deleteConfirmMenu("close","loaded");
    })

    settingsBottomRight.append(importSaveSetting,exportSaveSetting,infoSetting,saveSetting,clearSetting);
    settingsBottom.append(settingsBottomLeft,settingsBottomRight);
    settingsMenu.append(settingsText, volumeScrollerContainer, settingsBottom,cancelButton);
    mainBody.appendChild(settingsMenu);

    settingButton.addEventListener("click", () => {
        toggleSettings();
        let deleteBox = document.getElementById("confirm-box");
        if (deleteBox.style.zIndex == 1000) {deleteBox.style.zIndex = -1};
    })
    multiplierButtonContainer.prepend(settingButton);
}

let settingsOpen = false;
function toggleSettings(closeOnly) {
    toggleClipboard("close");
    importClipboard("close");
    let settingsMenu = document.getElementById("settings-menu");
    if (settingsOpen == true) {
        settingsMenu.style.zIndex = -1;
        settingsOpen = false;
    } else {
        if (closeOnly !== true) {
            settingsMenu.style.zIndex = 1000;
            settingsOpen = true;
        }
    }
}

function settingsVolume() {
    let volumeScroller = document.getElementById('volume-scroller-bgm');
    let bgmAudio = document.getElementById('bgm');
    volumeScroller.addEventListener("change", function() {
        bgmElement.volume = this.value / 100;
        fightBgmElement.volume = this.value / 100;
        settingsValues.bgmVolume = this.value / 100;
    });

    let sfxScroller = document.getElementById('volume-scroller-sfx');
    sfxScroller.addEventListener("change", function() {
        for (let i=0,len=sfxArray.length; i < len; i++) {
            sfxArray[i].volume = this.value / 100;
            settingsValues.sfxVolume = this.value / 100;
        }
    });
}

function toggleClipboard(type) {
    if (type == "create") {
        let textBoxDiv = document.createElement("div");
        textBoxDiv.classList.add("text-box");
        textBoxDiv.id = "text-box";
        textBoxDiv.style.zIndex = -1;

        let textBox = document.createElement("textarea");
        let cancelButton = document.createElement("button");
        cancelButton.addEventListener("click",()=>{
            textBoxDiv.style.zIndex = -1;
        })

        let copyButton = document.createElement("button");
        copyButton.innerText = "Copy to Clipboard";
        copyButton.addEventListener("click",()=>{
            let text = JSON.stringify(localStorage);
            navigator.clipboard
            .writeText(text)
            .then(()=>{
                alert(`Copied save data to clipboard.`)
            })
            .catch(() => {
                alert(`Failed to copy to clipboard.`)
            });
        })
        
        textBoxDiv.append(textBox,cancelButton,copyButton);
        mainBody.appendChild(textBoxDiv);
    } else if (type == "toggle") {
        let textBox = document.getElementById("text-box");
        if (textBox.style.zIndex == -1) {
            importClipboard("close");
            textBox.children[0].value = JSON.stringify(localStorage);
            textBox.style.zIndex = 10000;
        } else {
            textBox.style.zIndex = -1;
        }
    } else if (type == "close") {
        let textBox = document.getElementById("text-box");
        if (textBox.style.zIndex != -1) {
            textBox.style.zIndex = -1;
        }
    }
}

function importClipboard(type) {
    if (type == "create") {
        let textBoxDiv = document.createElement("div");
        textBoxDiv.classList.add("text-box");
        textBoxDiv.id = "import-box";
        textBoxDiv.style.zIndex = -1;

        let textBox = document.createElement("textarea");
        textBox.value = "Paste save data here.";
        let cancelButton = document.createElement("button");
        cancelButton.addEventListener("click",()=>{
            textBoxDiv.style.zIndex = -1;
        })

        let copyButton = document.createElement("button");
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
            
                        if(localStorage.length === 0) {
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
                            setTimeout(()=>location.reload(),200);
                        },
                        function(error) {console.error("Error clearing local data")}
                    ); 
                }
                preventSave = false;
            }
        })
        
        textBoxDiv.append(textBox,cancelButton,copyButton);
        mainBody.appendChild(textBoxDiv);
    } else if (type == "toggle") {
        let textBox = document.getElementById("import-box");
        if (textBox.style.zIndex == -1) {
            toggleClipboard("close");
            textBox.style.zIndex = 10000;
        } else {
            textBox.style.zIndex = -1;
        }
    } else if (type == "close") {
        let textBox = document.getElementById("import-box");
        if (textBox.style.zIndex != -1) {
            textBox.style.zIndex = -1;
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
    multiplierButton1.addEventListener("click",() => {costMultiplier(10),currentDimMultiplier = dimMultiplierButton(1, currentDimMultiplier)})

    let multiplierButton2 = document.createElement("button");
    multiplierButton2 = multiplierButtonAdjust(multiplierButton2,2);
    multiplierButton2.addEventListener("click",() => {costMultiplier(25),currentDimMultiplier = dimMultiplierButton(2, currentDimMultiplier)})
    
    let multiplierButton3 = document.createElement("button");
    multiplierButton3 = multiplierButtonAdjust(multiplierButton3,3);
    multiplierButton3.addEventListener("click",() => {costMultiplier(100),currentDimMultiplier = dimMultiplierButton(3, currentDimMultiplier)})

    multiplierButtonContainer.append(multiplierButton3, multiplierButton2, multiplierButton1);
    midDiv.appendChild(multiplierButtonContainer)
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
    
    filterButton.addEventListener("click",()=>{
        if (table1.style.display == "flex") {
            if (filterMenuOne.style.display == "flex") {
                filterMenuOne.style.display = "none";
            } else {
                filterMenuOne.style.display = "flex";
            }
        } else if (table2.style.display == "flex") {
            if (filterMenuTwo.style.display == "flex") {
                filterMenuTwo.style.display = "none";
            } else {
                filterMenuTwo.style.display = "flex";
            }
        }
    })

    const heroOptions = ['Pyro','Hydro','Anemo','Electro','Dendro','Cryo','Geo','Sword','Claymore','Catalyst','Polearm','Bow','Sumeru','Mondstadt','Liyue','Inazuma'];
    const invOptions = ['Artifact','Food','Level','Gemstone','Talent','Sword','Claymore','Catalyst','Polearm','Bow'];
    for (let i=0,len=heroOptions.length; i < len; i++) {
        let filterPicture;
        filterPicture = document.createElement("button");
        filterPicture.style.backgroundImage = "url(./assets/tooltips/elements/" +heroOptions[i]+ ".webp)";
        filterPicture.classList.add("background-image-cover")

        filterPicture.addEventListener("click",()=> {
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
    
    filterDiv.append(filterButton,filterMenuOne,filterMenuTwo,filterCurrently);
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
                heroTooltip = upgradeDict[heroTooltip].Row;
                let removeActiveHero = document.getElementById(`but-${heroTooltip}`);
                if (removeActiveHero.classList.contains("active-hero")) {
                    removeActiveHero.classList.remove("active-hero");
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
                    heroTooltip = upgradeDict[heroTooltip].Row;
                    let removeActiveHero = document.getElementById(`but-${heroTooltip}`)
                    if (removeActiveHero.classList.contains("active-hero")) {
                        removeActiveHero.classList.remove("active-hero");
                    }
                }
                heroTooltip = i;
                heroButtonContainer.classList.add("active-hero");
            });
            heroButtonContainer.innerText = heroText;
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
                realScoreCurrent += costCurrent;
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
        saveValues["heroesPurchased"] += 1 * currentMultiplierLocal;
        checkExpeditionUnlock(saveValues["dps"]);                                        
        refresh(butIdArray, upgradeDictTemp["BaseCost"], clicked_id);
            
        changeTooltip(upgradeInfo[clicked_id],"hero",clicked_id);                   
        saveValues["realScore"] = realScoreCurrent;
    }
}

var currentDimMultiplier = 0;
var currentMultiplier = 1;
function costMultiplier(multi) {
    if (currentMultiplier == multi) {
        currentMultiplier = 1;
    } else {
        currentMultiplier = multi;
    }

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
                inventoryAdd(i, "load")
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
// RMB TO UPDATE CONSTANTS
const weaponBuffPercent =   [0, 1.1, 1.3, 1.7, 2.1, 2.7, 4.6];
const artifactBuffPercent = [0, 1.05, 1.15, 1.35, 1.55, 1.85];
const foodBuffPercent =     [0, 1.4, 2.0, 3.1, 4.4, 6.2];
const nationBuffPercent =   [0, 0, 1.2, 1.5, 1.8];
const energyBuffPercent =   [0, 0, 0, 125, 300, 650];
function itemUse(itemUniqueId) {
    let itemID;
    if (typeof itemUniqueId === 'string') {
        itemID = itemUniqueId.split(".")[0];
    } else {
        itemID = itemUniqueId;
    }
    
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
                    let additionPower = Math.ceil(upgradeDictTemp["Factor"] * upgradeDictTemp.Purchased * (weaponBuffPercent[Inventory[itemID].Star] - 1));
                    additionPower = Math.round(additionPower * additionalStrength);
                    if (i !== 0) {saveValues["dps"] += additionPower} else {saveValues["clickFactor"] += additionPower}
                    upgradeDict[i]["Contribution"] += additionPower;
                    upgradeDictTemp["Factor"] *= weaponBuffPercent[Inventory[itemID].Star];
                    upgradeDict[i]["Factor"] = Math.ceil(upgradeDictTemp["Factor"]);
                    refresh("hero", i);
                    updatedHero(i);
                }
            }
        }
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
                let additionPower = Math.ceil(upgradeDictTemp["Factor"] * upgradeDictTemp.Purchased * (artifactBuffPercent[Inventory[itemID].Star] - 1));
                additionPower = Math.round(additionPower * additionalDefense);
                if (i !== 0) {saveValues["dps"] += additionPower} else {saveValues["clickFactor"] += additionPower}
                upgradeDict[i]["Contribution"] += additionPower;

                upgradeDictTemp["Factor"] *= artifactBuffPercent[Inventory[itemID].Star];
                upgradeDict[i]["Factor"] = Math.ceil(upgradeDictTemp["Factor"]);
                refresh("hero", i);
            }
        }
    } else if (itemID >= 3001 && itemID < FOODMAX){
        foodButton(1);
        foodBuff = foodBuffPercent[Inventory[itemID].Star];
        foodBuff *= additionalDefense;
    } else if (itemID >= 4001 && itemID < XPMAX){
        saveValues["freeLevels"] += randomInteger(Inventory[itemID].BuffLvlLow,Inventory[itemID].BuffLvlHigh);
        refresh();
    } else if (itemID >= 4011 && itemID < 4014){
        saveValues["energy"] += energyBuffPercent[Inventory[itemID].Star];
        refresh();
    } else if (itemID === 4010) {
        saveValues["mailCore"]++;
    } else if (itemID === 5001 || itemID === 5002){
        let power = 1;
        if (Inventory[itemID].Star === 5) {
            power = 1.9;
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
                let additionPower = Math.ceil(upgradeDictTemp["Factor"] * upgradeDictTemp.Purchased * (power - 1));
                additionPower = Math.round(additionPower * additionalDefense);
                if (i !== 0) {saveValues["dps"] += additionPower} else {saveValues["clickFactor"] += additionPower}
                upgradeDict[i]["Contribution"] += additionPower;

                upgradeDictTemp["Factor"] *= power;
                upgradeDict[i]["Factor"] = Math.ceil(upgradeDictTemp["Factor"]);
                refresh("hero", i);
            }
        }

        clearTooltip();
        return;
    } else if (itemID >= 5001 && itemID < 5050){
        let power;
        let elem = Inventory[itemID].element;
        if (Inventory[itemID].Star === 4) {
            power = 2.2;
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
            if (upgradeDict[i].Purchased > 0) {
                if (upgradeInfo[i].Ele == elem || upgradeInfo[i].Ele == "Any") {
                    let upgradeDictTemp = upgradeDict[i];
                    let additionPower = Math.ceil(upgradeDictTemp["Factor"] * upgradeDictTemp.Purchased * (power - 1));
                    additionPower = Math.round(additionPower * additionalDefense);
                    if (i !== 0) {saveValues["dps"] += additionPower} else {saveValues["clickFactor"] += additionPower}
                    upgradeDict[i]["Contribution"] += additionPower;

                    upgradeDictTemp["Factor"] *= power;
                    upgradeDict[i]["Factor"] = Math.ceil(upgradeDictTemp["Factor"]);
                    refresh("hero", i);
                    updatedHero(i);
                }
            }
        }
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
                    let additionPower = Math.ceil(upgradeDictTemp["Factor"] * upgradeDictTemp.Purchased * (power - 1));
                    additionPower = Math.round(additionPower * additionalStrength);
                    if (i !== 0) {saveValues["dps"] += additionPower} else {saveValues["clickFactor"] += additionPower}
                    upgradeDict[i]["Contribution"] += additionPower;

                    upgradeDictTemp["Factor"] *= power;
                    upgradeDict[i]["Factor"] = Math.ceil(upgradeDictTemp["Factor"]);
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

//-------------------------------------------------------------TABLE 3 (EXPEDITION + EXPEDITION TOOLTIPS)----------------------------------------------------------//
// EXPEDITION MECHANICS
const ADVENTURECOSTS = [0, 100, 250, 500, 750, 1000];
function adventure(type) {
    if (type !== 10 && saveValues["energy"] >= ADVENTURECOSTS[type]) {
        if (expeditionDict[type] != '1') {
            adventureElement.load();
            adventureElement.play();
            if (type === 5 && goldenNutUnlocked === true && expeditionDict[type].Locked != '1') {
                currencyPopUp("items",0,"nuts",randomInteger(5,10))
            } else {
                currencyPopUp("items");
            }
            // drawAdventure(type);
        } else {
            weaselDecoy.load();
            weaselDecoy.play();
        }
    }

    if (type === 10) {
        if (expeditionDict[5] != '1') {
            type = 5;
        }
        else if (expeditionDict[4] != '1') {
            type = 4;
        }
        else if (expeditionDict[3] != '1') {
            type = 3;
        } else {
            type = 2;
        }
        saveValues["energy"] += ADVENTURECOSTS[type];
    } else if (expeditionDict[type] == '1'){
        return;  
    }

    if (saveValues["energy"] >= ADVENTURECOSTS[type]){
        if (table3.style.display === "flex") {expedInfo(`exped-${type}`);}
        saveValues["energy"] -= ADVENTURECOSTS[type];
        refresh();
        
        let randomDraw = randomInteger(1,3);
        switch (type) {
            case 1:
                inventoryDraw("artifact", 1, 2);
                inventoryDraw("weapon", 1, 2);
                inventoryDraw("xp", 2, 2);
                inventoryDraw("food", 1, 2);
                break;
            case 2:
                inventoryDraw("xp", 2, 2);
                inventoryDraw("xp", 2, 3);
                inventoryDraw("food", 2, 3);
                inventoryDraw("artifact", 1, 3);
                inventoryDraw("weapon", 1, 3);

                if (randomDraw == 1) {
                    inventoryDraw("food", 1, 3);
                }
                break;
            case 3:
                inventoryDraw("xp", 3, 3);
                inventoryDraw("xp", 2, 3);
                inventoryDraw("artifact", 2, 4);
                inventoryDraw("weapon", 2, 4);
                inventoryDraw("talent", 2, 4);
                inventoryDraw("talent", 2, 4);

                if (randomDraw == 1) {
                    inventoryDraw("food", 2, 4);
                }
                break;
            case 4:
                inventoryDraw("xp", 3, 4);
                inventoryDraw("xp", 2, 3);
                inventoryDraw("artifact", 3, 4);
                inventoryDraw("weapon", 3, 4);
                inventoryDraw("artifact", 2, 3);
                inventoryDraw("artifact", 2, 3);
                inventoryDraw("gem", 4, 5);

                if (randomDraw == 1) {
                    inventoryDraw("food", 3, 5);
                }
                
                break;
            case 5:
                inventoryDraw("xp", 4, 4);
                inventoryDraw("xp", 4, 4);
                inventoryDraw("weapon", 4, 5);
                inventoryDraw("talent", 4, 4);
                inventoryDraw("artifact", 4, 5);  
                inventoryDraw("gem", 4, 5);
                inventoryDraw("weapon", 4, 4);
                inventoryDraw("talent", 4, 4);

                if (randomDraw == 1) {
                    inventoryDraw("food", 4, 5);
                } 
                break;
            default:
                console.error("Inventory error: Invalid item spawned");
                break;
        }
        sortList("table2");
        newPop(1);
    } else {
        expedInfo("exped-9");
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
    adventureGif.src = "./assets/expedbg/exped-Nahida.webp";
    adventureVideo.append(adventureGif,adventureHealth);

    let adventureEncounter = document.createElement("div");
    adventureEncounter.id = "adventure-encounter";
    adventureEncounter.classList.add("flex-column");
    adventureEncounter.style.display = "flex";
    let adventureHeading = document.createElement("p");
    adventureHeading.id = "adventure-header";
    let adventureChoiceOne = document.createElement("button");
    adventureChoiceOne.innerText = "Fight!";
    adventureChoiceOne.id = "adv-button-one";
    let adventureChoiceTwo = document.createElement("button");
    adventureChoiceTwo.id = "adv-button-two";

    let adventureFight = document.createElement("div");
    adventureFight.id = "adventure-fight";
    adventureFight.classList.add("flex-row","adventure-fight");
    adventureFight.style.display = "none";
    let adventureFightDodge = document.createElement("img");
    adventureFightDodge.src = "./assets/expedbg/battle1.webp";
    adventureFightDodge.id = "battle-toggle";

    adventureFightDodge.addEventListener("click",()=>{
        dodgeOn("toggle");
    })
    
    let adventureFightSkill = document.createElement("img");
    adventureFightSkill.src = "./assets/expedbg/battle2.webp";
    let adventureFightBurst = document.createElement("img");
    adventureFightBurst.src = "./assets/expedbg/battle3.webp";

    adventureFightBurst.addEventListener("click",()=>{
        attackAll();
    })

    document.addEventListener("keydown", function(event) {
        if (event.key === "1") {
            dodgeOn("toggle");
        } else if (event.key === "3") {
            attackAll();
        }
    })

    adventureFight.append(adventureFightDodge,adventureFightSkill,adventureFightBurst);
    adventureFight.style.display = "none";
    adventureChoiceOne.addEventListener("click",()=>{
        triggerFight();
        adventureEncounter.style.display = "none";
        adventureFight.style.display = "flex";
        adventureChoiceOne.style.display = "none";
    })

    adventureEncounter.append(adventureHeading,adventureChoiceOne,adventureChoiceTwo);
    adventureTextBox.append(adventureTextBG,adventureEncounter,adventureFight)
    adventureArea.append(adventureVideo,adventureTextBox)
    mainBody.append(adventureArea);
}

// ADVENTURE PROCESS
let adventureScene = false;
let adventureScaraText = "";
let enemyAmount = 0;
function drawAdventure(advType) {
    adventureScaraText = "";
    if (adventureScene) {return}
    adventureScene = true;
    if (advType == 5) {
        adventureScaraText = "-scara";
    };

    let waveType = enemyInfo.getRandomWave(advType,randomInteger);
    enemyAmount = waveType.Wave.length;
    let imageGif = document.getElementById("adventure-gif");
    let adventureFightImg = document.getElementById("adventure-fight").children;
    if (adventureScaraText) {
        imageGif.src = `./assets/expedbg/exped${adventureScaraText}.webp`;
        for (let i = 0; i < adventureFightImg.length; i++) {
            adventureFightImg[i].src = `./assets/expedbg/scara${i+1}.webp`;
            adventureFightImg[i].classList.add("fight-scara")
        }
    } else {
        for (let i = 0; i < adventureFightImg.length; i++) {
            adventureFightImg[i].src = `./assets/expedbg/battle${i+1}.webp`;
            adventureFightImg[i].classList.add("fight-button")
        }
    }
    
    let adventureChoiceOne = document.getElementById("adv-button-one");
    adventureChoiceOne.style.display = "block";
    let adventureChoiceTwo = document.getElementById("adv-button-two");
    adventureChoiceTwo.innerText = "Run away...";
    let adventureArea = document.getElementById("adventure-area");
    adventureArea.style.zIndex = 500;
    let adventureTextBox = document.getElementById("adventure-text");
    let adventureVideo = document.getElementById("adventure-video");
    adventureVideo.style.backgroundImage = `url(./assets/expedbg/scene/${advType}-B-${randomInteger(waveType.BG[0],waveType.BG[1])}.png)`;
    adventureVideo = spawnMob(adventureVideo,waveType.Wave);
    
    function textFadeIn() {
        adventureTextBox.style.animation = "";
        let adventureHeading = document.getElementById("adventure-header");
        adventureHeading.innerText = "You encounter a bunch of hostile fungi.";
        adventureHeading.style.animation = "fadeOut 1.4s ease-out reverse";
        adventureTextBox.removeEventListener("animationend", textFadeIn);
    }

    adventureTextBox.style.animation = "flipIn 1s ease-in-out forwards";
    adventureTextBox.addEventListener("animationend",textFadeIn);
    bgmElement.pause();
    fightEncounter.load();
    fightEncounter.play();
}

function spawnMob(adventureVideo,waveType) {
    for (let i = 0; i < waveType.length; i++) {
        let singleEnemyInfo = enemyInfo[waveType[i]];
        let mobDiv = document.createElement("div");
        let mobImg = new Image();
        mobImg.src = `./assets/expedbg/enemy/${singleEnemyInfo.Type}-${singleEnemyInfo.Class}-${randomInteger(1,singleEnemyInfo.Variation+1)}.webp`;
        mobImg.classList.add("enemyImg");

        mobDiv.enemyID = singleEnemyInfo;
        mobDiv.classList.add("enemy");
        mobDiv.append(mobImg);
        adventureVideo.append(mobDiv);
    }
    return adventureVideo;
}

let fightSceneOn = false;
function triggerFight() {
    if (!adventureScene) {return}
    fightSceneOn = true;

    let adventureVideo = document.getElementById("adventure-video");
    let adventureVideoChildren = adventureVideo.children;
    let currentSong;
    if (adventureScaraText) {
        currentSong = 4;
    } else {
        let mobDiv = adventureVideoChildren[2];
        if (mobDiv.enemyID.HP == 2666) {
            currentSong = 4;
        } else {
            currentSong = randomInteger(1,4);
        }
        
    }
    
    bgmElement.pause();
    fightBgmElement.src = `./assets/sfx/battleTheme-${currentSong}.mp3`;
    fightBgmElement.volume = settingsValues.bgmVolume;
    fightBgmElement.load();
    fightBgmElement.play();
    fightBgmElement.addEventListener("ended",()=>{
        fightBgmElement.load();
        fightBgmElement.play();
    })

    let healthDiv = document.getElementById("adventure-health");
    healthDiv.style.opacity = 1;
    let healthBar = document.getElementById("health-bar");
    healthBar.maxHealth = 15;
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

    for (let i = 0; i < healthBar.maxHealth; i++) {
        let health = new Image();
        health.src = `./assets/icon/health${adventureScaraText}.webp`;
        healthDiv.append(health);
    }
    
    for (let i = 0; i < adventureVideoChildren.length; i++) {
        let mobDiv = adventureVideoChildren[i];
        if (mobDiv.tagName != 'DIV') {continue}
        if (mobDiv.id == 'adventure-health') {continue}
        mobDiv.children[0].style.animation = `vibrate ${randomInteger(600,1200)/100}s linear infinite both`;

        let singleEnemyInfo = mobDiv.enemyID;
        let mobHealth = document.createElement("div");
        mobHealth.classList.add(`health-bar${adventureScaraText}`);
        
        mobHealth.maxHP = singleEnemyInfo.HP;
        mobHealth.health = singleEnemyInfo.HP;
        mobHealth.atk = singleEnemyInfo.ATK;
        mobHealth.class = singleEnemyInfo.Class;
        mobHealth.dead = false;
        
        let animationTime = randomInteger(singleEnemyInfo.AtkCooldownLower * 10,singleEnemyInfo.AtkCooldownUpper * 10)/100;
        mobDiv.attackTime = animationTime;
        let mobAtkIndicator = document.createElement("img");
        let canvas = document.createElement("canvas");
        canvas.classList.add("atk-indicator");
        mobAtkIndicator.src = `./assets/icon/atkIndicator${adventureScaraText}.webp`;
        if (mobHealth.class == "Superboss") {
            mobAtkIndicator.src = `./assets/icon/atkIndicator-boss.webp`;
        }

        canvas.brightness = 0 - 0.1 * (i * randomInteger(1,adventureVideoChildren.length) - 2);
        mobAtkIndicator.onload = ()=> {
            canvas.width = mobAtkIndicator.naturalWidth;
            canvas.height = mobAtkIndicator.naturalHeight;

            let ctx = canvas.getContext("2d");
            ctx.drawImage(mobAtkIndicator, 0, 0);
            let brightnessIncrement = Math.round(1 / animationTime * 100)/10000;
            let maxBrightness = 1;

            canvas.style.filter = `brightness(0)`;
            canvas.style.transform = ``;
            canvas.attackState = false;
            increaseBrightness();

            function increaseBrightness() {
                if (!fightSceneOn) {return}
                if (mobHealth.dead) {return}
                canvas.brightness += brightnessIncrement;
                if (canvas.attackState) {
                    loseHP(mobHealth.atk)
                    canvas.attackState = false;
                }

                if (canvas.brightness > 0.8) {
                    if (canvas.style.transform == ``) {
                        canvas.style.transform = `scale(1.2)`;
                        canvas.style.filter = `brightness(0.99) contrast(1.5) drop-shadow(0 0 5px #ffffff) drop-shadow(0 0 4px #ffffff)`;
                        canvas.classList.add("attack-ready");
                    }
                } else {
                    canvas.style.filter = `brightness(${canvas.brightness})`;
                }

                if (canvas.brightness > maxBrightness) {
                    canvas.attackState = true;
                    if (canvas.classList.contains("attack-ready")) {canvas.classList.remove("attack-ready")}
                    canvas.brightness = 0;
                    canvas.style.transform = ``;
                    canvas.style.filter = `brightness(0)`;
                }
                window.requestAnimationFrame(increaseBrightness);
        }
    }

        mobDiv.children[0].addEventListener("click",()=>{
            if (!fightSceneOn) {return}
            if (mobHealth.dead) {return}
            if (mobDiv.children[3] != undefined) {
                if (mobDiv.children[3].id === "select-indicator") {
                    if (canvas.classList.contains("attack-ready") && mobHealth.class != "Superboss") {
                        canvas.attackState = false;
                        canvas.classList.remove("attack-ready")
                        mobDiv.children[0].classList.add("staggered");
                        setTimeout(()=>{mobDiv.children[0].classList.remove("staggered")},animationTime * 150);
                        parrySuccess.load();
                        parrySuccess.play();
                        
                        canvas.brightness  = 0;
                        canvas.style.transform = ``;
                        canvas.style.filter = `brightness(0)`;
                    } else {
                        mobDiv.children[0].classList.add("damaged");
                        setTimeout(()=>{mobDiv.children[0].classList.remove("damaged")},animationTime * 150);
                        parryFailure.load();
                        parryFailure.play();
                    }
                    mobHealth.health -= 13;
                    dodgeOn("close");
                }
            }
            
            mobHealth.health -= 13;
            if (mobHealth.health <= 0) {
                mobHealth.dead = true;
                enemyAmount--;

                mobDiv.children[0].style.animation = "";
                mobDiv.style.filter = "grayscale(100%) brightness(20%)";
                fightEnemyDownElement.load();
                fightEnemyDownElement.play();
                mobHealth.remove();

                let mobChildArray = mobDiv.children;
                while (mobChildArray.length > 1) {
                    mobChildArray[mobChildArray.length - 1].remove();
                }
                if (enemyAmount === 0) {
                    winAdventure();
                }
            }
            mobHealth.style.width = `${Math.round(mobHealth.health/mobHealth.maxHP * 10000)/100}%`
            
        })
        mobDiv.append(mobHealth,canvas);
    }
}

function loseHP(ATK) {
    if (!fightSceneOn) {
        return;
    }

    let healthBar = document.getElementById('health-bar');
    let hpInterval = (100/healthBar.maxHealth);
    healthBar.currentWidth -= (hpInterval * ATK);

    if (healthBar.currentWidth < 1) {healthBar.currentWidth = 0}
    healthBar.style.width = `${healthBar.currentWidth}%`
    if (healthBar.currentWidth <= 0) {
        loseAdventure();
    }
}

let dodgeAppearance = false;
function dodgeOn(type) {
    if (type === "toggle") {
        if (dodgeAppearance) {
            let adventureVideo = document.getElementById("adventure-video");
            let adventureVideoChildren = adventureVideo.children;
            for (let i = 0; i < adventureVideoChildren.length; i++) {
                let mobDiv = adventureVideoChildren[i];
                if (mobDiv.tagName != 'DIV') {continue};
                if (mobDiv.id == 'adventure-health') {continue};
                if (mobDiv.children[1] == undefined) {continue};

                if (mobDiv.children[3]) {
                    if (mobDiv.children[3].id == "select-indicator") {
                        mobDiv.children[3].remove();
                    }
                }
            }

            let button = document.getElementById("battle-toggle");
            if (button.classList.contains("battle-selected")) {button.classList.remove("battle-selected")}
            if (button.classList.contains("battle-selected-scara")) {button.classList.remove("battle-selected-scara")}
            dodgeAppearance = false;
        } else {
            let adventureVideo = document.getElementById("adventure-video");
            let adventureVideoChildren = adventureVideo.children;
            for (let i = 0; i < adventureVideoChildren.length; i++) {
                let mobDiv = adventureVideoChildren[i];
                if (mobDiv.tagName != 'DIV') {continue};
                if (mobDiv.id == 'adventure-health') {continue};
                if (mobDiv.children[1] == undefined) {continue};

                let mobAtkIndicator = document.createElement("img");
                mobAtkIndicator.classList.add("select-indicator");
                mobAtkIndicator.id = "select-indicator";
                mobAtkIndicator.src = `./assets/icon/selectIndicator${adventureScaraText}.webp`
                mobDiv.appendChild(mobAtkIndicator);
            }

            let button = document.getElementById("battle-toggle");
            button.classList.add(`battle-selected${adventureScaraText}`);
            dodgeAppearance = true;
        }
    } else if (type === "close") {
        let adventureVideo = document.getElementById("adventure-video");
        let adventureVideoChildren = adventureVideo.children;
        for (let i = 0; i < adventureVideoChildren.length; i++) {
            let mobDiv = adventureVideoChildren[i];
            if (mobDiv.tagName != 'DIV') {continue};
            if (mobDiv.id == 'adventure-health') {continue};
            if (mobDiv.children[1] == undefined) {continue};
            if (mobDiv.children[3] == undefined) {continue};
            if (mobDiv.children[3].id == "select-indicator") {
                mobDiv.children[3].remove();
                continue;
            }
        }

        let button = document.getElementById("battle-toggle");
        if (button.classList.contains("battle-selected")) {button.classList.remove("battle-selected")}
        if (button.classList.contains("battle-selected-scara")) {button.classList.remove("battle-selected-scara")}
        dodgeAppearance = false;
    }
}

function attackAll() {
    let adventureVideo = document.getElementById("adventure-video");
    let adventureVideoChildren = adventureVideo.children;
    let cooldownTime;

    parryFailure.load();
    parryFailure.play();
    for (let i = 0; i < adventureVideoChildren.length; i++) {
        let mobDiv = adventureVideoChildren[i];
        if (mobDiv.tagName != 'DIV') {continue};
        if (mobDiv.id == 'adventure-health') {continue};
        if (!mobDiv.children[1]) {continue};

        let mobHealth = mobDiv.children[1];
        mobHealth.health -= 13;
        if (!cooldownTime) {cooldownTime = mobDiv.attackTime * 150}
        if (mobHealth.class != "Superboss") {
            mobDiv.children[0].classList.add("staggered");
            setTimeout(()=>{mobDiv.children[0].classList.remove("staggered")},cooldownTime);
        } else {
            mobDiv.children[0].classList.add("damaged");
            setTimeout(()=>{mobDiv.children[0].classList.remove("damaged")},cooldownTime);
        }
        
        if (mobHealth.health <= 0) {
            mobHealth.dead = true;
            enemyAmount--;

            mobDiv.children[0].style.animation = "";
            mobDiv.style.filter = "grayscale(100%) brightness(20%)";
            mobHealth.remove();

            let mobChildArray = mobDiv.children;
            while (mobChildArray.length > 1) {
                mobChildArray[mobChildArray.length - 1].remove();
            }
            if (enemyAmount === 0) {
                winAdventure();
            }
        }

        mobHealth.style.width = `${Math.round(mobHealth.health/mobHealth.maxHP * 10000)/100}%`;
        if (mobHealth.class != "Superboss") {
            let canvas = mobDiv.children[2];
            canvas.brightness = 0 - 0.1 * (i * randomInteger(1,adventureVideoChildren.length) - 2);
            canvas.style.transform = ``;
            canvas.style.filter = `brightness(0)`;
        }
    }
}

function loseAdventure() {
    if (!fightSceneOn) {return}
    fightSceneOn = false;

    let adventureHeading = document.getElementById("adventure-header");
    adventureHeading.innerText = "You passed out...";
    let adventureChoiceTwo = document.getElementById("adv-button-two");
    adventureChoiceTwo.innerText = "Leave";
    adventureChoiceTwo.addEventListener("click",()=>{
        quitAdventure();
        let newAdventureChoiceTwo = adventureChoiceTwo.cloneNode(true);
        adventureChoiceTwo.parentNode.replaceChild(newAdventureChoiceTwo, adventureChoiceTwo);
    })

    let adventureVideo = document.getElementById("adventure-video");
    let targetElements = adventureVideo.querySelectorAll('.atk-indicator');
    let len = targetElements.length;
    for (let i = 0; i < len; i++) {
        targetElements[i].remove();
    }

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
            setTimeout(()=>{bgmElement.play()},300)
        })
    },300)
    
}

function winAdventure() {
    if (!fightSceneOn) {return}
    fightSceneOn = false;

    let adventureHeading = document.getElementById("adventure-header");
    adventureHeading.innerText = "You won!";
    let adventureChoiceTwo = document.getElementById("adv-button-two");
    adventureChoiceTwo.innerText = "Leave";
    adventureChoiceTwo.addEventListener("click",()=>{
        quitAdventure();
        let newAdventureChoiceTwo = adventureChoiceTwo.cloneNode(true);
        adventureChoiceTwo.parentNode.replaceChild(newAdventureChoiceTwo, adventureChoiceTwo);
    })
    let adventureFight = document.getElementById("adventure-fight");
    adventureFight.style.display = "none";
    let adventureEncounter = document.getElementById("adventure-encounter");
    adventureEncounter.style.display = "flex";

    setTimeout(()=>{
        fightBgmElement.pause();
        fightWinElement.load();
        fightWinElement.play();
        fightWinElement.addEventListener('ended',()=>{
            setTimeout(()=>{bgmElement.play()},300)
        })
    },300)
}

function quitAdventure() {
    let adventureArea = document.getElementById("adventure-area");
    adventureArea.style.zIndex = -1;
    adventureScene = false;

    let adventureHeading = document.getElementById("adventure-header");
    adventureHeading.innerText = "";
    let imageGif = document.getElementById("adventure-gif");
    imageGif.src = "./assets/expedbg/exped-Nahida.webp";

    let adventureVideo = document.getElementById("adventure-video");
    let enemyElements = adventureVideo.getElementsByClassName("enemy");
    while (enemyElements.length > 0) {
        enemyElements[0].remove();
    }

    let adventureHealth = document.getElementById("adventure-health");
    adventureHealth.style.opacity = 0;
    let healthElements = adventureHealth.getElementsByTagName("IMG");
    while (healthElements.length > 0) {
        healthElements[0].remove();
    }
    let adventureHealthbarDiv = document.createElement("div");
    adventureHealthbarDiv.style.width = "100%";
    adventureScaraText = "";
}

// DRAWS FOR RANDOM INVENTORY LOOT 
function inventoryDraw(itemType, min, max, type){
    let upperInventoryType = {
        "weapon": WEAPONMAX, 
        "artifact": ARTIFACTMAX, 
        "food": FOODMAX, 
        "xp": XPMAX,
        "gem": 5017,
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
        drawnItem = randomInteger(lowerInventoryType[itemType], upperInventoryType[itemType])
        if (Inventory[drawnItem] == undefined) {continue}
        if (Inventory[drawnItem].Star >= min && Inventory[drawnItem].Star < (max + 1)) {
            if (type === "shop") {
                return drawnItem;
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
    for (let i = 1; i < 6; i++) {
        let expedButton = document.createElement("button");
        let backgroundImg;
        
        if (expeditionDict[i] == '1'){
            backgroundImg = "url(./assets/expedbg/exped6.webp)";
        } else {
            backgroundImg = "url(./assets/expedbg/exped" + i + ".webp)";
        }

        expedButton = expedButtonAdjust(expedButton, backgroundImg, i)
        expedButton.addEventListener("click", () => {
            if (adventureType === i) {
                expedButton.classList.remove("expedition-selected");
                adventureType = 0;
                expedInfo("exped-7");
                let advButton = document.getElementById("adventure-button");
                if (advButton.classList.contains("expedition-selected")) {
                    advButton.classList.remove("expedition-selected");
                }
            } else {
                clearExped();
                adventureType = i;
                expedButton.classList.add("expedition-selected");
                expedInfo(expedButton.id);
            }  
        });
        expedDiv.appendChild(expedButton);
    }

    let advButton = document.createElement("div");
    advButton.id = "adventure-button";
    advButton.classList.add("background-image-cover");
    advButton.innerText = "Adventure!"
    advButton.addEventListener("click",() => {
        if (adventureType != 0) {
            adventure(adventureType);
        }
    })

    let advTutorial = document.createElement("img");
    advTutorial.src = "./assets/icon/help.webp";
    advTutorial.id = "adventure-tutorial";
    advTutorial.addEventListener("click", () => {
        clearExped();
        expedInfo("exped-8");
        let advButton = document.getElementById("adventure-button");
        if (advButton.classList.contains("expedition-selected")) {
            advButton.classList.remove("expedition-selected");
        }
    })
    table3.append(advButton,advTutorial);
}

function clearExped() {
    if (adventureType != 0) {
        let id = "exped-" + adventureType;
        let old_exped = document.getElementById(id);
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

function expedInfo(butId) {
    let expedRow1 = document.getElementById("exped-row-1");
    let expedRow2 = document.getElementById("exped-row-2");
    let i = 0;

    let afterEnergyIcon = document.createElement("img");
    afterEnergyIcon.classList += " after-icon";
    afterEnergyIcon.id = "afterEnergyIcon";
    
    i = butId.split("-")[1];

    if (expeditionDict[i] == 0 || i == 7) {
        let advButton = document.getElementById("adventure-button");
        if (!advButton.classList.contains("expedition-selected")) {
            advButton.classList.add("expedition-selected");
        }
        expedRow1.innerText = expeditionDictInfo[i]["Text"];
        expedRow2.innerText = expeditionDictInfo[i]["Lore"];
        expedRow1.appendChild(afterEnergyIcon);
    } else if (i == 8 || i == 9) {
        expedRow1.innerText = expeditionDictInfo[i]["Text"];
        expedRow2.innerText = expeditionDictInfo[i]["Lore"];
        expedRow1.appendChild(afterEnergyIcon);
    } else {
        expedRow1.innerText = expeditionDictInfo[6]["Text"];
        expedRow2.innerText = expeditionDictInfo[6]["Lore"];
    }

    if (i == 7) {
        let afterEnergyRemove = document.getElementById("afterEnergyIcon");
        afterEnergyRemove.remove();
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
        if (wishHelpText.style.display != "none") {
            wishHelpText.style.display = "none";
        } else {
            wishHelpText.style.display = "flex";
        }
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
    wishButton.id = "wishButton"
    let wishButtonText = document.createElement("div");
    wishButtonText.id = "wishButtonText";
    wishButtonText.classList += " flex-row wish-button-text";
    wishButtonText.innerText = "???";

    table4 = drawUI.drawMailTable(table4);

    let mailImageDiv = document.getElementById("mail-image-div");
    let wishButtonImg = document.createElement("img");
    wishButtonImg.src = "./assets/frames/wishButton.webp";
    wishButtonImg.classList += " wish-button-img cover-all";
    wishButton.append(wishButtonImg,wishButtonText)
    mailImageDiv.append(wishButton);

    if (saveValues["wishCounterSaved"] === wishCounter) {
        wishUnlock();
        stopWish();
        wishMultiplier = saveValues["wishCounterSaved"];
    } else if (saveValues["wishUnlocked"] === true) {
        wishUnlock();
        wishMultiplier = saveValues["wishCounterSaved"];
    } 
}

function updateWishDisplay() {
    if (document.getElementById("wish-nps-display")) {
        let wishNpsDisplay = document.getElementById("wish-nps-display");
        if (saveValues["wishCounterSaved"] >= wishCounter) {
            wishNpsDisplay.innerText = "All Wish Heroes obtained!";
        } else {
            wishNpsDisplay.innerText = `Next character's NpS: ${abbrNum(Math.round(saveValues["dps"] * (STARTINGWISHFACTOR + wishMultiplier)/500 * wishPower + 1))}`;
        }
        let wishCurrency = document.getElementById("wish-counter-display");
        wishCurrency.innerHTML = wishCurrency.innerHTML.replace(/[^<]+</g, `${saveValues.mailCore}<`);
    }
}

function stopWish() {
    let wishButton = document.getElementById("wishButton");
    let wishButtonText = document.getElementById("wishButtonText");
    wishButtonText.innerText = "Closed";

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
                upgradeDictTemp["Factor"] = Math.round(saveValues["dps"] * (STARTINGWISHFACTOR + wishMultiplier)/500 * wishPower + 1);
                upgradeDictTemp["BaseCost"] = Math.round(saveValues["dps"] * (55) + 1);
                upgradeDictTemp["Contribution"] = 0;
                
                wishMultiplier++;
                saveValues["wishCounterSaved"]++;
                refresh();
                newPop(0);

                let mailImageTemp = document.getElementById("mailImageID");
                mailImageTemp.style.opacity = 0;
                wishAnimation(randomWishHero);
                break;
            }
        }
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
}


function popAchievement(achievement,loading) {
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
        saveValues["primogem"] += Math.round(20 * additionalPrimo);
        saveValues["achievementCount"]++;

        if (timerSeconds !== 0) {
            var achievementPopUp = drawUI.createAchievement(achievementText,achievementDesc);
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
    if (achievementData["achievementTypeRawScore"].length !== 0){
        if (saveValuesLocal["realScore"] >= achievementData["achievementTypeRawScore"][0]) {
            popAchievement("score");
            achievementData["achievementTypeRawScore"].shift();
            return;
        }
    } 

    if (achievementData["achievementTypeRawClick"].length !== 0){
        if (saveValuesLocal["clickCount"] >= achievementData["achievementTypeRawClick"][0]) {
            popAchievement("click");
            achievementData["achievementTypeRawClick"].shift();
            return;
        }
    }
    
    if (achievementData["achievementTypeRawDPS"].length !== 0){
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

//-----------------------------------------------------------------TABLE 6 (TOOLTIPS FOR TABLE 1 & 2)-----------------------------------------------------------//
// TOOLTIP UI
function createTooltip() {
    tooltipName = document.createElement("div");
    tooltipName.classList += " tool-tip-name";
    
    let toolInfo = document.createElement("div");
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
    tooltipText.classList += " tool-tip-text";
    tooltipLore = document.createElement("div");
    tooltipLore.classList += " tool-tip-lore";

    let tooltipExtraImg = document.createElement("div");
    tooltipExtraImg.classList.add("flex-row");
    tooltipExtraImg.classList += " tool-tip-extraimg";
    tooltipWeaponImg = document.createElement("img");
    tooltipElementImg = document.createElement("img");
    tooltipExtraImg.append(tooltipWeaponImg,tooltipElementImg);

    let tooltipButton = document.createElement("button");
    tooltipButton.id = "tool-tip-button";
    tooltipButton.classList.add("background-image-cover");
    tooltipButton.innerText = "Purchase";
    tooltipButton.addEventListener("click",()=>{tooltipFunction()})

    table6Background = document.createElement("img");
    table6Background.src = "./assets/tooltips/background.webp"
    table6Background.classList.add("table6-background");
    toolInfo.append(toolImgContainer,tooltipText,tooltipExtraImg);
    table6.append(tooltipName,toolInfo,tooltipLore,table6Background,tooltipButton);
}

var tooltipInterval = null;
function changeTooltip(dict, type, number) {
    if (tooltipInterval !== null) {
        clearInterval(tooltipInterval);
        tooltipInterval = null;
    }
    tooltipName.innerText = dict.Name;
    let lore = dict.Lore;
    lore = lore.replaceAll("[s]",`<span style='color:#A97803'>`)
    lore = lore.replaceAll("[/s]",`</span>`)
    lore = lore.replaceAll("\n",`<br>`)
    tooltipLore.innerHTML = lore;

    if (toolImgContainer.style.display != "block") {
        toolImgContainer.style.display = "block";
    }

    if (type == "hero") {
        let tooltipTextLocal = "Level: " + upgradeDict[number]["Purchased"] + 
                                "\n Free Levels: " + saveValues["freeLevels"] + 
                                "\n" + abbrNum(upgradeDict[number]["Contribution"],2) + ` ${dict.Name === "Nahida" ? 'Nuts per Click' : 'Nps'}`;
        toolImgOverlay.src = "./assets/tooltips/hero/"+dict.Name+".webp";

        tooltipElementImg.src = "./assets/tooltips/elements/" +dict.Ele+ ".webp";
        if (tooltipElementImg.style.display != "block") {
            tooltipElementImg.style.display = "block";
        }
        tooltipWeaponImg.src = "./assets/tooltips/elements/" +dict.Type+ ".webp";
        if (tooltipWeaponImg.style.display != "block") {
            tooltipWeaponImg.style.display = "block";
        }
        
        tooltipText.innerText = tooltipTextLocal;
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
            tooltipName.innerText = "Go on expeditions to get items!";
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
        upgrade(heroTooltip);
        if (timerSeconds !== 0) {
            upgradeElement.load();
            upgradeElement.play();
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
        InventoryMap.set(itemTooltip,inventoryCount)

        if (inventoryCount > 0) {
            changeTooltip(Inventory[itemTooltip],"item",itemTooltip)
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
    if (localStorage.getItem("storeInventory") === null) {
        if (saveValues["primogem"] > SHOP_THRESHOLD) {
            // GENERATING A LOCAL SHOP
            addShop();
            shopTime = getTime();
            localStorage.setItem("shopStartMinute",shopTime);
            setShop();
            setTimeout(()=>saveData(),1000)
            // IT IS PERSISENT TO LOCALSTORAGE
            newPop(5);
            newPop(13);
        }
    }
}

// SHOP TIMER
function shopTimerFunction() {
    if (shopTimerElement != null) {
        let time_passed = Math.floor(getTime() - parseInt(shopTime));
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

function setShop() {
    table7.classList.add("table-without-tooltip");
    let shopImg = document.createElement("img");
    shopImg.src = "./assets/icon/shop-start.webp";

    shopTimerElement = document.createElement("div");
    shopTimerElement.classList.add("flex-column");
    shopTimerElement.classList.add("store-timer");
    shopTimerElement.classList.add("background-image-cover");
    shopTimerElement.id = "shop-timer"
    let currentMin = localStorage.getItem("shopStartMinute");
    let minutesPassed = (getTime() / (1000 * 60));
    shopTimerElement.innerText = "Inventory resets in: " + (SHOPCOOLDOWN - (currentMin - minutesPassed)) + " minutes";

    let shopDiv = document.createElement("div");
    shopDiv.classList.add("store-div");
    shopDiv.id = "shop-container";
    let i=10;
    while (i--) {
        let inventoryNumber;
        if (i >= 7 && i <= 9) {
            inventoryNumber = inventoryDraw("talent", 2,4, "shop");
        } else if (i === 6) {
            inventoryNumber = randomInteger(4011,4014);
        } else if (i === 5) {
            if (saveValues["wishUnlocked"] === true) {
                inventoryNumber = 4010;
            } else {
                inventoryNumber = inventoryDraw("gem", 4,6, "shop");
            }
        } else if (i >= 2 && i <= 4) {
            inventoryNumber = inventoryDraw("gem", 4,6, "shop");
        } else {
            inventoryNumber = inventoryDraw("weapon", 5,6, "shop")
        }
        createShopItems(shopDiv, i, inventoryNumber);
    }

    let shopDialogueDiv = document.createElement("div");
    shopDialogueDiv.classList.add("flex-row");
    shopDialogueDiv.classList.add("store-dialog");

    let shopDialogueButton = document.createElement("div");
    shopDialogueButton.classList.add("flex-row");
    shopDialogueButton.classList.add("store-buy");
    shopDialogueButton.innerText = "Confirm Purchase";
    shopDialogueButton.id = "shop-confirm";
    let shopDialogueText = document.createElement("div");
    shopDialogueText.classList.add("flex-column");
    shopDialogueText.id = "table7-text";

    shopDialogueDiv.append(shopDialogueText,shopDialogueButton)
    table7.append(shopImg,shopTimerElement,shopDiv,shopDialogueDiv);
    saveData();
}

function loadShop() {
    let shopTemp = localStorage.getItem("storeInventory");
    shopTemp = JSON.parse(shopTemp);
    table7.innerHTML = shopTemp;
    shopTimerElement = document.getElementById("shop-timer");

    let shopButtons = (document.getElementById("shop-container")).children;
    for (let i=0,len=shopButtons.length; i < len; i++) {
         shopButtons[i].addEventListener("click", function() {
            buyShop(shopButtons[i].id,shopButtons[i].id.split("-")[3])
        });
    }
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
        dialog.innerText = "Any questions or troubles? I'm here to personally assist you!";
        shopId = null;
        let confirmButtonNew = confirmButton.cloneNode(true);
        confirmButton.parentNode.replaceChild(confirmButtonNew, confirmButton);
    } else {
        dialog.innerText = "Are you sure? Remember, no refunds!";
        button.classList.add("shadow-pop-tr");
        confirmButton.addEventListener("click", function() {
            confirmPurchase(shopCost,id);
        })
        shopId = id;
    }
}

function refreshShop(minutesPassed) {
    let shopContainer = document.getElementById("shop-container");
    shopContainer.innerHTML = "";
    let i=10;
    while (i--) {
        let inventoryNumber;
        if (i >= 7 && i <= 9) {
            inventoryNumber = inventoryDraw("talent", 2,4, "shop");
        } else if (i === 6) {
            inventoryNumber = randomInteger(4011,4014);
        } else if (i === 5) {
            if (saveValues["wishUnlocked"] === true) {
                inventoryNumber = 4010;
            } else {
                inventoryNumber = inventoryDraw("gem", 4,6, "shop");
            }
        } else if (i >= 2 && i <= 4) {
            inventoryNumber = inventoryDraw("gem", 4,6, "shop");
        } else {
            inventoryNumber = inventoryDraw("weapon", 5,6, "shop")
        }
        createShopItems(shopContainer, i, inventoryNumber);
    }

    shopId = null;
    shopTime = minutesPassed;
    localStorage.setItem("shopStartMinute",minutesPassed)
}

function confirmPurchase(shopCost,id) {
    let mainButton = document.getElementById(id);
    let dialog = document.getElementById("table7-text");
    if (saveValues.primogem >= shopCost) {
        id = id.split("-")[2];
        shopElement.load();
        shopElement.play();
        newPop(1);
        inventoryAdd(id);
        sortList("table2");
        mainButton.classList.remove("shadow-pop-tr");
        mainButton.classList.add("purchased");
        saveValues.primogem -= shopCost;

        let confirmButton = document.getElementById("shop-confirm");
        let confirmButtonNew = confirmButton.cloneNode(true);
        confirmButton.parentNode.replaceChild(confirmButtonNew, confirmButton);
        dialog.innerText = "Hehe, you've got good eyes."
    } else {
        dialog.innerText = "Hmph, come back when you're a little richer."
        return;
    }
}

function createShopItems(shopDiv, i, inventoryNumber) {
    let shopButton = document.createElement("div");
    shopButton.classList.add("flex-column");
    shopButton.classList.add("shop-button");
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

    shopCost;
    let shopButtonPrimo = document.createElement("img");
    shopButtonPrimo.classList.add("shop-button-primo");
    shopButtonPrimo.src = "./assets/icon/primogemIcon.webp";
    shopButtonText.innerText = shopCost;
    shopButtonText.appendChild(shopButtonPrimo);

    shopButton.id = ("shop-" + i + "-" + inventoryNumber + "-" + shopCost);
    shopButton.addEventListener("click", function() {
        buyShop(shopButton.id,shopCost)
    })
    
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
        cost = Math.ceil((amount)**2)
    } else if (scaleCeiling === 25) {
        cost = Math.ceil((amount)**3)
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

    let mainTable = rightDiv.childNodes[1];
    let nutStoreTable = document.createElement("div");
    nutStoreTable.classList.add("table-without-tooltip","nut-store-table","flex-column");
    nutStoreTable.id = "nut-store-table";
    let nutStoreCurrency = document.createElement("div");
    nutStoreCurrency.id = "nut-store-currency";
    nutStoreCurrency.classList.add("flex-row");
    nutStoreCurrency.innerText = abbrNum(persistentValues["goldenCore"],2,true);
    let nutStoreCurrencyImage = document.createElement("img");
    nutStoreCurrencyImage.src = "./assets/icon/core.webp";
    nutStoreCurrency.appendChild(nutStoreCurrencyImage);
    let shopHeader = document.createElement("img");
    shopHeader.src = "./assets/tooltips/store-header.webp";
    let nutShopDiv = document.createElement("div");
    nutShopDiv.id = "nut-shop-div";
    let nutTranscend = document.createElement("div");
    nutTranscend.id = "nut-shop-transcend";
    let nutAscend = document.createElement("button");
    nutAscend.innerText = "Transcend";

    let nutStoreButton = document.createElement("button");
    nutStoreButton.classList = "nut-store-access";
    nutStoreButton.addEventListener("click",()=>{
        calculateGoldenCore();
        if (nutStoreTable.style.display == "flex") {
            nutStoreTable.style.display = "none";
        } else {
            nutStoreTable.style.display = "flex";
        }
    })
    leftDiv.appendChild(nutStoreButton);

    let len = (getHighestKey(permUpgrades) + 1);
    for (let i=1; i < len; i++) {
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
    nutAscend.addEventListener("click",()=>{
        if (nutShopDiv.style.display === "flex") {
            nutTranscend.style.display = "flex";
            nutShopDiv.style.display = "none";
            nutAscend.innerText = "Upgrade";
        } else {
            nutTranscend.style.display = "none";
            nutShopDiv.style.display = "flex";
            nutAscend.innerText = "Transcend";
        }
    })

    nutTranscend.classList.add("nut-transcend","flex-column");
    let titleText = document.createElement("p");
    titleText.innerText = "Do you wish to turn \n back time and transcend?";

    let bodyText = document.createElement("div");
    bodyText.classList.add("flex-row")
    let bodyTextLeft = document.createElement("p");
    bodyTextLeft.innerText = `You lose: \n\n All Nuts, \n All Items, \n Energy, \n Primogems, \n Achievements`;
    bodyTextLeft.classList.add("flex-column");
    let bodyTextRight = document.createElement("p");
    bodyTextRight.id = "transcend-display";
    bodyTextRight.classList.add("flex-column");
    bodyText.append(bodyTextLeft,bodyTextRight);

    let bodyTextBottom = document.createElement("p");
    bodyTextBottom.innerText = "Gain more by upgrading heroes, getting achievements, \n primogems & nuts (golden or otherwise).";

    let trascendButton = document.createElement("button");
    trascendButton.innerText = "Yes";
    trascendButton.addEventListener("click",()=>{
        calculateGoldenCore();
        toggleTranscendMenu();
    })
    nutTranscend.append(titleText,bodyText,bodyTextBottom,trascendButton);

    nutStoreTable.append(shopHeader,nutTranscend,nutShopDiv,nutAscend,nutStoreCurrency);
    mainTable.appendChild(nutStoreTable);
    calculateGoldenCore();
}

function calculateGoldenCore(type) {
    let calculateNuts = 0;
    if( saveValues.realScore > 1e6) {calculateNuts = Math.log(saveValues.realScore)}
    let goldenNutValue = Math.round(((saveValues.heroesPurchased/25))*2 + calculateNuts + saveValues.primogem/10 + saveValues.goldenNut + saveValues.achievementCount * 3);

    if (type == "formula") {
        return goldenNutValue;
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

    mainBody.appendChild(transcendMenu)
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
        saveData(true);
        drawUI.preloadImage(1,"transcend",true);

        setTimeout(()=>{
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
                    let overlay = document.getElementById("loading");
                    overlay.style.zIndex = 100000;
                    overlay.children[0].style.backgroundImage = "url(./assets/bg/wood.webp";

                    let oldGif = overlay.children[0].children[0];
                    let newGif = oldGif.cloneNode(true);
                    oldGif.parentNode.replaceChild(newGif, oldGif);
                    newGif.src = "./assets/transcend.webp";
                    newGif.classList.add("overlay-tutorial")

                    persistentValues.goldenCore += calculateGoldenCore("formula");
                    
                    localStorage.setItem("settingsValues", JSON.stringify(settingsValues));
                    localStorage.setItem("persistentValues", JSON.stringify(persistentValues));

                    let newSaveValues = saveValuesDefault;
                    newSaveValues.goldenTutorial = true;
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
            let currentSlide = 1;
            let nutTutorialDark = document.createElement("div");
            nutTutorialDark.classList.add("cover-all","flex-column","tutorial-dark");

            let tutorialImage = document.createElement("img");
            tutorialImage.classList.add("tutorial-img");
            tutorialImage.src = "./assets/tutorial/goldenNut-1.webp";
            
            let tutorialScreen = document.createElement("div");
            tutorialScreen.classList.add("flex-column","tutorial-screen");
            tutorialScreen.addEventListener("click",()=>{
                if (currentSlide == 4) {
                    nutTutorialDark.remove();
                    stopSpawnEvents = false;
                    return;
                }
                currentSlide++;
                tutorialImage.src = "./assets/tutorial/goldenNut-"+currentSlide+".webp";
            })

            tutorialScreen.append(tutorialImage);
            nutTutorialDark.appendChild(tutorialScreen);
            mainBody.appendChild(nutTutorialDark);
        },3000);
    }
}

function updateCoreCounter() {
    if (!document.getElementById("nut-store-currency")) {return}
    let nutCounter = document.getElementById("nut-store-currency");
    let currentCount = abbrNum(persistentValues.goldenCore,2,true);
    nutCounter.innerHTML = nutCounter.innerHTML.replace(/[^<]+</g, `${currentCount}<`);
}

//------------------------------------------------------------------------MISCELLANEOUS------------------------------------------------------------------------//
// REFRESH SCORES & ENERGY
function refresh() {
    let formatScore = abbrNum(saveValues["realScore"]);
    score.innerText = `${formatScore} Nut${saveValues["realScore"] !== 1 ? 's' : ''}`;
    
    let formatDps = abbrNum(saveValues["dps"] * foodBuff);
    dpsDisplay.innerText = formatDps + " per second" ;
    energyDisplay.innerText = saveValues["energy"];
    primogemDisplay.innerText = saveValues["primogem"];
    
    if (arguments[0] != undefined) { // BUYING A HERO / UPDATING MULTIPLIERS
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
        }
        else if (arguments[0] == "hero") { // REFRESH FOR ARTIFACTS
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

            let heroText = upgradeInfo[arguments[1]].Name + ": " + abbrNum(formatCost,2) + ", +" + abbrNum(formatATK,2) + " NpS";
            let id="but-" + hero.Row + "";
            document.getElementById(id).innerText = heroText;
        }
    }
}

// POP UPS FOR EXPEDITIONS UNLOCKS
// NUMBER OF UPGRADES NEEDED TO UNLOCK EXPEDITIONS vvvv
let heroUnlockLevels = [1e6,1e9,1e12];
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
                    newPop(1);
                    newPop(3);
                    inventoryAdd(4010);
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
    } else if (type1 === "primogem") {
        currencyPopFirstImg.src = "./assets/icon/primogemIcon.webp";
        currencyPopFirstImg.classList.add("icon","primogem");
        saveValues.primogem += amount1;
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
        } else if (type2 === "primogem") {
            currencyPopSecondImg.src = "./assets/icon/primogemIcon.webp";
            currencyPopSecondImg.classList.add("icon","primogem");
            saveValues.primogem += amount2;
        } else if (type2 === "nuts") {
            currencyPopSecondImg.src = "./assets/icon/goldenIcon.webp";
            currencyPopSecondImg.classList.add("icon","primogem");
            saveValues.goldenNut += amount2;
            persistentValues.goldenCore += amount2;
            updateCoreCounter();
            nutPopUp();
        }

        currencyPop.style.height = "13%"
        currencyPopFirst.style.height = "30%";
        currencyPopSecond.style.height = "30%";
        currencyPopSecond.append(currencyPopSecondImg);
        currencyPop.append(currencyPopSecond);
    }

    setTimeout(()=> {
        currencyPop.style.animation = "fadeOut 2s cubic-bezier(.93,-0.24,.93,.81) forwards";
        currencyPop.addEventListener("animationend",()=>{
            currencyPop.remove();
        })
    },1000)
    mainBody.appendChild(currencyPop);
}

// POP UPS FOR NEW HEROES(WISH), INVENTORY AND EXPEDITION
let currentPopUps = [];
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