/**
 * Created by Jeff on 5/23/2016.
 */
function SuperClass(arg){
    this.prop = arg;
};

function TestClass(arg) {
    TestClass.prototype.constructor.call(this, arg);
};

TestClass.prototype = new SuperClass();

var test = new TestClass("argument");
var prop = test.prop;

