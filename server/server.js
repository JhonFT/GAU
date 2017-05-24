var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', "POST, GET, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var mysql = require('mysql'),
  connection = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'gau'
    }
  );



var userModel = {};

userModel.getUser = function (credencial, callback) {
  if (connection) {
    var sql = "SELECT * FROM usuarios WHERE email = '" + credencial.email + "' AND clave = '" + credencial.contraseña + "'";
    console.log(sql);
    connection.query(sql, function (error, row) {
      if (error) {
        throw error;
      }
      else {
        callback(null, row);
      }
    });
  }
}

userModel.getMuro = function (callback) {
  if (connection) {
    var sql = "SELECT * FROM post INNER JOIN usuarios on usuarios_id_usuario = id_usuario";
    console.log(sql);
    connection.query(sql, function (error, row) {
      if (error) {
        throw error;
      }
      else {
        callback(null, row);
      }
    });
  }
}

userModel.insertUser = function (userData, callback) {
  if (connection) {''
    connection.query("INSERT INTO usuarios (nombre,apellidos,email,clave)VALUES('"+userData.nombre+"','"+userData.apellidos+"','"+userData.email+"','"+userData.clave+"');",
    function (error, result) {
      if (error) {
        throw error;
      }
      else {
        callback(null, { "insertId": result.insertId });
      }
    });
  }
}
userModel.insertMuro = function (userData, callback) {
  if (connection) {

    var sql = "INSERT INTO post(mensaje,fecha,usuarios_id_usuario)VALUES('"+userData.mensaje+"','"+userData.fecha+"',"+userData.usuarios_id_usuario+");";
    console.log(sql);
    connection.query(sql,
    function (error, result) {
      if (error) {
        throw error;
      }
      else {
        callback(null, { "insertId": result.insertId });
      }
    });
  }
}

app.post("/user", function (req, res, next) {
  console.log(req.body);
  var credencial = {
    email: req.body.username,
    contraseña: req.body.password
  }
  userModel.getUser(credencial, function (error, data) {

    if (data) {
      if(data.length > 0){
          res.json(200, { msg: data })
      }else{
        res.json(200, { msg: false })
      }
      
    }
    else {
      res.json(500, { "msg": "Error" });
    }
  });
});

app.post("/users", function (req, res, next) {
  console.log(req.body);
  var userData = {
    nombre: req.body.nombre,
    email: req.body.email,
    apellidos: req.body.apellido,
    clave: req.body.clave,
  };

  userModel.insertUser(userData, function (error, data) {
    if (data) {
      res.json(200, { msg: data })
    }
    else {
      res.json(500, { "msg": "Error" });
    }
  });
});

app.post("/muro", function (req, res, next) {
  console.log(req.body);
  var userData = {
    mensaje: req.body.mensaje,
    fecha: req.body.fecha,
    usuarios_id_usuario: req.body.id_usuario,
  };

  userModel.insertMuro(userData, function (error, data) {
    if (data) {
      res.json(200, { msg: data })
    }
    else {
      res.json(500, { "msg": "Error" });
    }
  });
});

app.get("/muro", function (req, res, next) {

  userModel.getMuro(function (error, data) {
    if (data) {
      res.json(200, { msg: data })
    }
    else {
      res.json(500, { "msg": "Error" });
    }
  });
});


app.listen(1111, function () {
  console.log('Example app listening on port 1111!');
});