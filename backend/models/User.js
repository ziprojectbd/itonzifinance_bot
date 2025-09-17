const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: {
        type: Number,
        required: true,
        unique: true,
    },
    ads : {
         type : Number,
         default :0
    },
    earn : {
        type : Number,
        default : 0.00
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    firstName: {
        type: String,
        trim: true,
    },
    refer_by : String,
    ref_count : Number,
    lastName: {
        type: String,
        trim: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    channelJoinedAt: {
        type: Date,
        default: null,
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
