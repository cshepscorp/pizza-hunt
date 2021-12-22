// variable to hold db connection
let db;
// establish connection to IndexedDB database called 'pizza_hunt' and set it to version 1
//  create the request variable to act as an event listener for the database -- created when we open the connection to the database using the indexedDB.open() 
// As part of the browser's window object, indexedDB is a global variable. could also say window.indexedDB but we don't need to

// two params - if 'pizza_hunt' exists, connect to it, if not, create it - second is the version of the database; used to determine whether the database's structure has changed between connections
const request = indexedDB.open('pizza_hunt', 1);


// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
// won't run again unless we delete the database from the browser or we change the version number in the .open() method to a value of 2, indicating that our database needs an update.
request.onupgradeneeded = function(event) {
    // save a reference to the database 
    const db = event.target.result;
    // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('new_pizza', { autoIncrement: true });

    
};

// upon a successful 
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;

    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    if (navigator.onLine) {
        uploadPizza();
    }
};

request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
};

  // This function will be executed if we attempt to submit a new pizza and there's no internet connection
    // This saveRecord() function will be used in the add-pizza.js file's form submission function if the fetch() function's .catch() method is executed (only executed on network failure!)
function saveRecord(record) {
        // open a new transaction with the database with read and write permissions; transaction is a temporary connection to the database
        const transaction = db.transaction(['new_pizza'], 'readwrite');
    
        // access the object store for `new_pizza` - where we'll be adding data; use the object store's .add() method to insert data into the new_pizza object store
        const pizzaObjectStore = transaction.objectStore('new_pizza');
    
        // add record to your store with add method
        pizzaObjectStore.add(record);
    };

function uploadPizza() {
  // open a transaction on your db
  const transaction = db.transaction(['new_pizza'], 'readwrite');

  // access your object store
  const pizzaObjectStore = transaction.objectStore('new_pizza');

  // get all records from store and set to a variable
  const getAll = pizzaObjectStore.getAll();

  // upon a successful .getAll() execution, run this function
    getAll.onsuccess = function() {
        // if there was data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) {
        fetch('/api/pizzas', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(serverResponse => {
            if (serverResponse.message) {
                throw new Error(serverResponse);
            }
            // open one more transaction
            const transaction = db.transaction(['new_pizza'], 'readwrite');
            // access the new_pizza object store
            const pizzaObjectStore = transaction.objectStore('new_pizza');
            // clear all items in your store
            pizzaObjectStore.clear();

            alert('All saved pizza has been submitted!');
            })
            .catch(err => {
            console.log(err);
            });
        }
    };
}

// listen for app coming back online
window.addEventListener('online', uploadPizza);