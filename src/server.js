const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const stripe = require('stripe')("sk_test_saFyKcmNUVk68UyjHeKC4h79")

const { url } = require('./config/database.js');

mongoose.connect(url, {
	useMongoClient: true
});
//plantillas
// configuracion
require('./config/passport')(passport);


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
// requeridos para autenticacion con passport
app.use(session({
	secret: 'rsal',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes.js rutas
require('./app/routes.js')(app, passport);

// archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

//stripe(experimental)
app.post('/charge', function(){
    
    });

// start the server
app.listen(app.get('port'), () => {
	console.log('server on port ', app.get('port'));
});
