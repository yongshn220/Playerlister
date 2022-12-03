const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
/*
    This is where we specify the format of the data we're going to put into
    the database.
    
    @author McKilla Gorilla
*/
const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerFirstName: {type: String, required: true},
        ownerLastName: {type: String, required: true},
        ownerEmail: { type: String, required: true },
        songs: { type: [{
            title: String,
            artist: String,
            youTubeId: String
        }], required: true },
        published: {type: Boolean, required: true},
        publishedDate: {type: String, required: true},
        likes: {type: Number, required: true},
        dislikes: {type: Number, required: true},
        listens: {type: Number, required: true},
        comments: { type: [{
            name: String,
            content: String
        }], required: true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)
