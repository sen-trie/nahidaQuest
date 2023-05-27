const filePath = "./assets/";
const uniqueFileArray = {
    "bg/":["achievementBG","bg","closed","dori-back","left","main-bar","middle","nutShop","nutShopInterior","open","right","wish-bg","wood"],
    "tutorial/":["buttonBox","eventPill","tut-button","idle","unlockExp-3","unlockExp-4","unlockExp-5","exped-button"],
    "frames/":["achievement","achievement-temp","button","dori-deals","wishButton","tooltipEXPED","bar","top-bar","arrow"],
    "tooltips/elements/":["Anemo","Any","Artifact","Bow","Catalyst","Claymore","Cryo","Dendro","Electro","Food","Gemstone","Geo","Hydro","Level","Polearm","Pyro","Sword","Talent"],
    "event/":["clock-arrow","clock-back","clock-top","mineEventBG","mine-flag","mine-info","mine-unclicked","mine-wrong","timer-sand","mine-empty","weasel-back","timer-bar"],
    "icon/":["food1","food2","goldenNut","nut","primogemLarge","scarab","shop-start","event-easy","event-hard"],
    "expedbg/":["break","counter","crit","dodge"]
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
    let leftImg = document.createElement("img");
    leftImg.src = "./assets/bg/bg.webp";
    leftImg.id = "left-bg";
    leftImg.classList.add("cover-all","div-img");
    leftDiv.appendChild(leftImg);

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
    table5Container.append(table5Image,table5);
    
    // TABLE 6
    let table6 = document.createElement("div");
    table6.id = "table6";

    // TABLE 7
    let table7 = document.createElement("div");
    table7.classList.add("flex-column");
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
    "Update: v.1-2 (27/5/23)":`
    <line>Bugs Fixed 🐞: </line><br><br>
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
        The Expedition map can now be moved without clicking the image of the map itself. The zoom slider has been replaced with +/- buttons which should be provide easier navigation for all devices.

        <br><br> 2. Progression adjustments <br>
        NpS and character costs have been further increased at the upper level. These changes may only be obvious near Inazuman characters. 
        <br> Note: These changes may only appear in new runs (after transcending or new saves).
        </indent>

        <br><br> 3. Transcend adjustments <br>
        Primogems no longer count towards Golden Cores after transcends. Players should be using primogems in the shop instead of hoarding them, in turn increasing the value of progressing to further levels.
        </indent>

    <br><br>Please report any bugs and stay tuned for more updates! Many thanks. [img]
    `,

    "Update: v.1-1 (15/5/23)":`
    Note: If your save has any NaN values present, please type 'transcend' into the command console under 'Settings' and transcend from the appropriate menu. Any current NaN values may result in 0 NpS. <br><br>
    Please note that you WILL lose all of your current progress after transcending.

    <br><br><line>Bugs Fixed 🐞:</line><br><br>
        <indent>
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

    "Update: v.1-0 (6/5/23)":`
    First Release 🎆<br>
    Thank you to all players!`,
}

function patchNotes(parent,textReplacer) {
    let title = new Image();
    title.src = "./assets/settings/patchNotes.webp";


    let patchContainer = document.createElement("div");
    patchContainer.classList.add("flex-column");

    let nahidaImg = new Image();
    nahidaImg.src = "./assets/expedbg/exped-Nahida.webp";

    for (let key in patchDict) {
        let patchButton = document.createElement("div");
        patchButton.innerText = key;

        let patchInfo = document.createElement("p");
        let text = textReplacer({
            '[img]':nahidaImg.outerHTML,
        },patchDict[key]);
        patchInfo.innerHTML = text;
        patchInfo.style.display = "none";

        patchButton.addEventListener("click",()=>{
            if (patchInfo.style.display === 'none') {
                patchInfo.style.display = 'block';
              } else {
                patchInfo.style.display = 'none';
              }
        })

        patchContainer.append(patchButton,patchInfo)
    }


    return parent.append(title,patchContainer);

}

export { drawMainBody,demoFunction,createHeroButtonContainer,createExpedTable,createAchievement,storeAchievement,drawMailTable,buildGame,preloadMinimumArray,preloadImage,patchNotes }