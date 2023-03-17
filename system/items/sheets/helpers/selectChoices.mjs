const getRangeUnitChoices = () => {
    const rangeUnitChoices = {
        [CONFIG.GODBOUND_CONSTANTS.distanceUnits[0]]: "Feet",
        [CONFIG.GODBOUND_CONSTANTS.distanceUnits[1]]: "Miles",
        [CONFIG.GODBOUND_CONSTANTS.distanceUnits[2]]: "Line Of Sight",
        [CONFIG.GODBOUND_CONSTANTS.distanceUnits[3]]: "Region",
        [CONFIG.GODBOUND_CONSTANTS.distanceUnits[4]]: "Realm",
        [CONFIG.GODBOUND_CONSTANTS.distanceUnits[5]]: "Unlimited"
    }

    return rangeUnitChoices;
}

const getEffortChoices = () => {
    const effortChoices = {
        [CONFIG.GODBOUND_CONSTANTS.effortCommittment[0]]: "None",
        [CONFIG.GODBOUND_CONSTANTS.effortCommittment[1]]: "On Turn",
        [CONFIG.GODBOUND_CONSTANTS.effortCommittment[2]]: "Sustained",
        [CONFIG.GODBOUND_CONSTANTS.effortCommittment[3]]: "Scene",
        [CONFIG.GODBOUND_CONSTANTS.effortCommittment[4]]: "Day"
    }

    return effortChoices;
}

const getAreaShapeChoices = () => {
    const areaShapeChoices = {
        [CONFIG.GODBOUND_CONSTANTS.areaShapes[0]]: "None",
        [CONFIG.GODBOUND_CONSTANTS.areaShapes[1]]: "Circle",
        [CONFIG.GODBOUND_CONSTANTS.areaShapes[2]]: "Cone",
        [CONFIG.GODBOUND_CONSTANTS.areaShapes[3]]: "Line",
        [CONFIG.GODBOUND_CONSTANTS.areaShapes[4]]: "Aura"
    }

    return areaShapeChoices;
}

const getAttributeChoices = () => {
    const attributeChoices = {
        [CONFIG.GODBOUND_CONSTANTS.attributeTypes[0]]: "None",
        [CONFIG.GODBOUND_CONSTANTS.attributeTypes[1]]: "Str",
        [CONFIG.GODBOUND_CONSTANTS.attributeTypes[2]]: "Dex",
        [CONFIG.GODBOUND_CONSTANTS.attributeTypes[3]]: "Con",
        [CONFIG.GODBOUND_CONSTANTS.attributeTypes[4]]: "Int",
        [CONFIG.GODBOUND_CONSTANTS.attributeTypes[5]]: "Wis",
        [CONFIG.GODBOUND_CONSTANTS.attributeTypes[6]]: "Cha"
    }

    return attributeChoices;
}

const getDieTypeChoices = () => {
    const dieTypeChoices = {
        [CONFIG.GODBOUND_CONSTANTS.dieTypes[0]]: "None",
        [CONFIG.GODBOUND_CONSTANTS.dieTypes[1]]: "1d2",
        [CONFIG.GODBOUND_CONSTANTS.dieTypes[2]]: "1d4",
        [CONFIG.GODBOUND_CONSTANTS.dieTypes[3]]: "1d6",
        [CONFIG.GODBOUND_CONSTANTS.dieTypes[4]]: "1d8",
        [CONFIG.GODBOUND_CONSTANTS.dieTypes[5]]: "1d10",
        [CONFIG.GODBOUND_CONSTANTS.dieTypes[6]]: "1d12",
        [CONFIG.GODBOUND_CONSTANTS.dieTypes[7]]: "1d20",
    }
    return dieTypeChoices;
}

const getDamageTypeChoices = () => {
    const damageTypeChoices = {
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.physical.force[0]]: "[Physical/Force] Blunt",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.physical.force[1]]: "[Physical/Force] Cutting",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.physical.force[2]]: "[Physical/Force] Piercing",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.physical.elemental[0]]: "[Physical/Elemental] Fire",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.physical.elemental[1]]: "[Physical/Elemental] Electrical",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.physical.elemental[2]]: "[Physical/Elemental] Cold",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.physical.elemental[3]]: "[Physical/Elemental] Corrosive",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.physical.somatic[0]]: "[Physical/Somatic] Poison",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.physical.somatic[1]]: "[Physical/Somatic] Disease",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.physical.somatic[2]]: "[Physical/Somatic] Radiation",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.physical.somatic[3]]: "[Physical/Somatic] Asphyxiation",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.physical.somatic[4]]: "[Physical/Somatic] Starvation",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.physical.somatic[5]]: "[Physical/Somatic] Dehydration",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.physical.somatic[6]]: "[Physical/Somatic] Vacuum",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.physical.somatic[7]]: "[Physical/Somatic] Pressure",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.nonPhysical.spiritual[0]]: "[Non-Physical/Spiritual] Holy",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.nonPhysical.spiritual[1]]: "[Non-Physical/Spiritual] Unholy",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.nonPhysical.mental[0]]: "[Non-Physical/Mental] Emotional",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.nonPhysical.mental[1]]: "[Non-Physical/Mental] Psychic",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.nonPhysical.arcane[0]]: "[Non-Physical/Arcane] Eldritch",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.nonPhysical.arcane[1]]: "[Non-Physical/Arcane] Entropic",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.nonPhysical.arcane[2]]: "[Non-Physical/Arcane] Temporal",
        [CONFIG.GODBOUND_CONSTANTS.damageTypes.nonPhysical.arcane[3]]: "[Non-Physical/Arcane] Vitality",
    }

    return damageTypeChoices;
}

const getSavingThrowChoices = () => {
    const savingThrowChoices = {
        [CONFIG.GODBOUND_CONSTANTS.saveTypes[0]]: "None",
        [CONFIG.GODBOUND_CONSTANTS.saveTypes[1]]: "Hardiness",
        [CONFIG.GODBOUND_CONSTANTS.saveTypes[2]]: "Evasion",
        [CONFIG.GODBOUND_CONSTANTS.saveTypes[3]]: "Spirit",
        [CONFIG.GODBOUND_CONSTANTS.saveTypes[4]]: "Automatic"
    }

    return savingThrowChoices;
}

const getSavingThrowSuccessChoices = () => {
    const savingThrowSuccessChoices = {
        [CONFIG.GODBOUND_CONSTANTS.saveSuccessTypes[0]]: "None",
        [CONFIG.GODBOUND_CONSTANTS.saveSuccessTypes[1]]: "Halves",
        [CONFIG.GODBOUND_CONSTANTS.saveSuccessTypes[2]]: "Negates",
        [CONFIG.GODBOUND_CONSTANTS.saveSuccessTypes[3]]: "Special",
    }

    return savingThrowSuccessChoices;
}

const getDurationUnitChoices = () => {
    const savingThrowSuccessChoices = {
        [CONFIG.GODBOUND_CONSTANTS.durationUnits[0]]: "Instant",
        [CONFIG.GODBOUND_CONSTANTS.durationUnits[1]]: "On Turn",
        [CONFIG.GODBOUND_CONSTANTS.durationUnits[2]]: "Sustained",
        [CONFIG.GODBOUND_CONSTANTS.durationUnits[3]]: "Scene",
        [CONFIG.GODBOUND_CONSTANTS.durationUnits[4]]: "Day",
        [CONFIG.GODBOUND_CONSTANTS.durationUnits[5]]: "Next Turn",
        [CONFIG.GODBOUND_CONSTANTS.durationUnits[6]]: "Round",
        [CONFIG.GODBOUND_CONSTANTS.durationUnits[7]]: "Minute",
        [CONFIG.GODBOUND_CONSTANTS.durationUnits[8]]: "Hour",
        [CONFIG.GODBOUND_CONSTANTS.durationUnits[9]]: "Week",
        [CONFIG.GODBOUND_CONSTANTS.durationUnits[10]]: "Month",
        [CONFIG.GODBOUND_CONSTANTS.durationUnits[11]]: "Year",
        [CONFIG.GODBOUND_CONSTANTS.durationUnits[12]]: "Permanent"
    }

    return savingThrowSuccessChoices;
}

const getAbilitySpeedChoices = () => {
    const abilitySpeedChoices = {
        [CONFIG.GODBOUND_CONSTANTS.abilitySpeeds[0]]: "Instant",
        [CONFIG.GODBOUND_CONSTANTS.abilitySpeeds[1]]: "On Turn",
        [CONFIG.GODBOUND_CONSTANTS.abilitySpeeds[2]]: "Action",
        [CONFIG.GODBOUND_CONSTANTS.abilitySpeeds[3]]: "Constant"
    }

    return abilitySpeedChoices;
}

export default { getRangeUnitChoices, getEffortChoices, getAreaShapeChoices, getAttributeChoices, getDieTypeChoices,
     getDamageTypeChoices, getSavingThrowChoices, getSavingThrowSuccessChoices, getDurationUnitChoices, getAbilitySpeedChoices};