Class(function ScrollUtil() {
    // console.log('=============================')
    // console.log('SCROLL UTILITIES')
    // console.log('=============================')
    var c = this;
    var j;
    var d = [];
    var e = {
        y: 0,
        save: 0
    };
    var h = false;
    (function () {
        b();
        Flip.ready(f)
    })();

    function b() {
        if (Device.browser.ie) {
            return j = 2
        }
        if (Device.system.os == "mac") {
            if ((Device.browser.chrome) || Device.browser.safari) {
                j = 40
            } else {
                j = 1
            }
            return
        } else {
            if (Device.browser.chrome) {
                j = 15
            } else {
                j = 0.5
            }
        }
    }
    function f() {
        if (!Device.mobile) {
            __window.bind("DOMMouseScroll", g);
            __window.bind("mousewheel", g);
            if (!Device.browser.firefox) {
                __window.keydown(a)
            }
        }
    }
    function a(k) {
        if (k.keyCode == 40) {
            i(250)
        }
        if (k.keyCode == 38) {
            i(-250)
        }
    }
    function g(l) {
        var k = l.wheelDelta || -l.detail;
        var m = Math.ceil(-k / j);
        if (l.preventDefault) {
            l.preventDefault()
        }
        if (m <= 0) {
            m -= 1
        }
        i(m * 3)
    }
    function i(l) {
        for (var k = 0; k < d.length; k++) {
            d[k](l)
        }
    }
    this.reset = function () {
        this.value = 0
    };
    this.link = function (k) {
        d.push(k)
    };
    this.unlink = function (l) {
        var k = d.indexOf(l);
        if (k > -1) {
            d.splice(k, 1)
        }
    }
}, "Static");
