const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    activityType: {
        type: String,
        required: true
    },
    otherActivity: {
        type: String
    },
    imagePath: {
        type: String
    },
    datetime: {
        type: Date,
        required: true
    },
    duration: {
        hours: { type: Number, default: 0 },
        minutes: { type: Number, default: 0 },
        seconds: { type: Number, default: 0 }
    },
    distance: {
        type: Number
    },
    speed: {
        type: Number
    },
    weightUsed: {
        value: { type: Number },
        unit: { type: String, enum: ['kg', 'lbs'] }
    },
    steps: {
        type: Number
    },
    sets: {
        type: Number
    },
    reps: {
        type: [Number] // Array of reps per set
    },
    rate: {
        type: Number,
        min: 0,
        max: 100
    },
    notes: {
        type: String
    },
    caloriesBurned: {
        type: Number
    }
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
