'use strict';
const PORT = process.env.PORT || 3001;
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
require('dotenv').config();


const getLocation = require('./modules/location.js');
const getWeather = require('./modules/weather.js');
const getEventBrite = require('./modules/eventBrite.js');
const getMovies = require('./modules/movie.js');
const getReviews = require('./modules/yelp.js');


app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/events', getEventBrite);
app.get('/movies', getMovies);
app.get('/yelp', getReviews);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});