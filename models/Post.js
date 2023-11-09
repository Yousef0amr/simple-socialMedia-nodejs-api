const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    desc: {
        type: String,
        required: true,
        max: 500
    },
    image: {
        type: String,
        default: ''
    },
    likes: {
        type: Array,
        default: []
    },
    timestamps: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Post', postSchema);