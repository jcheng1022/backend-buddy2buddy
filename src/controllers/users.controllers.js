import {catchWrapper} from "../utils/errorHandling";
import response from '../utils/response'
import Plans from '../models/Plans.model'
import Interests from '../models/Interests.model'
import Buddies from '../models/Buddies.model'
import Notifications from '../models/Notifications.model'
import PlanAttendees from '../models/PlanAttendees.model'
import {decodeId, encodeId} from "../utils/hashId";
import Users from '../models/Users.model'
import {STATUS} from "../utils/constants";
import PusherClient from "../services/pusherClient";
class UsersController {

    @catchWrapper
    static async getCurrentUser(req,res) {


        return response(res, {
            code: 200,
            data: req.user
        })
    }
    @catchWrapper
    static async getUserFriends(req,res) {
        const { status = STATUS.ACCEPTED } = req.query;
        const userId = decodeId(req.user.id)
        let data = await Buddies.query()
            .withGraphFetched(`[sender, recipient]`)
            .where(builder => builder.where({
                senderId:userId
            }).orWhere({
                recipientId: userId
            })).andWhere({status : status})
        data = data.map(o => {

            if (o && o.recipientId !== userId.toString()) {
                return {
                    id: encodeId(o.id),
                    friendId: encodeId( o.recipientId),
                    friendName: o.recipient.name,
                    friendEmail: o.recipient.email,
                    status: o.status
                }
            } else {
                return {
                    id: encodeId(o.id),
                    friendId: encodeId(o.senderId),
                    friendName: o.sender.name,
                    friendEmail: o.sender.email,
                    status: o.status
                }
            }


        })
        return response(res, {
            code: 200,
            data
        })
    }

    @catchWrapper
    static async sendBuddyRequest(req,res) {

        const {email} = req.body

        if (!email) {
            throw `Missing recipient email`

        }


        const recipient = await Users.query().where({
            email
        }).first()


        if (!recipient) {
            throw `Email is not associated with any user`
        }

        const userId = decodeId(req.user.id)

        // check if exists
        //
        const existing  = await Buddies.query()
            .where(builder => builder.where({
            senderId:userId,
            recipientId: recipient.id
        }).orWhere({
            recipientId: userId,
            senderId: recipient.id
        })).first()

        if (existing && existing.status === STATUS.PENDING) {
            throw `Friend request already exists`
        } else if (existing && existing.status === 'ACCEPTED') {
            throw `You are already friends`
        }


        await Buddies.query().insert({
            senderId: userId,
            recipientId: recipient.id,
            status: STATUS.PENDING
        })

        // await Notifications.query().insert({
        //     recipientId: recipient.id,
        //     message: `You have a new buddy request from ${req.user.name} (${email})`,
        //     type: 'friend-request',
        //     senderId: userId
        // })

        await PusherClient.sendMessage({
            channelName: `user-${encodeId(recipient.id)}`,
            eventName: 'notification',
            message: 'buddy-request'
        })
        //
        //


        return response(res, {
            code: 200,
            message: 'Success'
            // data
        })
    }

    @catchWrapper
    static async updateBuddyRequest(req,res) {

        const {buddyId} = req.params;
        const { status = STATUS.ACCEPTED } = req.body;
        const userId = decodeId(req.user.id);
        const decodedBuddyId = decodeId(buddyId);

        // find buddy

        const exists = await Buddies.query().findById(decodedBuddyId);
        if (!exists) {
            throw `Buddy does not exist`
        }

        // make sure the responding user is the recipient
        if (exists.recipientId !== userId.toString()) {
            throw `You are not the recipient of this request`
        }

        // make sure the request is pending
        if (exists.status !== STATUS.PENDING) {
            throw `Request is not pending`
        }

        // update status
        await Buddies.query().findById(decodedBuddyId).patch({
            status
        })


        //
        // await PusherClient.sendMessage({
        //     channelName: `user-${encodeId(recipient.id)}`,
        //     eventName: 'notification',
        //     message: 'buddy-request'
        // })



        return response(res, {
            code: 200,
            message: 'Success'
        })
    }


    @catchWrapper
    static async getUserProfile(req,res) {

        const userId = decodeId(req.user.id)

        const plans = await PlanAttendees.query().withGraphFetched('plan').where({
            userId,
            status: STATUS.ACCEPTED
        })

        const interests = await Interests.query().where({
            userId
        })


        return response(res, {
            code: 200,
            data : {
                plans: plans.map(o => o.plan),
                interests
            }
        })
    }



    @catchWrapper
    static async getUserNotifications(req,res) {
        const { size = 10, page = 1 } = req.query

        let {results, total} = await Notifications.query().where({
            recipientId: decodeId(req.user.id)
        }) .page(+page - 1, +size)

        results = results
            .sort((a, b) => (a.isRead === b.isRead) ? 0 : a.isRead ? 1 : -1)
            .map(o => ({
                ...o,
                id: encodeId(o.id),
                recipientId: encodeId(o.recipientId),
                senderId: o.senderId && encodeId(o.senderId)
            }));
        return response(res, {
            code: 200,
            data: {
                results,
                total
            }
        })
    }

}

export default UsersController;
