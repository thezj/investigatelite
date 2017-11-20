var express = require('express');
var fs = require('fs');
var app = express();
app.use(express.static('./static'))

var server = app.listen(3000);
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: false
}));

app.post('/postdate', function (req, res) {

});

var rf = require("fs");
let books = require('./book.js').books
app.post('/getbook', function (req, res) {
    let times = Number(req.body.gettime)
    let filters = req.body.filter
    let filterbooks = books.filter(i => {
        return i.bookname.indexOf(filters) > -1
    })
    let exportbook = filterbooks.slice(times * 100, times * 100 + 100)
    res.send(JSON.stringify(exportbook))
});

app.post('/savebook', function (req, res) {
    let member = req.body.member
    fs.readFile('./static/selectedbook.json', 'utf8', function (err, data) {
        if (err) console.log(err);
        data = JSON.parse(data);
        data[member] = {}
        data[member]['time'] = new Date().getTime()
        data[member]['books'] = JSON.parse(req.body.books)
        fs.writeFileSync('./static/selectedbook.json', JSON.stringify(data))
        res.send('ok')
    });
});