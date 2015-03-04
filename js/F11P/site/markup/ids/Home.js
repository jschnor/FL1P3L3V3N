function Home() {

    Inherit(this, $id);
    
    var _self = this,
        _elem,
        _arrow,
        _buttons;

    var _scrolltick     = null;
    
    var _isAnimating    = true;
    var _z              = 99;
    var _slideIndex     = 0;
    var _slides         = [];
    var _isScrolling    = false;
    // -1 because user has to scroll down to start
    var _currdir        = -1;

    Global.HOME         = this;
    this.hasAnimateOut  = true;


    (function() {
        _init();
        _getSlides();
        _addArrow();
        _addButtons();
        _events();
    })();


    function _init() {

        _elem = _self.element;

        _elem.size(Stage.width, Stage.height).css({
            opacity: 1,
        }).setZ(100);
    }
    
    function _getSlides() {

        // run the loop through requestAnimationFrame, which is 
        // built into TweenLite.ticker. This is the key to having
        // the full 16.67ms to load layout items in between frames
        // TweenLite.ticker.addEventListener('tick', _loadSlides);
        Render.startRender(_loadSlides);

    }

    function _loadSlides() {

        if (_slideIndex == Data.HOME.length) {

            // reset slideindex and stop loading
            _slideIndex = 0;
            Render.stopRender(_loadSlides);

            // activate first slide and move others offscreen
            for (var _s = 0; _s < _slides.length; _s++) {

                if (_s == 0){
                    _slides[_s].show();
                    _slides[_s].start();
                }else{
                    _slides[_s].move(1, false);
                }
            }
            
            // get background for first slide
            Global.FULLBG.image.getFirst();

            return;
        }

        // load slides in sequence
        var _slide = _self.initClass(Slide, Data.HOME[_slideIndex], _slideIndex);
        _slides.push(_slide);

        // load background images in sequence
        Global.FULLBG.image.loadSlides(Data.HOME[_slideIndex], _slideIndex);

        // turn animation to false to allow for scrollHandler
        _isAnimating = false;

        _slideIndex++;
    }


    function _addArrow(){
        _arrow = _self.initClass(ScrollArrow);
    }

    function _addButtons(){
        _buttons = _self.initClass(Buttons);
    }


    function _events() {
        Evt.resize(_onResize);
    }

    function _bindScroll(){
        if (Device.mobile){
            TouchUtil.bind(_elem, _directionHandler);
        }else{
            ScrollUtil.bind(_elem, _directionHandler);
        }
    }

    this.bindScroll = function(){
        _bindScroll();
    };


    function _directionHandler(e) {
        // HOME
        var _delta = Math.abs(e.wheelDelta);

        // detect the end of scrolling and reset the _isScrolling variable
        clearTimeout(_scrolltick);
        _scrolltick = setTimeout(function(){
            // console.log('scrolling stopped');
            _isScrolling = false;
        }, 100);

        // reset is scrolling to false if the user changes the direction of scroll
        if (_currdir != e.direction) {
            _isScrolling = false;
        }
        _currdir = e.direction;

        // console.log(e.amount)
        // reset is scrolling to false if user is hammering on scroll and animation is complete
        // if (!_isAnimating && Math.abs(e.amount) > 1.2) {
        //     _isScrolling = false;
        // }

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


    // get previous slide
    function _getUp() {
        if (_isAnimating === false) {
            if (_slideIndex !== 0) {
                // check if we were at the last slide
                if (_slideIndex == _slides.length - 1){
                    _arrow.invert();
                }

                _isAnimating = true;

                _slides[_slideIndex].move(1, false);
                _slides[_slideIndex].stop();

                _slideIndex--;

                if (_slideIndex == _slides.length - 2){
                    // video transition back?
                    // console.log('VIDEO TRANSITION BACK?????');
                    
                    _slides[_slideIndex].move(1, true, function(){
                        _isAnimating = false;
                    });

                    Global.FULLBG.image.getPrev();
                    Global.BORDERS.invert();
                }else{
                    // normal transition
                    _slides[_slideIndex].move(1, true, function(){
                        _isAnimating = false;
                    });

                    Global.FULLBG.image.getPrev();
                }
            }
        }
    }


    // get next slide
    function _getDown() {
        if (_isAnimating === false) {
            if (_slideIndex != _slides.length - 1) {
                _isAnimating = true;

                _slides[_slideIndex].move(-1, false);
                _slides[_slideIndex].stop();

                _slideIndex++;

                if (_slideIndex == _slides.length - 1){
                    // video transition
                    // console.log('CREATE OVERLAY VIDEO');
                    if (!Device.mobile){
                        Global.FULLBG.video.play('mirrorme-portal');
                        Global.FULLBG.video.swapZ();

                        _self.delayedCall(function(){
                            // get next slide while video transition is running
                            // hopefully this does not lag the video
                            _slides[_slideIndex].move(-1, true, function(){
                                _isAnimating = false;
                            });

                            Global.FULLBG.image.getNext();
                            Global.BORDERS.invert();
                        }, 2000);
                    }else{
                        _slides[_slideIndex].move(-1, true, function(){
                            _isAnimating = false;
                        });

                        Global.FULLBG.image.getNext();
                        Global.BORDERS.invert();
                    }
                }else{
                    // normal transition
                    _slides[_slideIndex].move(-1, true, function(){
                        _isAnimating = false;
                    });

                    Global.FULLBG.image.getNext();
                }

                // check if we're at the last slide
                if (_slideIndex == _slides.length - 1){
                    _arrow.invert();
                }
            }
        }
    }

    function _onResize() {
        
        _elem.size(Stage.width, Stage.height);

        for (var i = 0; i < _slides.length; i++) {

            _slides[i].element.size(Stage.width, Stage.height);

            if (i < _slideIndex){
                _slides[i].element.setProps({
                    y: -Stage.height
                });
            }else if (i > _slideIndex){
                _slides[i].element.setProps({
                    y: Stage.height
                });
            }

        }

    }

    this.getUp = function(){
        _getUp();
    };

    this.getDown = function(){
        _getDown();
    };

    this.destroy = function() {

        if (Device.mobile) {
            // unbind seems to be causing issues on mobile, so don't unbind
            // TouchUtil.unbind(_elem);
        } else {
            ScrollUtil.unbind(_elem);
        }

        this.__destroy();
    };

    this.animateOut = function(callback) {
        _elem.transform({
            transformOrigin: Stage.width/2 - 100
        }).tween({
             opacity: 0
        }, 0.2, 'Quart.EaseOut', null, function() {
            callback();
            Global.FULLBG.image.removeSlides();
        });
    };
}
