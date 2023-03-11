/**
 * Calculates attribute modifiers based on attribute score
 * @param {Object} system - actor system object
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

const _performAttributeRoll = (actor, system, stat) => {
    const attributeObject = system.attributes[stat];
    const label = `${attributeObject.label} Check ( > ${attributeObject.checkDC})`;
    let roll = new Roll("d20", attributeObject);
    const speaker = ChatMessage.getSpeaker({ actor });
    roll.toMessage({
        speaker,
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
    }).then(() => {
        ChatMessage.create({ speaker, content: roll.result > attributeObject.checkDC ? 'Success!' : 'Failure!' });
    });

    return roll;
}

export default { performRoll };