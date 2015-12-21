Class(function TouchUtil(){

	var _self = this,
		_trackedTouches = [],
		_boundElements = [],
		_tapThreshold = 10,
		_directionThreshold = 150;

	var disallowTouchAdd = [
		'a',
		'input',
		'button',
		'select',
		'textarea'
	];

	// TODO: add a callback for the drag/move event and figure out how to properly bind, call, and unbind it

	// bind touch events to an element
	this.bind = function(element, clickCallback, moveCallback){
		element.div.addEventListener("touchstart", _handleStart, false);
		element.div.addEventListener("touchmove", _handleMove, false);
		element.div.addEventListener("touchend", _handleEnd, false);
		element.div.addEventListener("touchleave", _handleEnd, false);
		element.div.addEventListener("touchcancel", _handleCancel, false);

		// add the element to our bound elements array with its callback
		_addBinding(element, clickCallback, moveCallback);
	};

	// remove touch events from an element
	// you still need to pass the callback in to identify what you want to unbind. this way, other functions bound to this element can still run.
	this.unbind = function(element, clickCallback, moveCallback){
		element.div.removeEventListener("touchstart", clickCallback, false);
		element.div.removeEventListener("touchmove", moveCallback, false);
		element.div.removeEventListener("touchend", clickCallback, false);
		element.div.removeEventListener("touchleave", clickCallback, false);
		element.div.removeEventListener("touchcancel", clickCallback, false);

		// remove element from list of bound elements
		_removeBinding(element, clickCallback, moveCallback);
	};

	function _handleStart(event){
		// console.log('_handleStart');
		var touches = event.changedTouches;
		// console.log(touches[0]);

		// check if the type of clicked node should be handled in a default manner
		var allowTouchAdd = true;
		for (var idx = 0; idx < disallowTouchAdd.length; idx++){
			if (touches[0].target.tagName.toLowerCase() == disallowTouchAdd[idx]){
				allowTouchAdd = false;
			}
		}

		// for now, we only want to track single touches
		// we won't run anything when there's multi-touch so that
		// pinch zoom can work without triggering a click
		if (touches.length > 1){
			allowTouchAdd = false;
		}

		// if (elements !== false){
		if (allowTouchAdd === true){
			// console.log('add touch');

			// only add touch if we found a bound element, otherwise links wouldn't work

			if (Config.touchPrevent !== false){
				event.preventDefault();
				event.stopPropagation();
			}
			
			// normally, the touch target is the target element
			var targetElement = touches[0].target;

			// see if the element clicked is bound
			var elements = _getBindings(touches[0].target);

			if (elements == false){
				// see if any of its parents are bound

				var foundparents = _findParents(targetElement);
				if (foundparents !== false){
		            for (var parent in foundparents){
		            	// the parent becomes the target element
		            	targetElement = foundparents[parent];
		            }
		        }
			}

			// push this touch into our array
			// not handling multi-touch at this time
			_addTouch(targetElement, touches[0]);
		}
	}

	function _handleMove(event){
		if (Config.touchPrevent !== false){
			event.preventDefault();
			event.stopPropagation();
		}

		var touches = event.changedTouches;
		var findID = _getTouchIndex(touches[0].identifier);

		if (findID >= 0){
			// this touch matches an existing touch
			// do something with previous x,y and new x,y at this point
			var theTouch = _getTouch(touches[0].identifier);
			
			var evt = _buildEventResponse(theTouch, false);
			// console.log(evt);

	        // pass touch data back to the correct element's callback functions
	        var elements = _getBindings(theTouch.target);
	        if (elements !== false){
	        	for (var i = 0; i < elements.length; i++){
	        		if (typeof elements[i].moveCallback == 'function'){
			        	elements[i].moveCallback(evt, event);
			        }
	        	}
	        }

			// update its values in the array
			_updateTouch(findID, touches[0]);
		}
	}

	function _handleEnd(event){
		// console.log('_handleEnd');
		if (Config.touchPrevent !== false){
			event.preventDefault();
			event.stopPropagation();
		}

		var touches = event.changedTouches;
		var findID = _getTouchIndex(touches[0].identifier);
		
		if (findID >= 0){
			// this touch matches an existing touch
			// get the touch and begin adding to our event
			var theTouch = _getTouch(touches[0].identifier);

			var evt = _buildEventResponse(theTouch);
			// console.log(evt);

	        // pass touch data back to the correct element's callback functions
	        if (evt.direction == 'tap'){
	        	// but only if it's a tap
		        var elements = _getBindings(theTouch.target);
		        if (elements !== false){
		        	for (var i = 0; i < elements.length; i++){
		        		if (typeof elements[i].clickCallback == 'function'){
				        	elements[i].clickCallback(evt, event);
				        }
		        	}
		        }
		    }

			// the touch has ended, remove it from our array
			_removeTouch(findID);
		}
	}

	// creates the custom event object that gets passed back to the bound element's callback function
	// theTouch (object): the touch object returned by the _getTouch function
	// isEnd (boolean): whether this touch event is the end of the touch (default true) set to false for dragging
	function _buildEventResponse(theTouch, isEnd){
		// find difference on X and Y axes
        // for more versatility and precision, future versions could use a vector (I think it's: start vector, end vector, subtract vectors to get direction + distance)
        var deltaX = theTouch.startX - theTouch.x;
        var deltaY = theTouch.startY - theTouch.y;

        // console.log('response: ', deltaX, deltaY);

        // initialize boolean directions
        var evt = {};
        evt.startX = theTouch.startX;
        evt.startY = theTouch.startY;
        evt.deltaX = deltaX;
        evt.deltaY = deltaY;
        evt.startX = theTouch.startX;
        evt.startY = theTouch.startY;
        evt.x = theTouch.x;
        evt.y = theTouch.y;
        evt.swiperight = false;
        evt.swipeleft = false;
        evt.swipeup = false;
        evt.swipedown = false;
        evt.tap = false;
        evt.direction = false;

        if (isEnd != false){
        	evt.type = 'end';
        }else{
        	evt.type = 'drag';
        }

        if (Math.abs(deltaX) > _tapThreshold || Math.abs(deltaY) > _tapThreshold){
            // movement

            // left/right, with threshold on up/down
            if (Math.abs(deltaX) > _tapThreshold && Math.abs(deltaY) < _directionThreshold) {
                if (theTouch.x > theTouch.startX) {
                    evt.swiperight = true;
                    evt.direction = 'right';
                } else {
                    evt.swipeleft = true;
                    evt.direction = 'left';
                }
            }

            // up/down, with threshold on left/right
            if (Math.abs(deltaY) > _tapThreshold && Math.abs(deltaX) < _directionThreshold) {
                if (theTouch.y < theTouch.startY) {
                    evt.swipeup = true;
                    evt.direction = 'up';
                } else {
                    evt.swipedown = true;
                    evt.direction = 'down';
                }
            }
        }else{
            // tap
            evt.tap = true;
            evt.direction = 'tap';
        }

        return evt;
	}

	function _handleCancel(event){
		event.preventDefault();
		event.stopPropagation();

		var touches = event.changedTouches;
		var findID = _getTouchIndex(touches[0].identifier);

		if (findID >= 0){
			// this touch matches an existing touch
			// the touch has ended, remove it from our array
			_removeTouch(findID);
		}
	}

	// add a new touch to our tracked touches array
	function _addTouch(element, touch){
		_trackedTouches.push({
			id: touch.identifier,
			startX: touch.clientX,
			startY: touch.clientY,
			x: touch.clientX,
			y: touch.clientY,
			target: element,
			touchTarget: touch.target,
			touch: touch
		});
	}

	// update the x and y coordinates of an existing touch
	function _updateTouch(id, touch){
		_trackedTouches[id].x = touch.clientX;
		_trackedTouches[id].y = touch.clientY;
	}

	// stop tracking a touch
	function _removeTouch(id){
		_trackedTouches.splice(id, 1);
	}

	function _getTouch(touchID){
		for (var i = 0; i < _trackedTouches.length; i++){
			if (_trackedTouches[i].id == touchID){
				return _trackedTouches[i];

				// now you've got the touch
				// https://www.youtube.com/watch?v=A52--FKUQgU
			}
		}

		return false; // not found
	}

	// find the array index of a touch by its Touch.identifier
	function _getTouchIndex(touchID){
		for (var i = 0; i < _trackedTouches.length; i++){
			if (_trackedTouches[i].id == touchID){
				return i;
			}
		}

		return -1; // not found
	}

	// find all bound elements by comparing to the touch event target
	function _getBindings(touchtarget){
		var bindings = [];
		for (var i = 0; i < _boundElements.length; i++){
			if (touchtarget == _boundElements[i].element.div){
				bindings.push(_boundElements[i]);
			}
		}

		if (bindings.length > 0){
			// return all found bindings
			return bindings;
		}

		return false; // not found
	}

	// add a single bound element to the array
	function _addBinding(element, clickCallback, moveCallback){
		_boundElements.push({
			element: element,
			clickCallback: clickCallback,
			moveCallback: moveCallback
		});
	}

	// remove a single bound element from the array
	function _removeBinding(element, clickCallback, moveCallback){
		for (var i = 0; i < _boundElements.length; i++){
			if (element == _boundElements[i].element && clickCallback == _boundElements[i].clickCallback && moveCallback == _boundElements[i].moveCallback){
				_boundElements.splice(i, 1);
			}
		}
	}

	// find the specific parent $bitObject of a child $bitObject by traversing up the tree
    // @param DOM Object child: the child element you want to begin with
    // @param DOM Object parent: the parent you're looking for
    function _findParent(child, parent){
        // console.log('_findParent:');
        // console.log(child);
        // console.log(parent);

        var level = 0;
        for (var element = child; element; element = element.parentNode) {
            if (element === parent) {
                // console.log('found parent:');
                // console.log(element);

                // parent found among ancestors
                // return element and its relative level for use in comparisons
                return {element: element, level: level};
            }
            level++;
        }

        // parent not found in child's ancestors
        return false;
    }

    // collect all parent elements of the given child that are within the set of bound elements, in order from nearest to farthest
    // @param DOM Object child: the child element you want to begin with
    function _findParents(child){
        var parents = [];

        for (var i in _boundElements) {
            var found = _findParent(child, _boundElements[i].element.div);

            if (found !== false){
                parents.push(_boundElements[i].element.div);
            }
        }

        if (parents.length > 0){
            // sort from nearest to farthest ancestor
            return parents.sort(_compareLevels);
        }else{
            return false;
        }
    }

    // comparison function for _findParents sorting
    function _compareLevels(a, b) {
        if (a.level < b.level) {
            return -1;
        }

        if (a.level > b.level) {
            return 1;
        }

        // a must be equal to b
        return 0;
    }

}, 'static');