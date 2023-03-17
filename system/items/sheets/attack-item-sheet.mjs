/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class attackItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["godbound", "sheet", "item"],
      width: 1000,
      height: 550,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    //const path = "systems/godbound/system/items/templates/item";
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.html`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.
    return `systems/godbound/system/items/templates/attack-item-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = context.item;

    // Retrieve the roll data for TinyMCE editors.
    // context.rollData = {};
    // let actor = this.object?.parent ?? null;
    // if (actor) {
    //   context.rollData = actor.getRollData();
    // }

    // Add the items's data to context.data for easier access, as well as flags.
    context.system = itemData.system;
    context.flags = itemData.flags;
    context.GODBOUND_CONSTANTS = CONFIG.GODBOUND_CONSTANTS;

    context.rangeUnitChoices = {
      [CONFIG.GODBOUND_CONSTANTS.distanceUnits[0]] : "Feet",
      [CONFIG.GODBOUND_CONSTANTS.distanceUnits[1]] : "Miles",
      [CONFIG.GODBOUND_CONSTANTS.distanceUnits[2]] : "Line Of Sight",
      [CONFIG.GODBOUND_CONSTANTS.distanceUnits[3]] : "Region",
      [CONFIG.GODBOUND_CONSTANTS.distanceUnits[4]] : "Realm",
      [CONFIG.GODBOUND_CONSTANTS.distanceUnits[5]] : "Unlimited"
    }

    context.effortChoices = {
      [CONFIG.GODBOUND_CONSTANTS.effortCommittment[0]]: "None",
      [CONFIG.GODBOUND_CONSTANTS.effortCommittment[1]]: "On Turn",
      [CONFIG.GODBOUND_CONSTANTS.effortCommittment[2]]: "Sustained",
      [CONFIG.GODBOUND_CONSTANTS.effortCommittment[3]]: "Scene",
      [CONFIG.GODBOUND_CONSTANTS.effortCommittment[4]]: "Day"
    }

    context.areaShapeChoices = {
      [CONFIG.GODBOUND_CONSTANTS.areaShapes[0]]: "None",
      [CONFIG.GODBOUND_CONSTANTS.areaShapes[1]]: "Circle",
      [CONFIG.GODBOUND_CONSTANTS.areaShapes[2]]: "Cone",
      [CONFIG.GODBOUND_CONSTANTS.areaShapes[3]]: "Line",
      [CONFIG.GODBOUND_CONSTANTS.areaShapes[4]]: "Aura"
    }

    context.attributeChoices = {
      [CONFIG.GODBOUND_CONSTANTS.attributeTypes[0]]: "None",
      [CONFIG.GODBOUND_CONSTANTS.attributeTypes[1]]: "Str",
      [CONFIG.GODBOUND_CONSTANTS.attributeTypes[2]]: "Dex",
      [CONFIG.GODBOUND_CONSTANTS.attributeTypes[3]]: "Con",
      [CONFIG.GODBOUND_CONSTANTS.attributeTypes[4]]: "Int",
      [CONFIG.GODBOUND_CONSTANTS.attributeTypes[5]]: "Wis",
      [CONFIG.GODBOUND_CONSTANTS.attributeTypes[6]]: "Cha"
    }

    context.dieTypeChoices = {
      [CONFIG.GODBOUND_CONSTANTS.dieTypes[0]]: "None",
      [CONFIG.GODBOUND_CONSTANTS.dieTypes[1]]: "1d2",
      [CONFIG.GODBOUND_CONSTANTS.dieTypes[2]]: "1d4",
      [CONFIG.GODBOUND_CONSTANTS.dieTypes[3]]: "1d6",
      [CONFIG.GODBOUND_CONSTANTS.dieTypes[4]]: "1d8",
      [CONFIG.GODBOUND_CONSTANTS.dieTypes[5]]: "1d10",
      [CONFIG.GODBOUND_CONSTANTS.dieTypes[6]]: "1d12",
      [CONFIG.GODBOUND_CONSTANTS.dieTypes[7]]: "1d20",
    }

    context.damageTypeChoices = {
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

    context.savingThrowChoices = {
      [CONFIG.GODBOUND_CONSTANTS.saveTypes[0]]: "None",
      [CONFIG.GODBOUND_CONSTANTS.saveTypes[1]]: "Hardiness",
      [CONFIG.GODBOUND_CONSTANTS.saveTypes[2]]: "Evasion",
      [CONFIG.GODBOUND_CONSTANTS.saveTypes[3]]: "Spirit",
      [CONFIG.GODBOUND_CONSTANTS.saveTypes[4]]: "Automatic"
    }

    context.savingThrowSuccessChoices = {
      [CONFIG.GODBOUND_CONSTANTS.saveSuccessTypes[0]]: "None",
      [CONFIG.GODBOUND_CONSTANTS.saveSuccessTypes[1]]: "Halves",
      [CONFIG.GODBOUND_CONSTANTS.saveSuccessTypes[2]]: "Negates",
      [CONFIG.GODBOUND_CONSTANTS.saveSuccessTypes[3]]: "Special",
    }

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. would go here.
  }
}
