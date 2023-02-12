import { upgradeDictDefault,SettingsDefault,InventoryDefault,expeditionDictDefault,achievementListDefault,saveValuesDefault,eventText } from "./defaultData.js"
import { abbrNum,randomInteger,sortList,generateHeroPrices,unlockExpedition,getHighestKey,countdownText } from "./functions.js"
import { drawMainBody,demoFunction,createHeroButtonContainer,createExpedTable,createAchievement,storeAchievement,drawMailTable } from "./drawUI.js"
import { inventoryAddButton,expedButtonAdjust,dimMultiplierButton,volumeScrollerAdjust,floatText,multiplierButtonAdjust } from "./adjustUI.js"

const VERSIONNUMBER = "v0.1.A-11-2-23"
//------------------------------------------------------------------------INITIAL SETUP------------------------------------------------------------------------//
// START SCREEN 
let startText = document.getElementById("start-screen"); 
let versionText = document.getElementById("vers-number"); 
versionText.innerText = VERSIONNUMBER;
versionText.classList.add("version-text");

let deleteButton = document.getElementById("start-delete");
deleteButton.addEventListener("click",()=> {
    localStorage.clear();
    startGame();
    startText.remove();
});

if (localStorage.getItem("settingsValues") !== null) {
    let startButton = document.getElementById("start-button");
    startButton.classList.remove("dim-filter");
    startButton.addEventListener("click",()=> {
        startGame();
        startText.remove();
    });

    let startChance = randomInteger(1,11);
    if (startChance === 1) {
        let startIdle = document.createElement("img");
        startIdle.src = "./assets/start-idle.webp";
        startIdle.id = "start-idle-nahida";
        startText.append(startIdle);
    } else if (startChance === 2) {
        let startIdle = document.createElement("img");
        startIdle.src = "./assets/shop.webp";
        startIdle.id = "start-idle-dori";
        startText.append(startIdle);
    } else if (startChance === 3) {
        let startIdle = document.createElement("img");
        startIdle.src = "./assets/scara.webp";
        startIdle.id = "start-idle-scara";
        startText.style.backgroundImage = "url(./assets/start-night.webp)";
        startText.append(startIdle);
    }
}

function startGame() {
// GLOBAL VARIABLES
var saveValues;
const ENERGYCHANCE = 500;
var upperEnergyRate = 20;
var lowerEnergyRate = 10;
const COSTRATIO = 1.15;
var clickDelay = 10;

const WEAPONMAX = 1300;
const ARTIFACTMAX = 2150;
const FOODMAX = 3150;
const XPMAX = 4004;

const NONWISHHEROMAX = 49
const WISHHEROMIN = 100;
// NAHIDA'S BASE COST   v
// var heroCurrentCosts = new Map();
// heroCurrentCosts.set(0,20);

const WISHCOST = 160;
const STARTINGWISHFACTOR = 50;
var wishMultiplier = 0;

var foodBuff = 1;
var timeSnapshot1 = 0;
var timeSnapshot2 = 0;
var timerAchievement = "";
var clickerEvent = false;

var demoContainer = document.getElementById("demo-container");
var score = document.getElementById("score");
var energyDisplay = document.getElementById("energy");
var dpsDisplay = document.getElementById("dps");
var primogemDisplay = document.getElementById("primogem");

var leftDiv = document.getElementById("left-div");
var midDiv = document.getElementById("mid-div");
var multiplierButtonContainer;

// MAIN BODY VARIABLES
var mainBody = document.getElementById("game");    
drawMainBody();

var table1 = document.getElementById("table1");
var table2 = document.getElementById("table2");
var table3 = document.getElementById("table3");
var expedTooltip = document.getElementById("expedTooltip");
var expedDiv = document.getElementById("expedDiv");
var table4 = document.getElementById("table4");
var table5 = document.getElementById("table5");
var table5Container = document.getElementById("table5-container");
var table6 = document.getElementById("table6");
var table7 = document.getElementById("table7");
var TABS = [table1,table2, table3, table4, table5Container,table7];
var tooltipName,toolImgContainer,toolImg,toolImgOverlay,tooltipText,tooltipLore,tooltipWeaponImg,tooltipElementImg,table6Background;

// TOOLTIPS FOR EXPEDITION
var expedContainer = document.getElementById("table3");

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
refresh();

saveValues["realScore"]++;
addNewRow();
saveValues["realScore"]--;

createMultiplierButton();
createExpedition();
createExpedTable(expedTooltip);
table3.appendChild(expedTooltip);

var tooltipTable = 1;
var heroTooltip = -1;
var itemTooltip = 0;
createTooltip();
setShop();

settings();
var settingsValues;
var currentBGM;
var bgmElement;           

drawWish();
var tabElement = new Audio("./assets/sfx/tab-change.mp3");
var demoElement = new Audio("./assets/sfx/click.mp3");
var upgradeElement = new Audio("./assets/sfx/upgrade.mp3");
var mailElement = new Audio("./assets/sfx/mail.mp3");
var achievementElement = new Audio("./assets/sfx/achievement.mp3");
var eventElement = new Audio("./assets/sfx/event.mp3");
var reactionStartElement = new Audio("./assets/sfx/timestart.mp3");
var reactionCorrectElement = new Audio("./assets/sfx/timesup.mp3");
var sfxArray = [tabElement,demoElement,upgradeElement,mailElement,achievementElement,eventElement,reactionStartElement,reactionCorrectElement];

var timerLoad = setInterval(timerEventsLoading,50);
var timer = setInterval(timerEvents,1000000);
const timeRatio = 500;
var timerSeconds = 0;
createTabs();
tabChange(1);


//------------------------------------------------------------------------GAME FUNCTIONS------------------------------------------------------------------------//
window.oncontextmenu = function (){
    return false;
};

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
    foodCheck(timerSeconds);
    randomEventTimer(timerSeconds);
    timerSave(timerSeconds);
} 

// TEMPORARY TIMER
function timerEventsLoading() {
    addNewRow();
    refresh();
    checkAchievement();
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
    }
    // LOAD VALUES DATA
    if (localStorage.getItem("saveValuesSave") == null) {
        saveValues = saveValuesDefault;
    } else {
        let saveValuesTemp = localStorage.getItem("saveValuesSave");
        saveValues = JSON.parse(saveValuesTemp)
    }
    // LOAD HEROES DATA
    if (localStorage.getItem("upgradeDictSave") == null) {
        let upgradeDictTemp = generateHeroPrices(upgradeDictDefault,NONWISHHEROMAX);
        upgradeDict = upgradeDictTemp;
    } else {
        let upgradeDictTemp = localStorage.getItem("upgradeDictSave");
        upgradeDict = JSON.parse(upgradeDictTemp);
        var timer2 = setTimeout(loadRow,1000);
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
}

// BIG BUTTON FUNCTIONS
var clickAudioDelay = null;
var currentClick = 1;
let demoImg = document.createElement("img");
demoImg.src = "./assets/nahida.png";
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
    refresh();

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
    img.src = "./assets/icon/primogemIcon.png";
    img.style.left = `${randomInteger(0,100)}%`
    img.style.animation = animation;
    img.addEventListener('animationend', () => {img.remove();});
    img.classList.add("falling-image");
    leftDiv.appendChild(img);
});

demoFunction(demoContainer,demoImg);
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
    let eventTimeMin = 10 * eventTimes;
    if (eventChance !== 0) {
        let upperLimit = 10 ** (1 + (timerSeconds - eventTimeMin)/5)
        if (Math.ceil(upperLimit) >= eventChance) {
            eventChance = 0;
            eventTimes++;
            // console.log("Event started!");
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
    eventPicture.classList.add("random-event");
    eventPicture.addEventListener("click", () => {clickedEvent();eventPicture.remove()});

    setTimeout(() => {eventPicture.remove()}, 10000);
    eventPicture.style.left = randomInteger(10,90) + "%";
    eventPicture.style.top = randomInteger(10,90) + "%";

    let eventPictureImg = document.createElement("img");
    eventPictureImg.src = "./assets/mouse.png";
    eventPicture.appendChild(eventPictureImg);
    mainBody.appendChild(eventPicture);
}

function clickedEvent() {
    eventElement.load();
    eventElement.play();

    let eventDropdown = document.createElement("div");
    eventDropdown.classList.add("event-dropdown");
    let eventDropdownBackground = document.createElement("img");
    eventDropdownBackground.src = "./assets/tutorial/eventPill.webp";

    let aranaraNumber = randomInteger(1,6);
    let eventDropdownText = document.createElement("div");
    eventDropdownText.innerText = eventText[aranaraNumber];
    eventDropdownText.classList.add("event-dropdown-text");

    let eventDropdownImage = document.createElement("div");
    eventDropdownImage.style.background = "url(./assets/tutorial/aranara-"+ (aranaraNumber) +".webp)";
    eventDropdownImage.style.backgroundSize = "contain";
    eventDropdownImage.style.backgroundRepeat = "no-repeat";
    eventDropdownImage.classList.add("event-dropdown-image");
    
    eventDropdown.append(eventDropdownBackground, eventDropdownText,eventDropdownImage);
    eventDropdown.addEventListener("animationend", () => {eventDropdown.remove()});
    mainBody.appendChild(eventDropdown);

    setTimeout(() => {chooseEvent()},6000);
}

function chooseEvent() {
    //clickEvent();
    rainEvent()
    // let randInt = randomInteger(1,5);
    // if (randInt === 1) {
    //     rainEvent();
    // } else if (randInt === 2) {
    //     clickEvent();
    // } else if (randInt === 3) {
    //     reactionEvent();
    // } else if (randInt === 4) {
    //     boxFunction();
    // }
}

// EVENT 1 (RAIN)
function rainEvent() {
    let eventBackdrop = document.createElement("div");
    eventBackdrop.classList.add("event-dark");

    let rainText = document.createElement("div");
    let rainTextBackground = document.createElement("div");
    let rainTextDiv = document.createElement("p");

    rainText.classList.add("event-rain-text");
    let dpsMultiplier = (saveValues.dps + 1)* 20;
    let tempScore = 0;
    let tempPrimogem = 0;
    rainTextDiv.innerText = tempScore;
    rainText.append(rainTextBackground,rainTextDiv)
    mainBody.appendChild(rainText);

    function spawnRain() {
        let animation = `rain ${(randomInteger(8,12)/2)}s linear forwards`
        let type = randomInteger(1,101);
        var img = document.createElement("img");
        if (type >= 85) {
            img.src = "./assets/icon/primogemLarge.webp"
            animation = `rain-rotate ${(randomInteger(3,8)/2)}s linear forwards`
            img.addEventListener('click', () => {
                img.remove();
                tempPrimogem += randomInteger(20,40);
                rainTextDiv.innerText = abbrNum(tempScore * dpsMultiplier) + " Nuts | " + tempPrimogem + " Primos";
            });
        } else if (type >= 65) {
            img.src = "./assets/icon/scarab.webp"
            img.addEventListener('click', () => {
                img.remove();
                tempScore -= 10;
                tempScore = Math.max(0, tempScore);
                tempPrimogem -= randomInteger(30,100);
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
        }),8000})
    }, 28000);
    mainBody.append(eventBackdrop);
}

// EVENT 2 (ENERGY OVERLOAD)
function clickEvent() {
    let button = demoContainer.firstElementChild;
    button.style.animation = "rotation-scale 5s infinite linear forwards";
    button.style["box-shadow"] = "inset 0em 0em 6em #93d961";
    clickerEvent = true;
    currentClick = 15 * saveValues["dps"];

    setTimeout(() => {
        button.style.animation = "rotation 18s infinite linear forwards";
        button.style["box-shadow"] = "";
        clickerEvent = false;
    },20000)
}

// EVENT 3 (WHERES WALDO)
// EVENT 4 (REACTION TIME)
var reactionReady = false;
var reactionGame = false;
function reactionEvent() {
    reactionGame = true;
    let eventBackdrop = document.createElement("div");
    eventBackdrop.classList.add("event-dark");

    let reactionImage = document.createElement("div");
    reactionImage.id = "reaction-image";

    let reactionImageBottom = document.createElement("img");
    reactionImageBottom.src = "./assets/clock-back.webp";
    reactionImageBottom.id = "reaction-image-bot";
    let reactionImageArrow = document.createElement("img");
    reactionImageArrow.src = "./assets/clock-arrow.webp";
    reactionImageArrow.id = "reaction-image-arrow";
    let reactionImageTop = document.createElement("img");
    reactionImageTop.src = "./assets/clock-top.webp";
    reactionImageTop.id = "reaction-image-top";

    let reactionButton = document.createElement("div");
    reactionButton.id = "reaction-button";
    reactionButton.innerText = "Not yet...";
    reactionButton.addEventListener("click",()=>{
        reactionFunction(eventBackdrop)
        setTimeout(()=> {
            eventBackdrop.remove();
        },2000)
    });

    reactionStartElement.load();
    reactionStartElement.play();
    reactionStartElement.addEventListener("ended", ()=> {
        if (reactionGame == true) {
            reactionReady = true;
            reactionButton.innerText = "Now!";
            reactionImageArrow.style.animationPlayState = "paused";
            setTimeout(() => {
                if (reactionGame == true) {
                    reactionReady = false;
                    reactionButton.innerText = "Too Slow!";
                    reactionFunction(eventBackdrop);
                }
            }, 800)
        }
    });
    
    reactionImage.append(reactionImageBottom,reactionImageArrow,reactionImageTop)
    eventBackdrop.append(reactionImage,reactionButton);
    mainBody.append(eventBackdrop);
    
}

function reactionFunction(eventBackdrop) {
    if (reactionGame == false) {return};
    let outcomeText = document.createElement("div");
    let outcomeTextBackground = document.createElement("div");
    let outcomeTextDiv = document.createElement("p");
    outcomeText.classList.add("event-rain-text");
    outcomeText.id = "outcome-text";

    reactionStartElement.pause();
    reactionCorrectElement.load();
    if (reactionReady == false) {
        outcomeTextDiv.innerText = "You missed!";
    } else if (reactionReady == true) {
        reactionCorrectElement.play();
        adventure(10);
        adventure(10);
        saveValues.primogem += randomInteger(40,60);
        outcomeTextDiv.innerText = "You did it!";
    }

    reactionReady = false;
    reactionGame = false;
    outcomeText.append(outcomeTextBackground,outcomeTextDiv);
    mainBody.append(outcomeText);

    setTimeout(()=> {
        eventBackdrop.remove();
        outcomeText.remove();
    },2000)
}

// EVENT 5 (7 BOXES)
function boxFunction() {
    let eventBackdrop = document.createElement("div");
    eventBackdrop.classList.add("event-dark");

    let boxOuterDiv = document.createElement("div");
    boxOuterDiv.id = "box-outer-div";
    boxOuterDiv.classList.add("box-outer-div");
    boxOuterDiv.classList.add("box-event")
    let count = 8;
    while (count--) {
        let boxImageDiv = document.createElement("div");
        boxImageDiv.classList.add("box-image-div");

        let boxImageImg = document.createElement("img");
        boxImageImg.src = "./assets/icon/box-" + count + ".webp";
        boxImageImg.id = ("box-" + count);
        boxImageImg.addEventListener("click", function() {boxOpen(eventBackdrop)})

        boxImageDiv.appendChild(boxImageImg);
        boxOuterDiv.appendChild(boxImageDiv);
        if (count == 1) {break};
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
    let badOutcomeNumber = 0;
    let goodOutcomeNumber = 0;

    let boxChance = randomInteger(1,101);
    if (boxChance >= 60) {
        goodOutcomeNumber = randomInteger(60,160);
        boxOutcome.src = "./assets/icon/primogemLarge.webp";
        outcomeText = "The box contained primogems! (Gain "+goodOutcomeNumber+" Primogems)";
    } else if (boxChance >= 25) {
        let goodOutcome = randomInteger(1,8);
        boxOutcome.src = "./assets/icon/good-" + goodOutcome + ".webp";
        outcomeText = "Oh, it had a gemstone! (Increased power for " +boxElement[goodOutcome]+ " characters)";
        goodOutcomeNumber = 5000.1 + goodOutcome;
    } else if (boxChance >= 15) {
        let badOutcome = randomInteger(1,5);
        boxOutcome.src = "./assets/icon/bad-" + badOutcome + ".webp";

        let badOutcomePercentage = randomInteger(5,16);
        outcomeText = "Uh oh, an enemy was hiding in the box! (Lost " +badOutcomePercentage+"% of  Nuts)";
        badOutcomePercentage = badOutcomePercentage/100;
        badOutcomeNumber = (saveValues.realScore * badOutcomePercentage);
        saveValues.realScore -= badOutcomeNumber;
    } else if (boxChance >= 5) {
        let veryGoodOutcome = randomInteger(1,4);
        saveValues.primogem += randomInteger(40,60);
        boxOutcome.src = "./assets/icon/verygood-" + veryGoodOutcome + ".webp";
        outcomeText = "Oh! It had a precious gemstone!! (Increased power for all characters)";
        goodOutcomeNumber = 5015.1;
    } else {
        boxOutcome.src = "./assets/icon/verybad-" + 1 + ".webp";
        
        let badOutcomePercentage = randomInteger(35,61);
        outcomeText = "Uh oh! Run away! (Lost " +badOutcomePercentage+ "% of Nuts LOL LOSER)";
        badOutcomePercentage = badOutcomePercentage/100;
        badOutcomeNumber = (saveValues.realScore * badOutcomePercentage);
        saveValues.realScore -= badOutcomeNumber;
    }

    boxOuterNew.appendChild(boxOutcome);
    let boxText = document.createElement("div");
    let boxTextBackground = document.createElement("div");
    let boxTextDiv = document.createElement("p");

    boxText.classList.add("event-rain-text");
    boxText.id = "box-text"
    boxTextDiv.innerText = outcomeText;
    boxText.append(boxTextBackground,boxTextDiv)
    
    setTimeout(()=> {
        boxOuterNew.remove();
        eventBackdrop.remove();
    },4000);

    setTimeout(()=> {
        mainBody.appendChild(boxText);
        setTimeout(()=> {
            boxText.classList.add("slide-out-animation");
            boxText.addEventListener("animationend",() => {
                boxText.remove()
                 if (goodOutcomeNumber >= 50 && goodOutcomeNumber <= 200) {
                    saveValues.primogem += goodOutcomeNumber;
                } else if (goodOutcomeNumber > 200) {
                    itemUse(goodOutcomeNumber.toString())
                }
            });
        },4000)
    },1000);
}

// EVENT 6 (WHACK-A-MOLE)


//--------------------------------------------------------------------------MAIN BODY----------------------------------------------------------------------//
function loadingAnimation() {
    var siteWidth = 1080;
    var scale = screen.width / (siteWidth);
    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width='+siteWidth+', initial-scale='+scale/1.85+', user-scalable=no');
    setTimeout(() => {removeLoading()}, 1200);
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
    tutorialDark.classList.add("tutorial-dark");

    // let tutorialTopText = document.createElement("img");
    // tutorialTopText.classList.add("tutorial-text");
    // tutorialTopText.src = "./assets/tutorial/tutorialText.webp"

    var tutorialImage = document.createElement("img");
    tutorialImage.classList.add("tutorial-img");
    tutorialImage.id = "tutorialImg";
    tutorialImage.src = "./assets/tutorial/tut-1.jpg"
    
    var tutorialScreen = document.createElement("div");
    tutorialScreen.classList.add("tutorial-screen");
    tutorialScreen.addEventListener("click", () => {
        if (currentSlide == 4) {
            overlay.style.zIndex = -1;
            clearInterval(timerLoad);
            timer = setInterval(timerEvents,timeRatio);
            currentBGM = playAudio();
            settingsVolume();

            if (document.fullscreenEnabled) {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                }
            }
            return;
        }

        currentSlide++;
        let currentTutorialImage = document.getElementById("tutorialImg");
        currentTutorialImage.src = "./assets/tutorial/tut-"+currentSlide+".jpg";
    })

    tutorialScreen.append(tutorialImage);
    tutorialDark.appendChild(tutorialScreen);
    overlay.appendChild(tutorialDark);
}

function saveData() {
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
}

//------------------------------------------------------------------------ON-BAR BUTTONS------------------------------------------------------------------------//
// TAB UI
function createTabs() {
    let tabFlex = document.getElementById("flex-container-TAB");
    for (let i=0, len=(TABS.length - 1); i < len; i++){
        let tabButton = document.createElement("div");
        tabButton.classList += "tab-button-div";

        let tabButtonImage = document.createElement("img");
        tabButtonImage.src = "./assets/icon/tab"+ (i + 1) +".png";
        tabButtonImage.classList += "tab-button";

        tabButton.id = "tab-" + (i);
        tabButton.addEventListener('click', () =>{
            tabChange(i + 1);
        })
        tabButton.appendChild(tabButtonImage);
        tabFlex.appendChild(tabButton);
    }

    if (upgradeDict[100].Row !== -1) {
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
        let removeActiveHero = document.getElementById(`but-${heroTooltip}`)
        if (removeActiveHero.classList.contains("active-hero")) {
            removeActiveHero.classList.remove("active-hero");
        }
    }

    
    clearTooltip();
    x--;
    TABS[x].style.display = "flex";

    if (x == 0) {
        table6.style.display = "flex";
        tooltipTable = 1;
        if (document.getElementById("tool-tip-button")) {
            let tooltipButtonText = document.getElementById("tool-tip-button");
            tooltipButtonText.innerText = "Purchase";
        }
    } else if (x == 1){
        table6.style.display = "flex";  
        tooltipTable = 2;
        if (document.getElementById("tool-tip-button")) {
            let tooltipButtonText = document.getElementById("tool-tip-button");
            tooltipButtonText.innerText = "Use";
        }
    } else {
        table6.style.display = "none";
    }

    if (x != 3 && wishCounter != saveValues["wishCounterSaved"]) {
    let mailImageTemp = document.getElementById("mailImageID")
        mailImageTemp.style.opacity = 1;
    }
}

// SETTINGS MENU - SAVES & VOLUME CONTROL
var settingsOpen = false;
function settings() {
    // JUST THE BUTTON FOR SETTING MENU
    let settingButton = document.createElement("button");
    settingButton.classList.add("settings-button");
    let settingButtonImg = document.createElement("img");
    settingButtonImg.src = "./assets/settings.webp";
    settingButtonImg.classList.add("settings-button-img")
    settingButton.appendChild(settingButtonImg);
    settingButton.addEventListener("click", () => {
        if (settingsOpen == false) {
            settingsMenu.style.zIndex = 1000;
            settingsOpen = true;
        } else {
            settingsMenu.style.zIndex = -1;
            settingsOpen = false;
        }
    })
    multiplierButtonContainer.prepend(settingButton);

    // RELATED TO SETTINGS MENU
    var settingsMenu = document.createElement("div");
    settingsMenu.id = "settings-menu";
    settingsMenu.classList.add("settings-menu");

    // let settingsMenuBackground = document.createElement("img");
    // settingsMenuBackground.classList.add("settings-menu-background");
    // settingsMenuBackground.src = "./assets/achievementBG.webp"

    let settingsText = document.createElement("img");
    settingsText.classList.add("settings-text");
    settingsText.src = "./assets/settings/Settings.webp"
    
    let volumeScrollerContainer = document.createElement("div")
    volumeScrollerContainer.classList.add("volume-scroller-container");

    let volumeScrollerBGMContainer = document.createElement("div");
    volumeScrollerBGMContainer.classList.add("volume-scroller-container-children");
    let volumeScrollerBGM = document.createElement("input");
    volumeScrollerBGM = volumeScrollerAdjust(volumeScrollerBGM);
    volumeScrollerBGM.id = "volume-scroller-bgm";
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
    volumeScrollerSFX.id = "volume-scroller-sfx";
    volumeScrollerSFX.value = settingsValues.sfxVolume * 100;

    let volumeScrollerSFXText = document.createElement("div");
    let volumeScrollerSFXTextImage = document.createElement("img");
    volumeScrollerSFXTextImage.src = "./assets/settings/SFX.webp"
    volumeScrollerSFXText.appendChild(volumeScrollerSFXTextImage)
    volumeScrollerSFXContainer.append(volumeScrollerSFXText,volumeScrollerSFX);

    volumeScrollerContainer.append(volumeScrollerBGMContainer,volumeScrollerSFXContainer)


    let settingsBottom = document.createElement("div");
    settingsBottom.classList.add("settings-bottom");
    let settingsBottomLeft = document.createElement("div");
    settingsBottomLeft.classList.add("settings-bottom-left");
    let settingsBottomRight = document.createElement("div");
    settingsBottomRight.classList.add("settings-bottom-right");

    settingsBottom.append(settingsBottomLeft,settingsBottomRight);

    var infoSetting = document.createElement("button");
    infoSetting.classList.add("setting-info");
    // infoSetting.addEventListener("click",() => {saveData();})

    var saveSetting = document.createElement("button");
    saveSetting.classList.add("setting-save");
    saveSetting.addEventListener("click",() => {saveData();})

    var clearSetting = document.createElement("button");
    clearSetting.classList.add("setting-clear");
    clearSetting.addEventListener("click",() => {localStorage.clear();location.reload()})

    settingsBottomRight.append(infoSetting,saveSetting,clearSetting)

    settingsMenu.append(settingsText, volumeScrollerContainer, settingsBottom);
    mainBody.appendChild(settingsMenu);
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


//------------------------------------------------------------------------TABLE 1 (HEROES)------------------------------------------------------------------------//
// LOAD SAVED HEROES IN TABLE1
var rowTempDict = {};
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
        var purchased = false;

        let upgradeDictTemp = upgradeDict[loadedHeroID];
        let formatCost = upgradeDictTemp["BaseCost"];
        let formatATK = upgradeDictTemp["Factor"];

        if (upgradeDictTemp["Purchased"] > 0) {
            formatCost *= (COSTRATIO**upgradeDictTemp["Purchased"])
            formatCost = abbrNum(formatCost)
            formatATK = abbrNum(formatATK)
            purchased = true;
            if (j == 0) {
                let singular = ` Nut${upgradeDict[j]["Factor"] !== 1 ? 's' : ''} per click`;
                heroTextLoad =  upgradeDict[j].Name + ": " + formatCost + ", " + formatATK + singular;
            } else {
                heroTextLoad =  upgradeDictTemp.Name + ": " + formatCost + ", +" + formatATK + " NpS";
            }
        } else {
            if (upgradeDictTemp["Level"] == 0) {
                heroTextLoad = "Summon " + upgradeDictTemp.Name + " for help. (" + abbrNum(formatCost) + ")";
            } else if (j == 0) {
                heroTextLoad = "Level Up Nahida (" + abbrNum(formatCost) + ")";
            } else {
                heroTextLoad = "Call for " + upgradeDictTemp.Name + "'s help... (" + abbrNum(formatCost) + ")";
            }
        }

        let heroID = "but-" + j;
        let heroButtonContainer = createHeroButtonContainer(heroID);
        
        heroButtonContainer.addEventListener("click", () => {
            changeTooltip(upgradeDictTemp, "hero");
            if (heroTooltip !== -1) {
                let removeActiveHero = document.getElementById(`but-${heroTooltip}`)
                if (removeActiveHero.classList.contains("active-hero")) {
                    removeActiveHero.classList.remove("active-hero");
                }
            }
            heroTooltip = j;
            heroButtonContainer.classList.add("active-hero");
        });
        heroButtonContainer.innerText = heroTextLoad;

        if (purchased == true) {
            heroButtonContainer.style = "background:url(./assets/nameplates/"+upgradeDictTemp.Name.replace(/ /g,'')+".webp);  background-size: 125%; background-position: 99% center; background-repeat: no-repeat;";
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
            
            if (upgradeDict[i]["Level"] === 0) {
                var heroText = "Summon " + upgradeDict[i].Name + " for help. (" + abbrNum(upgradeDict[i]["BaseCost"]) + ")";
            } else if (i === 0) {
                var heroText = "Level Up Nahida (" + abbrNum(upgradeDict[i]["BaseCost"]) + ")";
            } else {
                var heroText = "Call for " + upgradeDict[i].Name + "'s help... (" + abbrNum(upgradeDict[i]["BaseCost"]) + ")";
            }

            let heroID = "but-" + saveValues["rowCount"];
            let heroButtonContainer = createHeroButtonContainer(heroID);
            let toolName = upgradeDict[i];
            
            heroButtonContainer.addEventListener("click", () => {
                changeTooltip(toolName, "hero");
                heroTooltip = i;
            });
            heroButtonContainer.innerText = heroText;
            table1.appendChild(heroButtonContainer);

            saveValues["rowCount"]++;
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
        costCurrent = Math.round(upgradeDictTemp["BaseCost"] * ((COSTRATIO**currentPurchasedLocal) - COSTRATIO**(currentPurchasedLocal + currentMultiplierLocal)) / (1 - COSTRATIO))
        requiredFree = currentMultiplierLocal;
    } else {
        costCurrent = Math.round(upgradeDictTemp["BaseCost"] * (COSTRATIO **currentPurchasedLocal));
        requiredFree = 1;
    }

    if (realScoreCurrent >= costCurrent) {
        if (requiredFree) {
            if (saveValues["freeLevels"] > requiredFree) {
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
        checkExpeditionUnlock(saveValues["heroesPurchased"]);                                        
        refresh(butIdArray, upgradeDictTemp["BaseCost"], clicked_id);
            
        changeTooltip(upgradeDictTemp,"hero");                   
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
        };
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
                continue
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
            return;
        }
    }

    itemUniqueID = idNum;
    let buttonInv = document.createElement("button");
    buttonInv.classList.add("button-container");
    buttonInv.id = itemUniqueID;
    buttonInv.addEventListener('click', function() {
        changeTooltip(Inventory[idNum], "item", idNum);
        itemTooltip = itemUniqueID;
    });
    buttonInv = inventoryAddButton(buttonInv,Inventory[idNum])
    table2.appendChild(buttonInv);
}

// INVENTORY FUNCTIONALITY
// RMB TO UPDATE CONSTANTS
const weaponBuffPercent = [0, 1.2, 1.8, 2.7, 3.9, 5.2, 10];
const artifactBuffPercent = [0, 1.1, 1.3, 1.7, 2.3, 3.0];
const foodBuffPercent = [0, 1.4, 2.0, 3.0, 4.4, 6.2];
function itemUse(itemUniqueId) {
    let itemID;
    
    if (typeof itemUniqueId === 'string') {
        itemID = itemUniqueId.split(".")[0];
    } else {
        itemID = itemUniqueId;
    }
    
    if ((itemID >= 1001 && itemID < WEAPONMAX) || (itemID >= 7000 && itemID < 7030)){
        for (let i = 0, len=WISHHEROMAX; i < len; i++) {
            if (upgradeDict[i] == undefined) continue;
            if (i < WISHHEROMIN && i > NONWISHHEROMAX && i != 1) continue;
            let upgradeDictTemp = upgradeDict[i];
            if (upgradeDictTemp.Purchased > 0){
                if (upgradeDictTemp.Type == Inventory[itemID].Type){
                    upgradeDictTemp["Factor"] *= weaponBuffPercent[Inventory[itemID].Star];
                    upgradeDict[i]["Factor"] = Math.ceil(upgradeDictTemp["Factor"]);
                    refresh("hero", i);
                }
            }
        }
    } else if (itemID >= 2001 && itemID < ARTIFACTMAX){
        for (let i = 0, len=WISHHEROMAX; i < len; i++) {
            if (upgradeDict[i] == undefined) continue;
            if (i < WISHHEROMIN && i > NONWISHHEROMAX && i != 1) continue;
            let upgradeDictTemp = upgradeDict[i];
            if (upgradeDictTemp.Purchased > 0){
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
    } else if (itemID === 5015 || itemID === 5016) {
        let power = 1;
        if (Inventory[itemID].Star === 5) {
            power = 1.5;
        } else {
            power = 3.5;
        };

        for (let i = 0, len=WISHHEROMAX; i < len; i++) {
            if (upgradeDict[i] == undefined) continue;
            if (i < WISHHEROMIN && i > NONWISHHEROMAX) continue;
            let upgradeDictTemp = upgradeDict[i];
            if (upgradeDictTemp.Purchased > 0){
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
            power = 2;
        } else {
            power = 4;
        };

        for (let i = 0, len=WISHHEROMAX; i < len; i++) {
            if (upgradeDict[i] == undefined) continue;
            if (i < WISHHEROMIN && i > NONWISHHEROMAX) continue;
            if (upgradeDict[i].Purchased > 0)
                if (upgradeDict[i].Ele == elem || i === 1) {
                    upgradeDict[i]["Factor"] *= power;
                    upgradeDict[i]["Factor"] = Math.ceil(upgradeDict[i]["Factor"]);
                    refresh("hero", i);
            }
        }
    } else if (itemID >= 6001 && itemID < 6050){
        let power;
        let nation = Inventory[itemID].nation;
        if (Inventory[itemID].Star === 4) {
            power = 2;
        } else {
            power = 4;
        };

        for (let i = 0, len=WISHHEROMAX; i < len; i++) {
            if (upgradeDict[i] == undefined) continue;
            if (i < WISHHEROMIN && i > NONWISHHEROMAX && i != 1) continue;
            if (upgradeDict[i].Purchased > 0){
                if (upgradeDict[i].Nation === nation) {
                    upgradeDict[i]["Factor"] *= power;
                    upgradeDict[i]["Factor"] = Math.ceil(upgradeDict[i]["Factor"]);
                    refresh("hero", i);
                }
            }
        }
    }
    clearTooltip();
}

// FUNCTIONALITY FOR TEMP FOOD BUFFS (SET TO 30 SECONDS) + RMB TO CHANGE ANIMATION TIME TOO
function foodCheck(timerSecondsTemp) {
    if (timerSecondsTemp - timeSnapshot1 >= 30) {
        document.getElementById("app"+1).innerHTML = ''
        foodBuff = 1;
    }
    if (timerSecondsTemp - timeSnapshot2 >= 30) {
        document.getElementById("app"+2).innerHTML = ''
    }
}

function foodButton(type) {
    let container = document.getElementById("app"+type);
    if (type == 1) {
        timeSnapshot1 = timerSeconds;
        container.innerHTML = '';
        container.appendChild(countdownText(1));
    } else {
        timeSnapshot2 = timerSeconds;
        container.innerHTML = '';
        container.appendChild(countdownText(2));
    }
    
}

//-------------------------------------------------------------TABLE 3 (EXPEDITION + EXPEDITION TOOLTIPS)----------------------------------------------------------//
// EXPEDITION MECHANICS
const ADVENTURECOSTS = [0, 100, 250, 500, 750, 1000];
function adventure(type) {
    if (type == 10) {
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
    } else if (expeditionDict[type].Locked == '1'){
        alert("ITS LOCKED CANT YOU SEE!!!!!!!")
        return;  
    }

    if (saveValues["energy"] >= ADVENTURECOSTS[type]){
        saveValues["energy"] -= ADVENTURECOSTS[type];
        refresh();
        
        switch (type) {
            case 1:
                inventoryDraw("artifact", 1, 4);
                inventoryDraw("weapon", 1, 1);
                inventoryDraw("xp", 2, 2);
                inventoryDraw("food", 1, 3);
                break;
            case 2:
                inventoryDraw("xp", 2, 2);
                inventoryDraw("xp", 2, 2);
                inventoryDraw("xp", 2, 2);
                inventoryDraw("food", 2, 3);
                inventoryDraw("artifact", 2, 4);
                inventoryDraw("weapon", 1, 2);
                break;
            case 3:
                inventoryDraw("xp", 3, 3);
                inventoryDraw("xp", 2, 2);
                inventoryDraw("artifact", 3, 4);
                inventoryDraw("food", 2, 4);
                inventoryDraw("weapon", 2, 3);
                break;
            case 4:
                inventoryDraw("xp", 3, 3);
                inventoryDraw("xp", 3, 3);
                inventoryDraw("weapon", 3, 4);
                inventoryDraw("artifact", 3, 4);
                inventoryDraw("food", 2, 4);
                break;
            case 5:
                inventoryDraw("xp", 3, 3);
                inventoryDraw("xp", 4, 4);
                inventoryDraw("artifact", 4, 5);
                inventoryDraw("weapon", 4, 5);
                inventoryDraw("food", 2, 5);
                break;
            default:
                break;
        }
        sortList("table2");
        newPop(1);
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
        "specialWeapon": 7030,
    };
    let lowerInventoryType = {
        "weapon": 1001, 
        "artifact": 2001, 
        "food": 3001, 
        "xp": 4001,
        "gem": 5001,
        "talent": 6001,
        "specialWeapon": 7001,
    };
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
            var backgroundImg = "url(./assets/expedbg/exped6.png)";
        } else {
            var backgroundImg = "url(./assets/expedbg/exped" + i + ".png)";
        }

        expedButton = expedButtonAdjust(expedButton, backgroundImg, i)
        expedButton.addEventListener("click", () => {adventure(i)});
        expedButton.addEventListener("mouseover", function() {expedInfo(this.id)});
        expedButton.addEventListener("mouseout", () => {expedInfo(7)});
        expedDiv.appendChild(expedButton);
    }
}

function expedInfo(butId) {
    let expedTableTemp = document.getElementById("expedTableID");
    let expedRow1 = document.getElementById("exped-row-1");
    let expedRow2 = document.getElementById("exped-row-2");
    let i = 0;

    let afterEnergyIcon = document.createElement("img");
    afterEnergyIcon.classList += "after-icon";
    afterEnergyIcon.id = "afterEnergyIcon"
    
    if (butId == 7) {
        i = 7;
    } else {
        i = butId.split("-")[1];
    }

    if (expeditionDict[i]["Locked"] == 0 || i == 7) {
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
    wishButtonPrimo.src = "./assets/icon/primogemIcon.png";
    
    wishButtonText.innerText = "Write for help | 160 ";
    wishButtonText.append(wishButtonPrimo);
    wishButton.addEventListener("click",() => {
        wish();
    })
}

// DRAWS/WISH FOR SPECIAL HEROS
function drawWish() {
    var wishButton = document.createElement("div");
    wishButton.classList += "wish-button";
    wishButton.id = "wishButton"
    let wishButtonText = document.createElement("div");
    wishButtonText.id = "wishButtonText";
    wishButtonText.classList += "wish-button-text";
    wishButtonText.innerText = "???";

    table4 = drawMailTable(table4);

    let mailImageDiv = document.getElementById("mail-image-div");
    let wishButtonImg = document.createElement("img");
    wishButtonImg.src = "./assets/wishButton.webp";
    wishButtonImg.classList += "wish-button-img";
    wishButton.append(wishButtonImg,wishButtonText)
    mailImageDiv.append(wishButton);

    if (wishCounter === saveValues["wishCounterSaved"]) {
        stopWish();
    } else if (saveValues["wishUnlocked"] == true) {
        wishUnlock();
    } 
}

function stopWish() {
    let wishButton = document.getElementById("wishButton");
    let wishButtonText = document.getElementById("wishButtonText");
    wishButtonText.innerHTML = "Closed";

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
                newPop(2);
                addShop();
                newPop(6);
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
var achievementData = {
    achievementTypeRawScore: [10,1e3,1e4,1e6,1e8,1e9,1e11,1e12,1e14,1e15,1e17,1e18,1e20,1e21,1e23,1e24],
    achievementTypeRawDPS:   [1,10,100,10000,1e5,1e6,1e8,1e9,1e11,1e12,1e14,1e15,1e17,1e18,1e20,1e21],
    achievementTypeRawClick: [1e1,1e2,1e3,1e4,1e5],
    achievementTypeRawCollection: [1,10,100,250,500,1000,2500,5000,7500,10000],
};

function achievementListload() {
    for (let i = 1, len=getHighestKey(achievementList); i < len; i++) {
        if (achievementMap.get(i) === false) {
            continue;
        } else {
            let achievementStored = storeAchievement(achievementList[i].Name,achievementList[i].Description,10000 + i);
            table5.appendChild(achievementStored); 
            sortList("table5");
        }
    }
}

var scoreAchievement = [1,101,201,301];
function popAchievement(achievement) {
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
        default:
            console.log("No more Achievements left!");
            return;
    }

    let achievementListTemp = achievementList[achievementType];
    if (achievementListTemp["Done"] == true) {
        return;
    }

    var achievementText = achievementListTemp.Name;
    var achievementDesc = achievementListTemp.Description;
    achievementMap.set(achievementType,true);
    achievementID += achievementType;
    saveValues["primogem"] += 20;

    if (timerSeconds !== 0) {
        var achievementPopUp = createAchievement(achievementText,achievementDesc);
        achievementPopUp.addEventListener("click", () => {achievementPopUp.remove()});
        achievementPopUp.addEventListener('animationend', () => {achievementPopUp.remove()});
        leftDiv.appendChild(achievementPopUp);
        achievementElement.load();
        achievementElement.play();
    }
    

    //  ^^^ TEMP ACHIEVEMENT | PERMANENT ACHIEVEMENT vvv
    
    let achievementStored = storeAchievement(achievementText,achievementDesc,achievementID);
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
}

//-----------------------------------------------------------------TABLE 6 (TOOLTIPS FOR TABLE 1 & 2)-----------------------------------------------------------//
// TOOLTIP UI
function createTooltip() {
    tooltipName = document.createElement("div");
    tooltipName.classList += "tool-tip-name";

    toolImgContainer = document.createElement("div");
    toolImgContainer.classList.add("toolImgContainer")
    toolImg = document.createElement("img");
    toolImg.src = "./assets/tooltips/Empty.webp";
    toolImg.classList.add("toolImg");
    toolImgOverlay = document.createElement("img");
    toolImgOverlay.src = "./assets/tooltips/Empty.webp";
    toolImgOverlay.classList.add("toolImgOverlay");
    toolImgContainer.append(toolImg,toolImgOverlay)
    
    tooltipText = document.createElement("div");
    tooltipText.classList += "tool-tip-text";
    tooltipLore = document.createElement("div");
    tooltipLore.classList += "tool-tip-lore";

    let tooltipExtraImg = document.createElement("div");
    tooltipExtraImg.classList += "tool-tip-extraimg";
    tooltipWeaponImg = document.createElement("img");
    tooltipElementImg = document.createElement("img");
    tooltipExtraImg.append(tooltipWeaponImg,tooltipElementImg);

    let tooltipButton = document.createElement("button");
    tooltipButton.id = "tool-tip-button";
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
        let tooltipTextLocal = "Level: " + dict["Purchased"] + 
                                "<br />Free Levels: " + saveValues["freeLevels"] + 
                                "<br />" + abbrNum(dict["Contribution"]) + ` ${dict.Name === "Nahida" ? 'Nuts per Click' : 'Nps'}`;
        toolImgOverlay.src = "./assets/tooltips/hero/"+dict.Name+".webp";
        tooltipElementImg.src = "./assets/tooltips/elements/" +dict.Ele+ ".webp";
        tooltipWeaponImg.src = "./assets/tooltips/elements/" +dict.Type+ ".webp";
        
        tooltipText.innerHTML = tooltipTextLocal;
    } else if (type == "item") {
        toolImg.src = "./assets/frames/background-" + dict.Star + ".webp";
        toolImgOverlay.src = "./assets/tooltips/inventory/" + dict.File + ".webp";
        tooltipText.innerHTML = "Amount: " + InventoryMap.get(number);
        return;
    }
}

function clearTooltip() {
    heroTooltip = -1;
    itemTooltip = -1;
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
        tooltipElementImg.src = "./assets/tooltips/Empty.webp";
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
        
        itemUse(itemTooltip);
        let itemButton = document.getElementById(itemTooltip);
        let inventoryCount = InventoryMap.get(itemTooltip);
        inventoryCount--;
        InventoryMap.set(itemTooltip,inventoryCount)

        if (inventoryCount > 0) {
            changeTooltip(Inventory[itemTooltip],"item",itemTooltip)
        } else {
            let nextButton = itemButton.nextSibling;
            itemButton.remove();
            if (nextButton) {
                let idNum = parseInt(nextButton.id);
                itemTooltip = idNum;
                console.log(itemTooltip)
                changeTooltip(Inventory[idNum],"item",idNum);
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
    tabButton.classList += "tab-button-div";

    let tabButtonImage = document.createElement("img");
    tabButtonImage.src = "./assets/icon/tab"+ (7) +".webp";
    tabButtonImage.classList += "tab-button";
    tabButtonImage.classList.add("darken")
    tabButton.id = "tab-" + (6);

    tabButton.addEventListener('click', () =>{
            tabChange(6);
    })

    tabButton.appendChild(tabButtonImage);
    tabFlex.appendChild(tabButton);
}

function setShop() {
    table7.classList.add("table-without-tooltip");

    let shopImg = document.createElement("img");
    shopImg.src = "./assets/shop.webp";

    let shopTimer = document.createElement("div");
    shopTimer.classList.add("store-timer");
    shopTimer.innerText = "Inventory resets in: " + Date.now();

    let shopDiv = document.createElement("div");
    shopDiv.classList.add("store-div");
    let i=10;
    while (i--) {
        let inventoryNumber;
        if (i >= 7 && i <= 10) {
            inventoryNumber = inventoryDraw("gem", 4,6, "shop");
        } else if (i >= 2 && i <= 6) {
            inventoryNumber = inventoryDraw("talent", 2,4, "shop");
        } else {
            inventoryNumber = inventoryDraw("specialWeapon", 6,6, "shop")
        }
        
        createShopItems(shopDiv, i, inventoryNumber);
    }

    let shopDialogueDiv = document.createElement("div");
    shopDialogueDiv.classList.add("store-dialog");

    let shopDialogueButton = document.createElement("div");
    shopDialogueButton.classList.add("store-buy");
    shopDialogueButton.innerText = "Confirm Purchase"
    shopDialogueButton.id = "shop-confirm";
    let shopDialogueText = document.createElement("div");
    shopDialogueText.id = "table7-text";

    shopDialogueDiv.append(shopDialogueText,shopDialogueButton)
    table7.append(shopImg,shopTimer,shopDiv,shopDialogueDiv);
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
        dialog.innerText = "";
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

function confirmPurchase(shopCost,id) {
    let mainButton = document.getElementById(id);
    let dialog = document.getElementById("table7-text");
    if (saveValues.primogem >= shopCost) {
        id = id.split("-")[2];
        newPop(1)
        inventoryAdd(id);
        sortList("table2");
        mainButton.classList.remove("shadow-pop-tr");
        mainButton.classList.add("purchased");
        saveValues.primogem -= shopCost;

        let confirmButton = document.getElementById("shop-confirm");
        let confirmButtonNew = confirmButton.cloneNode(true);
        confirmButton.parentNode.replaceChild(confirmButtonNew, confirmButton);
        dialog.innerText = "My Mora is mine, and your Mora is mine too! Hehehe."
    } else {
        dialog.innerText = "Hmph, come back when you're a little richer."
        return;
    }
}


function createShopItems(shopDiv, i, inventoryNumber) {
    let shopButton = document.createElement("div");
    shopButton.classList.add("shop-button");
    let inventoryTemp = Inventory[inventoryNumber];

    let shopButtonImage = document.createElement("img");
    shopButtonImage.src = "./assets/tooltips/inventory/"+ inventoryTemp.File+ ".webp";

    let shopButtonImageContainer = document.createElement("div");
    shopButtonImageContainer.classList.add("shop-button-container")
    shopButtonImageContainer.style.background = "url(./assets/frames/background-" +inventoryTemp.Star+ ".webp)";
    shopButtonImageContainer.style.backgroundSize = "cover";
    shopButtonImageContainer.style.backgroundPosition = "center center";
    shopButtonImageContainer.style.backgroundRepeat = "no-repeat";
    
    let shopButtonText = document.createElement("div");
    shopButtonText.classList.add("shop-button-text");

    let shopCost = 0;
    switch (inventoryTemp.Star) {
        case 2:
            shopCost = 15;
            break;
        case 3: 
            shopCost = 40;
            break;
        case 4:
            shopCost = 100;
            break;
        case 5:
            shopCost = 240;
            break;
        case 6:
            shopCost = 600;
            break;
        default:
            break;
    }

    shopButtonText.innerText = shopCost;
    
    shopButton.id = ("shop-" + i + "-" + inventoryNumber + "-" + shopCost);
    shopButton.addEventListener("click", function() {
        buyShop(this.id,shopCost)
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
                heroTextFirst = upgradeDictTemp.Name + ": " + formatCost + ", +" + formatATK + singular;
            } else {
                formatATK = abbrNum(formatATK)
                heroTextFirst = upgradeDictTemp.Name + ": " + formatCost + ", +" + formatATK + " NpS";
            }
            
            let upgradedHeroButton = document.getElementById(arguments[0]);
            upgradedHeroButton.innerText = heroTextFirst;
            upgradedHeroButton.style = "background:url(./assets/nameplates/"+upgradeDictTemp.Name.replace(/ /g,'')+".webp);  background-size: 125%; background-position: 99% center; background-repeat: no-repeat;";
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

            let heroText = hero.Name + ": " + abbrNum(formatCost) + ", +" + abbrNum(formatATK) + " NpS";
            let id="but-" + hero.Row + "";
            document.getElementById(id).innerText = heroText;
        }
    }
}

// POP UPS FOR EXPEDITIONS UNLOCKS
// NUMBER OF UPGRADES NEEDED TO UNLOCK EXPEDITIONS vvvv
var heroUnlockLevels = [150,300,450];
var expeditionCounter = 0;
function checkExpeditionUnlock(heroesPurchasedNumber) {
    if (heroUnlockLevels.length == 0) {
        return;
    } else if (heroesPurchasedNumber >= heroUnlockLevels[0]) {
        if (expeditionDict[expeditionCounter + 3].Locked == 1) {
            if (heroUnlockLevels.length != 1) {
                unlockExpedition(expeditionCounter + 3,expeditionDict);
                newPop(2);
            } else {
                if (saveValues["wishUnlocked"] === true) {
                    return;
                } else {
                    newPop(3);
                    wishUnlock();
                    saveValues["wishUnlocked"] = true;
                }
            }
            newPop(expeditionCounter + 10);
        }
        expeditionCounter++;
        heroUnlockLevels.shift()
    }
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