var express = require('express');
var mysql = require('./dbcon.js');

var bodyParser = require('body-parser');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.post('/insert',function(req,res,next){
  if(req.body.name != null && req.body.name != "" && req.body.updateID == null)
  {
    mysql.pool.query("INSERT INTO workouts (`name`,`reps`, `weight`, `date`, `lbs`) VALUES (?,?,?,?,?)", [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs], function(err, result){
    if(err){
      next(err);
      return;
    }
  });
  }
  
});

app.post('/delete', function(req, res, next){
    mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }
  
  });
});


app.post('/update',function(req,res,next){

  var context = {};
    mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.body.updateID], function(err, result){
    if(err){
      next(err);
      return;
    }
  context.info = result;
  res.render('update', context);
});
});


app.get('/select',function(req,res,next){
    
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
     context.results = rows;
    
     res.type('application/json');
       res.send( context);
 
  });
});


app.all('/',function(req,res,next){
  if(req.body.updateID){
            mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
        [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs, req.body.updateID],
      

        function(err, result){
        if(err){
          next(err);
          return;
        }
        });

    
  }
    res.render('home');
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

