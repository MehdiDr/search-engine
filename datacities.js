const elasticsearch = require('elasticsearch');
const cities = require('./data/cities.json');

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

client.index({
    index: 'elastic-test',
    id: '1',
    type: 'cities_list',
    body: {
        "Key 1": "Content for key one",
        "Key 2": "Content for key 2",
        "Key 3": "Content for key 3",
    }
}, (err, resp, status) => console.log(resp) );

const bulk = [];

cities.forEach(city => {
    bulk.push({ 
        index: {
            _index: "elastic-test",
            _type: "cities_list",
        }
    })
    bulk.push(city)
});

client.bulk({ body: bulk }, (err, resp) => 
    err ? console.log('Failed Bulk Operation'.red, err) : console.log('Successfully imported %s'.green, cities.length));