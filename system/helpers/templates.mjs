/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor partials.
    "systems/godbound/system/actors/templates/parts/actor-features.html",
    "systems/godbound/system/actors/templates/parts/actor-items.html",
    "systems/godbound/system/actors/templates/parts/actor-spells.html",
    "systems/godbound/system/actors/templates/parts/actor-effects.html",
  ]);
};
