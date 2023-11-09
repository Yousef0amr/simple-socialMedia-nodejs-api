
const asyncWrapper = require("../middlewares/asyncWrapper")
const bcrypt = require('bcrypt');
const User = require("../models/User");

const update_user = asyncWrapper(
    async (req, res, next) => {
        const userId = req.userId
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password);
            await User.updateOne({ _id: userId }, { ...req.body }, { new: true, password: false });
        } else {
            await User.updateOne({ _id: userId }, { ...req.body })
        }
        return res.status(200).json({ status: "SUCCESS", message: "updated successfully" });
    }
)


const delete_user = asyncWrapper(
    async (req, res, next) => {
        const userId = req.userId
        await User.deleteOne({ _id: userId });
        return res.status(200).json({ status: "SUCCESS", message: "deleted successfully" });
    }
)



const get_user = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user)
            return res.status(404).json({ status: "FAIL", message: "user not found" });
        return res.status(200).json({ status: "SUCCESS", data: { user } });
    }
)


const follow_user = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.id;
        if (id != req.userId) {
            const user = await User.findById(id);
            const currentUser = await User.findById(req.userId);
            if (!user)
                return res.status(404).json({ status: "FAIL", message: "user not found" });
            if (!user.followers.includes(req.userId)) {
                await user.updateOne({ $push: { followers: req.userId } })
                await currentUser.updateOne({ $push: { followings: id } })
                return res.status(200).json({ status: "SUCCESS", message: `you now following ${user.username}` });
            }
        } else {
            return res.status(400).json({ status: "FAIL", message: "how you want to follow yourself , foolish man" });
        }
    }
)


const unfollow_user = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.id;
        if (id != req.userId) {
            const user = await User.findById(id);
            const currentUser = await User.findById(req.userId);
            if (!user)
                return res.status(404).json({ status: "FAIL", message: "user not found" });
            if (user.followers.includes(req.userId)) {
                await user.updateOne({ $pull: { followers: req.userId } })
                await currentUser.updateOne({ $pull: { followings: id } })
                return res.status(200).json({ status: "SUCCESS", message: `you now unfollowing ${user.username}` });
            }
        } else {
            return res.status(400).json({ status: "FAIL", message: "how you want to unfollow yourself , foolish man" });
        }
    }
)

module.exports = {
    update_user,
    delete_user,
    get_user,
    follow_user,
    unfollow_user
}