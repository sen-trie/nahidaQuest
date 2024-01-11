import { createDom } from "../adjustUI.js"
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

export { volumeScrollerCreate, settingsBottomLinks, settingButton, advancedStats }