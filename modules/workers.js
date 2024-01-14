const workerFunctions = {
    calculateDamage: function(adventureRank, morale) {
        let currentATK = 10 + 6 * Math.floor(adventureRank / 4);
        if (morale > 80) {currentATK *= 1.2};
        if (morale > 60) {currentATK *= 1.1};
        if (morale < 30) {currentATK *= 0.5};
        postMessage({ function: 'calculateDamage', result: currentATK });
    },
};

onmessage = function(event) {
    const functionName = event.data.function;
    const functionArgs = event.data.args;
    workerFunctions[functionName].apply(null, functionArgs);
}
  