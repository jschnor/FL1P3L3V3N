function Nav() {

    Inherit(this, View);
    Inherit(this, $slidenav);
    
    var _self = this,
        _elem = _self.element;

    Global.NAV = this;

    (function() {
        _init();
        _events();
        _onResize();
        _animateIn();
    })();

    function _init() {
        _elem.setZ(100);
        _elem.bg('#ffffff');

        // init nav items
        for (var idx = 0; idx < 5; idx++){
            var test = _self.initClass(NavItem, idx);

            if (idx == 0){
                test.activate();
            }
            
            _self.items.push(test);
        }
    }

    function _events() {
        Evt.subscribe(window, Evt.RESIZE, _onResize);
    }

    function _onResize(){
        var width = 300;
        var height = 50;
        _elem.size(width, height).setProps({
            left: (Stage.width - width)/2,
            bottom: 20
        });
    }

    function _animateIn(){
        // Global.FULLBG.image.animateIn();
    }

    this.destroy = function() {
        this.__destroy();
    };
}