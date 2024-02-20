const VERSIONNUMBER = "B.1-02-002";

const changeFontSize = (fontSize) => {
    document.documentElement.style.fontSize = `clamp(0.5rem, 1rem + ${0.25 + fontSize * 0.05}vw, 4rem)`;
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
});