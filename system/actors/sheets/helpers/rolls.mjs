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
            _performAttributeRoll(actor, system, stat);
            break;
        }
        default: {
            _performSavingThrowRoll(actor, system, type);
        }
    }
}

/**
 * Performs an attribute check
 * @param {Object} actor - The actor performing the roll
 * @param {Object} system - actor system object
 * @param {Object} stat - The stat to roll (str, con, etc)
 */
const _performAttributeRoll = (actor, system, stat) => {
    const attributeObject = system.attributes[stat];
    const content = `${attributeObject.label} Check ( > ${attributeObject.checkDC})`;
    let roll = new Roll("d20", attributeObject);
    const speaker = ChatMessage.getSpeaker({ actor });
    ChatMessage.create({ speaker, content });
    roll.toMessage({
        speaker,
        rollMode: game.settings.get('core', 'rollMode'),
    }).then(() => {
        ChatMessage.create({ speaker, content: roll.result > attributeObject.checkDC ? 'Success!' : 'Failure!' });
    });

    return roll;
}

export default { performRoll };