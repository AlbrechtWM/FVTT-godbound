/**
 * Calculates saving throw bonuses based on stat modifiers - can eventually take buffs, etc
 * @param {Object} system - actor system object
 */
const calculateSavingThrowBonuses = (system) => {
    const types = {
        hardiness: ['str', 'con'],
        evasion: ['int', 'dex'],
        spirit: ['wis', 'cha'],
    };

    const mods = {
        str: system.attributes.str.mod,
        con: system.attributes.con.mod,
        dex: system.attributes.dex.mod,
        int: system.attributes.int.mod,
        cha: system.attributes.cha.mod,
        wis: system.attributes.wis.mod,
    }

    // Iterate through all save types and get max of the type of stat mod that effects this roll
    Object.entries(types).forEach(([type, modName]) => {
        system.coreStats.saves[type].attributeModifier = Math.max(mods[modName[0]], mods[modName[1]]);
    });
}

/**
* Calculates saving throw penalties based on various penalty modifiers - arrays below can take additional values
 * @param {Object} system - actor system object
*/
const calculateSavingThrowPenalties = (system) => {
    // Add additional entries to these arrays when additional modifiers are required
    const types = {
        hardiness: [system.coreStats.saves.hardiness.isArmorPenalty ? -4 : 0],
        evasion: [system.coreStats.saves.evasion.isArmorPenalty ? -4 : 0],
        spirit: [system.coreStats.saves.spirit.isArmorPenalty ? -4 : 0],
    };

    // Iterate through all save types and then use Array.reduce to calculate a running total of modifiers
    Object.entries(types).forEach(([type, modifiers]) => {
        system.coreStats.saves[type].penaltyModifier = modifiers.reduce((a, b) => a + b, 0);
    });
}

/**
 * Calculates the total saving throw bonus
 * @param {Object} system - actor system object
 */
const calculateSavingThrowTotals = (system) => {
    const types = [
        'hardiness',
        'evasion',
        'spirit',
    ];

    //console.log(system.coreStats.saves);

    types.forEach((type) => {
        // console.log("Penalty Modifier: " + system.coreStats.saves[type].penaltyModifier);
        // console.log("Attribute Modifier: " + system.coreStats.saves[type].attributeModifier);
        // console.log("Level Modifier: " + system.coreStats.levelOrHD);

        system.coreStats.saves[type].dc = 16 - (system.coreStats.saves[type].penaltyModifier)
            - (system.coreStats.saves[type].attributeModifier) - system.coreStats.levelOrHD;
    });
}

const calculateMaxHealth = (system) => {
    if (system.coreStats.useHD) {
        _calculateMaxHD(system);
    }
    else {
        _calculateMaxHP(system);
    }
}

/**
 * Calculates max HD for a character
 * @param {Object} system - actor system object
 */
const _calculateMaxHD = (system) => {
    system.coreStats.hp.max = system.coreStats.levelOrHD + system.coreStats.hp.miscBonus; //TODO MOB STUFF
    system.coreStats.hp.isHD = true;
}

/**
 * Calculates max HP for a character
 * @param {Object} system - actor system object
 */
const _calculateMaxHP = (system) => {
    system.coreStats.hp.max = (8 + system.attributes.con.mod) + ((system.coreStats.levelOrHD - 1) * (4 + Math.ceil(system.attributes.con.mod / 2)))
        + system.coreStats.hp.miscBonus;

    system.coreStats.hp.isHD = false;
}

/**
 * Calculates armor class based on armor types
 * @param {Object} system - actor system object
 */
const calculateAC = (system) => {
    let base = 9;

    switch (system.coreStats.ac.armorType) {
        case "none":
            base = 9;
            break;
        case "light":
            base = 7;
            break;
        case "medium":
            base = 5;
            break;
        case "heavy":
            base = 3;
            break;
        case "special":
            base = 3;
            break;
        default:
            system.coreStats.ac.armorType = "none";
            base = 9;
            break;
    }

    system.coreStats.ac.total = base - system.coreStats.ac.miscModifier - (system.coreStats.useHD ? 0 : system.attributes.dex.mod);
    if (system.coreStats.ac.armorType !== "special" && system.coreStats.ac.hasShield) {
        system.coreStats.ac.total--;
    }
}

/**
 * Sets whether this actor uses HD or not
 * @param {Object} system - actor system object
 */
const setUseHD = (system, useHD) => {
    system.coreStats.useHD = useHD;
}

/**
 * Calculates effort for the actor
 * @param {Object} system - actor system object
 */
const calculateEffort = (system) => {
    system.coreStats.effort.totalCommitted = system.coreStats.effort.turnCommitted + system.coreStats.effort.sustainCommitted + system.coreStats.effort.sceneCommitted + system.coreStats.effort.dayCommitted; 
    system.coreStats.effort.free = system.coreStats.effort.max - system.coreStats.effort.totalCommitted;
}



export default { calculateSavingThrowBonuses, calculateSavingThrowPenalties, calculateSavingThrowTotals, calculateAC, calculateMaxHealth, calculateEffort, setUseHD };