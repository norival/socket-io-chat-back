/**
 * @typedef channel
 * @type {Object}
 * @property {string} uuid
 * @property {string} name
 */
class Channels {
    /** @type {channel[]} */
    _channels = [];

    constructor() { }

    /**
     * @param {channel} channel
     * @returns {this}
     */
    add(channel) {
        this._channels.push(channel);

        return this;
    }

    get channels() {
        return this._channels;
    }
}

module.exports = Channels;
