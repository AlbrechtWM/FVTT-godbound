import SelectChoices from './helpers/itemSelectChoices.mjs';

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class giftItemSheet extends ItemSheet {

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
    return `systems/godbound/system/items/templates/gift-item-sheet.html`;
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
    // context.GODBOUND_CONSTANTS = CONFIG.GODBOUND_CONSTANTS;

    context.abilitySpeedChoices = SelectChoices.getAbilitySpeedChoices();

    context.durationUnitChoices = SelectChoices.getDurationUnitChoices();

    context.rangeUnitChoices = SelectChoices.getRangeUnitChoices();

    context.effortChoices = SelectChoices.getEffortChoices();

    context.areaShapeChoices = SelectChoices.getAreaShapeChoices();

    context.attributeChoices = SelectChoices.getAttributeChoices();

    context.dieTypeChoices = SelectChoices.getDieTypeChoices();

    context.damageTypeChoices = SelectChoices.getDamageTypeChoices();

    context.savingThrowChoices = SelectChoices.getSavingThrowChoices();

    context.savingThrowSuccessChoices = SelectChoices.getSavingThrowSuccessChoices();

    context.giftParentWordChoices = CONFIG.GODBOUND_CONSTANTS.giftParentTypes;

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
