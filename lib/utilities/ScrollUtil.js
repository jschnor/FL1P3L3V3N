Static(function ScrollUtil() {

    var _self   = this;
    var _new, _speed, _direction;
    var _startX,
        _startY,
        _changeX,
        _changeY,
        _touchTarget,
        _locked         = false;
    var _lastwheeltime  = 0;
    var _elements       = [];
    this.touch          = {};

    (function() {

    })();

    function _onMouseScroll(e) {
        // console.log('on mouse scroll');
        // console.log(e);
        // console.log(e.target);
        // var _id = _elements.indexOf(elem);
        // var _elem = _elements.splice(_id, 1);
        // cross-browser wheel delta
        

        _direction = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

        // Returns +1 for a single wheel roll 'up', -1 for a single roll 'down'

        // normalize scroll across os/browser
        var w = e.wheelDelta, d = e.detail;
        var _amount;

        if (d) {
            if (w) {
                _amount = (w/d/40*d) > 0 ? 1 : -1; // Opera

            } else {
                _amount = Device.system.os == 'mac' && Device.browser.firefox ? -d/3 : -d/3; // Firefox; TODO: do not /3 for OS X

            }
        } else {
            _amount = Device.system.os == 'mac' && Device.browser.chrome ? w/3 : w/120; // IE/Safari/Chrome; TODO: /3 for Chrome OS X
        }
        
        if (Config.DEBUG.all || Config.DEBUG.scroll) {
            // console.log(Device);
            console.log(_direction);

            console.log('e.detail');
            console.log(e.detail);
            console.log('e.wheelDelta');
            console.log(e.wheelDelta);
            console.log('_amount');
            console.log(_amount);
            // console.log('d: '+d);
            // console.log('w: '+w);
            console.log('================');
        }
        // _now            = e.timeStamp;
        // _speed          = Math.round(1000 / (_now - _lastwheeltime));
        // _lastwheeltime  = _now;
        // var _amount     = _speed * _direction;

        // var __scrolldirection = _direction == 1 ? 'up' : 'down';
        e.amount = _amount;

        if (_direction >= 1) {
            for (var i in _elements) {
                if (_elements[i].elem !== undefined) {
                    e.direction = 'up';
                    _elements[i].callback(e);
                }

            }
            return;
        }

        if (_direction <= -1) {
            for (var ii in _elements) {

                if (_elements[ii].elem !== undefined) {
                    e.direction = 'down';
                    _elements[ii].callback(e);
                }
            }
            return;
        }
    }

    this.bind = function(elem, callback) {
        // console.log('bind');
        // console.log(elem);
        _elements.push({elem: elem, callback: callback});

        Evt.subscribe(elem, Evt.MOUSE_SCROLL, _onMouseScroll);
    };

    this.unbind = function(elem) {
        // Note: browser support for indexOf is limited, it is not supported in IE7-8.
        // Then remove it with splice:

        for (var i in _elements) {

            if (_elements[i].elem == elem) {
                __elem = _elements.splice(_elements[i], 1);
                Evt.removeEvent(__elem, Evt.MOUSE_SCROLL, _onMouseScroll);

                if (Config.DEBUG.all || Config.DEBUG.scroll) {
                    console.log('UNBIND :: _elements[i]');
                    console.log(_elements[i]);
                }
            }
        }
    };

    this.scrollTop = function(){
        return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    };
});