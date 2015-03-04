var _banner_big = "/*\n"+
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

var _banner_sml = '/*     _         \n'+
                  '      /          \n'+
                  '  ___ |   _  ___ \n'+
                  ' |    |  /  |    \n'+
                  ' | -  |  |  | - / \n'+
                  ' |    |  |  |    \n'+
                  ' |    |  |  |    \n'+
                  'http://f11p.com\n';


var _sitename = 'mirror-me';
var _appfiles = [

     'js/F11P/lib/Global.js',
     'js/F11P/lib/Device.js',
     'js/F11P/lib/bit/bit.js',
     'js/F11P/lib/bit/bitObject.js',
     'js/F11P/lib/Events.js',
     'js/F11P/lib/bit/bitEvents.js',
     'js/F11P/lib/Mobile.js',
     'js/F11P/lib/utilities/ScrollUtil.js',
     'js/F11P/lib/utilities/TouchUtil.js',
     'js/F11P/lib/Render.js',
     'js/F11P/lib/GreenSock-JS/src/uncompressed/TweenMax.js',
     'js/F11P/lib/history.js/scripts/bundled-uncompressed/html4+html5/native.history.js',
     'js/F11P/lib/preload/preloadjs-0.6.0.min.js',
     'js/F11P/lib/utilities/Utils.js',
     'js/F11P/lib/Config.js',
     'js/F11P/lib/bit/extensions/Ext_BG.js',
     'js/F11P/lib/bit/extensions/Ext_Center.js',
     'js/F11P/lib/bit/extensions/Ext_CSS.js',
     'js/F11P/lib/bit/extensions/Ext_FontStyle.js',
     'js/F11P/lib/bit/extensions/Ext_Interact.js',
     'js/F11P/lib/bit/extensions/Ext_SetZ.js',
     'js/F11P/lib/bit/extensions/Ext_Size.js',
     'js/F11P/lib/bit/extensions/Ext_Transform.js',
     'js/F11P/lib/bit/extensions/Ext_Tween.js',
     'js/F11P/lib/bit/extensions/Ext_Visibility.js',
     'js/F11P/lib/bit/bitReady.js',
     'js/F11P/lib/css/CSS.js',
     'js/F11P/lib/markup/markup.js',
     'js/F11P/lib/markup/id.js',
     'js/F11P/lib/markup/class.js',
     'js/F11P/lib/markup/component.js',
     'js/F11P/lib/markup/markuplist.js',
     'js/F11P/lib/data/Model.js',
     'js/F11P/lib/GATracker.js',

     'js/F11P/'+_sitename+'/**/**/*.js',
];

// These are built into the framework. These shouldn't have to change much.
var _exceptions = [ 'bit', '$bitObject', 'Utils', 'ScrollUtil', 'TouchUtil', 'Mobile', 'Start', 'Container', 'Evt', 'Model', 'Data', 'Config', 'GATracker',
                    'Home', 'Loader', 'Device', 'CSS', 'Render'];


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
          'css/mirror-me.css': 'scss/mirror-me.scss'
        }
      }
    },


     uglify: {
          concatenateOnly: {
               options: {
                    banner: _banner_big + '\n\n' +
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
               files: {// only concatenation
                    'js/mirror-me.min.js': _appfiles
               }
          },
    },


    concat: {
      js: {
        files: {
          'js/mirror-me.js': _appfiles
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
        files: [ 'js/F11P/**/**/**/*.js'],
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
