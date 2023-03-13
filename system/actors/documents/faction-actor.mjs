import { godboundActor } from "./godbound-actor.mjs";

export class factionActor extends godboundActor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    //console.log('1');
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
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
    //console.log('2');
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.godbound || {};
    this._prepareFactionData(actorData);
    //console.log('3');
  }

  /**
   * Prepare Character type specific data
   */
  _prepareFactionData(actorData) {
    if (actorData.type !== 'faction') return;

    // Make modifications to data here. For example:
    //console.log('4');
    const systemData = actorData.system;
    //console.log('5');

    // Loop through ability scores, and add their modifiers to our sheet output.
    // for (let [key, ability] of Object.entries(systemData.abilities)) {
    //   // Calculate the modifier using d20 rules.
    //   ability.mod = Math.floor((ability.value - 10) / 2);
    // }
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    // const data = super.getRollData();

    // // Prepare character roll data.
    // this._getFactionRollData(data);

    // return data;
  }

  /**
   * Prepare character roll data.
   */
  _getFactionRollData(data) {
    // if (this.type !== 'faction') return;

    // // Copy the ability scores to the top level, so that rolls can use
    // // formulas like `@str.mod + 4`.
    // if (data.abilities) {
    //   for (let [k, v] of Object.entries(data.abilities)) {
    //     data[k] = foundry.utils.deepClone(v);
    //   }
    // }

    // // Add level for easier access, or fall back to 0.
    // if (data.attributes.level) {
    //   data.lvl = data.attributes.level.value ?? 0;
    // }
  }

}