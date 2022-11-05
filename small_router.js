const express = require('express');
const router = express.Router();
const fs = require('fs');

router.route('/')
    .get((req, res) => {
        res.status = 200;
        try {           
            fs.readFile("./MAP/export/map.json", "utf8", 
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