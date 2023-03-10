import { onManageActiveEffect, prepareActiveEffectCategories } from "../../helpers/effects.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class godboundCharacterActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["godbound", "sheet", "actor"],
      template: "systems/godbound/system/actors/templates/character-actor-sheet.html",
      width: 600,
      height: 600
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
    const actorData = this.actor.toObject(false);

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // // Prepare character data and items.
    // if (actorData.type == 'character') {
    //   //this._prepareItems(context);
    //   this._prepareCharacterData(context);
    // }

    // Add roll data for TinyMCE editors.
    //context.rollData = context.actor.getRollData();

    // Prepare active effects
    //context.effects = prepareActiveEffectCategories(this.actor.effects);

    //console.log(context.system);
    context.abilityPointsFree = this.calculateAbilityPointsRemaining(context);
    this.calculateDerivedAttributes(context);
    this.calculateAC(context);
    this.calculateSavingThrowBonuses(context);
    this.calculateSavingThrowPenalties(context);
    this.calculateSavingThrowTotal(context);

    //console.log(context);
    return context;
  }

  calculateAbilityPointsRemaining(context) {
    return context.system.abilityPoints.total - context.system.abilityPoints.spent;
  }

  calculateDerivedAttributes(context) {
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

  calculateAC(context) {
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

  /**
   * Calculates saving throw bonuses based on stat modifiers - can eventually take buffs, etc
   * @param {Object} context - Entire game context
   */
  calculateSavingThrowBonuses(context) {
    const types = {
      hardiness: ['str', 'con'],
      evasion: ['int', 'dex'],
      spirit: ['wis', 'cha'],
    };

    const mods = {
      str: context.system.attributes.str.mod,
      con: context.system.attributes.con.mod,
      dex: context.system.attributes.dex.mod,
      int: context.system.attributes.int.mod,
      cha: context.system.attributes.cha.mod,
      wis: context.system.attributes.wis.mod,
    }

    // Iterate through all save types and get max of the type of stat mod that effects this roll
    Object.entries(types).forEach(([type, modName]) => {
      context.system.coreStats.saves[type].attributeModifier = Math.max(mods[modName[0]], mods[modName[1]]);
    });

  }

  /**
   * Calculates saving throw penalties based on various penalty modifiers - arrays below can take additional values
   * @param {Object} context - Entire game context
   */
  calculateSavingThrowPenalties(context) {
    // Add additional entries to these arrays when additional modifiers are required
    const types = {
      hardiness: [context.system.coreStats.saves.hardiness.isArmorPenalty ? -4 : 0],
      evasion: [context.system.coreStats.saves.evasion.isArmorPenalty ? -4 : 0],
      spirit: [context.system.coreStats.saves.spirit.isArmorPenalty ? -4 : 0],
    };

    // Iterate through all save types and then use Array.reduce to calculate a running total of modifiers
    Object.entries(types).forEach(([type, modifiers]) => {
      context.system.coreStats.saves[type].penaltyModifier = modifiers.reduce((a, b) => a + b, 0);
    });

  }

  /**
   * Calculates the total saving throw bonus
   * @param {Object} context - Entire game context
   */
  calculateSavingThrowTotal(context) {
    const types = [
      'hardiness',
      'evasion',
      'spirit',
    ];

    types.forEach((type) => {
      context.system.coreStats.saves[type].total = 16 - (context.system.coreStats.saves[type].penaltyModifier)
        + (context.system.coreStats.saves[type].attributeModifier * -1) - context.system.coreStats.levelOrHD;
    });

  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
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

  // // Rollable abilities.
  // html.find('.rollable').click(this._onRoll.bind(this));

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

  // /**
  //  * Handle clickable rolls.
  //  * @param {Event} event   The originating click event
  //  * @private
  //  */
  // _onRoll(event) {
  //   event.preventDefault();
  //   const element = event.currentTarget;
  //   const dataset = element.dataset;

  //   // Handle item rolls.
  //   if (dataset.rollType) {
  //     if (dataset.rollType == 'item') {
  //       const itemId = element.closest('.item').dataset.itemId;
  //       const item = this.actor.items.get(itemId);
  //       if (item) return item.roll();
  //     }
  //   }

  //   // Handle rolls that supply the formula directly.
  //   if (dataset.roll) {
  //     let label = dataset.label ? `[ability] ${dataset.label}` : '';
  //     let roll = new Roll(dataset.roll, this.actor.getRollData());
  //     roll.toMessage({
  //       speaker: ChatMessage.getSpeaker({ actor: this.actor }),
  //       flavor: label,
  //       rollMode: game.settings.get('core', 'rollMode'),
  //     });
  //     return roll;
  //   }
  //}

}
