// ADD TO INVENTORY BUTTON ADJUST
function inventoryAddButton(buttonInv, Item) {
    let buttonInvFrame = document.createElement("img");
    buttonInvFrame.src = "./assets/frames/rarity-" + Item.Star + ".webp";
    buttonInvFrame.classList.add("button-inv-frame");

    let buttonInvStarDiv = document.createElement("div");
    buttonInvStarDiv.classList.add("button-inv-stardiv");
    let buttonInvStar = document.createElement("img");
    buttonInvStar.src = "./assets/frames/star-" + Item.Star + ".webp";
    buttonInvStar.classList.add("button-inv-star");
    buttonInvStarDiv.appendChild(buttonInvStar)

    let buttonInvItem = document.createElement("img");
    buttonInvItem.src = "./assets/tooltips/inventory/" + Item.File + ".webp";
    buttonInvItem.classList.add("button-inv-item");

    buttonInv.append(buttonInvFrame,buttonInvItem,buttonInvStarDiv);
    return buttonInv;
}

// ADDS FLOATING TEXT UPON CLICKING ON DEMO BUTTON
function floatText(clickType,combineText,leftDiv,clickFactor,Xlocation,Ylocation,abbrNum,clickerEvent) {
    let clickCountAppear = document.createElement("div");
    if (clickType === "crit") {
        if (document.getElementById("crit-text")) {
            let oldNumberText = document.getElementById("crit-text");
            let oldValue = oldNumberText.nutValue + clickFactor;
            oldNumberText.innerText = `+${abbrNum(oldValue,2,true)}`;

            if (clickerEvent === "scara") {
                oldNumberText.style.color = "#0c1327";
            } else {
                oldNumberText.style.color = "#022107"
            }

            let newNumberText = oldNumberText.cloneNode(true);
            oldNumberText.parentNode.replaceChild(newNumberText, oldNumberText);
            newNumberText.nutValue = oldValue;
            newNumberText.addEventListener('animationend', ()=>{newNumberText.remove()});
        } else {
            clickCountAppear.classList.add("floatingCritText");
            clickCountAppear.id = "crit-text";
            clickCountAppear.nutValue = clickFactor;
            clickCountAppear.innerText = "+" + abbrNum(clickFactor,2,true);
        }
    } if (clickType === "normal") {
        if (combineText) {
            if (document.getElementById("float-text")) {
                let oldNumberText = document.getElementById("float-text");
                let oldValue = oldNumberText.nutValue + clickFactor;
                oldNumberText.innerText = `+${abbrNum(oldValue,2,true)}`;

                if (clickerEvent === "scara") {
                    oldNumberText.style.color = "#0c1327";
                } else {
                    oldNumberText.style.color = "#022107"
                }

                let newNumberText = oldNumberText.cloneNode(true);
                oldNumberText.parentNode.replaceChild(newNumberText, oldNumberText);
                newNumberText.nutValue = oldValue;
                newNumberText.addEventListener('animationend', ()=>{newNumberText.remove()});
            } else {
                clickCountAppear.classList.add("floatingTextLow");
                clickCountAppear.id = "float-text";
                clickCountAppear.nutValue = clickFactor;
                clickCountAppear.innerText = "+" + abbrNum(clickFactor,2,true);
            }
        } else {
            clickCountAppear.classList.add("floatingText");
            clickCountAppear.innerText = "+" + abbrNum(clickFactor,2,true);
        }
    }

    if (clickerEvent === "scara") {
        clickCountAppear.style.color = "#0c1327";
    }

    clickCountAppear.style.position = "absolute";
    clickCountAppear.style.left = Xlocation + "%";
    clickCountAppear.style.top = Ylocation + "%";
    clickCountAppear.addEventListener('animationend', ()=>{clickCountAppear.remove()});
    leftDiv.appendChild(clickCountAppear);
    return leftDiv;
}

// ADJUSTS EXPED BUTTON FOR EXPEDITION UI
function expedButtonAdjust(expedButton, backgroundImg, i) {
    expedButton.id = "exped-" + i;
    expedButton.style.backgroundImage = backgroundImg;
    expedButton.classList += " expedition";
    return expedButton;
}

// ADJUSTS IMAGES FOR MULTIPLIER BUTTONS
function multiplierButtonAdjust(multiplierButton, int) {
    multiplierButton.id = "multiplierButton-" + int;
    multiplierButton.classList.add("multiplier-button");

    let multiplierButtonImg = document.createElement("img");
    multiplierButtonImg.src = "./assets/settings/multi-"+int+".webp";
    multiplierButtonImg.classList.add("multiplier-button-img");
    multiplierButton.appendChild(multiplierButtonImg)
    return multiplierButton;
}


// ADJUSTS DIM LEVELS FOR x10,x25,x100 BUTTONS
function dimMultiplierButton(int,currentDimMultiplier) {
    if (currentDimMultiplier === int) {
        let buttonDimmed = document.getElementById("multiplierButton-" + int);
        buttonDimmed.classList.remove("dim-filter");
        currentDimMultiplier = 0;
    } else if (currentDimMultiplier === 0) {
        let buttonDimmed = document.getElementById("multiplierButton-" + int);
        buttonDimmed.classList.add("dim-filter");
        currentDimMultiplier = int;
    } else {
        let buttonUndimmed = document.getElementById("multiplierButton-" + currentDimMultiplier);
        buttonUndimmed.classList.remove("dim-filter");
        
        let buttonDimmed = document.getElementById("multiplierButton-" + int);
        buttonDimmed.classList.add("dim-filter");
        currentDimMultiplier = int;
    }
    return currentDimMultiplier;
}

// ADJUST SETTINGS VOLUME 
function volumeScrollerAdjust(volumeScroller) {
    volumeScroller.x = "100";
    return volumeScroller;
}

// CREATES A FRAME OF AN INVENTORY ITEM
function inventoryFrame(ele,itemInfo,itemFrameColors) {
    ele.classList.add("flex-column","item-frame");
    ele.style.backgroundImage = `url(./assets/frames/background-${itemInfo.Star}.webp)`;
    ele.style.border = `0.15em solid ${itemFrameColors[itemInfo.Star-1]}`;

    let lootImg = new Image();
    lootImg.classList.add("cover-all");
    lootImg.src = `./assets/tooltips/inventory/${itemInfo.File}.webp`;
    let lootStar = new Image();
    lootStar.src = `./assets/frames/star-${itemInfo.Star}.webp`;
    ele.append(lootImg,lootStar);

    return ele;
}

export { inventoryAddButton,expedButtonAdjust,dimMultiplierButton,volumeScrollerAdjust,floatText,multiplierButtonAdjust,inventoryFrame };