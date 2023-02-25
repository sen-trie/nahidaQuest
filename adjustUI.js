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
function floatText(demoContainer,clickFactor,randNum1,randNum2) {
    let clickCountAppear = document.createElement("div");

    clickCountAppear.innerHTML = "+" + clickFactor;
    clickCountAppear.classList.add("floatingText");
    clickCountAppear.style.position = "absolute";
    clickCountAppear.style.left = randNum1 + "%";
    clickCountAppear.style.top = randNum2 + "%";
    clickCountAppear.addEventListener('animationend', () => {clickCountAppear.remove();});

    demoContainer.appendChild(clickCountAppear);
    return demoContainer;
}

// ADJUSTS EXPED BUTTON FOR EXPEDITION UI
function expedButtonAdjust(expedButton, backgroundImg, i) {
    expedButton.id = "exped-" + i;
    expedButton.style.background = backgroundImg;
    expedButton.style['background-repeat'] = "no-repeat";
    expedButton.style['background-size'] = "contain"
    expedButton.style['background-position'] = "center";
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

export {inventoryAddButton,expedButtonAdjust,dimMultiplierButton,volumeScrollerAdjust,floatText,multiplierButtonAdjust};