const Model = require('./base')
const Users = require("./Users.model");
const PlanEvents = require("./PlanEvents.model");

class Plans extends Model {
    static get tableName() {
        return "plans"
    }


    static get encodedIdAttributes() {
        return ["id", 'creatorId', ]
    }

    static get jsonAttributes() {
        return []
    }

    static get utcDateAttributes() {
        return ["createdAt", "updatedAt"]
    }


    static get relationMappings() {


        const PlanEvents = require('../models/PlanEvents.model')
        const PlanAttendees = require ('../models/PlanAttendees.model')
        return {
            creator: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: `${Users.tableName}.id`,
                    to: `${Plans.tableName}.creatorId`,
                }
            },

            plan: {
                relation: Model.HasManyRelation,
                modelClass: PlanEvents,
                join: {
                    from: `${PlanEvents.tableName}.planId`,
                    to: `${Plans.tableName}.id`,
                }
            },
            attendees: {
                relation: Model.HasManyRelation,
                modelClass: PlanAttendees,
                join: {
                    from: `${PlanAttendees.tableName}.planId`,
                    to: `${Plans.tableName}.id`,
                }
            },
        }
        }


    $formatJson(json) {
        return super.$formatJson(json)
    }
}


module.exports = Plans;
