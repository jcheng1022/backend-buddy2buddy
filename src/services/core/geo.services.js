class GeoServices {

    static async getMidPoint(addresses = []) {
        const apiKey = process.env.GEOAPIFY_API_KEY
        const geocodePromises = addresses?.map(locationName => {
            const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(locationName)}&apiKey=${apiKey}`;
            return fetch(geocodeUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.features && data.features.length > 0) {
                        const location = data.features[0].geometry.coordinates;
                        return { lat: location[1], lon: location[0] };
                    } else {
                        throw new Error(`Geocoding failed for location: ${locationName}`);
                    }
                });
        });

        try {
            // Wait for all geocoding requests to complete
            const locations = await Promise.all(geocodePromises);



            // Calculate average coordinates
            const averageLatitude = locations.reduce((sum, location) => sum + location.lat, 0) / locations.length;
            const averageLongitude = locations.reduce((sum, location) => sum + location.lon, 0) / locations.length;
            console.log(averageLatitude, averageLongitude, 99)
            // Make a request to Geoapify Reverse Geocoding API
            const reverseGeocodeUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${averageLatitude}&lon=${averageLongitude}&apiKey=${apiKey}`;
            const response = await fetch(reverseGeocodeUrl);
            const data = await response.json();

            // Extract and return the midpoint ZIP and address
            if (data.features && data.features.length > 0 && !!data.features[0].properties.postcode) {
                const zipCode = data.features[0].properties.postcode;
                const midpointAddress = data.features[0].properties.formatted;
                // console.log(midpointZip, 'mid', data.features[0].properties)
                return { zipCode, midpointAddress };
            } else {
                // if midpoint ZIP can't be found, return the first address
                return addresses[0];
            }
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-throw the error for handling elsewhere if needed
        }
    }
}

export default GeoServices;
