module.exports = function (grunt) {
  'use strict';
  
  grunt.template.setDelimiters();
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    copy: {
      js: {
        expand: true,
        flatten: false,
        cwd: 'ts',
        src: ['**/*.html'],
        dest: 'js',
        filter: 'isFile'
      }
    },
    
    ts: {
      dist: {
        src: ['ts/**/*.ts', '!ts/**/*.d.ts'],
        tsconfig: {
          tsconfig: 'ts/tsconfig.json',
          passThrough: false
        }
      }
    },

    tslint: {
      options: {
        configuration: 'tslint.json'
      },
      files: {
        src: ['ts/**/*.ts', '!ts/**/*.d.ts']
      }
    },

    watch: {
      ts: {
        files: 'ts/**/*.ts',
        tasks: ['tslint', 'ts']
      },
      views: {
        files: ['ts/**/*.html'],
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
