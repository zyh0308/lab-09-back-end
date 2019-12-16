'use strict';

const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();


const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', error => console.error(error));
client.connect();


function FormattedData(query, location) {
    console.log(location)
    this.search_query = query;
    this.formatted_query = location.formatted_address;
    this.latitude = location.geometry.location.lat;
    this.longitude = location.geometry.location.lng;
  }

  //route handler

  function getLocation(request, response) {
    const tableName = 'locations';
    const fieldName = 'search_query';
    const locationHandler = {
      query: request.query.data,
      // if the data existing
      cacheHit: (results) => {
        // console.log('results :', results);
        response.send(results.rows[0]);
      },
      // if no data existing
      cacheMiss: () => {
        fetchLocation(request.query.data)
          .then(data => response.send(data));
      },
    };
    checkDuplicate(locationHandler, tableName, fieldName);
  }
  
  
  function checkDuplicate(handler, tableName, fieldName) {
    const SQL = `SELECT * FROM ${tableName} WHERE ${fieldName}=$1`;
    const values = [handler.query];
    return client.query( SQL, values )
      .then(results => {
        if(results.rowCount > 0) {
          // if there is data existing
          handler.cacheHit(results);
        }
        else {
          // if there is no data existing
          handler.cacheMiss();
        }
      })
      .catch(console.error);
  }

  function fetchLocation(query) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODING_API_KEY}`;
    return superagent.get(url).then(data => {
      let location = new Location(query, data.body.results[0]);
      return location.saveDB().then(
        result => {
          location.id = result.rows[0].id;
          return location;
        }
      )
    })
  }
  Location.prototype.saveDB = function() {
    let SQL = `
      INSERT INTO locations
        (search_query,formatted_query,latitude,longitude) 
        VALUES($1,$2,$3,$4) 
        RETURNING id
    `;
    let values = Object.values(this);
    return client.query(SQL,values);
  };
  
  
  module.exports = getLocation;
  