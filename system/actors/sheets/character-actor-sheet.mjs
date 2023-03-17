import { onManageActiveEffect, prepareActiveEffectCategories } from "../../helpers/effects.mjs";
import CoreStats from './helpers/coreStats.mjs';
import Character from './helpers/character.mjs';
import Dominion from './helpers/dominion.mjs';
import Rolls from './helpers/rolls.mjs';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class characterActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["godbound", "sheet", "actor"],
      template: "systems/godbound/system/actors/templates/character-actor-sheet.html",
      width: 665,
      height: 825
      //tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
    });
  }

  /** @override */
  get template() {
    return `systems/godbound/system/actors/templates/character-actor-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.actor;

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;
    // // Prepare character data and items.
    // if (actorData.type == 'character') {
    //   //this._prepareItems(context);
    //   this._prepareCharacterData(context);
    // }

    // convert - can remove once people load this once
    if (context.system.facts instanceof Array) {
      const convertedFacts = {};
      context.system.facts.forEach((fact, i) => {
        convertedFacts[i] = fact;
      });
      context.system.facts = convertedFacts;
    }

    // Add roll data for TinyMCE editors.
    //context.rollData = context.actor.getRollData();

    // Prepare active effects
    //context.effects = prepareActiveEffectCategories(this.actor.effects);

    //Important for later CoreStat functions knowing whether this is an NPC or PC
    CoreStats.setUseHD(context.system, false);

    // Attributes
    Character.calculateDerivedAttributes(context.system);

    //Armor Classs
    CoreStats.calculateAC(context.system);

    // Saving throws
    CoreStats.calculateSavingThrowBonuses(context.system);
    CoreStats.calculateSavingThrowPenalties(context.system);
    CoreStats.calculateSavingThrowTotals(context.system);

    //HP
    CoreStats.calculateMaxHealth(context.system);

    //Effort
    CoreStats.calculateEffort(context.system);

    //Influence
    Character.calculateInfluencePointsRemaining(context.system);

    //Dominion
    Dominion.calculateDominionPointsRemaining(context.system);

    //console.log(context);
    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    // Rollable abilities.
    html.find('div[type=roll]').click(this._onRoll.bind(this));

    html.find('div[type=addto]').click(this._onClickAdd.bind(this));

    html.find('div[type=remove]').click(this._onClickRemove.bind(this));

    // Charsheet tabs
    const tabs = new Tabs({ callback: () => { }, navSelector: ".charsheet-tabs", contentSelector: ".charsheet-content", initial: "char" });
    const theTabs = document.querySelector(".sheetform");
    tabs.bind(theTabs);
  }

  // /**
  //  * Organize and classify Items for Character sheets.
  //  *
  //  * @param {Object} actorData The actor to prepare.
  //  *
  //  * @return {undefined}
  //  */
  // _prepareCharacterData(context) {
  //   // Handle ability scores.
  //   // for (let [k, v] of Object.entries(context.system.abilities)) {
  //   //   v.label = game.i18n.localize(CONFIG.godbound.abilities[k]) ?? k;
  //   // }
  //   //console.log(game);
  // }

  // /**
  //  * Organize and classify Items for Character sheets.
  //  *
  //  * @param {Object} actorData The actor to prepare.
  //  *
  //  * @return {undefined}
  //  */
  // _prepareItems(context) {
  //   // Initialize containers.
  //   const gear = [];
  //   const features = [];
  //   const spells = {
  //     0: [],
  //     1: [],
  //     2: [],
  //     3: [],
  //     4: [],
  //     5: [],
  //     6: [],
  //     7: [],
  //     8: [],
  //     9: []
  //   };

  //   // Iterate through items, allocating to containers
  //   for (let i of context.items) {
  //     i.img = i.img || DEFAULT_TOKEN;
  //     // Append to gear.
  //     if (i.type === 'item') {
  //       gear.push(i);
  //     }
  //     // Append to features.
  //     else if (i.type === 'feature') {
  //       features.push(i);
  //     }
  //     // Append to spells.
  //     else if (i.type === 'spell') {
  //       if (i.system.spellLevel != undefined) {
  //         spells[i.system.spellLevel].push(i);
  //       }
  //     }
  //   }

  //   // Assign and return
  //   context.gear = gear;
  //   context.features = features;
  //   context.spells = spells;
  // }

  /* -------------------------------------------- */


  // Render the item sheet for viewing/editing prior to the editable check.
  // html.find('.item-edit').click(ev => {
  //   const li = $(ev.currentTarget).parents(".item");
  //   const item = this.actor.items.get(li.data("itemId"));
  //   item.sheet.render(true);
  // });

  // // -------------------------------------------------------------
  // // Everything below here is only needed if the sheet is editable
  // if (!this.isEditable) return;

  // // Add Inventory Item
  // html.find('.item-create').click(this._onItemCreate.bind(this));

  // // Delete Inventory Item
  // html.find('.item-delete').click(ev => {
  //   const li = $(ev.currentTarget).parents(".item");
  //   const item = this.actor.items.get(li.data("itemId"));
  //   item.delete();
  //   li.slideUp(200, () => this.render(false));
  // });

  // // Active Effect management
  // html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

  // // Drag events for macros.
  // if (this.actor.isOwner) {
  //   let handler = ev => this._onDragStart(ev);
  //   html.find('li.item').each((i, li) => {
  //     if (li.classList.contains("inventory-header")) return;
  //     li.setAttribute("draggable", true);
  //     li.addEventListener("dragstart", handler, false);
  //   });
  // }
  // }

  // /**
  //  * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
  //  * @param {Event} event   The originating click event
  //  * @private
  //  */
  // async _onItemCreate(event) {
  //   event.preventDefault();
  //   const header = event.currentTarget;
  //   // Get the type of item to create.
  //   const type = header.dataset.type;
  //   // Grab any data associated with this control.
  //   const data = duplicate(header.dataset);
  //   // Initialize a default name.
  //   const name = `New ${type.capitalize()}`;
  //   // Prepare the item object.
  //   const itemData = {
  //     name: name,
  //     type: type,
  //     system: data
  //   };
  //   // Remove the type from the dataset since it's in the itemData.type prop.
  //   delete itemData.system["type"];

  //   // Finally, create the item!
  //   return await Item.create(itemData, {parent: this.actor});
  // }

  /**
   * Handles adding of values
   * @param {Event} event The originating click event
   * @private
   */
  _onClickAdd(event) {
    event.preventDefault();

    const element = event.currentTarget;
    const { typetoadd } = element.dataset;

    Character.add(this.actor, typetoadd)
  }

  /**
 * Handles removal of values
 * @param {Event} event   The originating click event
 * @private
 */
  _onClickRemove(event) {
    event.preventDefault();

    const element = event.currentTarget;
    const { typetoremove, index } = element.dataset;
    console.log(typetoremove, index);
    Character.remove(this.actor, typetoremove, index)
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();

    const element = event.currentTarget;
    const { type, stat, dialog } = element.dataset;

    if (dialog) {
      new Dialog({
        title: "Additional Modifiers",
        content: `<input id="roll-modifier-dialog" type="number" value="0" />`,
        default: "button1",
        buttons: {
          button1: {
            label: "Proceed",
            callback: (html) => {
              const value = html.find("input#roll-modifier-dialog").val();
              Rolls.performRoll(this.actor, this.getData().system, type, value, stat);
            },
            icon: `<i class="fas fa-check"></i>`
          },
          button2: {
            label: "Cancel",
            callback: () => { },
            icon: `<i class="fas fa-cancel"></i>`
          },
        }
      }).render(true);
    } else {
      Rolls.performRoll(this.actor, this.getData().system, type, value, stat)
    }

    // // Handle item rolls.
    // if (dataset.rollType) {
    //   if (dataset.rollType == 'item') {
    //     const itemId = element.closest('.item').dataset.itemId;
    //     const item = this.actor.items.get(itemId);
    //     if (item) return item.roll();
    //   }
    // }

    // // Handle rolls that supply the formula directly.
    // if (dataset.roll) {
    //   let label = dataset.label ? `[ability] ${dataset.label}` : '';
    //   let roll = new Roll(dataset.roll, this.actor.getRollData());
    //   roll.toMessage({
    //     speaker: ChatMessage.getSpeaker({ actor: this.actor }),
    //     flavor: label,
    //     rollMode: game.settings.get('core', 'rollMode'),
    //   });
    //   return roll;
    // }
  }

}
