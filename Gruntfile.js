var browserify = require("./app/middleware/browserify");


// This is the main application configuration file.  It is a Grunt
// configuration file, which you can learn more about here:
// https://github.com/cowboy/grunt/blob/master/docs/configuring.md
//
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: '<json:package.json>',

    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' + 
        '<%= pkg.homepage ? " * " + pkg.homepage + "\n *\n" : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' */'
    },

    clean: ["public/assets"],

    browserify: {
      vendor: {
        src: [],
        dest: "public/assets/js/vendor.js",
        options: {
          shim: browserify.shims,
          alias: browserify.core
        }
      },
      bundle: { 
        src: ["app/client/index.js"],
        dest: "public/assets/js/bundle.js",
        options: {
          external: browserify.externals
        }
      }
      // , options: { debug: true }
    },

    less: {
      dist: {
        options: {
          paths: ["components", "node_modules"],
          yuicompress: true
        },
        files: {
          "public/assets/css/screen.css": "app/less/screen.less"
        }
      }
    },

    uglify: {
      bundle: {
        src: ["<banner>", "public/assets/js/bundle.js"],
        dest: "public/assets/js/bundle.js"
      },
      vendor: {
        src: ["public/assets/js/vendor.js"],
        dest: "public/assets/js/vendor.js"
      }
    },

    copy: {
      fonts: {
        files: [{
          expand: true,
          cwd: "components/font-awesome/font/",
          src: "*",
          dest: "public/assets/font/"
        }]
      },
      staticjs: {
        files: [{
          expand: true,
          cwd: "public/js/",
          src: "*",
          dest: "public/assets/js/"
        }]
      }
    },

    symlink: {
      components: {
        target: '../components',
        link: 'public/components'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-symbolic-link');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask("dist", ["clean", "copy", "browserify", "less", "uglify"]);
};
