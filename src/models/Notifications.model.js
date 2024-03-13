const Model = require('./base')

class Notifications extends Model {
    static get tableName() {
        return "notifications"
    }


    static get encodedIdAttributes() {
        return ["id", "recipient_id", "sender_id"]
    }

    static get jsonAttributes() {
        return []
    }

    static get utcDateAttributes() {
        return ["createdAt", "updatedAt"]
    }

    static get relationMappings() {

    }

    $formatJson(json) {

        const data = super.$formatJson(json)

        return data
    }
}


module.exports = Notifications;
