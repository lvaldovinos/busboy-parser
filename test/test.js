var request = require('supertest');
var app = require('./app');

describe('Testing bbparser', function() {
	describe('POST /upload', function() {
		//testing uploading only fields....
		it('Upload some fields....', function(done) {
			var fields = 'example=Example&another=Example&another=Example&another=Example';
			request(app)
			.post('/upload')
			//.set('Content-Type', 'multipart/form-data; boundary=---------------------------25810157913271')
			.type('form')
			.send(fields)
			.end(function(err, res) {
				if (err) return done(err);
				console.log(res.body);
				done();
			});
		});
		//testing uploading only one file....
		it('Upload a file.....', function(done) {
			request(app)
			.post('/upload')
			.attach('fileExample', 'nodejs-1024x768.png')
			.end(function(err, res) {
				if (err) return done(err);
				console.log(res.body);
				done();
			});
		});
		//uploading two or more file....
		it('Upload more than one file...', function(done) {
			request(app)
			.post('/upload')
			.attach('fileExample', 'nodejs-1024x768.png')
			.attach('fileExample2', 'nodejs-1024x768.png')
			.end(function(err, res) {
				if (err) return done(err);
				console.log(res.body);
				done();
			});
		});
		//trying out all together...
		it('Upload files and fields...', function(done) {
			request(app)
			.post('/upload')
			.attach('fileExample', 'nodejs-1024x768.png')
			.field('fieldExample', 'this is a example')
			.field('fieldExample2', 'another')
			.end(function(err, res) {
				if (err) return done(err);
				console.log(res.body);
				done();
			});
		});
	});
});



