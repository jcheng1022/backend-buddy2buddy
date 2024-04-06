const Model = require('./base')

class Activity extends Model {
    static get tableName() {
        return "activity"
    }


    static get encodedIdAttributes() {
        return ["id","userId" ]
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
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: `${Users.tableName}.id`,
                    to: `${Activity.tableName}.userId`,
                }
            },
        }
    }

    $formatJson(json) {

        const data = super.$formatJson(json)


        return data
    }
}


module.exports = Activity;
