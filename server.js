const connectDatabase = require('./config/database')
const app = require('./app')

//Connect DATABASE 
connectDatabase();

const server = app.listen(process.env.PORT || 5050 , ()=>{
    console.log(`Server started on port : ${process.env.PORT}`);
})

// Handle Unhandled Promise rejections
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down the server due to Unhandled Promise rejection');
    server.close(() => {
        process.exit(1)
    })
})

