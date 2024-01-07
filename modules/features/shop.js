import { randomInteger, rollArray, abbrNum } from "../functions.js";
import { blackShopDict } from "../dictData.js";
import { createDom, choiceBox } from "../adjustUI.js";

const boxElement = ["Any","Pyro","Hydro","Dendro","Electro","Anemo","Cryo","Geo"];

const generateBlackItem = (key, persistentBlackMarket) => {
    let blackItemTemp = blackShopDict[key];
    persistentBlackMarket[key] = {
        cost: Math.ceil(Math.round(blackItemTemp.cost * randomInteger(70, 140) / 100) / 5) * 5,
        primoCost: Math.ceil(Math.round(blackItemTemp.primoCost * randomInteger(80, 120) / 100) / 5) * 5,
        costElement: rollArray(boxElement, 1),
        level: blackItemTemp.level,
        maxLevel: blackItemTemp.maxLevel
    }
}

// REUSED FUNCTIONS
const updateBlackMarket = (persistentBlackMarket) => {
    for (let key in blackShopDict) {
        if (persistentBlackMarket[key] === undefined) {
            generateBlackItem(key, persistentBlackMarket);
        }
    }
}

const regenBlackPrice = (persistentBlackMarket) => {
    for (let key in persistentBlackMarket) {
        let blackItemTemp = blackShopDict[key];
        if (persistentBlackMarket[key].level < persistentBlackMarket[key].maxLevel) {
            const oldDict = Object.assign({}, persistentBlackMarket[key])

            persistentBlackMarket[key] = {
                cost: Math.ceil(Math.round(blackItemTemp.cost * randomInteger(70, 140) / 100) / 5) * 5,
                primoCost: Math.ceil(Math.round(blackItemTemp.primoCost * randomInteger(80, 120) / 100) / 5) * 5,
                level: oldDict.level,
                costElement: rollArray(boxElement, 1),
                maxLevel: blackItemTemp.maxLevel,
            }

            document.getElementById(`black-${key}`).updateCost(persistentBlackMarket[key]);
        }
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
            newText = "Dori's Deals now come with extra value!";
            break;
        case ('retryConfirm'):
            newText = "Are you sure? Remember, no refunds!";
            break;
        case ('retryAscendConfirm'):
            newText = "Maybe if you ask nicely, I'll even allow a refund within 24 hours! Hehe, just kidding.";
            break;
        case ('purchaseSuccessAscend'):
            newText = 'See you again soon! Hehe.';
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

// SINGLE-USE FUNCTIONS
const useItem = (key, buttonFunctions) => {
    buttonFunctions.changeBigNahida(key);
}

const createEquipButton = (key, buttonFunctions) => {
    const equipButton = createDom('p', {
        class: ['flex-row', 'black-button', 'black-equip', 'clickable'],
        innerText: 'Equip'
    });

    equipButton.addEventListener('click', () => {
        useItem(key, buttonFunctions);
    });

    return equipButton;
}

const drawBlackMarket = (persistentValues, buttonFunctions) => {
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

        const eleImage = createDom('img', {
            src: `./assets/${blackShopDict[key].file}`,
            class: ['black-image']
        });

        const infoButton = createDom('button', {
            class: ['black-info-button', 'clickable'],
            innerText: 'Info'
        })

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
            childrenArray = [createEquipButton(key, buttonFunctions)];
        } else {
            childrenArray =  [elePrice, createEquipButton(key, buttonFunctions)];
        }
        
        let blackCardTop = createDom('div', {
            class: ['flex-column', 'black-card-top'],
            child: [eleImage, infoButton]
        });
        
        blackCardBottom.append(...childrenArray)
        shopBlackCard.append(blackCardTop, blackCardBottom)
        shopBlackDiv.appendChild(shopBlackCard);
    }

    return shopBlackContainer;
}

export { drawBlackMarket, updateBlackMarket, regenBlackPrice, changeStoreDialog, calculateShopCost }