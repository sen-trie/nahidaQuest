import { randomInteger } from './functions.js';
import { createDom, choiceBox } from './adjustUI.js';
import { startGame } from '../main.js'

const VERSIONNUMBER = "V.1-02-002b";
const COPYRIGHT = "DISCLAIMER © HoYoverse.  \n All rights reserved. This site is not affiliated \n with Hoyoverse, nor Genshin Impact.";
const DBNUBMER = (VERSIONNUMBER.split(".")[1]).replaceAll("-","");
//------------------------------------------------------------------------INITIAL SETUP------------------------------------------------------------------------//
// START SCREEN
let mainBody = document.getElementById("game");   
let startScreen = document.getElementById("start-screen");
let continueButton = document.getElementById("start-button");
let newGameButton = document.getElementById("start-delete");

let isNewGame = (localStorage.getItem("settingsValues") === null) ? true : false; 
let startAlreadyDelay = true;
setTimeout(() => { startAlreadyDelay = false }, 500);

if (!isNewGame) {
    let startChance = randomInteger(1, 14);
    if (startChance === 1) {
        startScreen.append(createDom('img', { src: './assets/icon/nahida-start.webp', id: 'start-idle-nahida' }));
    } else if (startChance === 2) {
        startScreen.append(createDom('img', { src: './assets/icon/shop-start.webp', id: 'start-idle-dori' }));
    } else if (startChance === 3) {
        startScreen.append(createDom('img', { src: './assets/icon/scara-start.webp', id: 'start-idle-scara' }));
    }

    continueButton.classList.remove("dim-filter");
}

const launchGame = () => {
    if (startAlreadyDelay === true) return;
    startAlreadyDelay = true;
    startGame(isNewGame);
    setTimeout(() => (startScreen.remove(), 100));
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
copyrightText.innerText = COPYRIGHT;

let versionText = document.getElementById("vers-number");
versionText.innerText = VERSIONNUMBER;

let versionTextStart = document.getElementById("vers-number-start");
versionTextStart.innerText = `[${VERSIONNUMBER}] \n ${COPYRIGHT}`;