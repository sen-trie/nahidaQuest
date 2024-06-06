import { randomInteger } from './functions.js';
import { createDom,choiceBox,errorMesg } from './adjustUI.js';
import { startGame } from '../main.js?v=3b3f57babfa956fd103bc8a06081db80'
import { CONSTANTS } from './constants.js';
import { buildSaves } from './features/settings.js';

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

let isNewGame = (localStorage.getItem("save-0") === null) ? true : false; 
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

    // try {
    //     let settingsTemp = localStorage.getItem("settingsValues");
    //     let settingsValues = JSON.parse(settingsTemp);
    //     CONSTANTS.CHANGEFONTSIZE(settingsValues.fontSizeLevel);
    // } catch (err) {
    //     console.error('Error checking LocalStorage');
    // }
} 

CONSTANTS.CHANGEFONTSIZE(5);

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
        choiceBox(startScreen, {text: 'Are you sure? This will delete your autosave. This action cannot be undone!'}, null, 
                    () => {clearLocalStorage()}, undefined, null, ['choice-ele']);
    } else if (isNewGame) {
        launchGame();
    }
});

let currentlyClearing = false;
function clearLocalStorage() {
    if (currentlyClearing === true) return;
    currentlyClearing = true;

    let clearPromise = new Promise(function(myResolve, myReject) {
        localStorage.removeItem('save-0');
        localStorage.getItem('save-0') == null ? myResolve() : myReject();
    });
    
    clearPromise.then(
        (value) => {
            setTimeout(launchGame(), 200);
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

const copyrightText = document.getElementById("copyright-number"); 
copyrightText.innerText = CONSTANTS.COPYRIGHT;

const versionText = document.getElementById("vers-number");
versionText.innerText = CONSTANTS.VERSIONNUMBER;

const versionTextStart = document.getElementById("vers-number-start");
versionTextStart.innerText = `[${CONSTANTS.VERSIONNUMBER}] \n ${CONSTANTS.COPYRIGHT}`;

const exportBox = createDom('div', {
    class: ['export-box'],
    child: [buildSaves(localStorage, false, launchGame)],
});

const downloadSave = document.getElementById('save-copy');
downloadSave.addEventListener('click', () => {
    choiceBox(startScreen, {text: 'Save Manager', yes:'Exit'}, null, 
              () => {}, null, exportBox, ['notif-ele', 'save-manager']);
})