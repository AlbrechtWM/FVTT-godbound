/**
 * Calculates attribute modifiers based on attribute score
 * @param {Object} context - actor context
 */
const calculateDerivedAttributes = (context) => {
    for (let attr of Object.values(context.system.attributes)) {
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
 * Calculates remaining ability points
 * @param {Object} context - actor context
 */
const calculateAbilityPointsRemaining = (context) => {
    context.system.abilityPoints.free = context.system.abilityPoints.total - context.system.abilityPoints.spent;
  }

  /**
 * Calculates remaining influence points
 * @param {Object} context - actor context
 */
const calculateInfluencePointsRemaining = (context) => {
    context.system.influence.free = context.system.influence.max - context.system.influence.committed;
  }

export default { calculateDerivedAttributes, calculateAbilityPointsRemaining, calculateInfluencePointsRemaining};