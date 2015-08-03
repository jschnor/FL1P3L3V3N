Class(function FullBackgroundImage() {

    Inherit(this, View);

    var _self = this,
        _elem = _self.element,
        _bg;

    (function() {
        _init();
    })();

    function _init() {
        _elem.size('100%').setProps({
            opacity: 0
        });

        _bg = _elem.create('.background');
        _bg.size('100%').imgbg(Config.ASSETS.images + 'sample.jpg', {
            size: 'cover'
        });
    }

    this.animateIn = function(){
        _elem.tween({
            opacity: 1
        }, 0.5, Config.EASING.inout);
    };

    this.animateOut = function(){
        _elem.tween({
            opacity: 0
        }, 0.5, Config.EASING.inout);
    };
});
