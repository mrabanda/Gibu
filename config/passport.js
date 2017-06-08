var passport = require('passport'),
LocalStrategy = require('passport-local'),
db = require('../models');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  db.User.findById(user.id).then(function(user) {
    done(null, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  db.User.findOne({where: {username: username}}).then(function(user) {
    if (!user) {
      return done(null, false, { message: 'Incorrect credentials.' })
    }
    var passwd = user ? user.password: '';
    db.User.validPassword(password, passwd, function(err, found) {
      done(err, found ? user : false);
    });
  });
}));
