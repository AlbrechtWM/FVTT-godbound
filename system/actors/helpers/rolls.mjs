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
            _performAttackWrapper(actor, tohit, damage);
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
const _performAttackWrapper = (actor, tohit, damage) => {

    let unknownAC = false;
    if(tohit.includes("+AC"))
    {
        //indicates there was no AC specified so it is indeed unknown
        new Dialog({
            title: "No Target Was Specified",
            content: `<div class="flexrow" style="align-items: center; margin-bottom: 10px; justify-content: flex-start;"><label>Please Enter AC: </label><input id="ac-input" type="number" value="0"/></div>`,
            default: "button1",
            buttons: {
              button1: {
                label: "Proceed",
                callback: (html) => {
                  let targetAC = html.find("input#ac-input").val();
                  tohit = tohit.replace("AC",targetAC);
                //   console.log(targetAC);
                //   console.log(tohit);
                  _performAttack(actor,tohit,damage);
                },
                icon: `<i class="fas fa-check"></i>`
              }
            }
          }).render(true);
    }
    else{
        _performAttack(actor,tohit,damage); //Attack as normal
    }
}

const _performAttack = (actor, tohit, damage) => 
{
    const splitToHit = tohit.split('#');
    let toHitRoll = splitToHit[0];

    if (toHitRoll.startsWith("Auto"))
        toHitRoll = "20";
    const hitRoll = new Roll(toHitRoll);
    hitRoll.evaluate("async=false").then(({ result }) => {
        const evaluatedResult = eval(result);
        const flavor = `<div style="text-align: center"><div>Rolling to Hit ( >= 20) ${splitToHit[1]}</div> ${_getSuccessDisplayForAttack(evaluatedResult)}`;
        const speaker = ChatMessage.getSpeaker({ actor });

        hitRoll.toMessage({
            flavor,
            speaker,
            rollMode: game.settings.get('core', 'rollMode'),
        });
        if (evaluatedResult >= 20) {
            const splitDamage = damage.split('#');
            const damageRoll = splitDamage[0];

            new Roll(damageRoll).evaluate().then(({ terms }) => {
                const { results } = terms[0];
                //console.log(terms[0]);
                const damageType = terms[0].options.flavor;
                const { number } = terms[2];

                let rollVals = '';
                let prunedResults = [];
                //Just get the raw rolls first, and prune for advantage / disadvantage if needed
                results.forEach((resultObj, i) => {
                    rollVals += i === 0 ? resultObj.result : `, ${resultObj.result}`;
                    if (resultObj?.discarded) {
                        //freakin' "continue" doesn't work in this language so we get this cool empty if block.
                    }
                    else
                        prunedResults.push(resultObj); //it was not chucked from either advantage or disadvantage so keep it
                });

                const indexToModify = _findHighestDamageIndex(prunedResults, number);
                let damageVals = '';
                let numericalResult = '';
                const isStraight = !(splitDamage[1].includes("Regular"));

                prunedResults.forEach((resultObj, i) => {
                    const { result } = resultObj;
                    if (number !== 0 && indexToModify === i) {
                        if (!isStraight) {
                            damageVals += i === 0 ? _getDamageValueDisplay(result + number, true) : ` + ${_getDamageValueDisplay(result + number, true)}`;
                            numericalResult += i === 0 ? _getDamageNumber(result + number) : ` + ${_getDamageNumber(result + number)}`
                        }
                        else { //straight damage
                            damageVals += i === 0 ? _getStraightDamageValueDisplay(result + number, true) : ` + ${_getStraightDamageValueDisplay(result + number, true)}`;
                            numericalResult += i === 0 ? result + number : ` + ${result + number}`;
                        }
                    } else {
                        if (!isStraight) {
                            damageVals += i === 0 ? _getDamageValueDisplay(result) : ` + ${_getDamageValueDisplay(result)}`;
                            numericalResult += i === 0 ? _getDamageNumber(result) : ` + ${_getDamageNumber(result)}`
                        }
                        else { //straight damage
                            damageVals += i === 0 ? _getStraightDamageValueDisplay(result) : ` + ${_getStraightDamageValueDisplay(result)}`;
                            numericalResult += i === 0 ? result : ` + ${result}`
                        }
                    }
                });


                const message = `<div style="text-align: center">
                    <div>Rolling: ${damageRoll} </div>
                    <div>Rolled: ${rollVals} </div>
                    <div>Dealt: ${damageVals} = ${eval(numericalResult)} ${damageType} damage</div>`;

                const speaker = ChatMessage.getSpeaker({ actor });

                const chatData = {
                    user: game.user._id,
                    speaker,
                    content: message,
                    flavor: `<div style="text-align: center">${splitDamage[1]}</div>`,
                };
                ChatMessage.create(chatData, {});
            });
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
 * @param {boolean} wasModified - If true, damage modifier was added
 */
const _getDamageValueDisplay = (evaluated, wasModified) => {
    if (evaluated >= 2 && evaluated <= 5) {
        return `<b style="color:blue">1</b>${wasModified ? ' (Modified)' : ''}`
    } else if (evaluated >= 6 && evaluated <= 9) {
        return `<b style="color:purple">2</b>${wasModified ? ' (Modified)' : ''}`
    } else if (evaluated >= 10) {
        return `<b style="color:orange">4</b>${wasModified ? ' (Modified)' : ''}`
    }

    return '<b style="color:grey">0</b>'
}

const _getStraightDamageValueDisplay = (evaluated, wasModified) => {
    if (evaluated >= 2 && evaluated <= 5) {
        return `<b style="color:blue">${evaluated}</b>${wasModified ? ' (Modified)' : ''}`
    } else if (evaluated >= 6 && evaluated <= 9) {
        return `<b style="color:purple">${evaluated}</b>${wasModified ? ' (Modified)' : ''}`
    } else if (evaluated >= 10) {
        return `<b style="color:orange">${evaluated}</b>${wasModified ? ' (Modified)' : ''}`
    }

    return `<b style="color:grey">${evaluated}</b>`
}

/**
 * Finds the index of the damage modifier to add, to obtain the highest possible damage roll
 * @param {Array} results - The array of result objects
 * @param {number} modifier - The modifier
 */
const _findHighestDamageIndex = (results, modifier) => {
    const numericalResults = results.map((resultObj) => resultObj.result);
    let indexOfNumToUse = -1;
    let highestTotal = 0;

    for (let i = 0; i < numericalResults.length; i++) {
        const currResult = numericalResults[i];
        const resultsBefore = numericalResults.slice(0, i).map((result) => _getDamageNumber(result));
        const resultsAfter = numericalResults.slice(i + 1, numericalResults.length).map((result) => _getDamageNumber(result)).filter((item) => item);
        const adjustedCurr = _getDamageNumber(currResult + modifier);

        const total = [...resultsBefore, adjustedCurr, ...resultsAfter].reduce((a, b) => a + b, 0);
        if (total > highestTotal) {
            highestTotal = total;
            indexOfNumToUse = i;
        }
    }
    return indexOfNumToUse;
}


/**
 * Gets damage number
 * @param {number} evaluated - The roll result
 */
const _getDamageNumber = (evaluated) => {
    if (evaluated >= 2 && evaluated <= 5) {
        return 1;
    } else if (evaluated >= 6 && evaluated <= 9) {
        return 2;
    } else if (evaluated >= 10) {
        return 4;
    }
    return 0;
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