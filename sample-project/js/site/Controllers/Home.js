Class(function Home() {

    Inherit(this, Controller);
    
    var _self = this,
        _elem = _self.element;

    Global.HOME = this;

    (function() {
        _init();
        _events();
        _onResize();
    })();

    function _init() {
        _elem.setZ(10).bg('#053aac');
    }

    function _events() {
        Evt.subscribe(window, Evt.RESIZE, _onResize);
    }

    function _onResize(){
        _elem.size(Stage.width, Stage.height);
    }

    this.destroy = function() {
        Evt.removeEvent(window, Evt.RESIZE, _onResize);
        this.__destroy();
    };
});