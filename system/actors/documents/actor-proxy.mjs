import { characterActor } from "./character-actor.mjs";
import { npcActor } from "./npc-actor.mjs";
import { factionActor } from "./faction-actor.mjs";
import { godboundActor } from "./godbound-actor.mjs";

const handler = {
    construct(_, args) {
        switch (args[0]?.type) {
            case "character":
                return new characterActor(...args);
            case "npc":
                return new npcActor(...args);
            case "faction":
                return new factionActor(...args);
            default:
                console.log("ERROR: Could not find appropriate subclass in proxy construct method.");
        }
    },
};

export const actorProxy = new Proxy(godboundActor, handler);
