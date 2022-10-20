'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A firstname is required'
          },
          notEmpty: {
            msg: 'Please provide a firstname'
          }
        }
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A lastname is required'
          },
          notEmpty: {
            msg: 'Please provide a lastname'
          }
        }
    },
    emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          msg: 'The email address you entered already exists'
        },
        validate: {
          notNull: {
            msg: 'An email address is required'
          },
          isEmail: {
            msg: 'Please provide a valid email address'
          }
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A password is required'
          },
          notEmpty: {
            msg: 'Please provide a password'
          },
          len: {
            args: [8, 20],
            msg: 'The password should be between 8 and 20 characters in length'
          }
        }
    },
  }, { sequelize });

  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: 'userId'
      },
    });
  };

  return User;
};