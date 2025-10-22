const express = require('express');
const Post = require('../models/Post');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authRole');


// GET /api/posts - Get/list all posts
router.get('/', async (req, res) => {
    try {
        const {
            category,
            author,
            tag,
            sort = '-createdAt',
            page = 1,
            limit = 10,
        } = req.query;

        const query = {};
        if (category) query.category = category;
        if (author) query.author = author;
        if (tag) query.tags = { $in: [tag] };

        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;

        const posts = await Post.find(query)
            .populate('category', 'name')
            .sort(sort)
            .skip(skip)
            .limit(pageSize);
        
        const totalPosts = await Post.countDocuments(query);


        res.status(200).json({
            success: true,
            count: posts.length,
            total: totalPosts,
            page: pageNumber,
            data: posts,
            totalPages: Math.ceil(totalPosts / pageSize),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
});

// GET /api/posts/:id - Get a specific blog post by ID
router.get('/:id', async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId)
            .populate('category', 'name');
        
        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Blog post does not exist',
            });
        }
        res.status(200).json({
            success: true,
            data: post,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST /api/posts - Create a new blog post
router.post('/', async (req, res) => {
    try {
        const { title, content, author, category, featuredImage, excerpt, tags, isPublished } = req.body;

        const newPost = new Post({
            title,
            content,
            author,
            category,
            featuredImage,
            excerpt,
            tags,
            isPublished,
        });

        const savedPost = await newPost.save();
        res.status(201).json({
            success: true,
            data: savedPost,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
});

// PUT /api/posts/:id - Update an existing blog post by ID
router.put('/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const updateData = req.body;

        const updatedPost = await Post.findByIdAndUpdate(postId, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                error: 'Blog post does not exist',
            });
        }

        res.json({
            success: true,
            data: updatedPost,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error',
        });
    }
});

// DELETE /api/posts/:id - Delete a blog post by ID (protected: admin only)
router.delete('/:id', protect, authorizeRole('admin'), async (req, res) => {
    try {
        const postId = req.params.id;

        const deletedPost = await Post.findById(postId);

        if (!deletedPost) {
            return res.status(404).json({
                success: false,
                error: 'Blog post does not exist',
            });
        }

        await deletedPost.deleteOne();

        res.json({
            success: true,
            message: 'Blog post deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error',
        });
    }
});



module.exports = router;