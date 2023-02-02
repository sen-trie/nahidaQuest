// ABBREVIATES NUMBERS TO SHORTER FORM
function abbrNum(number) {
   let decPlaces = Math.pow(10, 2);
   var abbrev = [""," Million"," Billion"," Trillion"," Quadrillion"," Quintillion"," Sextillion"," Septillion", " Octillion", " Nonillion", " Decillion"];

   if (number > 1e6) {
       for (var i = abbrev.length - 1; i >= 0; i--) {
           var size = Math.pow(10, (i + 1) * 3);
           if (size <= number) {
               number = Math.round((number * decPlaces) / size) / decPlaces;
               if (number == 1000 && i < abbrev.length - 1) {
                       number = 1;
                       i++;
                   }
               number += abbrev[i];
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

// RANDOM NUMBER GENERATOR
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

// GENERATE BASE ATK AND COSTS OF NON-WISH HEROES (IF SAVE NOT FOUND)
function generateHeroPrices(upgradeDict, NONWISHHEROMAX) {
    let initBaseCost = 50;
    let multiplierBaseCost = 2.5;
    let initATKCost = 1;
    let multiplierATKCost = 2.5;

    for (let i = 1; i < NONWISHHEROMAX + 1; i++) {
        let baseCost = Math.round(initBaseCost * (multiplierBaseCost ** (i-1)));
        let baseLevel = Math.round(0.75 * baseCost);
        upgradeDict[i]["BaseCost"] = Number(baseCost.toPrecision(3));
        upgradeDict[i]["Level"] = baseLevel;
        
        let baseATK = Math.round(initATKCost * (multiplierATKCost ** (i-1)));
        upgradeDict[i]["Factor"] = Number(baseATK.toPrecision(3));
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
    let backgroundImage = "url(./assets/expedbg/exped" + i + ".png)";

    expeditionDict[i].Locked = 0;
    unlockButton.style.background = backgroundImage;
    unlockButton.style["background-repeat"] = "no-repeat";
    unlockButton.style["background-size"]= "93%";
}

// INNER HTML FOR FOOD BUFFS
function countdownText(int) {
    return `<div id="countdown">
    <div class="countdown-number" style=${'background:url(./assets/icon/food'+int+'.webp);'}>
        <svg>
        <circle r="20" cx="21" cy="21"></circle>
        </svg>  
    </div>
    
    </div>`
}

export { abbrNum,randomInteger,sortList,generateHeroPrices,unlockExpedition,getHighestKey,countdownText};
