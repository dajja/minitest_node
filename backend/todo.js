var express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');

const { checkExistId, checkExistTitle } = require("./middleware/check.js");
const pathTodo = path.join(__dirname, './todos.json');
const file = fs.readFileSync(pathTodo, 'utf-8');
const data = JSON.parse(file);

// get all
router.get('/', (req, res) => {
    const { per_page } = req.query;
    const takeData = data.slice(0, per_page);
    res.status(200).json({
        message: 'ok',
        data: takeData
    })
})

// get one
router.get('/:id', checkExistId, (req, res) => {
    let { id } = req.params;
    let todoById = data.find(e => e.id == id);
    res.status(200).json({
        message: 'ok',
        data: todoById
    })
})

// them moi todos
router.post('/', checkExistTitle, (req, res) => {
    data.unshift(req.body);
    fs.writeFileSync(pathTodo, JSON.stringify(data))
    res.status(201).json({
        message: 'Create successfully',
        data: data
    })
})

// sua todo
router.put('/:id', checkExistId, (req, res) => {
    let { id } = req.params;
    let index = data.findIndex(e => e.id == id);
    data.splice(index, 1, req.body);
    fs.writeFileSync(pathTodo, JSON.stringify(data))
    res.status(200).json({
        message: 'Update successfully',
        data: data
    })
})

// xoa todo
router.delete('/:id', checkExistId, (req, res) => {
    let { id } = req.params;
    let index = data.findIndex(e => e.id == id);
    data.splice(index, 1);
    fs.writeFileSync(pathTodo, JSON.stringify(data))
    res.status(200).json({
        message: 'Delete successfully',
        data: data
    })
})

// xoa het todo
router.delete("/", (req, res) => {
    data.length = 0;
    fs.writeFileSync(pathTodo, JSON.stringify(data))
    res.status(200).json({
        message: 'Clear successfully',
        data: data
    })
})
module.exports = router;