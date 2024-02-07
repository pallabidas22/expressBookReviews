const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
    const booksByAuthor = [];

    Object.keys(books).forEach((book) => {
        if (books[book].author === author) {
            booksByAuthor.push(books[book]);
        }
    });
    const newOutput = { BooksByAuthor: booksByAuthor.map(book => ({ isbn : book.isbn, title: book.title, reviews: book.reviews })) };
    res.json(newOutput);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
    const booksByTitle = [];

    Object.keys(books).forEach((book) => {
        if (books[book].title === title) {
          booksByTitle.push(books[book]);
        }
    });
    const newOutput = { BooksByTitle: booksByTitle.map(book => ({ isbn : book.isbn, author: book.author, reviews: book.reviews })) };
    res.json(newOutput);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ReviewIsbn = req.params.isbn;
    res.send(books[ReviewIsbn].reviews);
});

function getPromiseBookList() {
  return new Promise((resolve, reject) => {
      resolve(books);
  })
}

//using promise to get book list
public_users.get('/', function (req, res) {
  getPromiseBookList().then(
      (val) => res.send(JSON.stringify(val, null, 4)),
      (error) => res.send("denied")
  );
});
//Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.
public_users.get('/isbn/:isbn',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve("Promise Resolved. Getting book details for the requested isbn")
    },3000)})

    myPromise.then((successMessage) => {
        const isbn = req.params.isbn;
        res.send(books[isbn])
    })
 });
 //Add the code for getting the book details based on Author (done in Task 3) using Promise callbacks or async-await with Axios.

 function getFromAuthor(author) {
  let output = [];
  return new Promise((resolve, reject) => {
      for (var isbn in books) {
          let book_ = books[isbn];
          if (book_.author === author) {
              output.push(book_);
          }
      }
      resolve(output);
  })
}
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  getFromAuthor(author)
      .then(
          result => res.send(JSON.stringify(result, null, 4))
      );
});

//Add the code for getting the book details based on Title (done in Task 4) using Promise callbacks or async-await with Axios.
function getFromTitle(title) {
  let output = [];
  return new Promise((resolve, reject) => {
      for (var isbn in books) {
          let book_ = books[isbn];
          if (book_.title === title) {
              output.push(book_);
          }
      }
      resolve(output);
  })
}
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  getFromTitle(title)
      .then(
          result => res.send(JSON.stringify(result, null, 4))
      );
});

module.exports.general = public_users;
