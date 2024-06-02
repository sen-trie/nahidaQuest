import { InventoryDefault, commisionInfo, expeditionDictInfo, imgKey, upgradeInfo } from "../dictData.js";
import { createDom } from "../adjustUI.js";
import { abbrNum, convertTo24HourFormat, getTime, randomInteger, rollArray, textReplacer, universalStyleCheck } from "../functions.js";
import { customTutorial } from "../drawUI.js";

const recommendedLevel = [0,1,4,7,10,13,16,20];

// REUSED FUNCTIONS
const changeExpedObjective = (saveValues, persistentValues) => {
    let textHTML;
    if (saveValues.goldenTutorial === false) {
        textHTML = 'Current Objective: Obtain a Golden Nut [Expedition]';
    } else if (persistentValues.tutorialAscend === false) {
        textHTML = 'Current Objective: Get a lot of Golden Cores [Transcend]';
    } else if (persistentValues.finaleBossDefeat === false) {
        textHTML = 'Current Objective: Stop the Leyline Outbreak [Trees]';
    } else if (persistentValues.allChallenges === false) {
        textHTML = 'Current Objective: Complete all Challenges [5 Tiers]';
    } else {
        textHTML = 'Current Objective: All done!';
    }

    return textHTML;
}

const expedInfo = (butId, expeditionDict, saveValues, persistentValues) => {
    let expedRow1 = document.getElementById("exped-text");
    let expedRow2 = document.getElementById("exped-lore");
    let expedBottom = document.getElementById("exped-bottom");

    let level = parseInt(butId.split("-")[1]);
    let id = butId.split("-")[2];

    if (expeditionDict[level] == 0 || level == 7) {
        let advButton = document.getElementById("adventure-button");
        if (!advButton.classList.contains("expedition-selected")) {
            advButton.classList.add("expedition-selected");
        }

        expedRow1.innerHTML = `<p>${expeditionDictInfo[level]["Text"]}</p>`;
        expedRow2.innerHTML = (level == 7) ? changeExpedObjective(saveValues, persistentValues) : expeditionDictInfo[level]["Lore"];
    } else if (level >= 8 && level <= 11) {
        expedRow1.innerHTML =  `<p>${expeditionDictInfo[level]["Text"]}</p>`;
        expedRow2.innerHTML = expeditionDictInfo[level]["Lore"];
    } else {
        expedRow1.innerHTML = `<p>${expeditionDictInfo[6]["Text"]}</p>`;
        expedRow2.innerHTML = expeditionDictInfo[6]["Lore"];
    }

    let enemyInfo = document.getElementById("exped-container");
    let lootInfo = document.getElementById("exped-loot");
    let expedImg = document.getElementById("exped-img");
    if (enemyInfo.currentWave != id) {
        while (enemyInfo.firstChild) {
            enemyInfo.removeChild(enemyInfo.firstChild);
        }
        lootInfo.innerText = "";
    } 

    if ((level < 6 && level > 0) || level >= 13) {
        expedRow1.innerHTML += `<img class="icon primogem" src="./assets/icon/energyIcon.webp"></img>`;
        let heads = imgKey[id].Heads;
        for (let j = 0; j < heads.length; j++) {
            let img = new Image();
            img.classList.add("enemy-head");
            img.src = `./assets/expedbg/heads/${heads[j]}.webp`;
            enemyInfo.appendChild(img);
        }

        let lootHTML = `<span style='font-size:1.2em'>Recommended Rank: ${recommendedLevel[level >= 13 ? (level - 7) : level]}</span>  <br> Potential Rewards: <br> [container]`;
        let lootTable = imgKey[id].Loot;
        let invDiv = createDom("div");
        invDiv.classList.add("inv-div","flex-row");
        invDiv.activeInfo = null;
        invDiv.activeImg = null;

        for (let key in lootTable) {
            let lootDiv = createDom("div");
            lootDiv.classList.add('flex-column');
            let img = new Image();
            img.src = `./assets/expedbg/loot/${key}.webp`;
            img.addEventListener("click",()=>{
                let popUpLoot = createDom("div");
                popUpLoot.classList.add("flex-column",'pop-up-loot');
                popUpLoot.innerText = lootTable[key][1];

                if (invDiv.activeInfo != null) {
                    if (invDiv.activeInfo.outerHTML == popUpLoot.outerHTML) {
                        invDiv.activeInfo.remove();
                        invDiv.activeInfo = null;
    
                        invDiv.activeImg.style.filter = "none";
                        invDiv.activeImg = null;
                        return;
                    } else {
                        invDiv.activeImg.style.filter = "none";
                        invDiv.activeInfo.remove();
                    }
                }

                img.style.filter = "brightness(0.1)";
                invDiv.activeImg = img;
                lootDiv.appendChild(popUpLoot);
                invDiv.activeInfo = popUpLoot;
            })
            let star = new Image();
            star.src = `./assets/frames/star-${lootTable[key][0]}.webp`;

            lootDiv.append(star, img);
            invDiv.appendChild(lootDiv);
        }

        lootHTML = lootHTML.replace('[container]','');
        lootInfo.innerHTML = `${lootHTML}`;
        lootInfo.appendChild(invDiv);

        expedImg.src = `./assets/expedbg/header/${id}.webp`;
        expedRow2.style.borderBottom = "0.2em solid #8B857C";
        enemyInfo.style.borderRight = "0.2em solid #8B857C";
        expedBottom.style.display = "flex";
    } else {
        expedImg.src = `./assets/expedbg/header/${(level == 10) ? '1' : '0'}.webp`;
        expedRow2.style.borderBottom = "none";
        enemyInfo.style.borderRight = "none";
        expedBottom.style.display = "none";
    } 
    enemyInfo.currentWave = id;
}

const resetAdventure = (dodgeOn, fightBgmElement, fightSFXElement, adventureVariables, bgmElement, winBattle = false) => {
    const adventureChoiceOne = document.getElementById("adv-button-one");
    adventureChoiceOne.style.display = "block";
    adventureChoiceOne.innerText = "Leave";

    const adventureFightDiv = document.getElementById("adventure-fight");
    adventureFightDiv.style.display = "none";
    const adventureEncounter = document.getElementById("adventure-encounter");
    adventureEncounter.style.display = "flex";

    const adventureVideo = document.getElementById('adventure-video');
    const targetElements = adventureVideo.querySelectorAll(`.atk-indicator, .select-indicator, .raining-image, .health-bar, 
                                                            .health-bar-scara, .skill-mark, .counter-button, .energy-burst, .defense-timer`);
    targetElements.forEach((item) => {
        item.remove();
    });

    if (winBattle) {
        const leftOverEnemy = adventureVideo.querySelectorAll('.enemy');
        leftOverEnemy.forEach((ele) => {
            ele.style.filter = 'grayscale(100%) brightness(20%)';
        })
    
        const leftOverImg = adventureVideo.querySelectorAll('.enemyImg');
        leftOverImg.forEach((ele) => {
            ele.style.animation = '';
        })
    }

    setTimeout(() => {
        dodgeOn("close");
        fightBgmElement.pause();
        fightSFXElement.load();
        fightSFXElement.play();
        fightSFXElement.addEventListener('ended', () => {
            setTimeout(() => {
                if (!adventureVariables.fightSceneOn) {
                    bgmElement.play();
                }
            }, 1000);
        })
    },300);
}

// BATTLE FUNCTIONS
const sapEnergy = (quantityAmount, energyAmount) => {
    const cooldown = document.getElementById('adventure-cooldown-1');
    const cooldown2 = document.getElementById('adventure-cooldown-2');
    const cooldown3 = document.getElementById('adventure-cooldown-3');

    try {
        cooldown.amount = Math.max(cooldown.amount - quantityAmount * energyAmount, 0);
        if (cooldown2) cooldown2.amount = Math.max(cooldown2.amount - quantityAmount * (energyAmount / 3), 0);
        if (cooldown3) cooldown3.amount = Math.max(cooldown3.amount - quantityAmount * (energyAmount / 10), 0);
    } catch (err) {
        console.warn(err);
    }
}

// SINGLE USE
const createExpedition = (advButtonFunction) => {
    let expedTable = createDom("div", { classList: ["flex-column","tooltipTABLEEXPED"] });
    let expedBottom = createDom("div", { id: "exped-bottom", classList: ["flex-row","exped-bottom"] });
    let expedContainer = createDom("div", { id: "exped-container", classList: ["exped-container","flex-row"] });

    let expedLoot = createDom("div", { id: "exped-loot", classList: ["exped-loot","flex-column"] });
    let expedLore = createDom("div", { id: "exped-lore", classList: ["exped-lore","flex-column"] });
    let expedImg = createDom('img', { id: 'exped-img' });

    let expedText = createDom("div", { id: "exped-text", classList: ["flex-row"] });
    let expedImgDiv = createDom("div", { classList: ["flex-row","exped-text"], child:[expedImg, expedText] });

    expedBottom.append(expedContainer,expedLoot);
    expedTable.append(expedImgDiv,expedLore,expedBottom);

    document.getElementById("expedTooltip").append(expedTable);
    let table3 = document.getElementById("table3")
    table3.appendChild(expedTooltip);
    document.getElementById("expedDiv").remove();
    
    let moraleLore = createDom("p", { style: { display: 'none' }});
    let charMorale = createDom("div", { id: "char-morale", classList: ["char-morale", 'clickable'], child: [moraleLore] });
    charMorale.addEventListener("click",() => {
        universalStyleCheck(moraleLore,"display","block","none");
    });

    table3.appendChild(charMorale);

    let advButton = createDom("div", {
        id: "adventure-button",
        class: ["background-image-cover", 'clickable'],
        innerText: 'Adventure!'
    });

    advButton.addEventListener("click",() => {
        advButtonFunction();
    });

    let advTutorial = createDom("img", {
        classList: ['clickable'],
        src: './assets/icon/help.webp',
        id: 'adventure-tutorial'
    });

    advTutorial.addEventListener("click", () => {
        customTutorial("advTut", 6, 'Expedition Tutorial');
    })

    table3.append(advButton,advTutorial);
}

const createTopHalf = () => {
    const adventureHealth = createDom('div', {
        id: "adventure-health",
        class: ["flex-row"],
        style: { opacity: 0 },
        child: [createDom('div', { id: "health-bar" })]
    });

    const adventureGif = createDom('img', {
        id: "adventure-gif",
        class: ["adventure-gif"],
        src: "./assets/expedbg/exped-Nahida.webp"
    });

    const adventureVideo = createDom('div', {
        id: 'adventure-video',
        class: ["adventure-video","flex-row"],
        child: [adventureGif, adventureHealth]
    });

    return adventureVideo;
}

const createEncounterHalf = () => {
    // ENCOUNTER TEXT
    const adventureHeading = createDom("p", { id: "adventure-header" });
    const adventureRewards = createDom("div", {
        class: ["adventure-rewards","flex-row"],
        id: "adventure-rewards"
    });

    const adventureChoiceOne = createDom("button", { 
        innerText: "Fight!",
        id: "adv-button-one",
        pressAllowed: false,
        maxScene: null,
        currentScene: null,
    });

    const adventureEncounter = createDom('div', {
        id: "adventure-encounter",
        class: ["flex-column"],
        style: { display: 'flex' },
        child: [adventureHeading, adventureRewards, adventureChoiceOne]
    });

    return [adventureEncounter, adventureChoiceOne];
}

const createBattleHalf = (MOBILE) => {
    // BATTLE CONTROLS
    const fightTextbox = createDom("p", { 
        id: "fight-text",
        class: ['flex-column'],
        innerText: "Prepare for a fight!"
    });

    const adventureFightDodge = createDom("div", {
        id: 'battle-toggle',
        child: [createDom('img', { src: "./assets/expedbg/battle1.webp" })]
    });

    const adventureFightSkill = createDom("div", {
        id: 'battle-skill',
        child: [createDom('img', { src: "./assets/expedbg/battle2.webp" })]
    });

    const adventureFightBurst = createDom("div", {
        id: 'battle-burst',
        child: [createDom('img', { src: "./assets/expedbg/battle3.webp" })]
    });

    const adventureFight = createDom('div', {
        id: "adventure-fight",
        class: ["adventure-fight"],
        style: { display: "none" },
        child: [fightTextbox, adventureFightDodge, adventureFightSkill, adventureFightBurst]
    });

    const adventureFightChild = adventureFight.childNodes;
    const keyCodes = [0, "Q", "W", "E"];
    if (!MOBILE) {
        for (let i = 0; i < adventureFightChild.length; i++) {
            if (adventureFightChild[i].tagName === "DIV") {
                adventureFightChild[i].appendChild(createDom("p", { innerText: keyCodes[i] }));
            }
        }
    }

    return [adventureFight, adventureFightDodge, adventureFightSkill, adventureFightBurst];
}

const commisionDict = [
    ['Resource Gathering', 'Assign Sumeru characters to roam the vast geography of Sumeru, gathering resources.'],
    ['Mob Hunting', 'Assign Sumeru characters to hunt down monsters, collecting Expedition rewards.'],
    ['Treasure Questing', 'Assign Sumeru characters to explore ruins scattered about, collecting various treasures.']
];

const buildImage = (commSave) => {
    if (commSave.timeEnd === 0) {
        return [createDom('img', { src: './assets/icon/charPlus.webp' })];
    } else {
        return [...commSave.char.map(char => {
            return createDom('img', { src: `./assets/tooltips/emoji/${char}.webp` });
        })];
    }
};

const buildItem = (key, commSave, commisionMenu) => {
    let commissionPicDiv = buildImage(commSave);
    const commissionPic = createDom('div', {
        classList: ['flex-row', 'commission-pic'],
        child: [...commissionPicDiv]
    });

    const timeNum = commSave.timeEnd - getTime();
    const timeLeft = createDom('p', { 
        innerText: commSave.timeEnd === 0 
                                    ? 'Start!'
                                    : `Time: ${convertTo24HourFormat(timeNum / 60)}`
        });

    const commisionAdd = createDom('div', {
        classList: ['flex-column', 'commission-add'],
        child: [ timeLeft, commissionPic ]
    });

    const commisionInfo = createDom('div', { 
        classList: ['flex-column', 'commission-info'],
        child: [
            createDom('p', { innerText: commisionDict[key][0] }),
            createDom('div', {
                classList: ['flex-row', 'commission-desc'],
                child: [
                    createDom('img', { src: `./assets/expedbg/comm${key + 1}.webp` }),
                    createDom('p', { innerText: commisionDict[key][1] }),
                ]
            })
        ]
    });

    const commissionItem = createDom('div', { 
        classList: ['flex-row', 'commission-item'],
        id: `commission-${key}`,
        child: [
            commisionInfo,
            commisionAdd,
        ]
    });

    commissionItem.updatePic = (commSave, hoursLeft) => {
        if (hoursLeft <= 0) {
            timeLeft.innerText = `Start!`;
            commSave.timeEnd = 0;
        } else {
            timeLeft.innerText = `Time: ${convertTo24HourFormat(hoursLeft)}`;
        }
        commissionPic.innerHTML = '';
        commissionPic.append(...buildImage(commSave));
    };

    commissionItem.updateTime = (currentTime) => {
        if (commSave.timeEnd === 0) {
            timeLeft.innerText = 'Start!';
        } else {
            const timeDiff = commSave.timeEnd - currentTime;
            if (timeDiff < 0) {
                commisionMenu.notif("add", "comm", key);
                timeLeft.innerText = `Done!`;
            } else {
                timeLeft.innerText = `Time: ${convertTo24HourFormat(timeDiff / 60)}`;
            }
            
        }
    };
    return commissionItem;
}

const buildSelect = (commisionMenu) => {
    const selectCharDiv = createDom('div', {
        class: ['flex-row', 'commission-select-div'],
        innerText: '+'
    });

    const selectChar = createDom('div', {
        class: ['flex-space', 'flex-column'],
        id: 'commission-select-char',
        child: [
            createDom('p', { innerText: 'Select Characters' }),
            selectCharDiv
        ]
    });

    const selectFoodDiv = createDom('div', {
        class: ['flex-row', 'commission-select-div'],
        innerText: '+'
    });

    const selectFood = createDom('div', {
        class: ['flex-space', 'flex-column'],
        id: 'commission-select-food',
        child: [
            createDom('p', { innerText: 'Select Food' }),
            selectFoodDiv
        ]
    });

    commisionMenu.calculateHour = (foodItems, heroItemsLength) => {
        let foodCal = Array.from(foodItems).reduce((i, x) => i + parseInt(x.itemStar) * 0.3, 0);
        foodCal *= (1 - (heroItemsLength - 1) * 0.15);
        return foodCal;
    }

    commisionMenu.addChar = (res) => {
        selectCharDiv.innerHTML = '';
        res.forEach(item => {
            let newItem = item.cloneNode(true);
            newItem.itemName = item.itemName;
            selectCharDiv.append(newItem);
        });
        commisionMenu.infoCheck();
    };

    commisionMenu.addFood = (res) => {
        selectFoodDiv.innerHTML = '';
        res.forEach(item => {
            let newItem = item.cloneNode(true);
            newItem.itemName = item.itemName;
            newItem.itemStar = item.itemStar;
            selectFoodDiv.append(newItem);
        });
        commisionMenu.infoCheck();
    };

    const eleImage = createDom('img', { classList: ['comm-ele'] });
    const infoText = createDom('p', { class: ['flex-column'], innerText: 'Duration: -'});

    commisionMenu.infoCheck = () => {
        if (selectFoodDiv.childElementCount > 0 && selectCharDiv.childElementCount > 0) {
            infoText.innerText = `Duration: ${
                Math.round(commisionMenu.calculateHour(
                                selectFoodDiv.children, 
                                selectCharDiv.childElementCount) * 10) / 10
                }h`;
        } else {
            infoText.innerText = 'Duration: -';
        }
    }

    commisionMenu.clearAdd = () => {
        selectCharDiv.innerText = '+';
        selectFoodDiv.innerText = '+';
        infoText.innerText = 'Duration: -';
    }

    commisionMenu.confirmAdd = () => {
        if (selectFoodDiv.childElementCount > 0 && selectCharDiv.childElementCount > 0) {
            return [selectCharDiv.children, selectFoodDiv.children];
        }
        return null;
    }

    const selectInfoDiv = createDom('div', {
        id: 'commission-select-info',
        class: ['flex-row', 'commission-select-div'],
        child: [
            createDom('p', {
                class: ['flex-column'],
                innerText: 'Preferred:'
            }),
            eleImage, infoText
        ]
    });

    const buildSelectEle = createDom('div', {
        id: 'build-select',
        class: ['flex-row', 'commission-select'],
        child: [ selectChar, selectFood, selectInfoDiv ]
    });

    buildSelectEle.changeComm = (commSaveValues) => {
        eleImage.src = `./assets/tooltips/elements/nut-${commSaveValues.ele}.webp`;
    }

    return buildSelectEle;
}

const COMM_TEXT = ` Certain characters are better at particular tasks. Some characters also prefer working with certain characters (E.g. Cyno and Tighnari pair great!).`
const buildStart = (commisionMenu) => {
    const commissionText = createDom('p');
    const commissionImg = createDom('img');
    const commissionDesc = createDom('p', { class: [ 'start-desc' ]});

    const commisionBack = createDom('button', {
        id: 'commission-back',
        innerText: 'Back',
    });

    const commisionReset = createDom('button', {
        innerText: 'Reset',
    });

    const commisionConfirm = createDom('button', {
        id: 'commission-confirm',
        innerText: 'Confirm',
    });

    const commissionButtonsDiv = createDom('div', {
        class: ['flex-row', 'commissions-button'], 
        child: [commisionBack, commisionReset, commisionConfirm]
    });

    const commisionStart = createDom('div', {
        id: 'commission-start',
        class: ['flex-column', 'cover-all'],
        children: [
            commissionText, commissionImg, commissionDesc, 
            buildSelect(commisionMenu), commissionButtonsDiv
        ]
    });

    commisionBack.addEventListener('click', () => {
        commisionMenu.currentComm = 0;
        commisionStart.style.display = 'none';
    });

    commisionReset.addEventListener('click', () => {
        commisionMenu.clearAdd();
    });

    commisionMenu.activate = (num, saveValues) => {
        commisionMenu.currentComm = num;
        document.getElementById('build-select').changeComm(saveValues.commDict[num]);
        commisionStart.style.display = 'flex';
        commissionText.innerText = commisionDict[num][0];
        commissionImg.src = `./assets/expedbg/comm${num + 1}-long.webp`;
        commissionDesc.innerText = commisionDict[num][1] + COMM_TEXT;
    }

    return commisionMenu.appendChild(commisionStart);
}

const buildComm = (commisionMenu, saveValues) => {
    commisionMenu.currentComm = 0;
    commisionMenu.commRows = []; 

    for (let i = 0; i < commisionDict.length; i++) {
        const commRow = buildItem(i, saveValues.commDict[i], commisionMenu);
        commisionMenu.commRows.push(commRow);
        commisionMenu.appendChild(commRow);
    }

    commisionMenu.updateAllTime = (currentTime) => {
        commisionMenu.commRows.forEach(commRow => commRow.updateTime(currentTime));
    };

    return buildStart(commisionMenu);
}

const commTable = [
    [
        ['nuts', 15],
        ['food', 1, 3, 10],
        ['food', 3, 5, 15],
        ['gem', 3, 6, 20],
        ['gem', 3, 4, 15],
        ['artifact', 1, 3, 25],
        ['talent', 2, 2, 25],
        ['potion', 3, 5, 20],
    ],
    [
        ['nuts', 25],
        ['food', 1, 3, 20],
        ['weapon', 1, 3, 10],
        ['weapon', 3, 6, 15],
        ['weapon', 3, 6, 20],
        ['artifact', 1, 3, 15],
        ['artifact', 3, 5, 15],
        ['artifact', 3, 5, 10],
        ['xp', 2, 2, 50],
        ['potion', 3, 3, 40],
    ],
    [
        ['nuts', 20],
        ['primogem', 25],
        ['artifact', 1, 3, 20],
        ['talent', 2, 4, 20],
        ['talent', 2, 4, 15],
        ['talent', 2, 3, 10],
        ['weapon', 1, 3, 25],
        ['gem', 3, 3, 25],
        ['xp', 2, 4, 40],
    ],
]

const genItems = (points, index, inventoryDraw, saveValues) => {
    const lootDict = {}
    while (points > 10) {
        const typeRoll = rollArray(commTable[index]);
        if (typeRoll[0] === 'nuts') {
            lootDict.nuts ??= 0;
            lootDict.nuts += saveValues.dps * 60 * 15;
            points -= typeRoll[1];
        } else if (typeRoll[0] === 'primogem') {
            lootDict.primogem ??= 0;
            lootDict.primogem += randomInteger(10, 20) * 15;
            points -= typeRoll[1];
        } else {
            const itemRoll = inventoryDraw(typeRoll[0], typeRoll[1], typeRoll[2], 'shop');
            lootDict[itemRoll] ??= 0; 
            lootDict[itemRoll] += 1;
            points -= typeRoll[3] * (1 + 0.5 * InventoryDefault[itemRoll].Star);
        }
    }
    return lootDict;
}

const generateCommRewards = (saveValues, index, inventoryDraw, inventoryFrame, treeOffer) => {
    const itemDict = saveValues.commDict[index];
    let power = 0;
    let log = '';
    const timeSpent = (itemDict.timeEnd - itemDict.timeStart) / 60;
    itemDict.char.forEach((char) => {
        const charDict = commisionInfo[char];
        let charPower = 300;
        for (let key in upgradeInfo) {
            if (upgradeInfo[key].Name === char) {
                if (upgradeInfo[key].Ele === itemDict.ele) {
                    charPower *= 2;
                }
                break;
            }
        }

        itemDict.char.forEach((charOther) => {
            if (charOther != char) {
                if (charDict.charLikes.includes(charOther)) {
                    charPower *= 1.25;
                } else if (charDict.charStrongLike.includes(charOther)) {
                    charPower *= 1.5;
                    log += `"${char}" pairs [green]really well[/s] with "${charOther}"!<br>`;
                } else if (charDict.charStrongDislikes.includes(charOther)) {
                    charPower *= 0.5;
                    log += `"${char}" pairs [red]terribly[/s] with "${charOther}"...<br>`;
                } else if (charDict.charDislikes.includes(charOther)) {
                    charPower *= 0.75;
                }
            }
        });
        
        if (charDict.power[index] >= 8) {
            log += `"${char}" is [green]skilled[/s] at "${commisionDict[index][0]}"!<br>`;
        } else if (charDict.power[index] <= 3) {
            log += `"${char}" is [red]unskilled[/s] at "${commisionDict[index][0]}"...<br>`;
        }

        power += charPower;
    });

    if (timeSpent > Math.E) {
        power *= Math.min(Math.log(timeSpent) * timeSpent, 1);
    } else {
        power *= timeSpent;
    }

    const lootRewards = genItems(power, index, inventoryDraw, saveValues);
    const lootDiv = createDom('div', { class: [ 'flex-row', 'commission-reward-div', 'light-green-scrollbar' ]});
    for (let key in lootRewards) {
        let itemImg;
        if (key === 'nuts') {
            const itemAmount = createDom('p', {
                classList: ['item-frame-text', 'small-font'],
                innerText: lootRewards[key].toExponential(0),
            });

            itemImg = inventoryFrame(createDom('div', {
                src: `./assets/icon/nut.webp`,
                classList: ['comm-img'],
                child: [itemAmount]
            }), { Star: 1, File:'nut' });
        } else if (key === 'primogem') {
            const itemAmount = createDom('p', {
                classList: ['item-frame-text', 'small-font'],
                innerText: lootRewards[key],
            });

            itemImg = inventoryFrame(createDom('div', {
                src: `./assets/icon/primogem.webp`,
                classList: ['comm-img'],
                child: [itemAmount]
            }), { Star: 5, File:'primogem' });
        } else {
            itemImg = inventoryFrame(createDom('div', {
                src: `./assets/tooltips/inventory/${InventoryDefault[key].File}.webp`,
                classList: ['comm-img'],
            }), InventoryDefault[key]);

            if (Object.keys(treeOffer).includes(key)) {
                let bonus = createDom('img', { classList: ['tree-bonus'], src:'./assets/expedbg/tree-item.webp' });
                itemImg.append(bonus);
            } else {
                const itemAmount = createDom('p', {
                    classList: ['item-frame-text'],
                    innerText: (lootRewards[key]),
                });
                itemImg.append(itemAmount);
            }
        }
        itemImg.itemName = [key, lootRewards[key]];
        lootDiv.appendChild(itemImg);
    }

    log = textReplacer({
        '[green]':`<span style='color:#417428'>`,
        '[red]':`<span style='color:#9E372D'>`,
        '[/s]':`</span>`,
    }, log);

    const rewardDiv = createDom('div', {
        classList: ['flex-column', 'commission-reward-container'],
        children: [
            lootDiv,
            createDom('p', {
                classList: ['commission-reward-info', 'green-scrollbar'],
                innerHTML: log,
            })
        ]
    });

    return rewardDiv;
}

export { expedInfo, createTopHalf, generateCommRewards, createEncounterHalf, createBattleHalf, resetAdventure, sapEnergy, createExpedition, buildComm }