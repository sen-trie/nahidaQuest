import { universalStyleCheck } from "../functions.js";
import { createDom } from "../adjustUI.js";

const offerBox = (treeTable, optionsContainer, offerItemFunction) => {
    const treeOffer = createDom('div', {
        id: 'tree-offer-container',
        class: ['flex-column'],
        style: { display: 'none' }
    });

    const nutStoreCurrency = document.createElement("div");
    nutStoreCurrency.id = "tree-store-currency";
    nutStoreCurrency.classList.add("flex-row");
    nutStoreCurrency.innerText = abbrNum(persistentValues["goldenCore"],2,true);
    const nutStoreCurrencyImage = document.createElement("img");
    nutStoreCurrencyImage.src = "./assets/icon/core.webp";
    nutStoreCurrency.appendChild(nutStoreCurrencyImage);

    const treeOfferText = document.createElement('p');
    treeOfferText.innerHTML = `The Tree wishes for power, pick one item to sacrifice.
            <br><span style='font-size: 0.6em'>Note: Anytime you receive new loot, you have a higher chance to 
            <br>get these items, which can increased through your 
            <span style='color:#b39300'>luck rate</span>!</span>`;
    
    const treeItem = document.createElement('div');
    treeItem.id = 'tree-offer-items';
    treeItem.classList.add('flex-row');

    const treeMissingText = document.createElement('p');
    treeMissingText.id = 'tree-missing-text';

    const buttonContainer = document.createElement('container');
    buttonContainer.classList.add('flex-row');

    const backButton = createDom('button', {
        innerText: 'Back',
        id: 'tree-offer-button'
    });

    backButton.addEventListener('click', () => {
        universalStyleCheck(optionsContainer,"display","flex","none");
        universalStyleCheck(treeOffer,"display","none","flex");
    });

    const offerButton = document.createElement('button');
    offerButton.innerText = 'Offer';
    offerButton.addEventListener('click', () => {
        offerItemFunction();
    })

    buttonContainer.append(backButton, offerButton);
    treeOffer.append(treeOfferText, treeItem, treeMissingText, buttonContainer, nutStoreCurrency);
    treeTable.append(treeOffer);
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
        treeProgressValue.innerText = `Growth: ${treeObj.growthRate} x`;
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
    
    let seedImg = new Image();
    seedImg.src = `./assets/tooltips/inventory/seed-${index + 1}.webp`;

    let seedNumber = document.createElement('p');
    seedNumber.amount = 0;
    seedNumber.innerText = `0 / ${persistentValues.treeSeeds[index]}`;

    let seedDecrement = document.createElement('button');
    let seedIncrement = document.createElement('button');
    let seedMegaDecrement = document.createElement('button');
    let seedMegaIncrement = document.createElement('button');

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

    seedDecrement.innerText = '-';
    seedDecrement.addEventListener('click', () => {
        incrementValue(-1);
    });
    
    seedIncrement.innerText = '+';
    seedIncrement.addEventListener('click', () => {
        incrementValue(1);
    });

    seedMegaDecrement.innerText = '--';
    seedMegaDecrement.addEventListener('click', () => {
        incrementValue(-10);
    });

    seedMegaIncrement.innerText = '++';
    seedMegaIncrement.addEventListener('click', () => {
        incrementValue(10);
    });

    seedColumnContainer.updateValue = () => {
        seedNumber.innerText = `0 / ${persistentValues.treeSeeds[index]}`;
    }

    seedColumnContainer.append(seedImg, seedNumber, seedMegaDecrement, seedDecrement, seedIncrement, seedMegaIncrement);
    seedContainer.append(seedColumnContainer);
}

const updateSeedContainer = (updateValueOnly = false, persistentValues, saveValues, growTree, treeOptions) => {
    if (document.getElementById('seed-container')) { return }
    const seedContainer = document.getElementById('seed-container');

    if (updateValueOnly) {
        const containerChildren = Array.from(seedContainer.children);
        for (let index = 0; index < 3; index++) {
            containerChildren[index].updateValue();
        }
    } else {
        let seedAdded = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
            createTreeSeedContainer(index, persistentValues, seedAdded);
        }

        const backButton = createDom('button', {
            innerText: 'Back',
            style: { transform: 'translateX(-105%)' }
        });

        backButton.addEventListener('click', () => {
            Tree.updateTreeValues(true, saveValues.treeObj);
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

                for (let i = 0; i < 3; i++) {
                    persistentValues.treeSeeds[i] -= seedAdded[i];
                }
            }
        });
        seedContainer.append(backButton, plantButton);
    }
}

export { offerBox, updateTreeValues, pickTree, updateSeedContainer }