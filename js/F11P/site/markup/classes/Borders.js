function Borders() {

    Inherit(this, $class);

    var _self = this,
        _elem = _self.element,
        _bordersize,
        _in = false,
        _inverted = false;

    Global.BORDERS = this;

    (function() {
        _init();
        _setSize();
        _events();
        _animateIn();
    })();

    function _init() {
        _elem.setProps({
            borderColor: '#090a0a',
            borderStyle: 'solid',
            opacity: 0
        }).setZ(99);
    }

    function _events(){
        Evt.resize(_setSize);
    }

    function _setSize(){
        _bordersize = Math.round(Stage.width * 0.01);

        _elem.size(Stage.width, Stage.height).setProps({
            borderWidth: _in ? _bordersize+'px' : '0px'
        });
    }

    function _animateIn(){
        _elem.tween({
            borderWidth: _bordersize+'px',
            opacity: 0.3
        }, 0.75, Config.EASING.out, 0.5, function(){
            _in = true;
        });
    }

    this.invert = function(){
        var transtime = 0.5;
        var oldcolor = '#090a0a';
        var newcolor = Config.COLORS.white;
        var oldopacity = 0.3;
        var newopacity = 0.5;

        if (_inverted){
            oldcolor = Config.COLORS.white;
            newcolor = '#090a0a';
            oldopacity = 0.3;
            newopacity = 0.5;
        }

        _inverted = !_inverted;

        _elem.setProps({
            borderColor: oldcolor,
            opacity: oldopacity
        }).tween({
            borderColor: newcolor,
            opacity: newopacity
        }, transtime, Config.EASING.inout);
    };
}