export const godbound_constants = {};

/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */
godbound_constants.damageTypes = {
  "physical": {
    "force": ["blunt", "cutting", "piercing"],
    "elemental": ["fire", "electrical", "cold", "corrosive"],
    "somatic": ["poison", "disease", "radiation", "asphyxiation", "starvation", "dehydration", "vacuum", "pressure"]
  },
  "nonPhysical": {
    "spiritual": ["holy", "unholy"],
    "mental": ["emotional", "psychic"],
    "arcane": ["eldritch", "entropic", "temporal", "vitality"]
  }
};

godbound_constants.giftParentTypes =
  [
  "None", 
  "Universal", 
  "Word of Alacrity", 
  "Word of Apotheosis", 
  "Word of Artifice",
  "Word of Beasts",
  "Word of the Bow",
  "Word of Command",
  "Word of Death",
  "Word of Deception",
  "Word of Earth",
  "Word of Endurance",
  "Word of Fertility",
  "Word of Fire",
  "Word of Health",
  "Word of Journeying",
  "Word of Knowledge",
  "Word of Luck",
  "Word of Might",
  "Word of Night",
  "Word of Passion",
  "Word of the Sea",
  "Word of the Sky",
  "Word of Sorcery",
  "Word of the Sun",
  "Word of the Sword",
  "Word of Time",
  "Word of Wealth",
  "Word of Shapeshifting",
  "Word of Fate",
  "Word of Birds",
  "Word of Cities",
  "Word of Dance",
  "Word of the Desert",
  "Word of Desire",
  "Word of Engineering",
  "Word of Entropy",
  "Word of Fear",
  "Word of Insects",
  "Word of Intoxication",
  "Word of Madness",
  "Word of Murder",
  "Word of Music",
  "Word of the Network",
  "Word of Protection",
  "Word of Theft",
  "Word of the Underworld",
  "Word of Vengeance",
  "Word of War",
  "Word of Winter",
  "Artificial Intelligence",
  "Dragon",
  "Faerie Queen",
  "Lich King",
  "Peak Human",
  "Word of Magic",
  "Word of Plenty",
  "Word of the Inferno",
  "Word of the Blade",
  "Word of Monsters",
  "Word of Metamorphosis",
  "Word of Exploration",
  "Word of Darkness",
  "Word of the World",
  "Word of Trickery",
  "Word of Communication",
  "Superlative Mortal",
  "Word of Drugs",
  "Word of the Heavens",
  "Word of Lore",
  "Word of Permanence",
  "Word of Slaughter"
];

godbound_constants.effectTypes = {
  "suppression": ["word-suppression", "gift-suppresion", "ability-suppresion", "trait-suppresion", "magic-suppresion"],
  "mind-influencing": ["mind-control", "mind-reading"],
  "emotion-influencing": ["fear", "anger", "joy", "sadness", "apathy"],
  "involuntary-movement": ["knockback", "puppet-move"],
  "involuntary-actions": ["berserk", "confusion", "puppet-action"],
  "magic": ["low-magic", "gate-theurgy", "way-theurgy", "throne-theurgy"],
  "movement-stopping": ["knockdown", "rooting", "pinning"],
  "movement-slowing": ["snare", "lethargy"],
  "attack-penalty": "attack-penalty",
  "save-penalty": ["all", "hardiness", "evasion", "spirit"],
  "attribute-penalty": ["all", "str", "dex", "con", "int", "wis", "cha"],
  "hp-penalty": ["max-hp", "hp-loss"],
  "damage-penalty": ["disadvantage", "damage-loss", "no-damage"],
  "effort-penalty": ["effort-base-cost", "effort-loss", "max-effort"],
  "turn-stopping": ["paralyzing", "freezing", "stunning"],
  "action-penalty": ["action-reducing", "action-preventing"],
  "initiative-penalty": ["act-last"],
  "vision-impairing": ["blinding", "vision-limiting", "vision-altering"],
  "hearing-impairing": ["deafening"],
  "recurring-damage": ["bleeding", "poisoning", "burning", "melting"],
  "illusion": ["illusion"],
  "displacement": ["banishing", "teleporting", "dimensioning", "time-slipping"]
};

godbound_constants.saveTypes =
  ["none", "hardiness", "evasion", "spirit", "automatic"];

godbound_constants.saveSuccessTypes =
  ["none", "halves", "negates", "special"];

godbound_constants.areaShapes =
  ["none", "circle", "cone", "line", "aura"];

godbound_constants.distanceUnits =
  ["feet", "miles", "line-of-sight", "region", "realm", "unlimited"];

godbound_constants.effortCommittment = ["none", "on-turn", "sustained", "scene", "day"];

godbound_constants.abilitySpeeds = ["instant", "on-turn", "action", "constant"];

godbound_constants.durationUnits = ["instant", "on-turn", "sustained", "scene", "day", "next-turn", "round", "minute", "hour", "week", "month", "year", "permanent"];

godbound_constants.attributeTypes = ["none", "str", "dex", "con", "int", "wis", "cha", "all"];

godbound_constants.dieTypes = ["none", "1d2", "1d4", "1d6", "1d8", "1d10", "1d12", "1d20"];

godbound_constants.saveFrequencies = ["once", "duration-tick", "special"];

