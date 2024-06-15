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

        nearbyRecommendations.sort((a, b) => a.distance - b.distance); // Sort by distance

        const limitedRecommendations = nearbyRecommendations.slice(0, 5);  // Limit to 5 results

        console.log('Nearby recommendations:', limitedRecommendations);  // Debugging line

        const popularDestinations = [
          {
              place_id: 'ChIJnxBQRm2J0S0RvCbpniHjKog',
              name: 'Pura Ulun Danu',
              description: 'Ulun Danu Bratan Temple is one of the most beautiful lakes in Bali, located in the serene region of Lovina. Known for its stunning natural beauty and clear waters that reflect the surrounding scenery, visitors can enjoy boat rides, visit the famous Ulun Danu Temple, and stroll through the surrounding gardens. The lake is popular among both tourists and worshippers, making it an ideal spot for relaxation and contemplation in nature. Its high rating and positive visitor reviews reflect its appeal as a must-visit destination in Bali.' ,
              vicinity: 'Bali, Indonesia',
              types: "['tourist_attraction', 'point_of_interest', 'establishment']",
              user_rating_total: 3000,
              rating: 4.8,
              photos: 'https://www.indonesia.travel/content/dam/indtravelrevamp/en/destinations/bali-nusa-tenggara/bali/bali/ulun-danu-beratan-iconic-temple-on-lake-beratan/ulun-danu.jpg',
              locationUrl: 'https://www.google.com/maps/search/?api=1&query=-8.2787,115.1668',
              lat: -8.2787,
              lon: 115.1668
          },
          {
              place_id: 'ChIJ9xNYnp9z0i0RLqru0Tr_Y3I',
              name: 'Pulau Nusa Penida',
              description: 'Pulau Nusa Penida, also known as Nusa Penida, is a stunning island known for its rugged landscapes, pristine beaches, and vibrant marine life. The island offers a range of activities, including snorkeling, diving, and hiking. Visitors can explore the charming villages, enjoy the scenic views, and relax in the laid-back atmosphere. Pulau Nusa Penida is a must-visit for those seeking a tropical paradise with a blend of adventure and relaxation.',
              vicinity: 'Bali, Indonesia',
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
              vicinity: 'Bali, Indonesia',
              types: "['tourist_attraction', 'point_of_interest', 'establishment']",
              user_rating_total: 6000,
              rating: 4.9,
              photos: 'url1',
              locationUrl: 'https://i2.wp.com/blog.tripcetera.com/id/wp-content/uploads/2020/03/leebudihart_76864081_2484833498431751_3194446755026370817_n.jpg',
              lat: -8.7183,
              lon: 115.1691
          },
          {
              place_id: 'ChIJq95xT4I30i0RaU3j93Diq8o',
              name: 'Pura Tanah Lot',
              description: "Pura Tanah Lot is an iconic sea temple located on a rocky outcrop, offering breathtaking views of the ocean and dramatic sunsets. The temple is a significant cultural and religious site, attracting visitors from around the world. Visitors can explore the temple grounds, take in the stunning scenery, and experience the spiritual ambiance. Pura Tanah Lot is a must-visit destination that showcases Bali's cultural heritage and natural beauty.",
              vicinity: 'Bali, Indonesia',
              types: "['tourist_attraction', 'point_of_interest', 'establishment']",
              user_rating_total: 4000,
              rating: 4.7,
              photos: 'https://cdn.discordapp.com/attachments/1240633974242545785/1251432583141658685/tanah-lot-profile1645589223.jpeg?ex=666e8eea&is=666d3d6a&hm=b999f3ae826f11d4ef639d9cab52c15173c0c9f7b55b29289d23728781a2c255&',
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
            description: item.description,
            region: item.region,
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
