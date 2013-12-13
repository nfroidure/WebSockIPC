module.exports = function(grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    
    grunt.initConfig({

      browserify: {
        dist: {
            src: 'src/frontend.js',
            dest: 'www/javascript/script.js'
        }
      },

      watch: {
        options: {
          livereload: true
        },
        scripts: {
          files: ['src/javascript/**/*.js']
        },
        frontend: {
          files: ['src/frontend.js', 'src/frontend/**/*.js', 'src/common/**/*.js'],
          tasks: ['browserify:dist']
        }
      }
    });

    grunt.registerTask('dev', [
        'watch'
    ]);

    grunt.registerTask('dist', [
        'browserify:dist'
    ]);

    grunt.registerTask('default', [
        'dist'
    ]);
};
