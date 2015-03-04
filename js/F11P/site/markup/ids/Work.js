function Work() {

    Inherit(this, $id);
    
    var _self = this;

    var _elem, _headline, _bg, _scroll;
    var _scont, _bbg, _button, _btext;
    var _hwidth, _hheight, _hscale;
    var _swidth, _sheight, _arrow, _arrow1;

    var _scrolltick     = null;
    
    var _isAnimating    = true;
    var _z              = 99;
    var _slideIndex     = 0;
    var _slides         = [];
    var _isScrolling    = false;
    // -1 because user has to scroll down to start
    var _currdir        = -1;

    var _arrowTop       = Device.mobile.phone ? Stage.height - 100 : Stage.height - 145;
    var _arrow_w        = Device.mobile.phone ? 109 : 122;
    var _arrow_h        = _arrow_w*0.667;
    var _arrowDir       = 'down';

    var _inc = 0;

    Global.WORK         = this;
    this.hasAnimateOut  = true;

    (function() {

        _init();
        // _getFirstSlide();
        _getSlides();
        // _animateIn();

        _eventSubscription();

    })();

    function _init() {

        _hwidth = Device.mobile ? 500 : 600;
        _hheight = Device.mobile ? 104 : 240;
        _hscale = Device.mobile.phone ? 0.25 : 0.5;

        _elem = _self.element;

        _elem.size(Stage.width, Stage.height).css({
            opacity: 1,
        }).transform({
            skewY: -2
        }).setZ(6);

        _arrow = _elem.create('.arrow');
        _arrow.size(244, 91).css({
            top: _arrowTop - 50,
            left: Stage.width/2 - _arrow_w - 10,
            opacity: 0,
            cursor: 'pointer'
        }).setZ(199);

        _arrow1 = _arrow.create('.down-arrow');
        _arrow1.size(244, 91).bg(Config.ASSETS.common + '/arrow.png');

        _arrow.transform({
            scale: !Device.mobile.phone ? 0.5 : 0.3
        });

        _self.delayedCall(function() {
            _arrowIn();
        }, 2200);
        
        
        // image background in
            // Global.FULLBG.coverOut();
    }
    
    function _getSlides() {

        // run the loop through requestAnimationFrame, which is 
        // built into TweenLite.ticker. This is the key to having
        // the full 16.67ms to load layout items in between frames
        // TweenLite.ticker.addEventListener('tick', _loadSlide);
        Render.startRender(_loadSlide);

    }

    function _loadSlide() {

        if (_inc == Data.WORK.getMappedData().length) {
            _inc = 0;
            // TweenLite.ticker.removeEventListener('tick', _loadSlide);
            Render.stopRender(_loadSlide);
            // console.log('end of loop');
            return;
        }
        // console.log('loop inc: '+_inc);
        
        if (_inc === 0) {

            _slide = _self.initClass(Slide, Data.WORK.getMappedData()[0], 0);
            _slides.push(_slide);

            Global.FULLBG.image.loadSlides(Data.WORK.getMappedData()[0], 0);

            _slides[0].element.transform({
                scale: _hscale
            });
            
            _slides[0].element.tween({
                opacity: 1,
                scale: Device.mobile.phone ? 0.6 : 1,
            }, 0.6, 'Quart.EaseOut').setZ(99);

        } else {

            _slide = _self.initClass(Slide, Data.WORK.getMappedData()[_inc], _inc);
            _slides.push(_slide);

            _slide.element.transform({
                scale: _hscale
            // }).css({
            }).transform({
                y: 100
            });

            Global.FULLBG.image.loadSlides(Data.WORK.getMappedData()[_inc], _inc);
        }

        // turn animation to false to allow for scrollHandler
        _isAnimating = false;
        // figure out where we need to run the tint and cover out
        _inc++;

        var _tock = setTimeout(function() {
            
            Global.FULLBG.tintOut();
            clearTimeout(_tock);

        }, 800);
    }
    function _arrowIn() {
        _arrow.tween({
            opacity: 1,
            top: _arrowTop
        }, 1, 'Quart.EaseOut', null, function() {
            _loopArrow();
        });
    }
    function _loopArrow() {
        _arrow1.tween({
            top: - 20,
        }, 0.4, 'Quart.EaseOut', null, function() {

            _arrow1.tween({
                top: 0
            }, 0.6, 'Quart.EaseIn', null, function() {
                _loopArrow();
            });
        });
    }
    function _handleArrowClick() {

        if (_arrowDir == 'down') {
            _getDown();
            // Global.FULLBG.up();
        } else {
            _getUp();
            // Global.FULLBG.down();
        }
    }
    function _eventSubscription() {
        Evt.resize(_onResize);
        Evt.subscribe(_arrow, Evt.CLICK, _handleArrowClick);

        if (Device.mobile){
            TouchUtil.bind(_elem, _directionHandler);
        }else{
            ScrollUtil.bind(_elem, _directionHandler);
        }
    }

    function _onOver(e) {
        // console.log('OVER');
        _bbg.tween({
            top: 0
        }, 0.2, 'Quart.EaseOut');
        _btext.css({
            color: Config.COLORS.branding
        });
    }
    function _onOut(e) {
        _bbg.tween({
            top: -60
        }, 0.2, 'Quart.EaseIn', null, function() {
            _bbg.css({
                top: 50
            });
        });
        _btext.css({
            color: 'white'
        });
    }

    // function _onClick(e) {
        // if (Device.mobile) {
        //     getURL(Utils.getAsset('Flip11_Reel_103114', 'video'));
        // } else {
        //     Global.FULLBG.startvideo('Flip11_Reel_103114');
        // }
    // }

    function _directionHandler(e) {

        var _delta = Math.abs(e.wheelDelta);

        // detect the end of scrolling and reset the _isScrolling varialbe
        clearTimeout(_scrolltick);
        _scrolltick = setTimeout(function(){
            // console.log('scrolling stopped');
            _isScrolling = false;
        }, 50);

        // reset is scrolling to false if the user changes the direction of scroll
        if (_currdir != e.direction) {
            _isScrolling = false;
            // _arrowDir = _arrowDir == 'up' ? 'down' : 'up';
        }
        _currdir = e.direction;

        // console.log(e.amount)
        // reset is scrolling to false if user is hammering on scroll and animation is complete
        if (!_isAnimating && Math.abs(e.amount) > 1.2) {
            _isScrolling = false;
        }

        // curb multiple firings of implementation
        if (!_isScrolling) {

            _isScrolling = true;

            switch (e.direction) {
                case 'up':
                    if (!Device.mobile) {
                        _getUp();
                        Global.FULLBG.down();
                    } else {
                        _getDown();
                        Global.FULLBG.up();
                    }

                break;
                case 'down':

                    if (!Device.mobile) {
                        _getDown();
                        Global.FULLBG.up();
                    } else {
                        _getUp();
                        Global.FULLBG.down();
                    }

                break;
            }
        }

        
        
    }

    function _getUp() {
        if (_isAnimating === false) {
            
            if (_slideIndex !== 0) {

                _isAnimating = true;
                
                var __el = _slides[_slideIndex].element;

                __el.transform({
                    transformOrigin: Stage.width/2,
                }).tween({
                    y: 100,
                    opacity: 0,
                    scale: Device.mobile.phone ? 0.4 : 0.8,
                }, 0.5, 'Quart.EaseOut');


                _slideIndex--;
                __el = _slides[_slideIndex].element;
                
                __el.transform({
                    transformOrigin: Stage.width/2
                }).tween({
                    y: 0,
                    opacity: 1,
                    scale: Device.mobile.phone ? 0.5 : 1,
                }, 0.4, 'Quart.EaseOut', null, function() {

                    _self.delayedCall(function() {
                        
                        _isAnimating = false;

                    }, 500);
                    
                }).setZ(_z++);


                Global.FULLBG.image.getPrev();

                if (_slideIndex == 0) {
                    _rotateArrowDown();
                }


                
            }
        }
    }

    function _getDown() {
        
        
        if (_isAnimating === false) {


            if (_slideIndex != _slides.length - 1) {

                _isAnimating = true;
                var __el = _slides[_slideIndex].element;

                __el.transform({
                    transformOrigin: Stage.width/2
                }).tween({
                    y: -100,
                    opacity: 0,
                    scale: Device.mobile.phone ? 0.4 : 0.9,
                }, 0.5, 'Quart.EaseOut');


                 _slideIndex++;
                 __el = _slides[_slideIndex].element;
                
                __el.transform({
                    transformOrigin: Stage.width/2
                }).tween({
                    y: 0,
                    opacity: 1,
                    scale: Device.mobile.phone ? 0.5 : 1,
                }, 0.4, 'Quart.EaseOut', null, function() {
                    
                    _self.delayedCall(function() {
                        
                        _isAnimating = false;

                    }, 500);

                }).setZ(_z++);

                Global.FULLBG.image.getNext();

                if (_slideIndex == _slides.length - 1) {
                    _rotateArrowUp();
                }

            }
        }

    }

    function _rotateArrowUp() {
        _arrowDir = 'up';
        _arrow.tween({
            rotation: 180,
            transformOrigin: _arrow_w + 'px ' + (_arrow_h*0.667) + 'px'
            // top: _arrowTop
        }, 0.4, 'Quart.EaseInOut');

    }
    function _rotateArrowDown() {
        _arrowDir = 'down';
        _arrow.tween({
            rotation: 0,
            transformOrigin: _arrow_w + 'px ' + (_arrow_h*0.667) + 'px'
            // top: _arrowTop
        }, 0.4, 'Quart.EaseInOut');

    }

    function _onResize() {
        
        _elem.size(Stage.width, Stage.height);

        _hwidth = Device.mobile ? 500 : 600;
        _hheight = Device.mobile ? 104 : 104;
        _arrowTop   = Device.mobile.phone ? Stage.height - 100 : Stage.height - 145;

        _arrow.css({
            top: _arrowTop - 50,
            left: Stage.width/2 - _arrow_w - 10,
        });

        for (var i = 0; i < _slides.length; i++) {

            _slides[i].element.size(Stage.width, Stage.height);

            _slides[i].section.css({
                top: Stage.height/2 - (_hheight/2) - 100,
                left: Stage.width/2 - (_hwidth/2),
            });

        }

    }
    this.getstarted = function() {
        _getDown();
    };
    this.destroy = function() {

        if (Device.mobile) {
            // unbind seems to be causing issues on mobile, so don't unbind
            // TouchUtil.unbind(_elem);
        } else {
            ScrollUtil.unbind(_elem);
            Evt.removeEvent(_arrow, Evt.CLICK, _handleArrowClick);
        }

        this.__destroy();
    };

    this.animateOut = function(callback) {
        _elem.transform({
            transformOrigin: Stage.width/2 - 100
        }).tween({
             opacity: 0,
             // width: 0
             scale: _hscale,
        }, 0.2, 'Quart.EaseOut', null, function() {
            callback();
            Global.FULLBG.image.removeSlides();
        });
    };
}
