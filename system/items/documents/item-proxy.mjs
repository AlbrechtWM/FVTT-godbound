import { attackItem } from "./attack-item.mjs";
import { godboundItem } from "./godbound-item.mjs";
import { giftItem } from "./gift-item.mjs";

const handler = {
    construct(_, args) {
        switch (args[0]?.type) {
            case "attack":
                return new attackItem(...args);
                case "gift":
                    return new giftItem(...args);
            // case "npc":
            //     return new npcActor(...args);
            // case "faction":
            //     return new factionActor(...args);
            default:
                console.log("ERROR: Could not find appropriate subclass in proxy construct method.");
        }
    },
};

export const itemProxy = new Proxy(godboundItem, handler);
