class User
{
    /** @type {Array<{uuid: string; socketId: string; nickname: string}>} */
    _users = null;

    /**
     * @param {string} uuid
     * @param {string} socketId
     * @param {string} nickname
     */
    constructor() {
        this._users = [];
    }

    /**
     * @param {{uuid: string; socketId: string; nickname: string}} user
     * @returns {boolean}
     */
    addUser = (user) => {
        // console.log(user);
        if (!this.hasUser(user.uuid)) {
            this._users.push(user);

            return;
        }

        // update socket id
        this.find(user.uuid).socketId = user.socketId;
    }

    hasUser = (uuid) => {
        return this._users.find(user => user.uuid === uuid) != undefined;
    }

    /**
     * @param {string} uuid
     * @returns {{uuid: string; socketId: string; nickname: string}}
     */
    find = uuid  => {
        return this._users.find(user => user.uuid === uuid);
    }

    /**
     * @param {string} socketId
     * @returns {{uuid: string; socketId: string; nickname: string}}
     */
    findBySocketId = socketId  => {
        return this._users.find(user => user.socketId === socketId);
    }

    get users() {
        return this._users;
    }

    toJSON() {
        const users = [];

        for (const user of this._users) {
            users.push({
                uuid: user.uuid,
                nickname: user.nickname,
            });
        }

        return users;
    }
}

module.exports = User;
