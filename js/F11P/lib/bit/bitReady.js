bit.ready(function() {

    window.__body   = $(document.getElementsByTagName("body")[0]);
    window.Stage    = __body.create("#Stage");

    Stage.width     = window.innerWidth || document.documentElement.offsetWidth || document.body.clientWidth;
    Stage.height    = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    
    // globally bind touch events
    if (Device.mobile) {
        TouchUtil.bindStage();
    }

    window.onresize = function () {
        if (Device.mobile){
            // reposition; helps when user opens address bar
            document.body.scrollTop = 0;
        }

        Stage.width     = window.innerWidth || document.documentElement.offsetWidth || document.body.clientWidth;
        Stage.height    = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        // Device.mobile ? Stage.height += '10px' : Stage.height = Stage.height;
        // console.log('resize: '+Stage.width+'x'+Stage.height);

        Evt.fireEvent(window, Evt.RESIZE);
    };

    (function () {
        // var b = Date.now();
        var _date = Date.now();
        var _visibility;

        setTimeout(function () {
            var _hiddenTypes = ["hidden", "msHidden", "webkitHidden"];
            var _htype, _vischange;
            (function () {
                for (var key in _hiddenTypes) {
                    if (document[_hiddenTypes[key]] !== "undefined") {
                        _htype = _hiddenTypes[key];
                        switch (_htype) {
                            case "hidden":
                                _vischange = "visibilitychange";
                                break;
                            case "msHidden":
                                _vischange = "msvisibilitychange";
                                break;
                            case "webkitHidden":
                                _vischange = "webkitvisibilitychange";
                                break;
                            }
                            return;
                    }
                }
            })();
            if (typeof document[_htype] === "undefined") {
                if (Device.browser.ie) {
                    document.onfocus = focus;
                    document.onblur = blur;
                } else {
                    window.onfocus = focus;
                    window.onblur = blur;
                }
            } else {
                document.addEventListener(_vischange, function () {
                    var _newdate = Date.now();
                    if (_newdate - _date > 10) {
                        if (document[_htype] === false) {
                            focus();
                        } else {
                            blur();
                        }
                    }
                    _date = _newdate;
                })
            }
        }, 250);
        
        // checks for IE and Chromium versions
        if (window.addEventListener) {

            // bind focus event
            window.addEventListener("focus", function (event) {

                // tween resume() code goes here
                setTimeout(function(){                 
                     focus();
                },300);

            }, false);

            // bind blur event
            window.addEventListener("blur", function (event) {

                // tween pause() code goes here
                 blur();

            }, false);

        } else {

            // bind focus event
            window.attachEvent("focus", function (event) {

                // tween resume() code goes here
                setTimeout(function(){             
                     focus();
                },300);

            });

            // bind focus event
            window.attachEvent("blur", function (event) {

                // tween pause() code goes here
                // console.log("blur");
                blur();

            });
        }

        function focus() {
            if (_visibility != "focus") {
                // FlipEvents._fireEvent(FlipEvents.BROWSER_FOCUS, {
                //     type: "focus"
                // })
                Evt.fireEvent(window, Evt.BROWSER_FOCUS, {
                    type: 'focus'
                });
                // console.log('focus');
                // alert('focus');
            }
            _visibility = "focus";
        }

        function blur() {
            if (_visibility != "blur") {
                // FlipEvents._fireEvent(FlipEvents.BROWSER_FOCUS, {
                //     type: "blur"
                // })
                Evt.fireEvent(window, Evt.BROWSER_FOCUS, {
                    type: 'blur'
                });
                // console.log('blur');
                // alert('blur');
            }
            _visibility = "blur";
        }
    })();
});