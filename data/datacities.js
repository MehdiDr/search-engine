const elasticsearch = require('elasticsearch');
const cities = require('./cities.json');

const client = new elasticsearch.Client({
    hosts: ['http://localhost:9200'] // 9200 is the default port used by elasticsearch
});

client.ping({
    requestTimeout: 10000,
}, (error) => error ? console.error('Its down !') : console.error('Its ok !') );

// create a new index
client.indices.create({
    index: 'elastic-test',
}, (error, response) => error ? console.log(error) : console.log('created new index', response));

let bulk = [];
cities.forEach(city => {
    bulk.push({ 
        index: {
            _index: "elastic-test",
            _type: "cities_list",
        }
    })
    bulk.push(city)
});

client.bulk({ body: bulk }, (err, res) => err ? 
    console.log('Error ! All your base belong to us'.red, err) : 
    console.log('Successfully imported %s'.green, cities.length));
