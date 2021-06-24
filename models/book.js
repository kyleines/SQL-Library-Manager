'use strict';
const Sequelize = require('sequelize');

// Creates the Book Model
module.exports = (sequelize) => {
  class Book extends Sequelize.Model {};
  Book.init(
    {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"Title" is required'
          },
        },
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"Author" is required'
          },
        },
      },
      genre: {
        type: Sequelize.STRING,
      },
      year: {
        type: Sequelize.INTEGER,
      }
    }, 
    {
      sequelize,
      modelName: 'Book',
    }
  );
  return Book;
};