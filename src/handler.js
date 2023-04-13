const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const{
            name
            year,  
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
    } = request.payload;

    if(!name){
        const response = h.response ({
            status: 'fail',
            message: 'Gagal menambahkan buku. Harap isi nama buku'
        });
        response.code(400);
        return response;
    }

    if(readPage > pageCount){
        const response = h.response ({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    };

    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    
    const (isSuccess) {
        const response = h.response ({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;    
    }

    const response = h.response ({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const {
        name,
        reading,
        finished,
    } = request.query;

    let filteredBooks = books;

    if (name) {
        filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (reading) {
        filteredBooks = filteredBooks.filter((book) => book.reading === Number(reading));
    }
    
    if (finished) {
        filteredBooks = filteredBooks.filter((book) => book.finished === Number(finished));
    }

    const response = h.response ({
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });

    response.code(200);
    return response;
};