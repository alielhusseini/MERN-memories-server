import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    title: String,
    message: String,
    name: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    comments: {
        type: [String],
        default: []
    },
    likes: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
}, { timestamps: true })

const PostMessage = mongoose.model('PostMessage', postSchema)
export default PostMessage