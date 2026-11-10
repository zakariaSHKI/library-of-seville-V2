const fs = require('fs');
const path = require('path');

const ORDERS_PATH = path.join(__dirname, 'orders.json');

let writeQueue = Promise.resolve();

function ensureFile() {
    if (!fs.existsSync(ORDERS_PATH)) {
        fs.writeFileSync(ORDERS_PATH, '[]');
    }
}

function getAll() {
    ensureFile();
    const raw = fs.readFileSync(ORDERS_PATH, 'utf-8');
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function saveOrder(order) {
    writeQueue = writeQueue.then(() => {
        ensureFile();
        const orders = getAll();
        orders.push(order);
        const tmp = ORDERS_PATH + '.tmp';
        fs.writeFileSync(tmp, JSON.stringify(orders, null, 2));
        fs.renameSync(tmp, ORDERS_PATH);
        return order;
    });
    return writeQueue;
}

module.exports = { getAll, saveOrder };
