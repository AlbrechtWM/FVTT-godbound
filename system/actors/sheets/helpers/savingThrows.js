/**
 * Calculates saving throw bonuses based on stat modifiers - can eventually take buffs, etc
 * @param {Object} context - Entire game context
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
* @param {Object} context - Entire game context
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
 * @param {Object} context - Entire game context
 */
const calculateSavingThrowTotal = (context) => {
    const types = [
        'hardiness',
        'evasion',
        'spirit',
    ];

    types.forEach((type) => {
        context.system.coreStats.saves[type].total = 16 - (context.system.coreStats.saves[type].penaltyModifier)
            + (context.system.coreStats.saves[type].attributeModifier * -1) - context.system.coreStats.levelOrHD;
    });

}

export default { calculateSavingThrowBonuses, calculateSavingThrowPenalties, calculateSavingThrowTotal };