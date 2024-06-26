const VERSIONNUMBER = "V.2-01-000";

const changeFontSize = (fontSize) => {
    document.documentElement.style.fontSize = `clamp(0.75rem, 0.65rem + ${fontSize * 0.08}vw + ${fontSize * 0.08}vh, 2rem)`
    //`clamp(0.75rem, 0.75rem + ${fontSize * 0.125}vw, 1rem)`;
}

const DBNUBMER = (VERSIONNUMBER.split(".")[1]).replaceAll("-","");
const downloadSave = (saveNum = 0) => {
    const date = new Date();
    let text = localStorage.getItem(`save-${saveNum}`);
    
    let blob = new Blob([text], {type: "text/plain"});
    let link = document.createElement("a");
    link.download = `nq_save_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate()}_v${DBNUBMER}.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
}

export const CONSTANTS = Object.freeze({
    VERSIONNUMBER: VERSIONNUMBER,
    COPYRIGHT: `DISCLAIMER © HoYoverse.  
                nahidaQuest! is not affiliated 
                with Hoyoverse, nor Genshin Impact.`,
    DBNUBMER: DBNUBMER,
    CHANGEFONTSIZE: changeFontSize,
    DOWNLOADSAVE: downloadSave, 
    FELLBOSS_THRESHOLD: 65,
    UNUSUAL_THRESHOLD: 65,
    WORKSHOP_THRESHOLD: 75,
    FINALE_THRESHOLD: 65,
    FINALE_THRESHOLD_TWO : 0,
    MAX_LEADER: 5,
    COLOR_ARRAY: ["Red", "Green", "Blue"], // MUST BE USE WITH SPREAD (PREVENT PASS BY REFERENCE)
    ARANARA_HARD: [2, 4, 5, 7, 9],
    IFRAME_TEXT: "If this is your first time playing nahidaQuest!, the font sizes may not be correctly sized. Font sizes can be changed under 'Advanced Settings', after launching the game.",
});