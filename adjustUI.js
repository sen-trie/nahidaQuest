// ADD TO INVENTORY BUTTON ADJUST
function inventoryAddButton(buttonInv, Item) {
    buttonInv.classList += "inventoryButton";
    buttonInv.style.background = "url(./assets/frames/rarity-" + Item.Star + ".webp)";
    buttonInv.style["background-repeat"] = "no-repeat";
    buttonInv.style["background-size"] = "118px 144px";

    let buttonInvStar = document.createElement("img");
    buttonInvStar.src = "./assets/frames/star-" + Item.Star + ".webp";
    buttonInvStar.classList.add("button-inv-star");

    let buttonInvItem = document.createElement("img");
    buttonInvItem.src = "./assets/tooltips/inventory/" + Item.Name + ".webp";
    buttonInvItem.classList.add("button-inv-item");

    buttonInv.append(buttonInvItem,buttonInvStar);

    return buttonInv;
}

// ADJUSTS EXPED BUTTON FOR EXPEDITION UI
function expedButtonAdjust(expedButton, backgroundImg, i) {
    expedButton.id = "exped-" + i;
    expedButton.style.background = backgroundImg;
    expedButton.style['background-repeat'] = "no-repeat";
    expedButton.style['background-size'] = "93%"
    expedButton.classList += "expedition";
    return expedButton;
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
    volumeScroller.type = "range";
    volumeScroller.min = "0";
    volumeScroller.max = "100";
    volumeScroller.id = "volume-scroller";
    return volumeScroller;
}

export {inventoryAddButton,expedButtonAdjust,dimMultiplierButton,volumeScrollerAdjust};