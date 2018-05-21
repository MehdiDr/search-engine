const elasticsearch = require('elasticsearch');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
let port = 3001 || process.env.PORT;

const client = new elasticsearch.Client({
    hosts: [ 'http://localhost:9200']
})

client.ping({
    requestTimeout: 10000,
}, (error) => error ? console.error('elasticsearch cluster is down!') : console.log('Everything is ok'));

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/', (req, res) => {
    res.sendFile('template.html',  { 
        root: path.join(__dirname, 'views') 
    })
});

app.get('/search', (req, res) => {
    let body = {
        size: 200,
        from: 0,
        query: {
            match: {
                name: req.query['q']
            }
        }
    }
    client.search({ 
        index: 'elastic-test', 
        body: body,
        type: 'cities_list',
    })
    .then(results => res.send(results.hits.hits)) //hits.hits = array of search results 
    .catch(err => res.send([]));
});

app.listen(port, () => 
    console.log(`server is listening on port ${port}`)
);