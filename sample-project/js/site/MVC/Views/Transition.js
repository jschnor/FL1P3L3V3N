Singleton(function Transition() {
    // console.log('tranistion is called - singleton');

    Inherit(this, View);

    var _self = this;
    var _elem, _anim, _centerW, _centerH, _bg;
    var _rotation = 0;
    var _isLooping = false;
    var _center;
    var _size = 200;
    // var _center;

    
    (function () {
        _init();
    })();

    function _init() {
        _elem = _self.element;
        _elem.size('100%').setZ(9000).css({
            left: Device.mobile ? 0 : 0,
        });

        _centerH = Stage.height/2 - _size/2;
        _centerW = Stage.width/2 - _size/2;

        _bg = _elem.create('.bg');

        _bg.size('100%').css({
            // top: _centerH,
            // left: _centerW,
            opacity: 0

        // }).bg('black');
        }).bg(Config.COLORS.branding);

        _anim = _elem.create('.loader');

        _anim.size(_size, _size).css({
            top: _centerH,
            left: _centerW,
            opacity: 0.8

        // }).bg('black');
        }).bg(Config.ASSETS.common + '/loader.png');

        _anim.transform({
            scale: 0.3
        });

    }

    function _visibility(isvisible) {
        
        var _isVisible = isvisible;

        if (_isVisible) {
            
            Global.CONTAINER.element.add(_elem);

            _anim.tween({
                opacity: 0.8
            }, 0.4, 'Quart.EaseIn');

            if (!Device.mobile) {
                if (!Global.FULLBG.video.AMBIENT  || Global.WORK) {
                    _bg.tween({
                        opacity: 0.2
                    }, 0.4, 'Quart.EaseIn');
                } else {
                    _bg.css({
                        opacity: 0
                    })
                }
            }
            

            
            _runloop(true);

            
        
        } else {



            // _anim.tween({
            //     // scale: 2,
            //     opacity: 0
            // }, 0.4, 'Quart.EaseOut', null, function() {

                // _runloop(false);
                // _runloop(true);

                _isLooping = false;
                

                // _self.delayedCall(function() {

                // console.log(Global.CONTAINER)
                Global.CONTAINER.element.removeChild(_elem);

                // }, 600);

                
            // });
        }
        
    }

    function _runloop(islooping) {

        // console.log('run loop');
        // _self.delayedCall(function() {
            _isLooping = islooping;
            // console.log(_isLooping);

            if (_isLooping){
                _rotation += 360;
                _anim.tween({
                    rotation: _rotation
                }, 0.6, 'Linear.easeNone', null, function() {

                    if (_isLooping) {
                        _runloop(true);
                    }

                });
            } else {
                // _runloop(true);
                // _self.delayedCall(function() {
                    _runloop(false);
                // }, 600)
            }
        // });
    }

    this.animateIn = function (callback, parameters) {
        
        // _isVisible = true;
        var _callback   = callback;
        var _parameters = parameters;

        _visibility(true);
        
        if (_callback) {
            _callback(_parameters);
        }
        
    };
    this.animateOut = function (callback, parameters) {

        var _callback = callback;
        var _parameters = parameters;

        _visibility(false);
        
        if (_callback) {
            _self.delayedCall(function() {
                
                _callback(_parameters);

            }, 400);
        }

        if (!Device.mobile) {
            if (Global.FULLBG.video.AMBIENT) {
                _self.delayedCall(function() {
                    // Global
                    Global.FULLBG.coverOut();

                }, 400);
            }
        }

        
        
        
    };
    this.resize = function () {

        _centerH = Stage.height/2 - _size/2;
        _centerW = Stage.width/2 - _size/2;

        _anim.css({
            top: _centerH,
            left: _centerW,

        // }).bg('black');
        });
    }
});