const userRouter = require('express').Router();
const userController = require('../controllers/user')



userRouter.route('/')
    .patch(userController.update_user)
    .delete(userController.delete_user)

userRouter.route('/:id')
    .get(userController.get_user)
    .post(userController.follow_user)
    .post(userController.unfollow_user)


module.exports = userRouter