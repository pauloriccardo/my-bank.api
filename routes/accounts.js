const fs = require('fs').promises;
const express = require('express');
const router = express.Router();

router.use(express.json());

router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(global.fileName, 'utf8');
        const jsonData = JSON.parse(data);
        delete jsonData.nextId;
        res.send(jsonData);
    } catch {
        res.status(404).send('Falha ao ler o arquivo');
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const data = await fs.readFile(global.fileName, 'utf8');
        const jsonData = JSON.parse(data);
        const found = jsonData.accounts.find((account) => account.id == id);
        if (found) res.send(found);
        res.status(404).send('Conta não encontrada');
    } catch {
        res.status(404).send('Erro na leitura do arquivo');
    }
});

router.post('/', async (req, res) => {
    let account = req.body;
    try {
        const data = await fs.readFile(global.fileName, 'utf8');
        const jsonData = JSON.parse(data);
        account = { id: jsonData.nextId++, ...account };
        jsonData.accounts.push(account);
        await fs.writeFile(global.fileName, JSON.stringify(jsonData));
        res.status(201).send('Adicionado conta ID ' + account.id);
    } catch {
        res.status(404).send('Erro na leitura do arquivo');
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const data = await fs.readFile(global.fileName, 'utf8');
        const jsonData = JSON.parse(data);
        const isExist = jsonData.accounts.some((account) => account.id == id);
        if (isExist) {
            const accounts = jsonData.accounts.filter((account) => account.id != id);
            jsonData.accounts = accounts;
            await fs.writeFile(global.fileName, JSON.stringify(jsonData));
            res.send('Removida a conta ID ' + id);
        }
        res.send('Conta não encontrada ID ' + id);
    } catch {
        res.status(404).send('Erro na leitura do arquivo');
    }
});

router.put('/', async (req, res) => {
    const newAccount = req.body;
    try {
        const data = await fs.readFile(global.fileName, 'utf8');
        const jsonData = JSON.parse(data);
        const oldIndex = jsonData.accounts.findIndex((account) => account.id == newAccount.id);
        if (oldIndex >= 0) {
            jsonData.accounts[oldIndex] = newAccount;
            await fs.writeFile(global.fileName, JSON.stringify(jsonData));
            res.send('Alterada a conta ID ' + newAccount.id);
        }
        res.status(404).send('Conta não encontrada');
    } catch {
        res.status(404).send('Erro na leitura do arquivo');
    }
});

module.exports = router;
