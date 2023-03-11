/**
 * Performs a roll
 * @param {Object} actor - The actor performing the roll
 * @param {Object} system - actor system object
 * @param {Object} type - Type of roll ('attr' or 'save)
 * @param {Object} [modifier] - Optional modifier added by user
 * @param {Object} [stat] - The stat to roll (str, con, etc)
 */
const performRoll = (actor, system, type, modifier, stat) => {
    // Making a switch, for adding later cases as necessary
    switch (type) {
        case 'attr': {
            _performAttributeCheck(actor, system, stat, modifier);
            break;
        }
        default: {
            _performSavingThrow(actor, system, type, modifier);
        }
    }
}

/**
 * Performs an attribute check
 * @param {Object} actor - The actor performing the roll
 * @param {Object} system - actor system object
 * @param {Object} stat - The stat to roll (str, con, etc.)
 * @param {Object} [modifier] - Optional modifier added by user
 */
const _performAttributeCheck = (actor, system, stat, modifier) => {
    const attributeObject = system.attributes[stat];
    const roll = new Roll("d20", attributeObject);
    const adjustedModifier = modifier ? modifier * -1 : 0;
    const adjustedCheck = Math.max(attributeObject.checkDC + adjustedModifier, 2);
    roll.evaluate().then(({ result }) => {
        const flavor = `<div style="text-align: center"><div>${attributeObject.label} Check ( >= ${adjustedCheck})</div> ${_getSuccessDisplay(result, adjustedCheck)}`;
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
 * @param {Object} [modifier] - Optional modifier added by user
 */
const _performSavingThrow = (actor, system, type, modifier) => {
    const saveObject = system.coreStats.saves[type];
    const roll = new Roll("d20", saveObject);
    const adjustedModifier = modifier ? modifier * -1 : 0;
    const adjustedCheck = Math.max(saveObject.dc + adjustedModifier, 2);
    roll.evaluate().then(({ result }) => {
        const flavor = `<div style="text-align: center"><div>${_capitalize(type)} Check ( >= ${adjustedCheck})</div> ${_getSuccessDisplay(result, adjustedCheck)}`;
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
 * Gets the text for success/failure based on a roll
 * @param {number} result - The roll result
 * @param {number} dc - The difficulty class
 */
const _getSuccessDisplay = (result, dc) => {
    if (result == 1) {
        return '<b style="color:red">Critical Failure!</b></div>'
    } else if (result == 20) {
        return '<b style="color:green">Critical Success!</b>'
    }
    return result >= dc ? '<b style="color:green">Success!</b>' : '<b style="color:red">Failure!</b></div>';
}

/**
 * Capitalizes a string
 * @param {string} string - String to capitalize
 */
const _capitalize = (string) => {
    const firstLetterCap = string.charAt(0).toUpperCase();
    return `${firstLetterCap}${string.slice(1)}`;
}

export default { performRoll };