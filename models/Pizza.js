const { Schema, model } = require('mongoose');
// We could import the entire mongoose library, but we only need to worry about the Schema constructor and model function, so we'll just import them.



const PizzaSchema = new Schema({
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
        default: Date.now
    },
    size: {
        type: String,
        default: 'Large'
    },
    toppings: [] // indicates an array as the data type. 'toppings: Array' would also have worked

});


// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;