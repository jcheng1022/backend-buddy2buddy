const Model = require('./base')
const Users = require("./Users.model");

class PlanEvents extends Model {
    static get tableName() {
        return "plan_events"
    }


    static get encodedIdAttributes() {
        return ["id", 'planId']
    }

    static get jsonAttributes() {
        return []
    }

    static get utcDateAttributes() {
        return ["createdAt", "updatedAt"]
    }


    static get relationMappings() {

        const Plans = require('../models/Plans.model')
        return {
            plan: {
                relation: Model.BelongsToOneRelation,
                modelClass: Plans,
                join: {
                    from: `${Plans.tableName}.id`,
                    to: `${PlanEvents.tableName}.planId`,
                }
            },
        }
    }

    $formatJson(json) {
        return super.$formatJson(json)
    }
}


module.exports = PlanEvents;
