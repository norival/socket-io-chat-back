class User
{
    /** @type {string} */
    _uuid;
    /** @type {string} */
    _socketId;
    /** @type {string} */
    _nickname;

    /**
     * @param {string} uuid
     * @param {string} socketId
     * @param {string} nickname
     */
    constructor(
        uuid,
        socketId,
        nickname
    ) {
        this._uuid     = uuid;
        this._socketId = socketId;
        this._nickname = nickname;
    }

    get socketId() {
        return this._socketId;
    }

    set socketId(socketId) {
        this._socketId = socketId;
    }

    get nickname() {
        if (this._nickname) {
            return this._nickname;
        }

        return 'Anonymous user';
    }

    set nickname(nickname) {
        this._nickname = nickname;
    }

    get uuid() {
        return this._uuid;
    }

    set uuid(uuid) {
        this._uuid = uuid;
    }

    toJSON() {
        return {
            id: this.id,
            nickname: this.nickname,
        };
    }
}

module.exports = User;
