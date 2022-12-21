import * as server from "@minecraft/server"
import * as serverUi from "@minecraft/server-ui"

const ActionFormData = Object.assign(serverUi.ActionFormData, {});

const show = serverUi.ActionFormData.prototype.show;

Object.assign(serverUi.ActionFormData.prototype, {
    callbacks: [] as ((arg: ActionFormResponse) => void)[],
    async show(player: server.Player) {
        // @ts-ignore
        return show.bind(this)(player).then((response) => {
            // @ts-ignore
            return response.player = player, this.callbacks.forEach(callback => callback(response)), response;
        });
    },
    subscribe(callback: (arg: ActionFormResponse) => void) {
        return this.callbacks[this.callbacks.length] = callback;
    },
    unsubscribe(callback: (arg: ActionFormResponse) => void) {
        delete this.callbacks[this.callbacks.indexOf(callback)];
    }
});

type ActionFormResponse = serverUi.ActionFormResponse;

const ActionFormResponse = Object.assign(serverUi.ActionFormResponse, {});

Object.assign(serverUi.ActionFormResponse.prototype, { player: undefined });

export { ActionFormData, ActionFormResponse };
