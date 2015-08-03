Class(function Evt() {
// function $events() {

    var _self = this;
    var _EventsArray;
    var _EventsObj    = {};
    var _IEEventsObj  = {};
    var _params;

    var _eObj = [];
    this.events = {};

    this.BLUR = 'blur';
    this.FOCUS = 'focus';
    this.FOCUS_IN = 'focusin';
    this.FOCUS_OUT = 'focusout';
    this.LOAD = 'load';
    this.RESIZE = 'resize';
    this.SCROLL = 'scroll';
    this.UNLOAD = 'unload';
    this.CLICK = 'click';
    this.DBL_CLICK = 'dblclick';
    this.MOUSE_DOWN = 'mousedown';
    this.MOUSE_UP = 'mouseup';
    this.MOUSE_MOVE = 'mousemove';
    this.MOUSE_OVER = 'mouseover';
    this.MOUSE_OUT = 'mouseout';
    this.MOUSE_ENTER = 'mouseenter';
    this.MOUSE_LEAVE = 'mouseleave';
    // this.MOUSE_LEAVE = 'mouseleave';
    this.CHANGE = 'change';
    this.SELECT = 'select';
    this.SUBMIT = 'submit';
    this.KEY_DOWN = 'keydown';
    this.KEY_PRESS = 'keypress';
    this.KEY_UP = 'keyup';
    this.ERROR = 'error';
    this.CUSTOM = 'custom';
    // CUSTOM EVENTS
    this.NAV_SELECT = 'navselect';
    this.TAP = 'tap';
    this.SWIPE_UP = 'swipeup';
    this.SWIPE_DOWN = 'swipedown';
    this.SWIPE_LEFT = 'swipeleft';
    this.SWIPE_RIGHT = 'swiperight';
    this.CHANGE = 'change';
    this.ORIENTATION = 'orientation';
    this.BROWSER_FOCUS = 'browserfocus';
    this.MOUSE_SCROLL = Device.browser.firefox ? 'DOMMouseScroll' : 'mousewheel';
    this.BG_LOADED = 'bgloaded';

    (function() {
        // initialization
        _init();
    })();

    function _init() {
        
        /*creating the objects of the Dom Events, cross-browser*/

        var DOMEventsStr     =  'blur focus focusin focusout load resize scroll unload click canplay ended';
            DOMEventsStr     += 'dblclick mousedown mouseup mousemove mouseover mouseout mouseenter ';
            DOMEventsStr     += 'mouseleave change select submit keydown keypress keyup error mousewheel ';
            DOMEventsStr     += 'DOMMouseScroll touchstart touchmove touchend timeupdate';

        _EventsArray          = DOMEventsStr.split(' ');

        for (var i = 0; i < _EventsArray.length; i++) {
            
            _EventsObj[_EventsArray[i]]         = i + 1;
            _IEEventsObj["on"+_EventsArray[i]]  = i + 1;

        }

    }

    /*function to check wheter the given event is the custom event or dom event*/
    function _checkDomEvent(e) {
        
        if (document.addEventListener && _EventsObj[e] === undefined) {

            return false;

        }
        else if (document.attachEvent && _IEEventsObj["on"+e] === undefined) {

            return false;

        }

        return true;
    }

    /*start of the Event utility that provides addition of events*/

    this.subscribe = function(elem, evt, callback) {
        var _elem;

        if (elem instanceof $bitObject) {
            _elem = elem.div;
        } else {
            _elem = elem;

        }

        var isDOMEvent = _checkDomEvent(evt) || _self[evt];

        if (typeof evt !== undefined && typeof evt == "string") {
            if (isDOMEvent) {
                // attach a function to a built-in event
                if (_elem.addEventListener) {
                    _elem.addEventListener(evt, callback, false);
                } else {
                    _elem.attachEvent('on' + evt, callback);
                    
                }
            } else {
                // attach a function to a custom event
                _self.events[evt] = callback;
            }
        }
    };

    // special resize event which can throttle the function call
    // set throttle to boolean false to run the function at normal intervals
    this.resize = function(callback, throttle) {
        var timeout = null;

        if (throttle !== false){
            _callback = function(){
                clearTimeout(timeout);
                timeout = setTimeout(callback, 100); // limit function calls to this interval (milliseconds)
            };
        }else{
            _callback = callback;
        }

        if (window.addEventListener){
            window.addEventListener('resize', _callback, false);
        } else {
            window.attachEvent('onresize', _callback);
        }
    };

    // this.fireEvent = function(elem, evt, params) {
    this.fireEvent = function(elem, evt, params) {
        var _params;

        if (!params) {
            _params = null;
        }

        _params = arguments[2];

        var isDOMEvent = _checkDomEvent(evt) || _self[evt];

        if (isDOMEvent) {
            for (var i = 0; i < _eObj.length; i++) {
                if (_eObj[i].evt == evt) {
                    // run the callback for a built-in event
                    if (typeof _eObj[i].callback == 'function') {
                        _eObj[i].callback(_params);
                    }
                }
            }
        } else {
            // run the callback for a custom event
            if (typeof _self.events[evt] == 'function') {
                _self.events[evt](_params);
            }
        }

    };

    this.removeEvent = function(elem, evt, callback, log) {
        if (elem.detachEvent) {
            elem.detachEvent( 'on'+evt, elem[evt+callback] );
            elem[evt+callback] = null;
        } else {
            if (elem.removeEventListener){
                elem.removeEventListener( evt, callback, false );
            } else {
                // apparently this doesn't do JACK
                for (var e in _self.events){
                    if (e == evt && _self.events[e] == callback){
                        _self.events[e] = null;
                    }
                }
            }
        }
    }

}, 'static');