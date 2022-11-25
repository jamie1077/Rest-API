'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();

// Route that will return all properties and values for the currently authenticated User
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  res.status(200).json(user);
}));

// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
  try{
    await User.create(req.body);
    res.status(201).location("/").end();
  } catch(error){
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }

}));

// Route that will return all courses including the User associated with each course
router.get('/courses', asyncHandler(async(req, res) =>{
  try{
    const course = await Course.findAll({
      include: [ 
        {
          model: User
        },
    ],
    });
        res.status(200).json({course});
    } catch(error){
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }
}));


// Route that will return the corresponding course including the User associated with that course
router.get('/courses/:id', asyncHandler(async(req,res) =>{
    const course = await Course.findByPk(req.params.id, {
        include: [ 
            {
              model: User
            }
        ]
    });
    if(course){
        res.status(200).json({course})
    } else{
        res.status(404).json({message: "Course not found"});
    }
}));


// Route that will create a new course and set the Location header
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  try{
    const course = await Course.create(req.body);
    res.status(201).location(`/courses/${course.id}`).end();
  } catch(error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));


// Route that will update the corresponding course
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  try{
    const course = await Course.findByPk(req.params.id);
    if(course && req.currentUser.id === course.userId){
      course.title = req.body.title,
      course.description = req.body.description,
      await course.update(req.body);
      res.status(204).end();
    }
    else if(course && req.currentUser.id !== course.userId){
      res.status(403).end();
    }
  } catch(error){
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));


// Route that will delete the corresponding course
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  try{
    const course = await Course.findByPk(req.params.id);
    if(course && req.currentUser.id === course.userId){
      await course.destroy();
      res.status(204).end();
    }
    else if(course && req.currentUser.id !== course.userId){
      res.status(403).end();
    }
  } catch(error){
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

module.exports = router;