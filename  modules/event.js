'use strict';

const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();

function Event(link, name, event_date, summary){
  this.link = link;
  this.name = name;
  this.event_date = event_date;
  this.summary = summary;
}


function getEventbrite(request, response) {

const event_query = request.query.data
const urlToVisit = `http://api.eventful.com/json/events/search?location=${event_query.formatted_query}&date=Future&app_key=${process.env.EVENT_API_KEY}`;

  superagent.get(urlToVisit).then(data => {
    const parseData = JSON.parse(data.text);
    const eventData = parseData.events.event.map(data =>{
      const link = data.urlToVisit;
      const name = data.title;
      const event_date =  new Date(data.start_time).toDateString();
      const summary = data.description;
      return new Event(link,name,event_date,summary);
    });
    response.status(200).send(eventData);

  }).catch(error => {
    console.error(error);
    response.status(500).send('Status 500:Internal Server Error');
  
})

}
module.exports = getEventbrite;
