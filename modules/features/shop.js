import { randomInteger, rollArray, abbrNum } from "../functions.js";
import { blackShopDict } from "../dictData.js";
import { createDom, choiceBox } from "../adjustUI.js";

const boxElement = ["Any","Pyro","Hydro","Dendro","Electro","Anemo","Cryo","Geo"];
// REUSED FUNCTIONS
const calculateBlackCost = (persistentDictTemp, type, key) => {
    let blackItemTemp = blackShopDict[key];
    if (type === 'cost') {
        return Math.ceil(Math.round(blackItemTemp.cost * randomInteger(70, 140) / 100) * 1.5**(persistentDictTemp.level) / 5) * 5;
    } else if (type === 'primoCost') {
        return Math.ceil(Math.round(blackItemTemp.primoCost * randomInteger(80, 120) / 100) * 1.5**(persistentDictTemp.level)/ 5) * 5;
    } else {
        console.error(`calculateBlackCost: Missing ${type}`);
    }
}

const generateBlackItem = (key, persistentBlackMarket) => {
    let blackItemTemp = blackShopDict[key];
    persistentBlackMarket[key] = {
        cost: calculateBlackCost(blackItemTemp, 'cost', key),
        primoCost: calculateBlackCost(blackItemTemp, 'primoCost', key),
        costElement: rollArray(boxElement, 1),
        level: 0,
        maxLevel: blackItemTemp.maxLevel,
        active: false,
    }
}

const changeStoreDialog = (typeText) => {
    let dialog = document.getElementById("table7-text");
    let newText;

    switch (typeText) {
        case ('clear'):
        case ('normalLoad'):
            newText = "Any questions or troubles? I'm here to personally assist you!";
            break;
        case ('ascendLoad'):
            newText = rollArray(
                ["Dori's Deals now come with extra value!",
                "What will it be today, friend? Please take your time!"]);
            break;
        case ('retryConfirm'):
            newText = "Are you sure? Remember, no refunds!";
            break;
        case ('retryAscendConfirm'):
            newText = "Maybe if you ask nicely, I'll even allow a refund within 24 hours! Hehe, just kidding.";
            break;
        case ('purchaseSuccessAscend'):
            newText = rollArray(
                ['See you again soon! Hehe.', 
                "Thank you kindly. Can I interest you in anything else?"]);
            break;
        case ('purchaseSuccessRegular'):
            newText = "Hehe, you've got good eyes.";
            break;
        case ('purchaseFailAscend'):
            newText = "Now, now, I can't make it any cheaper than that. It'll be daylight robbery!";
            break;
        case ('purchaseFailRegular'):
            newText = "Hmph, come back when you're a little richer.";
            break;
        default:
            console.error(`changeStoreDialog Error: ${dialog}`);
            break;
    }
    dialog.innerText = newText;
}

const calculateShopCost = (star, costDiscount = 1) => {
    let shopCost = 0;
    switch (star) {
        case 2:
            shopCost = Math.round(randomInteger(35,55) * costDiscount / 5) * 5;
            break;
        case 3: 
            shopCost = Math.round(randomInteger(70,100) * costDiscount / 5) * 5;
            break;
        case 4:
            shopCost = Math.round(randomInteger(140,210) * costDiscount / 5) * 5;
            break;
        case 5:
            shopCost = Math.round(randomInteger(300,400) * costDiscount / 5) * 5;
            break;
        case 6:
            shopCost = Math.round(randomInteger(600,750) * costDiscount / 5) * 5;
            break;
        default:
            console.error(`calculateShopCost error: Invalid shop cost ${star}`);
            break;
    }
    return shopCost;
}

const drawShopItem = (i, upgradedShop = false, inventoryDraw, saveValues) => {
    let inventoryNumber;
    if (i >= 7 && i <= 9) {
        if (upgradedShop) {
            if (i === 9) {
                inventoryNumber = 4015;
            } else {
                inventoryNumber = 4014;
            }
        } else {
            inventoryNumber = inventoryDraw("talent", 2, 4, "shop");
        }
    } else if (i === 6) {
        inventoryNumber = randomInteger(4011,4014);
    } else if (i === 5) {
        if (upgradedShop) {
            inventoryNumber = 4018;
        } else if (saveValues["wishUnlocked"] === true) {
            inventoryNumber = 4010;
        } else {
            inventoryNumber = inventoryDraw("gem", 3, 6, "shop");
        }
    } else if (i >= 3 && i <= 4) {
        if (upgradedShop) {
            if (i === 3) {
                inventoryNumber = 4017;
            } else {
                inventoryNumber = 4016;
            }
        } else {
            inventoryNumber = inventoryDraw("gem", 3, 6, "shop");
        }
    } else {
        inventoryNumber = inventoryDraw("weapon", 5, 6, "shop");
    }

    return inventoryNumber;
}

const updateBlackMarket = (persistentBlackMarket) => {
    for (let key in blackShopDict) {
        if (persistentBlackMarket[key] === undefined) {
            generateBlackItem(key, persistentBlackMarket);
        } else {
            persistentBlackMarket[key].maxLevel = blackShopDict[key].maxLevel;
        }
    }
}

const regenOnePrice = (persistentBlackMarket, key) => {
    let blackItemTemp = blackShopDict[key];
    if (persistentBlackMarket[key].level < persistentBlackMarket[key].maxLevel) {
        const oldDict = Object.assign({}, persistentBlackMarket[key])

        persistentBlackMarket[key] = {
            cost: calculateBlackCost(oldDict, 'cost', key),
            primoCost: calculateBlackCost(oldDict, 'primoCost', key),
            level: oldDict.level,
            costElement: rollArray(boxElement, 1),
            maxLevel: blackItemTemp.maxLevel,
            active: oldDict.active,
        }

        document.getElementById(`black-${key}`).updateCost(persistentBlackMarket[key]);
    }
}

const regenBlackPrice = (persistentBlackMarket, particularKey = null) => {
    if (particularKey) {
        regenOnePrice(persistentBlackMarket, particularKey);
    } else {
        for (let key in persistentBlackMarket) {
            regenOnePrice(persistentBlackMarket, key);
        }
    }
}

// SINGLE-USE FUNCTIONS
const useItem = (key, buttonFunctions) => {
    if (blackShopDict[key].subtype === 'bigNahida') {
        buttonFunctions.changeBigNahida(key);
    } else if (blackShopDict[key].type === 'functional') {
        let equipState;
        if (blackShopDict[key].subtype === 'autoFood') {
            equipState = buttonFunctions.autoConsumeFood('equip');
        } else if (blackShopDict[key].subtype === 'autoClick') {
            equipState = buttonFunctions.autoClickNahida('equip');
        }
        
        const equipButton = document.getElementById(`black-card-${key}`);
        equipButton.innerText = equipState ? 'Equipped' : 'Equip';
    }
}

const createEquipButton = (key, buttonFunctions, persistentValues = null) => {
    const equipButton = createDom('p', {
        class: ['flex-row', 'black-button', 'black-equip', 'clickable'],
        id: `black-card-${key}`,
        innerText: (blackShopDict[key].type === 'cosmetic') ? 'Change' : 'Equip'
    });

    equipButton.addEventListener('click', (event) => {
        useItem(key, buttonFunctions);
        event.stopPropagation();
    });

    if (persistentValues) {
        if (blackShopDict[key].subtype === 'autoFood' && persistentValues.autoFood) {
            equipButton.innerText = 'Equipped';
        }
        if (blackShopDict[key].subtype === 'autoClick' && persistentValues.autoClickNahida) {
            equipButton.innerText = 'Equipped';
        }
    }

    return equipButton;
}

const drawTopBlackMarket = (persistentValues) => {
    // FOR CURRENCIES ONLY
    const elementCurrency = createDom('div', {
        id: 'black-market-currency',
        class: ['flex-row', 'black-currency-container']
    });

    for (let index = 1; index < boxElement.length; index++) {
        const element = boxElement[index];
        const textAmount = createDom('p', { innerText: abbrNum(persistentValues.ascendEle[element], 2, true) });

        const currencyContainer = createDom('div', {
            class: ['black-currency-cell', 'flex-row'],
            children: [
                textAmount,
                createDom('img', { src: `../assets/tooltips/inventory/solid${element}.webp` })
            ]
        });

        currencyContainer.updateSingleValue = () => {
            textAmount.innerText = abbrNum(persistentValues.ascendEle[element], 2, true);
        }
        elementCurrency.appendChild(currencyContainer);
    }

    elementCurrency.updateValues = () => {
        Array.from(elementCurrency.children).forEach((child) => {
            child.updateSingleValue();
        });
    }

    return elementCurrency;
}

const drawBlackMarket = (persistentValues, buttonFunctions) => {
    const elementCurrency = drawTopBlackMarket(persistentValues)
    const shopBlackDiv = createDom("div", {
        id: "shop-black-div",
        class: ['shop-black-div']
    });
    
    const shopBlackContainer = createDom("div", {
        class: ["store-div"],
        id: "shop-black",
        style: { display: 'none' },
        child: [elementCurrency, shopBlackDiv]
    });
    

    // INDIVIDUAL ITEM CARDS
    for (let key in blackShopDict) {
        let itemDict = persistentValues.blackMarketDict[key];
        let shopBlackCard = createDom('div', { 
            class: ['shop-black-card', 'flex-column'], 
            id: `black-${key}`,
            function: null,
            level: itemDict.level,
            maxLevel: itemDict.maxLevel
        });

        let blackCardBottom = createDom('div', {
            class: ['flex-column', 'black-card-bottom'],
        });

        const levelCount = createDom('p', {
            innerText: `${itemDict.level} / ${itemDict.maxLevel}`,
            class: ['black-level', 'flex-row']
        });

        const eleImage = createDom('img', {
            src: `./assets/${blackShopDict[key].file}`,
            class: blackShopDict[key].subtype === 'bigNahida' ? ['black-image-spin', 'black-image'] : ['black-image']
        });

        const infoButton = createDom('button', {
            class: ['black-info-button', 'clickable'],
            innerText: 'Info'
        });

        infoButton.addEventListener('click', (event) => {
            let info = createDom('p', {
                innerText: blackShopDict[key].desc,
                class: ['black-info']
            });

            event.stopPropagation();
            choiceBox(document.getElementById('table7'), {text: `'${blackShopDict[key].title}'`}, null, ()=>{}, null, info, ['notif-ele']);
        })

        let eleCost = createDom('p', { innerText: itemDict.cost });
        let eleImg = createDom('img', { class: ['black-currency'], src: `./assets/tooltips/inventory/solid${itemDict.costElement}.webp`});
        let primoCost = createDom('p', { innerText: itemDict.primoCost });
        const elePrice = createDom('div', {
            eleCost: itemDict.cost,
            class: ['flex-row', 'black-div', 'price-button'],
            child: [ eleCost, eleImg, primoCost, 
                createDom('img', {
                    class: ['black-currency'],
                    src: `./assets/icon/primogemLarge.webp`
                })
            ]
        });

        shopBlackCard.updateCost = (blackMarketDict) => {
            eleCost.innerText = blackMarketDict.cost;
            eleImg.src = `./assets/tooltips/inventory/solid${blackMarketDict.costElement}.webp`;
            primoCost.innerText = blackMarketDict.primoCost;
        }

        shopBlackCard.removeCost = () => {
            const removeEle = shopBlackCard.querySelectorAll('.black-div, .price-button');
                removeEle.forEach(ele => {
                    ele.remove();
                });

            let equipButton = shopBlackCard.querySelector('.black-equip');
            if (!equipButton) {
                blackCardBottom.appendChild(createEquipButton(key, buttonFunctions));
            }   
        }

        shopBlackCard.increaseLevel = (persistentBlackMarket, keyId, updateCost = true) => {
            levelCount.innerText = `${persistentBlackMarket[keyId].level} / ${persistentBlackMarket[keyId].maxLevel}`;
            if (updateCost) {
                regenBlackPrice(persistentBlackMarket, keyId);
            } else {
                shopBlackCard.removeCost();
            }
        } 

        shopBlackCard.addEventListener('click', () => {
            if (shopBlackCard.level < shopBlackCard.maxLevel) {
                buttonFunctions.buyShop(
                    `black-${key}`, 
                    itemDict.primoCost, 
                    { ele: itemDict.costElement, eleCost: itemDict.cost }
                );
            }
        });

        
        let childrenArray;
        if (itemDict.level === 0) {
            childrenArray = [elePrice];
        } else if (itemDict.level === itemDict.maxLevel) {
            childrenArray = [createEquipButton(key, buttonFunctions, persistentValues)];
        } else {
            childrenArray =  [elePrice, createEquipButton(key, buttonFunctions, persistentValues)];
        }
        
        let blackCardTop = createDom('div', {
            class: ['flex-column', 'black-card-top'],
            child: [eleImage, infoButton]
        });
        
        blackCardBottom.append(...childrenArray)
        shopBlackCard.append(levelCount, blackCardTop, blackCardBottom)
        shopBlackDiv.appendChild(shopBlackCard);
    }

    return shopBlackContainer;
}

// ADDS MID-GAME SHOP TAB
const addShop = (tabChange) => {
    let tabFlex = document.getElementById("flex-container-TAB");
    let tabButton = document.createElement("div");
    tabButton.classList += " tab-button-div";
    tabButton.id = "tab-5";

    let tabButtonImage = document.createElement("img");
    tabButtonImage.src = "./assets/icon/tab7.webp";
    tabButtonImage.classList += " tab-button";
    tabButtonImage.classList.add("darken")

    tabButton.addEventListener('click', () =>{
        tabChange(6);
    })

    tabButton.appendChild(tabButtonImage);
    tabFlex.appendChild(tabButton);
}

export { drawBlackMarket, updateBlackMarket, regenBlackPrice, changeStoreDialog, calculateShopCost, addShop, drawShopItem }