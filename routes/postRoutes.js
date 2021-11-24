import { Router } from 'express'
import postControllers from '../controllers/postControllers.js'
import auth from '../middlewares/auth.js'

const router = Router()

router.get('/', postControllers.getPosts)
router.post('/', auth, postControllers.createPost)
router.get('/search', postControllers.getPostsBySearch)
router.get('/:id', postControllers.getPost)
router.patch('/:id', auth, postControllers.updatePost)
router.delete('/:id', auth, postControllers.deletePost)
router.patch('/:id/likePost', auth, postControllers.likePost)
router.post('/:id/commentPost', auth, postControllers.commentPost)

export default router