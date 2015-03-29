var gutil = require("gulp-util"),
    should = require("should"),
    gulpRactive = require("../index"),
    fs = require("fs");


// TEST DESCRIPTIONS
describe("gulp-ractive", function () {
    it("should compile ractive templates", function (done) {
        var file = new gutil.File({
            base: "test/fixtures/",
            path: "test/fixtures/template.html",
            contents: fs.readFileSync("test/fixtures/template.html")
        });

        testRactive = gulpRactive();
        testRactive.on("data", function (newFile) {
            should.exist(newFile);
            should.exist(newFile.contents);

            String(newFile.contents).should.equal(
                String(fs.readFileSync("test/expected/template.json"), "utf8"));
            done();
        });
        testRactive.write(file);
    });
});