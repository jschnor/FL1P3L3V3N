Class(function TouchUtilOld() {
console.log('SHOULD NOT SEE ME');
    var _self = this;
    var _elements = [];
    var _startX,
        _startY,
        _changeX,
        _changeY,
        _touchTarget,
        _locked = false;
        _threshold = Device.mobile ? 10 : 10;


    /*(function() {

    })();*/

    function _tap(event) {
        // if we prevent default on a tap, it prevents the user from focusing inputs.
        // event.preventDefault();

        // initialize changeX/Y along with startX/Y so a motionless tap does not register as a swipe
        _changeX = _startX = event.changedTouches[0].pageX;
        _changeY = _startY = event.changedTouches[0].pageY;
    }

    function _drag(event) {
        event.preventDefault();

        // find updated X and Y coordinates
        _changeX = event.changedTouches[0].pageX;
        _changeY = event.changedTouches[0].pageY;
    }

    function _release(event) {
        if (_locked){
            event.preventDefault();
            return;
        }

        // find difference on X and Y axes
        // for more versatility and precision, future versions could use a vector (I think it's: start vector, end vector, subtract vectors to get direction + distance)
        var _totalX = _startX - _changeX;
        var _totalY = _startY - _changeY;

        // console.log(_totalX+'/'+_totalY);

        // initialize boolean directions
        event.swiperight = false;
        event.swipeleft = false;
        event.swipeup = false;
        event.swipedown = false;
        event.tap = false;
        event.direction = false;

        if (Math.abs(_totalX) > 20 || Math.abs(_totalY) > 20){
            // movement

            // left/right, with threshold on up/down
            if (Math.abs(_totalX) > 20 && Math.abs(_totalY) < 150) {
                if (_changeX > _startX) {
                    // console.log('SWIPE RIGHT');
                    event.swiperight = true;
                    event.direction = 'right';
                    Evt.fireEvent(window, 'swiperight', event);
                } else {
                    // console.log('SWIPE LEFT');
                    event.swipeleft = true;
                    event.direction = 'left';
                    Evt.fireEvent(window, 'swipeleft', event);
                }
            }

            // up/down, with threshold on left/right
            if (Math.abs(_totalY) > 20 && Math.abs(_totalX) < 150) {
                if (_changeY < _startY) {
                    // console.log('SWIPE UP');
                    event.swipeup = true;
                    event.direction = 'up';
                    Evt.fireEvent(window, 'swipeup', event);
                } else {
                    // console.log('SWIPE DOWN');
                    event.swipedown = true;
                    event.direction = 'down';
                    Evt.fireEvent(window, 'swipedown', event);
                }
            }
        }else{
            // tap
            // console.log('TAP');
            event.tap = true;
            event.direction = 'tap';
            Evt.fireEvent(window, 'tap', event);
        }

        _touchTarget = event.changedTouches[0].target;
        // console.log("touch target:");
        // console.log(_touchTarget);

        // need to check if the target event is the same as the bound element
        // in some cases, the target could be a child of the bound element, so we need to traverse up the tree and look for it
        // if we find the parent, we trigger the bound callback function
        // we also need to ensure we can interrupt the triggering of a function on a higher parent when a lower parent has a bound function
        // this is controlled by setting the bubble argument in the .bind() function (default is true)

        var foundparents = _findParents(_touchTarget);

        if (foundparents !== false){
            for (var parent in foundparents){
                foundparents[parent].callback(event);

                if (foundparents[parent].bubble === false){
                    return;
                }
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

        for (var i in _elements) {
            var found = _findParent(child, _elements[i].elem.div);

            if (found !== false){
                found.bitobj = _elements[i].elem;
                found.callback = _elements[i].callback;
                found.bubble = _elements[i].bubble;
                parents.push(found);
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

    // this should only be bound once to a global container element
    this.bindStage = function(){
        Evt.subscribe(Stage, 'touchstart', _tap);
        Evt.subscribe(Stage, 'touchmove', _drag);
        Evt.subscribe(Stage, 'touchend', _release);
    }

    // this gets bound to any element
    // @param $bitObject elem: the element you want to bind to
    // @param function callback: the function to run when the event occurs. receives the touch event as a parameter.
    // @param boolean bubble: whether to allow the event to bubble up the list of bound elements. default is true, meaning functions will be called all the way up the DOM tree.
    this.bind = function(elem, callback, bubble) {
        // console.log('bind');
        // console.log(elem);

        if (typeof bubble === 'undefined'){
            bubble = true;
        }

        _elements.push({elem: elem, callback: callback, bubble: bubble});
    };

    this.unbind = function(elem) {
        // Note: browser support for indexOf is limited, it is not supported in IE7-8.
        // Then remove it with splice:

        for (var i in _elements) {

            if (_elements[i].elem == elem) {

                __elem = _elements.splice(_elements[i], 1);

                Evt.removeEvent(elem, 'touchstart', _tap);
                Evt.removeEvent(elem, 'touchmove', _drag);
                Evt.removeEvent(elem, 'touchend', _release);

                if (Config.DEBUG.all || Config.DEBUG.touch) {
                    console.log('UNBIND :: _elements[i]');
                    console.log(_elements[i]);
                }
            }

        }
    };

    // this.lock = function(){
    //     _locked = true;
    // };

    // this.unlock = function(){
    //     _locked = false;
    // };
}, 'static');