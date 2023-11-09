const postRouter = require('express').Router();
const postsController = require('../controllers/posts')


postRouter.route('/')
    .post(postsController.add_post)
    .get(postsController.get_posts);

postRouter.route('/user/timrline')
    .get(postsController.get_timeline_posts);

postRouter.route('/:id')
    .patch(postsController.update_post)
    .delete(postsController.delete_post)
    .get(postsController.get_post);

postRouter.route('/:id/like')
    .patch(postsController.like_post);

module.exports = postRouter