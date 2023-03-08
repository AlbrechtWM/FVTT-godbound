// import { getGame } from "../../utils/utils";
// import { DS4Alphabet } from "./alphabet/alphabet";
// import { DS4Armor } from "./armor/armor";
// import { DS4Equipment } from "./equipment/equipment";
// import { DS4Item } from "./item";
// import { DS4Language } from "./language/language";
// import { DS4Loot } from "./loot/loot";
// import { DS4RacialAbility } from "./racial-ability/racial-ability";
// import { DS4Shield } from "./shield/shield";
// import { DS4SpecialCreatureAbility } from "./special-creature-ability/special-creature-ability";
// import { DS4Spell } from "./spell/spell";
// import { DS4Talent } from "./talent/talent";
// import { DS4Weapon } from "./weapon/weapon";

// const handler = {
//     /**
//      * @param {typeof import("./item").DS4Item}
//      * @param {unknown[]} args
//      */
//     construct(_, args) {
//         switch (args[0]?.type) {
//             case "alphabet":
//                 return new DS4Alphabet(...args);
//             case "armor":
//                 return new DS4Armor(...args);
//             case "equipment":
//                 return new DS4Equipment(...args);
//             case "language":
//                 return new DS4Language(...args);
//             case "loot":
//                 return new DS4Loot(...args);
//             case "racialAbility":
//                 return new DS4RacialAbility(...args);
//             case "shield":
//                 return new DS4Shield(...args);
//             case "specialCreatureAbility":
//                 return new DS4SpecialCreatureAbility(...args);
//             case "spell":
//                 return new DS4Spell(...args);
//             case "talent":
//                 return new DS4Talent(...args);
//             case "weapon":
//                 return new DS4Weapon(...args);
//             default:
//                 throw new Error(getGame().i18n.format("DS4.ErrorInvalidItemType", { type: args[0]?.type }));
//         }
//     },
// };

// /** @type {typeof import("./item").DS4Item} */
// export const DS4ItemProxy = new Proxy(DS4Item, handler);
