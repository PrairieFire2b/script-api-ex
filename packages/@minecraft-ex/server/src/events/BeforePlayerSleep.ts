import * as server from "@minecraft/server"

class BeforePlayerSleepEvent {
    blockLocation!: server.BlockLocation;
    cancel = false;
    player!: server.Player;
}

class BeforePlayerSleepEventSignal {
    #callbacks: ((arg: BeforePlayerSleepEvent) => void)[] = [];
    constructor() {
        let event: BeforePlayerSleepEvent;
        server.world.events.beforeItemUseOn.subscribe(arg => {
            let block = arg.source.dimension.getBlock(arg.blockLocation);
            if(!arg.source.isSneaking
                && block?.typeId === server.MinecraftBlockTypes.bed.id
                && block?.dimension.id === "minecraft:overworld"
                && server.world.getTime() >= 13000 && server.world.getTime() <= 23457
                && !(block.dimension.getEntities({
                    maxDistance: 15,
                    location: new server.Location(block.x, block.y, block.z),
                    families: ["monster"]
                })[Symbol.iterator]().next().value)) {
                event = new BeforePlayerSleepEvent;
                event.blockLocation = arg.blockLocation;
                event.player = Array.from(server.world.getPlayers({name: arg.source.nameTag}))[0];
                this.#callbacks.forEach(callback => server.system.run(() => callback(event)));
                arg.cancel = event.cancel;
            }
        });
    }
    subscribe(callback: (arg: BeforePlayerSleepEvent) => void) {
        return this.#callbacks[this.#callbacks.length] = callback;
    }
    unsubscribe(callback: (arg: BeforePlayerSleepEvent) => void) {
        delete this.#callbacks[this.#callbacks.indexOf(callback)];
    }
}

let beforePlayerSleep: BeforePlayerSleepEventSignal = new BeforePlayerSleepEventSignal();

export { BeforePlayerSleepEvent, BeforePlayerSleepEventSignal, beforePlayerSleep };
