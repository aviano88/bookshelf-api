const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const{
            "name": string,
            "year": number,
            "author": string,
            "summary": string,
            "publisher": string,
            "pageCount": number,
            "readPage": number,
            "readPage": number,
            "reading": boolean,
    } = request.payload;