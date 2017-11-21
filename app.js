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
    let classify = req.body.classify
    let filterbooks = books.filter(i => {
        if (classify == '全部') {
            if (i.bookName.indexOf(filters) > -1) {
                return true
            }
        } else {
            if (i.bookName.indexOf(filters) > -1 && i.classify == classify) {
                return true
            }
        }
    })
    let exportbook = filterbooks.slice(times * 100, times * 100 + 100)
    res.send(JSON.stringify(exportbook))
});

app.post('/savebook', function (req, res) {
    let member = req.body.member
    fs.readFile('./static/selectedbook.json', 'utf8', function (err, data) {
        if (err) console.log(err);
        data = JSON.parse(data);
        let note = {}
        note['time'] = new Date().getTime()
        note['books'] = JSON.parse(req.body.books)
        data.push(note)
        fs.writeFileSync('./static/selectedbook.json', JSON.stringify(data))
        res.send('ok')
    });
});

// app.post('/isexist', function (req, res) {
//     let member = req.body.member
//     fs.readFile('./static/selectedbook.json', 'utf8', function (err, data) {
//         if (err) console.log(err);
//         data = JSON.parse(data);
//         if (!data[member]) {
//             res.send('ok')
//         } else {
//             res.send('exist')
//         }
//     });
// });

app.post('/statistic', function (req, res) {
    let start = req.body.start
    let end = req.body.end
    fs.readFile('./static/selectedbook.json', 'utf8', function (err, data) {
        if (err) console.log(err);
        data = JSON.parse(data);
        let times = 0
        let subscribedata = {}
        data.map(i => {
            let booktime = Number(i.time)
            if (booktime >= start && booktime <= end) {
                times++
                i.books.map(book => {
                    book.subscribeCode
                    if (!subscribedata[book.subscribeCode]) {
                        book['times'] = 1
                        subscribedata[book.subscribeCode] = book
                    } else {
                        subscribedata[book.subscribeCode]['times'] += 1
                    }
                })
            }
        })
        subscribedata.times = times
        res.send(JSON.stringify(subscribedata))
    });
});