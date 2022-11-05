const express = require('express');
const router = express.Router();
const jsonParser = express.json();
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, '/models')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});

router.route('/')
    .post(multer({ storage: storage }).single('Picture'), jsonParser, (req, res) => {
        fs.writeFile('./export/map.json', JSON.stringify(req.body), (err) => {
            if (err) {
                res.status = 400;
                res.send('error to save');
                return;
            }
        });
        //    console.log(req.body);
        res.status = 200;
        res.send('Файл сохранён');
    })
    .get((req, res) => {
        res.status = 200;
        try {           
            fs.readFile("./export/map.json", "utf8", 
            function(error,data){
//                console.log("Асинхронное чтение файла");
                if(error) 
                {
                    res.status(400).send('Такого файла нет');
                    return;
                }; // если возникла ошибка
//                console.log(data);  // выводим считанные данные
                res.send(data);
            });
        }
        catch {
            console.log('ERROR');
            res.send('Не можем найти файл');
        }
    });

module.exports = router;