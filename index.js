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
    secret: 'FitHubWIF2003Team07okayokayokay', 
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


app.get('/tracker', requireLogin, async (req, res) => {
  try {
    let activities = await Activity.find({ user: req.session.user_id }).sort({ datetime: -1 });

    // Convert activityType number to string
    activities = activities.map(activity => {
      const activityCopy = activity.toObject();
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

app.get('/dashboard', async (req, res) => {
    if (!req.session.user_id) {
        return res.redirect('/');
    }
    const user = await User.findById(req.session.user_id);
    res.render('dashboard', { user }); // Pass user object to EJS
});


app.get('/profile', requireLogin, async (req, res) => {
  const user = await User.findById(req.session.user_id);
  res.render('profile', { user });
});

app.get('/register', (req, res) => {
  res.render('register'); 
});

app.post('/tracker', requireLogin, async (req, res) => {
  console.log("POST /tracker hit");

  try {
    console.log("Form data:", req.body);

    const newActivity = new Activity({
      ...req.body,
      user: req.session.user_id // Link activity to logged-in user
    });

    await newActivity.save();

    console.log("Activity saved:", newActivity);

    res.redirect('/tracker');
  } catch (error) {
    console.error("Error saving activity:", error);
    res.status(500).send("Internal Server Error");
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
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/dashboard');
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error (email already exists)
      res.render('register', { error: 'Email already registered. Please use a different email.' });
    } else {
      console.error('Registration error:', err);
      res.render('register', { error: 'An error occurred during registration. Please try again.' });
    }
  }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const foundUser = await User.findAndValidate(email, password);
    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/dashboard');
    }
    else {
        res.render('login', { error: 'Invalid email or password.' });
    }
})

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    // req.session.destroy();  /another way to destroy the session
    res.redirect('/');
})

//Added API endpoint for activities for progress page(Nabil)
app.get('/api/activities', requireLogin, async (req, res) => {
    try {
        const timeRange = parseInt(req.query.timeRange) || 7; // Default to 7 days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - timeRange);

        const activities = await Activity.find({
            user: req.session.user_id,
            datetime: { $gte: startDate }
        }).sort({ datetime: 1 });

        // Process activities to include activity type labels
        const processedActivities = activities.map(activity => {
            const activityObj = activity.toObject();
            activityObj.activityTypeLabel = activityTypeMap[activity.activityType] || "Unknown";
            return activityObj;
        });

        res.json(processedActivities);
    } catch (error) {
        console.error("Error fetching activities:", error);
        res.status(500).json({ error: "Failed to fetch activities" });
    }
});
//New code ends here(Nabil)

app.post('/profile', requireLogin, async (req, res) => {
  try {
    const { name, email, age, weight, height, gender } = req.body;
    const user = await User.findByIdAndUpdate(
      req.session.user_id,
      { name, email, age, weight, height, gender },
      { new: true, runValidators: true }
    );
    res.render('profile', { user, profileMessage: 'Profile updated successfully!' });
  } catch (err) {
    let profileError = 'An error occurred while updating your profile.';
    if (err.code === 11000) {
      profileError = 'Email already registered. Please use a different email.';
    }
    const user = await User.findById(req.session.user_id);
    res.render('profile', { user, profileError });
  }
});

app.get('/profile/data', requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.session.user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { age, weight, height, gender } = user;
    res.json({ age, weight, height, gender });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profile data" });
  }
});
//Hassan added so calculator can function

app.post('/change-password', requireLogin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.session.user_id);
    const isMatch = await user.constructor.findAndValidate(user.email, currentPassword);
    if (!isMatch) {
      return res.render('profile', { user, passwordError: 'Current password is incorrect.' });
    }
    user.password = newPassword;
    await user.save();
    res.render('profile', { user, passwordMessage: 'Password changed successfully!' });
  } catch (err) {
    const user = await User.findById(req.session.user_id);
    res.render('profile', { user, passwordError: 'An error occurred while changing your password.' });
  }
});

app.post('/delete-account', requireLogin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.session.user_id);
    req.session.user_id = null;
    res.redirect('/');
  } catch (err) {
    const user = await User.findById(req.session.user_id);
    res.render('profile', { user, error: 'Failed to delete account.' });
  }
});

//command to run the app with nodemon: npm run server
//command to run the app without nodemon: node index.js