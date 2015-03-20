function NavItem(index) {

    Inherit(this, $class);
    
    var _self = this,
        _elem = _self.element;

    _self.index = index;

    (function() {
        _init();
        _setSize();
        _events();
    })();

    function _init() {
        _elem.setProps({
            border: "1px solid #000000",
            borderRadius: "50%"
        }).bg('#ffffff');
    }

    function _events() {
        Evt.subscribe(window, Evt.RESIZE, _setSize);

        _elem.interact(null, null, _click);
    }

    function _click(){
        Evt.fireEvent(_elem, Evt.SLIDE_NAVSELECT, {
            index: index
        });
    }

    function _setSize(){
        var dotsize = 20;
        _elem.size(dotsize, dotsize).setProps({
            left: ((300/5)*index) + 20,
            top: 25 - (dotsize/2)
        });
    }

    this.deactivate = function(){
        _elem.bg('#ffffff');
    };

    this.activate = function(){
        _elem.bg('#000000');
    };
}