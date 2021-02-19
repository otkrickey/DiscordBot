import mongoose = require('mongoose');
require('dotenv').config();

const mongoPath = process.env.MONGO

export default async () => {
    if (!mongoPath) {
        console.log(`Please specify 'MONGO' to dotenv`);
        return
    }

    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });

    return mongoose
}