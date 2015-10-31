//Requiring necessary node-modules
var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var mongo = require('mongoskin');
//Connecting to Database
var db = mongo.db('mongodb://localhost:27017/books', {native_parser:true});
app.use(bodyParser.urlencoded({ extended: false }));
//Uses JSON data
app.use(bodyParser.json());
app.use(function(req, res, next) {
  req.db = db;
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers,', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

//Show List
app.get('/book', function(req, res) {
  var data = {
    "Data": ""
  };
  var db = req.db;
  db.collection('books').find().toArray(function (err, items) {
    if(!!err) {
      data['Books'] = 'Error fetching data';
      res.json(data);
    } else {
      if(!!items && items.length != 0) {
      data['error'] = 0;
      data['Books'] = items;
      res.json(data);
    } else {
      data['error'] = 1;
      data['Books'] = 'No books found!';
      res.json(data);
    }
  }
  });
});


//Add to List
app.post('/book', function(req, res) {
  var Bookname = req.body.bookname;
  var Authorname = req.body.authorname;
  var Price = req.body.price;
  var data = {
    'error': 1,
    'Books': ""
  };
  if(!!Bookname && !!Authorname && !!Price) {
    db.collection('books').insert({bookname: Bookname, authorname: Authorname, price: Price}, function(err, result) {
      if(!!err) {
        data['Books'] = 'Error adding data';
      } else {
        data['error'] = 0;
        data['Books'] = 'Item Added Successfully';
      }
      res.json(data);
    });
  } else {
    data['Books'] = 'Please provide all information';
    res.json(data);
  }
});

//Update List Items
app.put('/book', function(req, res) {
  var Id = req.params.id;
  var Bookname = req.body.bookname;
  var Authorname = req.body.authorname;
  var Price = req.body.price;
  var data = {
    'error': 1,
    'Books': ''
  };
  if(!!Bookname && !!Authorname && !!Price) {
    db.collection('books').update({_id: mongo.helper.toObjectID(Id)}, {$set:{bookname:Bookname , authorname:Authorname, price:Price}}, function(err) {
      if(!!err) {
        data['Books'] = 'Error Updating';
        console.log('second');
      } else {
        data['error'] = 0;
        data['Books'] = "Updated Item Successfully";
      }
      res.json(data);
    });
  } else {
    data['Books'] = 'Please provide all information'
    res.json(data);
  }
});

//Deleting List Items
app.delete('/book/:bookname', function(req, res){
    var BookName = req.params.bookname;
    var data = {
        'error': 1,
        'Books': ""
    };
    if(!!BookName){
        db.collection('books').remove({bookname:BookName}, function(err, result) {
            if(!!err){
                data['Books'] = 'Error deleting data';
            }else{
                data['error'] = 0;
                data['Books'] = 'Item Successfully Deleted';
            }
            res.json(data);
        });
    } else {
        data['Books'] = 'Please provide all information';
        res.json(data);
    }
});

//Console log when listening to port 8080
http.listen(8080, function() {
  console.log('Connected and Listening on port 8080');
});
