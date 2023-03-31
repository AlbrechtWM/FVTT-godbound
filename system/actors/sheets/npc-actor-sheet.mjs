import { onManageActiveEffect, prepareActiveEffectCategories } from "../../helpers/effects.mjs";
import CoreStats from '../helpers/coreStats.mjs';
import Rolls from '../helpers/rolls.mjs';
import Attacks from '../helpers/attacks.mjs';
//import SelectChoices from '../helpers/actorSelectChoices.mjs';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class npcActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["godbound", "sheet", "actor"],
      template: "systems/godbound/system/actors/templates/npc-actor-sheet.html",
      width: 647,
      height: 811,
      tabs: [{ navSelector: ".npcsheet-tabs", contentSelector: ".npcsheet-content", initial: "npc" }]
    });
  }

  /** @override */
  get template() {
    return `systems/godbound/system/actors/templates/npc-actor-sheet.html`;
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

    // Add roll data for TinyMCE editors.
    //context.rollData = context.actor.getRollData();

    // Prepare active effects
    //context.effects = prepareActiveEffectCategories(this.actor.effects);

    //Important for later CoreStat functions knowing whether this is an NPC or PC
    CoreStats.setUseHD(context.system, true);

    const choices = foundry.utils.invertObject(CONST.TOKEN_DISPOSITIONS);
    Object.entries(choices).forEach(([key, label]) => choices[key] = `${label.toLowerCase().capitalize()}`);
    context.dispositionChoices = choices;

    //Armor Classs
    CoreStats.calculateAC(context.system);

    // Saving throws
    //CoreStats.calculateSavingThrowBonuses(context.system);
    //CoreStats.calculateSavingThrowPenalties(context.system);
    //CoreStats.calculateSavingThrowTotals(context.system);

    //HP
    CoreStats.calculateMaxHealth(context.system);

    //Effort
    CoreStats.calculateEffort(context.system);

    // // Prepare item data.
    this._prepareItems(context);

    //console.log(context.prototypeToken.disposition);
    return context;
  }


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

  // /* -------------------------------------------- */
  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Past Inventory Item to Chat
    html.find('.item-chat-paste').click(this._onChatPaste.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));

      new Dialog({
        title: "Confirm Deletion",
        content: `<div class="margin-bottom-1em">Really Delete ${item.name}?</div>`,
        default: "button1",
        buttons: {
          button1: {
            label: "Delete",
            callback: () => {
              item.delete();
              li.slideUp(200, () => this.render(false));
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
    });

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    // Rollable abilities.
    html.find('div[type=roll]').click(this._onRoll.bind(this));

    html.find('div[type=addto]').click(this._onClickAdd.bind(this));

    html.find('div[type=remove]').click(this._onClickRemove.bind(this));

    //Stat manipulation
    html.find('.stat-plus').click(this.onStatPlus.bind(this));
    html.find('.stat-minus').click(this.onStatMinus.bind(this));
    html.find('.stat-reset').click(this.onStatReset.bind(this));
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {
    // Handle ability scores.
    // for (let [k, v] of Object.entries(context.system.abilities)) {
    //   v.label = game.i18n.localize(CONFIG.godbound.abilities[k]) ?? k;
    // }
    //console.log(game);
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    // Initialize containers.
    const gifts = [];
    const words = [];
    const attacks = [];

    // const spells = {
    //   0: [],
    //   1: [],
    //   2: [],
    //   3: [],
    //   4: [],
    //   5: [],
    //   6: [],
    //   7: [],
    //   8: [],
    //   9: []
    // };

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'gift') {
        gifts.push(i);
      }
      // Append to features.
      else if (i.type === 'attack') {
        Attacks.prepareAttackSummaries(i, context);
        attacks.push(i);
      }
      // Append to features.
      else if (i.type === 'word') {
        words.push(i);
      }


      // // Append to spells.
      // else if (i.type === 'spell') {
      //   if (i.system.spellLevel != undefined) {
      //     spells[i.system.spellLevel].push(i);
      //   }
      // }
    }

    // Assign and return
    context.gifts = gifts;
    context.words = words;
    context.attacks = attacks;
  }

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

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  }

  async onStatPlus(event) {
    const header = event.currentTarget;
    const statField = header.dataset.type;
    let currentValue = this.actor.system.coreStats.effort[statField];
    currentValue++;
    let statPath = `system.coreStats.effort.${statField}`;
    let newValue = { [statPath]: currentValue };
    await this.actor.update(newValue);

    //Chat Message
    const tempActor = this.actor;
    const speaker = ChatMessage.getSpeaker({ tempActor });

    CoreStats.calculateEffort(this.actor.system);

    let messagePreamble = tempActor.name + " has committed ";
    switch (statField + "") {
      case "sustainCommitted":
        messagePreamble += "Sustained Effort.";
        break;
      case "turnCommitted":
        messagePreamble += "Effort for the Turn.";
        break;
      case "sceneCommitted":
        messagePreamble += "Effort for the Scene.";
        break;
      case "dayCommitted":
        messagePreamble += "Effort for the Day.";
        break;
    }

    let message = `<p style="font-style: italic">${messagePreamble}</p>`; //This part hidden for NPCs  <p style="font-weight: bold">  Remaining Effort: ${this.actor.system.coreStats.effort.value}/${this.actor.system.coreStats.effort.max}

    const chatData = {
      user: game.user._id,
      speaker,
      content: message,
    };
    ChatMessage.create(chatData, {});
  }

  async onStatMinus(event) {
    const header = event.currentTarget;
    const statField = header.dataset.type;
    let currentValue = this.actor.system.coreStats.effort[statField];
    currentValue--;
    let statPath = `system.coreStats.effort.${statField}`;
    let newValue = { [statPath]: currentValue };
    await this.actor.update(newValue);

    //Chat Message
    const tempActor = this.actor;
    const speaker = ChatMessage.getSpeaker({ tempActor });

    CoreStats.calculateEffort(this.actor.system);

    let messagePreamble = tempActor.name + " has reclaimed ";
    switch (statField + "") {
      case "sustainCommitted":
        messagePreamble += "Sustained Effort.";
        break;
      // case "turnCommitted":
      //   messagePreamble += "Effort for the Turn.";
      //   break;
      // case "sceneCommitted":
      //   messagePreamble += "Effort for the Scene.";
      //   break;
      // case "dayCommitted":
      //   messagePreamble += "Effort for the Day.";
      //   break;
    }

    let message = `<p style="font-style: italic">${messagePreamble}</p>`; //This part hidden for NPCs  <p style="font-weight: bold">  Remaining Effort: ${this.actor.system.coreStats.effort.value}/${this.actor.system.coreStats.effort.max}

    const chatData = {
      user: game.user._id,
      speaker,
      content: message,
    };
    ChatMessage.create(chatData, {});
  }

  async onStatReset(event) {
    const header = event.currentTarget;
    const statField = header.dataset.type;
    let currentValue = this.actor.system.coreStats.effort[statField];
    currentValue = 0;
    let statPath = `system.coreStats.effort.${statField}`;
    let newValue = { [statPath]: currentValue };
    await this.actor.update(newValue);

    //Chat Message
    const tempActor = this.actor;
    const speaker = ChatMessage.getSpeaker({ tempActor });

    CoreStats.calculateEffort(this.actor.system);

    let messagePreamble = tempActor.name + " has reset their ";
    switch (statField + "") {
      // case "sustainCommitted":
      //   messagePreamble += "Sustained Effort.";
      //   break;
      case "turnCommitted":
        messagePreamble += " Turn Effort.";
        break;
      case "sceneCommitted":
        messagePreamble += " Scene Effort.";
        break;
      case "dayCommitted":
        messagePreamble += " Day Effort.";
        break;
    }

    let message = `<p style="font-style: italic">${messagePreamble}</p>`; //This part hidden for NPCs  <p style="font-weight: bold">  Remaining Effort: ${this.actor.system.coreStats.effort.value}/${this.actor.system.coreStats.effort.max}

    const chatData = {
      user: game.user._id,
      speaker,
      content: message,
    };
    ChatMessage.create(chatData, {});
  }

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

    new Dialog({
      title: "Confirm Deletion",
      content: `<div class="margin-bottom-1em">Really Delete ${typetoremove.charAt(0).toUpperCase()}${typetoremove.slice(1)}?</div>`,
      default: "button1",
      buttons: {
        button1: {
          label: "Delete",
          callback: () => {
            Character.remove(this.actor, typetoremove, index);
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
  }
  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();

    const element = event.currentTarget;
    const { type, stat, dialog, tohit, damage } = element.dataset;

    if (dialog) {
      new Dialog({
        title: "Additional Modifiers",
        content: `<input id="roll-modifier-dialog" type="number" value="0" />`,
        default: "button1",
        buttons: {
          button1: {
            label: "Proceed",
            callback: (html) => {
              const modifier = html.find("input#roll-modifier-dialog").val();
              Rolls.performRoll(this.actor, { type, modifier, stat, tohit, damage })
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
      Rolls.performRoll(this.actor, { type, stat, tohit, damage })
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

  _onChatPaste(event) {
    const li = $(event.currentTarget).parents(".item");
    const item = this.actor.items.get(li.data("itemId"));
    const tempActor = this.actor;
    const speaker = ChatMessage.getSpeaker({ tempActor });

    let message = `<div style="text-align: center; font-weight: bold; text-decoration: underline;">${item.name}</div><hr/><p style="font-style: italic">${item.system.base.description}</p>`;

    const chatData = {
      user: game.user._id,
      speaker,
      content: message,
    };
    ChatMessage.create(chatData, {});
  }


}
