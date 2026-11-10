const fs = require('fs');
const path = require('path');

const CONTACTS_PATH = path.join(__dirname, 'contacts.json');

let writeQueue = Promise.resolve();

function ensureFile() {
    if (!fs.existsSync(CONTACTS_PATH)) {
        fs.writeFileSync(CONTACTS_PATH, '[]');
    }
}

function getAll() {
    ensureFile();
    const raw = fs.readFileSync(CONTACTS_PATH, 'utf-8');
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function saveContact(entry) {
    writeQueue = writeQueue.then(() => {
        ensureFile();
        const contacts = getAll();
        contacts.push(entry);
        const tmp = CONTACTS_PATH + '.tmp';
        fs.writeFileSync(tmp, JSON.stringify(contacts, null, 2));
        fs.renameSync(tmp, CONTACTS_PATH);
        return entry;
    });
    return writeQueue;
}

module.exports = { getAll, saveContact };
