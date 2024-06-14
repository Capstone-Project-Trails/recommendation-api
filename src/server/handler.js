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
              place_id: '1',
              name: 'Pura Ulun Danu',
              vicinity: 'Bali, Indonesia',
              types: 'temple',
              user_rating_total: 3000,
              rating: 4.8,
              photos: 'url2',
              locationUrl: 'https://www.google.com/maps/search/?api=1&query=-8.2787,115.1668',
              lat: -8.2787,
              lon: 115.1668
          },
          {
              place_id: '2',
              name: 'Pulau Nusa Penida',
              vicinity: 'Bali, Indonesia',
              types: 'island',
              user_rating_total: 5000,
              rating: 4.9,
              photos: 'url3',
              locationUrl: 'https://www.google.com/maps/search/?api=1&query=-8.7275,115.5444',
              lat: -8.7275,
              lon: 115.5444
          },
          {
              place_id: '3',
              name: 'Pantai Kuta',
              vicinity: 'Bali, Indonesia',
              types: 'beach',
              user_rating_total: 6000,
              rating: 4.9,
              photos: 'url1',
              locationUrl: 'https://www.google.com/maps/search/?api=1&query=-8.7183,115.1691',
              lat: -8.7183,
              lon: 115.1691
          },
          {
              place_id: '4',
              name: 'Pura Tanah Lot',
              vicinity: 'Bali, Indonesia',
              types: 'temple',
              user_rating_total: 4000,
              rating: 4.7,
              photos: 'url4',
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
            if (name) {
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
