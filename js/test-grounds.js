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
        var thisTop = this.prop; // <- undefined, but it would seem that it should be the value of prop
        var thatTop = that.prop; // <- the real value of prop
        // When this function is called using the function invocation pattern, "this" refers to the Window
    };

    helper();
};

TestClass.prototype = new SuperClass();

var test = new TestClass("argument");
var prop = test.prop;

var testObj = {
  prop : 'hello',
    nestedProp : {
        prop : 'world',
        prop2 : this.prop
    }
};

var nested = testObj.nestedProp;