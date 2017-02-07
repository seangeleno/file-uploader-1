/*our includes*/
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

/*configure multer*/
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});

const upload = multer({storage: storage}).single('photo');

/*setup some express middleware*/
app.set('view engine', 'ejs');
app.set('views', __dirname);

/*lets make our API fams*/
app.get('/', function (req, res) {

    const files = fs.readdirSync(__dirname + '/uploads');
    res.render('index', {files: files})
});

app.post('/api/photo', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err)
            return res.end('error uploading file')
        }
    })
    res.redirect('/')
});

app.get('/api/photo/:id', function (req, res) {
    res.sendFile(__dirname + '/uploads/' + req.params.id)
});

app.get('/photo/:id', function (req, res) {
    res.send("<img src='/api/photo/" + req.params.id + "'></img>")
});

/*now run our code*/
app.listen(port, function () {
    console.log("oh yeah, console logging it! Head on over to port " + port + " for more information.");
});
