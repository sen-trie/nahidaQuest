// MAIN BODY GUI
function drawMainBody() {
    var para1 = document.getElementById("para");
    var rightDiv = document.getElementById("right-div");
    var leftDiv = document.getElementById("left-div");

    var leftImg =  document.createElement("img");
    leftImg.src = "./assets/bg.png";
    leftImg.classList.add("div-img");
    leftDiv.appendChild(leftImg);

    // var topRightDiv = document.createElement("div");
    // topRightDiv.id = "flex-container-TAB";
    // var topImg =  document.createElement("img");
    // topImg.src = "./assets/top-bar.png";
    // topImg.classList.add("top-bar");

    // // var mainBodyRight = document.createElement("div");
    // // mainBodyRight.id = "table-container" mainBodyRight
    // // topRightDiv.append(topImg)
    // rightDiv.insertBefore(topRightDiv,rightDiv.firstChild);

    var mainImg =  document.createElement("img");
    mainImg.classList.add("div-img");
    mainImg.src = "./assets/main-bar.png";
    rightDiv.appendChild(mainImg);

    var expedDiv = document.getElementById("expedDiv");
    expedDiv.classList = "tooltipEXPED";
    expedDiv.id = "expedDivID";
}

function demoFunction() {
    demo.onmousedown = function() {
        demo.style.width = "92%";
        demo.style.height = "92%";
        demo.style["margin-top"] = '4%';
        demo.style["margin-left"] = '4%';
    }
    
    demo.onmouseup = function () {
        demo.style.width = "98%";
        demo.style.height = "98%";
        demo.style["margin-top"] = '1%';
        demo.style["margin-left"] = '1%';
    };
}

function createHeroButtonContainer(heroID,heroText) {
    let heroButtonContainer = document.createElement("button");
    
    heroButtonContainer.id = heroID;
    heroButtonContainer.innerText = heroText;
    heroButtonContainer.classList += "upgrade";
    heroButtonContainer.style.background = "url(./assets/button.webp)";
    heroButtonContainer.style["background-position"] = "center";
    heroButtonContainer.style["background-size"] = "cover";

    return heroButtonContainer;
}

function createExpedTable(expedDiv) {
    let expedTable = document.createElement("table");
    expedTable.classList = "tooltipTABLEEXPED";
    expedTable.id = "expedTableID";

    let expedRow = expedTable.insertRow(0);
    expedRow.style.height = "110px";
    let expedCell2 = expedRow.insertCell(0);
    expedCell2.classList += "exped-cell-two"

    let expedRow2 = expedTable.insertRow(0);
    expedRow2.style.height = "80px";
    let expedCell1 = expedRow2.insertCell(0);
    expedCell1.classList += "exped-cell-one"

    expedDiv.appendChild(expedTable);
}

function createAchievement(achievementText,achievementDesc) {
    let achievementPopUpTemp = document.createElement("p");

    let achievementH1 = document.createElement("h2");
    achievementH1.innerText = achievementText;
    achievementH1.classList += "achieveH1";
    let achievementH2 = document.createElement("h3");
    achievementH2.innerText = achievementDesc;
    achievementH2.classList += "achieveH2";

    achievementPopUpTemp.appendChild(achievementH1);
    achievementPopUpTemp.appendChild(achievementH2);
    achievementPopUpTemp.id = "tempAchievement";
    achievementPopUpTemp.classList += "achieve";

    return achievementPopUpTemp;
}

function storeAchievement(achievementText,achievementDesc,achievementID) {
    let achievementStored = document.createElement("div");
    achievementStored.classList += "achieve-stored";
    achievementStored.id = achievementID;

    achievementID = Number(String(achievementID).slice(-3))
    let achievementImageContainer = document.createElement("div");
    achievementImageContainer.classList.add("achievementImageContainer");
    achievementImageContainer.style.background = "url(./assets/achievement/"+Math.floor(achievementID / 100) * 100+".webp)";
    achievementImageContainer.style.backgroundSize = "contain";

    achievementID = Number(String(achievementID).slice(-2))
    let achievementImageNumber = document.createElement("img");
    achievementImageNumber.classList.add("achievementImageNumber");
    achievementImageNumber.src = "./assets/achievement/"+achievementID+".webp";
    achievementImageContainer.append(achievementImageNumber);

    let achievementTextStored = document.createElement("div");
    let achievementStoredH1 = document.createElement("p");
    achievementStoredH1.innerText = achievementText;
    achievementStoredH1.classList += "achieveStoredH1";
    let achievementStoredH2 = document.createElement("p");              // MAKE THE BACKGROUND IMAGE SUMERU TALENT
    achievementStoredH2.innerText = achievementDesc;                     // HAVE THE MIDDLE PART INFINITELY EXTEND
    achievementStoredH2.classList += "achieveStoredH2";

    achievementTextStored.append(achievementStoredH1,achievementStoredH2);
    achievementTextStored.classList += "achieve-stored-text";

    achievementStored.append(achievementTextStored,achievementImageContainer);
    
    return achievementStored;
}

function drawMailTable(table4) {
    let mailImageContainer = document.createElement("div");
    mailImageContainer.classList.add("wish-mail-container");
    
    let mailImageBottom = document.createElement("img");
    mailImageBottom.src = "./assets/closed.png";
    mailImageBottom.classList.add("wish-mail");

    let mailImageTop = document.createElement("img");
    mailImageTop.src = "./assets/open.png";
    mailImageTop.id = "mailImageID";
    mailImageTop.classList.add("wish-mail");

    mailImageContainer.append(mailImageBottom,mailImageTop);
    table4.append(mailImageContainer);
    return table4;
}

export { drawMainBody,demoFunction,createHeroButtonContainer,createExpedTable,createAchievement,storeAchievement,drawMailTable }