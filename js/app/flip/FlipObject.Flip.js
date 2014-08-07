Class(function Flip() {
    // console.log('FLIP CLASS INTANTIATED');
    // console.log('=======================');
    // console.log(':: Flip class instatiated')
    var f = this;
    var d, b;
    var e = new Array();
    (function () {
        init();
    })();

    function init() {
        if (!document || !window) {
            return setTimeout(init, 1);
        }
        if (window.addEventListener) {
            f.addEvent = "addEventListener";
            f.removeEvent = "removeEventListener";
            window.addEventListener("load", callback, false);
        } else {
            f.addEvent = "attachEvent";
            f.removeEvent = "detachEvent";
            window.attachEvent("onload", callback);
        }
    }
    function callback() {
        if (window.removeEventListener) {
            window.removeEventListener("load", callback, false);
        }
        for (var i = 0; i < e.length; i++) {
            e[i]();
        }
        e = null;

        f.READY = true;
        if (window.Main) {

            new window.Main();
            // Flip.Main = new window.Main()
        }
    }
    this.development = function (g) {
        if (!g) {
            clearInterval(d);
        } else {
            d = setInterval(function () {
                for (var k in window) {
                    if (k.strpos("webkit")) {
                        continue;
                    }
                    var j = window[k];
                    if (typeof j !== "function" && k.length > 2) {
                        if (k.strpos("_ga") || k.strpos("_typeface_js")) {
                            continue;
                        }
                        var i = k.charAt(0);
                        var h = k.charAt(1);
                        if (i == "_" || i == "$") {
                            if (h !== h.toUpperCase()) {
                                throw "Flip Warning:: " + k + " leaking into global scope";
                            }
                        }
                    }
                }
            }, 1000);
        }
    };
    this.ready = function (g) {
        if (this.READY) {
            return g();
        }
        e.push(g);
    };
    this.$ = function (g, i, j) {
        var h = arguments[arguments.length - 1] == "f";
        if (h) {
            i = null;
        }
        return new FlipObject(g, i, j);
    };

    this.HTML = {};
    this.SHADERS = {};
    this.JSON = {};

    // sets the $.fn
    this.$.fn = FlipObject.prototype;

    // expose the library
    window.$ = this.$

}, "Static");