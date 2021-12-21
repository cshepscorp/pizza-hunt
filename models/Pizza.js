const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');
// We could import the entire mongoose library, but we only need to worry about the Schema constructor and model function, so we'll just import them.

const PizzaSchema = new Schema(
  {
    // don't have to define the fields, as MongoDB will allow the data anyway, but for for clarity and usability, we should regulate what the data will look like
    // this data will adhere to the built-in JavaScript data types, including strings, Booleans, numbers, and so on.
    pizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal) // references utils/dateFormat.js
    },
    size: {
        type: String,
        default: 'Large'
    },
    toppings: [], // indicates an array as the data type. 'toppings: Array' would also have worked
    comments: [
        {
            type: Schema.Types.ObjectId, // 
            ref: 'Comment' // data comes from the Comment model
            // The ref property is especially important because it tells the Pizza model which documents to search to find the right comments
        }
    ]
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
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.length;
  });


// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;