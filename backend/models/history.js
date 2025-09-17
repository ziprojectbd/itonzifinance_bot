const mongoose = require('mongoose');

const history = new mongoose.Schema({
    uid: String,
    amount: Number,
    symbol: String,
    txid: String,
    event: {
        type: String,
        enum: ['deposit', 'ads', 'withdraw', 'refer_commision'],
        default: 'ads',
    },
    payment_method: {
        type: String,
        enum: ['ton wallet', 'mexc', 'binnace', 'bitget', 'bybit', 'payment uid' ,  'in_app'],
        default: 'in_app',
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('History', history);
