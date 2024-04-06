import {catchWrapper} from "../utils/errorHandling";
import response from '../utils/response'
import Activity from '../models/Activity.model'
import {decodeId, encodeId} from "../utils/hashId";
import MediaService from "../services/media.service";
import dayjs from "dayjs";

class ActivityController {

    @catchWrapper
    static async getActivityHistoryByUser(req,res) {
        const { dateOnly = false } = req.query;

        let query = Activity.query().where({
            userId: decodeId(req.user.id)
        })

        if ( dateOnly ) {
            query.select(['id', 'date'])
        }

        let data = await query



        return response(res, {
            code: 200,
            data
        })
    }

    @catchWrapper
    static async createNewActivity(req,res) {

        req.body.data = JSON.parse(req.body.data);
        const { date, description } = req.body?.data;

        const activity = {
            date,
            description
        }

        if (req.file) {
            const fileName = `${encodeId(req.user?.id)}/${dayjs(date).format(`YYYYMMDD`)}`

            await MediaService.uploadFileToStorage(req.file.buffer, fileName, 'image/jpeg');

            const storage = MediaService.getFileFromBucket(fileName)

            const viewUrl = await MediaService.getPublicViewUrl(storage);

            activity.mediaUrl = viewUrl;
        }

        const newActivity = await Activity.query().insert({
            ...activity,
            userId: decodeId(req.user.id)
        })


        return response(res, {
            code: 200,
            data: newActivity,
            message: 'Success'
        })
    }

    @catchWrapper
    static async getActivityFeedForUser(req,res) {

        const data = await Activity.query().withGraphFetched('user').orderBy('createdAt', 'desc').whereNull('archiveDate')

        return response(res, {
            code: 200,
            data
        })
    }

    @catchWrapper
    static async removeActivityById(req,res) {
        const { archiveDate  } = req.query
        const { activityId } = req.params;

        console.log(archiveDate, 'HELLO')
        if (archiveDate ) {
            console.log(`patch hit`)
            await Activity.query().findById(decodeId(activityId)).patch({
                        archiveDate: new Date()
                    })
        }

        if (!archiveDate) {
            console.log(`del hit`)
            await Activity.query().findById(decodeId(activityId)).delete();
        }

        console.log(`nothing lol`)
        //
        // const query = Activity.query().findById(decodeId(activityId))
        // if (!!isArchive) {
        //     await query.patch({
        //         archiveDate: new Date()
        //     })
        // } else {
        //     await query.delete();
        // }
        //


        return response(res, {
            code: 200,
            message: 'Success'
        })
    }

}

export default ActivityController;
