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
    if (!document.getElementById("float-text")) leftDiv.appendChild(clickCountAppear);
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
    multiplierButtonImg.classList.add("multiplier-button-img", "clickable");
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

// CREATES A FRAME OF AN INVENTORY ITEM
function inventoryFrame(ele, itemInfo, itemFrameColors) {
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

// CHOICE BOX (FOR ITEMS, PARENT CONTAINER MUST HAVE 'NOTIF-ITEM' CLASS)
function choiceBox(mainBody, dialogObg, stopSpawnEvents = undefined, yesFunc, noFunc, extraEle, classes, returnEle = false) {
    if (stopSpawnEvents) {stopSpawnEvents = false}

    const choiceEle = document.createElement('div');
    choiceEle.choiceValue = null;
    let pickChoice = false;
    if (classes) {
        classes.forEach((item) => {
            choiceEle.classList.add(item);
            if (item.includes('pick')) {
                pickChoice = true;
            }
        })
    }

    choiceEle.classList.add('flex-column');
    const choiceDiv = document.createElement('div');
    choiceDiv.classList.add('flex-column');
    const text = document.createElement('p');
    text.innerHTML = dialogObg.text;

    const choiceContainer = document.createElement('div');
    choiceContainer.classList.add('flex-row');

    const yesButton = document.createElement('button');
    yesButton.style.pointerEvents = pickChoice ? 'none' : 'unset';
    yesButton.style.filter = pickChoice ? 'brightness(0.6)' : 'unset';

    // IF A CHOICE WAS GIVEN TO PICK BETWEEN ITEMS
    if (pickChoice) {
        const choiceEleChildren = Array.from(extraEle.children);
        choiceEleChildren.forEach((item) => {
            item.addEventListener('click', () => {
                choiceEle.choiceValue = item.name;
                yesButton.style.pointerEvents = 'auto';
                yesButton.style.filter = 'unset';

                choiceEleChildren.forEach((otherItem) => {
                    otherItem.style.filter = 'brightness(0.2)';
                })
                item.style.filter = 'unset';
            });

            item.style.filter = 'brightness(0.2)';
        })
    }

    if (dialogObg.yes) {
        yesButton.innerText = dialogObg.yes;
    } else {
        yesButton.innerText = noFunc === null ? 'Okay' : 'Confirm';
    }

    yesButton.addEventListener('click',() => {
        choiceEle.remove();
        if (stopSpawnEvents) stopSpawnEvents = true;
        // YES FUNCTION IS ASYNC
        if (yesFunc) yesFunc(choiceEle.choiceValue === null ? null : choiceEle.choiceValue);
        return choiceEle.choiceValue;
    });

    const noButton = document.createElement('button');
    noButton.innerText = dialogObg.no ? dialogObg.no : 'Cancel';
    noButton.addEventListener('click',() => {
        choiceEle.remove();
        if (stopSpawnEvents) stopSpawnEvents = true;
        if (noFunc) noFunc();
    });

    choiceContainer.append(yesButton);
    if (noFunc !== null) {choiceContainer.append(noButton)}

    choiceDiv.append(text);
    if (extraEle) {
        choiceDiv.append(extraEle, choiceContainer);
    } else {
        choiceDiv.append(choiceContainer);
    }
    
    choiceEle.append(choiceDiv);

    if (returnEle) {
        return choiceEle;
    } else {
        mainBody.append(choiceEle);
    }
}

// ALL CHILD ELEMENTS NEED SUBTITLE PROP
function slideBox(mainBody, childArray, stopSpawnEvents) {
    if (stopSpawnEvents) {stopSpawnEvents = false}
    let childEleArray = [];
    let buttonArray = [];

    const choiceEle = createDom('div', {
        class: ['flex-column', 'notif-ele']
    });

    const buttonDiv = createDom('div', {
        class: ['flex-row', 'slide-button-container']
    });

    childArray.forEach((childEle) => {
        const childContainer = createDom('div', {
            class: ['flex-row', 'slide-box-child'],
            style: { display: 'none' },
            child: [childEle]
        });

        childEleArray.push(childContainer);
        const childButton = createDom('button', {
            innerText: childEle.subtitle,
            class: ['box-button'],
            style: { filter: 'grayscale(1)' }
        })

        childButton.addEventListener('click', () => {
            childEleArray.forEach((childEle) => {
                childEle.style.display = 'none';
            });

            buttonArray.forEach((button) => {
                button.style.filter = 'grayscale(1)';
            })

            childContainer.style.display = 'flex';
            childButton.style.filter = 'grayscale(0)';
        });

        buttonArray.push(childButton);
        choiceEle.appendChild(childContainer);
        buttonDiv.appendChild(childButton);
    });

    const exitButton = createDom('button', {
        innerText: 'Exit',
        class: ['box-button', 'exit-button']
    })
    exitButton.addEventListener('click', () => {
        choiceEle.remove();
        if (stopSpawnEvents) stopSpawnEvents = true;
    })
    buttonDiv.appendChild(exitButton);

    childEleArray[0].style.display = 'flex';
    buttonArray[0].style.filter = 'grayscale(0)';
    choiceEle.append(buttonDiv);
    mainBody.append(choiceEle);
}

const cssProps = ['top', 'left', 'transform', 'right', 'background', 'display'];
function createDom(elementType, attributes) {
    const element = document.createElement(elementType);
    if (attributes) {
        for (const attr in attributes) {
            if (cssProps.includes(attr)) {
                console.warn(`Error putting CSS props: ${attr}`);
            } else if ((attr === 'class' || attr === 'classList')) {
                if (Array.isArray(attributes[attr])) {
                    element.classList.add(...attributes[attr]);
                } else {
                    element.classList.add(attributes[attr]);
                }
            } else if (attr === 'child' || attr === 'children') {
                if (Array.isArray(attributes[attr])) {
                    attributes[attr].forEach((child) => {
                        element.appendChild(child)
                    })
                } else {
                    element.appendChild(attributes[attr])
                }
            } else if (attr === 'style' && typeof attributes[attr] === 'object') {
                Object.assign(element.style, attributes[attr]);
            } else if (attr === 'event') {
                element.addEventListener(attributes[attr][0], () => {attributes[attr][1]()})
            } else if (typeof attributes[attr] !== 'object' || attributes[attr] === null) {
                element[attr] = attributes[attr];
            } else {
                console.warn('Invalid Attribute: ', attr);
            }
        }
    }
    return element;
}

// CREATE BUTTON WITH TOGGLEABLE CLASS
function createButton(clickedClass, attributes) {
    const buttonEle = createDom('button', attributes);
    buttonEle.addEventListener('click', () => {
        if (buttonEle.classList.contains(clickedClass)) {
            buttonEle.classList.remove(clickedClass);
        } else {
            buttonEle.classList.add(clickedClass);
        }
    })
    return buttonEle
}

// CREATES PROGRESS BAR
function createProgressBar(parentProps, childProps, dividerProps, dividerNumber, imgProps) {
    const parentEle = createDom('div', parentProps);
    const barEle = createDom('div', { class:[ 'healthbar-grid'] })
    const childEle = createDom('div', childProps);

    barEle.style.gridTemplateColumns = `repeat(${dividerNumber}, 1fr)`;
    for (let i = 0; i < dividerNumber; i++) {
        const bar = createDom('b', dividerProps);
        if (i === (dividerNumber - 1)) {
            bar.style.borderRight = 0;
        }
        barEle.appendChild(bar);

        if (imgProps) {
            const dividerImg = createDom('img', imgProps);
            dividerImg.style.left = `${(100 / dividerNumber) * (i)}%`
            if (i !== (dividerNumber)) {
                parentEle.appendChild(dividerImg);
            }
        }
    }

    barEle.appendChild(childEle)
    parentEle.appendChild(barEle);
    return parentEle;
}

const textDict = {
    1:['Golden Nut Reward', '.png'], 
    2:['Leyline Outbreak Reward', '.png'], 
    3:['All Challenges Reward', '.mp4']}

// CREATES MEDAL FOR SETTINGS MENU
function createMedal(num, choiceBox, mainBody, stopSpawnEvents) {
    let nutMedalImg;
    if (num === 3) {
        nutMedalImg = createDom('video', {
            src: `./assets/frames/medal-${num}-backing.webm`,
            autoplay: true,
            controls: true,
        })
    } else {
        nutMedalImg = createDom('img', {
            src: `./assets/frames/medal-${num}-backing.webp`,
        })
    }
    nutMedalImg.classList.add('medal-backing');

    const nutMedal = createDom('img', {
        class: ['medal-img', 'clickable'],
        id: `medal-img-${num}`,
        src: `./assets/frames/medal-${num}.webp`,
        event: ['click', () => {
            choiceBox(mainBody, {
                text: textDict[num][0],
                yes: 'Download',
                no: 'Go Back'
            }, stopSpawnEvents, () => {
                const imgSrc = `./assets/frames/${textDict[num][0] + textDict[num][1]}`;
                const imgFileName = imgSrc.substring(imgSrc.lastIndexOf('/') + 1);
                
                const link = document.createElement('a');
                link.href = imgSrc;
                link.download = imgFileName;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, undefined, nutMedalImg, ['choice-ele', 'smaller-choice-ele']);
        }]
    });

    const settingButton = document.getElementById('setting-button');
    if (settingButton) {
        settingButton.classList.add('settings-button-img-glow');
    }

    return nutMedal;
}

export { createButton,inventoryAddButton,expedButtonAdjust,dimMultiplierButton,floatText,multiplierButtonAdjust,inventoryFrame,slideBox,choiceBox,createProgressBar,createDom,createMedal };