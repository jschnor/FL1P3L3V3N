/**
 * $slidenav
 * 
 * Allows objects to Inherit() these properties and methods, providing an easy way
 * to build slide navigation into your project.
 *
 * This file acts as a list of slide navigation points, managing selections.
 */
function $slidenav(){
	var _self = this,
		_elem = _self.element;

	_self.current = 0;
	_self.previous = 0;
	_self.items = []; // the object that inherits this is expected to populate items

	(function(){
		Evt.subscribe(_elem, Evt.SLIDE_NAVCHANGE, _onNavChange);
	})();

	function _onNavChange(params){
		_self.previous = _self.current;
		_self.current = params.index;

		// you need to implement this.deactivate and this.activate on your nav item class
		if (_self.items[_self.previous].hasOwnProperty('deactivate')){
			_self.items[_self.previous].deactivate();
		}

		if (_self.items[_self.current].hasOwnProperty('activate')){
			_self.items[_self.current].activate();
		}
	}
}