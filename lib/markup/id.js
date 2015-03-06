function $id() {

	Inherit(this, $markup);
	
	var _self = this;
	// Global.
	var _name = _self.constructor.toString().match(/function ([^\(]+)/)[1];
	this.element = this.container = $("#" + _name);

	this.element._useFragment = true;
    Global[_name.toUpperCase()] = {};

	// console.log('$id :: _self.constructor');
	// console.log('this.element');
	// console.log(this.element);
	// console.log(this.container);

	// console.log('ID :: Inerhits markup:')
	// console.log(_self)
	// console.log('_self.constructor: ' + _name);
	// console.log(_self);
	// console.log(_self.constructor.toString().match(/function ([^\(]+)/)[1]);
	// console.log(_self.constructor.toString());
	// console.log(_self.constructor.toString());

	// console.log(arguments.callee.toString());
	// console.log(arguments);
	// functionName = functionName.constructor.toString().match(/function ([^\(]+)/)[1];
	// this.element = this.container = $("#" + functionName);
	// this.element.__useFragment = true;
	// Global[functionName.toUpperCase()] = {};

	// console.log(functionName);

	// this.publicTest = function() {
	// 	console.log('publicTest')
	// }
	this.css = function(properties) {
	    this.container.css(properties)
	}

}