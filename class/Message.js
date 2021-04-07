class Message {
    /** @type {Array<{userUuid: string; content: string}>} */
    _messages = [];

    addMessage(userUuid, content) {
        this._messages.push({
            userUuid: userUuid,
            content: content,
        });
    }

    get messages() {
        return this._messages;
    }
}

module.exports = Message;
