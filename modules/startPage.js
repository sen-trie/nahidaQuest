import { randomInteger } from './functions.js';
import { createDom,choiceBox,errorMesg } from './adjustUI.js';
import { startGame } from '../main.js?v=10bf854c877336fb3e26fe317e80f6ba'
import { CONSTANTS } from './constants.js';

//------------------------------------------------------------------------INITIAL SETUP------------------------------------------------------------------------//
// START SCREEN
let mainBody = document.getElementById("game");   
let startScreen = document.getElementById("start-screen");
let continueButton = document.getElementById("start-button");
let newGameButton = document.getElementById("start-delete");

window.onerror = function(message, source, lineno, colno, error) {
    errorMesg(error);
    return false;
}

window.addEventListener("message", e => {
	if (e.origin === "https://galaxy.click") {
		console.log(e.data);
	}
});

let isNewGame = (localStorage.getItem("settingsValues") === null) ? true : false; 
let startAlreadyDelay = true;
setTimeout(() => { startAlreadyDelay = false }, 500);

console.log(`======== NAHIDAQUEST! ${CONSTANTS.VERSIONNUMBER} loaded ========`);
console.log(isNewGame ? `Save File Not Found` : `Save File Found`);
if (window.location !== window.parent.location) {
    console.log("======== iFrame Version loaded ========");
    if (isNewGame) {
        console.log(`Warning: ${CONSTANTS.IFRAME_TEXT}`);
        choiceBox(startScreen, {text: "Warning"}, null, null, null, createDom('p', { id:'iframe-warn', innerText: CONSTANTS.IFRAME_TEXT }), ['notif-ele']);
    }
} 

if (!isNewGame) {
    continueButton.classList.remove("dim-filter");
    
    let startChance = randomInteger(1, 14);
    if (startChance === 1) {
        startScreen.append(createDom('img', { src: './assets/icon/nahida-start.webp', id: 'start-idle-nahida' }));
    } else if (startChance === 2) {
        startScreen.append(createDom('img', { src: './assets/icon/shop-start.webp', id: 'start-idle-dori' }));
    } else if (startChance === 3) {
        startScreen.append(createDom('img', { src: './assets/icon/scara-start.webp', id: 'start-idle-scara' }));
    }

    try {
        let settingsTemp = localStorage.getItem("settingsValues");
        let settingsValues = JSON.parse(settingsTemp);
        CONSTANTS.CHANGEFONTSIZE(settingsValues.fontSizeLevel);
    } catch (err) {
        console.error('Error checking LocalStorage');
    }
}

const launchGame = () => {
    if (startAlreadyDelay === true) return;
    startAlreadyDelay = true;

    startGame(isNewGame);
    setTimeout(() => startScreen.remove(), 100);
}

continueButton.addEventListener("click", () => {
    if (!isNewGame) launchGame();
});

newGameButton.addEventListener("click", () => {
    if (!isNewGame) {
        newGameButton.addEventListener("click", () => {
            choiceBox(startScreen, {text: 'Are you sure? Deleting your save cannot be undone!'}, null, 
                      () => {clearLocalStorage()}, undefined, null, ['choice-ele']);
        });
    } else if (isNewGame) {
        launchGame();
    }
});

let currentlyClearing = false;
function clearLocalStorage() {
    if (currentlyClearing === true) return;
    currentlyClearing = true;

    let clearPromise = new Promise(function(myResolve, myReject) {
        localStorage.clear();
        localStorage.length === 0 ? myResolve() : myReject();
    });
    
    clearPromise.then(
        (value) => {
            setTimeout(location.reload(), 200);
        },
        function(error) {console.error("Error clearing local data")}
    ); 
}

let drawUI;
(async () => {
    drawUI = await import('./drawUI.js');
    mainBody = drawUI.buildGame(mainBody);
    mainBody.style.display = "block";
})();

let copyrightText = document.getElementById("copyright-number"); 
copyrightText.innerText = CONSTANTS.COPYRIGHT;

let versionText = document.getElementById("vers-number");
versionText.innerText = CONSTANTS.VERSIONNUMBER;

let versionTextStart = document.getElementById("vers-number-start");
versionTextStart.innerText = `[${CONSTANTS.VERSIONNUMBER}] \n ${CONSTANTS.COPYRIGHT}`;

let downloadSave = document.getElementById('save-copy');
downloadSave.addEventListener('click', () => {
    CONSTANTS.DOWNLOADSAVE();
})