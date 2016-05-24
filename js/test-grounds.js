/**
 * Created by Jeff on 5/23/2016.
 */
function SuperClass(arg){
    this.prop = arg;
};

var superConstructor = function() {
    this.__proto__.constructor(arguments);    
};

function TestClass() {
    var superClass = SuperClass.prototype;
    this.__proto__.constructor(arguments);
    TestClass.prototype.constructor(arguments);
    superConstructor.apply(this, arguments);
    proto.apply(this.arguments);
};

TestClass.prototype = new SuperClass();
var test = new TestClass("argument");
