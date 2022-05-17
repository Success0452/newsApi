const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    category_name: {
        type: String
    },
    createdAt: {
        type: String,
        default: Date.now()
    }
})

module.exports = mongoose.model('Category', CategorySchema)