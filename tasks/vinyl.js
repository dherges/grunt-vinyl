/*
 * grunt-vinyl
 * https://github.com/dherges/grunt-vinyl
 *
 * Copyright (c) 2016 David Herges
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var path = require('path')
    , vfs = require('vinyl-fs')
    , defaultOpts = {
        task: undefined
      }

  grunt.registerMultiTask('vinyl', 'Pipe files thru vinyl-fs', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var done = this.async()
     , options = this.options(defaultOpts)
     , task = options.task
     , count = this.files.length || 0
     , fail = function (err) {
         grunt.log.error(err)
         done(false)
       }
     , success = function () {
         if (count > 0) {
           done(true)
         } else {
           done -= 1
         }
       }

    this.files.forEach(function(file) {
      grunt.log.info(file.src)

      var dest = file.dest
        , dirname = path.dirname(dest)
        , basename = path.basename(dest)
        , stream = vfs.src(file.src)

      task && (stream = task(stream))

      stream.pipe(vfs.dest(dirname))
            .on('error', fail)
            .on('finish', success)
    })

    if (count === 0) {
      done()
    }

  })
}
