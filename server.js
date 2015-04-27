// server.js
// Nann for Anne main 
// Author Bianca Mihai <bubu.slubu@gmail.com>
// =============================================================================

'use strict';

// call the packages we need
var express    = require('express'),        // call express
app        		 = express(),                 // define our app using express
bodyParser 		 = require('body-parser'),
mongoose 	  	 = require('mongoose'),
options     	 = { db: { native_parser: true }, server: { poolSize: 5 }};

// conect to mongo 
if(process.env.NODE_ENV === 'test') {//if we run tests, connect to a test DB
	mongoose.connect('mongodb://localhost/test', options);
} else { // else connect to the Mongo Lab DB
	mongoose.connect('mongodb://nannforanne:./nann7391@ds063789.mongolab.com:63789/nannforanne', options);
}

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:3000/v1)
// will add here controllers
router.get('/', function(req, res) {
	res.json({ message: 'welcome to our api!' });   
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/v1', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('App started on: ' + port);