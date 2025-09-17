const mongoose = require('mongoose');
const userSchema = require('./User'); // Assuming './User' exports a model, not the schema itself

const User = mongoose.model('User', userSchema);
