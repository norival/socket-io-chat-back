/**
 * @typedef message
 * @type {Object}
 * @property {string} uuid
 * @property {string} content
 * @property {Date} createdAt
 * @property {string} senderUuid
 * @property {string} recipientUuid
 * @property {string} channelUuid
 * @property {boolean} unread
 */
class Message {
    /** @type {message[]} */
    _messages = [];

    /**
     * @param {message} message
     */
    add(message) {
        this._messages.push(message);
    }

    get messages() {
        return this._messages;
    }
}

module.exports = Message;
