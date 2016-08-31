module.exports = function (grunt) {
  'use strict';
  
  grunt.template.setDelimiters();
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    copy: {
      js: {
        expand: true,
        flatten: false,
        cwd: 'public/ts',
        src: ['**/*.html'],
        dest: 'public/js',
        filter: 'isFile'
      }
    },
    
    ts: {
      dist: {
        src: ['public/ts/**/*.ts', '!public/ts/**/*.d.ts'],
        tsconfig: {
          tsconfig: 'public/ts/tsconfig.json',
          passThrough: false
        }
      }
    },

    tslint: {
      options: {
        configuration: 'tslint.json'
      },
      files: {
        src: ['public/ts/**/*.ts', '!public/ts/**/*.d.ts']
      }
    },

    watch: {
      ts: {
        files: 'public/ts/**/*.ts',
        tasks: ['tslint', 'ts']
      },
      views: {
        files: ['public/ts/**/*.html'],
        tasks: ['copy:js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-tslint');

  grunt.registerTask('build', ['tslint', 'ts']);

  grunt.registerTask('default', ['build', 'copy:js', 'watch']);
};
