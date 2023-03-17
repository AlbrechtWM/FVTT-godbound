/**
 * Calculates attribute modifiers based on attribute score
 * @param {Object} system - actor system object
 */
const calculateDerivedAttributes = (system) => {
    for (let attr of Object.values(system.attributes)) {
        //calc mods
        if (attr.score <= 3) {
            attr.mod = -3;
        }
        else if (attr.score <= 5) {
            attr.mod = -2;
        }
        else if (attr.score <= 8) {
            attr.mod = -1;
        }
        else if (attr.score <= 12) {
            attr.mod = 0;
        }
        else if (attr.score <= 15) {
            attr.mod = 1;
        }
        else if (attr.score <= 17) {
            attr.mod = 2;
        }
        else if (attr.score <= 18) {
            attr.mod = 3;
        }
        else if (attr.score >= 19) {
            attr.mod = 4;
        }

        //calc check dc's 
        attr.checkDC = 21 - attr.score;
    }
}

/**
* Calculates remaining influence points
* @param {Object} system - actor system object
*/
const calculateInfluencePointsRemaining = (system) => {
    system.influence.free = system.influence.max - system.influence.committed;
}

/**
 * Adds an item of the type passed
 * @param {Object} actor - actor object
 * @param {string} type - the type of item to add
 * @param {function} postAddCallback - Callback to fire when add operation is finished
 */
const add = (actor, type) => {
    // Making a switch, for adding later cases as necessary
    switch (type) {
        case 'fact': {
            _addFact(actor);
            break;
        }
        default: {
            console.log('default');
        }
    }
}

/**
 * Removes an item at the passed index1
 * @param {Object} actor - actor object
 * @param {string} type - the type of item to add
 * @param {string} type - the type of item to add
 */
const remove = (actor, type, index) => {
    // Making a switch, for adding later cases as necessary
    switch (type) {
        case 'fact': {
            _removeFact(actor, index);
            break;
        }
        default: {
            console.log('default');
        }
    }
}

/**
* Adds an empty fact
* @param {Object} actor - actor system object
* @param {function} postAddCallback - Callback to fire when add operation is finished
*/
const _addFact = (actor) => {
    const system = actor.system;
    const keys = Object.keys(system.facts);
    const newKey = keys.length > 0 ? Math.max(...Object.keys(system.facts)) + 1 : 0;
    const newFacts = { ...system.facts };
    newFacts[newKey] = '';
    actor.update({ 'system.facts': newFacts });
}

/**
* Removes a fact
* @param {Object} actor - actor object
*/
const _removeFact = (actor, index) => {
    actor.update({ [`system.facts.-=${index}`]: null });
}


export default { calculateDerivedAttributes, add, remove, calculateInfluencePointsRemaining };