function Logo() {

	Inherit(this, $class);

	var _self = this,
		_elem;

	(function() {
		_init();
		_events();
		_setSize();
	})();

	function _init() {
		_elem = _self.element;
		_elem.bg(Config.COLORS.test);

		_elem.interact(_onOver, _onOut, _onClick);
	}

	function _events(){
		Evt.resize(_setSize);
	}

	function _onOver(){

	}

	function _onOut(){

	}

	function _onClick(){
		if (Global.PAGE.toLowerCase() != 'home') {
			Evt.fireEvent(_elem, Evt.NAV_SELECT, {
				page: '/'
			});
		}
	}

	function _setSize(){
		var _width = Stage.width*0.2;
		var _height = _width*0.15;

		_elem.size(_width, _height).setProps({
			x: Config.margin(),
			y: Config.margin()
		});
	}
}