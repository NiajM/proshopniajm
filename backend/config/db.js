import mongoose from 'mongoose' // Package
// Database config file or connection file
const connectDB = async () => { // connectDB is a Function and async make this function as asynchronous which is always going to return a promise
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {    // Variable conn is for connection... Since mongoose.connect returns a promise, so we have to wait thats why await is using here and it's take the MONGO_URI as first argument and by second argument we are passing set of options neither we will get warnings in console...
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)   // Shows the Connection Host
    } catch (error) {
        console.error(`Error: ${error.message}`.red.underline.bold)    // Shows Console Error
        process.exit(1) // By passing 1 in here it means it's going to Exit with failure
    }
}

export default connectDB