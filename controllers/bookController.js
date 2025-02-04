const express=require('express');
const bookRouter=express.Router();

const Book=require('../models/bookModel');
const {authMiddleware,adminMiddleware}=require('../middleware/authMiddleware');

// api to add book (admin)
bookRouter.post('/add-book',authMiddleware,adminMiddleware,async(req,res)=>{
    try{
        const {title,author,genre,description,imageUrl}=req.body;
        const bookExists=await Book.findOne({title});
        if(bookExists){
            return res.status(400).json({
                success:false,
                message:"Book already exists"
            })
        }
        const book=await Book.create({
            title,
            author,
            genre,
            description,
            imageUrl
        })
        await book.save();
        return res.status(200).json({
            success:true,
            message:"Book added successfully",
            book
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Book addition failed",
            error:err.message
        })
    }
})


// api to get all books (have filters)
bookRouter.get('/',authMiddleware,async(req,res)=>{
    try{
        // extracting 
        const {page=1,limit=10,sortBy='title',order='asc',genre,author}=req.query;
        // converting page into num
        const pageNumber=Number(page);
        const limitNumber=Number(limit);

        // for filter query
        const filter={};

        // filter based on genre and author
        if(genre){
            filter.genre=genre;
        }
        if(author){
            filter.author=author;
        }

        // sort object
        const sortObj={};
        sortObj[sortBy]=order==='desc'?1:-1;  // 1 for ascending and -1 for descending

        const books=await Book.find(filter)
        .sort(sortObj)
        .skip((pageNumber-1)*limitNumber)
        .limit(limitNumber)

        // count for no. of books for pagination
        const totalBooks=await Book.countDocuments(filter);

        return res.status(200).json({
            success:true,
            books:books,
            message:"Books fetched successfully",
            totalBooks,
            currentPage:pageNumber,
            totalPage:Math.ceil(totalBooks/limitNumber),
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Fetching books failed",
            error:err.message
        })
    }
})

// api to get single book
bookRouter.get('/:id',authMiddleware,async(req,res)=>{
    try{

        const book=await Book.findById(req.params.id);
        if(!book){
            return res.status(404).json({
                success:false,
                message:"Book not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Book fetched successfully",
            book
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Fetching book failed",
            error:err.message
        })
    }
})

// api to edit book
bookRouter.put('/:id/edit-book',authMiddleware,adminMiddleware,async(req,res)=>{
    try{
        const {title,author,genre,description,imageUrl}=req.body;
        const book=await Book.findById(req.params.id);
        book.title=title;
        book.author=author;
        book.genre=genre;
        book.description=description;
        book.imageUrl=imageUrl;
        if(!title || !author || !genre || !description || !imageUrl){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        await book.save();
        return res.status(200).json({
            success:true,
            message:"Book edited successfully",
            book
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Book edit failed",
            error:err.message
        })
    }
})

// api to delete book
bookRouter.delete('/:id/delete-book',authMiddleware,adminMiddleware,async(req,res)=>{
    try{
        await Book.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            success:true,
            message:"Book deleted successfully"
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Book deletion failed",
            error:err.message
        })
    }
})

module.exports=bookRouter;