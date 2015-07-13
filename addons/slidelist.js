/**
 * $slidelist
 * 
 * Allows objects to Inherit() these properties and methods, providing an easy way
 * to build slide navigation into your project.
 * ^^ LIES ^^
 *
 * This file acts as a controller for a set of slides, managing next and previous actions.
 */
function $slidelist(_uniqid){
    Inherit(this, $id);

    var _self = this,
        _elem = _self.element,
        _xPos = 0,
        _yPos = 0;
    
    _self.orientation = 'vertical'; // 'vertical' || 'horizontal' || 'static'; set using initSlides from the class that inherits this
    _self.slides = []; // the object that inherits this is expected to populate slides
    _self.sizeToContainer = false; // if true, will resize and position slides to their parent container; if false, will size and position to Stage
    _self.slideindex = 0;
    _self.scrolltick = null;
    _self.isScrolling = false;
    _self.currdir = -1;
    _self.isAnimating = false;
    _self.container = false;
    _self.paused = false;
    _self.autoResize = true;
    _self.uniqid = _uniqid = '' ? Date.now() : _uniqid;

    _self.outputWidth = Stage.width;
    _self.outputHeight = Stage.height;

    // set a default easing; can be set whenever by the object that inherits this
    _self.easing = 'Quad.easeInOut';
    if (typeof Config.EASING == 'object'){
        if (Config.EASING.hasOwnProperty('inout')){
            _self.easing = Config.EASING.inout;
        }
    }

    _self.transtime = 0.5; // seconds
    _self.delay = null; // null or seconds

    // set up events
    Evt.SLIDE_NAVCHANGE = 'slide_navchange';
    Evt.SLIDE_NAVSELECT = 'slide_navselect'; // fire this in your "onClick" function in your slidenav item class
    Evt.SLIDE_COMPLETE = 'slide_complete'; // when using 'static' for _self.orientation, you need to fire this event from your slide when animation is complete; it resets _self.isAnimating to false

    (function(){
        // initialize stuff
        if (Device.mobile){
            TouchUtil.bind(_elem, _directionHandler);
        }else{
            ScrollUtil.bind(_elem, _directionHandler);
        }

        Evt.subscribe(_elem, Evt.SLIDE_COMPLETE, function(params){
            if (params.uniqid == _self.uniqid){
                _self.isAnimating = false;
            }else{
                console.log('wtf');
            }
        });

        // if (_self.uniqid == 'workweb'){
            Evt.subscribe(_elem, Evt.SLIDE_NAVSELECT, _goto);
        // }

        _elem.size(_self.outputWidth, _self.outputHeight);
    })();

    function _directionHandler(event) {

        if (_self.paused === true){
            return;
        }

        // detect the end of scrolling and reset the _self.isScrolling variable
        clearTimeout(_self.scrolltick);
        _self.scrolltick = setTimeout(function(){
            _self.isScrolling = false;
        }, 50);

        // reset is scrolling to false if the user changes the direction of scroll
        if (_self.currdir != event.direction) {
            _self.isScrolling = false;
        }
        _self.currdir = event.direction;

        // reset is scrolling to false if user is hammering on scroll and animation is complete
        if (!_self.isAnimating && Math.abs(event.amount) > 1.2) {
            _self.isScrolling = false;
        }

        // curb multiple firings of implementation
        if (!_self.isScrolling) {
            _self.isScrolling = true;

            // set direction of scroll
            if (!Device.mobile) {
                switch (_self.orientation){
                    case 'horizontal':
                    if (event.direction == 'left' || event.direction == 'up'){
                        if (_self.orientation == 'static'){
                            _getPrev('fade');
                        }else{
                            _getPrev('right');
                        }
                    }else if (event.direction == 'right' || event.direction == 'down'){
                        if (_self.orientation == 'static'){
                            _getNext('fade');
                        }else{
                            _getNext('left');
                        }
                    }
                    break;

                    case 'vertical':
                    case 'static':
                    default:
                    if (event.direction == 'up'){
                        if (_self.orientation == 'static'){
                            // _getPrev('fade');
                            _getPrev('down');
                        }else{
                            _getPrev('down');
                        }
                    }else if (event.direction == 'down'){
                        if (_self.orientation == 'static'){
                            _getNext('up');
                        }else{
                            _getNext('up');
                        }
                    }
                    break;
                }
            }else{
                switch (_self.orientation){
                    case 'horizontal':
                    if (event.direction == 'left'){
                        if (_self.orientation == 'static'){
                            _getNext('left');
                        }else{
                            _getNext('left');
                        }
                    }else if (event.direction == 'right'){
                        if (_self.orientation == 'static'){
                            // _getPrev('fade');
                            _getPrev('right');
                        }else{
                            _getPrev('right');
                        }
                    }
                    break;

                    case 'vertical':
                    case 'static':
                    default:
                    if (event.direction == 'up'){
                        if (_self.orientation == 'static'){
                            // _getNext('fade');
                            _getNext('up');
                        }else{
                            _getNext('up');
                        }
                    }else if (event.direction == 'down'){
                        if (_self.orientation == 'static'){
                            // _getPrev('fade');
                            _getPrev('down');
                        }else{
                            _getPrev('down');
                        }
                    }
                    break;
                }
            }
        }
    }

    function _getNext(dir){
        if (_self.slideindex < _self.slides.length - 1 && _self.isAnimating === false){
            _self.isAnimating = true;

            // trigger animations on slides
            var current = _self.previous = _self.slideindex;
            // console.log('slidelist getNext: '+_self.slideindex);
            _self.slideindex++;
            var next = _self.slideindex;

            // you need to implement this.animateOut and this.animateIn on your slide class
            if (_self.slides[current].hasOwnProperty('animateOut')){
                _self.slides[current].animateOut(dir);
            }

            if (_self.slides[next].hasOwnProperty('animateIn')){
                _self.slides[next].animateIn(dir);
            }

            Evt.fireEvent(_elem, Evt.SLIDE_NAVCHANGE, {
                index: next,
                uniqid: _self.uniqid
            });

            // when using a container, scroll the container
            if (_self.container !== false){
                _xPos = (_self.orientation == 'vertical') ? 0 : _xPos - _self.outputWidth;
                _yPos = (_self.orientation == 'vertical') ? _yPos - _self.outputHeight : 0;

                _self.container.tween({
                    x: _xPos,
                    y: _yPos
                }, _self.transtime, _self.easing, _self.delay, function(){
                    _self.isAnimating = false;
                });
            }
        }
    }

    function _getPrev(dir){
        if (_self.slideindex > 0 && _self.isAnimating === false){
            _self.isAnimating = true;
            
            // trigger animations on slides
            // console.log('slidelist getPrev: '+_self.slideindex);
            var current = _self.previous = _self.slideindex;
            _self.slideindex--;
            var prev = _self.slideindex;

            // you need to implement this.animateOut and this.animateIn on your slide class
            if (_self.slides[current].hasOwnProperty('animateOut')){
                _self.slides[current].animateOut(dir);
            }

            if (_self.slides[prev].hasOwnProperty('animateIn')){
                _self.slides[prev].animateIn(dir);
            }

            Evt.fireEvent(_elem, Evt.SLIDE_NAVCHANGE, {
                index: prev,
                uniqid: _self.uniqid
            });

            // when using a container, scroll the container
            if (_self.container !== false  && _self.orientation != 'static'){
                _xPos = (_self.orientation == 'vertical') ? 0 : _xPos + _self.outputWidth;
                _yPos = (_self.orientation == 'vertical') ? _yPos + _self.outputHeight : 0;

                _self.container.tween({
                    x: _xPos,
                    y: _yPos
                }, _self.transtime, _self.easing, _self.delay, function(){
                    _self.isAnimating = false;
                });
            }
        }
    }

    function _goto(params){

        if (params.uniqid == _self.uniqid){
            if (_self.isAnimating === false){
                _self.isAnimating = true;

                _self.previous = _self.slideindex;
                _self.slideindex = params.index;

                var diff = Math.abs(_self.previous - _self.slideindex);
                if (diff > 1){
                    diff = diff*0.66; // this is used later to extend the transition animation so it's not too quick
                }

                if (Config.DEBUG.slidelist) {
                    console.log('========================');
                    console.log('GOTO');
                    console.log('prev:' + _self.previous);
                    console.log('index:' + _self.slideindex);
                    console.log('========================');
                }

                // determine the direction for slide animation
                switch (_self.orientation){
                    case 'horizontal':
                    if (_self.slideindex < _self.previous){
                        if (_self.orientation == 'static'){
                            // dir = 'fade';
                            dir = 'right';
                        }else{
                            dir = 'right';
                        }
                    }else{
                        if (_self.orientation == 'static'){
                            // dir = 'fade';
                            dir = 'left';
                        }else{
                            dir = 'left';
                        }
                    }
                    break;

                    case 'vertical':
                    case 'static':
                    default:
                    if (_self.slideindex < _self.previous){
                        if (_self.orientation == 'static'){
                            // dir = 'fade';
                            dir = 'down';
                        }else{
                            dir = 'down';
                        }
                    }else{
                        if (_self.orientation == 'static'){
                            // dir = 'fade';
                            dir = 'up';
                        }else{
                            dir = 'up';
                        }
                    }
                    break;
                }

                // you need to implement this.animateOut and this.animateIn on your slide class
                if (_self.slides[_self.previous].hasOwnProperty('animateOut')){
                    _self.slides[_self.previous].animateOut(dir);
                }

                if (_self.slides[_self.slideindex].hasOwnProperty('animateIn')){
                    _self.slides[_self.slideindex].animateIn(dir);
                }

                Evt.fireEvent(_elem, Evt.SLIDE_NAVCHANGE, {
                    index: _self.slideindex,
                    uniqid: _self.uniqid
                });

                // when using a container, scroll the container
                if (_self.container !== false && _self.orientation != 'static'){
                    _xPos = (_self.orientation == 'vertical') ? 0 : -(_self.outputWidth * _self.slideindex);
                    _yPos = (_self.orientation == 'vertical') ? -(_self.outputHeight * _self.slideindex) : 0;

                    _self.container.tween({
                        x: _xPos,
                        y: _yPos
                    }, _self.transtime * diff, _self.easing, _self.delay, function(){
                        _self.isAnimating = false;
                    });
                }
            }
        }else{
            console.log(params.uniqid + ' ' + _self.uniqid);
        }
    }

    // this needs to be called to set the slides in the correct places
    // objParams = {
    //      orientation: 'vertical' || 'horizontal' || 'static',
    //      use_container: true || false
    // }
    this.initSlides = function(objParams){
        // whether to create a container element for all slides
        var use_container = true;

        if (typeof objParams == 'object'){
            if (objParams.hasOwnProperty('orientation')){
                _self.orientation = objParams.orientation;
            }

            if (objParams.hasOwnProperty('use_container')){
                if (objParams.use_container === false){
                    use_container = false;
                }
            }

            if (objParams.hasOwnProperty('sizeToContainer')){
                if (objParams.sizeToContainer === true){
                    _self.sizeToContainer = true;
                }else{
                    _self.sizeToContainer = false;
                }
            }
        }

        // if you set _self.sizeToContainer = true, you need to also set _self.width and _self.height in the class that inherits this
        _self.outputWidth = _self.sizeToContainer ? _self.width : Stage.width;
        _self.outputHeight = _self.sizeToContainer ? _self.height : Stage.height;

        if (_self.orientation == 'static'){
            use_container = false;
        }

        // create container
        if (use_container === true){
            _self.container = _elem.create('.scroll-container');
            _self.container.size('100%');
        }

        for (idx = 0; idx < _self.slides.length; idx++){
            if (_self.container !== false){
                _self.container.add(_self.slides[idx]);
                _self.slides[idx].element.setProps({
                    x: (_self.orientation == 'vertical') ? 0 : _self.outputWidth * idx,
                    y: (_self.orientation == 'vertical') ? _self.outputHeight * idx : 0
                });
            }
        }

        if (_self.autoResize == true){
            Evt.subscribe(window, Evt.RESIZE, _onresize);
        }
    };

    function _onresize() {
        // if you set _self.sizeToContainer = true, you need to also set _self.width and _self.height in the class that inherits this
        _self.outputWidth = _self.sizeToContainer ? _self.width : Stage.width;
        _self.outputHeight = _self.sizeToContainer ? _self.height : Stage.height;

        _elem.size(_self.outputWidth, _self.outputHeight);

        _xPos = (_self.orientation == 'vertical') ? 0 : -(_self.outputWidth * _self.slideindex);
        _yPos = (_self.orientation == 'vertical') ? -(_self.outputHeight * _self.slideindex) : 0;

        if (_self.container !== false && _self.orientation != 'static') {

            _self.container.setProps({
                x: _xPos,
                y: _yPos
            });
        }

        for (idx = 0; idx < _self.slides.length; idx++){
            if (_self.container !== false && _self.orientation != 'static'){
                _self.slides[idx].element.setProps({
                    x: (_self.orientation == 'vertical') ? 0 : _self.outputWidth * idx,
                    y: (_self.orientation == 'vertical') ? _self.outputHeight * idx : 0
                });
            }
        }
    }

    this.resize = function(){
        _onresize();
    };

    this.next = function(dir){
        if (typeof dir != 'string'){
            console.error('No direction specified for $slide.next');
            return false;
        }
        _getNext(dir);
    };

    this.prev = function(dir){
        if (typeof dir != 'string'){
            console.error('No direction specified for $slide.prev');
            return false;
        }
        _getPrev(dir);
    };

    this.pause = function(){
        _self.paused = true;
    };

    this.resume = function(){
        _self.paused = false;
    };

    this.__destroySlideList = function() {
        Evt.removeEvent(_elem, Evt.SLIDE_COMPLETE, function(){ _self.delayedCall( function() { _self.isAnimating = false; }, _self.delay); });
        Evt.removeEvent(_elem, Evt.SLIDE_NAVSELECT, _goto);

        if (_self.autoResize == true){
            Evt.removeEvent(window, Evt.RESIZE, _onresize);
        }

        this.__destroy();
    }
}