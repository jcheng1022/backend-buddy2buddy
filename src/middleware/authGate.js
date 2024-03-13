import response from '../utils/response.js'
import {supabase} from '../services/supabase.js';
import Users from '../models/Users.model.js';
import {encodeId} from "../utils/hashId";


export default async (req, res, next) => {

    if (req.headers?.authorization ){
        try {
            const token = req.headers?.authorization.replace('Bearer ', '')
            const {data: {user}} = await supabase.auth.getUser(token)

            if (!user) {
                return response(res, {
                    code: 401,
                    message: 'Unauthorized No user',
                });
            }

            const dbUser = await Users.query().where({supabaseUuid: user.id}).first()
            if (dbUser) {
                req.user = {
                    ...dbUser,
                    id: encodeId(dbUser.id),
                    lastSignedIn: user.last_sign_in_at,
                    role: user.role,
                }
            } else {
                await Users.query().insert({
                    supabaseUuid: user.id,
                    email: user.email,
                    name: user.user_metadata.name
                })
            }

        } catch (error) {
            console.log(error)
            return response(res, {
                code: 401,
                message: 'Unauthorized',
            });
        }


    } else {
        return response(res, {
            code: 401,
            message: 'Unauthorized',
        });
    }



    return next();
};

