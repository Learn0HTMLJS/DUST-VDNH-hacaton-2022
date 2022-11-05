const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jsonParser = express.json();
//const multer = require('multer');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/', express.static('client'));
app.use('/BABYLON', express.static('BABYLON'));
app.use('/models', express.static('models'));
app.use('/export', express.static('export'));

const models = require('./small_router');
app.use('/api/models', models);

/*const fileFilter = (req, file, cb) => {
    if (file.mimetype === "stl") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}*/

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.HTML');
});

//const jsonParser = express.json();
//app.use(bodyParser.urlencoded());
/*
app.post('/api/models', jsonParser, function (req, res) {
    console.log(req.body['SceneWidtch']);
    res.status = 200;
    res.send(req.body);
});*/

app.listen(3000, '127.0.0.1', () => {
    console.log('порт 3000');
});
