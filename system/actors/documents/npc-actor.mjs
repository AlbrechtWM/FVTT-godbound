import { godboundActor } from "./godbound-actor.mjs";
import CoreStats from '../helpers/coreStats.mjs';

export class npcActor extends godboundActor {

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

        //Important for later CoreStat functions knowing whether this is an NPC or PC
        CoreStats.setUseHD(this.system, true);

        //Armor Classs
        CoreStats.calculateAC(this.system);
    
        // Saving throws
        //CoreStats.calculateSavingThrowBonuses(context.system);
        //CoreStats.calculateSavingThrowPenalties(context.system);
        //CoreStats.calculateSavingThrowTotals(context.system);
    
        //HP
        CoreStats.calculateMaxHealth(this.system);
    
        //Effort
        CoreStats.calculateEffort(this.system);
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
    this._prepareNpcData(actorData);
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;
    // systemData.xp = (systemData.cr * systemData.cr) * 100;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    // const data = super.getRollData();

    // // Prepare character roll data.
    // this._getNpcRollData(data);

    // return data;
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    // if (this.type !== 'npc') return;

    // // Process additional NPC data here.
  }

}