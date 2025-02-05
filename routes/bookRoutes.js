const express=require('express');
const bookRouter=express.Router();
const {authMiddleware,adminMiddleware}=require('../middleware/authMiddleware');
const {addBook,getAllBooks,getBook,editBook,deleteBook}=require('../controllers/bookController');

// api to add book (admin)
bookRouter.post('/add-book',authMiddleware,adminMiddleware,addBook);

// api to get all books (have filters)
bookRouter.get('/',authMiddleware,getAllBooks);

// api to get single book
bookRouter.get('/:id',authMiddleware,getBook);

// api to edit book
bookRouter.put('/:id/edit-book',authMiddleware,adminMiddleware,editBook);

// api to delete book
bookRouter.delete('/:id/delete-book',authMiddleware,adminMiddleware,deleteBook);

module.exports=bookRouter;


