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
      height: 825,
      tabs: [{ navSelector: ".charsheet-tabs", contentSelector: ".charsheet-content", initial: "char" }]
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

    // // Prepare item data.
    this._prepareItems(context);

    //console.log(context);
    return context;
  }

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

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));


    // Rollable abilities.
    html.find('div[type=roll]').click(this._onRoll.bind(this));

    html.find('div[type=addto]').click(this._onClickAdd.bind(this));

    html.find('div[type=remove]').click(this._onClickRemove.bind(this));
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
        this.prepareAttackSummaries(i, context);
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
  prepareAttackSummaries(item, actor) {
    item.summaries = {};

    this.prepareToHitSummary(item, actor);
    this.prepareDamageSummary(item, actor);
    this.prepareRangeSummary(item, actor);
    this.prepareAreaSummary(item, actor);
  }

  prepareToHitSummary(item, actor) {

    if (item.system.targeting.toHit.isAutomatic) {
      item.summaries.toHit = "Auto";
      return;
    }

    item.summaries.toHit = "1d20";

    //Check advantage/disadvantage first
    if (item.system.targeting.toHit.isAdvantaged && item.system.targeting.toHit.isDisadvantaged) {
      item.summaries.toHit = "1d20"; //if both advantage and disadvantage apply, they cancel out
    }
    else if (item.system.targeting.toHit.isAdvantaged) {
      item.summaries.toHit = "2d20kh1";
    }
    else if (item.system.targeting.toHit.isDisadvantaged) {
      item.summaries.toHit = "2d20kl1";
    }
    //now calc modifiers
    let modifier = 0;
    let targetAC = 0;
    let flavor = "#[";

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


    //flavor
    // if (item.system.targeting.isMagical)
    //   flavor += "Magical,";
    // else
    //   flavor += "Mundane,";

    // if (item.system.act?.isSmite)
    //   flavor += "Smite,";

    // if (item.system.targeting.isMelee)
    //   flavor += "Melee]";
    // else
    //   flavor += "Ranged]";

    item.summaries.toHit += "+" + modifier + (targetAC != null ? "+" + targetAC : "") /*+ " " + flavor*/;

  } // End To Hit

  prepareDamageSummary(item, actor) {

    if (!item.system.damage.enableDamage) {
      item.summaries.damage = "None";
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

    // let flavor = "#[";

    //flavor
    // if (item.system.damage.isStraight)
    //   flavor += "Straight";
    // else
    //   flavor += "Regular";

    // if (item.system.damage.canOverflow)
    //   flavor += ",Overflows";

    // if (item.system.damage.isEnvironmental)
    //   flavor += ",Environmental]";

    // flavor += "]";

    //put it all together
    if (fixedDamage)
      item.summaries.damage = modifier + damageType; /*+ " " + flavor*/
    else
      item.summaries.damage = dieQuantity + dieType + advantageDisadvantageSuffix + damageType + " + " + modifier /*+ " " + flavor*/;
  }//End Damage

  prepareRangeSummary(item, actor) {
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

  prepareAreaSummary(item, actor) {
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

}
