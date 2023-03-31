const prepareAttackSummaries = (item, actor) => {
    item.summaries = {};
    item.verboseSummaries = {};

    prepareToHitSummary(item, actor);
    prepareDamageSummary(item, actor);
    prepareRangeSummary(item, actor);
    prepareAreaSummary(item, actor);
}

const prepareToHitSummary = (item, actor) => {

    let toHit = "";
    let modifier = 0;
    let targetAC = 0;

    if (item.system.targeting.toHit.isAutomatic) {
        toHit = "Auto";
    }
    else {
        toHit = "1d20";

        //Check advantage/disadvantage first
        if (item.system.targeting.toHit.isAdvantaged && item.system.targeting.toHit.isDisadvantaged) {
            toHit = "1d20"; //if both advantage and disadvantage apply, they cancel out
        }
        else if (item.system.targeting.toHit.isAdvantaged) {
            toHit = "2d20kh1";
        }
        else if (item.system.targeting.toHit.isDisadvantaged) {
            toHit = "2d20kl1";
        }
        //now calc modifiers

        //attribute bonus
        if (item.system.targeting.toHit.relevantAttribute != "none" && item.system.targeting.toHit.useAttrBonus)
            modifier += actor.system.attributes[item.system.targeting.toHit.relevantAttribute].mod;

        //level bonus
        if (item.system.targeting.toHit.useLevelBonus)
            modifier += actor.system.coreStats.levelOrHD;

        //misc mod
        modifier += item.system.targeting.toHit.miscBonus;

        let tempArr = Array.from(game.user.targets);
        //get current AC
        if (tempArr.length > 0)
            targetAC = tempArr[0].actor.system.coreStats.ac.total;
        else
            targetAC = null;
    }

    let flavor = "#[";
    //flavor
    if (item.system.targeting.isMagical)
        flavor += "Magical,";
    else
        flavor += "Mundane,";

    if (item.system.act?.isSmite)
        flavor += "Smite,";

    if (item.system.targeting.isMelee)
        flavor += "Melee]";
    else
        flavor += "Ranged]";

    item.summaries.toHit = toHit;

    if (!item.system.targeting.toHit.isAutomatic)
        item.summaries.toHit += "+" + modifier + (targetAC != null ? "+" + targetAC : "+AC");

    item.verboseSummaries.toHit = item.summaries.toHit + " " + flavor;

} // End To Hit

const prepareDamageSummary = (item, actor) => {

    if (!item.system.damage.enableDamage) {
        item.summaries.damage = "None";
        item.verboseSummaries.damage = "None";
        return;
    }

    let dieQuantity = item.system.damage.numDie + (item.system.damage.bonusDieForExtraLevels ? (actor.system.coreStats.levelOrHD - 1) : 0);
    let dieType = item.system.damage.dieType;

    let fixedDamage = (dieType === "none"); //if dieType is "none", we're doing some fixed damage CONFIG.GODBOUND_CONSTANTS.dieTypes[0]

    if (!fixedDamage)
        dieType = dieType.slice(1);

    let modifier = 0;

    //attribute bonus
    if (item.system.damage.relevantAttribute != "none" && item.system.damage.useAttrBonus)
        modifier += actor.system.attributes[item.system.damage.relevantAttribute].mod;

    //level bonus
    if (item.system.damage.useLevelBonus)
        modifier += actor.system.coreStats.levelOrHD;

    //misc mod
    modifier += item.system.damage.miscBonus;

    //get the damage type inline text
    let damageType = "[" + item.system.damage.damageType + "]";
    let advantageDisadvantageSuffix = "";

    //get potential advantage / disadvantage stuff ready
    if (item.system.damage.isAdvantaged && item.system.damage.isDisadvantaged) {
        //do nothing
    }
    else if (item.system.damage.isAdvantaged) {
        advantageDisadvantageSuffix = "kh" + dieQuantity; //keep highest of original number
        dieQuantity = dieQuantity * 2; //double the number of dice
    }
    else if (item.system.damage.isDisadvantaged) {
        advantageDisadvantageSuffix = "kl" + dieQuantity; //keep lowest of original number
        dieQuantity = dieQuantity * 2; //double the number of dice
    }

    let flavor = "#[";

    flavor
    if (item.system.damage.isStraight)
        flavor += "Straight";
    else
        flavor += "Regular";

    if (item.system.damage.canOverflow)
        flavor += ",Overflows";

    if (item.system.damage.isEnvironmental)
        flavor += ",Environmental]";

    flavor += "]";

    //put it all together
    if (fixedDamage) {
        item.summaries.damage = modifier + damageType;
        item.verboseSummaries.damage = item.summaries.damage + " " + flavor;
    }
    else {
        item.summaries.damage = dieQuantity + dieType + advantageDisadvantageSuffix + damageType + " + " + modifier;
        item.verboseSummaries.damage = item.summaries.damage + " " + flavor;
    }
}//End Damage

const prepareRangeSummary = (item, actor) => {
    if (item.system.targeting.range.rangeUnits == [CONFIG.GODBOUND_CONSTANTS.distanceUnits[0]])
        item.summaries.range = item.system.targeting.range.rangeSize + " " + "Feet";
    else if (item.system.targeting.range.rangeUnits == [CONFIG.GODBOUND_CONSTANTS.distanceUnits[1]])
        item.summaries.range = item.system.targeting.range.rangeSize + " " + "Miles";
    else if (item.system.targeting.range.rangeUnits == [CONFIG.GODBOUND_CONSTANTS.distanceUnits[2]])
        item.summaries.range = "Line Of Sight";
    else if (item.system.targeting.range.rangeUnits == [CONFIG.GODBOUND_CONSTANTS.distanceUnits[3]])
        item.summaries.range = "Region";
    else if (item.system.targeting.range.rangeUnits == [CONFIG.GODBOUND_CONSTANTS.distanceUnits[4]])
        item.summaries.range = "Realm";
    else if (item.system.targeting.range.rangeUnits == [CONFIG.GODBOUND_CONSTANTS.distanceUnits[5]])
        item.summaries.range = "Unlimited";
    else
        item.summaries.range = "UNKNOWN";

} // End Range

const prepareAreaSummary = (item, actor) => {
    if (!item.system.targeting.area.isArea) {
        item.summaries.area = "Single";
        return;
    }

    if (item.system.targeting.area.areaUnits == [CONFIG.GODBOUND_CONSTANTS.distanceUnits[0]])
        item.summaries.area = item.system.targeting.area.areaSize + " " + "Feet";
    else if (item.system.targeting.area.areaUnits == [CONFIG.GODBOUND_CONSTANTS.distanceUnits[1]])
        item.summaries.area = item.system.targeting.area.areaSize + " " + "Miles";
    else if (item.system.targeting.area.areaUnits == [CONFIG.GODBOUND_CONSTANTS.distanceUnits[2]]) {
        item.summaries.area = "Line Of Sight";
        return;
    }
    else if (item.system.targeting.area.areaUnits == [CONFIG.GODBOUND_CONSTANTS.distanceUnits[3]]) {
        item.summaries.area = "Region";
        return;
    }
    else if (item.system.targeting.area.areaUnits == [CONFIG.GODBOUND_CONSTANTS.distanceUnits[4]]) {
        item.summaries.area = "Realm";
        return;
    }
    else if (item.system.targeting.area.areaUnits == [CONFIG.GODBOUND_CONSTANTS.distanceUnits[5]]) {
        item.summaries.area = "Unlimited";
        return;
    }
    else {
        item.summaries.area = "UNKNOWN";
        return;
    }

    //If we are still here, we are still dealing with conventional feet/miles
    let shapeSuffix;
    if (item.system.targeting.area.areaShape == "none")
        shapeSuffix = "";
    else
        shapeSuffix = " [" + item.system.targeting.area.areaShape.capitalize() + "]";

    item.summaries.area += shapeSuffix;

} // End Area


export default { prepareAttackSummaries };