var fs = require('fs');
var through = require('through2');
var gulputil = require('gulp-util');
var Ractive = require('ractive');
var chalk = require('chalk');
var PluginError = gulputil.PluginError;

const PLUGIN_NAME = 'gulp-ractive';

function escapeRegExp(str)
{
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function gulpRactive(options)
{
	var delimiters = options.delimiters || ['{{','}}'];
	
	//Regexp to make includes work in ractive file
	//String to match (with delimiters (by default {{ and }}) changeable through options
	//{{ include("file.ractive") }}
	var includeRegexp = new RegExp(escapeRegExp(delimiters[0]) +
		'\\s*include\\s*\\(\\s*"{1}([^"]+)"{1}\\s*\\)\\s*' + escapeRegExp(delimiters[1]), "gi");
	var includeReplaceFunction = function(currentfile) {
		return function(match, includedfilename) {
			var filepath = currentfile.base +"/"+ includedfilename;
			
			if (!fs.existsSync(filepath))
				callback(new PluginError(PLUGIN_NAME, 'Included file not found: ' + includedfilename));
			else
			{
				gulputil.log('gulp-ractive:', chalk.green('included file: ') + includedfilename);
				return fs.readFileSync(filepath);
			}
			
			return "";
		};
	};
	
	var stream = through.obj(function(file, enc, callback) {
		if (file.isStream())
		{
			this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
			return callback();
		}
		
		var compiledtemplate = null, filecontents = "";
		
		try {
			//Find include calls
			filecontents = String(file.contents);
			filecontents = filecontents.replace(includeRegexp, includeReplaceFunction(file, callback));
			
			//Parse template in Ractive
			compiledtemplate = Ractive.parse(filecontents, options);
			compiledtemplate = JSON.stringify(compiledtemplate);
			file.contents = new Buffer(compiledtemplate);
			this.push(file);
		}
		catch (e) {
			console.warn('Error caught from Ractive.parse: ' +
				e.message + ' in ' + file.path + '. Returning uncompiled template');
			this.push(file);
			return callback();
		}
		
		callback();
	});

	return stream;
}

module.exports = gulpRactive;