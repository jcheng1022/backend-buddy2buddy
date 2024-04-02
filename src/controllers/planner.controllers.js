import {catchWrapper} from "../utils/errorHandling";
import response from '../utils/response'
import {yelpClient} from "../services/yelp";
import Interests from '../models/Interests.model'
import {decodeId, encodeId} from "../utils/hashId";
import GeoServices from "../services/core/geo.services";
import yelpServices from "../services/core/yelp.services";
import YelpServices from "../services/core/yelp.services";
import Plans from '../models/Plans.model'
import PlanAttendees from '../models/PlanAttendees.model'
import {add} from "nodemon/lib/rules";
import {STATUS} from "../utils/constants";
import NotificationService from "../services/core/notifications.services";
import Notifications from "../models/Notifications.model";
import PusherClient from "../services/pusherClient";
class PlannerController {


    @catchWrapper
    static async getEventsForPlanner(req,res) {

        const { categories = [], locations = [], options = {}} = req.body;

        if (categories.length === 0 || locations.length === 0 ) {
            throw `Must have at least one category and one location`
        }

        const addresses = locations.map(o => o.address)


        let location;
        if (addresses.length > 1) {

            const {zipCode, midpointAddress } = await GeoServices.getMidPoint(addresses)
            location = zipCode
        } else {
            location = addresses[0]
        }
        let interestedLocations = await YelpServices.searchYelpBusinesses({
            categories: categories.filter(o => !o.isCustom).map(o => o.category),
            location,
            term: categories.find(o => !!o.isCustom)?.category,
            ...options
        })

        interestedLocations = interestedLocations?.jsonBody.businesses

        return response(res, {
            code: 200,
            data: interestedLocations
        })
    }


    @catchWrapper
    static async updatePlanInvite(req,res) {


        const { planId } = req.params;
        const {  status = STATUS.ACCEPTED, notificationId } = req.body;

        // decode Ids
        const decodedPlanId = decodeId(planId)
        const decodedUserId = decodeId(req.user.id)

        // find the plan invite
        const planInvite = await PlanAttendees.query().where({
            planId: decodedPlanId,
            userId: decodedUserId,
            status: STATUS.PENDING
        }).first();

        if (!planInvite) {
            throw `Plan invite not found or was already accepted/declined`
        }

        // update the plan invite
        await PlanAttendees.query().where({planId: decodedPlanId}).patch({
            status
        })

        await Notifications.query().findById(decodeId(notificationId)).patch({status})


        await PusherClient.sendMessage({
            channelName: `user-${req.user.id}`,
            eventName: 'notification',
            message: 'profile-update'
        })


        return response(res, {
            code: 200,
            message: 'success'
        })
    }
    @catchWrapper
    static async createNewPlan(req,res) {


        const {name = '222', date = new Date(), buddies = [] , includeMe = false} = req.body;

        const  plan = await Plans.query().insert({
            name,
            date,
            creatorId: decodeId(req.user.id)
        })

        for ( let i = 0 ; i < buddies.length; i++) {
            const decodedBuddyId= decodeId(buddies[i])
            await PlanAttendees.query().insert({
                planId: plan.id,
                userId: decodedBuddyId,
                status: STATUS.PENDING
            })

            await NotificationService.sendNotification({
                recipientId: decodedBuddyId,
                type: 'plan-invite',
                meta: {
                    planId: encodeId(plan.id),
                    planName: plan.name
                },
                message: `You have been invited to "${plan.name}" by ${req.user.name}`,
                senderId: decodeId(req.user.id)
            })
        }

        if (includeMe) {
            await PlanAttendees.query().insert({
                planId: plan.id,
                userId: decodeId(req.user.id),
                status: STATUS.ACCEPTED
            })
        }


        return response(res, {
            code: 200,
            data: {
                planId: encodeId(plan.id)
            },
            message: 'Success'
        })
    }


    @catchWrapper
    static async getPlanById(req,res) {
        const {planId } = req.params;

        const data = await Plans.query()

            .withGraphFetched('[creator, attendees, attendees.user, planEvents]')
            .modifyGraph('planEvents', builder => {
                builder.select(['id', 'data', 'createdAt'])
            })
            .findById(decodeId(planId))

        return response(res, {
            code: 200,
            data,
            message: 'Success'
        })
    }

    @catchWrapper
    static async addPlanEvent(req,res) {
        const {planId } = req.params;
        const { planEvent } = req.body;

        if (!planEvent) {
            throw `Missing plan event`
        }

        const plan = await Plans.query().findById(decodeId(planId))

        if (!plan) {
            throw `Plan not found`
        }

        const data = await plan.$relatedQuery('planEvents').insert({
            planId: decodeId(planId),
            data: planEvent
        })

        return response(res, {
            code: 200,
            data,
            message: 'Success'
        })
    }


}




export default PlannerController;
