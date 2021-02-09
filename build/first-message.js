"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emoji = require("node-emoji");
require('dotenv').config();
function addReactions(message, reactions) {
    const reaction = emoji.get(reactions.shift());
    if (reaction) {
        message.react(reaction);
    }
    if (reactions.length > 0) {
        return addReactions(message, reactions);
    }
}
exports.default = async (client, id, text, reactions = []) => {
    const channel = await client.channels.fetch(id);
    channel.messages.fetch().then((messages) => {
        if (messages.size === 0) {
            channel.send(text).then((message) => {
                addReactions(message, reactions);
            });
        }
        else {
            const message = messages.last();
            message?.edit(text);
            addReactions(message, reactions);
        }
    });
};
//# sourceMappingURL=first-message.js.map