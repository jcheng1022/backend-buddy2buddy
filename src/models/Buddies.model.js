const Model = require('./base')

class Buddies extends Model {
    static get tableName() {
        return "buddies"
    }


    static get encodedIdAttributes() {
        return ["id", 'senderId', 'recipientId' ]
    }

    static get jsonAttributes() {
        return []
    }

    static get utcDateAttributes() {
        return ["createdAt", "updatedAt"]
    }


    static get relationMappings() {


        const Users = require('../models/Users.model')
        return {
            sender: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: `${Users.tableName}.id`,
                    to: `${Buddies.tableName}.senderId`,
                }
            },
            recipient: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: `${Users.tableName}.id`,
                    to: `${Buddies.tableName}.recipientId`,
                }
            },
        }
    }


    $formatJson(json) {
        return super.$formatJson(json)
    }
}


module.exports = Buddies;
