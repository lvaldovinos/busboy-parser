var fs = require('fs');
var os = require('os');
var tmp = require('tmp');
var path = require('path');
var Busboy = require('busboy');
var events = require('events');

var getProgress = function(rb, eb) {
	return (( rb / eb) * 100).toFixed(0);
};

var parseform = function( req, options){
	if( req.busboy){
		options = options || {};
		options.tmpDir = options.tmpDir || os.tmpdir();
		var files = [];
		var fields = [];
		var rb = 0;
		var eb =  parseInt(req.headers['content-length'],10);
		req.form = new events.EventEmitter();
		req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
			if (filename.indexOf('undefine') === -1) {
				//we need to create a temp file, because the user uploaded a file.
				tmp.tmpName( {dir: options.tmpDir} , function _tempNameGenerated(err, pathOS) {
					if (err) throw err;
					file.pipe(fs.createWriteStream(pathOS));
					file.on('data', function(data){
						rb += data.length;
						req.form.emit('progress', getProgress(rb, eb));
					});
					file.on('end', function() {
						var file = {
							fieldname: fieldname,
							ext : path.extname(filename),
							path : pathOS
						};
						files.push(file);
					});
				});//tmp.tmpName
			}
			else{
				//User did not upload any file, we need to stream.resume()
				file.resume();
			}
		});
		req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
			if(val){
				rb += Buffer.byteLength(val);
				req.form.emit('progress', getProgress(rb, eb));
				var field = {
					fieldname : fieldname,
					value : val
				}
				fields.push(field);
			}
		});
		req.busboy.on('finish', function() {
			req.form.data ={
				files : files,
				fields : fields
			}
			req.form.emit('finish');
		});
		//start busboy..
		req.pipe(req.busboy);
	}
};

exports.parseform = parseform;