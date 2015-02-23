var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');

var app = express();
 // parse application/json
    app.use(bodyParser.json());                        

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

    // parse multipart/form-data
 //   app.use(multer());

 fs.readdirSync(__dirname + '/models').forEach(function(filename) {
  if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});


JSON.stringifyOnce = function(obj, replacer, indent){
    var printedObjects = [];
    var printedObjectKeys = [];

    function printOnceReplacer(key, value){
        if ( printedObjects.length > 2000){ // browsers will not print more than 20K, I don't see the point to allow 2K.. algorithm will not be fast anyway if we have too many objects
        return 'object too long';
        }
        var printedObjIndex = false;
        printedObjects.forEach(function(obj, index){
            if(obj===value){
                printedObjIndex = index;
            }
        });

        if ( key == ''){ //root element
             printedObjects.push(obj);
            printedObjectKeys.push("root");
             return value;
        }

        else if(printedObjIndex+"" != "false" && typeof(value)=="object"){
            if ( printedObjectKeys[printedObjIndex] == "root"){
                return "(pointer to root)";
            }else{
                return "(see " + ((!!value && !!value.constructor) ? value.constructor.name.toLowerCase()  : typeof(value)) + " with key " + printedObjectKeys[printedObjIndex] + ")";
            }
        }else{

            var qualifiedKey = key || "(empty key)";
            printedObjects.push(value);
            printedObjectKeys.push(qualifiedKey);
            if(replacer){
                return replacer(key, value);
            }else{
                return value;
            }
        }
    }
    return JSON.stringify(obj, printOnceReplacer, indent);
};
app.set('port', process.env.PORT || 3000);

mongoose.connect('mongodb://localhost:27017/mongo');

//load all files in models dir
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
  if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});


app.get('/donors', function(req, res) {
  mongoose.model('donors').find(function(err, donors) {
    res.send(donors);
  });
});
app.get('/:filename', function(req, res) {
	
});

app.get('/', function(req, res){
  res.sendfile(__dirname + '/html/register.html');
  
});

app.get('/register', function(req, res){
  res.sendfile(__dirname + '/html/register.html');
  
});
app.post('/registerSave', function(req, res){
  //res.sendfile(__dirname + '/html/register.html');
/*  var strObj = JSON.stringifyOnce(res);
  strObj = strObj.replace('/\,/g','<br>');
  res.send(strObj);*/
  //res.send(req.body);
  mongoose.model("donors")({
  name: {first : req.body.first_name, last: req.body.first_name},
  email : req.body.email,
  password : req.body.password,
  bloodGroup : req.body.blood_group
}).save(function(err,doc){
    if(err) res.json(err);
    else res.writeHead(302,{'Location':'/donors'});
    res.end();
  })
  
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
