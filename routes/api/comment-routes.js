const router = require('express').Router();
const { addComment, removeComment, addReply, removeReply } = require('../../controllers/comment-controller');

// /api/comments/<pizzaId>
router
    .route('/:pizzaId')
    .post(addComment);

// /api/comments/<pizzaId>/<commentId>
router
    .route('/:pizzaId/:commentId')
    .put(addReply) // This is a PUT route, instead of a POST, because technically we're not creating a new reply resource. Instead, we're just updating the existing comment resource
    .delete(removeComment);

//  "Go to this pizza, then look at this particular comment, then delete this one reply."
router
    .route('/:pizzaId/:commentId/:replyId')
    .delete(removeReply)

module.exports = router;