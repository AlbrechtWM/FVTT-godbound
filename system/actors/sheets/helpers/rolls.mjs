/**
 * Performs a roll
 * @param {Object} actor - The actor performing the roll
 * @param {Object} rollObject - { type, value, stat, tohit, damage }
 */
const performRoll = (actor, { type, modifier, stat, tohit, damage }) => {
    // Making a switch, for adding later cases as necessary
    switch (type) {
        case 'attr': {
            _performAttributeCheck(actor, stat, modifier);
            break;
        }
        case 'attack': {
            _performAttack(actor, tohit, damage);
            break;
        }
        default: {
            _performSavingThrow(actor, type, modifier);
        }
    }
}

/**
 * Performs an attribute check
 * @param {Object} actor - The actor performing the roll
 * @param {Object} stat - The stat to roll (str, con, etc.)
 * @param {Object} [modifier] - Optional modifier added by user
 */
const _performAttributeCheck = (actor, stat, modifier) => {
    const attributeObject = actor.system.attributes[stat];
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
 * Performs an attack roll
 * @param {Object} actor - The actor performing the roll
 * @param {string} tohit - To hit value
 * @param {damage} damage - Damage value
 */
const _performAttack = (actor, tohit, damage) => {
    const splitToHit = tohit.split('#');
    const toHitRoll = splitToHit[0];
    const toHitFlavor = splitToHit[1];
    const hitRoll = new Roll(toHitRoll);
    hitRoll.evaluate().then(({ result }) => {
        const evaluatedResult = eval(result);
        const flavor = `<div style="text-align: center"><div>Rolling to Hit ( >= 20)</div><div>${toHitFlavor}</div> ${_getSuccessDisplayForAttack(evaluatedResult)}`;
        const speaker = ChatMessage.getSpeaker({ actor });

        hitRoll.toMessage({
            flavor,
            speaker,
            rollMode: game.settings.get('core', 'rollMode'),
        });
        if (evaluatedResult >= 20) {
            const splitDamage = damage.split('#');
            const damageRoll = splitDamage[0];
            const damageFlavor = splitDamage[1];

            const rollWithoutDice = damageRoll.slice(1);
            const rolls = []
            for (let i = 1; i <= damageRoll.charAt(0); i++) {
                const singleRoll = `1${rollWithoutDice}`;
                rolls.push(new Roll(singleRoll));
            }

            rolls.forEach((roll) => {
                roll.evaluate().then(({ result, terms }) => {
                    const { flavor } = terms[0].options;
                    const evaluated = eval(result);
                    const damageType = flavor ? damageFlavor.replace(']', `,${flavor}]`) : damageFlavor;

                    const message = `<div style="text-align: center">
                    <div>Rolled: ${result} (${evaluated})</div>
                    <div>Dealt: ${_getDamageValue(evaluated)} ${damageType} Damage</div>`;
                    
                    const speaker = ChatMessage.getSpeaker({ actor });

                    const chatData = {
                        user: game.user._id,
                        speaker,
                        content: message,
                    };
                    ChatMessage.create(chatData, {});
                })
            })


        }
    });
}


/**
 * Performs a saving throw
 * @param {Object} actor - The actor performing the roll
 * @param {Object} type - The type of saving throw (hardiness, evasion, spirit)
 * @param {Object} [modifier] - Optional modifier added by user
 */
const _performSavingThrow = (actor, type, modifier) => {
    const saveObject = actor.system.coreStats.saves[type];
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
    const evaluated = eval(result);
    if (evaluated == 1) {
        return '<b style="color:red">Critical Failure!</b></div>'
    } else if (evaluated == 20) {
        return '<b style="color:green">Critical Success!</b>'
    }
    return result >= dc ? '<b style="color:green">Success!</b>' : '<b style="color:red">Failure!</b></div>';
}

/**
 * Gets display for amount of damage dealt
 * @param {number} evaluated - The roll result
 */
const _getDamageValue = (evaluated) => {
    if (evaluated >= 2 && evaluated <= 5) {
        return '<b style="color:blue">1</b>'
    } else if (evaluated >= 6 && evaluated <= 9) {
        return '<b style="color:purple">2</b>'
    } else if (evaluated >= 10) {
        return '<b style="color:orange">4</b>'
    }

    return '<b style="color:grey">No</b>'
}

/**
 * Gets the text for success/failure based on a roll
 * @param {number} result - The roll result
 */
const _getSuccessDisplayForAttack = (result) => {
    return Number.parseInt(result, 10) >= 20 ? '<b style="color:green">Hit!</b>' : '<b style="color:red">Miss!</b></div>';
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