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
function floatText(clickType, combineText, leftDiv, clickFactor, Xlocation, Ylocation, abbrNum, clickerEvent = null) {
    let clickCountAppear = document.createElement("div");
    clickCountAppear.style.position = "absolute";
    clickCountAppear.style.left = Xlocation + "%";
    clickCountAppear.style.top = Ylocation + "%";
    clickCountAppear.addEventListener('animationend', ()=>{if(clickCountAppear) clickCountAppear.remove()});

    let addDiv = true;
    if (clickType === "crit") {
        if (document.getElementById("crit-text")) {
            let oldNumberText = document.getElementById("crit-text");
            let oldValue = oldNumberText.nutValue + clickFactor;
            oldNumberText.innerText = `+${abbrNum(oldValue,2,true)}`;
            addDiv = false;

            if (clickerEvent === "scara") { clickCountAppear.classList.add("scara-floatingCritText") }

            let newNumberText = oldNumberText.cloneNode(true);
            oldNumberText.parentNode.replaceChild(newNumberText, oldNumberText);
            newNumberText.nutValue = oldValue;
            newNumberText.addEventListener('animationend', () => {
                oldNumberText.remove();
                newNumberText.remove();
            });
        } else {
            clickCountAppear.classList.add("floatingCritText");
            if (clickerEvent === "scara") { clickCountAppear.classList.add("scara-floatingCritText") }
            clickCountAppear.id = "crit-text";
            clickCountAppear.nutValue = clickFactor;
            clickCountAppear.innerText = "+" + abbrNum(clickFactor,2,true);
        }
    } else if (clickType === "normal") {
        if (combineText) {
            if (document.getElementById("float-text")) {
                let oldNumberText = document.getElementById("float-text");
                let oldValue = oldNumberText.nutValue + clickFactor;
                oldNumberText.innerText = `+${abbrNum(oldValue,2,true)}`;

                if (clickerEvent === "scara") { clickCountAppear.classList.add("scara-floatingCritText") }
                
                let newNumberText = oldNumberText.cloneNode(true);
                oldNumberText.parentNode.replaceChild(newNumberText, oldNumberText);
                newNumberText.nutValue = oldValue;
                newNumberText.addEventListener('animationend', ()=>{newNumberText.remove()});
            } else {
                clickCountAppear.classList.add("floatingTextLow");
                if (clickerEvent === "scara") { clickCountAppear.classList.add("scara-floatingCritText") }
                clickCountAppear.id = "float-text";
                clickCountAppear.nutValue = clickFactor;
                clickCountAppear.innerText = "+" + abbrNum(clickFactor,2,true);
            }
        } else {
            clickCountAppear.classList.add("floatingText");
            clickCountAppear.innerText = "+" + abbrNum(clickFactor,2,true);
        }
    } else if (clickType === "energy") {
        clickCountAppear.classList.add("floatingText", "energy-text");
        clickCountAppear.innerText = "+" + abbrNum(clickFactor,2,true);
        clickCountAppear.appendChild(createDom('img', { src: './assets/icon/energyIcon.webp'}));
        debugger;
    }

    if (clickerEvent === "scara") {
        clickCountAppear.style.color = "#0c1327";
    }

    if (clickType === "energy" || (!document.getElementById("float-text") && addDiv)) {
        leftDiv.appendChild(clickCountAppear);
    };
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
const itemFrameColors = ['#909090','#73ac9d','#94aee2','#b0a3db','#614934','#793233'];
function inventoryFrame(ele, itemInfo, stars = false) {
    ele.classList.add("flex-column","item-frame");
    ele.style.backgroundImage = `url(./assets/frames/background-${itemInfo.Star}.webp)`;
    ele.style.border = `0.15em solid ${itemFrameColors[itemInfo.Star-1]}`;

    let lootImg = new Image();
    lootImg.classList.add("cover-all");
    lootImg.src = `./assets/tooltips/inventory/${itemInfo.File}.webp`;
    let lootStar = new Image();
    lootStar.classList.add("frame-star");
    lootStar.src = `./assets/frames/star-${itemInfo.Star}.webp`;
    ele.append(lootImg,lootStar);

    return ele;
}

function popUpBox(mainBody, containerText, additionalContainer = null, buttonContainer, additionalClass = [], type = 'Close') {
    const containerTitle = createDom('p', { id:'pop-up-text', innerText: containerText });    
    const containerEle = createDom('div', { class: ['flex-column', ...additionalClass], child: [containerTitle, additionalContainer, buttonContainer] })
    const parentEle = createDom('div', { class: ['flex-column', 'menu-ele'], child: [containerEle] });
    mainBody.append(parentEle);

    const buttonArray = Array.from(buttonContainer.children);
    buttonArray.forEach((button) => {
        if (type === 'Pick2' || type === 'Close') {
            button.addEventListener('click', () => { parentEle.remove() });
        }
    });
    
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
    choiceDiv.classList.add('flex-column', 'choice-div');
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

// SELECT MULTIPLE OUT OF MAX
function choiceMax(mainBody, dialogObg, stopSpawnEvents = undefined, yesFunc, noFunc, extraEle, classes, returnEle = false, maxNumber) {
    if (stopSpawnEvents) {stopSpawnEvents = false}

    const choiceEle = document.createElement('div');
    choiceEle.choiceValue = [];
    if (classes) {
        classes.forEach((item) => {
            choiceEle.classList.add(item);
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
    yesButton.style.pointerEvents =  'none';
    yesButton.style.filter =  'brightness(0.6)';

    const choiceEleChildren = Array.from(extraEle.children);
    choiceEleChildren.forEach((item) => {
        item.addEventListener('click', () => {
            const index = choiceEle.choiceValue.indexOf(item);
            if (index !== -1) {
                item.style.filter = 'brightness(0.2)';
                choiceEle.choiceValue.splice(index, 1);
            } else {
                if (choiceEle.choiceValue.length === maxNumber) {
                    choiceEle.choiceValue[0].style.filter = 'brightness(0.2)';
                    choiceEle.choiceValue.shift();
                }
                choiceEle.choiceValue.push(item);
                item.style.filter = 'unset';
            }

            if (choiceEle.choiceValue.length > 0) {
                yesButton.style.pointerEvents = 'auto';
                yesButton.style.filter = 'unset';
            } else {
                yesButton.style.pointerEvents = 'none';
                yesButton.style.filter = 'brightness(0.6)';
            }
        });

        item.style.filter = 'brightness(0.2)';
    });

    if (dialogObg.yes) {
        yesButton.innerText = dialogObg.yes;
    } else {
        yesButton.innerText = noFunc === null ? 'Okay' : 'Confirm';
    }

    // YES FUNCTION IS ASYNC
    yesButton.addEventListener('click',() => {
        if (choiceEle.choiceValue.length === 0) return;
        choiceEle.remove();
        if (stopSpawnEvents) stopSpawnEvents = true;
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

    choiceDiv.append(text, extraEle, choiceContainer);
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
    });
    exitButton.addEventListener('click', () => {
        choiceEle.remove();
        if (stopSpawnEvents) stopSpawnEvents = true;
    });
    buttonDiv.appendChild(exitButton);

    childEleArray[0].style.display = 'flex';
    buttonArray[0].style.filter = 'grayscale(0)';
    choiceEle.append(buttonDiv);
    mainBody.append(choiceEle);
}

const cssProps = ['top', 'left', 'transform', 'right', 'background', 'display'];
function createDom(elementType, attributes) {
    const element = document.createElement(elementType);

    if (element.draggable) {
        element.draggable = false;
    }

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
                console.warn('Invalid Attribute: ', elementType, attributes);
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
    parentEle.addBar = (newDividerNumber) => {
        for (let i = 0; i < newDividerNumber; i++) {
            const bar = createDom('b', dividerProps);
            if (i === (newDividerNumber - 1)) {
                bar.style.borderRight = 0;
            }
            barEle.appendChild(bar);
    
            if (imgProps) {
                const dividerImg = createDom('img', imgProps);
                dividerImg.style.left = `${(100 / newDividerNumber) * (i)}%`
                if (i !== (newDividerNumber)) {
                    parentEle.appendChild(dividerImg);
                }
            }
        }
    }

    parentEle.updateHealth = (newProgress, prop) => {
        parentEle[prop] = parseFloat(newProgress);
        childEle.style.width = newProgress + '%';
    }

    parentEle.updateBar = (barNumber) => {
        barEle.style.gridTemplateColumns = `repeat(${barNumber}, 1fr)`;
        barEle.querySelectorAll('b').forEach((bar) => {
            bar.remove();
        });
        barEle.querySelectorAll('img').forEach((img) => {
            img.remove();
        });
        parentEle.addBar(barNumber);
    }

    parentEle.addBar(dividerNumber);
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

const sidePop = (imgSrc, text, delay = 4000, clickable = false) => {
    const sidePopContainer = document.getElementById('side-pop-container');
    const sidePop = createDom('div', {
        class: ['flex-row', 'side-pop', 'side-pop-animation'],
        child: [
            createDom('img', { src: `../assets${imgSrc}` }),
            createDom('p', { innerText: text, class: ['flex-row'] }),
        ]
    });

    if (clickable) {
        sidePop.style.pointerEvents = 'all';
        sidePop.addEventListener('click', () => {
            sidePop.remove();
        });
    }

    setTimeout(() => {
        if (!sidePop) return;
        sidePop.style.animation = '';
        void sidePop.offsetWidth;
        sidePop.style.animation = 'fadeOut 2s ease-out';
        sidePop.addEventListener('animationend', () => {
            if (sidePop) {
                sidePop.remove();
            }
        }, { once: true });
    }, delay);

    sidePopContainer.append(sidePop);
}

// ERROR POPUP
const MAX_ERROR_LENGTH = 30;
const errorMesg = (errMesg) => {
    let innerText = errMesg.message;
    if (innerText.length > MAX_ERROR_LENGTH) {
        innerText = innerText.slice(0, MAX_ERROR_LENGTH - 3);
        innerText += "...";
    }

    const errorDiv = createDom('p', { classList: ['flex-row', 'error-pop-up'], innerText: `Error: ${innerText} \n Check error log for details`});
    document.body.appendChild(errorDiv);
    errorDiv.addEventListener('click', () => { errorDiv.remove() }, { once: true })
    setTimeout(() => {errorDiv.remove()}, 60 * 1000);
}

export { errorMesg,createButton,popUpBox,choiceMax,inventoryAddButton,expedButtonAdjust,dimMultiplierButton,floatText,multiplierButtonAdjust,inventoryFrame,slideBox,choiceBox,createProgressBar,createDom,createMedal,sidePop };