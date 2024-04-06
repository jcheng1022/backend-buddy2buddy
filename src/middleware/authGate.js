import response from '../utils/response.js'
import Users from '../models/Users.model.js';
import AuthService from "../services/auth.service";
import admin from 'firebase-admin'

export default async (req, res, next) => {

    if (req.headers?.authorization ){
        try {
            const { isAdmin = false } = req.query
            const token = req.headers?.authorization.replace('Bearer ', '')
            // console.log(token, 'dsdsds')
            const { uid, email } = await AuthService.verifyIdToken(token,isAdmin)

            if (!uid) {
                console.log(`Error: could not verify token`)
                return response(res, {
                    code: 401,
                    message: 'Unauthorized',
                });
            }

            const user = await Users.query().where({firebaseUuid: uid}).first();

            if (!user) {
                // user does not exist yet; create one
                const user = await admin.auth().getUser(uid)
                const newUser = await Users.query().insert({
                    firebaseUuid: uid,
                email,
                    name: user.displayName,

                })
                req.user = newUser
            }

            req.user = user
        } catch (error) {
            console.log(`Error verifying token: ${error.message}`)
            return response(res, {
                code: 401,
                message: 'Unauthorized Token',
            });
        }


    } else {
        console.log(`No authorization header`)
        return response(res, {
            code: 401,
            message: 'Unauthorized',
        });
    }



    return next();
};

