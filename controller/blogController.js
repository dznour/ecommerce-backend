const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoDbId');
const { cloudinaryUploadImg } = require('../utils/cloudinary');
const fs = require('fs')
// Get Blogs

const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const blogs = await Blog.find().populate('likes').populate('dislikes');
        res.json(blogs)
    } catch (error) {
        throw new Error(error);
    }
});

// Get Blog By ID

const getBlogByID = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id)
        const blog = await Blog.findByIdAndUpdate(id, {
            $inc: { viewsCount: 1 }
        }, { new: true }).populate('likes').populate('dislikes');
        res.json(blog)
    } catch (error) {
        throw new Error(error);
    }
});
// Create New Blog
const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json({
            status: 'success',
            newBlog
        });
    } catch (error) {
        throw new Error(error);
    }
});

// Update Blog

const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.json(updateBlog);
    } catch (error) {
        throw new Error(error)
    }
})

// Delete A Blog

const deleteBlog = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id)
        const del = await Blog.findByIdAndDelete(id);
        res.json(del)
    } catch (error) {
        throw new Error(error);
    }
})

const likeBlog = asyncHandler(async (req, res) => {
    try {
        const { blogId } = req.body;
        validateMongoDbId(blogId);
        //console.log(blogId);
        let blog = await Blog.findById(blogId);
        const userID = req.user?._id;
        const isLiked = blog?.isLiked;
        const alreadyDisliked = blog?.dislikes?.find((
            userId => userId.toString() === userID?.toString()
        ));
        if (alreadyDisliked) {
            blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { dislikes: userID },
                isDisliked: false
            }, { new: true });
        }
        if (isLiked) {
            blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { likes: userID },
                isLiked: false
            }, { new: true })
        } else {
            blog = await Blog.findByIdAndUpdate(blogId, {
                $push: { likes: userID },
                isLiked: true
            }, { new: true })
        }
        res.json(blog);
    } catch (error) {
        throw new Error(error);
    }
})
const dislikeBlog = asyncHandler(async (req, res) => {
    try {
        const { blogId } = req.body;
        validateMongoDbId(blogId);
        //console.log(blogId);
        let blog = await Blog.findById(blogId);
        const userID = req.user?._id;
        const isDisliked = blog?.isDisliked;
        const alreadyLiked = blog?.likes?.find((
            userId => userId.toString() === userID?.toString()
        ));
        if (alreadyLiked) {
            blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { likes: userID },
                isLiked: false
            }, { new: true });
        }
        if (isDisliked) {
            blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { dislikes: userID },
                isDisliked: false
            }, { new: true })
        } else {
            blog = await Blog.findByIdAndUpdate(blogId, {
                $push: { dislikes: userID },
                isDisliked: true
            }, { new: true })
        }
        res.json(blog);
    } catch (error) {
        throw new Error(error);
    }
})

const uploadImage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, 'images');
        const urls = [];
        const files = req.files;
        for (const f of files) {
            const { path } = f;
            const newPath = await uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path)
        }
        const findBlog = await Blog.findByIdAndUpdate(id, {
            images: urls.map((file) => {
                return file
            })
        }, { new: true })
        res.json(findBlog);
    } catch (error) {
        throw new Error(error);
    }
})
module.exports = {
    getAllBlogs,
    getBlogByID,
    createBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    uploadImage
}