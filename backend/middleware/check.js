const fs = require('fs');
const path = require('path');

const pathTodo = path.join(__dirname, '../todos.json');
const file = fs.readFileSync(pathTodo, 'utf-8');
const data = JSON.parse(file);

const checkExistId = (req, res, next) => {
    const { id } = req.params;
    let index = data.findIndex(e => e.id == id);
    if (index == -1) {
        res.status(400).json({
            message: 'Todo not found',
        })
    } else {
        next();
    }
}

const checkExistTitle = (req, res, next) => {
    const { title } = req.body;
    let exist = data.find(e => e.title == title);
    if (exist) {
        res.status(400).json({
            message: 'Todo already exist',
        })
    } else {
        next();
    }
}
module.exports = {
    checkExistId,
    checkExistTitle
}