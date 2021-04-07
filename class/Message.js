class Message {
    /** @type {Array<{userUuid: string; content: string}>} */
    _messages = [];

    addMessage(userUuid, content) {
        this._messages.push({
            userUuid: userUuid,
            content: string,
        });
    }

    get messages() {
        return this._messages;
    }
}

module.exports = Message;
