/**
 * Calculates attribute modifiers based on attribute score
 * @param {Object} context - Entire game context
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
 * Calculates armor class based on armor types
 * @param {Object} context - Entire game context
 */
const calculateAC = (context) => {
    let base = 9;

    switch (context.system.coreStats.ac.armorType) {
        case "none":
            base = 9;
            break;
        case "light":
            base = 7;
            break;
        case "medium":
            base = 5;
            break;
        case "heavy":
            base = 3;
            break;
        case "special":
            base = 3;
            break;
        default:
            context.system.coreStats.ac.armorType = "none";
            base = 9;
            break;
    }


    context.system.coreStats.ac.total = base - context.system.coreStats.ac.miscModifier - context.system.attributes.dex.mod;
    if (context.system.coreStats.ac.armorType !== "special" && context.system.coreStats.ac.hasShield) {
        context.system.coreStats.ac.total--;
    }
}

export default { calculateDerivedAttributes, calculateAC };