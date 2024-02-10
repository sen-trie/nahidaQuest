import { universalStyleCheck, abbrNum, rollArray, randomInteger } from "../functions.js";
import { createDom } from "../adjustUI.js";

const boxElement = ["Any","Pyro","Hydro","Dendro","Electro","Anemo","Cryo","Geo"];
const offerBox = (treeTable, optionsContainer, offerItemFunction, persistentValues) => {
    const treeOffer = createDom('div', {
        id: 'tree-offer-container',
        class: ['flex-column'],
        style: { display: 'none' }
    });

    const nutStoreCurrency = document.createElement("div");
    nutStoreCurrency.id = "tree-store-currency";
    nutStoreCurrency.classList.add("flex-row");
    nutStoreCurrency.innerText = abbrNum(persistentValues["goldenCore"], 2, true);
    nutStoreCurrency.appendChild(createDom('img', { src: './assets/icon/core.webp' }));

    const treeOfferText = document.createElement('p');
    treeOfferText.innerHTML = `The Tree wishes for power, pick one item to sacrifice.
            <br><span style='font-size: 0.6em'>Note: Anytime you receive new loot, you have a higher chance to 
            <br>get these items, which can increased through your 
            <span style='color:#b39300'>luck rate</span>!</span>`;
    
    const treeItem = createDom('div', { id: 'tree-offer-items', class:['flex-row'] });
    const treeMissingText = createDom('p', { id: 'tree-missing-text' });
    const buttonContainer = createDom('div', { class: ['flex-row', 'tree-button-container'] });
    const backButton = createDom('button', { innerText: 'Back', id: 'tree-offer-button', class:['fancy-button', 'clickable'] });

    backButton.addEventListener('click', () => {
        universalStyleCheck(optionsContainer, "display", "flex", "none");
        universalStyleCheck(treeOffer, "display", "none", "flex");
    });

    const offerButton = document.createElement('button');
    offerButton.innerText = 'Offer';
    offerButton.classList.add('fancy-button', 'clickable');
    offerButton.addEventListener('click', () => {
        offerItemFunction();
    })

    buttonContainer.append(backButton, offerButton);
    treeOffer.append(treeOfferText, treeItem, treeMissingText, buttonContainer, nutStoreCurrency);
    treeTable.append(treeOffer);
}

const treeBackButton = (backContainer) => {
    const backButton = document.createElement('button');
    backButton.innerText = 'Back';
    backButton.classList.add('fancy-button', 'clickable');
    backButton.addEventListener('click', () => {
        universalStyleCheck(document.getElementById('options-container'),"display","flex","none");
        universalStyleCheck(backContainer,"display","none","flex");
    });

    return backButton;
}

const updateTreeValues = (turnZero = false, treeObj) => {
    const treeProgress = document.getElementById('tree-progress');
    const treeProgressValue = document.getElementById('tree-progress-value');
    const palmEnergy = document.getElementById('palm-text');

    if (turnZero) {
        treeProgress.progress = 0;
        treeProgress.style.width = 0;
        treeProgressValue.rate = 0;
        treeProgressValue.innerText = 'Growth: 0x';
        palmEnergy.innerText = 'Palm Energy: 0';
    } else {
        treeProgressValue.rate = treeObj.growthRate / 25;
        treeProgressValue.innerText = `Growth: ${treeObj.growthRate}x`;
        palmEnergy.innerText = `Palm Energy: ${treeObj.energy}`;
    }
}

const pickTree = () => {
    const palmEnergy = document.getElementById('palm-text');
    palmEnergy.innerText = 'How much are you planting?';

    while (document.getElementById('options-container').firstChild) {document.getElementById('options-container').firstChild.remove()}
    const seedContainer = createDom('div', { classList: ['flex-row'], id: 'seed-container' });
    document.getElementById('tree-table').appendChild(seedContainer);
}

const createTreeSeedContainer = (index, persistentValues, seedAdded) => {
    const seedContainer = document.getElementById('seed-container');
    const seedColumnContainer = document.createElement('div');
    seedColumnContainer.classList.add('seed-column')
    
    const seedImg = new Image();
    seedImg.src = `./assets/tooltips/inventory/seed-${index + 1}.webp`;

    const seedNumber = createDom('p', { innerText: `0 / ${persistentValues.treeSeeds[index]}` });
    seedNumber.amount = 0;

    const incrementValue = (change) => {
        if (seedNumber.amount + change >= 0 && seedNumber.amount + change <= persistentValues.treeSeeds[index]) {
            seedNumber.amount += change;
        } else if (change > 1 && persistentValues.treeSeeds[index] - seedNumber.amount < change) {
            seedNumber.amount = persistentValues.treeSeeds[index];
        } else if (change < -1 && seedNumber.amount < (change * -1)) {
            seedNumber.amount = 0;
        }

        seedNumber.innerText = `${seedNumber.amount} / ${persistentValues.treeSeeds[index]}`;
        seedAdded[index] = seedNumber.amount;
    }

    const seedDecrement = createDom('button', { innerText: '-' });
    seedDecrement.addEventListener('click', () => { incrementValue(-1) });

    const seedIncrement = createDom('button', { innerText: '+' });
    seedIncrement.addEventListener('click', () => { incrementValue(1) });

    const seedMegaDecrement = createDom('button', { innerText: '--' });
    seedMegaDecrement.addEventListener('click', () => { incrementValue(-10) });

    const seedMegaIncrement = createDom('button', { innerText: '++' });
    seedMegaIncrement.addEventListener('click', () => { incrementValue(10) });
   
    seedColumnContainer.updateValue = () => {
        seedNumber.innerText = `0 / ${persistentValues.treeSeeds[index]}`;
    }

    seedColumnContainer.append(seedImg, seedNumber, seedMegaDecrement, seedDecrement, seedIncrement, seedMegaIncrement);
    seedContainer.append(seedColumnContainer);
}

const updateSeedContainer = (updateValueOnly = false, persistentValues, saveValues, growTree, treeOptions, toggleDestroyButton) => {
    if (!document.getElementById('seed-container')) { return }
    const seedContainer = document.getElementById('seed-container');

    if (updateValueOnly) {
        const containerChildren = Array.from(seedContainer.children);
        for (let i = 0; i < 3; i++) {
            containerChildren[i].updateValue();
        }
    } else {
        let seedAdded = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
            createTreeSeedContainer(i, persistentValues, seedAdded);
        }

        const backButton = createDom('button', {
            innerText: 'Back',
            style: { transform: 'translateX(-105%)' }
        });

        backButton.addEventListener('click', () => {
            updateTreeValues(true, saveValues.treeObj);
            seedContainer.remove();
            treeOptions(false, document.getElementById('options-container'));
        });

        const plantButton = createDom('button', {
            innerText: 'Plant!',
            style: { transform: 'translateX(5%)' }
        });

        plantButton.addEventListener('click', () => {
            let seedValue = 0;
            let seedNum = 1;
            for (let i = 0; i < seedAdded.length; i++) {
                seedValue += seedAdded[i] * (i + 1)**3;
                seedNum *= Math.max(Math.log(((seedAdded[i] * (i + 1)) + 1)), 1);
            }

            if (seedValue > 0) {
                saveValues.treeObj.growthRate = Math.round(seedNum * 100) / 100;
                seedContainer.remove();

                saveValues.treeObj.energy = 100 * seedValue;
                growTree('level');
                toggleDestroyButton();

                for (let i = 0; i < 3; i++) {
                    persistentValues.treeSeeds[i] -= seedAdded[i];
                }
            }
        });
        seedContainer.append(backButton, plantButton);
    }
}

const generateTreeExplosion = (amount = 1) => {
    const treeContainer = document.getElementById('tree-container');
    for (let index = 0; index < amount; index++) {
        const randomAngle = Math.random() * 2 * Math.PI;
        const rotationAxis = randomInteger(0, 360);
        const explodeImg = createDom('img', { 
            src: `./assets/tooltips/inventory/solid${rollArray(boxElement, 1)}.webp`,
            classList: ['tree-explode-img'],
            style: { transform: `rotate(${rotationAxis}deg)` }
        });

        treeContainer.append(explodeImg);
        setTimeout(() => {
            explodeImg.style.transform  = `rotate(${rotationAxis}deg) translate(${randomInteger(100, 225) * Math.cos(randomAngle)}%, ${randomInteger(100, 225) * Math.sin(randomAngle)}%)`;
            setTimeout(() => {
                explodeImg.style.opacity = 0.1;
                setTimeout(() => {
                    explodeImg.remove();
                }, 1000);
            }, 4500);
        }, 10);
    }
}

export { offerBox, updateTreeValues, pickTree, updateSeedContainer, generateTreeExplosion, treeBackButton }