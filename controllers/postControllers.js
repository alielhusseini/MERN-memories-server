import PostMessage from "../models/postMessage.js"
import mongoose from 'mongoose'

async function getPosts(req, res) {
    const { page } = req.query
    try {
        const LIMIT = 8
        const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page (how many we need to skip)
        const total = await PostMessage.countDocuments({})

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex)
        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) })
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

async function createPost(req, res) {
    try {
        const post = req.body
        //const newPost = await PostMessage.create(post)
        // or
        const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })
        await newPost.save()
        res.status(201).json(newPost)
    } catch (err) {
        res.status(409).json({ message: err.message })
    }
}

async function updatePost(req, res) {
    try {
        const { id } = req.params;
        const { title, message, creator, selectedFile, tags } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
        const updatedPost = { creator, title, message, tags, selectedFile, _id: id };
        await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true, runValidators: true });
        res.json(updatedPost);
    } catch (err) {
        console.log(err.message)
    }
}

async function getPost(req, res) {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

async function getPostsBySearch(req, res) {
    const { searchQuery, tags } = req.query

    try {
        const title = new RegExp(searchQuery, "i"); // Test test TesT -> all the same, i is for ignoreCase
        const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] })
        res.json({ data: posts })
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

async function deletePost(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
        await PostMessage.findByIdAndRemove(id);
        res.json({ message: "Post deleted successfully." });
    } catch (err) {
        console.log(err.message)
    }
}

async function likePost(req, res) {
    try {
        const { id } = req.params;

        if (!req.userId) return res.json({ message: 'Unauthenticated' })

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
        const post = await PostMessage.findById(id);

        const index = post.likes.findIndex(id => id === String(req.userId))

        if (index === -1) {
            post.likes.push(req.userId)
        } else {
            post.likes = post.likes.filter(id => id !== String(req.userId))
        }

        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
        res.json(updatedPost);
    } catch (err) {
        console.log(err.message)
    }
}

async function commentPost(req, res) {
    try {
        const { id } = req.params
        const { comment } = req.body

        const post = await PostMessage.findById(id)
        post.comments.push(comment)

        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })
        res.json(updatedPost)
    } catch (error) {
        console.log('controllers/postControllers', err)
    }
}

const postControllers = { getPosts, getPostsBySearch, createPost, deletePost, updatePost, likePost, getPost, commentPost }
export default postControllers