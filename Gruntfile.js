/**
 * Excellent article for getting started with Grunt :)
 * https://24ways.org/2013/grunt-is-not-weird-and-hard/
 */
module.exports = function(grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

         clean: {
            build: {
                src: ["deploy"]
            }
         },

         concat: {
             dist: {
                 src: [
                     'src/js/**/*.js'
                 ],
                 dest: 'deploy/js/main.js'
             }
         },

         uglify: {
             build: {
                 src: 'deploy/js/main.js',
                 dest: 'deploy/js/main.min.js'
             }
         },

         less: {
             dist: {
                 options: {
                     style: 'compressed'
                 },
                 files: {
                     'deploy/css/main.css': 'src/less/*.less'
                 }
             }
         },

		watch: {
             options: {
                 livereload: true
             },

             scripts: {
                 files: ['src/js/**/*.js'],
                 tasks: ['concat'],
                 options: {
                     spawn: false
                 }
             }

             /**css: {
                 files: ['src/css/*.less'],
                 tasks: ['less'],
                 options: {
                     spawn: false
                 }
             }*/
         },

	    connect: {
		    server: {
			    options: {
				    port: 8000,
				    /**keepalive: true, else watch won't run afterwards **/
				    base: 'deploy/'
			    }
		    }
	    },

         copy: {
             main: {
                 files: [
                     {
                         expand: true,
                         flatten: true,
                         src: ['src/**.txt','src/index.html'],
                         dest: 'deploy/'
                     },
                     {
                         expand: true,
                         cwd: 'src/assets/',
                         src: ['**/*.{png,jpg,gif,svg,json}'],
                         dest: 'deploy/assets'
                     },
                     {
                         expand: true,
                         flatten: true,
                         src: 'src/lib/modernizr-custom.js',
                         dest: 'deploy/lib/'
                     },
                     {
                         expand: true,
                         flatten: true,
                         src: 'src/lib/pixi.min.js',
                         dest: 'deploy/lib/'
                     },
                     {
                         expand: true,
                         flatten: true,
                         src: 'src/lib/TweenMax.min.js',
                         dest: 'deploy/lib/'
                     },
                     {
                         expand: true,
                         flatten: true,
                         src: 'src/lib/pixi-particles.min.js',
                         dest: 'deploy/lib/'
                     }
                 ]
             }
         }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-clean'); // clean files/directories   npm install grunt-contrib-clean --save-dev
    grunt.loadNpmTasks('grunt-contrib-concat'); // concat js files          npm install grunt-contrib-concat --save-dev
    grunt.loadNpmTasks('grunt-contrib-uglify'); // minify js files          npm install grunt-contrib-uglify --save-dev
    grunt.loadNpmTasks('grunt-contrib-less'); // less                       npm install grunt-contrib-less --save-dev
    grunt.loadNpmTasks('grunt-contrib-copy'); // copy files                 npm install grunt-contrib-copy --save-dev
    grunt.loadNpmTasks('grunt-contrib-watch'); // watch                     npm install grunt-contrib-watch --save-dev
	grunt.loadNpmTasks('grunt-contrib-connect');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['clean', 'concat', 'uglify', 'less', 'copy', 'connect', 'watch']);
};

