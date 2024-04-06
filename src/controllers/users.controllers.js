import {catchWrapper} from "../utils/errorHandling";
import response from '../utils/response'

class UsersController {

    @catchWrapper
    static async getCurrentUser(req,res) {


        return response(res, {
            code: 200,
            data: req.user
        })
    }

}

export default UsersController;
