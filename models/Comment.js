const { Schema, model, Types } = require('mongoose');
// needed to add Types in order to assign an id to a comment reply
const dateFormat = require('../utils/dateFormat');

const ReplySchema = new Schema(
    {
        // set custom id to avoid confusion with parent comment _id; still going to have it generate the same type of ObjectId() value that the _id field typically does
        replyId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyBody: {
            type: String
        },
        writtenBy: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    // tell the schema that it can use getters (dateFormat)
    {
        toJSON: {
            getters: true
        }
    }
);

const CommentSchema = new Schema({
        writtenBy: {
            type: String
        },
        commentBody: {
            type: String,
            minLength: 1
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        // to allow comment replies
        // unlike our relationship between pizza and comment data, replies will be nested directly in a comment's document and not referred to
        replies: [ReplySchema]
    },
    // tell the schema that it can use virtuals
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false // set id to false because this is a virtual that Mongoose returns, and we don’t need it.
    }
);

// get total count of comments and replies on retrieval
CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
  });

const Comment = model('Comment', CommentSchema);

module.exports = Comment;