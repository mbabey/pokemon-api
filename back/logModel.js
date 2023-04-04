const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    timestamp: {
        type: Number,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    endpoint: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    status_code: {
        type: Number,
        required: true
    },
    response_time_ms: {
        type: Number,
        required: true
    }
});

const Log = mongoose.model('logs', logSchema);

module.exports = Log;