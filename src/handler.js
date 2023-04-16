const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    try {
        const {
            name, year,
            author, summary,
            publisher, pageCount,
            readPage, reading
        } = request.payload;

        if (!name) {
            throw new Error('Gagal menambahkan buku. Mohon isi nama buku');
        }

        if (readPage > pageCount) {
            throw new Error('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount');
        }

        const id = nanoid(16);
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;
        const finished = pageCount === readPage;

        const newBook = {
            id,name,
            year,author,
            summary,publisher,
            pageCount,readPage,
            finished,reading,
            insertedAt,updatedAt
        };

        books.push(newBook);

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        });

        response.code(201);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: error.message
        });

        response.code(error.statusCode || 400);
        return response;
    }
};

const getAllBooksHandler = (request, h) => {
    const {
        name,
        reading,
        finished
    } = request.query;
    let filteredBooks = books;
    if (name) {
        filteredBooks = books.filter((bn) => bn.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (reading) {
        filteredBooks = books.filter((book) => Number(book.reading) === Number(reading));
    }
    if (finished) {
        filteredBooks = books.filter((book) => Number(book.finished) === Number(finished));
    }
    const response = h.response({
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }))
        }
    });

    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    try {
        const { id } = request.params;
        const book = books.find((b) => b.id === id);
        if (!book) {
            const response = h.response({
                status: 'fail',
                message: 'Buku tidak ditemukan'
            });
            response.code(404);
            return response;
        }
        return {
            status: 'success',
            data: {
                book
            }
        };
    } catch (error) {
        const response = h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server'
        });
        response.code(500);
        return response;
    }
};

const editBookByIdHandler = (request, h) => {
    try {
        const { id } = request.params;

        const {
            name, year,
            author, summary,
            publisher, pageCount,
            readPage, reading
        } = request.payload;

        const updatedAt = new Date().toISOString();
        const index = books.findIndex((book) => book.id === id);
        if (!name) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku'
            });
            response.code(400);
            return response;
        }
        if (readPage > pageCount) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
            });
            response.code(400);
            return response;
        }
        if (index !== -1) {
            const finished = pageCount === readPage;
            books[index] = {
                ...books[index],
                name,year,
                author,summary,
                publisher,pageCount,
                readPage,finished,
                reading,updatedAt
            };
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil diperbarui'
            });
            response.code(200);
            return response;
        }
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        });
        response.code(404);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'error',
            message: 'Terjadi server error'
        });
        response.code(500);
        return response;
    }
};

const deleteBookById = (request, h) => {
    try {
        const { id } = request.params;
        const index = books.findIndex((book) => book.id === id);
        if (index === -1) {
            const response = h.response({
                status: 'fail',
                message: 'Buku gagal dihapus. Id tidak ditemukan'
            });
            response.code(404);
            return response;
        }
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami'
        });
        response.code(500);
        return response;
    }
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookById
};
