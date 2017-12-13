const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('../app/models/user');
const configAuth = require('./auth');

module.exports = function (passport) {
  // persistent login sessions, guarda cookies de la sesion
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // deserializar, funcion de passport estudiar
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // Signup
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true // devuelve la solicitud completa al callback
  },
  function (req, email, password, done) {
    User.findOne({'local.email': email}, function (err, user) {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, false, req.flash('signupMessage', 'el correo ha sido tomado'));
      } else {
        var newUser = new User();
        newUser.local.email = email;
        newUser.local.password = newUser.generateHash(password);
        newUser.save(function (err) {
          if (err) { throw err; }
          return done(null, newUser);
        });
      }
    });
  }));

  // login
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, email, password, done) {
      process.nextTick(function(){ //linea modificada
    User.findOne({'local.email': email}, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'No User found'))
      }
      if (!user.validPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'Wrong. password'));
      }
      return done(null, user);
    });
  });
 }
));
    
    passport.use(new GoogleStrategy({
          clientID: configAuth.googleAuth.clientID,
          clientSecret: configAuth.googleAuth.clientSecret,
          callbackURL: configAuth.googleAuth.callbackURL
      },
      function (accessToken, refreshToken, profile, done) {
          process.nextTick(function(){
              User.findOne({'google.id': profile.id}, function(err, user){
                  if(err)
                      return done(err);
                  if(user)
                      return done(null, user);
                  else{
                      var newUser = new User();
                      newUser.google.id = profile.id;
                      newUser.google.token = accessToken;
                      newUser.google.name = profile.displayName;
                      newUser.google.email = profile.emails[0].value;
                      
                      newUser.save(function(err){
                          if(err)
                              throw err;
                          return done(null, newUser);
                      })
                      console.log(profile);
                    }
                });
            });
        }
    ));   
    
};
