// import PlanAttendees from '../models/PlanAttendees.model'
import Notifications from '../../models/Notifications.model'
import PusherClient from "../pusherClient";
import {encodeId} from "../../utils/hashId";
class NotificationService {
    static async deliverNotification({ids, message, senderId}) {
        if (Array.isArray(ids)) {
            if (ids.length === 0) {
                throw `Recipient ID array is empty`;
            }

            // Using Promise.all to await all insert operations
            await Promise.all(ids.map(async (id) => {
                await this.sendNotification({recipientId: id, message, senderId});
            }));
        } else {
            const recipientId = ids;
            // If recipientId is a single value, send a single notification
            if (!recipientId) throw `Recipient ID is required`;

            if (senderId && senderId === ids) {
                throw `You cannot send a notification to yourself`;
            }

            await this.sendNotification({recipientId, message, senderId});
        }
    }

    static async sendNotification({recipientId, message, senderId = null, type = 'message', meta = {}}) {

        if (!message) throw `Message is required`
        if (!recipientId) throw `Recipient ID is required`

        if (senderId && senderId === recipientId) {
            throw `You cannot send a notification to yourself`
        }


        await Notifications.query().insert({
            recipientId,
            message,
            type,
            meta,
            senderId: senderId ?? null
        })

        await PusherClient.sendMessage({
            channelName: `user-${encodeId(recipientId)}`,
            eventName: 'notification',
            message: 'profile-update'
        })

    }
}




export default NotificationService;
