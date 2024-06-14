const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('API Wisata');
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
