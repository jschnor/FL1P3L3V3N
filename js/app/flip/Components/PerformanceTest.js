Class(function PerformanceTest() {
    // console.log('PERFORMANCE TEST')
    Inherit(this, Component);
    var j = this;
    var b, m, l, d;
    var c;
    var e = 373;
    var g = 371;
    (function () {
        n();
        p()
    })();

    function n() {
        if (!Device.system.webworker) {
            return
        }
        b = j.initClass(Thread);
        b.initCode("test", k)
    }
    function k(A, s) {
        var t = Date.now();
        var u = A.imageData.data;
        for (var w = 0; w < u.length; w += 4) {
            var q = u[w];
            var x = u[w + 1];
            var C = u[w + 2];
            var D = u[w + 3];
            if (A.mobile) {
                var B = q * x * C * D
            } else {
                for (var v = 0; v < 150; v++) {
                    var B = q * x * C * D
                }
            }
        }
        var E = Date.now() - t;
        if (E == 0) {
            E = 1
        }
        post(E, s)
    }
    function p() {
        m = new Image();
        // m.src = Config.PROXY + "assets/images/home/logo-invert.png";
        m.src = Config.PROXY + "/assets/images/home/logo-invert.png";

        m.onload = a;
        l = j.initClass(Canvas, e, g, null)
    }
    function a() {
        if (!b) {
            return o()
        }
        l.context.drawImage(m, 0, 0);
        var q = l.context.getImageData(0, 0, e, g);
        b.send("test", {
            imageData: q,
            mobile: Device.mobile
        }, h);
        d = setTimeout(f, 5000)
    }
    function o() {
        c = true;
        FEDevice.PERFORMANCE = 0;
        FEDevice.PERF_TIME = 0;
        j.events.fire(FlipEvents.COMPLETE)
    }
    function i(t) {
        FEDevice.PERF_TIME = 2;
        if (Device.mobile) {
            var s = Device.detect(["fban", "facebook", "fbios", "twitter"]);
            if (Mobile.os == "iOS") {
                if (Mobile.version >= 7) {
                    if (Mobile.browser == "Safari" && !s) {
                        FEDevice.PERFORMANCE = t > 20 ? 0 : 1;
                        FEDevice.PERF_TIME = t > 20 ? 0 : 1
                    } else {
                        FEDevice.PERFORMANCE = 0;
                        FEDevice.PERF_TIME = t > 150 ? 0 : 1
                    }
                } else {
                    FEDevice.PERF_TIME = 0;
                    FEDevice.PERFORMANCE = 0
                }
            } else {
                FEDevice.PERFORMANCE = 0;
                FEDevice.PERF_TIME = t > 10 ? 0 : 1
            }
        } else {
            var q = 20;
            var r = 35;
            if (Device.browser.safari) {
                q *= 3;
                r *= 3
            }
            if (t <= q) {
                FEDevice.PERFORMANCE = 2
            } else {
                if (t < r) {
                    FEDevice.PERFORMANCE = 1
                } else {
                    FEDevice.PERFORMANCE = 0
                }
            }
            if (Device.browser.firefox && Device.system.retina) {
                FEDevice.PERFORMANCE = 0
            }
            if (Device.browser.ie) {
                FEDevice.PERFORMANCE = 0
            }
        }
        FEDevice.performanceSet()
    }
    function h(q) {
        if (c) {
            return
        }
        c = true;
        j.events.fire(FlipEvents.COMPLETE);
        clearTimeout(d);
        i(q)
    }
    function f() {
        if (c) {
            return
        }
        c = true
    }
});
