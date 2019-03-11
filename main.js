var node_datetime = require("node-datetime");
var datetime = node_datetime.create();
datetime.format("m/d/Y H:M:S");
console.log(new Date(datetime.now()));
/*----------------------------------------------------------------*/
var mysql = require("mysql");
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "hethongnhung"
});

/*
* @ Function connect to mysql server
* */
function mysql_connect(){
    con.connect(function(err){
        if(err)
            throw err;
        console.log("Connected to MySQL server!!!");
    });
}

/*
* @ Function query to mysql server
* */
function mysql_query(sql, callback){
    con.query(sql, function(err, result, fields){
        if(err)
            throw err;
        return callback(result);
    });
}

/*
* @ Function close connectiong with mysql server
* */
function mysql_close(){
    con.end();
    console.log("Disconnected");
}


mysql_connect();

/*---------------------------------------------------------------------------*/

var express = require("express"),
    app = express();

const bodyParser = require("body-parser");

app.use(bodyParser());

app.use('/pages', express.static(__dirname + "/pages"));

app.get('/',function(req, res){
    res.sendfile(__dirname + '/pages/index.html');
});

app.get('/debug', function (req, res) {
    res.sendfile(__dirname + '/pages/debug.html');
});

app.post('/api', function(req, res){

    console.log(req.body);
    if(req.body.username==undefined || req.body.password==undefined || req.body.loc==undefined  || req.body.loc.lat==undefined || req.body.loc.lng==undefined)
    {
        res.send("{status: 0}");
        return;
    }

    mysql_query("SELECT password FROM user WHERE username='" + req.body.username + "'", function (callback) {
       if(callback.length==0)
       {
           res.send("{status: 0}");
           return;
       }

       if(req.body.password==callback[0].password)
       {
           mysql_query("INSERT INTO locations(username, lat, lng, time) VALUES('" + req.body.username + "'," + req.body.loc.lat + "," + req.body.loc.lng + ",'" )
           res.send("{status: 1}");
       }
       else
           res.send("{status: 0}");

        console.log(callback);
    });




});


var server = require("http").createServer(app).listen(8888, function(){
    console.log("Server Running.....\nListening : localhost:8888");
});

var io = require("socket.io").listen(server);

io.sockets.on("connection", function (socket) {
    console.log(socket.id + " connected");

    socket.on("disconnect", function () {
        console.log(socket.id + "disconnect");
    });

});


/*-------------------------------------------*/
/*
* @Test area
* */

// setInterval(function () {
//     mysql_query("SELECT id FROM user WHERE username='phanhien'", function (callback) {
//         console.log(callback);
//     });
// }, 2000);