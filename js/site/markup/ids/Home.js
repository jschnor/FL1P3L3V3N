function Home() {

    Inherit(this, $id);
    
    var _self = this,
        _elem = _self.element,
        _button;

    Global.HOME = this;

    (function() {
        _init();
        _events();
        _onResize();
        _animateIn();
    })();

    function _init() {
        _elem.setZ(10);

        _button = _elem.create('.button');
        _button.setProps({
            border: '5px solid '+Config.COLORS.white
        }).bg(Config.COLORS.test);
    }

    function _events() {
        Evt.subscribe(window, Evt.RESIZE, _onResize);
        _button.interact(_onOver, _onOut, _onClick);
    }

    function _onOver(){
        _button.bg('#ff0000');
    }

    function _onOut(){
        _button.bg(Config.COLORS.test);
    }

    function _onClick(){
        Global.FULLBG.swapBG();
        Global.FULLBG.video.play();
    }

    function _onResize(){
        _elem.size(Stage.width, Stage.height);

        var buttonsize = Stage.width * (200/1920);
        _button.size(buttonsize, buttonsize).setProps({
            left: (Stage.width - buttonsize)/2,
            top: (Stage.height - buttonsize)/2
        });
    }

    function _animateIn(){
        Global.FULLBG.image.animateIn();
    }

    this.destroy = function() {
        this.__destroy();
    };
}