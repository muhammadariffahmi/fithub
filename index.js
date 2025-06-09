// Use require(‘express’) to import the Express module.
// Call express() to create an Express application instance.
// Define the port for the application, typically 3000.
const express = require('express')
const app = express()
const port = 3000
const path = require('path');  //include Path module to work with directories and file paths.
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const Product = require('./models/activity');   //import the model

//Connect to MongoDB - connection without error handling
//mongoose.connect("mongodb://localhost:27017/catApp");

// MongoDB connection URL
const dbUrl = 'mongodb://localhost:27017/fitHub'; 
 
// Establish the MongoDB connection with error handling
mongoose.connect(dbUrl)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
 
        // Handle specific error conditions
        if (error.name === 'MongoNetworkError') {
            console.error('Network error occurred. Check your MongoDB server.');
        } else if (error.name === 'MongooseServerSelectionError') {
            console.error('Server selection error. Ensure'
                + ' MongoDB is running and accessible.');
        } else {
            // Handle other types of errors
            console.error('An unexpected error occurred:', error);
        }
    });


// Set EJS as the view engine for the Express application 
// Configure Express.js to use the EJS View engine and `views` directory.
// The path.join() method joins the current directory (_dirname) path and /views segments into one path.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

//To serve static files, use the express.static built-in middleware function in Express.
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.listen(port, () => {
    console.log(`Server has started and App is listening on port ${port}`);
});


// GET method route to root route (/), the homepage
// Render an EJS file, home.ejs home page back to users using res.render()
app.get('/', (req, res) => {
    //res.send("Welcome to Home page")
    res.render('index')
})

app.get('/tracker', (req, res) => {
  res.render('tracker'); 
});

app.get('/progress', (req, res) => {
  res.render('progress'); 
});

app.get('/nutrition', (req, res) => {
  res.render('nutrition'); 
});

app.get('/reminders', (req, res) => {
  res.render('reminders'); 
});

app.get('/login', (req, res) => {
  res.render('login'); 
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard'); 
});

app.get('/profile', (req, res) => {
  res.render('profile'); 
});

app.get('/register', (req, res) => {
  res.render('register'); 
});



//command to run the app with nodemon: npm run server
//command to run the app without nodemon: node index.js