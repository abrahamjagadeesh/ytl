module.exports = function(grunt) {
    'use strict';
    // Default port
    grunt.initConfig({
        connect: {
            server: {
                options: {
                    keepalive: true,
                    port: 8000,
                    base: 'app/',
                    open: true,
                    hostname: '127.0.0.1'
                        //hostname: '192.168.50.17'
                        //hostname: '10.5.18.69'
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['connect:server']);
};
