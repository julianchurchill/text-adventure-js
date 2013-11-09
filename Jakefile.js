/*global desc, task, jake, fail, console, require*/

(function () {
    "use strict";

    var jasmine = require('jasmine-node');

    desc("Lint, build and run the tests");
    task("default", ["lint", "unit tests"], function () {
        console.log("Running default task...");
    });

    desc('Run Jasmine specs');
    task('unit tests', function() {
        var specDir = './www/spec';
        console.log('Running unit test task, including jasmine tests from', specDir);
        jasmine.executeSpecsInFolder({
            specFolders: [specDir],
            onComplete: function(runner, log) {
                var failed = runner.results().failedCount;
                if (failed > 0) {
                    fail();
                }
            },
            isVerbose: false,
            showColors: true
        });
    });

    desc("Lint the code");
    task("lint", [], function () {
        console.log("Running lint task...");
        var lint = require("./build/lint/lint_runner.js");

        var files = new jake.FileList();
        files.include("**/*.js");
        files.exclude("build");
        files.exclude("node_modules");
        files.exclude("platforms");
        files.exclude("www/spec/lib");
        // Exclude example PhoneGap app
        files.exclude("www/js/index.js");
        // Exclude example PhoneGap app tests
        files.exclude("www/spec_phonegap/helper.js");
        files.exclude("www/spec_phonegap/index.js");

        var options = {
            bitwise: true,
            browser: true,
            curly: false,
            eqeqeq: true,
            forin: true,
            immed: true,
            latedef: false,
            newcap: true,
            noarg: true,
            node: false,
            noempty: true,
            nonew: true,
            quotmark: false,
            regexp: true,
            undef: true,
            strict: true,
            trailing: true
        };

        var globals = {
            require: false,
            describe: false,
            it: false,
            expect: false,
            dump: false,
            beforeEach: false,
            afterEach: false,
            spyOn: false,
            runs: false,
            waitsFor: false
        };

        var passed = lint.validateFileList(files.toArray(), options, globals);
        if (!passed) fail("Lint failed");
    });

}());
