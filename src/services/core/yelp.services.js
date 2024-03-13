import {catchWrapper} from "../../utils/errorHandling";
import {yelpClient} from "../../services/yelp";

const RADIUS_LIMIT = 16093 // 10 miles to meters
class YelpServices {


    @catchWrapper
    static async searchYelpBusinesses({ sortBy = 'bestMatch', openNow = true, radius = RADIUS_LIMIT, categories = [], term = 'food', location = `new york, NY`, limit = 10}) {


        return yelpClient.search({
            sortBy,
            openNow,
            term,
            location,
            limit,
            categories,
            radius
        })
    }


}




export default YelpServices;
