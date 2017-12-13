module.exports = (app, passport) => {

	// ruta de index
	app.get('/', (req, res) => {
		res.render('index');
	});

	// ruta de login
	app.get('/login', (req, res) => {
		res.render('login.ejs', {
			message: req.flash('loginMessage')
		});
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	// ruta de signup
	app.get('/signup', (req, res) => {
		res.render('signup', {
			message: req.flash('signupMessage')
		});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true // allow flash messages
	}));

	// ruta del perfil
	app.get('/profile', isLoggedIn, (req, res) => {
		res.render('profile', {
			user: req.user
		});
	});
    
    // ruta de el index de compras
    app.get('/indexc', (req, res) =>{
        res.render('indexc');
    })
    
    //autenticacion google
    
    app.get('/auth/google',
                passport.authenticate('google',{scope: ['profile', 'email']}));
        app.get('/auth/google/callback',
                passport.authenticate('google', { successRedirect: '/profile',
                                                   failureRedirect: '/' }));


	// logout
	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});
};

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');
}
