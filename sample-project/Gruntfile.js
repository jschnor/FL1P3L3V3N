// F11P JavaScript framework

// files to include in compiled script
// first set are core library files which must be included in a specific order
// second set is the site-specific implementation (usually just one line for all of them since order is not important)
var _appfiles = [
	'bower_components/F11P/lib/Global.js',
	'bower_components/F11P/lib/Device.js',
	'bower_components/F11P/lib/bit/bit.js',
	'bower_components/F11P/lib/bit/bitObject.js',
	'bower_components/F11P/lib/Events.js',
	'bower_components/F11P/lib/bit/bitEvents.js',
	'bower_components/F11P/lib/Mobile.js',
	'bower_components/F11P/lib/utilities/ScrollUtil.js',
	'bower_components/F11P/lib/utilities/TouchUtil.js',
	'bower_components/F11P/lib/Render.js',
	'bower_components/greensock/src/uncompressed/TweenMax.js',
	'bower_components/history.js/scripts/bundled-uncompressed/html4+html5/native.history.js',
	'bower_components/PreloadJS/lib/preloadjs-0.6.0.combined.js',
	'bower_components/F11P/lib/utilities/Utils.js',
	'bower_components/F11P/lib/utilities/Cookie.js',
	'bower_components/F11P/lib/utilities/Ajax.js',
	'bower_components/F11P/lib/bit/extensions/Ext_BG.js',
	'bower_components/F11P/lib/bit/extensions/Ext_Center.js',
	'bower_components/F11P/lib/bit/extensions/Ext_CSS.js',
	'bower_components/F11P/lib/bit/extensions/Ext_FontStyle.js',
	'bower_components/F11P/lib/bit/extensions/Ext_Interact.js',
	'bower_components/F11P/lib/bit/extensions/Ext_SetZ.js',
	'bower_components/F11P/lib/bit/extensions/Ext_Size.js',
	'bower_components/F11P/lib/bit/extensions/Ext_Transform.js',
	'bower_components/F11P/lib/bit/extensions/Ext_Tween.js',
	'bower_components/F11P/lib/bit/extensions/Ext_Visibility.js',
	'bower_components/F11P/lib/bit/bitReady.js',
	'bower_components/F11P/lib/css/CSS.js',
	'bower_components/F11P/lib/markup/markup.js',
	'bower_components/F11P/lib/markup/id.js',
	'bower_components/F11P/lib/markup/class.js',
	'bower_components/F11P/lib/markup/component.js',
	'bower_components/F11P/lib/markup/markuplist.js',
	'bower_components/F11P/lib/data/Model.js',
	'bower_components/F11P/lib/GATracker.js',

	'js/site/**/**/*.js'
];

// These are built into the framework. These shouldn't have to change much.
var _exceptions = [ 'bit', '$bitObject', 'Utils', 'ScrollUtil', 'TouchUtil', 'Cookie', 'Ajax', 'Mobile', 'Start', 'Container', 'Evt', 'Model', 'Data', 'Config', 'GATracker', 'Home', 'Loader', 'Device', 'CSS', 'Render'];


// banners to prepend to the minified code. mostly for showing off.
var _banner_big="/*\n"+
				"                      ,--                 ________........\n"+
				" ________.......    ,'  |    ,---'''''''''         ____  |\n"+
				"|      ________|   |__  |    |__......-------''''''    | |\n"+
				"| |''''               | |                              | |\n"+
				"| |                   | |                              | |\n"+
				"| |                   | |       __                     | |\n"+
				"| |         ___...    | |     .` |      |'''''~,       | |\n"+
				"| |        |  ___|    | |    |   |      | ,--. |       | |\n"+
				"| |        | |        | |    --. |      | |  | |       | |\n"+
				"| |        | |        | |      | |      | |  | |       | |\n"+
				"| |        | |        | |      | |      | |  | |       | |\n"+
				"| |        | |        | |      | |      | |  | |       | |\n"+
				"| |        | |        | |      | |      | |  | |       | |\n"+
				"| |        | |_..     | |      | |      | |__, |       | |\n"+
				"| |        |  __|     | |      | |      |  ___.'       | |\n"+
				"| |        | |        | |      | |      | |            | |\n"+
				"| |        | |        | |      | |      | |            | |\n"+
				"| |        | |        | |      | |      | |            | |\n"+
				"| |        | |        | |      | |      | |            | |\n"+
				"| |        |_|        |_;      '-'      '-'            | |\n"+
				"| |                                                    | |\n"+
				"| |                                                    | |\n"+
				"| |                                                ____| |\n"+
				"| |___________............----------'''''''''''''''      |\n"+
				"|             _____________...........------------''''''''\n"+
				"'''''''```````                                          \n"+
				"\n"+
				"F11P | Flipeleven\n"+
				"A Digital Creative Agency\n"+
				"http://f11p.com\n";

var _banner_sml='/*     _         \n'+
				'      /          \n'+
				'  ___ |   _  ___ \n'+
				' |    |  /  |    \n'+
				' | -  |  |  | - / \n'+
				' |    |  |  |    \n'+
				' |    |  |  |    \n'+
				'http://f11p.com\n';


// configure Grunt
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		sass: {
			options: {
				// If you can't get source maps to work, run the following command in your terminal:
				// $ sass scss/cousins.scss:css/cousins.css --sourcemap
				// (see this link for details: http://thesassway.com/intermediate/using-source-maps-with-sass )
				// sourceMap: true
			},

			dist: {
				options: {
					// outputStyle: 'expanded'
					outputStyle: 'compressed'
				},

				files: {
					'css/app.css': 'scss/app.scss'
				}
			}
		},


		uglify: {
			concatenateOnly: {
				options: {
					banner: _banner_big+'\n\n' +
										'------------------------- \n' +
										'<%= grunt.template.today("yyyy-mm-dd HH:mm:ss") %>\n' +
										'------------------------- */ \n\n',
					compress: false,
					// mangle: false,
					mangle: {
						except: _exceptions
					},

					drop_console: true,
					no_mangle_functions: true,
					preserveComments: 'none'
				},

				files: { // only concatenation
					'js/app.min.js': _appfiles
				}
			},
		},


		concat: {
			js: {
				files: {
					'js/app.js': _appfiles
				}
			}
		},

		watch: {

			grunt: {
				files: ['Gruntfile.js'],
				// tasks: ['concat', 'uglify:concatenateOnly', 'uglify:doAll']
				tasks: ['concat', 'uglify:concatenateOnly']
			},

			scripts: {
				files: [ 'js/site/**/**/*.js'],
				tasks: ['concat']
				// tasks: ['concat', 'uglify:concatenateOnly']
			},

			sass: {
				files: 'scss/**/*.scss',
				tasks: ['sass']
			}

		}
	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('build', ['sass', 'concat', 'uglify:concatenateOnly']);
	grunt.registerTask('default', ['build', 'watch']);
	// grunt.registerTask('build', ['uglify:js']);
};