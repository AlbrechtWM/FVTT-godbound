import { godboundActor } from "./godbound-actor.mjs";
import CoreStats from '../helpers/coreStats.mjs';
import Character from '../helpers/character.mjs';
import Dominion from '../helpers/dominion.mjs';

/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class characterActor extends godboundActor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.

        //set PC disposition to Friendly
        this.prototypeToken.disposition = CONST.TOKEN_DISPOSITIONS.FRIENDLY;

        //Important for later CoreStat functions knowing whether this is an NPC or PC
        CoreStats.setUseHD(this.system, false);

        // Attributes
        Character.calculateDerivedAttributes(this.system);
    
        //Armor Classs
        CoreStats.calculateAC(this.system);
    
        // Saving throws
        CoreStats.calculateSavingThrowBonuses(this.system);
        CoreStats.calculateSavingThrowPenalties(this.system);
        CoreStats.calculateSavingThrowTotals(this.system);
    
        //HP
        CoreStats.calculateMaxHealth(this.system);
    
        //Effort
        CoreStats.calculateEffort(this.system);
    
        //Influence
        Character.calculateInfluencePointsRemaining(this.system);
    
        //Dominion
        Dominion.calculateDominionPointsRemaining(this.system);

        //console.log(this);
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.godbound || {};
    this._prepareCharacterData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;

    // Loop through ability scores, and add their modifiers to our sheet output.
    // for (let [key, ability] of Object.entries(systemData.abilities)) {
    //   // Calculate the modifier using d20 rules.
    //   ability.mod = Math.floor((ability.value - 10) / 2);
    // }
  }


  // /**
  //  * Override getRollData() that's supplied to rolls.
  //  */
  // getRollData() {
  //   const data = super.getRollData();

  //   // Prepare character roll data.
  //   this._getCharacterRollData(data);

  //   return data;
  // }

  // /**
  //  * Prepare character roll data.
  //  */
  // _getCharacterRollData(data) {
  //   if (this.type !== 'character') return;

  //   // Copy the ability scores to the top level, so that rolls can use
  //   // formulas like `@str.mod + 4`.
  //   if (data.abilities) {
  //     for (let [k, v] of Object.entries(data.abilities)) {
  //       data[k] = foundry.utils.deepClone(v);
  //     }
  //   }

  //   // Add level for easier access, or fall back to 0.
  //   if (data.attributes.level) {
  //     data.lvl = data.attributes.level.value ?? 0;
  //   }
  // }

}