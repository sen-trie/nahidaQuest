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


export { offerBox, updateTreeValues }