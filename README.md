busboy-parser
=============

Nodejs module to handle post request using busboy.

<h2>Application example.</h2>

var express = require('express');
var http = require('http');
var app = express();
var router = express.Router();
var busboyHelper = require('./busboy-parser');
var busboy = require('connect-busboy');

app.set('port', 3000);
//crappy loggger
app.use(function( req, res, next ){
	console.log(req.method + '  --> ' + req.url);
	next();
});//
//busboy-enhanced
app.use(busboy());


//routes
router.get('/', function(req, res){
	var form = '<form method="post" action="/upload" enctype="multipart/form-data">'
			 +'<input type="file" name="file"/><input type="text" name="example"/><input type="submit" value="Save"/></form>';
	res.send(form);
});//router.get

router.post('/upload', function(req, res){
	busboyHelper.parseform(req, { tmpDir : __dirname });
	req.form.on('progress', function( progress ){
		console.log( progress );
	});//req.form.on
	req.form.on('finish', function(){
		console.log('Donde parsing form!');
		res.json(req.form.data);
	});
});//router.post;

app.use('/', router); 

var server = http.createServer(app);
server.listen( app.get('port'), function(){
	console.log('Server started on port '+ app.get('port'));
});//server.listen


