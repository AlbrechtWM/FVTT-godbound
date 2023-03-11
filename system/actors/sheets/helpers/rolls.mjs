/**
 * Performs a roll
 * @param {Object} actor - The actor performing the roll
 * @param {Object} system - actor system object
 * @param {Object} type - Type of roll ('attr' or 'save)
 * @param {Object} [stat] - The stat to roll (str, con, etc)
 */
const performRoll = (actor, system, type, stat) => {
    // Making a switch, for adding later cases as necessary
    switch (type) {
        case 'attr': {
            _performAttributeCheck(actor, system, stat);
            break;
        }
        default: {
            _performSavingThrow(actor, system, type);
        }
    }
}

/**
 * Performs an attribute check
 * @param {Object} actor - The actor performing the roll
 * @param {Object} system - actor system object
 * @param {Object} stat - The stat to roll (str, con, etc.)
 */
const _performAttributeCheck = (actor, system, stat) => {
    const attributeObject = system.attributes[stat];
    const roll = new Roll("d20", attributeObject);
    roll.evaluate().then((r) => {
        const flavor = `<div style="text-align: center"><div>${attributeObject.label} Check ( >= ${attributeObject.checkDC})</div> ${r.result >= attributeObject.checkDC ? '<b style="color:green">Success!</b>' : '<b style="color:red">Failure!</b></div>'}`;
        const speaker = ChatMessage.getSpeaker({ actor });
    
        roll.toMessage({
            flavor,
            speaker,
            rollMode: game.settings.get('core', 'rollMode'),
        });
    });

    return roll;
}

/**
 * Performs a saving throw
 * @param {Object} actor - The actor performing the roll
 * @param {Object} system - actor system object
 * @param {Object} type - The type of saving throw (hardiness, evasion, spirit)
 */
const _performSavingThrow = (actor, system, type) => {
    const saveObject = system.coreStats.saves[type];
    const roll = new Roll("d20", saveObject);
    roll.evaluate().then((r) => {
        const flavor = `<div style="text-align: center"><div>${_capitalize(type)} Check ( >= ${saveObject.dc})</div> ${r.result >= saveObject.dc ? '<b style="color:green">Success!</b>' : '<b style="color:red">Failure!</b></div>'}`;
        const speaker = ChatMessage.getSpeaker({ actor });
    
        roll.toMessage({
            flavor,
            speaker,
            rollMode: game.settings.get('core', 'rollMode'),
        });
    });

    return roll;
}

/**
 * Capitalizes a string
 * @param {String} string - String to capitalize
 */
const _capitalize = (string) => {
    const firstLetterCap = string.charAt(0).toUpperCase();
    return `${firstLetterCap}${string.slice(1)}`;
}

export default { performRoll };