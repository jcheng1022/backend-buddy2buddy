import {catchWrapper} from "../utils/errorHandling";
import response from '../utils/response'
import {yelpClient} from "../services/yelp";
import Interests from '../models/Interests.model'
import {decodeId} from "../utils/hashId";
import yelpServices from "../services/core/yelp.services";

class YelpController {

    @catchWrapper
    static async searchBusinesses(req,res) {

    console.log(`hit`)
        const { name = '', location = 'new york, ny', limit = 10} = req.query;
        if (!name) {
            throw `Missing Business Name`
        }
        let data;

        try {
            data = await yelpServices.searchYelpBusinesses({
                term: name,
                location,
                limit
            })
        } catch (e) {
            console.log(e)
            throw `Something went wrong with yelp search`
        }

        if (!req.user) {
            return response(res, {
                code: 200,
                data: data.jsonBody.businesses
            })
        }
        const userInterests = await Interests.query().where({
            userId: decodeId(req.user.id)
        })

        data = data.jsonBody.businesses.map((business) => {
           return {
               ...business,
               isInterested: userInterests.some(interest => interest.interestId === business.id)
           }

        })



        return response(res, {
            code: 200,
            data: data.jsonBody.businesses
        })
    }

    @catchWrapper
    static async getInterestsByUser(req,res) {

        const data = await Interests.query().where({
            userId: decodeId(req.user.id)
        })

        return response(res, {
            code: 200,
            data
        })
    }

    @catchWrapper
    static async toggleInterest(req,res) {
        const {type = 'add'} = req.params;
        const { businessId = '', businessName='', img = ''} = req.body;

        if (!businessId) {
            throw `Missing business ID`
        }

        const userId = decodeId(req.user.id)

        const existingInterest = await Interests.query().where({
            interestId: businessId,
            userId
        }).first();

        if (type === 'add' && !existingInterest) {
            await Interests.query().insert({
                interestId: businessId,
                userId: decodeId(req.user.id),
                businessMeta: {
                    name: businessName,
                    imgUrl: img
                }
            })
        } else if (type === 'remove' && existingInterest) {
            await existingInterest.$query().delete();

        }


        return response(res, {
            code: 200,
            message: 'Success'
        })
    }

}




export default YelpController;
