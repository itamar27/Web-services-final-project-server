const { Router } = require('express');
const commentController  = require('../controllers/comments.ctrl');


const commentsRouter = new Router();

commentsRouter.put('/:id',  commentController.updateComment);



module.exports = { commentsRouter };