const fs = require('fs');
const path = require('path');

const loadData = () => {
    const filePath = path.resolve(__dirname, '../../data/bali_final.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const records = JSON.parse(fileContent);

    const parsedRecords = records.map(record => ({
        id: record.place.place_id,
        name: record.place.name,
        description: record.place.description,
        region: record.place.region,
        vicinity: record.place.vicinity,
        types: record.place.types,
        user_rating_total: parseInt(record.place.user_ratings_total) || null,
        rating: parseFloat(record.place.rating) || null,
        photos: record.place.photos,
        lat: parseFloat(record.place.latitude) || null,
        lon: parseFloat(record.place.longitude) || null
    }));

    console.log('Loaded records:', parsedRecords.slice(0, 5));  // Logging 5 records for debugging
    return parsedRecords;
};

module.exports = loadData;
