const Model = require('./base')

class Interests extends Model {
    static get tableName() {
        return "interests"
    }


    static get encodedIdAttributes() {
        return ["id", 'userId', ]
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
            tasks: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: `${Interests.tableName}.userId`,
                    to: `${Users.tableName}.id`,
                }
            },
        }
    }

    $formatJson(json) {
        return super.$formatJson(json)
    }
}


module.exports = Interests;
