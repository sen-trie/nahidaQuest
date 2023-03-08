const filePath = "./assets/";
let uniqueFileArray = {
    "bg/":["achievementBG","bg","closed","dori-back","left","main-bar","middle","open","right","wish-bg","wood"],
    "tutorial/":["buttonBox","eventPill","tut-button","unlockExp-3","unlockExp-4","unlockExp-5"],
    "frames/":["achievement","achievement-temp","button","dori-deals","wishButton","tooltipEXPED","bar","top-bar","arrow"],
    "tooltips/elements/":["Anemo","Any","Artifact","Bow","Catalyst","Claymore","Cryo","Dendro","Electro","Food","Gemstone","Geo","Hydro","Level","Polearm","Pyro","Sword","Talent"],
    "event/":["clock-arrow","clock-back","clock-top","mineEventBG","mine-flag","mine-info","mine-unclicked","mine-wrong","timer-sand","mine-empty","weasel-back","timer-bar"],
    "icon/":["food1","food2","goldenNut","nut","primogemLarge","scarab","shop-start","event-easy","event-hard"],    
}

let numberedFileArray = {
    "achievement/":20,
    "event/box-":7,
    "event/good-":7,
    "expedbg/exped":6,
    "frames/background-":6,
    "frames/rarity-":6,
    "tutorial/aranara-":6,
    "event/whopperflower-":3,
    "event/bad-":4,
    "tutorial/tut-":4,
    "event/weasel-":9
}

function preloadImages(priority,path,number) {
    // PRELOAD IMAGES UPON STARTING PAGE
    if (priority === 'load') {
        let img = new Image();
        img.src = filePath + "loading.webp";
        let imgTwo = new Image();
        imgTwo.src = filePath + "/expedbg/exped-button.webp";

        for (const key in uniqueFileArray) {
            for (let i=0, len=key.length; i < len; i++) {
                let img = new Image();
                img.src = filePath + key + key[i] + ".webp";
                i++;
            }
        }
        for (const key in numberedFileArray) {
            for (let i=0, len=numberedFileArray[key] + 1; i < len; i++) {
                let img = new Image();
                img.src = filePath + key + i + ".webp";
                i++;
            }
        }
        for (let key in path) {
            let upgradeName = path[key].Name;
            let imgOne = new Image();
            imgOne.src = filePath + "nameplates/" + upgradeName + ".webp";
            let imgTwo = new Image();
            imgTwo.src = filePath + "tooltips/hero/" + upgradeName + ".webp";
        }
    // PRELOAD SINGLE IMAGES
    } else if (priority === 'single') {
        let img = new Image();
        img.src = filePath + path + ".webp";
    // PRELOAD MULTIPLE IMAGES
    } else if (priority === 'folder') {
        for (let i = 1; i < (number + 1); i++) {
            let img = new Image();
            img.src = filePath + path + i + ".webp";
        }
    }
}

onmessage = function(e) {
    let data = e.data;
    if (data.operation === 'preload') {
        preloadImages(data.imageUrls);
    }
}
