/**
 * Calculates saving throw bonuses based on stat modifiers - can eventually take buffs, etc
 * @param {Object} context - actor context
 */
const calculateSavingThrowBonuses = (context) => {
    const types = {
        hardiness: ['str', 'con'],
        evasion: ['int', 'dex'],
        spirit: ['wis', 'cha'],
    };

    const mods = {
        str: context.system.attributes.str.mod,
        con: context.system.attributes.con.mod,
        dex: context.system.attributes.dex.mod,
        int: context.system.attributes.int.mod,
        cha: context.system.attributes.cha.mod,
        wis: context.system.attributes.wis.mod,
    }

    // Iterate through all save types and get max of the type of stat mod that effects this roll
    Object.entries(types).forEach(([type, modName]) => {
        context.system.coreStats.saves[type].attributeModifier = Math.max(mods[modName[0]], mods[modName[1]]);
    });
}

/**
* Calculates saving throw penalties based on various penalty modifiers - arrays below can take additional values
* @param {Object} context - actor context
*/
const calculateSavingThrowPenalties = (context) => {
    // Add additional entries to these arrays when additional modifiers are required
    const types = {
        hardiness: [context.system.coreStats.saves.hardiness.isArmorPenalty ? -4 : 0],
        evasion: [context.system.coreStats.saves.evasion.isArmorPenalty ? -4 : 0],
        spirit: [context.system.coreStats.saves.spirit.isArmorPenalty ? -4 : 0],
    };

    // Iterate through all save types and then use Array.reduce to calculate a running total of modifiers
    Object.entries(types).forEach(([type, modifiers]) => {
        context.system.coreStats.saves[type].penaltyModifier = modifiers.reduce((a, b) => a + b, 0);
    });
}

/**
 * Calculates the total saving throw bonus
 * @param {Object} context - actor context
 */
const calculateSavingThrowTotals = (context) => {
    const types = [
        'hardiness',
        'evasion',
        'spirit',
    ];

    //console.log(context.system.coreStats.saves);

    types.forEach((type) => {
        // console.log("Penalty Modifier: " + context.system.coreStats.saves[type].penaltyModifier);
        // console.log("Attribute Modifier: " + context.system.coreStats.saves[type].attributeModifier);
        // console.log("Level Modifier: " + context.system.coreStats.levelOrHD);

        context.system.coreStats.saves[type].total = 16 - (context.system.coreStats.saves[type].penaltyModifier)
            - (context.system.coreStats.saves[type].attributeModifier) - context.system.coreStats.levelOrHD;
    });
}

/**
 * Calculates max HP for a character
 * @param {Object} context - actor context
 */
const calculateMaxHP = (context) => {
    context.system.coreStats.hp.max = (8 + context.system.attributes.con.mod) + ((context.system.coreStats.levelOrHD - 1) * (4 + Math.ceil(context.system.attributes.con.mod / 2)))
     + context.system.coreStats.hp.miscBonus;

    context.system.coreStats.hp.isHD = false;
}

/**
 * Calculates armor class based on armor types
 * @param {Object} context - actor context
 */
const calculateAC = (context) => {
    let base = 9;

    switch (context.system.coreStats.ac.armorType) {
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
            context.system.coreStats.ac.armorType = "none";
            base = 9;
            break;
    }


    context.system.coreStats.ac.total = base - context.system.coreStats.ac.miscModifier - context.system.attributes.dex.mod;
    if (context.system.coreStats.ac.armorType !== "special" && context.system.coreStats.ac.hasShield) {
        context.system.coreStats.ac.total--;
    }
}

/**
 * Calculates effort for the actor
 * @param {Object} context - actor context
 */
const calculateEffort = (context) => {
    context.system.coreStats.effort.free = context.system.coreStats.effort.max - context.system.coreStats.effort.committed;
}



export default { calculateSavingThrowBonuses, calculateSavingThrowPenalties, calculateSavingThrowTotals, calculateAC, calculateMaxHP, calculateEffort};