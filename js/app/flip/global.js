if (typeof window === "undefined") {
    window = self
}

window.Global = new Object();
window.getURL = function (a, b) {
    if (!b) {
        b = "_blank";
    }
    window.open(a, b);
};

if (typeof (console) === "undefined") {
    window.console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = function () {};
}

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function () {
        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (b, a) {
            window.setTimeout(b, 1000 / 60);
        };
    })();
}

Date.now = Date.now ||
function () {
    return +new Date;
};



window.Class = function (b, c) {
    // IS WRAPPED AROUND EVERY FUNCTION
    // console.log('ZERO CALL');
    // console.log(':: Sets up the class file that runs the entire app')

    var e = this || window;
    // window.Test();
    var d = b.toString();
    var a = d.match(/function ([^\(]+)/)[1];
    c = (c || "").toLowerCase();
    b.prototype.__call = function () {
        if (this.events) {
            this.events.scope(this);
        }
    };
    if (!c) {
        e[a] = b
    } else {
        if (c == "static") {
            e[a] = new b();
        } else {
            if (c == "singleton") {
                e[a] = (function () {
                    var g = new Object();
                    // console.log('singleton called');
                    var f;
                    g.instance = function () {
                        if (!f) {
                            f = new b();
                        }
                        return f;
                    };
                    return g;
                })();
            }
        }
    }
};


window.Inherit = function (f, a, d) {
    if (typeof d === "undefined") {
        d = f
    }
    var c = new a(d);
    var b = {};
    for (var e in c) {
        f[e] = c[e];
        b[e] = c[e]
    }
    if (f.__call) {
        f.__call()
    }
    Render.nextFrame(function () {
        for (e in c) {
            if ((f[e] && b[e]) && f[e] !== b[e]) {
                f["_" + e] = b[e]
            }
        }
        c = b = null
    })
};


window.Interface = function (b, a) {
    Render.nextFrame(function () {
        var c = new a();
        for (var e in c) {
            if (typeof b[e] === "undefined") {
                throw "Interface Error: Missing Property: " + e + " ::: " + a;
            } else {
                var d = typeof c[e];
                if (typeof b[e] != d) {
                    throw "Interface Error: Property " + e + " is Incorrect Type ::: " + a;
                }
            }
        }
        c = null
    })
};



window.Namespace = function (b, a) {
    if (!a) {
        window[b] = {
            Class: window.Class
        }
    } else {
        a.Class = window.Class
    }
};