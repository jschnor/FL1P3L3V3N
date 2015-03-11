/**
 * $slidelist
 * 
 * Allows objects to Inherit() these properties and methods, providing an easy way
 * to build slide navigation into your project.
 *
 * This file acts as a controller for a set of slides, managing next and previous actions.
 */
function $slidelist(){
	var _self = this,
		_elem = _self.element,
		_xPos = 0,
		_yPos = 0;
	
	_self.orientation = 'vertical'; // 'vertical' || 'horizontal' || 'static'; set using initSlides from the class that inherits this
	_self.slides = []; // the object that inherits this is expected to populate slides
	_self.slideindex = 0;
	_self.scrolltick = null;
	_self.isScrolling = false;
	_self.currdir = -1;
	_self.isAnimating = false;
	_self.container = false;

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

		Evt.subscribe(_elem, Evt.SLIDE_COMPLETE, function(){ _self.isAnimating = false; });
		Evt.subscribe(_elem, Evt.SLIDE_NAVSELECT, _goto);
	})();

	function _directionHandler(event) {
        var _delta = Math.abs(event.wheelDelta);

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
	            			_getPrev('fade');
		            	}else{
		            		_getPrev('down');
		            	}
	            	}else if (event.direction == 'down'){
	            		if (_self.orientation == 'static'){
	            			_getNext('fade');
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
	            			_getNext('fade');
		            	}else{
		            		_getNext('left');
		            	}
	            	}else if (event.direction == 'right'){
	            		if (_self.orientation == 'static'){
	            			_getPrev('fade');
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
	            			_getNext('fade');
		            	}else{
		            		_getNext('up');
		            	}
	            	}else if (event.direction == 'down'){
	            		if (_self.orientation == 'static'){
	            			_getPrev('fade');
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
    		var current = _self.slideindex;
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
				index: next
			});

    		// when using a container, scroll the container
    		if (_self.container !== false){
    			_xPos = (_self.orientation == 'vertical') ? 0 : _xPos - Stage.width;
    			_yPos = (_self.orientation == 'vertical') ? _yPos - Stage.height : 0;

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
    		var current = _self.slideindex;
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
				index: prev
			});

    		// when using a container, scroll the container
    		if (_self.container !== false){
    			_xPos = (_self.orientation == 'vertical') ? 0 : _xPos + Stage.width;
    			_yPos = (_self.orientation == 'vertical') ? _yPos + Stage.height : 0;

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
    	if (_self.isAnimating === false){
    		_self.isAnimating = true;

    		var previous = _self.slideindex;
    		_self.slideindex = params.index;
    		var diff = Math.abs(previous - _self.slideindex);
    		if (diff > 1){
    			diff = diff*0.66; // this is used later to extend the transition animation so it's not too quick
    		}

    		// determine the direction for slide animation
    		switch (_self.orientation){
            	case 'horizontal':
            	if (_self.slideindex < previous){
            		if (_self.orientation == 'static'){
            			dir = 'fade';
	            	}else{
	            		dir = 'right';
	            	}
            	}else{
            		if (_self.orientation == 'static'){
            			dir = 'fade';
	            	}else{
	            		dir = 'left';
	            	}
            	}
            	break;

            	case 'vertical':
            	case 'static':
            	default:
            	if (_self.slideindex < previous){
            		if (_self.orientation == 'static'){
            			dir = 'fade';
	            	}else{
	            		dir = 'down';
	            	}
            	}else{
            		if (_self.orientation == 'static'){
            			dir = 'fade';
	            	}else{
	            		dir = 'up';
	            	}
            	}
            	break;
            }

    		// you need to implement this.animateOut and this.animateIn on your slide class
			if (_self.slides[previous].hasOwnProperty('animateOut')){
				_self.slides[previous].animateOut(dir);
			}

			if (_self.slides[_self.slideindex].hasOwnProperty('animateIn')){
				_self.slides[_self.slideindex].animateIn(dir);
			}

			Evt.fireEvent(_elem, Evt.SLIDE_NAVCHANGE, {
				index: _self.slideindex
			});

			// when using a container, scroll the container
    		if (_self.container !== false){
    			_xPos = (_self.orientation == 'vertical') ? 0 : -(Stage.width * _self.slideindex);
    			_yPos = (_self.orientation == 'vertical') ? -(Stage.height * _self.slideindex) : 0;

    			_self.container.tween({
    				x: _xPos,
    				y: _yPos
    			}, _self.transtime * diff, _self.easing, _self.delay, function(){
    				_self.isAnimating = false;
    			});
    		}
    	}
    }

    // this needs to be called to set the slides in the correct places
    // objParams = {
	// 		orientation: 'vertical' || 'horizontal' || 'static',
	// 		use_container: true || false
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
    	}

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
    				left: (_self.orientation == 'vertical') ? 0 : Stage.width * idx,
    				top: (_self.orientation == 'vertical') ? Stage.height * idx : 0
    			});
    		}
    	}
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
}