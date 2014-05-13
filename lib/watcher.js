'use strict';

var Gaze = require('gaze').Gaze;

function createWatcher(opt, callback) {
    var watch = new Gaze();
    watch.on('changed', callback);

    var options = { autoWatch: !!opt.autoWatch, log: opt.log };

    return {
        bundle: function (bundle) {
            if (!options.autoWatch) { return; }
            bundle.on('dep', function (dep) {
                var deps = Object.keys(dep.deps).map(function (k) { return dep.deps[k]; });
                if (!deps.length) { return; }
                watch.add(deps);
            });
        },

        directories: function (directories) {
            if (!options.autoWatch) { return; }
            watch.add(directories);
        },

        files: function (files) {
            if (!options.autoWatch) { return; }
            files = files.filter(function (f) { return f.watched; }).map(function (f) { return f.pattern; });
            watch.add(files);
        }
    };
}

module.exports = { create: createWatcher };
