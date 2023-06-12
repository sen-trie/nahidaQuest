// ABBREVIATES NUMBERS TO SHORTER FORM
function abbrNum(number,digits,short) {
    let decPlaces = Math.pow(10, 3);
    let abbrev = [""," Million"," Billion"," Trillion"," Quadrillion"," Quintillion"," Sextillion"," Septillion", " Octillion", " Nonillion", " Decillion",
                  " Undecill", " Duodecill", " Tredecill", " Quattuordecill", " Quindecill", " Sexdecill"," Septendecill", " Octodecill",
                  " Novemdecill", " Vigintill", " Unvigintill", " Duovigintill", " Trevigintill", " Quattuorvigintill", " Quinvigintill",
                  " Sexvigintill", " Septenvigintill"," Octovigintill", " Nonvigintill", " Trigintill", " Untrigintill", " Duotrigintill"
    ];
    let abbrevShort = [""," M"," B"," T"," Qd"," Qt"," Sx"," Sp", " O", " N", " D", " Ud", " Dd", " Td", " Qa", " Qi", " Sxd", " Spd", " Od", " Nd", 
                    " V", " Uv", " Dv", " Tv", " Qtv", " Sv", " Spv", " Ov", " Nv", " Tn", " Ut", " Dt"];

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
}

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

// WRAPS RNG TO BOOLEAN
function randomIntegerWrapper(compare,max) {
    let randInt;
    if (max > 0) {
        randInt = randomInteger(1,max+1);
    } else {
        randInt = randomInteger(1,101);
    }
    
    if (randInt <= compare) {
        return true;
    } else {
        return false;
    }
}

// GENERATE BASE ATK AND COSTS OF NON-WISH HEROES (IF SAVE NOT FOUND)
function generateHeroPrices(upgradeDict, NONWISHHEROMAX) {
    let initBaseCost = 50;
    let multiplierBaseCost = 3;
    let initATKCost = 1;
    let multiplierATKCost = 1.5;
    let currentHero = 1;
    let currentKey = 1;

    for (let i = 1; i < NONWISHHEROMAX + 1; i++) {
        if (upgradeDict[i] === undefined) {continue}
        if (upgradeDict[i].Locked === true) {continue}

        let baseCost = Math.round(initBaseCost * (multiplierBaseCost ** ((currentHero-1)*1.3)));
        let baseATK = Math.round(initATKCost * (multiplierATKCost **((currentHero-1)*3.3)));
        let baseLevel = Math.round(0.75 * baseCost);
        upgradeDict[i]["BaseCost"] = baseCost;
        upgradeDict[i]["Level"] = baseLevel.toExponential(3);
        upgradeDict[i]["Factor"] = baseATK;

        if (currentKey > 1) {
            upgradeDict[i]["BaseCost"] = Math.round(baseCost + upgradeDict[currentKey]["BaseCost"] * 6);
            upgradeDict[i]["Level"] = Math.round(upgradeDict[i]["BaseCost"] * 0.75);
            upgradeDict[i]["Factor"] = Math.round(baseATK + upgradeDict[currentKey]["Factor"] * 4.5);
        }
        
        upgradeDict[i]["BaseFactor"] = upgradeDict[i]["Factor"];
        upgradeDict[i]["Contribution"] = 0;
        currentHero++;
        currentKey = i;
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

// ROLLS RANDOM INT IN AN ARRAY
function rollArray(array,startingPos) {
    return array[randomInteger(startingPos,array.length)]
}

// REPLACES TEXT FOR USE IN INNERHTML
function textReplacer(dictReplace,originalText) {
    for (let key in dictReplace) {
        originalText = originalText.replaceAll(key,dictReplace[key]);
    }
    return originalText;
}

// TOGGLES CSS STYLE
function universalStyleCheck(ele,styleCheck,paramOn,paramOff,forced) {
    if (forced) {
        if (ele.style[styleCheck] !== paramOff) {
            ele.style[styleCheck] = paramOff;
        }
    } else {
        if (ele.style[styleCheck] === paramOn) {
            ele.style[styleCheck] = paramOff;
        } else {
            ele.style[styleCheck] = paramOn;
        }
    }

    return ele;
}

let challengeThreshold = {
    'core':{
        1000:[0,1],
        2500:[1,1],
        5000:[2,1],
        10000:[3,1],
        25000:[4,1],
    },
    'primogem':{
        1000:[0,2],
        5000:[3,5]
    },
    'energy':{
        2500:[0,3],
        7500:[2,5],
        15000:[3,6],
    },
    'discount':{
        50:[0,4],
        200:[3,4],
    },
    'nahidaCrit':{
        3:[0,5],
        7:[3,8]
    }
}

// CHECKS FOR ALL CHALLENGES
function challengeCheck(type,tier,prop,prop2) {
    if (type === 'populate') {
        const challengeInfo = prop;
        let challengeCheck = challengeInfo.map(tier => {
            let tierCheck = {};
            for (let key in tier) {
                tierCheck[key] = false;
            }
            return tierCheck;
        })
        return challengeCheck;
    } else if (type === 'check') {
        // CHECKS IF THERE ARE NEW KEYS
        let challengeCheck = prop;
        const challengeInfo = prop2;
        if (challengeInfo.length > challengeCheck.length) {
            for (let i = challengeCheck.length; i < challengeInfo.length; i++) {
                let tierCheck = {};
                for (let key in challengeInfo[i]) {
                    tierCheck[key] = false;
                }
                challengeCheck[i] = tierCheck;
            }
        }
        for (let j = 0; j < challengeCheck.length; j++) {
            let tierCheck = challengeInfo[j];
            for (let key in tierCheck) {
                if (challengeCheck[j][key] === undefined) {
                    challengeCheck[j][key] = false;
                }
            }
        }
        return challengeCheck;
    }
}

export { abbrNum,randomInteger,sortList,generateHeroPrices,getHighestKey,countdownText,updateObjectKeys,randomIntegerWrapper,rollArray,textReplacer,universalStyleCheck,challengeCheck };
