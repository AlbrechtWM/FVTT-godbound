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
 * @param {Object} system - actor system object
 * @param {string} type - the type of item to add
 * @param {function} postAddCallback - Callback to fire when add operation is finished
 */
const add = (actor, type, ss) => {
    // Making a switch, for adding later cases as necessary
    switch (type) {
        case 'fact': {
            _addFact(actor.system, ss);
            break;
        }
        default: {
            console.log('default');
        }
    }
}

/**
* Adds a fact
* @param {Object} system - actor system object
* @param {function} postAddCallback - Callback to fire when add operation is finished
*/
const _addFact = (system) => {
    console.log(system.facts);
    system.facts = [...system.facts, ''];
}

/**
 * Removes an item at the passed index
 * @param {Object} system - actor system object
 * @param {string} type - the type of item to add
 * @param {string} type - the type of item to add
 */
const remove = (system, type, index) => {
    // Making a switch, for adding later cases as necessary
    switch (type) {
        case 'fact': {
            _addFact(system);
            break;
        }
        default: {
            console.log('default');
        }
    }
}

/**
* Adds a fact
* @param {Object} system - actor system object
*/
const _removeFact = (system, index, postAddCallback) => {
    console.log(system);
    system.facts = system.facts.slice(index);
}


export default { calculateDerivedAttributes, add, calculateInfluencePointsRemaining };