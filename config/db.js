const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI+'?retryWrites=false';
        await mongoose.connect(uri, { useNewUrlParser: true });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
