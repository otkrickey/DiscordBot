import mongoose = require('mongoose');


interface IWelcomeSchema extends mongoose.Document {
    _id: string,
    channelId: string,
    text: string
}

const welcomeSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

export default mongoose.model<IWelcomeSchema>('welcome-channels', welcomeSchema);
