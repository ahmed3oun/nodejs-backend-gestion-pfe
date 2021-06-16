const mongoose = require('mongoose') ; 

const connectDatabase = () => {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pfeDb' )
        .then(conn => {
            console.log(`Database connected succesfully with host : ${conn.connection.host}` );
        })
        .catch(err => {
            console.log(`Something gone wrong : ${err}`);
        })
}

module.exports = connectDatabase ;