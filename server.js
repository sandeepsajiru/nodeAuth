var express = require('express');

var app = express();

app.get('/', function(req, res){
	res.send('Welcome to RESTful');
});

var port = 8000;
app.listen(port, function(){
	console.log('http://localhost:'+port);
});