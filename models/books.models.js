const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
    title: String,
    author: String,
    publishedYear: Number,
    genre: [{
        type: String,
        enum: ["Non-fiction","Business","Autobiography"]
    }],
    language: String,
    country: String,
    rating: Number,
    summary: String,
    coverImageUrl: String
},{
    timestamps: true
})

const Books = mongoose.model('Books', booksSchema  )

module.exports = Books;