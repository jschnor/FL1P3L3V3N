Class(function bit() {

    var _self = this;
    var _arg = [];

    (function() {
        _init();
    })();

    function _init() {
        if (document.addEventListener) { //check for Mozilla or Opera
            document.addEventListener('DOMContentLoaded', _domReadyCallback, false);
        } else {
            if (document.attachEvent) {   // IE before version 9
                document.attachEvent('DOMContentLoaded', _domReadyCallback);
            }
        }
    }

    function _domReadyCallback() {
        if (window.removeEventListener) {
            window.removeEventListener("DOMContentLoaded", _domReadyCallback, false);
        }

        for (var i = 0; i < _arg.length; i++) {
            _arg[i]();
        }

        _arg        = null;
        _self.READY = true;
        
        if (window.Start) {
            new window.Start();
        }
    }
    
    this.ready = function(callback) {
        if (this.READY) {
            return callback();
        }
        _arg.push(callback);
    };
    
    this.$ = function(selector, type, isself) {

            var _isself = arguments[arguments.length - 1] == '_self';
            // console.log('######## ARGS ########');
            // console.log(arguments[arguments.length - 1]);
            if (_isself) {
                type = null;
            }

            // console.log('bit selector');
            // console.log(selector);
            // console.log(_isself);
            // return new F11PObject(selector, type, exists);
            // return new F11PObject(selector, type, exists);
            return new $bitObject(selector, type, _isself);
        };
        this.$.fn = $bitObject.prototype;

         window.$ = this.$;

    window.$ = this.$;

}, 'static');
// initialize static $bit
// var bit = new $bit();
// window.bit = new $bit();