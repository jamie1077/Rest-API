'use strict';
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

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
        set(val) {
          if (val !== "") {
            const hashedPassword = bcrypt.hashSync(val, 10);
            this.setDataValue("password", hashedPassword);
          }
        },
        validate: {
          notNull: {
            msg: 'A password is required'
          },
          notEmpty: {
            msg: 'Please provide a password'
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