(function() {

window.Global = {};

window.Inherit = function(childObj, parentObj, params) {

	var _child = childObj;
	var _parent = parentObj;
	var _params = params;

  _parent.call(_child, _params);
  
};

window.Singleton = function(_function) {

	var _self = this || window;
	var _name = _function.toString().match(/function ([^\(]+)/)[1];

	_self[_name] = (function () {
        var __inst = {};
        // console.log('singleton called');
        var __func;
        __inst.instance = function () {
            if (!__func) {
                __func = new _function();
            }
            return __func;
        };
        return __inst;
    })();
}

window.Static = function(_function) {

	var _self = this || window;
	var _name = _function.toString().match(/function ([^\(]+)/)[1];

	_self[_name] = new _function();

}

window.getURL = function(link, target) {
   if (!target) {
       target = "_blank";
   }
   window.open(link, target);
};

})();