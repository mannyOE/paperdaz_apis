global.__base = __dirname + '/';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
var fileUpload = require('express-fileupload');
var handlebars   = require('express3-handlebars');
var util = require('./middleware/util');
var upload = util.upload;
app.set('port', process.env.PORT || 3001);

global.hostname   = process.env.HOSTNAME || "178.128.34.164";
hostname = global.hostname.toLowerCase();
global.hostport   = app.get('port');
global.hosturl    = "http://"+hostname+":"+hostport;
global.mail_url = "http://positive-difference.appspot.com";

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

//the routing modules
const admin = require(__base + 'routes/admin_routes');

const Wallet = require(__base + 'routes/wallet_routes');
const user_routes = require(__base + 'routes/user_routes');
const config = require(__base + 'config/database'); // get db config file
const morgan = require('morgan');
const mongoose = require('mongoose');

const looper = require(__base+'looper');
//middleware

app.use(bodyParser.urlencoded({
	extended: true,
	limit: '50mb',
	parameterLimit: 5000000
}));

app.use(bodyParser.json({
	type: 'application/json',
	limit: '50mb'
}));
//cors middleware,you can use this to ensure security
app.use(cors());

// log to console
app.use(morgan('dev'));
//public folder
app.use(express.static(__dirname + '/public'));
mongoose.Promise = global.Promise;
mongoose.connect(config.database);
const apiRoutes = express.Router(),
	errorHandler = (err, req, res, next) => {
		res.status(err.status || /* istanbul ignore next: tired of writing tests */ 500).json(err);
		next();
	};

// users API
app.use('/api/users', user_routes);
app.use('/api/wallet', Wallet);


app.use('/api/admin/', admin);


// setting views directory for email templates

app.engine('html', handlebars({defaultLayout: 'main', extname: ".html",layoutsDir: __dirname + '/view/main'}));

app.set('view engine', 'html');

app.set('views', __dirname + '/view');




app.listen(app.get('port'), (error) => {
	if(error){
		console.log(error,"error here");
	}
	console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
