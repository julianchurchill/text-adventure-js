/*global desc, task, file, jake, fail, console, require, complete*/

(function () {
    "use strict";

    var jasmine = require('jasmine-node');
    var cuke_bootstrap_bundle = "www/features/support/cucumber_bootstrap_bundle.js";

    desc("Lint, build and run the tests");
    task("default", ["lint", "unit_tests", "acceptance_tests"], function () {
    });

    desc("Browserify cucumber bootstrap");
    file(cuke_bootstrap_bundle, ["www/features/support/cucumber_bootstrap.js"], {async: true}, function () {
        console.log("Regenerating cucumber bootstrap bundle with browserify...");
        var cmds = [ './node_modules/.bin/browserify www/features/support/cucumber_bootstrap.js -o ' + cuke_bootstrap_bundle ];
        jake.exec(cmds, {printStdout: true}, function () {
            complete();
        });
    });

    desc("Cucumber feature tests");
    task("acceptance_tests", [cuke_bootstrap_bundle], {async: true}, function () {
        console.log("Running cucumber feature tests...");
        var cmds = [ './node_modules/.bin/cucumber.js www/features -r www/features/step_definitions' ];
        jake.exec(cmds, {printStdout: true}, function () {
            complete();
        });
    });

    desc('Run Jasmine specs');
    task('unit_tests', {async: true}, function() {
        var specDir = './www/spec';
        console.log('Running unit test task, including jasmine tests from', specDir);
        jasmine.executeSpecsInFolder({
            specFolders: [specDir],
            onComplete: function(runner, log) {
                var failed = runner.results().failedCount;
                if (failed > 0) {
                    fail();
                }
                complete();
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
        files.exclude("www/features/support/cucumber_bootstrap_bundle.js");

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
