'use strict';

const express = require('express');
const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();


// Handler function to wrap each route.
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  }
}


// Route that returns all properties and values for the currently authenticated User
router.get('/users',  authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
  
    res.status(200).json({
      firstname: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      password: user.password
    });
}));

// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).json({ "message": "Account successfully created!" });
  } catch (error) {
    console.log('ERROR: ', error.name);

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

// Route returns a list of courses and associated users.
router.get('/courses', asyncHandler(async (req, res) => {
    let courses = await Course.findAll();
    res.json(courses);
}));

// Route returns a specific course and associated user.
router.get('/courses/:id', asyncHandler(async (req, res) => {
    let courses = await Course.findAll();
    res.json(courses);
}));

// Route that creates a new course.
router.post('/courses', asyncHandler(async (req, res) => {

}));

// Route to update a course.
router.put('/courses/:id', asyncHandler(async (req, res) => {

}));

// Route to delete a course.
router.delete('/courses/:id', asyncHandler(async (req, res) => {

}));

module.exports = router;