/**
 * Created by Jeff on 5/23/2016.
 */
function SuperClass(arg){
    this.prop = arg;
};

function TestClass(arg) {
    TestClass.prototype.constructor.call(this, arg);

    // The reason we set that to this
    var that = this;
    function helper() {
        var thisTop = this.top; // <- undefined, but it would seem that it should be the value of top
        var thatTop = that.top; // <- the real value of top
        // "this" in this context refers to the window
    };
    helper();
};

TestClass.prototype = new SuperClass();

var test = new TestClass("argument");
var prop = test.prop;

