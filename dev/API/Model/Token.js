const mongoose = require('mongoose');
const TokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: [true, 'The Token field is required!'],
        trim: true,
        unique: true
    },
    userId: {
        type: String,
        required: [true, 'The User ID field is required'],
    },
    type: {
        type: String,
        enum: ['RESET', 'REFRESH']
    },
    tokenExpire: {
        type: Date,
        default: Date.now()
    }
});




module.exports = mongoose.model('Token', TokenSchema)