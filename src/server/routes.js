const express = require('express');
const { getRecommendations, searchByName } = require('./handler');

const router = express.Router();

router.get('/recommendations', getRecommendations);
router.get('/search', searchByName);

module.exports = router;
