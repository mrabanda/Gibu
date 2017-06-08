const bcrypt = require('bcryptjs');
const saltRounds = 10;

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
          notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
          notEmpty: true
      }
    }
  }, {
    classMethods: {
        validPassword: function(password, passwd, callback) {
          bcrypt.compare(password, passwd, function(err, isMatch) {
            if (isMatch) {
              return callback(null, true);
            } else {
              return callback(null, false);
            }
          });
        },
        associate: function(models) {
          // Associating Author with Posts
          // When an Author is deleted, also delete any associated Posts
          User.belongsToMany(models.Project, {through: 'UserProject'});
          User.hasOne(models.Project);
        }
      }
  }, {dialect: 'mysql'});

  User.hook('beforeCreate', function(user, {}, next) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        return next(null, user);
      });
    });
  });

  return User;
};
