const asyncWrapper = require("../middlewares/asyncWrapper");
const Post = require('../models/Post')

const User = require("../models/User");


const get_posts = asyncWrapper(
    async (req, res, next) => {
        const posts = await Post.find({}, { _v: false });
        return res.status(200).json({ status: "SUCCESS", data: { posts } });
    }
)

const add_post = asyncWrapper(
    async (req, res, next) => {
        const post = Post({
            userId: req.userId,
            desc: req.body.desc,
            image: req.body.image
        })
        await post.save();
        return res.status(201).json({ status: "SUCCESS", data: { post } });
    }
)
const update_post = asyncWrapper(
    async (req, res, next) => {
        const postId = req.params.id;
        await Post.updateOne({ _id: postId, userId: req.userId }, { ...req.body }, { new: true }).then(post => {
            if (post) {
                return res.status(200).json({ status: "SUCCESS", data: { post } });
            }
            return res.status(404).json({ status: "FAIL", message: "post not found" });
        })

    }
)
const delete_post = asyncWrapper(
    async (req, res, next) => {
        const postId = req.params.id;
        await Post.deleteOne({ _id: postId, userId: req.userId }).then(post => {
            if (post) {
                return res.status(200).json({ status: "SUCCESS", data: null });
            }
            return res.status(404).json({ status: "FAIL", message: "post not found" });
        })
    }
)

const like_post = asyncWrapper(
    async (req, res, next) => {
        const postId = req.params.id;
        const post = await Post.findOne({ _id: postId, userId: req.userId });
        if (post && !post.likes.includes(postId)) {
            post.likes.push(postId);
            await post.save();
            return res.status(200).json({ status: "SUCCESS", message: "post liked" });
        } else {
            post.likes.pop(postId);
            await post.save();
            return res.status(200).json({ status: "SUCCESS", message: "post unliked" });
        }
    }
);

const get_post = asyncWrapper(
    async (req, res, next) => {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ status: "FAIL", message: "post not found" });
        }
        return res.status(200).json({ status: "SUCCESS", data: { post } });
    }
)

const get_timeline_posts = asyncWrapper(
    async (req, res, next) => {
        const user = await User.findById(req.userId)
        const userPost = await Post.find({ userId: req.userId });
        const friendsPosts = await Promise.all(
            user.followings.map((friendId) => {
                return Post.find({ userId: friendId })
            })
        )
        const timeline = userPost.concat(...friendsPosts);
        return res.status(200).json({ status: "SUCCESS", data: { timeline } });
    }
)



module.exports = {
    add_post,
    update_post,
    delete_post,
    like_post,
    get_post,
    get_timeline_posts,
    get_posts
}