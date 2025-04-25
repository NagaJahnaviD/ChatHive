const exp = require('express');
const userApp = exp.Router();
const User = require('../models/User');
const expressAsyncHandler = require('express-async-handler');
const { requireAuth } = require('@clerk/express');


// Create a new user
async function createNewUser(req, res) {
  let newUser = req.body;
  let userInDB = await User.findOne({ email: newUser.email });
  if (userInDB !== null) {
    res.status(200).send({ message: 'User already exists. Invalid email', payload: userInDB._id });
  } else {
    let newUserDoc = await new User(newUser).save();
    res.status(201).send({ message: 'User created successfully', payload: newUserDoc._id });
  }
}

userApp.post("/user", expressAsyncHandler(createNewUser));

// Get MongoDB user by email
// Backend route for getting user by email
userApp.get('/get-user-by-email/:email', expressAsyncHandler(async (req, res) => {
    const email = req.params.email;
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
  
    res.status(200).send({ message: 'User found', payload: user._id });
  }));
  

// Get all users' contact list
userApp.get("/user/:id/contacts", expressAsyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId).populate('contacts', '-passwordHash'); // exclude passwordHash
    console.log("contacts:",user.contacts)
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }

  res.status(200).send({
    message: 'Contacts fetched successfully',
    payload: user.contacts
  });
}));


// Add a user to the contacts list
userApp.post('/user/:userId/contacts/add', expressAsyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const { contactUserId } = req.body;

  if (!contactUserId) {
    return res.status(400).send({ success: false, message: 'contactUserId is required' });
  }

  const user = await User.findById(userId);
  const contactUser = await User.findById(contactUserId);

  if (!user || !contactUser) {
    return res.status(404).send({ success: false, message: 'User or contact user not found' });
  }

  // Check if already in contacts
  const alreadyExists = user.contacts.includes(contactUserId);
  if (alreadyExists) {
    return res.status(200).send({ success: false, message: 'User is already in contacts' });
  }

  // Add contact
  user.contacts.push(contactUserId);
  await user.save();

  res.status(201).send({
    success: true,
    message: 'Contact added successfully',
    payload: contactUser, // Return the new contact details
  });
}));


// Get all registered users (excluding current user if email is passed as query param)
userApp.get('/all-users', expressAsyncHandler(async (req, res) => {
  
  let user = await User.find({}, '-passwordHash'); // Exclude password and current user

  res.status(200).send({
    message: 'All users fetched successfully',
    payload: user,
  });
}));


module.exports = userApp;