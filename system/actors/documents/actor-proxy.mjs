import { godboundCharacterActor } from "./character-actor.mjs";
import { godboundNPCActor } from "./npc-actor.mjs";
import { godboundFactionActor } from "./faction-actor.mjs";
import { godboundActor } from "./godbound-actor.mjs";

const handler = {
    construct(_, args) {
        //console.log("WE MADE IT!");
        switch (args[0]?.type) {
            case "character":
                return new godboundCharacterActor(...args);
            case "npc":
                return new godboundNPCActor(...args);
            case "faction":
                return new godboundFactionActor(...args);
            default:
                console.log("ERROR: Could not find appropriate subclass in proxy construct method.");
        }
    },
};

export const godboundActorProxy = new Proxy(godboundActor, handler);
