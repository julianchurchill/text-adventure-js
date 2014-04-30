/*global desc, task, file, jake, fail, console, require, complete*/

(function () {
    "use strict";

    var jasmine = require('jasmine-node');
    var cucumber_bootstrap = "www/features/support/cucumber_bootstrap.js";
    var cucumber_bootstrap_bundle = "www/features/support/cucumber_bootstrap_bundle.js";
    var app_bootstrap = "www/js/app_bootstrap.js";
    var app_bootstrap_bundle = "www/js/app_bootstrap_bundle.js";
    var js_dir = "www/js";
    var browserify_command = "./node_modules/.bin/browserify";
    var cucumber_command = "./node_modules/.bin/cucumber.js";

    task("default", ["all"], function () {
    });

    desc("Lint, build and run the tests");
    task("all", ["lint", "build_artifacts", "unit_tests", "acceptance_tests"], function () {
    });

    desc("Lint, build and run the unit tests and work in progress features");
    task("wip", ["lint", "build_artifacts", "unit_tests", "wip_acceptance_tests"], function () {
    });

    desc("Create build artifacts, generate anything that needs generating");
    task("build_artifacts", [app_bootstrap_bundle], function () {
    });

    desc("Browserify app bootstrap");
    file(app_bootstrap_bundle, [app_bootstrap, js_dir], {async: true}, function () {
        console.log("Regenerating app bootstrap bundle with browserify...");
        var cmds = [ browserify_command + ' ' + app_bootstrap + ' -o ' + app_bootstrap_bundle ];
        jake.exec(cmds, {breakOnError: true, printStdout: true}, function () {
            complete();
        });
    });

    desc("Browserify cucumber bootstrap");
    file(cucumber_bootstrap_bundle, [cucumber_bootstrap, js_dir], {async: true}, function () {
        console.log("Regenerating cucumber bootstrap bundle with browserify...");
        var cmds = [ browserify_command + ' ' + cucumber_bootstrap + ' -o ' + cucumber_bootstrap_bundle ];
        jake.exec(cmds, {breakOnError: true, printStdout: true}, function () {
            complete();
        });
    });

    desc("Production Cucumber feature tests");
    task("acceptance_tests", [cucumber_bootstrap_bundle], {async: true}, function () {
        console.log("Running cucumber feature tests...");
        var cmds = [ cucumber_command + ' --format pretty --tags ~@wip --tags ~@future www/features -r www/features/step_definitions' ];
        jake.exec(cmds, {breakOnError: true, printStdout: true}, function () {
            complete();
        });
    });

    desc("Work in progress Cucumber feature tests");
    task("wip_acceptance_tests", [cucumber_bootstrap_bundle], {async: true}, function () {
        console.log("Running work in progress (wip) tagged cucumber feature tests...");
        var cmds = [ cucumber_command + ' --format pretty --tags ~@future www/features -r www/features/step_definitions' ];
        jake.exec(cmds, {breakOnError: true, printStdout: true}, function () {
            complete();
        });
    });

    desc('Run Jasmine specs');
    task('unit_tests', [cucumber_bootstrap_bundle], {async: true}, function() {
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
