const Model = require('./base')
const Users = require("./Users.model");
const Plans = require("./Plans.model");

class PlanAttendees extends Model {
    static get tableName() {
        return "plan_attendees"
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
        const Users = require('../models/Users.model')
        return {
            plan: {
                relation: Model.BelongsToOneRelation,
                modelClass: Plans,
                join: {
                    from: `${Plans.tableName}.id`,
                    to: `${PlanAttendees.tableName}.planId`,
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: `${Users.tableName}.id`,
                    to: `${PlanAttendees.tableName}.userId`,
                }
            },
        }
    }

    $formatJson(json) {
        return super.$formatJson(json)
    }
}


module.exports = PlanAttendees;
