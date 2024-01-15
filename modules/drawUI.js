import Preload from 'https://unpkg.com/preload-it@latest/dist/preload-it.esm.min.js';
import { advancedStats } from './features/settings.js';
import { createDom } from './adjustUI.js';

function textReplacerCopy(dictReplace, originalText) {
    for (let key in dictReplace) {
        originalText = originalText.replaceAll(key,dictReplace[key]);
    }
    return originalText;
}

const filePath = "./assets/";
const uniqueFileArray = {
    "bg/":["achievementBG","bg","closed","dori-back","left","main-bar","middle","nutShop","nutShopInterior","open","right","wish-bg","wood"],
    "tutorial/":["buttonBox","eventPill","tut-button","idle","unlockExp-3","unlockExp-4","unlockExp-5","exped-button"],
    "frames/":["achievement","achievement-temp","button","dori-deals","wishButton","tooltipEXPED","bar","top-bar","arrow"],
    "tooltips/elements/":["Anemo","Any","Artifact","Bow","Catalyst","Claymore","Cryo","Dendro","Electro","Food","Gemstone","Geo","Hydro","Level","Polearm","Pyro","Sword","Talent"],
    "event/":["clock-arrow","clock-back","clock-top","mineEventBG","mine-flag","mine-info","mine-unclicked","mine-wrong","timer-sand","mine-empty","weasel-back","timer-bar"],
    "icon/":["food1","food2","goldenNut","nut","primogemLarge","scarab","shop-start","event-easy","event-hard"],
    "expedbg/":["counter","crit","dodge","Red","Blue","Green","quicktime","guard"]
}

const numberedFileArray = {
    "achievement/":20,
    "event/box-":7,
    "event/good-":7,
    "frames/background-":6,
    "frames/rarity-":6,
    "tutorial/aranara-":6,
    "event/whopperflower-":3,
    "event/bad-":4,
    "tutorial/tut-":5,
    "event/weasel-":9,
    "expedbg/battle":3,
    "expedbg/battle-scara":3,
    "expedbg/header/":17,
}

function preloadMinimumArray(upgradeInfo) {
    let array = [];
    for (let key in uniqueFileArray) {
        for (let i=0, len=uniqueFileArray[key].length; i < len; i++) {
            let url = filePath + key + uniqueFileArray[key][i] + ".webp";
            array.push(url);
        }
    }

    for (let key in numberedFileArray) {
        for (let i=1, len=numberedFileArray[key] + 1; i < len; i++) {
            let url = filePath + key + i + ".webp";
            array.push(url);
        }
    }

    for (let key in upgradeInfo) {
        let upgradeName = upgradeInfo[key].Name;
        let urlOne = filePath + "nameplates/" + upgradeName + ".webp";
        let urlTwo = filePath + "tooltips/hero/" + upgradeName + ".webp";
        array.push(urlOne,urlTwo);
    }
    return array;
}

function preloadImage(max,path,single) {
    let filePath = "./assets/";
    let i = 1;
    if (single === true) {
        let img = new Image();
        img.src = filePath + path + ".webp";
    } else {
        while (i < max) {
            let img = new Image();
            img.src = filePath + path + i + ".webp";
            i++;
        }
    }
}

// GAME GUI
function buildGame(mainBody) {
    let leftDiv = document.createElement("div");
    leftDiv.classList.add("flex-column");
    leftDiv.id = "left-div";
    leftDiv.classList.add("left-area");
    let screenTips = document.createElement("p");
    screenTips.classList.add("screen-tips","flex-column");
    screenTips.id = "screen-tips";
    let scoreDiv = document.createElement("div");
    scoreDiv.classList.add("score-container");
    scoreDiv.innerHTML = "<span id='score'>0</span><span id='dps'>0</span>"
    let demoContainer = document.createElement("div");
    demoContainer.id = "demo-container";
    leftDiv.append(screenTips,scoreDiv,demoContainer)

    let midDiv = document.createElement("div");
    midDiv.id = "mid-div";
    midDiv.classList.add("middle-area");

    let energyPrimoContainer = document.createElement("div");
    energyPrimoContainer.classList.add("flex-column","energy-primo-container");
    let energyContainer = document.createElement("div");
    energyContainer.classList.add("pill-value");
    energyContainer.innerHTML = "<img class='icon' alt='Energy Icon' src='./assets/icon/energyIcon.webp'><span id='energy'>0</span>";
    let primoContainer = document.createElement("div");
    primoContainer.classList.add("pill-value");
    primoContainer.innerHTML = `<img class="primogem icon" alt="Primogem Icon" src="./assets/icon/primogemIcon.webp"><span id="primogem">0</span>`;
    energyPrimoContainer.append(energyContainer,primoContainer)

    let tempBuffDiv = document.createElement("div");
    tempBuffDiv.classList.add("temp-buff");
    let appOne = document.createElement("div");
    appOne.id = "app1";
    let appTwo = document.createElement("div");
    appTwo.id = "app2";
    tempBuffDiv.append(appOne,appTwo);
    midDiv.append(energyPrimoContainer,tempBuffDiv)

    let rightDiv = document.createElement("div");
    rightDiv.id = "right-div";
    rightDiv.classList.add("right-area");

    mainBody.append(leftDiv,midDiv,rightDiv);
    return mainBody;
}

// MAIN BODY GUI
function drawMainBody() {
    // LEFT DIV/AREA
    let leftDiv = document.getElementById("left-div");
    // let leftImg = document.createElement("img");
    // leftImg.src = "./assets/bg/bg.webp";
    // leftImg.id = "left-bg";
    // leftImg.classList.add("cover-all","div-img");
    // leftDiv.appendChild(leftImg);

    // RIGHT DIV/AREA
    let rightDiv = document.getElementById("right-div");
    let TabDiv = document.createElement("div");
    TabDiv.id = "flex-container-TAB";
    let TabDivImg = document.createElement("img");
    TabDivImg.src = "./assets/frames/top-bar.webp";
    TabDivImg.classList.add("top-bar");
    TabDiv.appendChild(TabDivImg);

    let mainTable = document.createElement("div");
    mainTable.classList.add("main-table");
    mainTable.id = "main-table";

    // TABLE 1
    let table1 = document.createElement("div");
    table1.classList.add("flex-column","table-with-tooltip");
    table1.id = "table1";

    // TABLE 2
    let table2 = document.createElement("div");
    table2.classList.add("flex-container-INVENTORY","table-with-tooltip")
    table2.id = "table2";

    // TABLE 3
    let table3 = document.createElement("div");
    table3.classList.add("flex-column","flex-container-EXPEDITION","table-without-tooltip");
    table3.id = "table3";
    let table3Div = document.createElement("div");
    table3Div.id = "expedDiv";
    let table3Tooltip = document.createElement("div");
    table3Tooltip.id = "expedTooltip";
    table3Tooltip.classList = "tooltipEXPED";
    table3.append(table3Div,table3Tooltip);

    // TABLE 4
    let table4 = document.createElement("div");
    table4.classList.add("wish-counter","table-without-tooltip")
    table4.id = "table4"

    // TABLE 5
    let table5Container = document.createElement("div");
    table5Container.classList.add("table-without-tooltip");
    let table5Image = document.createElement("div");
    table5Image.classList.add("table5-Image");
    table5Image.id = 'table5-Image';

    let table5 = document.createElement("div");
    table5.classList.add("flex-container-ACHIEVEMENT");
    table5.id = "table5";
    table5Container.id = "table5-container";
    let challengeDiv = document.createElement("div");
    challengeDiv.id = "challenge-div";
    challengeDiv.style.display = "none";
    table5Container.append(table5Image,table5,challengeDiv);
    
    // TABLE 6
    let table6 = document.createElement("div");
    table6.id = "table6";

    // TABLE 7
    let table7 = document.createElement("div");
    table7.classList.add("flex-column", 'table7-bg');
    table7.id = "table7";

    // FILTER BUTTON
    let filterButton = document.createElement("div");
    filterButton.classList.add("flex-row","filter-row");
    filterButton.id = "filter-button";

    mainTable.append(table1,table2,table3,table4,table5Container,filterButton,table6,table7);

    var mainImg =  document.createElement("img");
    mainImg.classList.add("cover-all","div-img");
    mainImg.src = "./assets/bg/main-bar.webp";
    rightDiv.append(TabDiv,mainTable,mainImg);
}

function demoFunction(demoContainer,demoImg) {
    demoContainer.addEventListener("mousedown",()=>{
        demoImg.style.width = "94%";
        demoImg.style.height = "94%";
    });

    demoContainer.addEventListener("touchstart",()=>{
        demoImg.style.width = "94%";
        demoImg.style.height = "94%";
    }, { passive: true });

    window.addEventListener("mouseup",()=>{
        demoImg.style.width = "100%";
        demoImg.style.height = "100%";
    });

    window.addEventListener("touchend",()=>{
        demoImg.style.width = "100%";
        demoImg.style.height = "100%";
    });
}

function createHeroButtonContainer(heroID) {
    let heroButtonContainer = document.createElement("div");
    heroButtonContainer.id = heroID;
    heroButtonContainer.classList.add("upgrade","not-purchased");
    return heroButtonContainer;
}

function createExpedTable(expedDiv) {
    let expedTable = document.createElement("div");
    expedTable.classList.add("flex-column","tooltipTABLEEXPED");
    let expedRow1 = document.createElement("div");
    expedRow1.id = "exped-row-1";
    let expedRowImg = document.createElement("img");
    expedRowImg.src = "./assets/frames/arrow.webp";
    let expedRow2 = document.createElement("div");
    expedRow2.id = "exped-row-2";

    expedTable.append(expedRow1,expedRowImg,expedRow2)
    expedDiv.append(expedTable);
}

function createAchievement(achievementText,achievementDesc) {
    let achievementPopUpTemp = document.createElement("div");

    let achievementH1 = document.createElement("p");
    achievementH1.innerText = achievementText;
    achievementH1.classList.add("achieveH1");
    let achievementH2 = document.createElement("p");
    achievementH2.innerText = achievementDesc;
    achievementH2.classList.add("achieveH2");

    achievementPopUpTemp.append(achievementH1,achievementH2);
    achievementPopUpTemp.id = "tempAchievement";
    achievementPopUpTemp.classList.add("flex-column","achieve");
    return achievementPopUpTemp;
}

function storeAchievement(achievementText,achievementDesc,achievementID) {
    let achievementStored = document.createElement("div");
    achievementStored.classList.add("achieve-stored");
    achievementStored.id = achievementID;

    achievementID = Number(String(achievementID).slice(-3))
    let achievementImageContainer = document.createElement("div");
    achievementImageContainer.classList.add("achievementImageContainer");
    achievementImageContainer.style.background = "url(./assets/achievement/"+Math.floor(achievementID / 100) * 100+".webp)";
    achievementImageContainer.style.backgroundPosition = "center center";
    achievementImageContainer.style.backgroundSize = "contain";
    achievementImageContainer.style.backgroundRepeat = "no-repeat";

    achievementID = Number(String(achievementID).slice(-2))
    let achievementImageNumber = document.createElement("img");
    achievementImageNumber.classList.add("achievementImageNumber");
    achievementImageNumber.src = "./assets/achievement/"+achievementID+".webp";
    achievementImageContainer.append(achievementImageNumber);

    let achievementTextStored = document.createElement("div");
    let achievementStoredH1 = document.createElement("p");
    achievementStoredH1.innerText = achievementText;
    achievementStoredH1.classList.add("achieveStoredH1");
    let achievementStoredH2 = document.createElement("p");             
    achievementStoredH2.innerText = achievementDesc;                    
    achievementStoredH2.classList.add("achieveStoredH2");

    achievementTextStored.append(achievementStoredH1,achievementStoredH2);
    achievementTextStored.classList.add("flex-column","achieve-stored-text");
    achievementStored.append(achievementTextStored,achievementImageContainer);
    return achievementStored;
}

function drawMailTable(table4) {
    let mailImageContainer = document.createElement("div");
    mailImageContainer.classList.add("flex-row","wish-mail-container");
    
    let mailImageBottom = document.createElement("img");
    mailImageBottom.src = "./assets/bg/closed.webp";
    mailImageBottom.classList.add("cover-all","wish-mail");

    let mailImageTop = document.createElement("img");
    mailImageTop.src = "./assets/bg/open.webp";
    mailImageTop.id = "mailImageID";
    mailImageTop.classList.add("cover-all","wish-mail");

    let mailImageDiv = document.createElement("div");
    mailImageDiv.id = "mail-image-div";
    mailImageDiv.classList.add("wish-mail-div");
    mailImageDiv.append(mailImageBottom,mailImageTop);

    mailImageContainer.append(mailImageDiv);
    table4.append(mailImageContainer);
    return table4;
}

const patchDict = {
    "v.2-0":`
    Welcome to nahidaQuest 2.0! Please enjoy your stay!<br><br>

    <line>Major Bugs Fixed 🐞: </line><br><br>
        </indent>
        1. Flashing white box<br>
        Sometimes when switching browser tabs, there is a brief instance where a box is visible which quickly disappears.
        </indent>

    <br><br><line>New Additions 💡: </line><br><br>
        </indent>
        1. Trees! (Extended Endgame) <br>
        After getting enough Golden Cores, you can grow Trees for the purposes of stopping an outbreak. Also, the game now has an end objective as well!
        </indent>

        <br><br> 2. Bosses (Extended Endgame) <br>
        At certain thresholds, bosses will spawn in the world map. These bosses introduce unique combat mechanics and are needed to be defeated to be progress.
        </indent>

        <br><br> 3. Ascension <br>
        After getting Golden Nuts, individual characters can be ascended using Tree rewards for a higher base power and better Golden Core amounts. New base power takes effect upon the next transcension.
        </indent>

        <br><br> 4. Commisions <br>
        Unlocked at a certain Adventure Rank. By sending out Sumeru characters, commissions reward items.
        </indent>

        <br><br> 5. Challenges <br>
        Added 5 sets of 10 Challenges, with increasing difficulty per set. Completing challenges give a small boost to global NpS. Unlike Achievements, Challenges do not reset and are persistent. Complete all of them for a final reward!
        </indent>

        <br><br> 6. New Aranara events <br>
        Added 'Aranara Reveals', 'Aranara Says' and 'Aranara Snake'. Unlocked after defeating the first boss. These events randomly spawn as a (¿).
        </indent>

        <br><br> 7. Dori's Black Market <br>
        After unlocking it, palyers can buy exclusive items from Dori using drops from Trees. These items can be either visual or functional.
        </indent>

        <br><br> 8. New Characters <br>
        Updated roster to include all characters up to version 4.4.
        </indent>

    <br><br><line>Systems Rework 🌰: </line><br><br>
        </indent>
        1. Removed portrait mode <br>
        I am sorry to any mobile users who make use of potrait mode. Some of the content in this update heavily relies on a wide-aspect ratio (specifically combat) which would not work in a portrait mode. The overhead of maintaining two orientations was also becoming increasingly unmanageable, I hope you can understand. 

        <br><br> 2. Settings menu rework <br>
        Cleaned up the settings UI to accomodate additional options and to make it easier to navigate. Be sure to look through the 'Advanced' tab!
        </indent>

        <br><br> 3. Upgrades rework <br>
        You now have a choice between using gems or (nuts + talent materials) when choosing to upgrades above Lvl 50, with the exception of the Traveller who can only use gems.
        </indent>

        <br><br> 4. Information breakdown for characters and golden cores <br>
        When selecting a character, there is an additional button in the tooltips, which gives detailed stats. Similarly, at the transcend menu, the amount of golden cores now have a breakdown for the top 7 sources.
        </indent>

    <br><br>Please report any bugs and I hope you enjoy this dump of content! Many thanks. [img]
    `,
    
    "v.1-2":`
    <line>Major Bugs Fixed 🐞: </line><br><br>
        </indent>
        1. Expedition Combat<br>
        When there's text on the monster like 'Dodge' or 'Counter', it can block player input like clicking damage.
        </indent>

    <br><br><line>New Additions 💡: </line><br><br>
        </indent>
        1. Expedition Notification QOL <br>
        'Adventure Rank Rewards' and 'Bounty Claims' pop-ups direct to the Adventurer's Guild when clicked on for ease of access.
        </indent>

    <br><br><line>Systems Rework 🌰: </line><br><br>
        </indent>
        1. Expedition UI rework <br>
        The Expedition map can now be moved without clicking the image of the map itself. The zoom slider has been replaced with +/- buttons which should provide easier navigation for all devices.

        <br><br> 2. Progression adjustments <br>
        NpS and character costs have been further increased at the upper level. These changes may only be obvious near Inazuman characters. 
        <br> Note: These changes may only appear in new runs (after transcending or new saves).
        </indent>

        <br><br> 3. Transcend adjustments <br>
        Primogems no longer count towards Golden Cores after transcends. Players should be using primogems in the shop instead of hoarding them, in turn increasing the value of progressing to further levels.
        </indent>

    <br><br>Please report any bugs and stay tuned for more updates! Many thanks. [img]
    `,

    "v.1-1":`
    Note: If your save has any NaN values present, please type 'transcend' into the command console under 'Settings' and transcend from the appropriate menu. 
    Any current NaN values may result in 0 NpS. Please note that you WILL lose all of your current progress after transcending.

    <br><br><line>Major Bugs Fixed 🐞:</line><br><br>
        </indent>
        1. NaN Bug for Wish Characters <br>
        Newly spawned Wished Characters will have their appropriate NpS and can have items freely applied.

        <br><br> 2. Nahida NaN Bug <br>
        Nahida's NpS should no longer turn into NaN after applying items/upgrades.
        </indent>
    
    <br><br><line>New Additions 💡: </line><br><br>
        </indent>
        1. Map Icon QoL <br>
        Expeditions icons zoom inversely to the map's zoom level.

        <br><br> 2. Desktop keybinds <br>
        Desktop keybinds (Q,W,E) can be used during expedition combat to reduce hand strain from flicking the mouse.

        <br><br> 3. Reset map position <br>
        If your expedition map goes off-screen for whatever reason, clicking the 'reset icon' on the bottom right will recenter the map position.
        </indent>

    <br><br><line>Systems Rework 🌰: </line><br><br>
        </indent>
        1. XP Books rework <br>
        XP Books have shown to be too strong for their own good and can easily trivialize levelling up. 
        XP Books can now only be obtained as a bonus item from Expeditions or Events. 
        Furthermore, they now only provide a 50% cashback instead of a full discount.

        <br><br> 2. Progression adjustments <br>
        NpS and character costs have been increased at the upper level. Upgrade power has also been reduced to slow down progression. <br>Note: These changes may only appear in new runs (after transcending or new saves).
        </indent>

    <br><br>Please report any bugs and tell me what you feel about this update! Many thanks. [img]
    `,

    "v.1-0":`
    First Release 🎆<br>
    Thank you to all players!`,
}

function patchNotes(parent, showImgTitle = true, onlyOneOpen = false) {
    const allPatchInfos = [];
    let patchContainer = document.createElement("div");
    patchContainer.id = 'patch-container'
    patchContainer.classList.add("flex-column");

    let title = new Image();
    title.src = "./assets/settings/patchNotes.webp";
    let nahidaImg = new Image();
    nahidaImg.src = "./assets/expedbg/exped-Nahida.webp";

    for (let key in patchDict) {
        let patchButton = document.createElement("div");
        patchButton.classList.add('patch-div');
        patchButton.innerText = key;

        let patchInfo = document.createElement("p");
        patchInfo.classList.add('patch-info');
        let text = textReplacerCopy({
            '[img]':nahidaImg.outerHTML,
        },patchDict[key]);
        patchInfo.innerHTML = text;
        patchInfo.style.display = "none";

        const toggleHide = () => {
            if (onlyOneOpen) {
                allPatchInfos.forEach((ele) => {
                    if (ele !== patchInfo) {
                        if (ele.style.display === 'block') {
                            ele.style.display = 'none';
                        }
                    } else {
                        if (patchInfo.style.display === 'none') {
                            patchInfo.style.display = 'block';
                        } else {
                            patchInfo.style.display = 'none';
                        }
                    }
                })
            } else {
                if (patchInfo.style.display === 'none') {
                    patchInfo.style.display = 'block';
                } else {
                    patchInfo.style.display = 'none';
                }
            }
        }

        patchInfo.addEventListener("click", () => { toggleHide() })
        patchButton.addEventListener("click",() => { toggleHide() });

        allPatchInfos.push(patchInfo)
        patchContainer.append(patchButton,patchInfo)
    }

    if (showImgTitle) {
        parent.append(title);
    }

    return parent.append(patchContainer);
}

function finaleTutorial(persistentValues) {
    let statsText = advancedStats();
    statsText.id = 'finale-stats';
    statsText.classList.add('green-scrollbar');
    let imgDiv = createDom('div', {
        class: ['tutorial-img', 'final-img'],
        children: [statsText]
    });

    statsText.generateStats(persistentValues);

    let count = 0;
    const challengeDict = persistentValues.challengeCheck;
    for (let tier in challengeDict) {
        for (let challenge in challengeDict[tier]) {
            if (challengeDict[tier][challenge] === true) {
                count++;
            }
        }
    }

    let text = `${count}/50 Challenges Complete`;
    if (count < 50) {
        text += '<br>Try to complete all of them!';
    } else {
        text += '<br>Congratulations!';
    }

    statsText.innerHTML = `<span class='finale-title flex-row'>Game Details</span><br>` 
                        + `<span class='finale-end flex-row'>${text}</span><br>` 
                        + statsText.innerHTML;

    return imgDiv;
}

// CUSTOM TUTORIALS
const preloadTutorial = Preload();
function customTutorial(tutorialFile, maxSlide, title, exitFunction) {
    const mainBody = document.getElementById("game");  
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

    const nextButton = createDom('button', { 
        class: ['tutorial-direction-next', 'clickable'],
        event: ['click', () => {changeSlide(1)}],
        innerText: 'Next',
    });
    
    const prevButton = createDom('button', { 
        class: ['tutorial-direction-prev'],
        style: { 
            opacity: 0.2,
            pointerEvents: 'none',
         },
        event: ['click', () => {changeSlide(-1)}],
        innerText: 'Back',
    });

    const changeSlide = (change) => {
        if (currentSlide === maxSlide && change !== -1) {
            if (tutorialFile === 'finale') {
                prevButton.style.opacity = 0;
                prevButton.style.pointerEvents = 'none';

                const imgDiv = finaleTutorial(exitFunction);

                let nextButtonNew = nextButton.cloneNode(true);
                nextButton.parentNode.replaceChild(nextButtonNew, nextButton);
                tutorialScreen.replaceChild(imgDiv, tutorialImage);
                nextButtonNew.addEventListener('click', () => {
                    customTutorialDiv.remove();
                })
            } else {
                if (exitFunction) {exitFunction()};
                customTutorialDiv.remove();
            }
            return;
        }

        currentSlide = Math.max((currentSlide += change), 1);
        if (currentSlide === 1) {
            if (prevButton.style.pointerEvents !== 'none') { 
                if (prevButton.classList.contains('clickable')) {prevButton.classList.remove('clickable');}
                prevButton.style.pointerEvents = 'none';
                prevButton.style.opacity = 0.2;
            }
        } else {
            if (prevButton.style.pointerEvents === 'none') {
                prevButton.classList.add('clickable');
                prevButton.style.pointerEvents = 'unset';
                prevButton.style.opacity = 1;
            }
        }

        if (currentSlide === maxSlide) {
            nextButton.innerText = 'Finish';
        } else {
            nextButton.innerText = 'Next';
        }

        tutorialImage.src = `./assets/tutorial/${tutorialFile}-${currentSlide}.webp`;
    }

    let buttonContainer = createDom('div', { 
        class: ['flex-row', 'tutorial-button-container'],
        child: [prevButton, nextButton],
    });
    
    let tutorialScreen = createDom('div', {
        class: ["flex-column","tutorial-screen"],
        child: [createDom('p', { innerText: title, class: ['flex-row', 'tutorial-title'] }), tutorialImage, buttonContainer]
    });

    customTutorialDiv.appendChild(tutorialScreen);
    mainBody.appendChild(customTutorialDiv);
}

export { drawMainBody,demoFunction,createHeroButtonContainer,createExpedTable,createAchievement,storeAchievement,drawMailTable,buildGame,preloadMinimumArray,preloadImage,patchNotes,customTutorial }