const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, 'booksStore.json');

// Serializes all mutations to prevent concurrent-write data loss
let writeQueue = Promise.resolve();

function readStore() {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    return JSON.parse(raw);
}

function writeStore(data) {
    const tmp = STORE_PATH + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
    fs.renameSync(tmp, STORE_PATH);
}

function getAll() {
    const store = readStore();
    return store.books;
}

function getById(id) {
    const books = getAll();
    return books.find((b) => b.id === Number(id));
}

function createBook(payload) {
    writeQueue = writeQueue.then(() => {
        const store = readStore();
        const now = new Date().toISOString();
        const book = {
            id: store.nextId++,
            title: String(payload.title || '').trim(),
            author: String(payload.author || '').trim(),
            year: payload.year !== undefined && payload.year !== null ? String(payload.year).trim() : '',
            summary: String(payload.summary || '').trim(),
            coverUrl: payload.coverUrl ? String(payload.coverUrl).trim() : '',
            createdAt: now,
            updatedAt: now
        };
        store.books.push(book);
        writeStore(store);
        return book;
    });
    return writeQueue;
}

function updateBook(id, payload) {
    writeQueue = writeQueue.then(() => {
        const store = readStore();
        const idx = store.books.findIndex((b) => b.id === Number(id));
        if (idx === -1) return null;
        const now = new Date().toISOString();
        const existing = store.books[idx];
        store.books[idx] = {
            ...existing,
            ...payload,
            year: payload.year !== undefined ? String(payload.year).trim() : existing.year,
            id: existing.id,
            createdAt: existing.createdAt,
            updatedAt: now
        };
        writeStore(store);
        return store.books[idx];
    });
    return writeQueue;
}

function deleteBook(id) {
    writeQueue = writeQueue.then(() => {
        const store = readStore();
        const idx = store.books.findIndex((b) => b.id === Number(id));
        if (idx === -1) return false;
        store.books.splice(idx, 1);
        writeStore(store);
        return true;
    });
    return writeQueue;
}

module.exports = { getAll, getById, createBook, updateBook, deleteBook };
