const fs = require('fs').promises;
const express = require('express');
const winston = require('winston');
const accountsRoute = require('./routes/accounts.js');
const app = express();
app.use('/account', accountsRoute);
global.fileName = 'accounts.json';

//Registro de log
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`;
});
global.logger = winston.createLogger({
    level: 'silly',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'my-bank-api.log' }),
    ],
    format: combine(label({ label: 'my-bank-api' }), timestamp(), myFormat),
});

app.listen(3000, async () => {
    try {
        await fs.readFile(global.fileName, 'utf8');
        logger.info('API start');
    } catch {
        const startJson = { nextId: 1, accounts: [] };
        await fs.appendFile(global.fileName, JSON.stringify(startJson));
        logger.error('Arquivo não encontrado, criando arquivo accounts.json');
    }
});
