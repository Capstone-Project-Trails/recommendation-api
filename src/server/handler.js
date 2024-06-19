const loadModel = require('../services/loadModel');
const loadData = require('../services/loadData');
const inferenceService = require('../services/inferenceService');

let model;
let data;

const initialize = async () => {
    if (!model) {
        model = await loadModel();
    }
    if (!data) {
        data = loadData();
        console.log('Data loaded:', data);  // Debugging line
    }
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
        return null;
    }
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
};

const getRecommendations = async (req, res) => {
    try {
        await initialize();
        const { lat, lon } = req.query;
        const input = [parseFloat(lat), parseFloat(lon)];

        console.log('Query parameters:', input);  // Debugging line

        let nearbyRecommendations = data.map(item => {
            const distance = calculateDistance(input[0], input[1], item.lat, item.lon);
            return {
                place_id: item.id,
                name: item.name,
                description: item.description,
                photo_url: item.photo_url,
                region: item.region,
                vicinity: item.vicinity,
                types: item.types,
                user_rating_total: item.user_rating_total,
                distance: distance ? distance.toFixed(2) : null,
                rating: item.rating,
                photos: item.photos,
                locationUrl: `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lon}`,
                lat: item.lat,
                lon: item.lon
            };
        }).filter(item => item.distance && item.distance <= 5); // Filter by radius

        nearbyRecommendations.sort((a, b) => {
            if (a.rating === b.rating) {
                return a.distance - b.distance; // Sort by distance if ratings are equal
            }
            return b.rating - a.rating; // Sort by rating
        });
        const limitedRecommendations = nearbyRecommendations.slice(0, 10);  // Limit to 5 results

        console.log('Nearby recommendations:', limitedRecommendations);  // Debugging line

        const popularDestinations = [
          {
              place_id: 'ChIJnxBQRm2J0S0RvCbpniHjKog',
              name: 'Pura Ulun Danu',
              description: 'Ulun Danu Beratan Temple is a stunning water temple located on the shores of Beratan Lake. The temple is known for its beautiful architecture and serene surroundings. Visitors can explore the temple grounds, enjoy the scenic beauty, and learn about the cultural significance of the site. Ulun Danu Beratan Temple promises a serene and enriching cultural experience.' ,
              region: 'Lovina, Bali',
              vicinity: 'Danau Beratan, Candikuning',
              types: "['hindu_temple', 'tourist_attraction', 'place_of_worship', 'point_of_interest', 'establishment']",
              user_rating_total: 40813,
              rating: 4.6,
              photos: 'https://www.indonesia.travel/content/dam/indtravelrevamp/en/destinations/bali-nusa-tenggara/bali/bali/ulun-danu-beratan-iconic-temple-on-lake-beratan/ulun-danu.jpg',
              locationUrl: 'https://www.google.com/maps/search/?api=1&query=-8.2751807,115.1668234',
              lat: -8.2751807,
              lon: 115.1668234
          },
          {
              place_id: 'ChIJ9xNYnp9z0i0RLqru0Tr_Y3I',
              name: 'Pulau Nusa Penida',
              description: 'Pulau Nusa Penida, also known as Nusa Penida, is a stunning island known for its rugged landscapes, pristine beaches, and vibrant marine life. The island offers a range of activities, including snorkeling, diving, and hiking. Visitors can explore the charming villages, enjoy the scenic views, and relax in the laid-back atmosphere. Pulau Nusa Penida is a must-visit for those seeking a tropical paradise with a blend of adventure and relaxation.',
              region: 'Nusa Penida, Bali',
              vicinity: 'Klungkung, Bali 80771',
              types: "['tourist_attraction', 'point_of_interest', 'establishment']",
              user_rating_total: 5000,
              rating: 4.9,
              photos: 'https://travellingindonesia.com/wp-content/uploads/2023/08/Nusa-Penida.jpeg',
              locationUrl: 'https://www.google.com/maps/search/?api=1&query=-8.7275,115.5444',
              lat: -8.7275,
              lon: 115.5444
          },
          {
              place_id: 'ChIJkbJrRYFH0i0RggJb7CncdHE',
              name: 'Kuta Beach',
              description: "Kuta Beach is one of Bali's most famous beaches, known for its vibrant atmosphere, soft sands, and excellent surfing conditions. The beach offers a lively environment perfect for sunbathing, swimming, and enjoying the coastal scenery. Visitors can explore the nearby shops, cafes, and nightlife, making it an ideal destination for a fun and dynamic beach experience. Kuta Beach captures the energetic spirit of Bali's coastal culture.",
              region: 'Kuta, Bali',
              vicinity: 'Jalan Pantai Kuta No.32, Legian',
              types: "['tourist_attraction', 'point_of_interest', 'establishment']",
              user_rating_total: 6000,
              rating: 4.9,
              photos: 'https://i2.wp.com/blog.tripcetera.com/id/wp-content/uploads/2020/03/leebudihart_76864081_2484833498431751_3194446755026370817_n.jpg',
              locationUrl: 'https://www.google.com/maps/search/?api=1&query=-8.722624899999998,115.1695272',
              lat: -8.7183,
              lon: 115.1691
          },
          {
              place_id: 'ChIJq95xT4I30i0RaU3j93Diq8o',
              name: 'Pura Tanah Lot',
              description: "Pura Tanah Lot is an iconic sea temple located on a rocky outcrop, offering breathtaking views of the ocean and dramatic sunsets. The temple is a significant cultural and religious site, attracting visitors from around the world. Visitors can explore the temple grounds, take in the stunning scenery, and experience the spiritual ambiance. Pura Tanah Lot is a must-visit destination that showcases Bali's cultural heritage and natural beauty.",
              region: 'Canggu, Bali',
              vicinity: 'Jl. By Pass Nyanyi Jalan Tanah Lot, Beraban',
              types: "['tourist_attraction', 'point_of_interest', 'establishment']",
              user_rating_total: 4000,
              rating: 4.7,
              photos: 'https://lh3.googleusercontent.com/gps-proxy/ALd4DhGwB9NEhe_3YA8DGHKqmXChNpOCeTZYp7Ab-Rj65QpWkPrGrxaJT6E_1m1C-bIf1owIuFympWHfZoT1aHk6LkdJbkAb56cF_cNMyv_N7cgdlHojJZqi9X8NpjXDR4KjUs2SHKLCmBp6WKYXlTzGcildy8_HZPyUUis26XmPFckgoJ8zVuXcHa0=w408-h272-k-no',
              locationUrl: 'https://www.google.com/maps/search/?api=1&query=-8.6208,115.0868',
              lat: -8.6208,
              lon: 115.0868
          }
      ];

        res.json({
            error: false,
            message: "success",
            nearby: limitedRecommendations,
            popularDestinations: popularDestinations
        });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

const searchByName = async (req, res) => {
    try {
        await initialize();
        const { name, ratingRange, type, region } = req.query;

        console.log('Search parameters:', { name, ratingRange, type, region });  // Debugging line

        let searchResults = data.filter(item => {
            let matchesName = true;
            let matchesRating = true;
            let matchesType = true;
            let matchesRegion = true;

            if (name) {
                matchesName = item.name.toLowerCase().includes(name.toLowerCase());
            }
            if (region) {
              matchesRegion = item.region.toLowerCase().includes(region.toLowerCase());
            }
            if (ratingRange) {
                const [minRating, maxRating] = ratingRange.split('-').map(parseFloat);
                matchesRating = item.rating >= minRating && item.rating < maxRating;
            }
            if (type) {
                matchesType = item.types.toLowerCase().includes(type.toLowerCase());
            }

            return matchesName && matchesRating && matchesType && matchesRegion;
        });

        const formattedResults = searchResults.map(item => ({
            title: item.name,
            place_id: item.id,
            photos: item.photos,
            photo_url: item.photo_url,
            description: item.description,
            region: item.region,
            vicinity: item.vicinity,
            link: `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lon}`,
            types: item.types,
            rating: item.rating,
            user_rating_total: item.user_rating_total,
            formattedAddress: item.vicinity,
            coordinates: {
                latitude: item.lat,
                longitude: item.lon
            }
        }));

        console.log('Search results:', formattedResults);  // Debugging line

        res.json({
            error: false,
            message: "success",
            results: formattedResults
        });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

module.exports = { getRecommendations, searchByName };
