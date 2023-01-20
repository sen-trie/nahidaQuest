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

    function mouseOver() {
        demo.style.width = "98%";
        demo.style.height = "98%";
        demo.style["margin-top"] = '1%';
        demo.style["margin-left"] = '1%';
    }

    demo.onmouseover = function () {
        mouseOver();
    };
    
    demo.onmouseup = function () {
        mouseOver()
    };

    demo.onmouseout = function() {
        demo.style.width = "95%";
        demo.style.height = "95%";
        demo.style["margin-top"] = '2.5%';
        demo.style["margin-left"] = '2.5%';
    }
}

function createHeroButtonContainer(heroID,heroText) {
    let heroButtonContainer = document.createElement("div");
    
    heroButtonContainer.id = heroID;
    heroButtonContainer.innerText = heroText;
    heroButtonContainer.style.background = "url(./assets/button-3.png)";
    heroButtonContainer.classList += "upgrade";

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
                
export { drawMainBody,demoFunction,createHeroButtonContainer,createExpedTable }