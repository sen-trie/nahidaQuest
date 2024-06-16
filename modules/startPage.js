import { randomInteger } from './functions.js';
import { createDom,choiceBox,errorMesg } from './adjustUI.js';
import { startGame } from '../main.js?v=a7217492c176d4534fc371d914c4fd97'
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
let newFontSize;
setTimeout(() => { startAlreadyDelay = false }, 500);

console.log(`======== NAHIDAQUEST! ${CONSTANTS.VERSIONNUMBER} loaded ========`);
console.log(isNewGame ? `Save File Not Found` : `Save File Found`);
if (window.location !== window.parent.location) {
    console.log("======== iFrame Version loaded ========");
} 

if (isNewGame) {
    let noSaveLoaded = true;
    for (let i = 1; i < 6; i++) {
        if (localStorage.getItem(`save-${i}`) !== null) {
            noSaveLoaded = false;
        }
    } 
    if (noSaveLoaded && localStorage.getItem('fontSize') == null) {
        console.log(`Warning: ${CONSTANTS.IFRAME_TEXT}`);
        const fontDivCompare = createDom('div', {
            class: ['flex-row', 'font-compare'],
            child: [
                createDom('p', { innerText: `Adjust this box \n until it's about the  \n same height as the \n image on the right. \n Align them using \n the top and \n bottom edges.` }),
                createDom('img', { src: './assets/tooltips/hero/Dehya.webp' }),
            ]
        });

        const fontNumber = createDom('p', { innerText: `5` });
        fontNumber.amount = 5;

        const incrementValue = (change) => {
            if (fontNumber.amount + change > 0 && fontNumber.amount + change < 11) {
                fontNumber.amount += change;
            }

            localStorage.setItem('fontSize', fontNumber.amount);
            newFontSize = fontNumber.amount;
            fontNumber.innerText = fontNumber.amount;
            CONSTANTS.CHANGEFONTSIZE(fontNumber.amount);
        }

        const fontDecrement = createDom('button', { innerText: '-' });
        fontDecrement.addEventListener('click', () => { incrementValue(-1) });

        const fontIncrement = createDom('button', { innerText: '+' });
        fontIncrement.addEventListener('click', () => { incrementValue(1) });
    
        const fontDivChange = createDom('div', {
            class: ['flex-row', 'font-change'],
            child: [fontDecrement, fontNumber, fontIncrement]
        });
        const fontDiv = createDom('div', {
            class: ['flex-column'],
            child: [fontDivCompare, fontDivChange,
                    createDom('p', { 
                        innerText: 'The alignment does not have to be exact. \n This can be further changed under Settings later.',
                        style: {
                            textAlign: 'center'
                        }
                     })]
        })
        choiceBox(startScreen, {text: "Font Size Configuration"}, null, null, null, fontDiv, ['notif-ele']);
    }
} else {
    continueButton.classList.remove("dim-filter");
    let startChance = randomInteger(1, 14);
    if (startChance === 1) {
        startScreen.append(createDom('img', { src: './assets/icon/nahida-start.webp', id: 'start-idle-nahida' }));
    } else if (startChance === 2) {
        startScreen.append(createDom('img', { src: './assets/icon/shop-start.webp', id: 'start-idle-dori' }));
    } else if (startChance === 3) {
        startScreen.append(createDom('img', { src: './assets/icon/scara-start.webp', id: 'start-idle-scara' }));
    }
} 

if (localStorage.getItem('fontSize')) {
    try {
        CONSTANTS.CHANGEFONTSIZE(parseInt(localStorage.getItem('fontSize')));
    } catch {
        CONSTANTS.CHANGEFONTSIZE(5);
    }
} else {
    CONSTANTS.CHANGEFONTSIZE(5);
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