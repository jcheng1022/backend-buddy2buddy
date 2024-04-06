import admin from 'firebase-admin';

class AuthService {

    static async verifyIdToken(token, isAdmin = false) {
        try {
            if (!isAdmin) {
                const { uid, email, email_verified} = await admin.auth().verifyIdToken(token)
                return { email, uid, emailVerified: email_verified }
            } else {
                const { uid, email, email_verified} = await admin.auth().verifySessionCookie(token)
                return { email, uid, emailVerified: email_verified }
            }
        } catch (e) {
            console.log(`Error verifying token: ${e.message}`)
            return {}
        }
    }
}

export default AuthService;
