import response from '../utils/response.js'
import {decodeId} from "../utils/hashId";
import {RESOURCE_TYPES} from "../utils/constants";
import Tasks from '../models/Interests.model'
import Batches from '../models/Batches.model'


export default (resourceType = RESOURCE_TYPES.TASKS)  => async (req, res, next) => {
    let resource;
    if (resourceType === RESOURCE_TYPES.TASKS) {
        if (!req.params.taskId) {
            return response(res, {
                code: 400,
                message: 'Missing task ID'
            })
        }
        resource = await Tasks.query().findById(decodeId(req.params.taskId))

    } else if (resourceType === RESOURCE_TYPES.BATCHES) {
        if (!req.params.batchId) {
            return response(res, {
                code: 400,
                message: 'Missing Batch Id'
            })
        }
        resource = await Batches.query().findById(decodeId(req.params.batchId))

    }

    if (!resource) {
        return response(res, {
            code: 404,
            message: 'Resource Not Found'
        })
    }

    if (decodeId(req.user.id) === parseInt(resource.userId)){


        req[resourceType] = resource;

    } else {
        return response(res, {
            code: 401,
            message: 'Unauthorized - Not Task Owner',
        });
    }





    return next();
};

