const {initializeDatabase} = require("./db/db.connect")
const fs = require("fs");
const Books = require("./models/books.models");
const express = require("express");
const { error } = require("console");
const { json } = require("stream/consumers");
const app = express();
initializeDatabase();

const jsonData = fs.readFileSync("books.json", "utf-8");
const booksData = JSON.parse(jsonData)
app.use(express.json());




function seedData(){
    try {
        for(bookData of booksData ){
            const newBook = new Books({
                title: bookData.title,
                author: bookData.author,
                publishedYear: bookData.publishedYear,
                genre: bookData.genre,
                language: bookData.language,
                country: bookData.country,
                rating: bookData.rating,
                summary: bookData.summary,
                coverImageUrl: bookData.coverImageUrl
            })
            //console.log(newBook.title)
            newBook.save()
        }
    } catch (error) {
        console.log("Error seeding the data", error)
    }
}



//seedData()

// const theBook = {
//     "title": "Lean In",
//     "author": "Sheryl Sandberg",
//     "publishedYear": 2012,
//     "genre": ["Non-fiction", "Business"],
//     "language": "English",
//     "country": "United States",
//     "rating": 4.1,
//     "summary": "A book about empowering women in the workplace and achieving leadership roles.",
//     "coverImageUrl": "https://example.com/lean_in.jpg"
//   };
async function createBook(theBook){
     try {
        const book = new Books(theBook)

        const saveBook = await book.save()
        //console.log("New Book data:" , saveBook)
       return saveBook 
     } catch (error) {
        throw error
     }
}

//createBook(theBook)



app.post("/books", async (req, res) => {
    try {
       // console.log("New Book data:" , saveBook)
       //console.log(req.body)
        const letsSaveBook = await createBook(req.body)
        //console.log(req.body)
        res.status(200).json({message: "Book added successfully.",theBook: letsSaveBook})
        
    } catch (error) {
        res.status(500).json({error:"Failed to fetch books", error})
    }
      
} )


async function toGetAllBooks() {
    try {
        const allTheBooks = await Books.find()
        return allTheBooks
    } catch (error) {
        throw error
    }
    
}

app.get("/", async(req, res) => {
      try {
        const theActualAllBooks = await toGetAllBooks()
        if(theActualAllBooks.length !=0){
            res.status(200).json({message: "All the Books", allBooks : theActualAllBooks })
        }else{
            res.status(404).json({error: "No book found."})
        } 
        
      } catch (error) {
        res.status(500).json({error: "Failed to fetch the books", error})
      }
})

async function toGetBookDetailsByName(theTitle) {
    try {
        const theBookByTitle = await Books.findOne({title: theTitle} )
        return theBookByTitle
    } catch (error) {
        console.log(error)
    }
    
}

app.get("/books/:title", async(req, res) => {
    try {
        const finalBooksByTitle = await(toGetBookDetailsByName(req.params.title))
        if(finalBooksByTitle){
            res.status(200).json(finalBooksByTitle)
        }else{
            res.status(404).json({error: "No book found."})
        } 
        
    } catch (error) {
        res.status(500).json({error: "Failed to Fetch Books", error})
    }
})


async function toGetBooksByAuther(theAuther) {
    try {
        const booksByAuther = await Books.findOne({author: theAuther })
        return booksByAuther
    } catch (error) {
        console.log(error)
    }
}


app.get("/books/author/:author", async(req, res) => {
    try {
        const actualBookByAuther = await toGetBooksByAuther(req.params.author)
        if(actualBookByAuther){
            res.status(200).json(actualBookByAuther)
        }else{
            res.status(404).json({error: "Book not found.", error})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch books."})
    }
})

async function toGetBookReleasedInYear(releaseYear) {
    try {
        const theBookReleasedInYear = await Books.findOne({publishedYear: releaseYear })
        return theBookReleasedInYear
    } catch (error) {
        console.log(error)
    }
}


app.get("/books/publishedYear/:thepublishedYear", async(req, res) => {
    try {
        const theActualBookReleasedInYear = await toGetBookReleasedInYear(req.params.thepublishedYear)
        if(theActualBookReleasedInYear){
            res.status(202).json(theActualBookReleasedInYear)
        }else{
            res.status(404).json({error: "Book not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch Books", error})
    }
})

async function toUpdateRating(theBookId, dataToUpdate) {
    try {
        const perticularBookById = Books.findByIdAndUpdate(theBookId, dataToUpdate, {new: true} )
        return perticularBookById
    } catch (error) {
        console.log(error)
    }
}

app.post("/books/:thePerticularId", async(req, res) => {
     try {
        const letsUpdatePerticularIdRating = await toUpdateRating(req.params.thePerticularId, req.body)
        if(letsUpdatePerticularIdRating){
            res.status(200).json(letsUpdatePerticularIdRating)
        }else{
            res.status(404).json({error:"Book not found."})
        }
       
       
     }catch{
        res.status(500).json({error: "Failed to update rating."})
     }
})


async function toUpdateBooks(theBookTitle, updationData) {
    try {
        const updatedBook = await Books.findOneAndUpdate({title: theBookTitle}, updationData , {new : true})
        return updatedBook
    } catch (error) {
        console.log(error)
    }
}

app.post("/books/title/:perticularTitle", async(req, res) => {
    try {
        const actualUpdatedBookData = await toUpdateBooks(req.params.perticularTitle, req.body)
        //console.log(actualUpdatedBookData)
       // console.log(JSON.parse(req.params.perticularTitle))
        if(actualUpdatedBookData){
            res.status(200).json(actualUpdatedBookData)
        }else{
            res.status(404).json({error: "Book not found."})
        }
        

    } catch (error) {
        res.status(500).json({error: "Failed to fetch books", error})
    }
})



async function toDeleteTheBook(theBookId) {
    try {
        const perticularBookById = await Books.findByIdAndDelete(theBookId)
        return perticularBookById
    } catch (error) {
        console.log(error)
    }
    
}

app.delete("/books/:bookId", async(req, res) => {
    try {
        const actualToDeleteBook = await toDeleteTheBook(req.params.bookId)
        if(actualToDeleteBook){
            res.status(202).json({message: "Book deleted succesfully."})
        }else{
            res.status(404).json({error: "Book not found."})
        }

    } catch (error) {
        res.status(500).json({error: "Failed to delete Book"})
    }
})











const PORT = api-to-manage-book-data.vercel.app

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});






