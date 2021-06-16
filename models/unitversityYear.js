const mongoose = require('mongoose') ;

const universityYearSchema = mongoose.Schema({

    title: {
        type: String,
        required: [true, 'Please enter the pfe title'],
        maxLength: [50, 'Your name cannot exceed 50 characters']
    },
    topic: {
        type: String,
        required: [true, 'Please enter the pfe topic']
    }

})