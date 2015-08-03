Class(function TouchUtil(){

	var _self = this,
		_trackedTouches = [],
		_boundElements = [],
		_tapThreshold = 20,
		_directionThreshold = 150;

	var unPrevent = [
		'a',
		'input',
		'button',
		'select',
		'textarea'
	];

	// bind touch events to an element
	this.bind = function(element, callback){
		element.div.addEventListener("touchstart", _handleStart, false);
		element.div.addEventListener("touchmove", _handleMove, false);
		element.div.addEventListener("touchend", _handleEnd, false);
		element.div.addEventListener("touchleave", _handleEnd, false);
		element.div.addEventListener("touchcancel", _handleCancel, false);

		// add the element to our bound elements array with its callback
		_addBinding(element, callback);
	};

	// remove touch events from an element
	// you still need to pass the callback in to identify what you want to unbind. this way, other functions bound to this element can still run.
	this.unbind = function(element, callback){
		element.div.removeEventListener("touchstart", callback , false);
		element.div.removeEventListener("touchmove", callback , false);
		element.div.removeEventListener("touchend", callback , false);
		element.div.removeEventListener("touchleave", callback , false);
		element.div.removeEventListener("touchcancel", callback , false);

		// remove element from list of bound elements
		_removeBinding(element, callback);
	};

	function _handleStart(event){
		var touches = event.changedTouches;

		// check if the type of clicked node should be handled in a default manner
		var prevent = true;
		for (var idx = 0; idx < unPrevent.length; idx++){
			if (touches[0].target.tagName.toLowerCase() == unPrevent[idx]){
				prevent = false;
			}
		}

		// if (elements !== false){
		if (prevent === true){
			// only prevent default if we found a bound element, otherwise links wouldn't work
			event.preventDefault();
			event.stopPropagation();
			
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
		event.preventDefault();
		event.stopPropagation();

		var touches = event.changedTouches;
		var findID = _getTouchIndex(touches[0].identifier);

		if (findID >= 0){
			// this touch matches an existing touch
			// could do something with previous x,y and new x,y at this point
			// update its values in the array
			_updateTouch(findID, touches[0]);
		}
	}

	function _handleEnd(event){
		event.preventDefault();
		event.stopPropagation();

		var touches = event.changedTouches;
		var findID = _getTouchIndex(touches[0].identifier);
		
		if (findID >= 0){
			// this touch matches an existing touch
			// get the touch and begin adding to our event
			var theTouch = _getTouch(touches[0].identifier);

			// find difference on X and Y axes
	        // for more versatility and precision, future versions could use a vector (I think it's: start vector, end vector, subtract vectors to get direction + distance)
	        var deltaX = theTouch.startX - theTouch.x;
	        var deltaY = theTouch.startY - theTouch.y;

	        // initialize boolean directions
	        var evt = {};
	        evt.swiperight = false;
	        evt.swipeleft = false;
	        evt.swipeup = false;
	        evt.swipedown = false;
	        evt.tap = false;
	        evt.direction = false;

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

	        // pass touch data back to the correct element's callback functions
	        var elements = _getBindings(theTouch.target);
	        if (elements !== false){
	        	for (var i = 0; i < elements.length; i++){
	        		if (typeof elements[i].callback == 'function'){
			        	elements[i].callback(evt, event);
			        }
	        	}
	        }

			// the touch has ended, remove it from our array
			_removeTouch(findID);
		}
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
			startX: touch.pageX,
			startY: touch.pageY,
			x: touch.pageX,
			y: touch.pageY,
			target: element,
			touchTarget: touch.target
		});
	}

	// update the x and y coordinates of an existing touch
	function _updateTouch(id, touch){
		_trackedTouches[id].x = touch.pageX;
		_trackedTouches[id].y = touch.pageY;
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
	function _addBinding(element, callback){
		_boundElements.push({
			element: element,
			callback: callback
		});
	}

	// remove a single bound element from the array
	function _removeBinding(element, callback){
		for (var i = 0; i < _boundElements.length; i++){
			if (element == _boundElements[i].element && callback == _boundElements[i].callback){
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