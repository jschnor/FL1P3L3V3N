Class(function Mobile() {

    var _self = this;
    var i = true;
    var h = {};
    if (Device.mobile){

        this.phone = Device.mobile.phone;
        this.tablet = Device.mobile.tablet;
        this.orientation = Math.abs(window.orientation) == 90 ? "landscape" : "portrait";

        this.os = (function () {
            // console.log(Device)
            if (Device.detect(["ipad", "iphone"])) {
                // console.log("iOS");
                return "iOS";
            }
            if (Device.detect(["android", "kindle"])) {
                // console.log("Android");
                return "Android";
            }
            if (Device.detect("windows phone")) {
                // console.log("Windows");
                return "Windows";
            }
            if (Device.detect("blackberry")) {
                // console.log("Blackberry");
                return "Blackberry";
            }
            // console.log("Unknown");
            return "Unknown";
        })();

        this.version = (function () {
            try {
                if (_self.os == "iOS") {
                    var _agent = Device.agent.split("os ")[1].split("_");
                    var _version = _agent[0];
                    var _release = _agent[1].split(" ")[0];
                    
                    // console.log(Number(_version + "." + _release));

                    return Number(_version + "." + _release);
                }
                if (_self.os == "Android") {
                    var k = Device.agent.split("android ")[1].split(";")[0];
                    if (k.length > 3) {
                        k = k.slice(0, -2);
                    }
                    return Number(k);
                }
                if (_self.os == "Windows") {
                    return Number(Device.agent.split("windows phone ")[1].split(";")[0]);
                }
            } catch (n) {}
            return -1;
        })();

        this.browser = (function () {
            if (_self.os == "iOS") {
                return Device.detect("crios") ? "Chrome" : "Safari";
            }
            if (_self.os == "Android") {
                if (Device.detect("chrome")) {
                    return "Chrome";
                }
                if (Device.detect("firefox")) {
                    return "Firefox";
                }
                return "Browser";
            }
            if (_self.os == "Windows") {
                return "IE";
            }
            return "Unknown";
        })();

        bit.ready(function(){
            // console.log('Mobile Bit Ready')
            window.addEventListener("orientationchange", _onOrientationChange);
            // window.addEventListener("touchstart", _handleMobileTouch);
            // window.addEventListener("touchmove", _handleMobileTouchMove);

            window.onresize = _onResize;

        });

        function _handleMobileTouch(e) {
            // var n = Utils.touchEvent(e);

            // console.log('touch');

            var l = e.target;
            var k = l.nodeName == "INPUT" || l.nodeName == "TEXTAREA" || l.nodeName == "SELECT";
            if (_self.allowScroll) {
                return;
            }
            if (i) {
                return e.preventDefault();
            }
            var j = true;
            var l = e.target;

            while (l.parentNode) {
                if (k) {
                    j = false;
                }
                if (l._scrollParent) {
                    j = false;
                    h.target = l;
                    h.y = n.y;
                }
                l = l.parentNode;
            }
            if (j) {
                e.preventDefault();
            }
        }
        function _handleMobileTouchMove(e) {
            // var m = Utils.touchEvent(l);
            // console.log('touch move');
            if (e.allowScroll) {
                return;
            }
            if (h.target) {
                var k = h.target;
                var j = k.__scrollHeight || Number((k.style.height || "0px").slice(0, -2));
                k.__scrollheight = j;
                if (m.y < h.y) {
                    if (Math.round(k.scrollTop) == Math.round(j / 2)) {
                        e.preventDefault();
                    }
                } else {
                    if (k.scrollTop == 0) {
                        e.preventDefault();
                    }
                }
            }
        }
    }

        // TO DO: figure out versioning for mobile
        // some example implementation of this is below

        // if (Device.mobile) {
        //     this.phone = Device.mobile.phone;
        //     this.tablet = Device.mobile.tablet;
        //     this.orientation = Math.abs(window.orientation) == 90 ? "landscape" : "portrait";
        //     this.os = (function () {
        //         if (Device.detect(["ipad", "iphone"])) {
        //             return "iOS"
        //         }
        //         if (Device.detect(["android", "kindle"])) {
        //             return "Android"
        //         }
        //         if (Device.detect("windows phone")) {
        //             return "Windows"
        //         }
        //         if (Device.detect("blackberry")) {
        //             return "Blackberry"
        //         }
        //         return "Unknown"
        //     })();



        //     this.version = (function () {
        //         try {
        //             if (e.os == "iOS") {
        //                 var l = Device.agent.split("os ")[1].split("_");
        //                 var j = l[0];
        //                 var m = l[1].split(" ")[0];
        //                 return Number(j + "." + m)
        //             }
        //             if (e.os == "Android") {
        //                 var k = Device.agent.split("android ")[1].split(";")[0];
        //                 if (k.length > 3) {
        //                     k = k.slice(0, -2)
        //                 }
        //                 return Number(k)
        //             }
        //             if (e.os == "Windows") {
        //                 return Number(Device.agent.split("windows phone ")[1].split(";")[0])
        //             }
        //         } catch (n) {}
        //         return -1
        //     })();
        //     this.browser = (function () {
        //         if (e.os == "iOS") {
        //             return Device.detect("crios") ? "Chrome" : "Safari"
        //         }
        //         if (e.os == "Android") {
        //             if (Device.detect("chrome")) {
        //                 return "Chrome"
        //             }
        //             if (Device.detect("firefox")) {
        //                 return "Firefox"
        //             }
        //             return "Browser"
        //         }
        //         if (e.os == "Windows") {
        //             return "IE"
        //         }
        //         return "Unknown"
        //     })();
        //     Flip.ready(function () {
        //         window.addEventListener("orientationchange", d);
        //         window.addEventListener("touchstart", c);
        //         window.addEventListener("touchmove", g);
        //         window.onresize = b
        //     });

        //     function b() {
        //         if (!e.allowScroll) {
        //             document.body.scrollTop = 0
        //         }
        //         setTimeout(function () {
        //             Stage.width = window.innerWidth;
        //             Stage.height = window.innerHeight;
        //             e.events.fire(FlipEvents.RESIZE)
        //         }, 50)
        //     }
        //     function d() {
        //         e.orientation = Math.abs(window.orientation) == 90 ? "landscape" : "portrait";
        //         setTimeout(function () {
        //             Stage.width = window.innerWidth;
        //             Stage.height = window.innerHeight;
        //             FlipEvents._fireEvent(FlipEvents.ORIENTATION, {
        //                 orientation: e.orientation
        //             })
        //         }, 50)
        //     }
        //     function c(m) {
        //         var n = Utils.touchEvent(m);
        //         var l = m.target;
        //         var k = l.nodeName == "INPUT" || l.nodeName == "TEXTAREA" || l.nodeName == "SELECT";
        //         if (e.allowScroll) {
        //             return
        //         }
        //         if (i) {
        //             return m.preventDefault()
        //         }
        //         var j = true;
        //         var l = m.target;
        //         while (l.parentNode) {
        //             if (k) {
        //                 j = false
        //             }
        //             if (l._scrollParent) {
        //                 j = false;
        //                 h.target = l;
        //                 h.y = n.y
        //             }
        //             l = l.parentNode
        //         }
        //         if (j) {
        //             m.preventDefault()
        //         }
        //     }
        //     function g(l) {
        //         var m = Utils.touchEvent(l);
        //         if (e.allowScroll) {
        //             return
        //         }
        //         if (h.target) {
        //             var k = h.target;
        //             var j = k.__scrollHeight || Number((k.style.height || "0px").slice(0, -2));
        //             k.__scrollheight = j;
        //             if (m.y < h.y) {
        //                 if (Math.round(k.scrollTop) == Math.round(j / 2)) {
        //                     l.preventDefault()
        //                 }
        //             } else {
        //                 if (k.scrollTop == 0) {
        //                     l.preventDefault()
        //                 }
        //             }
        //         }
        //     }
        // }

    function _onResize(e){
        // console.log(e)
        // reposition; helps when user opens address bar
        if (!e.allowScroll) {
            document.body.scrollTop = 0;
        }
        // document.body.scrollTop = 0;

        setTimeout(function () {
            // console.log('derpitus');
            Stage.width = window.innerWidth;
            Stage.height = window.innerHeight;
            Evt.fireEvent(window, Evt.RESIZE);
        }, 50);
    }

    function _onOrientationChange() {

        _self.orientation = Math.abs(window.orientation) == 90 ? "landscape" : "portrait";

        // console.log('MOBILE :: ' + _self.orientation);

        setTimeout(function () {
            Stage.width = window.innerWidth;
            Stage.height = window.innerHeight;

            Evt.fireEvent(window, Evt.ORIENTATION, {
                orientation: _self.orientation
            });
        }, 50);

        // switch(window.orientation) {
        //     case -90:
        //     case 90:
        //         console.log('landscape');
        //         // _onResize();
        //         this.orientation = 'landscape';
        //         // document.body.scrollTop = 15;

        //         break;
        //     default:
        //         console.log('portrait');
        //         // _onResize();
        //         this.orientation = 'portrait';
        //         break;
        // }
    }

    // this.overflowScroll = function (k, j, m) {
    //     if (!Device.mobile) {
    //         return false;
    //     }
    //     var l = {
    //         "-webkit-overflow-scrolling": "touch"
    //     };
    //     if ((!j && !m) || (j && m)) {
    //         l.overflow = "scroll";
    //     }
    //     if (!j && m) {
    //         l.overflowY = "scroll";
    //         l.overflowX = "hidden";
    //     }
    //     if (j && !m) {
    //         l.overflowX = "scroll";
    //         l.overflowY = "hidden";
    //     }
    //     k.css(l);
    //     k.div._scrollParent = true;
    //     i = false;
    // };
}, 'static');