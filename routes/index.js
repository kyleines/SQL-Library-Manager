const express = require('express');
const router = express.Router();
const {Op} = require("sequelize");
const Book = require('../models').Book;

// Handler function to wrap each route.
asyncHandler = (callback) => {
  return async(req, res, next) => {
    try {
      await callback(req, res, next)
    } catch(error){
      next(error);
    }
  }
}

// Handler function for nav links
navHandler = (books) => {
  let pages = Math.ceil(books.length / 10);
  let navLinks = [];
  for (let i = 1; i <= pages; i++) {
    navLinks.push(i);
  }
  return navLinks;
}

// Home (redirects)
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books/page/1');
}));

router.get('/books', asyncHandler(async (req, res) => {
  res.redirect('/books/page/1');
}));

router.get('/books/page', asyncHandler(async (req, res) => {
  res.redirect('/books/page/1');
}));

// Book List
router.get('/books/page/:page', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  const offset = (req.params.page - 1) * 10;
  const displayBooks = await Book.findAll({offset, limit: 10, order: [["title", "ASC"]]});

  if (offset >= 0 && displayBooks.length > 0) {
    res.render('index', {books: displayBooks, title: 'Books', navLinks: navHandler(books)});
  } else {
    const error = new Error();
    error.status = 404;
    error.message = "Page not found";
    res.render('page-not-found', {error});
  }
  
}));

// New book form
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', {book: {}, title: 'New Book'});
}));

// Post new book to database
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books/page/1');
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('new-book', {book, errors: error.errors, title: 'New Book'});
    } else {
      throw error;
    }
  }
}));

// Search results
router.get('/books/results/:page/', asyncHandler(async (req, res) => {
  const searchValue = req.query.search;
  const searchQuery = {
    [Op.or]: [
      {title: {[Op.like]: `%${searchValue}%`}},
      {author: {[Op.like]: `%${searchValue}%`}},
      {genre: {[Op.like]: `%${searchValue}%`}},
      {year: {[Op.like]: `%${searchValue}%`}},
    ]
  }
  const offset = (req.params.page - 1) * 10;
  const books = await Book.findAll({where: searchQuery});
  const displayBooks = await Book.findAll({where: searchQuery, offset, limit: 10, order:[["title", "ASC"]]})
  res.render('results', {books: displayBooks, title: 'Search Results', navLinks: navHandler(books), searchValue})
}));

// Book details
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("update-book", {book, title: "Update Book"});
  } else {
    const error = new Error();
    error.status = 404;
    error.message = "Page not found";
    throw error;
  }
}));

// Update book details in database
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books/page/1');
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', {book, errors: error.errors, title: 'Update Book'})
    } else {
      throw error;
    }
  }
}));

// Delete a book
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books/page/1');
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;
