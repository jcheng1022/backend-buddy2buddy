import Pusher from 'pusher'
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
// const pusher = new Pusher({
//     appId: process.env.PUSHER_APP_ID,
//     key: process.env.PUSHER_KEY,
//     secret: process.env.PUSHER_SECRET,
//     cluster: process.env.PUSHER_CLUSTER,
//     useTLS: true
// });

class PusherClient {

    constructor() {
        if (!this.client) {
            this.client =  new Pusher({
                appId: process.env.PUSHER_APP_ID,
                key: process.env.PUSHER_KEY,
                secret: process.env.PUSHER_SECRET,
                cluster: process.env.PUSHER_CLUSTER,
                useTLS: true
            })
        }

    }

    async sendMessage({channelName, eventName, message}) {
        await this.client.trigger(channelName, eventName, {
            message
        })
    }

}



export default new PusherClient;
