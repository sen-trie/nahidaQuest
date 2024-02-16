import { createDom } from "../adjustUI.js";
import { deepCopy, rollArray, randomInteger } from "../functions.js";

const FRAMES_PER_SECOND = 60;
const interval = Math.floor(1000 / FRAMES_PER_SECOND);

const createBattleText = (text, timer, container) => {
    let textBox = document.createElement("img");
    textBox.classList.add("flex-column","battle-text")
    textBox.src = `./assets/expedbg/${text}.webp`;
    setTimeout(()=>{textBox.remove()}, timer);
    container.append(textBox);
    return container;
}

const canvasHandler = (canvasEle, canvasImg, adventureVariables, addFunc = {}) => {
    canvasEle.brightness = 1;

    canvasImg.onload = () => {
        canvasEle.width = canvasImg.naturalWidth;
        canvasEle.height = canvasImg.naturalHeight;

        let ctx = canvasEle.getContext("2d");
        ctx.drawImage(canvasImg, 0, 0);
        let brightnessIncrement = 0.001;

        let previousTime = performance.now();
        let variables = {
            currentTime: 0,
        }
        let currentTime = 0;
        let deltaTime = 0;
        let exitCanvas = false;

        window.requestAnimationFrame(increaseGlow);
        function increaseGlow(timestamp) {
            if (!adventureVariables.fightSceneOn || exitCanvas) {return}
            if (addFunc.preCalc) { addFunc.preCalc() }
            
            currentTime = timestamp;
            deltaTime = currentTime - previousTime;
            
            if (deltaTime > interval) {
                canvasEle.brightness += brightnessIncrement;
                if (addFunc.postCalc) { addFunc.postCalc() }
                if (canvasEle.brightness > 3) {
                    canvasEle.remove();
                    return;
                }
            }
            window.requestAnimationFrame(increaseGlow);
        }
    }

    return canvasEle;
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

const drawBattleHealth = (adventureScaraText, battleVariables) => {
    let healthDiv = document.getElementById("adventure-health");
    healthDiv.style.opacity = 1;

    let healthBar = document.getElementById("health-bar");
    healthBar.currentWidth = 100;
    healthBar.classList.add("adventure-health");
    healthBar.style.width = "100%";

    if (adventureScaraText) {
        healthDiv.classList.add("adventure-scara-health");
        healthBar.classList.add("adventure-scara-barHealth");
    } else {
        if (healthDiv.classList.contains("adventure-scara-health")) {healthDiv.classList.remove("adventure-scara-health")}
        if (healthBar.classList.contains("adventure-scara-barHealth")) {healthBar.classList.remove("adventure-scara-barHealth")}
    };

    for (let i = 0; i < battleVariables.maxHealth; i++) {
        let health = document.createElement("div");
        health.classList.add("heart-bit","flex-column");
        if (adventureScaraText) {health.style.borderRight = "0.1em solid #333553"};

        let healthImg = new Image();
        healthImg.src = `./assets/icon/health${adventureScaraText}.webp`;
        health.appendChild(healthImg)
        healthDiv.append(health);
    }
}

const cytusQuicktime = (quicktimeBar, textOverlay, usedDict, quitQuicktime, adventureScaraText, battleVariables, adventureVariables, bossUpdate) => {
    textOverlay.classList.add("flex-column");
    textOverlay.style.justifyContent = 'space-around';
    textOverlay.style.padding = '0 15%';
    textOverlay.style.boxSizing = 'border-box';

    const textBox = document.createElement('p');
    textBox.classList.add('flex-column')
    textBox.innerText = "Avoid being hit by the attacks!";
    textBox.style.width = '50%'
    textBox.style.height = '100%';
    textOverlay.appendChild(textBox);

    quicktimeBar.id = "quicktime-bar";
    quicktimeBar.state = null;
    quicktimeBar.classList.add("flex-row","quicktime-block");

    const quickImg = new Image();
    quickImg.src = "./assets/expedbg/quicktime-block.webp";
    quickImg.classList.add("cover-all");
    quickImg.style.zIndex = 1;

    const quicktimeCytus = createDom('div', { class: ['quicktime-osu'] });
    for (let i = 0; i < 3; i++) {
        const cytusLine = createDom('b', {
            class: ['cytus-line'],
            style: {
                top: ((i + 1) * 25) + '%',
            }
        })
        quicktimeCytus.append(cytusLine);
    }

    const adventureGif = document.getElementById('adventure-gif');
    const cytusHead = adventureGif.cloneNode(false);
    adventureGif.style.display = 'none';

    cytusHead.classList.add('cytus-head');
    cytusHead.style.top = '50%';
    quicktimeCytus.appendChild(cytusHead);

    let activeRow = 1;
    let finalSequence = false;
    let hitCount = 0;
    let invincibleFrame = false;
    const controlledRows = [[], [], []];

    const arrowArray = ['down','up'];
    for (let i = 1; i > -1; i--) {
        const img = createDom('img', {
            src: `./assets/expedbg/battle-${arrowArray[i]}${adventureScaraText}.webp`,
            style: {
                height: '49%',
                position: 'unset',
            }
        });

        img.addEventListener("click", () => {
            if (i === 1) {
                activeRow = Math.max(--activeRow, 0);
            } else {
                activeRow = Math.min(++activeRow, 2);
            }

            cytusHead.style.top = ((activeRow + 1) * 25) + '%';
        })
        textOverlay.appendChild(img);
    }


    const checkCollision = () => {
        if (controlledRows[activeRow].length > 0) {
            if (invincibleFrame) {
                return;
            } else {
                invincibleFrame = true;
                cytusHead.classList.add("damaged");
                cytusHead.damagedState = setTimeout(() => {
                    cytusHead.classList.remove("damaged");
                    invincibleFrame = false;
                    hitCount++;
                }, 300);
            }
        }
    }

    let beatArray = deepCopy(rollArray(usedDict));
    const maxBeat = beatArray.length;
    let mirrorAll = randomInteger(1, 3) === 1 ? true : false;
    let beatCount = 10;

    const spawnBeat = (counter) => {
        const currentBeat = beatArray[0];
        beatArray.shift();   

        const re = new RegExp('X', 'g');
        const XCount = currentBeat[2].match(re).length;

        const activeBeats = [];
        let progress = 0;
        let spawnNextBeat = 0;
        let spawnedAlready = false;

        const modifier = currentBeat[3] === null ? '' : currentBeat[3];
        let mirrorSequence = currentBeat[4] === undefined ? false : true;
        mirrorSequence = mirrorAll === true ? !(mirrorSequence) : mirrorSequence;

        for (let i = 0; i < currentBeat[2].length; i++) {
            if (currentBeat[2][i] === 'X') {
                const rowBeat = createDom('img', {
                    src: `./assets/expedbg/${modifier}Purple.webp`,
                    row: i,
                    class: ['cytus-beat'],
                    style: {
                        zIndex: beatCount,
                        left: mirrorSequence ? 'unset' : 0,
                        right: mirrorSequence ? 0 : 'unset',
                        top: ((i + 1) * 25) + '%',
                        transform: mirrorSequence ? `translate(50%, -55%) scaleX(-1)` : `translate(-50%, -55%)`,
                    }
                });

                beatCount++;

                if (modifier === 'Bullet-') {
                    rowBeat.style.transform = mirrorSequence ? 'translate(50%, -55%)' : `translate(-50%, -55%) scaleX(-1)`; 
                    let warnImage = createDom('img', { 
                        src: `./assets/expedbg/Warning-Purple.webp`,
                        class: ["cytus-warn", 'cytus-beat'],
                        style: {
                            left: mirrorSequence ? 'unset' : 0,
                            right: mirrorSequence ? 0 : 'unset',
                            top: ((i + 1) * 25) + '%',
                            transform: mirrorSequence ? `translate(50%, -55%) scaleX(-1)` : `translate(-50%, -55%)` ,
                        }
                    });

                    warnImage.addEventListener('animationend', () => {
                        quicktimeCytus.appendChild(rowBeat);
                        activeBeats.push(rowBeat)
                        warnImage.remove();
                    })
                    
                    quicktimeCytus.append(warnImage);
                } else {
                    rowBeat.onload = () => {
                        activeBeats.push(rowBeat)
                        quicktimeCytus.appendChild(rowBeat);
                        
                    }
                }
            }
        }

        const interval = Math.floor(1000 / 60);
        let previousTime = performance.now();
        let currentTime = 0;
        let deltaTime = 0;
        let thresholdReached = false;

        function animateMovement(timestamp) {
            currentTime = timestamp;
            deltaTime = currentTime - previousTime;
            
            if (deltaTime > interval) {
                activeBeats.forEach((beat) => {
                    const progressIncrement = currentBeat[0] / 1000 / XCount;
                    if (modifier === 'Boomer-') {
                        if (thresholdReached) {
                            beat.style.transform = `${mirrorSequence ? 'translate(50%, -55%)' : 'translate(-50%, -55%) scaleX(-1)'} rotate(${progress / 95 * 360 * 2}deg)`;
                            progress -= progressIncrement * 1.7;
                            spawnNextBeat += progressIncrement;
                        } else if (progress < 95) {
                            beat.style.transform = `${mirrorSequence ? 'translate(50%, -55%)' : 'translate(-50%, -55%) scaleX(-1)'} rotate(${progress / 95 * 360 * 2}deg)`;
                            progress += progressIncrement * 1.4;
                            spawnNextBeat += progressIncrement;
                        } else {
                            thresholdReached = true;
                        }
                    // ACCELERATIING AND DECELERATING MOTION
                    } else if (modifier === 'Bullet-') {
                        progress += progressIncrement * (3 - 0.8 * (progress / 100));
                        spawnNextBeat += progressIncrement;
                    } else if (modifier === 'Circle-') {
                        progress += progressIncrement * (0.3 + 2 * (progress / 100));
                        spawnNextBeat += progressIncrement;
                    // STANDARD MOTION
                    } else {
                        progress += progressIncrement;
                        spawnNextBeat += progressIncrement;
                    }

                    mirrorSequence === true ? (beat.style.right = progress + '%') : (beat.style.left = progress + '%');

                    if (progress > 41 && progress < 53) {
                        if (!controlledRows[beat.row].includes(beat)) {
                            controlledRows[beat.row].push(beat);
                        }
                    } else {
                        if (controlledRows[beat.row].includes(beat)) {
                            controlledRows[beat.row].splice(controlledRows[beat.row].indexOf(beat), 1);
                        }

                        if (progress > 100 || progress < 0) {
                            beat.style.display = 'none';
                            if (spawnedAlready) {
                                beat.remove();
                                return;
                            } else if (maxBeat === counter && !finalSequence) {
                                beat.remove();
                                finalSequence = true;

                                setTimeout(() => {
                                    textBox.innerHTML = `You were hit ${hitCount}</span> times!`;
                                    setTimeout(() => {
                                        let atkLevel = 2;
                                        if (adventureVariables.specialty === 'Finale' || adventureVariables.specialty === 'Workshop') {
                                            atkLevel = 2.5;
                                        }

                                        quitQuicktime(atkLevel, null, hitCount);
                                        if (battleVariables.lastStand) {
                                            const bossEleHealth = document.getElementById('adventure-video').querySelector('.megaboss > .health-bar');
                                            if (bossEleHealth) { bossEleHealth.style.width = `0%` }
                                            bossUpdate(0);
                                        }
                                        adventureGif.style.display = 'block';
                                    }, 2000);
                                }, 1500)
                                return;
                            }
                        }
                    }
                })

                if (beatArray.length > 0 && !spawnedAlready && spawnNextBeat >= beatArray[0][1]) {
                    counter++;
                    spawnBeat(counter);
                    spawnedAlready = true;
                }
            }
        
            checkCollision();
            window.requestAnimationFrame(animateMovement);
        }

        window.requestAnimationFrame(animateMovement);
    }

    setTimeout(() => {
        spawnBeat(1);
    }, 500)

    quicktimeBar.append(quickImg, quicktimeCytus);
    return quicktimeBar;
}

export { canvasHandler, drawBattleHealth, comboHandler, createBattleText, cytusQuicktime }