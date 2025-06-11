// Use require(‘express’) to import the Express module.
// Call express() to create an Express application instance.
// Define the port for the application, typically 3000.
const express = require('express')
const app = express()
const port = 3000
const path = require('path');  //include Path module to work with directories and file paths.
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('./models/user');
const Activity = require('./models/activity');   //import the model

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

const sessionOptions = { 
    secret: 'mySecretKey', // Replace with a strong, unique key
    resave: false, 
    saveUninitialized: false 
}
app.use(session(sessionOptions));

app.listen(port, () => {
    console.log(`Server has started and App is listening on port ${port}`);
});


// GET method route to root route (/), the homepage
// Render an EJS file, home.ejs home page back to users using res.render()
app.get('/', (req, res) => {
    if (req.session && req.session.user_id) {
        res.redirect('/dashboard');
    } else {
        res.render('index');
    }
});



const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    next();
}

const activityTypeMap = {
  1: "Running",
  2: "Walking",
  3: "Hiking",
  4: "Swimming",
  5: "Cycling",
  6: "Weightlifting",
  7: "Deadlifts",
  8: "Kettlebell Swings",
  9: "Bicep Curls",
  10: "Tricep Dips",
  11: "Push-ups",
  12: "Pull-ups",
  13: "Squats",
  14: "Lunges",
  15: "Planks",
  16: "Sit-ups",
  17: "Mountain Climbers",
  18: "Burpees",
  19: "Leg Raises",
  20: "Glute Bridges",
  other: "Other"
};

app.use('/tracker',  (req, res, next) => {
  if (req.method === 'POST') {
    req.body.duration = {
      hours: Number(req.body.hours) || 0,
      minutes: Number(req.body.minutes) || 0,
      seconds: Number(req.body.seconds) || 0
    };

    if (req.body.weight || req.body.weightUnit) {
      req.body.weightUsed = {
        weight: Number(req.body.weight),
        unit: req.body.weightUnit
      };
    }

    req.body.reps = Object.keys(req.body)
      .filter(k => k.startsWith('reps'))
      .map(k => Number(req.body[k]))
      .filter(n => !isNaN(n));
  }

  next();
});


app.get('/tracker',requireLogin, async (req, res) => {
  try {
    let activities = await Activity.find({}).sort({ datetime: -1 });

    // Convert activityType number to string
    activities = activities.map(activity => {
      const activityCopy = activity.toObject(); // Convert Mongoose doc to plain object
      activityCopy.activityTypeLabel = activityTypeMap[activity.activityType] || "Unknown";
      return activityCopy;
    });

    res.render('tracker', { activities });
  } catch (err) {
    console.error("Error loading activities:", err);
    res.render('tracker', { activities: [] });
  }
});



app.get('/progress',requireLogin, (req, res) => {
  res.render('progress'); 
});

app.get('/nutrition',requireLogin, (req, res) => {
  res.render('nutrition'); 
});

app.get('/reminders',requireLogin, (req, res) => {
  res.render('reminders'); 
});

app.get('/login', (req, res) => {
  res.render('login'); 
});

app.get('/dashboard', (req, res) => {
    if (!req.session.user_id) {
        return res.redirect('/');
    }
    res.render('dashboard'); // or pass user data if needed
});


app.get('/profile', requireLogin,(req, res) => {
  res.render('profile'); 
});

app.get('/register', (req, res) => {
  res.render('register'); 
});

app.post('/tracker', async (req, res) => {
  console.log("POST /tracker hit"); // 🟡 Step 1: Make sure this shows

  try {
    console.log("Form data:", req.body); // 🟡 Step 2: Check form data

    const newActivity = new Activity(req.body);
    await newActivity.save();

    console.log("Activity saved:", newActivity); // 🟢 Step 3: Confirm saved

    // res.status(201).send('Activity saved successfully');
    res.redirect('/tracker');


  } catch (error) {
    console.error("Error saving activity:", error); // 🔴 Step 4: Catch any errors
    // res.status(500).send('Error saving activity');
  }
});

app.delete('/activities/:id', async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.redirect('/tracker'); // or send JSON if using AJAX
  } catch (err) {
    console.error('Error deleting activity:', err);
    res.status(500).send('Server Error');
  }
});

app.post('/register', async (req,res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  await user.save();
  req.session.user_id = user._id;
  res.redirect('/dashboard');
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const foundUser = await User.findAndValidate(email, password);
    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/dashboard');
    }
    else {
        res.redirect('/login')
    }
})

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    // req.session.destroy();  /another way to destroy the session
    res.redirect('/');
})




//command to run the app with nodemon: npm run server
//command to run the app without nodemon: node index.js