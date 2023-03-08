// ABBREVIATES NUMBERS TO SHORTER FORM
function abbrNum(number,digits,short) {
    let decPlaces = Math.pow(10, 3);
    let abbrev = [""," Million"," Billion"," Trillion"," Quadrillion"," Quintillion"," Sextillion"," Septillion", " Octillion", " Nonillion", " Decillion", " Undecillion", " Duodecillion"];
    let abbrevShort = [""," M"," Bi"," T"," q"," Q"," s"," S", " O", " N", " d", " U", " D"];

    if (digits === 2) {
        decPlaces = Math.pow(10, 2);
    }

    if (number > 1e6) {
        for (let i = abbrev.length - 1; i >= 0; i--) {
                let size = Math.pow(10, (i + 1) * 3);
                if (size <= number) {
                    number = Math.round((number * decPlaces) / size) / decPlaces;
                    if (number == 1000 && i < abbrev.length - 1) {
                            number = 1;
                            i++;
                    }
                    if (short === true) {
                        number += abbrevShort[i];
                    } else {
                        number += abbrev[i];
                    }
                    
                    break;
            }
        }
        return number;
    } else {
        number = Math.round(number);
        return number;
    }
};

// GET HIGHEST KEY IN AN OBJECT
function getHighestKey(obj) {
    var highestValue = 0;
    obj = Object.keys(obj)
    for (const key of Object.keys(obj)) {
        if (parseInt(obj[key]) > highestValue) {
            highestValue = obj[key];
        }
    }
    return parseInt(highestValue);
}

// RANDOM NUMBER GENERATOR (DOES NOT INCLUDE MAX)
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

// GENERATE BASE ATK AND COSTS OF NON-WISH HEROES (IF SAVE NOT FOUND)
function generateHeroPrices(upgradeDict, NONWISHHEROMAX) {
    let initBaseCost = 50;
    let multiplierBaseCost = 3;
    let initATKCost = 1;
    let multiplierATKCost = 1.5;

    for (let i = 1; i < NONWISHHEROMAX + 1; i++) {
        let baseCost = Math.round(initBaseCost * (multiplierBaseCost ** ((i-1)*1.25)));
        let baseLevel = Math.round(0.75 * baseCost);
        upgradeDict[i]["BaseCost"] = Number(baseCost.toPrecision(3));
        upgradeDict[i]["Level"] = baseLevel;
        
        let baseATK = Math.round(initATKCost * (multiplierATKCost **((i-1)*3.2)));
        upgradeDict[i]["Factor"] = Number(baseATK.toPrecision(3));
        upgradeDict[i]["Contribution"] = 0;
    }

    return upgradeDict;
}

// SORTS TABLE BY BUTTON ID
function sortList(table) {
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById(table);
    switching = true;

    while (switching) {
        switching = false;
        b = list.children;
        for (i = 0; i < (b.length - 1); i++) {
            shouldSwitch = false;
            if (b[i].id > b[i + 1].id) {
                shouldSwitch = true;
                break;
            }
        }
        
        if (shouldSwitch) {
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
        }
    }
}

// UNLOCKS EXPEDITION (REQUIRES PASSING OF EXPEDITION DICT AS WELL)
function unlockExpedition(i,expeditionDict) {
    let expedID = "exped-" + i;
    let unlockButton = document.getElementById(expedID);
    let backgroundImage = "url(./assets/expedbg/exped" + i + ".webp) center center / contain no-repeat";

    expeditionDict[i].Locked = 0;
    unlockButton.style.background = backgroundImage;
}

// INNER HTML FOR FOOD BUFFS
function countdownText(foodCooldown, int) {
    foodCooldown.classList.add("countdown-number");
    foodCooldown.style.background = "url(./assets/icon/food"+int+".webp)";
    foodCooldown.style.backgroundSize = "contain";
    return foodCooldown;
}

// CHECKS FOR MISSING KEYS BETWEEN OBJECTS
function updateObjectKeys(savedObject,referenceObject) {
    for (let key in referenceObject) {
        if (!savedObject.hasOwnProperty(key)) {
            savedObject[key] = referenceObject[key];
        }
    }
    return savedObject;
}

export { abbrNum,randomInteger,sortList,generateHeroPrices,unlockExpedition,getHighestKey,countdownText,updateObjectKeys};
