import { upgradeDictDefault,SettingsDefault,InventoryDefault,expeditionDictDefault,achievementListDefault,saveValuesDefault,eventText,upgradeInfo } from "./defaultData.js"
import { abbrNum,randomInteger,sortList,generateHeroPrices,unlockExpedition,getHighestKey,countdownText,updateObjectKeys } from "./functions.js"
import { inventoryAddButton,expedButtonAdjust,dimMultiplierButton,volumeScrollerAdjust,floatText,multiplierButtonAdjust } from "./adjustUI.js"
import * as drawUI from "./drawUI.js"

const VERSIONNUMBER = "v0.2.BETA-28-2";
const COPYRIGHT = "DISCLAIMER © HoYoverse. All rights reserved. HoYoverse and Genshin Impact \n are trademarks, services marks, or registered trademarks of HoYoverse.";

//------------------------------------------------------------------------INITIAL SETUP------------------------------------------------------------------------//
// START SCREEN 
var mainBody = document.getElementById("game");   
let startText = document.getElementById("start-screen"); 
let versionText = document.getElementById("vers-number");
let startAlready = false;
versionText.innerText = VERSIONNUMBER;
versionText.classList.add("version-text");

let copyrightText = document.getElementById("copyright-number"); 
copyrightText.innerText = COPYRIGHT;
copyrightText.classList.add("copyright-text");

let deleteButton = document.getElementById("start-delete");
deleteButton.addEventListener("click",()=> {
    if (localStorage.getItem("settingsValues") !== null) {
        deleteConfirmMenu("toggle","intro");
    } else {
        if (!startAlready) {
            startAlready = true;
            startGame();
            setTimeout(()=>startText.remove(),100);
        }
    }
});

let confirmationBox = document.createElement("div");
confirmationBox.classList.add("confirm-box");
confirmationBox.style.zIndex = -1;
confirmationBox.id = "confirm-box";
confirmationBox.innerText = "Are you sure? Deleting your save cannot be undone.";

let confirmationBoxButton = document.createElement("div");
confirmationBoxButton.classList.add("confirm-button-div");
let confirmDeleteButton = document.createElement("button");
confirmDeleteButton.innerText = "Confirm";
confirmDeleteButton.addEventListener("click",()=>deleteConfirmButton(true));
let cancelDeleteButton = document.createElement("button");
cancelDeleteButton.innerText = "Cancel";
cancelDeleteButton.addEventListener("click",()=>deleteConfirmButton(false));

confirmationBoxButton.append(confirmDeleteButton,cancelDeleteButton);
confirmationBox.appendChild(confirmationBoxButton);
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

function deleteConfirmButton(confirmed) {
    if (confirmed == true) {
        if (deleteType === "intro") {
            if (!startAlready) {
                startAlready = true;
                localStorage.clear();
                startGame();
                setTimeout(()=>startText.remove(),200);
            }
        } else if (deleteType === "loaded") {
            localStorage.clear();
            location.reload();
        }
    }
        
    let deleteBox = document.getElementById("confirm-box");
    if (deleteBox.style.zIndex == 1000) {deleteBox.style.zIndex = -1}
    return;
}

if (localStorage.getItem("settingsValues") !== null) {
    let startButton = document.getElementById("start-button");
    startButton.classList.remove("dim-filter");
    startButton.addEventListener("click",()=> {
        if (!startAlready) {
            startAlready = true;
            startGame();
        
            setTimeout(function() {
                let deleteBox = document.getElementById("confirm-box");
                if (deleteBox.style.zIndex == 1000) {deleteBox.style.zIndex = -1}
                startText.remove();
            },200)
        }
    });

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
        startText.style.backgroundImage = "url(./assets/start-night.webp)";
        startText.append(startIdle);
    }
}

setTimeout(()=>{
    mainBody = drawUI.buildGame(mainBody);
    mainBody.style.display = "block";
},300)

function startGame() {
drawUI.preloadFoldersPriority();
setTimeout(()=>{
    drawUI.preloadFolders(upgradeInfo);
},300);

// GLOBAL VARIABLES
var saveValues;
const ENERGYCHANCE = 500;
var upperEnergyRate = 20;
var lowerEnergyRate = 10;
const COSTRATIO = 1.15;
var clickDelay = 10;

const WEAPONMAX = 1500;
const ARTIFACTMAX = 2150;
const FOODMAX = 3150;
const XPMAX = 4004;

const NONWISHHEROMAX = 49
const WISHHEROMIN = 100;

const WISHCOST = 360;
const STARTINGWISHFACTOR = 50;
var wishMultiplier = 0;
var adventureType = 0;
let goldenNutUnlocked = false;
const EVENTCOOLDOWN = 10;
const SHOPCOOLDOWN = 60;

// ACHIEVEMENT THRESHOLDS
var achievementData = {
    achievementTypeRawScore:      [100,1e4,1e6,1e8,1e9,1e11,1e12,1e14,1e15,1e17,1e18,1e20,1e21,1e23,1e24,1e26,1e27,1e29,1e30,1e32],
    achievementTypeRawDPS:        [10,100,1000,1e5,1e6,1e8,1e9,1e11,1e12,1e14,1e15,1e17,1e18,1e20,1e21,1e23,1e24,1e26,1e27,1e29],
    achievementTypeRawClick:      [1e1,1e2,5e2,1e3,2.5e3,5e3,7.5e3,1e4,1.5e4,2e4,2.5e4,3e4,3.5e4,4e4,5e4],
    achievementTypeRawCollection: [1,10,100,250,500,750,1000,1250,1500,1750,2000,2250,2500,2750,3000],
    achievementTypeGolden:        [1,3,7,15,30,50,75,100],
}
var scoreAchievement = [1,101,201,301,401];

var foodBuff = 1;
var clickerEvent = false;
var shopTime = 0;
var shopTimerElement = null;
let filteredHeroes = [];
let filteredInv = [];

var demoContainer = document.getElementById("demo-container");
var score = document.getElementById("score");
var energyDisplay = document.getElementById("energy");
var dpsDisplay = document.getElementById("dps");
var primogemDisplay = document.getElementById("primogem");

var leftDiv = document.getElementById("left-div");
var midDiv = document.getElementById("mid-div");
var multiplierButtonContainer;

// MAIN BODY VARIABLES
drawUI.drawMainBody();

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

var WISHHEROMAX = getHighestKey(upgradeDict) + 1;
var wishCounter = WISHHEROMAX - WISHHEROMIN;
drawWish();
refresh();

saveValues["realScore"]++;
addNewRow();
saveValues["realScore"]--;

createMultiplierButton();
createExpedition();
drawUI.createExpedTable(expedTooltip);
table3.appendChild(expedTooltip);
expedInfo("exped-7")

var tooltipTable = 1;
var heroTooltip = -1;
var itemTooltip = -1;
createTooltip();

settings();
var settingsValues;
var currentBGM;
var bgmElement;           

var tabElement = new Audio("./assets/sfx/tab-change.mp3");
var demoElement = new Audio("./assets/sfx/click.mp3");
var upgradeElement = new Audio("./assets/sfx/upgrade.mp3");
var mailElement = new Audio("./assets/sfx/mail.mp3");
var achievementElement = new Audio("./assets/sfx/achievement.mp3");
var eventElement = new Audio("./assets/sfx/event.mp3");
var reactionStartElement = new Audio("./assets/sfx/timestart.mp3");
var reactionCorrectElement = new Audio("./assets/sfx/timesup.mp3");
var weaselBurrow = new Audio("./assets/sfx/weasel-pop.mp3");
var weaselDecoy = new Audio("./assets/sfx/weasel-decoy.mp3");
var adventureElement = new Audio("./assets/sfx/adventure.mp3");
var shopElement = new Audio("./assets/sfx/dori-buy.mp3");
var sfxArray = [tabElement,demoElement,upgradeElement,mailElement,achievementElement,eventElement,reactionStartElement,reactionCorrectElement,weaselBurrow,weaselDecoy,adventureElement,shopElement];

var timerLoad = setInterval(timerEventsLoading,50);
var timer = setInterval(timerEvents,1000000);
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
    // 1 timerSeconds == 1 SECOND IN REAL TIME
    let timeRatioTemp =  timeRatio / 1000;
    timerSeconds += timeRatioTemp;
    
    checkAchievement();
    saveValues["realScore"] += timeRatioTemp * saveValues["dps"] * foodBuff;
    refresh();
    dimHeroButton();
    addNewRow();
    // foodCheck(timerSeconds);
    randomEventTimer(timerSeconds);
    timerSave(timerSeconds);

    shopTimerFunction();
}

// SHOP TIMER
function shopTimerFunction() {
    if (shopTimerElement != null) {
        let startOfYear = new Date('2022-01-01T00:00:00');
        let now = new Date();
        let minutesPassedNow = (now - startOfYear) / (1000 * 60);
        let time_passed = Math.floor(minutesPassedNow - parseInt(shopTime));
        
        shopTimerElement.innerText = "Inventory resets in: " +Math.floor(SHOPCOOLDOWN-time_passed)+ " minutes";
        if (time_passed >= SHOPCOOLDOWN) {
            refreshShop(minutesPassedNow)
        }
    }
}

// TEMPORARY TIMER
function timerEventsLoading() {
    addNewRow();
    refresh();
}

// SAVE DATA TIMER
var savedTimes = 1;
function timerSave(timerSeconds) {
    // SAVES EVERY 3 MINUTES
    let saveTimeMin = 180 * savedTimes;
    if (timerSeconds > saveTimeMin) {
        saveData();        
        console.log("Saved!");
        savedTimes++;
    }
}

// LOAD SAVE DATA
function loadSaveData() {
    // LOAD SETTIGNS
    if (localStorage.getItem("settingsValues") == null) {
        settingsValues = SettingsDefault;
    } else {
        let settingsTemp = localStorage.getItem("settingsValues");
        settingsValues = JSON.parse(settingsTemp)
        updateObjectKeys(settingsValues,SettingsDefault)
    }
    // LOAD VALUES DATA
    if (localStorage.getItem("saveValuesSave") == null) {
        saveValues = saveValuesDefault;
    } else {
        let saveValuesTemp = localStorage.getItem("saveValuesSave");
        saveValues = JSON.parse(saveValuesTemp)
        updateObjectKeys(saveValues,saveValuesDefault)
    }
    // LOAD HEROES DATA
    if (localStorage.getItem("upgradeDictSave") == null) {
        let upgradeDictTemp = generateHeroPrices(upgradeDictDefault,NONWISHHEROMAX);
        upgradeDict = upgradeDictTemp;
    } else {
        let upgradeDictTemp = localStorage.getItem("upgradeDictSave");
        upgradeDict = JSON.parse(upgradeDictTemp);
        setTimeout(loadRow,1000);
    }
    // LOAD INVENTORY DATA
    Inventory = InventoryDefault;
    if (localStorage.getItem("InventorySave") == null) {
        InventoryMap = new Map();
        let i = 10000;
        while (i--) {
            InventoryMap.set(i,0);
        }
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
        expeditionDict = JSON.parse(expeditionDictTemp)
        updateObjectKeys(expeditionDict,expeditionDictDefault)
    }
    // LOAD ACHIEVEMENT DATA
    achievementList = achievementListDefault;
    if (localStorage.getItem("achievementListSave") == null) {
        achievementMap = new Map();
        let i = 1000;
        while (i--) {
            achievementMap.set(i,false);
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
}

// BIG BUTTON FUNCTIONS
var clickAudioDelay = null;
var currentClick = 1;
let demoImg = document.createElement("img");
demoImg.src = "./assets/nahida.webp";
demoImg.classList.add("demo-img");

demoContainer.addEventListener("mouseup", () => {
    let clickEarn;
    saveValues["clickCount"] += 1;
    if (clickerEvent === false) {
        clickEarn = 1 * saveValues["clickFactor"];
    } else {
        clickEarn = currentClick;
        clickDelay -= 10;
    }

    saveValues["realScore"] += clickEarn;
    energyRoll();

    if (clickAudioDelay === null) {
        if (timerSeconds !== 0) {
            let randomInt = (randomInteger(9,15) / 10);
            demoElement.load();
            demoElement.playbackRate = randomInt;
            // clickAudioDelay = audioWrapper(clickAudioDelay,demoElement)
            demoElement.play();
            clickAudioDelay = setTimeout(function() {clickAudioDelay = null}, 75);
            
        }
    }

    demoContainer = floatText(demoContainer,abbrNum(clickEarn),randomInteger(20,80),randomInteger(70,100));
    let number = randomInteger(2,6);
    let animation = `fall ${number}s cubic-bezier(1,.05,.55,1.04) forwards`

    var img = document.createElement("img");
    img.src = "./assets/icon/nut.webp";
    img.style.left = `${randomInteger(0,100)}%`
    img.style.animation = animation;
    img.addEventListener('animationend', () => {img.remove();});
    img.classList.add("falling-image");
    leftDiv.appendChild(img);
});

drawUI.demoFunction(demoContainer,demoImg);
demoContainer.appendChild(demoImg);

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

//--------------------------------------------------------------------------RANDOM EVENTS----------------------------------------------------------------------//
// RANDOM EVENTS TIMER (MAXIMUM 10 MINUTE DIFFERENCE)
var eventTimes = 1;
var eventChance = 0;
function randomEventTimer(timerSeconds) {
    // SET TO 10 SECONDS AND 5 SECONDS
    let eventTimeMin = EVENTCOOLDOWN * eventTimes;
    if (eventChance !== 0) {
        let upperLimit = 10 ** (1 + (timerSeconds - eventTimeMin)/(EVENTCOOLDOWN/2))
        if (Math.ceil(upperLimit) >= eventChance) {
            eventChance = 0;
            eventTimes++;
            startRandomEvent();
        }
        return;
    }
    
    if (timerSeconds > eventTimeMin) {
        eventChance = randomInteger(0,100);
    }
}

// START A RANDOM EVENT
function startRandomEvent() {
    let eventPicture = document.createElement("div");
    let aranaraNumber;
    // HARD EVENTS ARE LOCKED TO 4TH EXPEDITION UNLOCK
    if (expeditionDict[4].Locked !== '1') {
        aranaraNumber = randomInteger(1,7);
    } else {
        aranaraNumber = randomInteger(1,4);
    }
     
    eventPicture.classList.add("random-event");
    eventPicture.addEventListener("click", () => {
        clickedEvent(aranaraNumber);
        eventPicture.remove();
        toggleSettings(true);
        let deleteBox = document.getElementById("confirm-box");
        if (deleteBox.style.zIndex == 1000) {deleteBox.style.zIndex = -1};
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
    eventElement.load();
    eventElement.play();

    let eventDropdown = document.createElement("div");
    eventDropdown.classList.add("flex-row");
    eventDropdown.classList.add("event-dropdown");
    let eventDropdownBackground = document.createElement("img");
    eventDropdownBackground.src = "./assets/tutorial/eventPill.webp";

    let eventDropdownText = document.createElement("div");
    eventDropdownText.innerText = eventText[aranaraNumber];
    eventDropdownText.classList.add("flex-column");
    eventDropdownText.classList.add("event-dropdown-text");

    let eventDropdownImage = document.createElement("div");
    eventDropdownImage.style.background = "url(./assets/tutorial/aranara-"+ (aranaraNumber) +".webp)";
    eventDropdownImage.style.backgroundSize = "contain";
    eventDropdownImage.style.backgroundRepeat = "no-repeat";
    eventDropdownImage.classList.add("event-dropdown-image");
    
    eventDropdown.append(eventDropdownBackground, eventDropdownText,eventDropdownImage);
    eventDropdown.addEventListener("animationend", () => {
        eventDropdown.remove();
        chooseEvent(aranaraNumber)
    });
    mainBody.appendChild(eventDropdown);
}

function chooseEvent(type) {
    switch (type) {
        case 1:
            clickEvent();
            break;
        case 2:
            reactionEvent();
            break;
        case 3:
            boxFunction();
            break
        case 4:
            minesweeperEvent();
            break;
        case 5:
            weaselEvent();
            break;
        case 6:
            rainEvent();
            break;
        default:
            break;
    }
}

// EVENT 1 (ENERGY OVERLOAD)
let clickEventDelay;
function clickEvent() {
    let button = demoContainer.firstElementChild;
    if (!leftDiv.classList.contains("vignette")) {leftDiv.classList.add("vignette")}
    if (clickEventDelay !== null) {clearTimeout(clickEventDelay)}
    button.style.animation = "rotation-scale 3.5s infinite linear forwards";
    button.style["box-shadow"] = "inset 0em 0em 6em #93d961";
    clickerEvent = true;
    currentClick = 15 * (saveValues["dps"] + 1);

    clickEventDelay = setTimeout(() => {
        if (leftDiv.classList.contains("vignette")) {leftDiv.classList.remove("vignette")}
        button.style.animation = "rotation 18s infinite linear forwards";
        button.style["box-shadow"] = "";
        clickerEvent = false;
        clickEventDelay = null;
    },30000)
    foodButton(2);
}

// EVENT 2 (REACTION TIME)
var reactionReady = false;
var reactionGame = false;
function reactionEvent() {
    reactionGame = true;
    let eventBackdrop = document.createElement("div");
    eventBackdrop.classList.add("cover-all");
    eventBackdrop.classList.add("flex-column");
    eventBackdrop.classList.add("event-dark");

    let reactionImage = document.createElement("div");
    reactionImage.id = "reaction-image";

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
    eventBackdrop.append(reactionImage,reactionButton);
    mainBody.append(eventBackdrop);
}

function reactionFunction(eventBackdrop) {
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
    eventOutcome(outcomeText,eventBackdrop,"reaction",primogem)
}

// EVENT 3 (7 BOXES)
function boxFunction() {
    let eventBackdrop = document.createElement("div");
    eventBackdrop.classList.add("cover-all");
    eventBackdrop.classList.add("flex-column");
    eventBackdrop.classList.add("event-dark");

    let boxOuterDiv = document.createElement("div");
    boxOuterDiv.id = "box-outer-div";
    boxOuterDiv.classList.add("box-outer-div");
    boxOuterDiv.classList.add("flex-row");
    boxOuterDiv.classList.add("box-event")
    let count = 8;
    while (count--) {
        let boxImageDiv = document.createElement("div");
        boxImageDiv.classList.add("flex-row");
        boxImageDiv.classList.add("box-image-div");

        let boxImageImg = document.createElement("img");
        boxImageImg.src = "./assets/icon/box-" + count + ".webp";
        boxImageImg.id = ("box-" + count);
        boxImageImg.addEventListener("click", function() {boxOpen(eventBackdrop)})

        boxImageDiv.appendChild(boxImageImg);
        boxOuterDiv.appendChild(boxImageDiv);
        if (count == 1) {break}
    }
    mainBody.append(eventBackdrop,boxOuterDiv);
}

var boxElement = ["Any","Pyro","Hydro","Dendro","Electro","Anemo","Cryo","Geo"];
function boxOpen(eventBackdrop) {
    let boxOuter = document.getElementById("box-outer-div")
    let boxOuterNew = boxOuter.cloneNode(true);
    boxOuter.parentNode.replaceChild(boxOuterNew, boxOuter);

    let boxOutcome = document.createElement("img");
    boxOutcome.classList.add("box-outcome");
    boxOutcome.classList.add("slide-in-blurred-top");
    let outcomeText;
    let outcomeNumber = 0;

    let boxChance = randomInteger(1,101);
    if (goldenNutUnlocked === true && boxChance >= 95) {
        let outcomeNumber = randomInteger(1,4);
        boxOutcome.src = "./assets/icon/goldenNut.webp";
        outcomeText = `Oh! It had Golden Nuts! (+${outcomeNumber} Golden Nuts)`;
    } else if (boxChance >= 60) {
        outcomeNumber = randomInteger(40,60);
        boxOutcome.src = "./assets/icon/primogemLarge.webp";
        outcomeText = "The box contained primogems!";
    } else if (boxChance >= 25) {
        let goodOutcome = randomInteger(1,8);
        boxOutcome.src = "./assets/icon/good-" + goodOutcome + ".webp";
        outcomeText = "Oh, it had a gemstone! (Increased power for " +boxElement[goodOutcome]+ " characters)";
        outcomeNumber = 5009.1 + goodOutcome;
    } else if (boxChance >= 15) {
        let badOutcome = randomInteger(1,5);
        boxOutcome.src = "./assets/icon/bad-" + badOutcome + ".webp";
        outcomeText = "Uh oh, an enemy was hiding in the box!";
    } else if (boxChance >= 5) {
        boxOutcome.src = "./assets/icon/verygood-" + 3 + ".webp";
        outcomeText = "Oh! It had a precious gemstone!! (Increased power for all characters)";
        outcomeNumber = 5002.1;
    }  else {
        boxOutcome.src = "./assets/icon/verybad-" + 1 + ".webp";
        let badOutcomePercentage = randomInteger(15,30);
        outcomeText = "Uh oh! Run away! (Lost " +badOutcomePercentage+ "% of Energy)";
        outcomeNumber = badOutcomePercentage;
    }

    boxOuterNew.appendChild(boxOutcome);
    eventOutcome(outcomeText,eventBackdrop,"box",outcomeNumber)
    setTimeout(()=> {
        boxOuterNew.remove();
        eventBackdrop.remove();
    },4000);
}

// EVENT 4 (MINESWEEPER)
const ROWS = 8;
const COLS = 8;
function minesweeperEvent() {
    var mines = randomInteger(8,10)
    let eventBackdrop = document.createElement("div");
    eventBackdrop.classList.add("cover-all");
    eventBackdrop.classList.add("flex-column");
    eventBackdrop.classList.add("event-dark");
    let mineInfo = document.createElement("img");
    mineInfo.src = "./assets/event/mine-info.webp"
    mineInfo.id = "mine-info";

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
                    mineFileOutcome.classList.add("mine-outcome");
                    mineFileOutcome.classList.add("slide-in-blurred-bottom");
                    eventBackdrop.append(mineFileOutcome);

                    eventOutcome("The whopperflowers were alerted!",eventBackdrop);
                } else {
                    revealCell(r, c);
                    td.style.backgroundImage = "url(./assets/event/mine-empty.webp)";
                }
                if (cellsLeft <= 0) {
                    let randomPrimo = randomInteger(200,400);
                    eventOutcome(`All whopperflowers have been revealed! (+${randomPrimo} Primogems)`,eventBackdrop, "primogem", randomPrimo);
                }
            });
            tr.appendChild(td);
        }
    mineBackground.appendChild(tr);
    }
    eventBackdrop.append(mineBackground,mineInfo)
    mainBody.append(eventBackdrop);
}

let weaselCount = 0;
// EVENT 5 (WHACK-A-MOLE)
function weaselEvent() {
    let weaselElement = 18;
    weaselCount = 0;
    let eventBackdrop = document.createElement("div");
    eventBackdrop.classList.add("cover-all","event-dark","flex-row","event-dark-row");
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
        addWeasel(weaselBack,delay);
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
        eventOutcome(eventText,eventBackdrop,"weasel",weaselCount);
    })

    weaselTimer.append(weaselTimerImage,weaselTimerOutline,weaselCountText);
    weaselTimerDiv.append(weaselTimer,weaselClock)

    let fakeWeaselAlert = document.createElement("div");
    fakeWeaselAlert.id = "fake-weasel-alert";
    fakeWeaselAlert.classList.add("flex-row");
    fakeWeaselAlert.innerText = "Beware of the fake weasel thieves!";

    eventBackdrop.append(weaselBack,weaselTimerDiv,fakeWeaselAlert);
    mainBody.append(eventBackdrop);
}

function addWeasel(weaselBack,delay) {
    let weaselDiv = weaselBack.children;
    let realWeasel = randomInteger(0,18);

    for (let i=0, len=weaselDiv.length; i < len; i++) {
        let weaselImage = weaselDiv[i].querySelector('img');
        if (i === realWeasel) {
            let realWeasel = randomInteger(2,4);
            weaselImage.src = "./assets/event/weasel-"+realWeasel+".webp";

            let springInterval = (randomInteger(20,25) / 100)
            weaselImage.classList.add("spring");
            weaselImage.style["animation-duration"] = springInterval + "s";
            weaselImage.addEventListener("click",()=>{
                mailElement.load();
                mailElement.playbackRate = 1.35;
                mailElement.play();
                delay *= 0.65;
                if (delay <= 450) {
                    delay = 450;
                }
                clearWeasel(weaselBack,delay);
                weaselCount++;
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
            clearWeasel(weaselBack,delay);
        })
    }
}

function clearWeasel(weaselBack,delay) {
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
        addWeasel(weaselBack,delay);
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
    let eventBackdrop = document.createElement("div");
    eventBackdrop.classList.add("cover-all","flex-column","event-dark");

    let rainText = document.createElement("div");
    let rainTextBackground = document.createElement("div");
    let rainTextDiv = document.createElement("p");

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
                rainTextDiv.innerText = abbrNum(tempScore * dpsMultiplier) + " Nuts | " + tempPrimogem + " Primos";
            });
        } else if (type >= 65) {
            img.src = "./assets/icon/scarab.webp"
            img.addEventListener('click', () => {
                weaselDecoy.load();
                weaselDecoy.play()
                img.remove();
                tempScore -= 10;
                tempScore = Math.max(0, tempScore);
                tempPrimogem -= randomInteger(50,80);
                tempPrimogem = Math.max(0, tempPrimogem)
                rainTextDiv.innerText = abbrNum(tempScore * dpsMultiplier)+ " Nuts | " + tempPrimogem + " Primos";
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
                saveValues.realScore += tempScore * dpsMultiplier;
                saveValues.primogem += tempPrimogem;
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
function eventOutcome(innerText,eventBackdrop,type,amount) {
    let removeClick = document.createElement("div");
    let boxText = document.createElement("div");
    let boxTextDiv = document.createElement("p");
    let outcomeDelay = 500;

    removeClick.classList.add("cover-all");
    removeClick.id = "prevent-clicker";
    boxText.classList.add("event-rain-text");
    boxText.id = "outcome-text";
    if (type == "weasel") {
        let weaselCount = amount;
        boxText.style.height = "13%";
        if (weaselCount >= 10) {
            innerText += `\n You received some items!`;
            adventure(10);
            adventure(10);
            amount = randomInteger(80,140);
        } else if (weaselCount >= 7) {
            innerText += `\n You received a few items!`;
            adventure(10);
            amount = randomInteger(40,100);
        } else if (weaselCount >= 4) {
            innerText += `\n You received a few primogems!`;
            amount = randomInteger(20,60);
        } else {
            innerText += `\n Catch more to get a reward!`;
            amount = 0;
        }
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
                    if (amount > 0) {currencyPopUp("primogem",amount)}
                } else if (type === "box") {
                    if (amount < 10 && amount > 0) {
                        saveValues.goldenNut += amount;
                        currencyPopUp("nuts",amount);
                    } else if (amount < 30) {
                        amount = (100 - amount)/100;
                        saveValues.energy = Math.floor(saveValues.energy * amount);
                    } else if (amount >= 30 && amount <= 200) {
                        currencyPopUp("primogem",amount);
                    } else if (amount > 200) {
                        itemUse(amount.toString())
                    }
                } else if (type === "reaction") {
                    if (amount != 0) {
                        currencyPopUp("primogem",amount);
                    }
                }
                removeClick.remove();
            });
        },3000)
    },outcomeDelay);

    setTimeout(()=> {
        eventBackdrop.remove()
    },4000)
}

//--------------------------------------------------------------------------MAIN BODY----------------------------------------------------------------------//
function loadingAnimation() {
    var siteWidth = 1080;
    var scale = screen.width / (siteWidth);
    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width='+siteWidth+', initial-scale='+scale/1.85+', user-scalable=no');
    setTimeout(() => {removeLoading()}, 2000);
}

function removeLoading() {
    dimHeroButton();
    setTimeout(() => {
        let overlay = document.getElementById("loading");
        overlay.removeChild(overlay.firstElementChild);
        overlay.classList.remove("overlay");
        tutorial();
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
function tutorial() {
    let overlay = document.getElementById("loading");
    var currentSlide = 1;
    var tutorialDark = document.createElement("div");
    tutorialDark.classList.add("cover-all","flex-column","tutorial-dark");

    var tutorialImage = document.createElement("img");
    tutorialImage.classList.add("tutorial-img");
    tutorialImage.id = "tutorialImg";
    tutorialImage.src = "./assets/tutorial/tut-1.webp"
    
    var tutorialScreen = document.createElement("div");
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
        let currentTutorialImage = document.getElementById("tutorialImg");
        currentTutorialImage.src = "./assets/tutorial/tut-"+currentSlide+".webp";
    })

    tutorialScreen.append(tutorialImage);
    tutorialDark.appendChild(tutorialScreen);
    overlay.appendChild(tutorialDark);
}

function saveData() {
    if (!document.getElementById("currently-saving")) {
        let saveCurrently = document.createElement("img");
        saveCurrently.src = "./assets/settings/saving.webp";
        saveCurrently.id = "currently-saving";
        saveCurrently.addEventListener("animationend", ()=> {
            saveCurrently.remove();
        });
        mainBody.append(saveCurrently);
    }

    let settingsSaved = {
        bgmVolume:bgmElement.volume,
        sfxVolume:tabElement.volume,
    }
    localStorage.setItem("settingsValues", JSON.stringify(settingsSaved));
    localStorage.setItem("saveValuesSave", JSON.stringify(saveValues));
    localStorage.setItem("upgradeDictSave", JSON.stringify(upgradeDict));
    localStorage.setItem("expeditionDictSave", JSON.stringify(expeditionDict));
    localStorage.setItem("InventorySave", JSON.stringify(Array.from(InventoryMap)));
    localStorage.setItem("achievementListSave", JSON.stringify(Array.from(achievementMap)));

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
    let settingsBottomLeft = document.createElement("div");
    settingsBottomLeft.classList.add("settings-bottom-left");
    let settingsBottomRight = document.createElement("div");
    settingsBottomRight.classList.add("settings-bottom-right");

    // BOTTOM RIGHT OF SETTINGS
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
    saveSetting.addEventListener("click",() => {saveData();})

    let clearSetting = document.createElement("button");
    clearSetting.classList.add("setting-clear");
    clearSetting.addEventListener("click",() => {deleteConfirmMenu("toggle","loaded")})

    // BOTTOM LEFT OF SETTINGS
    let exportSaveSetting = document.createElement("button");
    // copy(JSON.stringify(localStorage));
    let importSaveSetting = doucment.createElement("button");
    // var data = JSON.parse(/*paste stringified JSON from clipboard*/);
    // Object.keys(data).forEach(function (k) {
    // localStorage.setItem(k, JSON.stringify(data[k]));
    // });

    settingsBottomRight.append(infoSetting,saveSetting,clearSetting);
    settingsBottom.append(settingsBottomLeft,settingsBottomRight);
    settingsMenu.append(settingsText, volumeScrollerContainer, settingsBottom);
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
    });

    let sfxScroller = document.getElementById('volume-scroller-sfx');
    sfxScroller.addEventListener("change", function() {
        for (let i=0,len=sfxArray.length; i < len; i++) {
            sfxArray[i].volume = this.value / 100;
        }
    });
}

function createMultiplierButton() {
    multiplierButtonContainer = document.createElement("div");
    multiplierButtonContainer.classList.add("multiplier-button-container");

    let multiplierButton1 = document.createElement("button");
    multiplierButton1 = multiplierButtonAdjust(multiplierButton1,1)
    multiplierButton1.addEventListener("click",() => {costMultiplier(10),currentDimMultiplier = dimMultiplierButton(1, currentDimMultiplier)})

    let multiplierButton2 = document.createElement("button");
    multiplierButton2 = multiplierButtonAdjust(multiplierButton2,2)
    multiplierButton2.addEventListener("click",() => {costMultiplier(25),currentDimMultiplier = dimMultiplierButton(2, currentDimMultiplier)})
    
    let multiplierButton3 = document.createElement("button");
    multiplierButton3 = multiplierButtonAdjust(multiplierButton3,3)
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

    const heroOptions = ['Pyro','Hydro','Anemo','Electro','Dendro','Cryo','Geo','BREAK','Sword','Claymore','Catalyst','Polearm','Bow','BREAK','Sumeru','Mond','Liyue','Inazuma'];
    const invOptions = ['Artifact','Food','Level','Gemstone','Talent','BREAK','Sword','Claymore','Catalyst','Polearm','Bow'];
    for (let i=0,len=heroOptions.length; i < len; i++) {
        let filterPicture;
        if (heroOptions[i] === 'BREAK') {
            filterPicture = document.createElement("div");
            filterPicture.classList.add("flex-break");
        } else {
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
        }

        filterMenuOne.appendChild(filterPicture);
    }

    for (let i=0,len=invOptions.length; i < len; i++) {
        let filterPicture;
        if (invOptions[i] === 'BREAK') {
            filterPicture = document.createElement("div");
            filterPicture.classList.add("flex-break");
        } else {
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
        }
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
            if (inventoryTemp.Type === filteredInv[j] || inventoryTemp.element === filteredInv[j] || inventoryTemp.nation === filteredInv[j]) {
                currentID.style.display = "flex";
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
var rowTempDict = {}
function loadRow() {
    let i = WISHHEROMAX;
    while (i--) {
        if (upgradeDict[i] == undefined) continue;
        if (i < WISHHEROMIN && i > NONWISHHEROMAX) continue;
        if (upgradeDict[i].Row > -1){
            rowTempDict[[upgradeDict[i].Row]] = i;
        }
    }

    for (let j = 0, len=Object.keys(rowTempDict).length; j < len; j++) {
        let loadedHeroID = rowTempDict[j];
        var heroTextLoad;

        let upgradeDictTemp = upgradeDict[loadedHeroID];
        let formatCost = upgradeDictTemp["BaseCost"];
        let formatATK = upgradeDictTemp["Factor"];

        if (upgradeDictTemp["Purchased"] > 0) {
            formatCost *= (COSTRATIO**upgradeDictTemp["Purchased"])
            formatCost = abbrNum(formatCost)
            formatATK = abbrNum(formatATK)
            if (j == 0) {
                let singular = ` Nut${formatATK !== 1 ? 's' : ''} per click`;
                heroTextLoad =  upgradeInfo[loadedHeroID].Name + ": " + formatCost + ", " + formatATK + singular;
            } else {
                heroTextLoad =  upgradeInfo[loadedHeroID].Name + ": " + formatCost + ", +" + formatATK + " NpS";
            }
        } else {
            if (upgradeDictTemp["Level"] == 0) {
                heroTextLoad = "Summon " + upgradeInfo[loadedHeroID].Name + " for help. (" + abbrNum(formatCost) + ")";
            } else if (j == 0) {
                heroTextLoad = "Level Up Nahida (" + abbrNum(formatCost) + ")";
            } else {
                heroTextLoad = "Call for " + upgradeInfo[loadedHeroID].Name + "'s help... (" + abbrNum(formatCost) + ")";
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
            heroButtonContainer.style.background = `url(./assets/nameplates/${upgradeInfo[loadedHeroID].Name}.webp)`;  
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
function addNewRow() {
    for (let i = 0, len=WISHHEROMAX; i < len; i++) {
        if (i < WISHHEROMIN && i > NONWISHHEROMAX || upgradeDict[i] == undefined) continue;
        if (upgradeDict[i].Row != -1) continue;
        if (saveValues["realScore"] >= upgradeDict[i]["Level"] && upgradeDict[i].Purchased == -1){
            upgradeDict[i].Row = saveValues["rowCount"];
            upgradeDict[i].Purchased = 0;

            let heroText;
            if (upgradeDict[i]["Level"] === 0) {
                heroText = "Summon " + upgradeInfo[i].Name + " for help. (" + abbrNum(upgradeDict[i]["BaseCost"]) + ")";
            } else if (i === 0) {
                heroText = "Level Up Nahida (" + abbrNum(upgradeDict[i]["BaseCost"]) + ")";
            } else {
                heroText = "Call for " + upgradeInfo[i].Name + "'s help... (" + abbrNum(upgradeDict[i]["BaseCost"]) + ")";
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
        if (i < WISHHEROMIN && i > NONWISHHEROMAX) continue;
        if (upgradeDict[i]["Purchased"] > 0) {
            let realScoreCurrent = saveValues["realScore"];
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
            i -= WISHHEROMIN - NONWISHHEROMAX;
            i += 2;
            continue;
        }
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
    for (let i = 1000, len=10000; i < len; i++) {
        if (InventoryMap.get(i) === 0) {
            continue;
        } else {
            inventoryAdd(i, "load");
        }
    }
}

// ADD TO INVENTORY 
function inventoryAdd(idNum, type) {
    let itemUniqueID;
    idNum = parseInt(idNum);
    if (type != "load") {
        let currentValue = InventoryMap.get(idNum);
        currentValue++;
        InventoryMap.set(idNum,currentValue);
        if (currentValue > 1) {
            let newIcon = document.createElement("img");
            newIcon.classList.add("new-item");
            newIcon.src = "./assets/icon/new-item.webp";
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

    buttonInv = inventoryAddButton(buttonInv,Inventory[idNum])
    table2.appendChild(buttonInv);
}

// INVENTORY FUNCTIONALITY
// RMB TO UPDATE CONSTANTS
const weaponBuffPercent =   [0, 1.1, 1.3, 1.7, 2.1, 2.7, 4.6];
const artifactBuffPercent = [0, 1.05, 1.15, 1.35, 1.55, 1.85];
const foodBuffPercent =     [0, 1.4, 2.0, 3.1, 4.4, 6.2];
const nationBuffPercent =   [0, 0, 1.2, 1.5, 1.8]
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
            if (i < WISHHEROMIN && i > NONWISHHEROMAX && i != 1) continue;
            let upgradeDictTemp = upgradeDict[i];
            if (upgradeDictTemp.Purchased > 0){
                if (upgradeInfo[i].Type == Inventory[itemID].Type){
                    let additionPower = Math.ceil(upgradeDictTemp["Factor"] * upgradeDictTemp.Purchased * (weaponBuffPercent[Inventory[itemID].Star] - 1));
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
            if (i < WISHHEROMIN && i > NONWISHHEROMAX && i != 1) continue;
            let upgradeDictTemp = upgradeDict[i];
            if (upgradeDictTemp.Purchased > 0){
                let additionPower = Math.ceil(upgradeDictTemp["Factor"] * upgradeDictTemp.Purchased * (artifactBuffPercent[Inventory[itemID].Star] - 1));
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
    } else if (itemID >= 4001 && itemID < XPMAX){
        saveValues["freeLevels"] += randomInteger(Inventory[itemID].BuffLvlLow,Inventory[itemID].BuffLvlHigh);
        refresh();
    } else if (itemID === 5001 || itemID === 5002) {
        let power = 1;
        if (Inventory[itemID].Star === 5) {
            power = 1.9;
        } else {
            power = 3;
        }

        for (let i = 0, len=WISHHEROMAX; i < len; i++) {
            if (upgradeDict[i] == undefined) continue;
            if (i < WISHHEROMIN && i > NONWISHHEROMAX) continue;
            let upgradeDictTemp = upgradeDict[i];
            if (upgradeDictTemp.Purchased > 0){
                let additionPower = Math.ceil(upgradeDictTemp["Factor"] * upgradeDictTemp.Purchased * (power - 1));
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
            if (i < WISHHEROMIN && i > NONWISHHEROMAX) continue;
            if (upgradeDict[i].Purchased > 0) {
                if (upgradeInfo[i].Ele == elem || upgradeInfo[i].Ele == "Any") {
                    let upgradeDictTemp = upgradeDict[i];
                    let additionPower = Math.ceil(upgradeDictTemp["Factor"] * upgradeDictTemp.Purchased * (power - 1));
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
            if (i < WISHHEROMIN && i > NONWISHHEROMAX && i != 1) continue;
            if (upgradeDict[i].Purchased > 0){
                if (upgradeInfo[i].Nation === nation || upgradeInfo[i].Nation == "Any") {
                    let upgradeDictTemp = upgradeDict[i];
                    let additionPower = Math.ceil(upgradeDictTemp["Factor"] * upgradeDictTemp.Purchased * (power - 1));
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
        adventureElement.load();
        adventureElement.play();
        if (type === 5 && goldenNutUnlocked === true) {
            currencyPopUp("nuts",randomInteger(5,10))
        }
    }

    if (type === 10) {
        if (expeditionDict[5].Locked !== '1') {
            type = 5;
        }
        else if (expeditionDict[4].Locked !== '1') {
            type = 4;
        }
        else if (expeditionDict[3].Locked !== '1') {
            type = 3;
        } else {
            type = 2;
        }
        saveValues["energy"] += ADVENTURECOSTS[type];
    } else if (expeditionDict[type].Locked === '1'){
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
                break;
            case 3:
                inventoryDraw("xp", 3, 3);
                inventoryDraw("xp", 2, 2);

                if (randomDraw == 1) {
                    inventoryDraw("artifact", 2, 4);
                    inventoryDraw("weapon", 2, 4);
                } else {
                    inventoryDraw("talent", 2, 4);
                    inventoryDraw("food", 2, 4);
                }
                break;
            case 4:
                inventoryDraw("xp", 3, 3);
                if (randomDraw == 1) {
                    inventoryDraw("weapon", 3, 4);
                    inventoryDraw("xp", 2, 3);
                } else {
                    inventoryDraw("talent", 3, 4);
                    inventoryDraw("food", 3, 5);
                }
                inventoryDraw("gem", 4, 4);
                break;
            case 5:
                inventoryDraw("xp", 4, 4);
                if (randomDraw == 1) {
                    inventoryDraw("artifact", 4, 5);
                    inventoryDraw("weapon", 4, 5);
                    inventoryDraw("xp", 3, 4);
                } else {
                    inventoryDraw("talent", 4, 4);
                    inventoryDraw("food", 4, 5);
                    inventoryDraw("gem", 4, 5)
                }
                break;
            default:
                break;
        }
        sortList("table2");
        newPop(1);
    } else {
        expedInfo("exped-9");
    }
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
        
        if (expeditionDict[i]["Locked"] == 1){
            var backgroundImg = "url(./assets/expedbg/exped6.webp)";
        } else {
            var backgroundImg = "url(./assets/expedbg/exped" + i + ".webp)";
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

    if (expeditionDict[i]["Locked"] == 0 || i == 7) {
        let advButton = document.getElementById("adventure-button");
        if (!advButton.classList.contains("expedition-selected")) {
            advButton.classList.add("expedition-selected");
        }
        expedRow1.innerText = expeditionDict[i]["Text"];
        expedRow2.innerText = expeditionDict[i]["Lore"];
        expedRow1.appendChild(afterEnergyIcon);
    } else if (i == 8 || i == 9) {
        expedRow1.innerText = expeditionDict[i]["Text"];
        expedRow2.innerText = expeditionDict[i]["Lore"];
        expedRow1.appendChild(afterEnergyIcon);
    } else {
        expedRow1.innerText = expeditionDict[6]["Text"];
        expedRow2.innerText = expeditionDict[6]["Lore"];
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
    wishButtonPrimo.src = "./assets/icon/primogemIcon.webp";
    
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
    
    
    wishContainer.append(wishTutorial,wishHelpText,wishNpsDisplay);
    updateWishDisplay();
}

// DRAWS/WISH FOR SPECIAL HEROS
function drawWish() {
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

    if (wishCounter === saveValues["wishCounterSaved"]) {
        stopWish();
    } else if (saveValues["wishUnlocked"] == true) {
        goldenNutUnlocked = true;
        wishUnlock();
    } 
}

function updateWishDisplay() {
        if (document.getElementById("wish-nps-display")) {
            let wishNpsDisplay = document.getElementById("wish-nps-display");
            wishNpsDisplay.innerText = `Next character's NpS: ${abbrNum(Math.round(saveValues["dps"] * (STARTINGWISHFACTOR + wishMultiplier)/300 + 1))}`;
        }
    }

function stopWish() {
    let wishButton = document.getElementById("wishButton");
    let wishButtonText = document.getElementById("wishButtonText");
    wishButtonText.innerText = "Closed";

    let wishNpsDisplay = document.getElementById("wish-nps-display");
    wishNpsDisplay.style.display = "none";

    var new_wishButton = wishButton.cloneNode(true);
    wishButton.parentNode.replaceChild(new_wishButton, wishButton);
    let mailImageTemp = document.getElementById("mailImageID");
    mailImageTemp.remove();
}

function wish() {
    if (wishCounter === saveValues["wishCounterSaved"]) {
        stopWish();
        return;
    }

    if (saveValues["primogem"] >= WISHCOST) {
        mailElement.load();
        mailElement.play();
        saveValues["primogem"] -= WISHCOST;

        // SCARAMOUCHE WILL ALWAYS BE THE FIRST WISH HERO
        while (wishCounter) {
            let randomWishHero;
            if (upgradeDict[100].Purchased === -10) {
                randomWishHero = 100;
                unlockExpedition(5,expeditionDict);
                clearExped();

                // GENERATING A LOCAL SHOP
                addShop();
                let startOfYear = new Date('2022-01-01T00:00:00');
                let now = new Date();
                shopTime = (now - startOfYear) / (1000 * 60);
                localStorage.setItem("shopStartMinute",shopTime);
                setShop();
                setTimeout(()=>saveData(),1000)
                // IT IS PERSISENT TO LOCALSTORAGE

                newPop(5);
                newPop(2);
            } else {
                randomWishHero = randomInteger(WISHHEROMIN, WISHHEROMAX);
            }
        
            if (upgradeDict[randomWishHero].Purchased >= -1) {
                continue;
            } else {
                let upgradeDictTemp = upgradeDict[randomWishHero];
                upgradeDictTemp.Purchased = -1;
                upgradeDictTemp["Factor"] = Math.round(saveValues["dps"] * (STARTINGWISHFACTOR + wishMultiplier)/300 + 1);
                upgradeDictTemp["BaseCost"] = Math.round(saveValues["dps"] * (55) + 1);
                upgradeDictTemp["Contribution"] = 0;
                
                wishMultiplier += 3;
                saveValues["wishCounterSaved"]++;
                refresh();
                newPop(0);

                let mailImageTemp = document.getElementById("mailImageID");
                mailImageTemp.style.opacity = 0;
                break;
            }
        }
    }
}

//------------------------------------------------------------------------TABLE 5 (ACHIEVEMENTS)------------------------------------------------------------------------//
// ACHIEVEMENTS
function achievementListload() {
    for (let i = 1, len=getHighestKey(achievementList); i < len; i++) {
        if (achievementMap.get(i) === false) {
            continue;
        } else {
            if (i < 40) {
                popAchievement("score",true);
                achievementData["achievementTypeRawScore"].shift();
            } else if (i > 100 && i < 140) {
                popAchievement("dps",true);
                achievementData["achievementTypeRawDPS"].shift();
            } else if (i > 200 && i < 240) {
                popAchievement("click",true);
                achievementData["achievementTypeRawClick"].shift();
            } else if (i > 300 && i < 320) {
                popAchievement("collection",true);
                achievementData["achievementTypeRawCollection"].shift();
            } else if (i > 400 && i < 420) {
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
            console.log("No more Achievements left! Good job!");
            return;
    }

    let achievementListTemp = achievementList[achievementType];
    let achievementText = achievementListTemp.Name;
    let achievementDesc = achievementListTemp.Description;
    achievementMap.set(achievementType,true);
    achievementID += achievementType;

    if (loading != true) {
        saveValues["primogem"] += 20;

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

    toolImgContainer = document.createElement("div");
    toolImgContainer.classList.add("toolImgContainer","background-image-cover");
    toolImg = document.createElement("img");
    toolImg.src = "./assets/tooltips/Empty.webp";
    toolImg.classList.add("toolImg");
    toolImgOverlay = document.createElement("img");
    toolImgOverlay.src = "./assets/tooltips/Empty.webp";
    toolImgOverlay.classList.add("toolImgOverlay");
    toolImgContainer.append(toolImg,toolImgOverlay)
    
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
    table6.append(tooltipName,toolImgContainer,tooltipText,tooltipExtraImg,tooltipLore,table6Background,tooltipButton);
}

var tooltipInterval = null;
function changeTooltip(dict, type, number) {
    if (tooltipInterval !== null) {
        clearInterval(tooltipInterval);
        tooltipInterval = null;
    }
    tooltipName.innerText = dict.Name;
    tooltipLore.innerText = dict.Lore;

    if (type == "hero") {
        let tooltipTextLocal = "Level: " + upgradeDict[number]["Purchased"] + 
                                "\n Free Levels: " + saveValues["freeLevels"] + 
                                "\n" + abbrNum(upgradeDict[number]["Contribution"]) + ` ${dict.Name === "Nahida" ? 'Nuts per Click' : 'Nps'}`;
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
    let startOfYear = new Date('2022-01-01T00:00:00');
    let now = new Date();
    let minutesPassed = (now - startOfYear) / (1000 * 60);
    shopTimerElement.innerText = "Inventory resets in: " + (SHOPCOOLDOWN - (currentMin - minutesPassed)) + " minutes";

    let shopDiv = document.createElement("div");
    shopDiv.classList.add("store-div");
    shopDiv.id = "shop-container";
    let i=10;
    while (i--) {
        let inventoryNumber;
        if (i >= 6 && i <= 10) {
            inventoryNumber = inventoryDraw("talent", 2,4, "shop");
        } else if (i >= 2 && i <= 5) {
            inventoryNumber = inventoryDraw("gem", 4,6, "shop");
        } else {
            inventoryNumber = inventoryDraw("weapon", 4,6, "shop")
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
        confirmButton.addEventListener("click", function() {confirmPurchase(shopCost,id)});
        shopId = id;
    }
}

function refreshShop(minutesPassed) {
    let shopContainer = document.getElementById("shop-container");
    shopContainer.innerHTML = "";
    let i=10;
    while (i--) {
        let inventoryNumber;
        if (i >= 6 && i <= 10) {
            inventoryNumber = inventoryDraw("talent", 2,4, "shop");
        } else if (i >= 2 && i <= 5) {
            inventoryNumber = inventoryDraw("gem", 4,6, "shop");
        } else {
            inventoryNumber = inventoryDraw("weapon", 4,6, "shop")
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
        newPop(1)
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
            shopCost = Math.round(randomInteger(15,35)/ 5) * 5;
            break;
        case 3: 
            shopCost = Math.round(randomInteger(40,70)/ 5) * 5;
            break;
        case 4:
            shopCost = Math.round(randomInteger(100,140)/ 5) * 5;
            break;
        case 5:
            shopCost = Math.round(randomInteger(240,300)/ 5) * 5;
            break;
        case 6:
            shopCost = Math.round(randomInteger(450,600)/ 5) * 5;
            break;
        default:
            break;
    }

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

            formatCost = abbrNum(formatCost);

            if (arguments[2] == 0) {
                let singular = ` Nut${formatATK !== 1 ? 's' : ''} per click`;
                formatATK = abbrNum(formatATK)
                heroTextFirst = upgradeInfoTemp.Name + ": " + formatCost + ", +" + formatATK + singular;
            } else {
                formatATK = abbrNum(formatATK)
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

            let heroText = upgradeInfo[arguments[1]].Name + ": " + abbrNum(formatCost) + ", +" + abbrNum(formatATK) + " NpS";
            let id="but-" + hero.Row + "";
            document.getElementById(id).innerText = heroText;
        }
    }
}

// POP UPS FOR EXPEDITIONS UNLOCKS
// NUMBER OF UPGRADES NEEDED TO UNLOCK EXPEDITIONS vvvv
var heroUnlockLevels = [1e6,1e12,1e18];
var expeditionCounter = 0;
function checkExpeditionUnlock(heroesPurchasedNumber) {
    if (heroUnlockLevels.length == 0) {
        return;
    } else if (heroesPurchasedNumber >= heroUnlockLevels[0]) {
        if (expeditionDict[expeditionCounter + 3].Locked == 1) {
            if (heroUnlockLevels.length != 1) {
                unlockExpedition(expeditionCounter + 3,expeditionDict);
                clearExped();
                newPop(2);
            } else {
                if (saveValues["wishUnlocked"] === true) {
                    return;
                } else {
                    newPop(3);
                    wishUnlock();
                    saveValues["wishUnlocked"] = true;
                    goldenNutUnlocked = true;
                }
            }
            newPop(expeditionCounter + 10);
        }
        expeditionCounter++;
        heroUnlockLevels.shift()
    }
}

// POP UPS FOR SPECIAL CURRENCY
function currencyPopUp(type1, amount1, type2, amount2) {
    let currencyPop = document.createElement("div");
    currencyPop.classList.add("flex-column","currency-pop");
    currencyPop.innerText = 'Obtained';

    let currencyPopFirst = document.createElement("div");
    currencyPopFirst.classList.add("flex-row","currency-pop-first");
    currencyPopFirst.innerHTML = amount1 + "   ";
    let currencyPopFirstImg = document.createElement("img");

    if (type1 == "energy") {
        currencyPopFirstImg.src = "./assets/icon/energyIcon.webp";
        currencyPopFirstImg.classList.add("icon");
        saveValues.energy += amount1;
    } else if (type1 == "primogem") {
        currencyPopFirstImg.src = "./assets/icon/primogemIcon.webp";
        currencyPopFirstImg.classList.add("icon","primogem");
        saveValues.primogem += amount1;
    } else if (type1 == "nuts") {
        currencyPopFirstImg.src = "./assets/icon/goldenIcon.webp";
        currencyPopFirstImg.classList.add("icon","primogem");
        saveValues.goldenNut += amount1;
    }

    currencyPopFirst.append(currencyPopFirstImg);
    currencyPop.append(currencyPopFirst);
    if (type2 !== undefined) {
        let currencyPopSecond = document.createElement("div");
        currencyPopSecond.classList.add("flex-row","currency-pop-first");
        currencyPopSecond.innerHTML = amount2 + "   ";

        let currencyPopSecondImg = document.createElement("img");
        if (type2 == "energy") {
            currencyPopSecondImg.src = "./assets/icon/energyIcon.webp";
            currencyPopSecondImg.classList.add("icon");
            saveValues.energy += amount2;
        } else if (type2 == "primogem") {
            currencyPopSecondImg.src = "./assets/icon/primogemIcon.webp";
            currencyPopSecondImg.classList.add("icon","primogem");
            saveValues.primogem += amount2;
        } else if (type2 == "nuts") {
            currencyPopSecondImg.src = "./assets/icon/goldenIcon.webp";
            currencyPopSecondImg.classList.add("icon","primogem");
            saveValues.goldenNut += amount2;
        }

        currencyPop.style.height = "13%"
        currencyPopFirst.style.height = "30%";
        currencyPopSecond.style.height = "30%";
        currencyPopSecond.append(currencyPopSecondImg);
        currencyPop.append(currencyPopSecond);
    }

    setTimeout(()=> {
        currencyPop.style.animation = "fadeOut 2s cubic-bezier(.93,-0.24,.93,.81) forwards";
        currencyPop.addEventListener("animationend",()=>{currencyPop.remove()})
    },1000)
    mainBody.appendChild(currencyPop);
}

// POP UPS FOR NEW HEROES(WISH), INVENTORY AND EXPEDITION
var currentPopUps = [];
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
    } else if (type >=10) {
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

        setTimeout(() => newPopUp.remove(), 6000);
        let mainBody = document.getElementById("game");    
        mainBody.append(newPopUp);
    }    
}
}