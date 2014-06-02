var request = require('supertest');
var app = require('./app');

describe('Example', function() {
	describe('GET /', function() {
		it('should return 200 response', function(done) {
			request(app)
			.get('/')
			.expect(200, done);
		});
	});
});