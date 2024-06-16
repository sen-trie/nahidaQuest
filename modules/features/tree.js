import { universalStyleCheck, abbrNum, rollArray, randomInteger } from "../functions.js";
import { createDom } from "../adjustUI.js";

const boxElement = ["Any","Pyro","Hydro","Dendro","Electro","Anemo","Cryo","Geo"];
const offerBox = (treeTable, offerItemFunction, persistentValues) => {
    const treeOffer = createDom('div', {
        id: 'tree-offer-container',
        class: ['flex-column'],
        style: { display: 'flex' }
    });
    // TODO: UPDATE TREE CORES  AND ITEMS

    const nutStoreCurrencyAmount = createDom('p', {
        innerText: abbrNum(persistentValues["goldenCore"], 2, true)
    });

    const nutStoreCurrency = createDom("div", {
        id: "tree-store-currency",
        classList: ['flex-row'],
        child: [
            nutStoreCurrencyAmount,
            createDom('img', { src: './assets/icon/core.webp' }),
        ]
    });

    const offerTitle = createDom('p', { innerHTML: 'Tree Offering' });
    const treeOfferText = document.createElement('p');
    treeOfferText.innerHTML = `The Tree wishes for power, pick one item to sacrifice.
            <br><span style='font-size: 0.6em'>Note: Anytime you receive new loot, you have a higher chance to 
            <br>get these items, which can increased through your 
            <span style='color:#b39300'>luck rate</span>!</span>`;
    
    const treeItem = createDom('div', { id: 'tree-offer-items', class:['flex-row'] });
    const treeMissingText = createDom('p', { id: 'tree-missing-text' });
    const buttonContainer = createDom('div', { class: ['flex-row', 'tree-button-container'] });

    const offerButton = document.createElement('button');
    offerButton.innerText = 'Offer';
    offerButton.classList.add('fancy-button', 'clickable');
    offerButton.addEventListener('click', () => {
        offerItemFunction();
    });

    treeTable.updateGoldenCore = () => {
        nutStoreCurrencyAmount.innerText = abbrNum(persistentValues["goldenCore"], 2, true);
    }

    buttonContainer.append(offerButton);
    treeOffer.append(offerTitle, treeOfferText, treeItem, treeMissingText, buttonContainer, nutStoreCurrency);
    treeTable.append(treeOffer);
    return treeOffer;
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

const createTreeSeedContainer = (index, persistentValues, seedAdded, seedContainer) => {
    const seedColumnContainer = document.createElement('div');
    seedColumnContainer.classList.add('seed-column');
    
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

export const createSeedContainer = (treeTable, persistentValues, saveValues, growTree, toggleDestroyButton) => {
    const seedContainer = createDom('div', { 
        classList: ['flex-row'], 
        id: 'seed-container',
        child: [ createDom('p', { innerText: 'How much are you planting?' })],
        style: { display: 'flex' }
    });

    let seedAdded = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        createTreeSeedContainer(i, persistentValues, seedAdded, seedContainer);
    }

    const plantButton = createDom('button', {
        id: 'plant-tree-seed',
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
            saveValues.treeObj.energy = 100 * seedValue;
            seedContainer.style.display = 'none';
            
            for (let i = 0; i < 3; i++) {
                persistentValues.treeSeeds[i] -= seedAdded[i];
            }

            growTree('level');
            toggleDestroyButton();
            treeTable.updateLevel();
        }
    });

    seedContainer.append(plantButton);
    treeTable.appendChild(seedContainer);

    
    treeTable.updateSeeds = () => {
        const containerChildren = Array.from(seedContainer.querySelectorAll('.seed-column'));
        for (let i = 0; i < 3; i++) {
            containerChildren[i].updateValue();
        }
    }
    return seedContainer;
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

export { offerBox, updateTreeValues, generateTreeExplosion, treeBackButton }