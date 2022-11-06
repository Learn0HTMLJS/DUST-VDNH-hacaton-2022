const express = require('express');
const app = express();
var fs = require('fs');
const multer = require('multer');
const cors = require('cors');

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/styles'));
app.use(express.static(__dirname + '/MAP'));
app.use(express.static(__dirname + '/Client_JS'));

const jsonParser = express.json();

const ImageStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/public/Places/');
    },
    filename: function (req, file, callback) {
        callback(null, req.body.name);//req.body.name + 
    }
});
const imageFilter = function (req, file, cb) {
    // Принимать только изображения
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Разрешены только файлы изображений!';
        return cb(new Error('Разрешены только файлы изображений!'), false);
    }
    cb(null, true);
};

app.listen(3000, function () { console.log("порт 3000"); });

const models = require('./small_router');
app.use('/api/models', models);

app.get("/", function (req, res) {
    console.log("здрасте");
    res.sendFile(__dirname + "\\index.html");
});

app.get("/events", function (req, res) {
    console.log("здрасте4");
    res.sendFile(__dirname + "\\index4.html");
});

app.get("/indi-route", function (req, res) {
    console.log("здрасте");
    res.sendFile(__dirname + "\\indi-route.html");
});

app.get("/joy", function (req, res) {
    console.log("здрасте2");
    res.sendFile(__dirname + "\\index2.html");
});

app.get("/dist", function (req, res) {
    console.log("здрасте2");
    res.sendFile(__dirname + "\\indexa.html");
});

app.get("/point", function (req, res) {
    console.log("здрасте3");
    res.sendFile(__dirname + "\\index3.html");
});

app.post("/calc", function (req, res) {
    let DATA = req.body;
    /*
    DATA.type = тип
    */
});

app.use(express.static(__dirname + "/public"));

const filePath = "distance.json";
const joyPath = "joy.json";
const pointsPath = "points.json";
const eventsPath = "events.json";

app.get("/api/points", function (req, res) {

    const content = fs.readFileSync(pointsPath, "utf8");
    const users = JSON.parse(content);
    res.send(users);
});

app.get("/api/users", function (req, res) {

    const content = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(content);
    res.send(users);
});

app.get("/api/joys", function (req, res) {

    const content = fs.readFileSync(joyPath, "utf8");
    const users = JSON.parse(content);
    res.send(users);
});

// получение одной точки по id
app.get("/api/points/did/:id", function (req, res) {

    const id = req.params.id; // получаем id
    const content = fs.readFileSync(pointsPath, "utf8");
    const users = JSON.parse(content);
    let user = null;
    // находим в массиве пользователя по id
    for (var i = 0; i < users.length; i++) {
        if (users[i].did == id) {
            user = users[i];
            break;
        }
    }
    // отправляем пользователя
    if (user) {
        res.send(user);
    }
    else {
        res.status(404).send();
    }
});

// получение одного пользователя по id
app.get("/api/users/:id", function (req, res) {

    const id = req.params.id; // получаем id
    const content = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(content);
    let user = null;
    // находим в массиве пользователя по id
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            user = users[i];
            break;
        }
    }
    // отправляем пользователя
    if (user) {
        res.send(user);
    }
    else {
        res.status(404).send();
    }
});

// получение одноЙ ТОЧКИ по id
app.get("/api/points/:id", function (req, res) {

    const id = req.params.id; // получаем id
    const content = fs.readFileSync(pointsPath, "utf8");
    const users = JSON.parse(content);
    let user = null;
    // находим в массиве пользователя по id
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            user = users[i];
            break;
        }
    }
    // отправляем пользователя
    if (user) {
        res.send(user);
    }
    else {
        res.status(404).send();
    }
});

// получение отправленных данных
app.post("/api/users", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const userName = req.body.name;
    const userconn = req.body.conn;
    const userLen = req.body.len;
    const userInfo = req.body.info;

    // DISTANCE
    let data = fs.readFileSync(filePath, "utf8");
    let users = JSON.parse(data);
    let id = Math.max.apply(Math, users.map(function (o) { return o.id; }))
    if (id == null || id == undefined || isNaN(id)) id = -1;
    let lastid = id;
    var conns = userconn.split(',');
    let lens = userLen.split(',');

    for (let k = 0; k < conns.length; k++) {
        user = { name: userName, conn: conns[k], len: lens[k] };
        id++;
        user.id = id;
        users.push(user);
    }
    data = JSON.stringify(users);
    fs.writeFileSync(filePath, data);

    // JOY
    data = fs.readFileSync(joyPath, "utf8");
    users = JSON.parse(data);
    conns = userconn.split(',');

    for (let k = 0; k < conns.length; k++) {
        lastid++;
        user = { id: lastid, name: userName, conn: conns[k], len: 0 };
        users.push(user);
    }
    data = JSON.stringify(users);
    fs.writeFileSync(joyPath, data);

    res.send(user);
});

// удаление пользователя по id
app.delete("/api/users/:id", function (req, res) {

    const id = req.params.id;
    let data = fs.readFileSync(filePath, "utf8");
    let users = JSON.parse(data);
    let data2 = fs.readFileSync(joyPath, "utf8");
    let users2 = JSON.parse(data2);
    let index = -1;
    // находим индекс пользователя в массиве
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            index = i;
            break;
        }
    }
    if (index > -1) {
        // удаляем пользователя из массива по индексу
        let user = users.splice(index, 1)[0];
        data = JSON.stringify(users);
        fs.writeFileSync(filePath, data);

        user = users2.splice(index, 1)[0];
        data2 = JSON.stringify(users2);
        fs.writeFileSync(joyPath, data2);
        // отправляем удаленного пользователя
        res.send(user);
    }
    else {
        res.status(404).send();
    }
});

// УДАЛЕНИЕ ТОЧКИ
app.delete("/api/points/:id", function (req, res) {

    const id = req.params.id;
    let data = fs.readFileSync(pointsPath, "utf8");
    let users = JSON.parse(data);
    let index = -1;
    let name;
    // находим индекс пользователя в массиве
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            name = users[i].name;
            index = i;
            break;
        }
    }
    if (index > -1) {
        // удаляем пользователя из массива по индексу
        let user = users.splice(index, 1)[0];
        data = JSON.stringify(users);
        fs.writeFileSync(pointsPath, data);

        data = fs.readFileSync(eventsPath, "utf8");
        users = JSON.parse(data);
        users = users.filter(x => x.name != name);
        data = JSON.stringify(users);
        fs.writeFileSync(eventsPath, data);

        res.send(user);
    }
    else {
        res.status(404).send();
    }
});

// изменение пользователя
app.put("/api/users", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const userId = req.body.id;
    const userName = req.body.name;
    const userconn = req.body.conn;
    const userLen = req.body.len;
    const userInf = req.body.info;

    let data = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(data);
    let user;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == userId) {
            user = users[i];
            break;
        }
    }
    // изменяем данные у пользователя
    if (user) {
        user.conn = userconn;
        user.name = userName;
        user.len = userLen;
        user.info = userInf;
        data = JSON.stringify(users);
        fs.writeFileSync(filePath, data);
        res.send(user);
    }
    else {
        res.status(404).send(user);
    }
});

// ИЗМЕНЕНИЕ ТОЧКИ
app.put("/api/points", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const userId = req.body.id;
    const userName = req.body.name;
    const userconn = req.body.coord;
    const userLen = req.body.link;
    const userInf = req.body.info;

    let data = fs.readFileSync(pointsPath, "utf8");
    const users = JSON.parse(data);
    let user;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == userId) {
            user = users[i];
            break;
        }
    }
    // изменяем данные у пользователя
    if (user) {
        user.coord = userconn;
        user.name = userName;
        user.link = userLen;
        user.info = userInf;
        data = JSON.stringify(users);
        fs.writeFileSync(pointsPath, data);
        res.send(user);
    }
    else {
        res.status(404).send(user);
    }
});

app.post("/retgr", jsonParser, function (req, res) {
    console.log(req.body);
    let C = CalculateEasy(req.body.From, req.body.To, req.body.MaxCount, LoadDistance());
    let R = CheckJoy(C);
    function mycomparator(b, a) { return parseInt(a.joy) - parseInt(b.joy); }
    R = R.sort(mycomparator).slice(0, req.body.Count);
    console.log(R);
    res.send(JSON.stringify(R));
    //console.log("найдено: " + C + ", " + C.length);
});

app.post("/setj", jsonParser, function (req, res) {
    ChangeJoy(req.body.Path, req.body.Change);
    console.log("изменена радость: " + req.body.Path);
    res.sendStatus(200);
});

app.post("/knn", jsonParser, function (req, res) {
    let result = knn.predict(req.body.JoyArray);
    console.log(result.label);
    KNN_Data.labels.push(result.label);
    KNN_Data.data.push(req.body.JoyArray);
});

// Новая точка
app.post("/newpoint", function (req, res) {
    let upload = multer({ storage: ImageStorage, fileFilter: imageFilter }).single('Photo');
    upload(req, res, function (err) {
        if (req.fileValidationError) {
            return res.send(`{"status":"1"}`);
        }
        else if (err instanceof multer.MulterError) {
            return res.send(`{"status":"2"}`);
        }
        else if (err) {
            return res.send(`{"status":"3","data":"` + err + `"}`);
        }
        let data = fs.readFileSync(pointsPath, "utf8");
        let points = JSON.parse(data);


        let id = Math.max.apply(Math, points.map(function (o) { return o.id; }))
        if (id == null || id == undefined || isNaN(id)) id = -1;
        id++;
        let user = { id: id, name: req.body.name, coord: req.body.conn, info: req.body.info, link: req.body.len };
        points.push(user);
        data = JSON.stringify(points);
        fs.writeFileSync(pointsPath, data);
        res.send(user);
    });
});

// Добавить оценку
app.post("/newmark", jsonParser, function (req, res) {
    console.log("новая оценка: " + req.body);
    let content = fs.readFileSync("events.json", "utf8");
    let users = JSON.parse(content);
    users.push({ name: req.body.name, vector: req.body.vector, mark: Number(req.body.mark) });
    let data = JSON.stringify(users);
    fs.writeFileSync("events.json", data);
    res.sendStatus(200);
});

app.post("/find_event", jsonParser, function (req, res) {
    let content = fs.readFileSync("events.json", "utf8");
    let events = JSON.parse(content);
    function comparator(a, b) {
        let f = 0;
        for (let i = 0; i < a.vector.length; i++) f += Math.pow(req.body.vec[i] - b.vector[i], 2);
        f = Math.sqrt(f);
        let g = 0;
        for (let i = 0; i < a.vector.length; i++) g += Math.pow(req.body.vec[i] - a.vector[i], 2);
        g = Math.sqrt(g);
        return f - g;
    }
    events = events.sort(comparator).reverse();
    let result = [];
    console.log(events);
    console.log(req.body);
    for (let i = 0; i < events.length; i++) {
        if (events[i].mark >= req.body.mark) {
            console.log(events[i].name + i);
            let b = true;
            for (let j = 0; j < result.length; j++) {
                if (result[j].name == events[i].name) {
                    b = false;
                    break;
                }
            }
            if (b) result.push(events[i]);
        }
        if (result.length == req.body.count) break;
    }
    res.send(JSON.stringify(result));
});

class KNN {

    distance = (a, b) => Math.sqrt(
        a.map((aPoint, i) => b[i] - aPoint)
            .reduce((sumOfSquares, diff) => sumOfSquares + (diff * diff), 0)
    );

    constructor(k = 1, data, labels) {
        this.k = k;
        this.data = data;
        this.labels = labels;
    }

    generateDistanceMap(point) {

        const map = [];
        let maxDistanceInMap;

        for (let index = 0, len = this.data.length; index < len; index++) {

            const otherPoint = this.data[index];
            const otherPointLabel = this.labels[index];
            const thisDistance = this.distance(point, otherPoint);

            /*
             * Держите не более k предметов на карте.
             * Гораздо эффективнее для больших наборов, потому что это
             * позволяет избежать хранения и последующей сортировки карты с миллионом элементов.
             * Это добавляет еще много операций сортировки, но, надеюсь, k невелико.
             */
            if (!maxDistanceInMap || thisDistance < maxDistanceInMap) {

                // Добавляйте элемент только в том случае, если он ближе, чем самый дальний из кандидатов
                map.push({
                    index,
                    distance: thisDistance,
                    label: otherPointLabel
                });

                // Отсортируйте карту так, чтобы ближайший был первым
                map.sort((a, b) => a.distance < b.distance ? -1 : 1);

                // Если карта стала слишком длинной, бросьте самый дальний предмет
                if (map.length > this.k) {
                    map.pop();
                }

                // Обновите это значение для следующего сравнения
                maxDistanceInMap = map[map.length - 1].distance;

            }
        }


        return map;
    }

    predict(point) {

        const map = this.generateDistanceMap(point);
        const votes = map.slice(0, this.k);
        const voteCounts = votes
            // Сводится к объекту типа {label: voiceCount}
            .reduce((obj, vote) => Object.assign({}, obj, { [vote.label]: (obj[vote.label] || 0) + 1 }), {})
            ;
        const sortedVotes = Object.keys(voteCounts)
            .map(label => ({ label, count: voteCounts[label] }))
            .sort((a, b) => a.count > b.count ? -1 : 1)
            ;

        return {
            label: sortedVotes[0].label,
            voteCounts,
            votes
        };

    }

}

let KNN_Data = {
    data: [
        [10, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 10, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 10, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 10, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 10, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 10, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 10, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 10, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 10, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 10]
    ],

    labels: [
        "Sport",
        "Photo",
        "Reading",
        "Journey",
        "History",
        "Interesting",
        "Entertainment",
        "Robots",
        "Child",
        "Other"
        /*
        спорт
        фотография
        чтение
        путешествия
        история
        познавательное
        развлечения
        робототехника
        детское
        другое
        */
    ]
};

const dijkstra = (edges, source, target) => {
    const Q = new Set(),
        prev = {},
        dist = {},
        adj = {}

    const vertex_with_min_dist = (Q, dist) => {
        let min_distance = Infinity,
            u = null

        for (let v of Q) {
            if (dist[v] < min_distance) {
                min_distance = dist[v]
                u = v
            }
        }
        return u
    }

    for (let i = 0; i < edges.length; i++) {
        let v1 = edges[i][0],
            v2 = edges[i][1],
            len = edges[i][2]

        Q.add(v1)
        Q.add(v2)

        dist[v1] = Infinity
        dist[v2] = Infinity

        if (adj[v1] === undefined) adj[v1] = {}
        if (adj[v2] === undefined) adj[v2] = {}

        adj[v1][v2] = len
        adj[v2][v1] = len
    }

    dist[source] = 0

    while (Q.size) {
        let u = vertex_with_min_dist(Q, dist),
            neighbors = Object.keys(adj[u]).filter(v => Q.has(v)) //Neighbor still in Q

        Q.delete(u)

        if (u === target) break //Break when the target has been found

        for (let v of neighbors) {
            let alt = dist[u] + adj[u][v]
            if (alt < dist[v]) {
                dist[v] = alt
                prev[v] = u
            }
        }
    }

    {
        let u = target,
            S = [u],
            len = 0

        while (prev[u] !== undefined) {
            S.unshift(prev[u])
            len += adj[u][prev[u]]
            u = prev[u]
        }
        return [S, len]
    }
}

let JoyGraph = [];
function LoadJoy() {
    var JSON_GRAPH = JSON.parse(fs.readFileSync('joy.json', 'utf8'));
    for (let i = 0; i < JSON_GRAPH.length; i++) {
        JoyGraph.push({ id: JSON_GRAPH[i].id, name: JSON_GRAPH[i].name, conn: JSON_GRAPH[i].conn, len: JSON_GRAPH[i].len });
    }
    console.log(JoyGraph);
}

function LoadDistance() {
    let graph = [];
    let JSON_GRAPH = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (let i = 0; i < JSON_GRAPH.length; i++) {
        graph.push([JSON_GRAPH[i].name, JSON_GRAPH[i].conn, JSON_GRAPH[i].len]);
    }
    console.log(graph);
    return graph;
}

function CheckJoy(arr) {
    let array = [];
    for (let i = 0; i < arr.length; i++) {
        let L = 0;
        for (let j = 0; j < arr[i].length - 1; j++) {
            for (let k = 0; k < JoyGraph.length; k++) {
                //console.log("цикл " + JoyGraph[k].name + " " + arr[i]);
                if ((JoyGraph[k].name == arr[i][j] && JoyGraph[k].conn == arr[i][j + 1])
                    || (JoyGraph[k].name == arr[i][j + 1] && JoyGraph[k].conn == arr[i][j])
                ) {
                    //console.log(JoyGraph[k].len);
                    L += JoyGraph[k].len;
                }
            }
        }
        array.push({ path: arr[i], joy: L });
    }
    return array;
}

function ChangeJoy(arr, N) {
    for (let j = 0; j < arr.length - 1; j++) {
        for (let k = 0; k < JoyGraph.length; k++) {
            if ((JoyGraph[k].name == arr[j] && JoyGraph[k].conn == arr[j + 1])
                || (JoyGraph[k].name == arr[j + 1] && JoyGraph[k].conn == arr[j])
            ) {
                JoyGraph[k].len += Number(N);
            }
        }
    }
    data = JSON.stringify(JoyGraph);
    fs.writeFileSync(joyPath, data);
}

function CalculateEasy(from, to, maxcount, graph) {
    let arr = [];
    for (let i = 0; i < maxcount; i++) {
        let [path, length] = dijkstra(graph, from, to);

        //console.log(path);

        let b = false;
        for (let j = 0; j < arr.length; j++) {
            if (arr[j].toString() == path.toString()) {
                b = true;
                break;
            }
        }
        if (!b) {
            //console.log("совпадений нет: " + path);
            arr.push(path);
        }

        for (let j = 0; j < path.length - 1; j++) {
            for (let k = 0; k < graph.length; k++) {
                if ((graph[k][0] == path[j] && graph[k][1] == path[j + 1])
                    ||
                    (graph[k][1] == path[j] && graph[k][0] == path[j + 1])
                ) graph[k][2] += length / path.length;
            }
        }

    }
    return arr;
}

LoadJoy();
let knn = new KNN(5, KNN_Data.data, KNN_Data.labels);

/*

1. плотность пешеходного и транспортного трафика реал-тайм - 1.1 тепловой карты
2. покупка билетов (ссылка на сайт)
3. анкетирование
6. фильтрация

*/

/*
// Из тела запроса
if (req.body.id == 0){
    let id = AddTempUser(req.body.vec);
}
else{
    
}

let Sessions = new Map();

function AddTempUser(vec){
    let id;
    do{
        id = getRandomInt(10000);
    }
    while (Sessions.has(id));
    Sessions.set(id, {
        vector: vec
    });
    return id;
}

function getRandomInt(max) { return Math.floor(Math.random() * max); }
*/