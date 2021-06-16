const mongoose = require('mongoose') ;

const pfeSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please enter the pfe title'],
            maxLength: [50, 'Your name cannot exceed 50 characters']
        },
        topic: {
            type: String,
            required: [true, 'Please enter the pfe topic']
        },
        startDate : {
            type : Date,
            default : Date.now() 
        },
        deadline : {
            type : Date ,
            required : [true , 'Please enter a valid deadline'],
            min : Date.now()
        },
        supervisor : {
            type : mongoose.Schema.ObjectId,
            ref : 'User',
            required : true
        },
        trainee : {
            type : mongoose.Schema.ObjectId,
            ref : 'User',
            required : true
        }
    }
)

module.exports = mongoose.model('Pfe' , pfeSchema);

