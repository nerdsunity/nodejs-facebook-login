/*
 * This function wraps WebPage.evaluate, and offers the possibility to pass
 * parameters into the webpage function. The PhantomJS issue is here:
 *
 *   http://code.google.com/p/phantomjs/issues/detail?id=132
 *
 * This is from comment #43.
 */
function evaluate(page, func) {
    var args = [].slice.call(arguments, 2);
    var fn = "function() { return (" + func.toString() + ").apply(this, " + JSON.stringify(args) + ");}";
    return page.evaluate(fn);
}

var args = require('system').args;
var page = require('webpage').create();

var data = {
    email : args[1],
    password:args[2],
    emailToScrape:args[3]
};

page.open("http://www.facebook.com/login.php", function(status) {
    if (status === "success") {
        page.onConsoleMessage = function(msg, lineNum, sourceId) {
            console.log('CONSOLE: ' + msg);
        };

        evaluate(page, function(data) {
            document.getElementById("email").value = data.email;
            document.getElementById("pass").value = data.password;
            document.getElementById("loginbutton").click();
            console.log('Just entered FB info');
        }, data);
    }
});
