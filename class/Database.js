const User = require('./User');

class Database {
    /** @type {Array<User>} */
    _users;

    constructor() {
        this._users = [];
    }

    /**
     * @param {User} user
     * @returns {boolean}
     */
    addUser = (user) => {
        // console.log(user);
        if (!this.hasUser(user.id)) {
            this._users.push(user);

            return true;
        }

        return false;
    }

    /**
     * @param {User} user
     * @returns {Database}
     */
    delUser = (user) => {
        this._users = this._users.filter(_user => _user.id !== user.id);

        return this;
    }

    hasUser = (uuid) => {
        return this._users.find(user => user.uuid === uuid) != undefined;
    }

    get users() {
        return this._users;
    }

    /**
     * @param {string} uuid
     * @returns {User|undefined}
     */
    findUser = uuid  => {
        return this._users.find(user => user.uuid === uuid);
    }
}

module.exports = Database;
