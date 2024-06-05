import { createDom, choiceBox } from "../adjustUI.js"
import { CONSTANTS } from "../constants.js";
import { convertTo24HourFormat } from "../functions.js";

const statsArray = {
    'timeSpentValue': 'Time Spent:', 
    'lifetimeClicksValue': 'Big Nahida Clicks:',  
    'itemsUsedValue': 'Items Used:', 
    'lifetimeLevelsValue': 'Character Levels Purchased:',
    'lifetimeEnergyValue': 'Cumulative Energy:', 
    'lifetimePrimoValue': 'Cumulative Primogems:', 
    'aranaraEventValue': 'Aranara Events Witnessed:', 
    'aranaraLostValue': 'Aranara Events Lost:', 
    'enemiesDefeatedValue': 'Enemies Defeated:', 
    'commissionsCompletedValue': 'Commisions Completed:', 
    'transcendValue': 'Times Transcended:',
    'harvestCount': 'Mature Trees Harvested:'
};

// ADJUST SETTINGS VOLUME 
function volumeScrollerAdjust(volumeScroller) {
    volumeScroller.x = "100";
    return volumeScroller;
}

const volumeScrollerCreate = (settingsValues) => {
    let volumeScrollerBGMContainer = createDom("div");
    volumeScrollerBGMContainer.classList.add("volume-scroller-container-children");
    let volumeScrollerBGM = createDom("input");
    volumeScrollerBGM = volumeScrollerAdjust(volumeScrollerBGM);
    volumeScrollerBGM.id = "volume-scroller-bgm";
    volumeScrollerBGM.setAttribute("type", "range");
    volumeScrollerBGM.value = settingsValues.bgmVolume * 100;

    let volumeScrollerBGMText = createDom("div", {});
    let volumeScrollerBGMTextImage = createDom("img");
    volumeScrollerBGMTextImage.src = "./assets/settings/BGM.webp"
    volumeScrollerBGMText.appendChild(volumeScrollerBGMTextImage)
    volumeScrollerBGMContainer.append(volumeScrollerBGMText,volumeScrollerBGM);

    let volumeScrollerSFXContainer = createDom("div");
    volumeScrollerSFXContainer.classList.add("volume-scroller-container-children");
    let volumeScrollerSFX = createDom("input");
    volumeScrollerSFX = volumeScrollerAdjust(volumeScrollerSFX);
    volumeScrollerSFX.setAttribute("type", "range");
    volumeScrollerSFX.id = "volume-scroller-sfx";
    volumeScrollerSFX.value = settingsValues.sfxVolume * 100;

    let volumeScrollerSFXText = createDom("div", {
        child: [createDom('img', {
            src: "./assets/settings/SFX.webp"
        })]
    });
    volumeScrollerSFXContainer.append(volumeScrollerSFXText,volumeScrollerSFX);

    let volumeScrollerContainer = createDom("div", {
        class: ["volume-scroller-container"],
        child: [volumeScrollerBGMContainer, volumeScrollerSFXContainer]
    })

    return volumeScrollerContainer;
}

const settingsBottomLinks = () => {
    const settingsBottomButtons = createDom('div', {
        class: ['flex-column', 'settings-bottom-buttons']
    })

    const settingsCredit = createDom('button', {
        innerText: 'Credits',
        class: ['clickable'],
        event: ['click', () => {window.open('https://nahidaquest.com/credits',"_blank")}]
    })

    const settingsHelp = createDom('button', {
        innerText: 'Wiki',
        class: ['clickable'],
        event: ['click', () => {window.open('https://nahidaquest.com/wiki',"_blank")}]
    })

    settingsBottomButtons.append(settingsHelp, settingsCredit);
    return settingsBottomButtons;
}

const settingButton = () => {
    let settingButtonImg = createDom('img', {
        src: "./assets/settings/settings-logo.webp",
        classList: ["settings-button-img"],
        id: 'setting-button-img'
    });

    let settingButton = createDom("button", {
        classList: ['settings-button'],
        id: 'setting-button',
        child: [settingButtonImg]
    });

    return settingButton;
}

const advancedStats = () => {
    const advancedStats = createDom('p', {
        id: 'settings-stats',
        class: ['settings-stats'],
    });

    advancedStats.generateStats = (persistentValues) => {
        advancedStats.innerHTML = '';    
        for (const [key, value] of Object.entries(statsArray)) {
            advancedStats.innerHTML += `${value} ${key === 'timeSpentValue' ? convertTo24HourFormat(persistentValues[key] / 60) : persistentValues[key]}<br>`;
        }
    }

    return advancedStats;
}

const formatTime = (lastSave) => {
    const startOfYear = new Date('1900-01-01T00:00:00');
    const millisecondsPassedNow = lastSave * 60 * 1000;
    const calculatedDate = new Date(startOfYear.getTime() + millisecondsPassedNow);
    const formatTime = calculatedDate.toDateString() + "\n" + calculatedDate.toLocaleTimeString();
    return formatTime;
}

const buildSaves = (localStorage, noUploads = true, launchGame) => {
    const exportBoxText = createDom('div', {
        class: ['settings-textarea', 'settings-export', 'green-scrollbar'],
    });

    for (let i = 0; i < 6; i++) {
        let saveAvail = null;
        if (localStorage.getItem(`save-${i}`) != null) {
            saveAvail = JSON.parse(window.atob(localStorage.getItem(`save-${i}`)));
        };
        const lastSave = saveAvail?.saveValuesTemp?.currentTime;

        const saveText = createDom('p', {
            innerText: `${i === 0 ? 'Autosave' : 'Save ' + i}
                        Last Save: ${saveAvail == null ? '-' : formatTime(lastSave)}`
        });

        const uploadButton = createDom('img', {
            src: './assets/settings/Refresh.webp',
            class: ['clickable'],
            id: `settings-upload-${i}`
        });
        
        uploadButton.checkSaved = () => {
            return localStorage.getItem(`save-${i}`) != null;
        }
        
        const downloadButton = createDom('img', {
            src: './assets/settings/Download.webp',
            class: ['clickable'],
            event: ['click', () => {
                if (uploadButton.checkSaved()) {
                    CONSTANTS.DOWNLOADSAVE(i);
                }
            }]
        });

        uploadButton.progressText = () => {
            saveText.innerText = `${i === 0 ? 'Autosave' : 'Save ' + i}
                                  Saving...`
        }

        uploadButton.updateText = () => {
            let saveAvail = null;
            if (localStorage.getItem(`save-${i}`) != null) {
                saveAvail = JSON.parse(window.atob(localStorage.getItem(`save-${i}`)));
            };
            saveText.innerText = `${i === 0 ? 'Autosave' : 'Save ' + i}
                                  Last Save: ${saveAvail == null ? '-' : formatTime(saveAvail.saveValuesTemp.currentTime)}`
        }

        const deleteSave = (uploadButton, i) => {
            localStorage.removeItem(`save-${i}`);
            uploadButton.updateText();
        }

        const deleteButton = createDom('img', {
            src: './assets/settings/Delete.webp',
            class: ['clickable'],
            id: `settings-del-${i}`,
            event: ['click', () => {
                if (uploadButton.checkSaved()) {
                    const currentTop = document.getElementById('game') ?? document.getElementById('start-screen');
                    choiceBox(currentTop, {text: 'Do you want to delete this save? <br> This action cannot be undone.'}, undefined, 
                              () => { deleteSave(uploadButton, i) }, undefined, null, ['choice-ele']
                    );   
                }
            }]
        });

        const useButton = createDom('img', {
            src: './assets/settings/Upload.webp',
            class: ['clickable'],
            event: ['click', () => {
                if (uploadButton.checkSaved()) {
                    const currentTop = document.getElementById('game') ?? document.getElementById('start-screen');
                    choiceBox(currentTop, {text: 'Do you want to load this save? This will overwrite your autosave!'}, undefined, 
                              () => { 
                                localStorage.setItem(`save-0`, localStorage.getItem(`save-${i}`));
                                launchGame();
                             }, 
                              undefined, null, ['choice-ele']
                    );   
                }
            }]
        });

        const saveDiv = createDom('div', {
            class: ['flex-row', 'flex-space', 'settings-save-div'],
            child: [ downloadButton, saveText ]
        });

        if (noUploads) { 
            saveDiv.appendChild(uploadButton);
        } else {
            saveDiv.appendChild(useButton);
        }
        if (i === 0) { deleteButton.classList.add('unclickable') }
        saveDiv.appendChild(deleteButton)
        exportBoxText.appendChild(saveDiv);
    }

    return exportBoxText;
}

export { volumeScrollerCreate, settingsBottomLinks, settingButton, advancedStats, buildSaves }