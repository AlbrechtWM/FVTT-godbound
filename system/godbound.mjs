// Import document classes.
import { actorProxy } from "./actors/documents/actor-proxy.mjs";
import { characterActor } from "./actors/documents/character-actor.mjs";
import { npcActor } from "./actors/documents/npc-actor.mjs";
import { factionActor } from "./actors/documents/faction-actor.mjs";
import { godboundItem } from "./items/documents/godbound-item.mjs";
import { itemProxy } from "./items/documents/item-proxy.mjs";
import { attackItem } from "./items/documents/attack-item.mjs";
import { giftItem } from "./items/documents/gift-item.mjs";
import { wordItem } from "./items/documents/word-item.mjs";
// Import sheet classes.
import { characterActorSheet } from "./actors/sheets/character-actor-sheet.mjs";
import { npcActorSheet } from "./actors/sheets/npc-actor-sheet.mjs";
import { factionActorSheet } from "./actors/sheets/faction-actor-sheet.mjs";
import { godboundItemSheet } from "./items/sheets/item-sheet.mjs";
import { attackItemSheet } from "./items/sheets/attack-item-sheet.mjs";
import { giftItemSheet } from "./items/sheets/gift-item-sheet.mjs";
import { wordItemSheet } from "./items/sheets/word-item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { godbound_constants } from "./helpers/godbound_constants.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.godbound = {
    characterActor,
    npcActor,
    factionActor,
    godboundItem,
    attackItem,
    giftItem,
    wordItem,
    rollItemMacro
  };


  // Add custom constants for configuration.
  CONFIG.GODBOUND_CONSTANTS = godbound_constants;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "10",
    decimals: 2
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = actorProxy;
  CONFIG.Item.documentClass = itemProxy;

  // Unregister Core Foundry Sheets
  Actors.unregisterSheet("core", ActorSheet);
  Items.unregisterSheet("core", ItemSheet);

  // Register Godbound Actor Sheets


  Actors.registerSheet("godbound", npcActorSheet, { types: ["npc"], makeDefault: false });
  Actors.registerSheet("godbound", characterActorSheet, { types: ["character"], makeDefault: false });
  Actors.registerSheet("godbound", factionActorSheet, { types: ["faction"], makeDefault: false });

  // Register Godbound Item Sheets
  Items.registerSheet("godbound", godboundItemSheet, { makeDefault: false });
  Items.registerSheet("godbound", attackItemSheet, { types: ["attack"], makeDefault: false });
  Items.registerSheet("godbound", giftItemSheet, { types: ["gift"], makeDefault: false });
  Items.registerSheet("godbound", wordItemSheet, { types: ["word"], makeDefault: false });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper('concat', function () {
  var outStr = '';
  for (var arg in arguments) {
    if (typeof arguments[arg] != 'object') {
      outStr += arguments[arg];
    }
  }
  return outStr;
});

Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

Handlebars.registerHelper('getStringArrayValue', function (strArray, index) {
  return strArray[index];
});

Handlebars.registerHelper('areStringsEqual', function (str1, str2) {
  return (str1 == str2);
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Other Hooks                                 */
/* -------------------------------------------- */

//Prefire all the expansions... as much of a hack as this is it's needed apparently to preserve the animation and to have them start opened
Hooks.on("renderActorSheet", (docArg, htmlArg) => {
  const accordionBanners = htmlArg.find('.accordion-banner');
  //console.log(accordionBanners);
  for (let tempAB of accordionBanners) {
    var accordionPanel = tempAB.nextElementSibling;
    accordionPanel.style.maxHeight = "fit-content";
    //console.log(accordionPanel);
  }
});

Hooks.on("targetToken", (userArg, tokenArg, targetedArg) => {
  // console.log(userArg);
  // console.log(tokenArg);
  // console.log(targetedArg);
  //console.log(ui.windows);

  let windows = ui.windows;
  Object.entries(windows).forEach(([key, window]) => {
    if (window.options.baseApplication == "ActorSheet") {
      window.render();
    }
  })
});

Hooks.on("preCreateToken", (docArg, dataArg, optionsArg) => {
  // console.log("Pre Create Token");
  //console.log(docArg);
  // console.log(dataArg);
  // console.log(optionsArg);
  let tempTexture = docArg.texture;
  tempTexture.src = docArg.actor.img;
  let tempBar1 = docArg.bar1;
  tempBar1.attribute = "coreStats.hp";
  let tempBar2 = docArg.bar2;
  tempBar2.attribute = "coreStats.effort";
  docArg.updateSource({ texture: tempTexture });
  docArg.updateSource({ name: docArg.actor.name });
  if(docArg.actor.type == "character")
  {
    docArg.updateSource({ actorLink: true});
  }
  if (docArg.actor.prototypeToken.disposition == CONST.TOKEN_DISPOSITIONS.FRIENDLY) {
    //docArg.updateSource({ disposition: 1 }); 
    docArg.updateSource({ displayBars: 50 });
    docArg.updateSource({ displayName: 50 });
    docArg.updateSource({ bar1: tempBar1 });
    docArg.updateSource({ bar2: tempBar2 });
  }
  else {
    //docArg.updateSource({ disposition: docArg.actor.prototypeToken.disposition });
    docArg.updateSource({ displayBars: 40 });
    docArg.updateSource({ displayName: 50 });
    docArg.updateSource({ bar1: tempBar1 });
    docArg.updateSource({ bar2: tempBar2 });
  }
});

Hooks.on("createToken", (docArg, dataArg, optionsArg) => {
  // console.log(docArg);
  // console.log(dataArg);
  // console.log(optionsArg);

});

Hooks.on("combatStart", (combatArg, updateDataArg) => {
  //console.log(combatArg);

  new Dialog({
    title: "Players Surprised or Ambushed",
    content: `<div class="flexrow" style="align-items: center; margin-bottom: 10px; justify-content: flex-start;"><label>Are the Players Surprised?</label><input id="surprise-checkbox" type="checkbox"/></div>`,
    default: "button1",
    buttons: {
      button1: {
        label: "Proceed",
        callback: (html) => {
          let areSurprised = html.find("input#surprise-checkbox").prop("checked");
          for (let actor of combatArg.combatants) {
            if (actor.token.disposition == CONST.TOKEN_DISPOSITIONS.FRIENDLY)
              areSurprised ? combatArg.setInitiative(actor.id, 10) : combatArg.setInitiative(actor.id, 20);
            else if (actor.token.disposition == CONST.TOKEN_DISPOSITIONS.NEUTRAL)
              combatArg.setInitiative(actor.id, 15);
            else if (actor.token.disposition == CONST.TOKEN_DISPOSITIONS.HOSTILE)
              areSurprised ? combatArg.setInitiative(actor.id, 20) : combatArg.setInitiative(actor.id, 10);
            else
              combatArg.setInitiative(actor.id, 5);
          }
        },
        icon: `<i class="fas fa-check"></i>`
      }
    }
  }).render(true);
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== "Item") return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn("You can only create macro buttons for owned Items");
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.godbound.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "godbound.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then(item => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(`Could not find item ${itemName}. You may need to delete and recreate this macro.`);
    }

    // Trigger the item roll
    item.roll();
  });
}