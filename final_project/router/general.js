const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let doesExist = require("./auth_users.js").doesExist;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  return await res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;

  if(books[isbn]){
    return await res.send(books[isbn]);
  }
  
  else {
    return await res.status(300).json({message: "No book with matching isbn found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  let author = req.params.author;

  let authorBooks = [];

  for (let book in books) {
    if (books[book].author === author) {
      authorBooks.push(books[book]);   
    }
  }

  if(authorBooks.length > 0){
    return await res.send(authorBooks);
  }
  
  else {
    return await res.status(300).json({message: "No book with matching author found"});
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  let title = req.params.title;

  for (let book in books) {
    if (books[book].title === title) {
      return await res.send(books[book]);   
    }
  }

  return await res.status(300).json({message: "No book with matching title found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;

  if(books[isbn]){
    return res.send(books[isbn].reviews);
  }
  
  else {
    return res.status(300).json({message: "No book with matching isbn found"});
  }
});

module.exports.general = public_users;
