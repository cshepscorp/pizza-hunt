const { Pizza } = require('../models');

const pizzaController = {
    // get all pizzas
  getAllPizza(req, res) {
    Pizza.find({}) // like the Sequelize .findAll() method
      .populate({
        path: 'comments',
        select: '-__v' // tell Mongoose that we don't care about the __v field on comments either. The minus sign - in front of the field indicates that we don't want it to be returned. If we didn't have it, it would mean that it would return only the __v field.
      })
      .select('-__v') // update the query to not include the pizza's __v field either, as it just adds more noise to our returning data
      .sort({ _id: -1 }) // sort in DESC order by the _id value
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one pizza by id
  getPizzaById({ params }, res) { //Instead of accessing the entire req (like we did above for getAllPizza), we've destructured params out of it, because that's the only data we need for this request to be fulfilled
    Pizza.findOne({ _id: params.id })
      .populate({ 
        path: 'comments',
        select: '-__v'
      })
      .select('-__v')
      .then(dbPizzaData => {
        // If no pizza is found, send 404
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  // createPizza
createPizza({ body }, res) { // we destructure the body out of the Express.js req object because we don't need to interface with any of the other data it provides
    Pizza.create(body)
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.status(400).json(err));
  },
  // update pizza by id
updatePizza({ params, body }, res) {
    // Mongoose finds a single document we want to update, then updates it and returns the updated document
    //  include this explicit setting (runValidators: true) when updating data so that it knows to validate any new information.
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true }) // If we don't set the third parameter { new: true }, it will return the original document. By setting the parameter to true, we're instructing Mongoose to return the new version of the document
    // .updateOne() and .updateMany() will update documents without returning them
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
  },
  // delete pizza
deletePizza({ params }, res) {
    // find the document to be returned and also delete it from the database
    Pizza.findOneAndDelete({ _id: params.id })
    // could alternatively use .deleteOne() or .deleteMany(), but we're using the .findOneAndDelete() method because it provides a little more data in case the client wants it
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
  }
};

module.exports = pizzaController;