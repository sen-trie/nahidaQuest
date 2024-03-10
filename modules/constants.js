const VERSIONNUMBER = "V.2-00-002";

const changeFontSize = (fontSize) => {
    document.documentElement.style.fontSize = `clamp(0.75rem, 0.75rem + ${fontSize * 0.125}vw, 4rem)`;
}

export const CONSTANTS = Object.freeze({
    VERSIONNUMBER: VERSIONNUMBER,
    COPYRIGHT: `DISCLAIMER © HoYoverse.  
                All rights reserved. This site is not affiliated 
                with Hoyoverse, nor Genshin Impact.`,
    DBNUBMER: (VERSIONNUMBER.split(".")[1]).replaceAll("-",""),
    CHANGEFONTSIZE: changeFontSize,
    FELLBOSS_THRESHOLD: 65,
    UNUSUAL_THRESHOLD: 65,
    WORKSHOP_THRESHOLD: 75,
    FINALE_THRESHOLD: 65,
    FINALE_THRESHOLD_TWO : 0,
    MAX_LEADER: 5,
    COLOR_ARRAY: ["Red", "Green", "Blue"], // MUST BE USE WITH SPREAD (PREVENT PASS BY REFERENCE)
    ARANARA_HARD: [2, 4, 5, 7, 9],
    IFRAME_TEXT: "If you are playing nahidaQuest! on another website, the font sizes may appear too large. Font sizes can be changed under 'Advanced Settings', after launching the game.",
});