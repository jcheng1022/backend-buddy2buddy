import yelp from 'yelp-fusion'
import dotenv from 'dotenv'

dotenv.config();

export const yelpClient = yelp.client(process.env.YELP_API_KEY)
