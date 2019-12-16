'use strict';

const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();

function WeatherGetter(weatherValue) {
    this.forecast = weatherValue.summary;
    this.time = new Date(weatherValue.time * 1000).toDateString();
  }
  app.get('/weather', (request, response) => {
    const weather_query = request.query.data
  
    const urlToVisit = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${weather_query.latitude},${weather_query.longitude}`;
    superagent.get(urlToVisit).then(responseFromSuper => {
      //console.log('stuff', responseFromSuper.body);
      const darkskyData = responseFromSuper.body;
      const dailyData = darkskyData.daily.data.map(value => new WeatherGetter(value));
      response.send(dailyData);
    }).catch(error => {
      console.error(error);
      response.status(500).send(error.message);
    });
  })

  module.exports = getWeather;
