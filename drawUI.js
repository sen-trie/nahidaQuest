// GAME GUI
function buildGame(mainBody) {
    let loadingDiv = document.createElement("div");
    loadingDiv.id = "loading";
    loadingDiv.classList.add("cover-all");
    loadingDiv.classList.add("flex-row");
    loadingDiv.classList.add("overlay");
    let loadingGif = document.createElement("img");
    loadingGif.src = "./assets/loading.webp";
    loadingGif.alt = "Nahida Quest Loading Screen";
    loadingGif.classList.add("overlay-tutorial");
    loadingDiv.appendChild(loadingGif);

    let leftDiv = document.createElement("div");
    leftDiv.classList.add("flex-column");
    leftDiv.id = "left-div";
    leftDiv.classList.add("left-area");
    let scoreDiv = document.createElement("div");
    scoreDiv.classList.add("score-container");
    scoreDiv.innerHTML = "<span id='score'>0</span><span id='dps'>0</span>"
    let demoContainer = document.createElement("div");
    demoContainer.id = "demo-container";
    leftDiv.append(scoreDiv,demoContainer)

    let midDiv = document.createElement("div");
    midDiv.id = "mid-div";
    midDiv.classList.add("middle-area");
    let midDivImg = document.createElement("img");
    midDivImg.src = "./assets/frames/bar.webp";
    midDivImg.alt = "Middle of the Screen";
    midDivImg.classList.add("middle-bar");

    let energyPrimoContainer = document.createElement("div");
    energyPrimoContainer.classList.add("flex-column");
    energyPrimoContainer.classList.add("energy-primo-container");
    let energyContainer = document.createElement("div");
    energyContainer.classList.add("pill-value");
    energyContainer.innerHTML = "<img class='pill' alt='' src='./assets/frames/pill.webp'><img class='icon' alt='Energy Icon' src='./assets/icon/energyIcon.webp'><span id='energy'>0</span>";
    let primoContainer = document.createElement("div");
    primoContainer.classList.add("pill-value");
    primoContainer.innerHTML = `<img class="pill" alt="" src="./assets/frames/pill.webp"><img class="primogem icon" alt="Primogem Icon" src="./assets/icon/primogemIcon.webp"><span id="primogem">0</span>`;
    energyPrimoContainer.append(energyContainer,primoContainer)

    let tempBuffDiv = document.createElement("div");
    tempBuffDiv.classList.add("temp-buff");
    let appOne = document.createElement("div");
    appOne.id = "app1";
    let appTwo = document.createElement("div");
    appTwo.id = "app2";
    tempBuffDiv.append(appOne,appTwo);
    midDiv.append(midDivImg,energyPrimoContainer,tempBuffDiv)

    let rightDiv = document.createElement("div");
    rightDiv.id = "right-div";
    rightDiv.classList.add("right-area");

    mainBody.append(loadingDiv,leftDiv,midDiv,rightDiv);
    return mainBody;
}

// MAIN BODY GUI
function drawMainBody() {
    // LEFT DIV/AREA
    var leftDiv = document.getElementById("left-div");
    var leftImg =  document.createElement("img");
    leftImg.src = "./assets/bg/bg.webp";
    leftImg.classList.add("cover-all");
    leftImg.classList.add("div-img");
    leftDiv.appendChild(leftImg);

    // RIGHT DIV/AREA
    var rightDiv = document.getElementById("right-div");
    let TabDiv = document.createElement("div");
    TabDiv.id = "flex-container-TAB";
    let TabDivImg = document.createElement("img");
    TabDivImg.src = "./assets/frames/top-bar.webp";
    TabDivImg.classList.add("top-bar")
    TabDiv.appendChild(TabDivImg);

    let mainTable = document.createElement("div");
    mainTable.classList.add("main-table")

    // TABLE 1
    let table1 = document.createElement("div");
    table1.classList.add("flex-column");
    table1.classList.add("table-with-tooltip");
    table1.id = "table1";

    // TABLE 2
    let table2 = document.createElement("div");
    table2.classList += (" flex-container-INVENTORY table-with-tooltip")
    table2.id = "table2";

    // TABLE 3
    let table3 = document.createElement("div");
    table3.classList += (" flex-column flex-container-EXPEDITION table-without-tooltip");
    table3.id = "table3";
    let table3Div = document.createElement("div");
    table3Div.id = "expedDiv";
    let table3Tooltip = document.createElement("div");
    table3Tooltip.id = "expedTooltip";
    table3Tooltip.classList = "tooltipEXPED";
    table3.append(table3Div,table3Tooltip);

    // TABLE 4
    let table4 = document.createElement("div");
    table4.classList += (" wish-counter table-without-tooltip")
    table4.id = "table4"

    // TABLE 5
    let table5Container = document.createElement("div");
    table5Container.classList += (" table-without-tooltip");
    let table5Image = document.createElement("div");
    table5Image.classList += (" table5-Image");

    let table5 = document.createElement("div");
    table5.classList += (" flex-container-ACHIEVEMENT");
    table5.id = "table5";
    table5Container.id = "table5-container";
    table5Container.append(table5Image,table5);
    
    // TABLE 6
    let table6 = document.createElement("div");
    table6.id = "table6";

    // TABLE 7
    let table7 = document.createElement("div");
    table7.classList.add("flex-column")
    table7.id = "table7";

    // FILTER BUTTON
    let filterButton = document.createElement("div");
    filterButton.classList.add("flex-row");
    filterButton.classList.add("filter-row");
    filterButton.id = "filter-button";

    mainTable.append(table1,table2,table3,table4,table5Container,filterButton,table6,table7);

    var mainImg =  document.createElement("img");
    mainImg.classList.add("cover-all");
    mainImg.classList.add("div-img");
    mainImg.src = "./assets/bg/main-bar.webp";
    rightDiv.append(TabDiv,mainTable,mainImg);
}

function demoFunction(demoContainer,demoImg) {
    demoContainer.onmousedown = function() {
        demoImg.style.width = "94%";
        demoImg.style.height = "94%";
    }
    
    window.onmouseup = function () {
        demoImg.style.width = "100%";
        demoImg.style.height = "100%";
    };
}

function createHeroButtonContainer(heroID) {
    let heroButtonContainer = document.createElement("div");

    heroButtonContainer.id = heroID;
    heroButtonContainer.classList.add("upgrade");
    heroButtonContainer.classList.add("not-purchased");
    return heroButtonContainer;
}

function createExpedTable(expedDiv) {
    let expedTableImg = document.createElement("img");
    expedTableImg.classList.add("cover-all");
    expedTableImg.classList.add("exped-table-img")
    expedTableImg.src = "./assets/frames/tooltipEXPED.webp";

    let expedTable = document.createElement("div");
    expedTable.classList += "flex-column tooltipTABLEEXPED";
    let expedRow1 = document.createElement("div");
    expedRow1.id = "exped-row-1";
    let expedRowImg = document.createElement("img");
    expedRowImg.src = "./assets/frames/arrow.webp";
    let expedRow2 = document.createElement("div");
    expedRow2.id = "exped-row-2";

    expedTable.append(expedRow1,expedRowImg,expedRow2)
    expedDiv.append(expedTableImg,expedTable);
}

function createAchievement(achievementText,achievementDesc) {
    let achievementPopUpTemp = document.createElement("div");

    let achievementH1 = document.createElement("p");
    achievementH1.innerText = achievementText;
    achievementH1.classList += " achieveH1";
    let achievementH2 = document.createElement("p");
    achievementH2.innerText = achievementDesc;
    achievementH2.classList += " achieveH2";

    achievementPopUpTemp.append(achievementH1,achievementH2);
    achievementPopUpTemp.id = "tempAchievement";
    achievementPopUpTemp.classList += " flex-column achieve";
    return achievementPopUpTemp;
}

function storeAchievement(achievementText,achievementDesc,achievementID) {
    let achievementStored = document.createElement("div");
    achievementStored.classList += " achieve-stored";
    achievementStored.id = achievementID;

    achievementID = Number(String(achievementID).slice(-3))
    let achievementImageContainer = document.createElement("div");
    achievementImageContainer.classList.add("achievementImageContainer");
    achievementImageContainer.style.background = "url(./assets/achievement/"+Math.floor(achievementID / 100) * 100+".webp)";
    achievementImageContainer.style.backgroundPosition = "center center"
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
    achievementStoredH1.classList += " achieveStoredH1";
    let achievementStoredH2 = document.createElement("p");             
    achievementStoredH2.innerText = achievementDesc;                    
    achievementStoredH2.classList += " achieveStoredH2";

    achievementTextStored.append(achievementStoredH1,achievementStoredH2);
    achievementTextStored.classList += " flex-column achieve-stored-text";
    achievementStored.append(achievementTextStored,achievementImageContainer);
    return achievementStored;
}

function drawMailTable(table4) {
    let mailImageContainer = document.createElement("div");
    mailImageContainer.classList.add("flex-row");
    mailImageContainer.classList.add("wish-mail-container");
    
    let mailImageBottom = document.createElement("img");
    mailImageBottom.src = "./assets/bg/closed.webp";
    mailImageBottom.classList.add("cover-all");
    mailImageBottom.classList.add("wish-mail");

    let mailImageTop = document.createElement("img");
    mailImageTop.src = "./assets/bg/open.webp";
    mailImageTop.id = "mailImageID";
    mailImageTop.classList.add("cover-all");
    mailImageTop.classList.add("wish-mail");

    let mailImageDiv = document.createElement("div");
    mailImageDiv.id = "mail-image-div";
    mailImageDiv.classList.add("wish-mail-div");
    mailImageDiv.append(mailImageBottom,mailImageTop);

    mailImageContainer.append(mailImageDiv);
    table4.append(mailImageContainer);
    return table4;
}

function preloadFoldersPriority() {
    let filePath = "./assets/";
    let ArrayPath = ["bg/","tutorial/"];
    let Array = [["achievementBG","bg","closed","dori-back","left","main-bar","middle","open","right","wish-bg","wood"],
                 ["buttonBox","eventPill","tut-button","unlockExp-3","unlockExp-4","unlockExp-5"],
    ];
    for (let i=0; i<Array.length; i++) {
        for (let innerElement of Array[i]) {
            let img = new Image();
            img.src = filePath + ArrayPath[i] + innerElement + ".webp";
        }
    }
}

function preloadFolders(upgradeInfo) {
    let filePath = "./assets/";
    // SCUFFED SOLUTION AS ACCESSING FILES DOESNT WORK ON CLIENT SIDE
    for (let key in upgradeInfo) {
        let upgradeName = upgradeInfo[key].Name;
        let imgOne = new Image();
        imgOne.src = filePath + "nameplates/" + upgradeName + ".webp";
        let imgTwo = new Image();
        imgTwo.src = filePath + "tooltips/hero/" + upgradeName + ".webp";
    }

    let ArrayPath = ["frames/","tooltips/elements/","event/","icon/",];
    let Array = [["achievement","achievement-temp","button","dori-deals","wishButton","tooltipEXPED","bar","top-bar","arrow"],
                 ["Anemo","Any","Artifact","Bow","Catalyst","Claymore","Cryo","Dendro","Electro","Food","Gemstone","Geo","Hydro","Level","Polearm","Pyro","Sword","Talent"],
                 ["clock-arrow","clock-back","clock-top","mineEventBG","mine-flag","mine-info","mine-unclicked","mine-wrong","timer-sand","mine-empty","weasel-back","timer-bar"],
                 ["food1","food2","goldenNut","nut","primogemLarge","scarab","shop-start","verybad-1","verygood-3","event-easy","event-hard"],        
    ];

    for (let i=0; i < Array.length; i++) {
        for (let innerElement of Array[i]) {
            let img = new Image();
            img.src = filePath + ArrayPath[i] + innerElement + ".webp";
        }
    }

    let sevenArray = ["expedbg/exped","frames/background-","frames/rarity-","tutorial/aranara-"];
    for (let element of sevenArray) {
        preloadImage(7,element);
    }

    let eightArray = ["icon/box-","icon/good-"];
    for (let element of eightArray) {
        preloadImage(8,element);
    }

    let m = 0;
    while (m < 5) {
        let imgOne = new Image();
        imgOne.src = filePath + "achievement/" + (m * 100) + ".webp";
        m++;
    }

    preloadImage(4,"event/whopperflower-");
    preloadImage(5,"icon/bad-");
    preloadImage(5,"tutorial/tut-");
    preloadImage(10,"event/weasel-");
    preloadImage(21,"achievement/");

    let img = new Image();
    img.src = filePath + "loading.webp";
    let imgTwo = new Image();
    imgTwo.src = filePath + "/expedbg/exped-button.webp";
}

function preloadImage(max,path) {
    let filePath = "./assets/";
    let i = 1;
    while (i < max) {
        let img = new Image();
        img.src = filePath + path + i + ".webp";
        i++;
    }
}

export { drawMainBody,demoFunction,createHeroButtonContainer,createExpedTable,createAchievement,storeAchievement,drawMailTable,buildGame,preloadFolders,preloadFoldersPriority }