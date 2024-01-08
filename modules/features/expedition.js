import { expeditionDictInfo, imgKey } from "../dictData.js";
import { createDom } from "../adjustUI.js";

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
        lootInfo.appendChild(invDiv)

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

const resetAdventure = (dodgeOn, fightBgmElement, fightWinElement, adventureVariables, bgmElement) => {
    const adventureChoiceOne = document.getElementById("adv-button-one");
    adventureChoiceOne.style.display = "block";
    adventureChoiceOne.innerText = "Leave";

    const adventureFightDiv = document.getElementById("adventure-fight");
    adventureFightDiv.style.display = "none";
    const adventureEncounter = document.getElementById("adventure-encounter");
    adventureEncounter.style.display = "flex";

    const adventureVideo = document.getElementById('adventure-video');
    const targetElements = adventureVideo.querySelectorAll('.atk-indicator, .select-indicator, .raining-image, .health-bar, .health-bar-scara, .skill-mark, .counter-button, .energy-burst');
    targetElements.forEach((item) => {
        item.remove();
    });

    const leftOverEnemy = adventureVideo.querySelectorAll('.enemy');
    leftOverEnemy.forEach((ele) => {
        ele.style.filter = 'grayscale(100%) brightness(20%)';
    })

    const leftOverImg = adventureVideo.querySelectorAll('.enemyImg');
    leftOverImg.forEach((ele) => {
        ele.style.animation = '';
    })

    setTimeout(()=>{
        dodgeOn("close");
        fightBgmElement.pause();
        fightWinElement.load();
        fightWinElement.play();
        fightWinElement.addEventListener('ended', () => {
            setTimeout(()=>{
                if (!adventureVariables.fightSceneOn) {
                    bgmElement.play()
                }
            }, 300);
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

const createBattleText = (text, timer, container) => {
    let textBox = document.createElement("img");
    textBox.classList.add("flex-column","battle-text")
    textBox.src = `./assets/expedbg/${text}.webp`;
    setTimeout(()=>{textBox.remove()}, timer);
    container.append(textBox);
    return container;
}

const comboHandler = (type, ele) => {
    if (type === "create") {
        let comboNumber = document.createElement("p");
        comboNumber.id = "combo-number";
        comboNumber.combo = 0;
        comboNumber.maxCombo = 0;
        comboNumber.innerText = `Combo: \n ${comboNumber.combo}`;
        ele.appendChild(comboNumber);
        return ele;
    } else if (type === "add") {
        let comboNumber = document.getElementById("combo-number");
        comboNumber.combo++;
        comboNumber.innerText = `Combo: \n ${comboNumber.combo}`;
        if (comboNumber.maxCombo < comboNumber.combo) {comboNumber.maxCombo = comboNumber.combo}

        comboNumber.style.animation = "";
        void comboNumber.offsetWidth;
        comboNumber.style.animation = "tallyCount 1s ease";
    } else if (type === "reset") {
        let comboNumber = document.getElementById("combo-number");
        comboNumber.combo = 0;
        comboNumber.innerText = `Combo: \n ${comboNumber.combo}`;

        comboNumber.style.animation = "";
        void comboNumber.offsetWidth;
        comboNumber.style.animation = "tallyCount 1s ease";
    } else if (type === "check") {
        let comboNumber = document.getElementById("combo-number");
        let multiplierThreshold = Math.floor(comboNumber.combo / 3) * 0.25;
        return (ele + multiplierThreshold);
    }
}

// SINGLE USE
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

export { expedInfo, createTopHalf, createEncounterHalf, createBattleHalf, resetAdventure, sapEnergy, createBattleText, comboHandler }