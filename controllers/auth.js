const asyncWrapper = require('../middlewares/asyncWrapper')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const generateToken = require('../utils/generateToken')

const register = asyncWrapper(
    async (req, res, next) => {
        const user = User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        })
        await user.save();
        const token = generateToken({
            email: user.email,
            id: user._id,
            isAdmin: user.isAdmin
        })
        return res.status(201).json({ status: 'SUCCESS', data: { token } })
    }
)

const login = asyncWrapper(
    async (req, res, next) => {
        const { email, password } = req.body

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ status: 'FAIL', message: "user not found" })
        }

        const isValid = bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({ status: 'FAIL', message: "password not correct" })
        }

        const token = generateToken({
            email: user.email,
            id: user._id,
            isAdmin: user.isAdmin
        })
        return res.status(200).json({ status: 'SUCCESS', data: { token } })
    }
)


module.exports = {
    register,
    login
}