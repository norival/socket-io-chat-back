/**
 * @typedef user
 * @type {Object}
 * @property {string} uuid
 * @property {string} nickname
 * @property {string[]} socketIds
 */
class User
{
    /** @type {user[]} */
    _users = null;

    constructor() {
        this._users = [];
    }

    /**
     * @param {user} user
     * @returns {boolean}
     */
    add = (user) => {
        // console.log(user);
        if (!this.has(user.uuid)) {
            this._users.push(user);

            return;
        }

        // update socket ids
        this.find(user.uuid).socketIds.concat(user.socketIds);
    }

    has = (uuid) => {
        return this._users.find(user => user.uuid === uuid) != undefined;
    }

    del = (uuid, socketId) => {
        this._users = this._users.map(user => {
            if (user.uuid === uuid) {
                user.socketIds = user.socketIds.filter(sid => sid !== socketId);
            }

            return user;
        }).filter(user => user.socketIds.length > 0);
    }

    /**
     * @param {string} uuid
     * @returns {user}
     */
    find = uuid  => {
        return this._users.find(user => user.uuid === uuid);
    }

    /**
     * @returns {user}
     */
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
