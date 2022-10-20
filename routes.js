'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();

// Route that returns the current authenticated user.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;

  res.json({
    first: user.firstname,
    lastname: user.lastname,
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
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

router.get('/courses', asyncHandler(async (req, res) => {
    
}));

router.get('/courses/:id', asyncHandler(async (req, res) => {
    
}));

router.post('/courses', asyncHandler(async (req, res) => {
    
}));

router.put('/courses/:id', asyncHandler(async (req, res) => {
    
}));

router.delete('/courses/:id', asyncHandler(async (req, res) => {
    
}));

module.exports = router;