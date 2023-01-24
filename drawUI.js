// MAIN BODY GUI
function drawMainBody() {
    var para1 = document.getElementById("para");

    var leftImg =  document.createElement("img");
    leftImg.src = "./assets/bg-1.png";
    leftImg.style = "position: absolute; left:-8px; top: -17px; width: 630px; height: 870px;";
    para1.appendChild(leftImg);

    var barImg =  document.createElement("img");
    barImg.src = "./assets/bar.jpg";
    barImg.style = "position: absolute; left: 600px; top: -16px; width: 95px; height: 870px;";
    para1.appendChild(barImg);

    var topImg =  document.createElement("img");
    topImg.src = "./assets/top-bar.png";
    topImg.style = "position: absolute; left: 695px; top: -16px; width: 969px; height: 106px;";
    para1.appendChild(topImg);

    var mainImg =  document.createElement("img");
    mainImg.src = "./assets/main-bar.png";
    mainImg.style = "position: absolute; left: 695px; top: 90px; width: 970px; height: 765px;";
    para1.appendChild(mainImg);

    mainImg.src = "./assets/main-bar.png";
    mainImg.style = "position: absolute; left: 695px; top: 90px; width: 970px; height: 765px;";
    para1.appendChild(mainImg);

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
    expedTable.id = "expedTableID"

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
    achievementH1.classList += "achieveH1"
    let achievementH2 = document.createElement("h3");
    achievementH2.innerText = achievementDesc;
    achievementH2.classList += "achieveH2"

    achievementPopUpTemp.appendChild(achievementH1);
    achievementPopUpTemp.appendChild(achievementH2);
    achievementPopUpTemp.id = "tempAchievement"
    achievementPopUpTemp.classList += "achieve"

    return achievementPopUpTemp;
}

function storeAchievement(achievementText,achievementDesc,achievementID) {
    let achievementStored = document.createElement("button");
    let achievementStoredH1 = document.createElement("h2");
    achievementStoredH1.innerText = achievementText;
    achievementStoredH1.classList += "achieveStoredH1"
    let achievementStoredH2 = document.createElement("h3");              // MAKE THE BACKGROUND IMAGE SUMERU TALENT
    achievementStoredH2.innerText = achievementDesc;                     // HAVE THE MIDDLE PART INFINITELY EXTEND
    achievementStoredH2.classList += "achieveStoredH2"

    achievementStored.appendChild(achievementStoredH1);
    achievementStored.appendChild(achievementStoredH2);
    achievementStored.classList += "achieve-stored"
    achievementStored.id = achievementID;

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