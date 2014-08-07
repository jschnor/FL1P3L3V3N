Class(function Mobile() {
    Inherit(this, Events);
    var e = this;
    var a;
    var i = true;
    var h = {};
    this.sleepTime = 10000;
    if (Device.mobile) {
        setInterval(f, 250);
        this.phone = Device.mobile.phone;
        this.tablet = Device.mobile.tablet;
        this.orientation = Math.abs(window.orientation) == 90 ? "landscape" : "portrait";
        this.os = (function () {
            if (Device.detect(["ipad", "iphone"])) {
                return "iOS"
            }
            if (Device.detect(["android", "kindle"])) {
                return "Android"
            }
            if (Device.detect("windows phone")) {
                return "Windows"
            }
            if (Device.detect("blackberry")) {
                return "Blackberry"
            }
            return "Unknown"
        })();
        this.version = (function () {
            try {
                if (e.os == "iOS") {
                    var l = Device.agent.split("os ")[1].split("_");
                    var j = l[0];
                    var m = l[1].split(" ")[0];
                    return Number(j + "." + m)
                }
                if (e.os == "Android") {
                    var k = Device.agent.split("android ")[1].split(";")[0];
                    if (k.length > 3) {
                        k = k.slice(0, -2)
                    }
                    return Number(k)
                }
                if (e.os == "Windows") {
                    return Number(Device.agent.split("windows phone ")[1].split(";")[0])
                }
            } catch (n) {}
            return -1
        })();
        this.browser = (function () {
            if (e.os == "iOS") {
                return Device.detect("crios") ? "Chrome" : "Safari"
            }
            if (e.os == "Android") {
                if (Device.detect("chrome")) {
                    return "Chrome"
                }
                if (Device.detect("firefox")) {
                    return "Firefox"
                }
                return "Browser"
            }
            if (e.os == "Windows") {
                return "IE"
            }
            return "Unknown"
        })();
        Flip.ready(function () {
            window.addEventListener("orientationchange", d);
            window.addEventListener("touchstart", c);
            window.addEventListener("touchmove", g);
            window.onresize = b
        });

        function b() {
            if (!e.allowScroll) {
                document.body.scrollTop = 0
            }
            setTimeout(function () {
                Stage.width = window.innerWidth;
                Stage.height = window.innerHeight;
                e.events.fire(FlipEvents.RESIZE)
            }, 50)
        }
        function d() {
            e.orientation = Math.abs(window.orientation) == 90 ? "landscape" : "portrait";
            setTimeout(function () {
                Stage.width = window.innerWidth;
                Stage.height = window.innerHeight;
                FlipEvents._fireEvent(FlipEvents.ORIENTATION, {
                    orientation: e.orientation
                })
            }, 50)
        }
        function c(m) {
            var n = Utils.touchEvent(m);
            var l = m.target;
            var k = l.nodeName == "INPUT" || l.nodeName == "TEXTAREA" || l.nodeName == "SELECT";
            if (e.allowScroll) {
                return
            }
            if (i) {
                return m.preventDefault()
            }
            var j = true;
            var l = m.target;
            while (l.parentNode) {
                if (k) {
                    j = false
                }
                if (l._scrollParent) {
                    j = false;
                    h.target = l;
                    h.y = n.y
                }
                l = l.parentNode
            }
            if (j) {
                m.preventDefault()
            }
        }
        function g(l) {
            var m = Utils.touchEvent(l);
            if (e.allowScroll) {
                return
            }
            if (h.target) {
                var k = h.target;
                var j = k.__scrollHeight || Number((k.style.height || "0px").slice(0, -2));
                k.__scrollheight = j;
                if (m.y < h.y) {
                    if (Math.round(k.scrollTop) == Math.round(j / 2)) {
                        l.preventDefault()
                    }
                } else {
                    if (k.scrollTop == 0) {
                        l.preventDefault()
                    }
                }
            }
        }
    }
    function f() {
        var j = Date.now();
        if (a) {
            if (j - a > e.sleepTime) {
                e.events.fire(FlipEvents.BACKGROUND)
            }
        }
        a = j
    }
    this.Class = window.Class;
    this.fullscreen = function () {
        if (e.os == "Android") {
            __window.bind("touchstart", function () {
                Device.openFullscreen()
            })
        }
    };
    this.overflowScroll = function (k, j, m) {
        if (!Device.mobile) {
            return false
        }
        var l = {
            "-webkit-overflow-scrolling": "touch"
        };
        if ((!j && !m) || (j && m)) {
            l.overflow = "scroll"
        }
        if (!j && m) {
            l.overflowY = "scroll";
            l.overflowX = "hidden"
        }
        if (j && !m) {
            l.overflowX = "scroll";
            l.overflowY = "hidden"
        }
        k.css(l);
        k.div._scrollParent = true;
        i = false
    }
}, "Static");