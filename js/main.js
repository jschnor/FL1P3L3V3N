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
Class(function FlipObject(c, d, b, g) {
    // console.log('FLIP OBJECT');
    var self = this;
    var h;
    
    this._events = {};
    this._children = new LinkedList();
    this.__useFragment = g;

    (function () {
        init();
    })();

    function init() {
        if (c && typeof c !== "string") {
            self.div = c;
        } else {
            var k = c ? c.charAt(0) : null;
            var j = c ? c.slice(1) : null;
            if (k != "." && k != "#") {
                j = c;
                k = ".";
            }
            if (!b) {

                self._type = d || "div";
                self.div = document.createElement(self._type);
                if (k) {
                    if (k == "#") {
                        self.div.id = j;
                    } else {
                        self.div.className = j;
                    }
                }
            } else {
                if (k != "#") {
                    throw "Flip Selectors Require #ID";
                }
                self.div = document.getElementById(j);
            }
        }
        self.div.flipObject = self;
    }
    function i(l, j, k) {
        if (l[k == "." ? "className" : "id"] == j) {
            return l;
        }
        return false;
    }
    function a() {
        if (!h) {
            return false;
        }
        self.div.appendChild(h);
        h = null;
    }
    this.addChild = this.add = function (k) {
        var j = this.div;
        if (this.__useFragment) {
            if (!h) {
                h = document.createDocumentFragment();
                Render.nextFrame(a);
            }
            j = h;
        }
        if (k.element && k.element instanceof FlipObject) {
            j.appendChild(k.element.div);
            this._children.push(k.element);
            k.element._parent = this;
        } else {
            if (k.container && k.container instanceof FlipObject) {
                j.appendChild(k.container.div);
                this._children.push(k.container);
                k.container._parent = this;
            } else {
                if (k.div) {
                    j.appendChild(k.div);
                    this._children.push(k);
                    k._parent = this;
                } else {
                    if (k.nodeName) {
                        j.appendChild(k);
                    }
                }
            }
        }
        return this;
    };
    this.clone = function () {
        return $(this.div.cloneNode(true));
    };
    this.create = function (j, k) {
        var l = $(j, k);
        this.addChild(l);
        return l;
    };
    this.empty = function () {
        var j = this._children.start();
        while (j) {
            if (j && j.remove) {
                j.remove();
            }
            j = this._children.next();
        }
        this.div.innerHTML = "";
        return this;
    };
    this.text = function (j) {
        if (typeof j !== "undefined") {
            this.div.innerHTML = j;
            return this;
        } else {
            return this.div.innerHTML;
        }
    };
    this.parent = function () {
        return this._parent;
    };
    this.children = function () {
        return this.div.children ? this.div.children : this.div.childNodes;
    };
    this.removeChild = function (k, j) {
        if (!j) {
            try {
                this.div.removeChild(k.div);
            } catch (l) {}
        }
        this._children.remove(k);
    };
    this.remove = function (l) {
        this.stopTween();
        var j = this._parent;
        if (j && j.removeChild) {
            j.removeChild(this);
        }
        if (!l) {
            var k = this._children.start();
            while (k) {
                if (k && k.remove) {
                    k.remove();
                }
                k = this._children.next();
            }
            this._children.empty();
            Utils.nullObject(this);
        }
    };
    this.hide = function () {
        this.div.style.display = "none";
        return this;
    };
    this.show = function () {
        this.div.style.display = "block";
        return this;
    }
});
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
Flip.ready(function () {
    // console.log('=======================');
    // console.log(':: Flip ready function');
    // console.log('=======================');

    window.__window = $(window);
    window.__document = $(document);
    window.__body = $(document.getElementsByTagName("body")[0]);
    window.Stage = __body.create("#Stage");
    Stage.size("100%");
    Stage.__useFragment = true;
    
    Stage.width = window.innerWidth || document.documentElement.offsetWidth;
    Stage.height = window.innerHeight || document.documentElement.offsetHeight;
    
    (function () {
        var b = Date.now();
        var a;

        setTimeout(function () {
            var g = ["hidden", "msHidden", "webkitHidden"];
            var f, e;
            (function () {
                for (var h in g) {
                    if (document[g[h]] !== "undefined") {
                        f = g[h];
                        switch (f) {
                        case "hidden":
                            e = "visibilitychange";
                            break;
                        case "msHidden":
                            e = "msvisibilitychange";
                            break;
                        case "webkitHidden":
                            e = "webkitvisibilitychange";
                            break
                        }
                        return
                    }
                }
            })();
            if (typeof document[f] === "undefined") {
                if (Device.browser.ie) {
                    document.onfocus = focus;
                    document.onblur = blur
                } else {
                    window.onfocus = focus;
                    window.onblur = blur
                }
            } else {
                document.addEventListener(e, function () {
                    var h = Date.now();
                    if (h - b > 10) {
                        if (document[f] === false) {
                            focus()
                        } else {
                            blur()
                        }
                    }
                    b = h
                })
            }
        }, 250);

        function focus() {
            if (a != "focus") {
                FlipEvents._fireEvent(FlipEvents.BROWSER_FOCUS, {
                    type: "focus"
                })
            }
            a = "focus"
        }

        function blur() {
            if (a != "blur") {
                FlipEvents._fireEvent(FlipEvents.BROWSER_FOCUS, {
                    type: "blur"
                })
            }
            a = "blur"
        }
    })();

    window.onresize = function () {
        if (!Device.mobile) {
            Stage.width = window.innerWidth || document.documentElement.offsetWidth;
            Stage.height = window.innerHeight || document.documentElement.offsetHeight;
            FlipEvents._fireEvent(FlipEvents.RESIZE);
        }
    }

});

Class(function MVC() {
    // console.log('ELEVENTH CALL');
    // console.log('======= MVC OBJECT');

    Inherit(this, Events);
    var a = {};
    this.classes = {};

    function b(d, c) {
        a[c] = {};
        Object.defineProperty(d, c, {
            set: function (e) {
                if (a[c]) {
                    a[c].s.apply(d, [e])
                }
            },
            get: function () {
                if (a[c]) {
                    return a[c].g.apply(d)
                }
            }
        })
    }
    this.set = function (d, c) {
        if (!a[d]) {
            b(this, d)
        }
        a[d].s = c
    };
    this.get = function (d, c) {
        if (!a[d]) {
            b(this, d)
        }
        a[d].g = c
    };
    this.delayedCall = function (f, c, d) {
        var self = this;
        return setTimeout(function () {
            if (self.element && self.element.show) {
                f.apply(self, [d])
            }
        }, c || 0)
    };
    this.initClass = function (m, p, o, n, l, k, j, i) {
        var h = Utils.timestamp();
        this.classes[h] = new m(p, o, n, l, k, j, i);
        this.classes[h].parent = this;
        this.classes[h].__id = h;
        if (this.element && arguments[arguments.length - 1] !== null) {
            this.element.addChild(this.classes[h])
        }
        // console.log('initClass: ')
        // console.log(this.classes[h])
        // console.log('------------------')

        return this.classes[h]
    };
    this.destroy = function () {
        if (this.container) {
            Global[this.container.div.id.toUpperCase()] = null
        }
        for (var d in this.classes) {
            var c = this.classes[d];
            if (c.destroy) {
                c.destroy()
            }
        }
        this.classes = null;
        if (this.events) {
            this.events = this.events.destroy()
        }
        if (this.element && this.element.remove) {
            this.element = this.container = this.element.remove()
        }
        if (this.parent && this.parent.__destroyChild) {
            this.parent.__destroyChild(this.__id)
        }
        return Utils.nullObject(this)
    };
    this.__destroyChild = function (c) {
        this.classes[c] = null;
        delete this.classes[c]
    }
});
Class(function Model(a) {
    // console.log('< MODEL >')
    Inherit(this, MVC);
    Global[a.constructor.toString().match(/function ([^\(]+)/)[1].toUpperCase()] = {};
    this.__call = function () {
        this.events.scope(this);
        delete this.__call
    }
});

Class(function View(a) {
    // console.log('< VIEW >')
    Inherit(this, MVC);
    this.element = $("." + a.constructor.toString().match(/function ([^\(]+)/)[1]);
    this.element.__useFragment = true;
    this.css = function (b) {
        this.element.css(b);
        return this
    };
    this.transform = function (b) {
        this.element.transform(b || this);
        return this
    };
    this.tween = function (d, e, f, b, g, c) {
        return this.element.tween(d, e, f, b, g, c)
    }
});
Class(function Controller(a) {
     // console.log('< CONTROLLER >')
    Inherit(this, MVC);
    a = a.constructor.toString().match(/function ([^\(]+)/)[1];
    this.element = this.container = $("#" + a);
    this.element.__useFragment = true;
    Global[a.toUpperCase()] = {};
    this.css = function (b) {
        this.container.css(b)
    }
});
Class(function Component() {
     // console.log('< COMPONENT >')
    Inherit(this, MVC);
    this.__call = function () {
        this.events.scope(this);
        delete this.__call
    }
});
Class(function Utils() {
    // console.log('< STATIC UTILS >')
    var d = this;
    if (typeof Float32Array == "undefined") {
        Float32Array = Array
    }
    function a(e) {
        e = parseInt(e, 10);
        if (isNaN(e)) {
            return "00"
        }
        e = Math.max(0, Math.min(e, 255));
        return "0123456789ABCDEF".charAt((e - e % 16) / 16) + "0123456789ABCDEF".charAt(e % 16)
    }
    function c(f, e) {
        return b(Math.random(), f, e)
    }
    function b(f, g, e) {
        return g + (e - g) * f
    }
    this.doRandom = function (f, e) {
        return Math.round(c(f - 0.5, e + 0.5))
    };
    this.headsTails = function (f, g) {
        var e = d.doRandom(0, 1);
        if (!e) {
            return f
        } else {
            return g
        }
    };
    this.toDegrees = function (e) {
        return e * (180 / Math.PI)
    };
    this.toRadians = function (e) {
        return e * (Math.PI / 180)
    };
    this.findDistance = function (h, g) {
        var f = g.x - h.x;
        var e = g.y - h.y;
        return Math.sqrt(f * f + e * e)
    };
    this.timestamp = function () {
        var e = Date.now() + d.doRandom(0, 99999);
        return e.toString()
    };
    this.rgbToHex = function (f, e, g) {
        return a(f) + a(e) + a(g)
    };
    this.hexToRGB = function (f) {
        var e = [];
        f.replace(/(..)/g, function (g) {
            e.push(parseInt(g, 16))
        });
        return e
    };
    this.getBackground = function (f) {
        var e = f.css("backgroundImage");
        if (e.length) {
            e = e.replace('("', "(");
            e = e.replace('")', ")");
            e = e.split("(");
            e = e[1].slice(0, -1)
        }
        return e
    };
    this.hitTestObject = function (k, j) {
        var f = k.x,
            o = k.y,
            p = k.width,
            l = k.height;
        var s = j.x,
            i = j.y,
            n = j.width,
            r = j.height;
        var e = f + p,
            m = o + l,
            q = s + n,
            g = i + r;
        if (s >= f && s <= e) {
            if (i >= o && i <= m) {
                return true
            } else {
                if (o >= i && o <= g) {
                    return true
                }
            }
        } else {
            if (f >= s && f <= q) {
                if (i >= o && i <= m) {
                    return true
                } else {
                    if (o >= i && o <= g) {
                        return true
                    }
                }
            }
        }
        return false
    };
    this.randomColor = function () {
        var e = "#" + Math.floor(Math.random() * 16777215).toString(16);
        if (e.length < 7) {
            e = this.randomColor()
        }
        return e
    };
    this.touchEvent = function (g) {
        var f = {};
        f.x = 0;
        f.y = 0;
        if (!g) {
            return f
        }
        if (g.touches || g.changedTouches) {
            if (g.changedTouches.length) {
                f.x = g.changedTouches[0].pageX;
                f.y = g.changedTouches[0].pageY
            } else {
                f.x = g.touches[0].pageX;
                f.y = g.touches[0].pageY
            }
        } else {
            f.x = g.pageX;
            f.y = g.pageY
        }
        return f
    };
    this.clamp = function (f, g, e) {
        return Math.min(Math.max(f, g), e)
    };
    this.nullObject = function (e) {
        if (e.destroy) {
            for (var f in e) {
                if (typeof e[f] !== "undefined") {
                    e[f] = null
                }
            }
        }
        return null
    };
    this.convertRange = function (f, i, g, k, h) {
        var j = (g - i);
        var e = (h - k);
        return (((f - i) * e) / j) + k
    };

    // take a string and convert it for use in a url
    this.urlstr = function(string){
        var str = string.replace(/ /g, "-").toLowerCase();
        var _str = str.replace(/:/g, "");

        return _str;
    };

    this.stripDashes = function(string){
        return string.replace(/-/g, " ").toLowerCase();
    };

    this.stripUnderscore = function(string){
        return string.replace(/_/g, " ").toLowerCase();
    };

    String.prototype.strpos = function (e) {
        return this.indexOf(e) != -1
    };
    String.prototype.clip = function (f, e) {
        return this.length > f ? this.slice(0, f) + e : this
    }
}, "Static");
(function () {
    // console.log(':: CALLED FIRST')
    
    $.fn.visible = function () {
        this.div.style.visibility = "visible";
        return this
    };
    $.fn.invisible = function () {
        this.div.style.visibility = "hidden";
        return this
    };
    $.fn.setZ = function (a) {
        this.div.style.zIndex = a;
        return this
    };
    $.fn.clearAlpha = function () {
        this.div.style.opacity = "";
        return this
    };
    $.fn.size = function (a, b, c) {
        if (typeof a === "string") {
            if (typeof b === "undefined") {
                b = "100%"
            } else {
                if (typeof b !== "string") {
                    b = b + "px"
                }
            }
            this.div.style.width = a;
            this.div.style.height = b
        } else {
            this.div.style.width = a + "px";
            this.div.style.height = b + "px";
            if (!c) {
                this.div.style.backgroundSize = a + "px " + b + "px"
            }
        }
        this.width = a;
        this.height = b;
        return this
    };
    $.fn.retinaSize = function (a, b) {
        if (typeof a === "string") {
            this.div.style.backgroundSize = a + " " + b
        } else {
            this.div.style.backgroundSize = a + "px " + b + "px"
        }
        return this
    };
    $.fn.mouseEnabled = function (a) {
        this.div.style.pointerEvents = a ? "auto" : "none";
        return this
    };
    $.fn.fontStyle = function (e, c, b, d) {
        var a = new Object();
        if (e) {
            a.fontFamily = e
        }
        if (c) {
            a.fontSize = c
        }
        if (b) {
            a.color = b
        }
        if (d) {
            a.fontStyle = d
        }
        this.css(a);
        return this
    };
    $.fn.bg = function (c, a, d, b) {
        if (!c) {
            return this
        }
        if (!c.strpos(".")) {
            this.div.style.backgroundColor = c
        } else {
            this.div.style.backgroundImage = "url(" + c + ")"
        }
        if (typeof a !== "undefined") {
            a = typeof a == "number" ? a + "px" : a;
            d = typeof d == "number" ? d + "px" : d;
            this.div.style.backgroundPosition = a + " " + d
        }
        if (b) {
            this.div.style.backgroundSize = "";
            this.div.style.backgroundRepeat = b
        }
        return this
    };
    $.fn.center = function (a, c) {
        var b = {};
        if (typeof a === "undefined") {
            b.left = "50%";
            b.top = "50%";
            b.marginLeft = -this.width / 2;
            b.marginTop = -this.height / 2
        } else {
            if (a) {
                b.left = "50%";
                b.marginLeft = -this.width / 2
            }
            if (c) {
                b.top = "50%";
                b.marginTop = -this.height / 2
            }
        }
        this.css(b);
        return this
    };
    $.fn.mask = function (b, a, e, c, d) {
        this.div.style[Device.styles.vendor + "Mask"] = (b.strpos(".") ? "url(" + b + ")" : b) + " no-repeat";
        return this
    };
    $.fn.css = function (d, c) {
        if (typeof c == "boolean") {
            skip = c;
            c = null
        }
        if (typeof d !== "object") {
            if (!c) {
                var b = this.div.style[d];
                if (typeof b !== "number") {
                    if (b.strpos("px")) {
                        b = Number(b.slice(0, -2))
                    }
                    if (d == "opacity") {
                        b = 1
                    }
                }
                if (!b) {
                    b = 0
                }
                return b
            } else {
                this.div.style[d] = c;
                return this
            }
        }
        TweenManager.clearCSSTween(this);
        for (var a in d) {
            var e = d[a];
            if (!(typeof e === "string" || typeof e === "number")) {
                continue
            }
            if (typeof e !== "string" && a != "opacity" && a != "zIndex") {
                e += "px"
            }
            this.div.style[a] = e
        }
        return this
    }
})();
Class(function CSS() {
    var g = this;
    var f, b, a;
    Flip.ready(function () {
        b = "";
        f = document.createElement("style");
        f.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(f)
    });

    function d(j) {
        var i = j.match(/[A-Z]/);
        var k = i ? i.index : null;
        if (k) {
            var l = j.slice(0, k);
            var h = j.slice(k);
            j = l + "-" + h.toLowerCase()
        }
        return j
    }
    function e(j) {
        var i = j.match(/\-/);
        var l = i ? i.index : null;
        if (l) {
            var m = j.slice(0, l);
            var h = j.slice(l).slice(1);
            var k = h.charAt(0);
            h = h.slice(1);
            h = k.toUpperCase() + h;
            j = m + h
        }
        return j
    }
    function c() {
        f.innerHTML = b;
        a = false
    }
    this._read = function () {
        return b
    };
    this._write = function (h) {
        b = h;
        if (!a) {
            a = true;
            Render.nextFrame(c)
        }
    };
    this._toCSS = d;
    this.style = function (h, k) {
        var j = h + " {";
        for (var i in k) {
            var m = d(i);
            var l = k[i];
            if (typeof l !== "string" && i != "opacity") {
                l += "px"
            }
            j += m + ":" + l + "!important;"
        }
        j += "}";
        f.innerHTML += j
    };
    this.get = function (k, h) {
        var q = new Object();
        var n = f.innerHTML.split(k + " {");
        for (var m = 0; m < n.length; m++) {
            var o = n[m];
            if (!o.length) {
                continue
            }
            var p = o.split("!important;");
            for (var l in p) {
                if (p[l].strpos(":")) {
                    var r = p[l].split(":");
                    if (r[1].slice(-2) == "px") {
                        r[1] = Number(r[1].slice(0, -2))
                    }
                    q[e(r[0])] = r[1]
                }
            }
        }
        if (!h) {
            return q
        } else {
            return q[h]
        }
    };
    this.textSize = function (k) {
        var j = k.clone();
        j.css({
            position: "relative",
            cssFloat: "left",
            styleFloat: "left",
            marginTop: -99999,
            width: "",
            height: ""
        });
        __body.addChild(j);
        var i = j.div.offsetWidth;
        var h = j.div.offsetHeight;
        j.remove();
        return {
            width: i,
            height: h
        }
    };
    this.prefix = function (h) {
        return Device.styles.vendor == "" ? h[0].toLowerCase() + h.slice(1) : Device.styles.vendor + h
    }
}, "Static");
Class(function Device() {
    // console.log('< STATIC DEVICE SNIFFER >')
    var b = this;
    this.agent = navigator.userAgent.toLowerCase();

    function a(f) {
        var e = document.createElement("div"),
            d = "Khtml ms O Moz Webkit".split(" "),
            c = d.length;
        if (f in e.style) {
            return true;
        }
        f = f.replace(/^[a-z]/, function (g) {
            return g.toUpperCase()
        });
        while (c--) {
            if (d[c] + f in e.style) {
                return true;
            }
        }
        return false;
    }
    this.detect = function (d) {
        if (typeof d === "string") {
            d = [d];
        }
        for (var c = 0; c < d.length; c++) {
            if (this.agent.strpos(d[c])) {
                return true;
            }
        }
        return false;
    };
    this.mobile = ( !! ("ontouchstart" in window) && this.detect(["ios", "iphone", "ipad", "windows phone", "android", "blackberry", "iemobile"])) ? {} : false;
    if (this.mobile) {
        this.mobile.tablet = window.innerWidth > 1000 || window.innerHeight > 900;
        this.mobile.phone = !this.mobile.tablet;
    }
    this.browser = new Object();
    this.browser.chrome = this.detect("chrome");
    this.browser.safari = !this.browser.chrome && this.detect("safari");
    this.browser.firefox = this.detect("firefox");
    this.browser.ie = (function () {
        if (b.detect("msie")) {
            return true;
        }
        if (b.detect("trident") && b.detect("rv:")) {
            return true;
        }
    })();
    this.browser.version = (function () {
        try {
            if (b.browser.chrome) {
                return Number(b.agent.split("chrome/")[1].split(".")[0]);
            }
            if (b.browser.firefox) {
                return Number(b.agent.split("firefox/")[1].split(".")[0]);
            }
            if (b.browser.safari) {
                return Number(b.agent.split("version/")[1].split(".")[0].charAt(0));
            }
            if (b.browser.ie) {
                if (b.detect("msie")) {
                    return Number(b.agent.split("msie ")[1].split(".")[0]);
                }
                return Number(b.agent.split("rv:")[1].split(".")[0]);
            }
        } catch (c) {
            return -1;
        }
    })();
    this.vendor = (function () {
        if (b.browser.firefox) {
            return "moz";
        }
        if (b.browser.opera) {
            return "o";
        }
        if (b.browser.ie && b.browser.version >= 11) {
            return "";
        }
        if (b.browser.ie) {
            return "ms";
        }
        return "webkit";
    })();
    this.system = new Object();
    this.system.retina = window.devicePixelRatio > 1 ? true : false;
    this.system.webworker = typeof window.Worker !== "undefined";
    this.system.offline = typeof window.applicationCache !== "undefined";
    this.system.geolocation = typeof navigator.geolocation !== "undefined";
    this.system.pushstate = typeof window.history.pushState !== "undefined";
    this.system.webcam = !! (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    this.system.language = window.navigator.userLanguage || window.navigator.language;
    this.system.webaudio = typeof window.webkitAudioContext !== "undefined" || typeof window.AudioContent !== "undefined";
    this.system.localStorage = typeof window.localStorage !== "undefined";
    this.system.fullscreen = typeof document[b.vendor + "CancelFullScreen"] !== "undefined";
    this.system.os = (function () {
        if (b.detect("mac os")) {
            return "mac";
        } else {
            if (b.detect("windows nt 6.3")) {
                return "windows8.1";
            } else {
                if (b.detect("windows nt 6.2")) {
                    return "windows8";
                } else {
                    if (b.detect("windows nt 6.1")) {
                        return "windows7";
                    } else {
                        if (b.detect("windows nt 6.0")) {
                            return "windowsvista";
                        } else {
                            if (b.detect("windows nt 5.1")) {
                                return "windowsxp";
                            } else {
                                if (b.detect("linux")) {
                                    return "linux";
                                }
                            }
                        }
                    }
                }
            }
        }
        return "undetected";
    })();
    this.media = new Object();
    this.media.audio = (function () {
        if ( !! document.createElement("audio").canPlayType) {
            return b.detect(["firefox", "opera"]) ? "ogg" : "mp3";
        } else {
            return false;
        }
    })();
    this.media.video = (function () {
        var c = document.createElement("video");
        if ( !! c.canPlayType) {
            if (Device.mobile) {
                return "mp4";
            }
            if (b.browser.chrome) {
                return "webm";
            }
            if (b.browser.firefox || b.browser.opera) {
                if (c.canPlayType('video/webm; codecs="vorbis,vp8"')) {
                    return "webm";
                }
                return "ogv";
            }
            return "mp4";
        } else {
            return false;
        }
    })();
    this.graphics = new Object();
    this.graphics.webgl = (function () {
        try {
            return !!window.WebGLRenderingContext && !! document.createElement("canvas").getContext("experimental-webgl");
        } catch (c) {}
    })();
    this.graphics.canvas = (function () {
        var c = document.createElement("canvas");
        return c.getContext ? true : false;
    })();
    this.styles = new Object();
    this.styles.filter = a("filter") && !b.browser.firefox;
    this.styles.shader = b.browser.chrome;
    this.styles.vendor = (function () {
        if (b.browser.firefox) {
            return "Moz";
        }
        if (b.browser.opera) {
            return "O";
        }
        if (b.browser.ie && b.browser.version >= 11) {
            return "";
        }
        if (b.browser.ie) {
            return "ms";
        }
        return "Webkit";
    })();
    this.styles.vendorTransition = this.styles.vendor.length ? this.styles.vendor + "Transition" : "transition";
    this.styles.vendorTransform = this.styles.vendor.length ? this.styles.vendor + "Transform" : "transform";
    this.tween = new Object();
    this.tween.transition = a("transition");
    this.tween.css2d = a("transform");
    this.tween.css3d = a("perspective");
    this.tween.complete = (function () {
        if (b.browser.firefox || b.browser.ie) {
            return "transitionend";
        }
        if (b.browser.opera) {
            return "oTransitionEnd";
        }
        return "webkitTransitionEnd";
    })();
    this.openFullscreen = function (c) {
        c = c || __body;
        if (c && b.system.fullscreen) {
            if (c == __body) {
                c.css({
                    top: 0
                });
            }
            c.div[b.vendor + "RequestFullScreen"]();
        }
    };
    this.closeFullscreen = function () {
        if (b.system.fullscreen) {
            document[b.vendor + "CancelFullScreen"]();
        }
    };
    this.getFullscreen = function () {
        return document[b.vendor + "IsFullScreen"];
    }
}, "Static");
Class(function Storage() {
    // console.log('< STORAGE STATIC >')
    var d = this;
    var c;
    (function () {
        a()
    })();

    function a() {
        if (window.localStorage) {
            try {
                window.localStorage.test = 1;
                window.localStorage.removeItem("test");
                c = true
            } catch (f) {
                c = false
            }
        } else {
            c = false
        }
    }
    function b(i, j, f) {
        var g;
        if (arguments.length > 1 && (j === null || typeof j !== "object")) {
            g = new Object();
            g.path = "/";
            g.expires = f || 1;
            if (j === null) {
                g.expires = -1
            }
            if (typeof g.expires === "number") {
                var l = g.expires,
                    h = g.expires = new Date();
                h.setDate(h.getDate() + l)
            }
            return (document.cookie = [encodeURIComponent(i), "=", g.raw ? String(j) : encodeURIComponent(String(j)), g.expires ? "; expires=" + g.expires.toUTCString() : "", g.path ? "; path=" + g.path : "", g.domain ? "; domain=" + g.domain : "", g.secure ? "; secure" : ""].join(""))
        }
        g = j || {};
        var e, k = g.raw ?
        function (m) {
            return m
        } : decodeURIComponent;
        return (e = new RegExp("(?:^|; )" + encodeURIComponent(i) + "=([^;]*)").exec(document.cookie)) ? k(e[1]) : null
    }
    this.setCookie = function (f, g, e) {
        b(f, g, e)
    };
    this.getCookie = function (e) {
        return b(e)
    };
    this.set = function (e, f) {
        if (typeof f === "object") {
            f = JSON.stringify(f)
        }
        if (c) {
            if (typeof f === "null") {
                window.localStorage.removeItem(e)
            }
            window.localStorage[e] = f
        } else {
            b(e, f, 365)
        }
    };
    this.get = function (e) {
        var g;
        if (c) {
            g = window.localStorage[e]
        } else {
            g = b(e)
        }
        if (g) {
            var f;
            if (g.charAt) {
                f = g.charAt(0)
            }
            if (f == "{" || f == "[") {
                g = JSON.parse(g)
            }
        }
        return g
    }
}, "Static");
Class(function DynamicObject(a) {
    // console.log('< DYNAMIC >')
    var c;
    for (var b in a) {
        this[b] = a[b]
    }
    this.tween = function (f, g, h, e, i, d) {
        if (typeof e !== "number") {
            d = i;
            i = e;
            e = 0
        }
        this.stopTween();
        if (typeof d !== "function") {
            d = null
        }
        if (typeof i !== "function") {
            i = null
        }
        c = TweenManager.tween(this, f, g, h, e, d, i);
        return c
    };
    this.stopTween = function () {
        if (c && c.stop) {
            c.stop()
        }
    };
    this.copy = function () {
        var e = new DynamicObject();
        for (var d in this) {
            if (typeof this[d] !== "function" && typeof this[d] !== "object") {
                e[d] = this[d]
            }
        }
        return e
    };
    this.clear = function () {
        for (var d in this) {
            if (typeof this[d] !== "function") {
                delete this[d]
            }
        }
        return this
    }
});
Class(function ObjectPool(b, d) {
    // console.log('< OBJECT POOL >')
    Inherit(this, Component);
    var c = this;
    var a = [];
    this.limit = Math.round(d * 1.25);
    (function () {
        if (b) {
            d = d || 10;
            b = b || Object;
            for (var e = 0; e < d; e++) {
                a.push(new b())
            }
        }
    })();
    this.get = function () {
        if (!a.length && a.length < c.limit) {
            a.push(new b())
        }
        return a.shift()
    };
    this.empty = function () {
        a = []
    };
    this.put = function (e) {
        if (e) {
            a.push(e)
        }
    };
    this.insert = function (f) {
        if (typeof f.push === "undefined") {
            f = [f]
        }
        for (var e = 0; e < f.length; e++) {
            a.push(f[e])
        }
    };
    this.destroy = function () {
        for (var e = 0; e < a.length; e++) {
            if (a[e].destroy) {
                a[e].destroy()
            }
        }
        a = null;
        return this._destroy()
    }
});
Class(function LinkedList() {
    // console.log('< LINKED LIST >')
    var a = LinkedList.prototype;
    this.length = 0;
    this.first = null;
    this.last = null;
    this.current = null;
    a.push = function (b) {
        if (this.first === null) {
            b.__prev = b;
            b.__next = b;
            this.first = b;
            this.last = b
        } else {
            b.__prev = this.last;
            b.__next = this.first;
            this.last.__next = b;
            this.last = b
        }
        this.length++
    };
    a.remove = function (b) {
        if (this.length > 1 && b.__prev) {
            b.__prev.__next = b.__next;
            b.__next.__prev = b.__prev;
            if (b == this.first) {
                this.first = b.__next
            }
            if (b == this.last) {
                this.last = b.__prev
            }
        } else {
            this.first = null;
            this.last = null
        }
        b.__prev = null;
        b.__next = null;
        this.length--
    };
    a.empty = function () {
        this.length = 0;
        this.first = null;
        this.last = null;
        this.current = null
    };
    a.start = function (b) {
        b = b || this;
        b.current = this.first;
        return b.current
    };
    a.next = function (b) {
        b = b || this;
        if (!b.current || !b.current.__next) {
            return false
        }
        b.current = b.current.__next;
        if (b.current == b.current.__next || b.current == b.current.__prev) {
            b.current = null
        }
        return b.current
    };
    a.destroy = function () {
        Utils.nullObject(this);
        return null
    }
});
Class(function FlipEvents() {
    // console.log('==========================')
    // console.log(':: FLIP EVENTS')
    // console.log('==========================')

    var b = new Array();
    var a = {};
    this.BROWSER_FOCUS = "flip_focus";
    this.HASH_UPDATE = "flip_hash_update";
    this.COMPLETE = "flip_complete";
    this.PROGRESS = "flip_progress";
    this.UPDATE = "flip_update";
    this.LOADED = "flip_loaded";
    this.END = "flip_end";
    this.FAIL = "flip_fail";
    this.SELECT = "flip_select";
    this.ERROR = "flip_error";
    this.READY = "flip_ready";
    this.RESIZE = "flip_resize";
    this.CLICK = "flip_click";
    this.HOVER = "flip_hover";
    this.MESSAGE = "flip_message";
    this.ORIENTATION = "orientation";
    this.BACKGROUND = "background";
    this.BACK = "flip_back";
    this.PREVIOUS = "flip_previous";
    this.NEXT = "flip_next";
    this.RELOAD = "flip_reload";
    
    this._checkDefinition = function (c) {
        if (typeof c == "undefined") {
            throw "Undefined event"
        }
    };
    this._addEvent = function (f, g, c) {
        this._checkDefinition(f);
        var d = new Object();
        d.evt = f;
        d.object = c;
        d.callback = g;
        b.push(d)
    };
    this._removeEvent = function (c, e) {
        this._checkDefinition(c);
        for (var d = b.length - 1; d > -1; d--) {
            if (b[d].evt == c && b[d].callback == e) {
                b[d] = null;
                b.splice(d, 1)
            }
        }
    };
    this._destroyEvents = function (c) {
        for (var d = b.length - 1; d > -1; d--) {
            if (b[d].object == c) {
                b[d] = null;
                b.splice(d, 1)
            }
        }
    };
    this._fireEvent = function (c, f) {
        this._checkDefinition(c);
        var e = true;
        f = f || a;
        f.cancel = function () {
            e = false
        };
        for (var d = 0; d < b.length; d++) {
            if (b[d].evt == c) {
                if (e) {
                    b[d].callback(f)
                } else {
                    return false
                }
            }
        }
    };
    this._consoleEvents = function () {
        console.log(b)
    }
}, "Static");
Class(function Events(c) {
    // console.log('EVENTS CLASS')
    // console.log(c)
    // console.log('++++++++++++++++++++++')

    this.events = {};
    var b = {};
    var a = {};
    this.events.subscribe = function (d, e) {
        FlipEvents._addEvent(d, e, c);
    };
    this.events.unsubscribe = function (d, e) {
        FlipEvents._removeEvent(d, e);
    };
    this.events.fire = function (d, f, e) {
        f = f || a;
        FlipEvents._checkDefinition(d);
        if (b[d]) {
            f.target = f.target || c;
            b[d](f);
            f.target = null;
        } else {
            if (!e) {
                FlipEvents._fireEvent(d, f);
            }
        }
    };
    this.events.add = function (d, e) {
        FlipEvents._checkDefinition(d);
        b[d] = e;
    };
    this.events.remove = function (d) {
        FlipEvents._checkDefinition(d);
        if (b[d]) {
            delete b[d];
        }
    };
    this.events.bubble = function (e, d) {
        FlipEvents._checkDefinition(d);
        var f = this;
        e.events.add(d, function (g) {
            f.fire(d, g);
        });
    };
    this.events.scope = function (d) {
        c = d;
    };
    this.events.destroy = function () {
        FlipEvents._destroyEvents(c);
        b = null;
        return null;
    }
});
Class(function PushState(a) {
    //console.log('< PUSH STATE >')
    var b = this;
    
    if (typeof a !== "boolean") {
        if (window.location.href.strpos("mlocal") == true){
            a = false;
        }else{
            a = window.location.href.strpos("local") || window.location.href.charAt(7) == "1";
        }
    }
    this.locked = false;
    this.dispatcher = new StateDispatcher(a);

    this.getState = function () {
        return this.dispatcher.getState();
    };
    this.setState = function (c) {
        this.dispatcher.setState(c);
    };
    this.setTitle = function (c) {
        this.dispatcher.setTitle(c);
    };
    this.lock = function () {
        this.locked = true;
        this.dispatcher.lock();
    };
    this.unlock = function () {
        this.locked = false;
        this.dispatcher.unlock();
    };
    this.setPathRoot = function (c) {
        this.dispatcher.setPathRoot(c);
    };
});
Class(function StateDispatcher(g) {
    // console.log('< STATE DISPATCHER >')
    Inherit(this, Events);
    var f = this;
    var i, a;
    var d = "/";
    this.locked = false;
    (function () {
        b();
        i = c();
        a = i;
    })();

    function b() {
        if (!Device.system.pushstate || g) {
            if (Device.detect(["msie 7", "msie 8", "firefox/3", "safari/4"])) {
                setInterval(function () {
                    var j = c();
                    if (j != a) {
                        h(j);
                    }
                }, 300);
            } else {
                window.addEventListener("hashchange", function () {
                    h(c());
                }, false);
            }
        } else {
            window.onpopstate = history.onpushstate = e;
        }
    }
    function c() {
        if (!Device.system.pushstate || g) {
            console.log('NO PUSH STATE');
            var j = window.location.hash;
            j = j.slice(3);
            return String(j)
        } else {
            var k = location.pathname.toString();
            k = d != "/" ? k.split(d)[1] : k.slice(1);
            k = k || "";
            // console.log('k:'+k);
            // console.log('===========================');

            return k
        }
    }
    function e() {
        var j = location.pathname;
        
        console.log('STATE DISPATCHER :: e(): j: '+j);
        console.log('f.locked: '+f.locked);
        console.log('a: ' + a );
        console.log('d: ' + d + 'j: ' + j);

        if (!f.locked && j != a) {
            j = d != "/" ? j.split(d)[1] : j.slice(1);
            j = j || "";
            a = j;
            f.events.fire(FlipEvents.UPDATE, {
                value: j,
                split: j.split("/")
            });
        } else {
            if (j != a) {
                if (a) {
                    window.history.pushState(null, null, d + j);
                }
            }
        }
    }
    function h(j) {
        if (!f.locked && j != a) {
            a = j;
            f.events.fire(FlipEvents.UPDATE, {
                value: j,
                split: j.split("/")
            });
        } else {
            if (j != a) {
                if (a) {
                    window.location.hash = "!/" + a;
                }
            }
        }
    }
    this.getState = function () {
        return c();
    };
    this.setPathRoot = function (j) {
        if (j.charAt(0) == "/") {
            d = j;
        } else {
            d = "/" + j;
        }
    };
    this.setState = function (j) {
        if (!Device.system.pushstate || g) {
            if (j != a) {
                window.location.hash = "!/" + j;
                a = j;
            }
        } else {
            if (j != a) {
                console.log('StateDispatch :: setState');
                console.log('::::::::::::::::::::::::::::::::');
                window.history.pushState(null, null, d + j);
                a = j;
            }
        }
    };
    this.setTitle = function (j) {
        document.title = j;
    };
    this.lock = function () {
        this.locked = true;
    };
    this.unlock = function () {
        this.locked = false;
    };
    this.forceHash = function () {
        g = true;
    }
});
Class(function AssetLoader(j) {
    Inherit(this, Component);

    // var c = this;
    var _self = this;
    var m = 0;
    var l = 0;
    var e, d, l;
    var f, g;

    (function () {
        e = new Array();
        g = new Array();
        k();
        setTimeout(h, 10)
    })();

    function k() {
        for (var o in j) {
            if (typeof j[o] !== "undefined") {
                // console.log('====================');
                // console.log('j[o]');
                // console.log(j[o]);
                // console.log('====================');
                m++;
                e.push(j[o])
            }
        }
    }

    function h() {
        d = Math.round(m * 0.5);
        for (var o = 0; o < d; o++) {
            a(e[o])
        }
    }

    function b() {
        if (e) {
            var r = [];
            for (var q = 0; q < e.length; q++) {
                var p = false;
                for (var o = 0; o < g.length; o++) {
                    if (g[o] == e[q]) {
                        p = true
                    }
                }
                if (!p) {
                    r.push(e[q])
                }
            }
            if (r.length) {
                console.log("AssetLoader Files Failed To Load:");
                console.log(r)
            }
        }
    }

    function a(s) {
        if (s) {
            var p = s.split("/");
            p = p[p.length - 1];
            var q = p.split(".");
            var r = q[q.length - 1].split("?")[0];
            switch (r) {
            case "html":
                XHR.get(s, function (u) {
                    Flip.HTML[q[0]] = u;
                    n(s)
                }, "text");
                break;
            case "js":
            case "php":
            case undefined:
                var o = document.createElement("script");
                o.type = "text/javascript";
                o.src = s;
                o.async = true;
                __body.addChild(o);
                XHR.get(s, function () {
                    setTimeout(function () {
                        n(s)
                    }, 100)
                }, "text");
                break;
            case "json":
                XHR.get(s, function (u) {
                    Flip.JSON[q[0]] = u;
                    n(s)
                });
                break;
            case "fs":
            case "vs":
            case "frag":
            case "vert":
                XHR.get(s, function (u) {
                    Flip.SHADERS[q[0] + "." + r] = u;
                    n(s)
                }, "text");
                break;
            default:
                var t = new Image();
                t.src = s;
                t.onload = function () {
                    n(s)
                };
                break
            }
        }
    }
    function i() {
        if (l == d && l < m) {
            var p = d;
            d *= 2;
            for (var o = p; o < d; o++) {
                if (e[o]) {
                    a(e[o])
                }
            }
        }
    }
    function n(o) {
        if (e) {
            l++;
            _self.events.fire(FlipEvents.PROGRESS, {
                percent: l / m
            });
            g.push(o);
            clearTimeout(f);
            i();
            if (l == m) {
                _self.complete = true;
                if (_self.events) {
                    _self.events.fire(FlipEvents.COMPLETE)
                }
            } else {
                f = setTimeout(b, 5000)
            }
        }
    }
    this.add = function (o) {
        m += o
    };
    this.trigger = function (o) {
        o = o || 1;
        for (var p = 0; p < o; p++) {
            n("trigger")
        }
    };
    this.destroy = function () {
        j = null;
        l = null;
        e = null;
        l = null;
        d = null;
        if (this._destroy) {
            return this._destroy()
        }
    }
});
Class(function Render() {
    // console.log('===========================')
    // console.log(':: RENDER :: ANIMATION LOOP')
    // console.log('===========================')
    var h = this;
    var n, e, k, g, a;
    var d = [];
    var j = [];
    var m = new LinkedList();
    var l = new LinkedList();
    var f = m;

    (function () {
        requestAnimationFrame(c);
        Flip.ready(b)
    })();

    function b() {
        setTimeout(function () {
            if (!k) {
                window.requestAnimationFrame = function (o) {
                    setTimeout(o, 1000 / 60)
                };
                c()
            }
        }, 250)
    }
    function c() {
        var p = Date.now();
        var r = 0;
        var q = 60;
        if (k) {
            r = p - k;
            q = 1000 / r
        }
        k = p;
        h.FPS = q;
        // console.log('FPS: '+q);
        for (var o = j.length - 1; o > -1; o--) {
            if (j[o]) {
                j[o](p, q, r)
            }
        }
        if (g && q < g) {
            for (o = d.length - 1; o > -1; o--) {
                if (d[o]) {
                    d[o](q)
                } else {
                    d.splice(o, 1)
                }
            }
        }
        if (f.length) {
            i()
        }
        requestAnimationFrame(c)
    }
    function i() {
        var o = f;
        f = f == m ? l : m;
        var p = o.start();
        while (p) {
            p();
            p = o.next()
        }
        o.empty()
    }
    this.startRender = function (q) {
        var p = true;
        var o = j.length - 1;
        if (j.indexOf(q) == -1) {
            j.push(q)
        }
    };
    this.stopRender = function (p) {
        var o = j.indexOf(p);
        if (o > -1) {
            j.splice(o, 1)
        }
    };
    this.addThreshold = function (o, p) {
        g = o;
        if (d.indexOf(p) == -1 && p) {
            d.push(p)
        }
    };
    this.removeThreshold = function (p) {
        if (p) {
            var o = d.indexOf(p);
            if (o > -1) {
                d.splice(o, 1)
            }
        } else {
            d = []
        }
        g = null
    };
    this.startTimer = function (o) {
        a = o || "Timer";
        if (console.time) {
            console.time(a)
        } else {
            e = Date.now()
        }
    };
    this.stopTimer = function () {
        if (console.time) {
            console.timeEnd(a)
        } else {
            console.log("Render " + a + ": " + (Date.now() - e))
        }
    };
    this.nextFrame = function (o) {
        f.push(o)
    };
    this.setupTween = function (o) {
        h.nextFrame(function () {
            h.nextFrame(o)
        })
    }
}, "Static");

Class(function Thread() {
    // console.log('< THREAD >')
    Inherit(this, Component);
    var g = this;
    var a, d, c;
    (function () {
        f();
        b()
    })();

    function f() {
        c = (function () {
            if (typeof Config !== "undefined") {
                return Config.PATH || ""
            }
            return ""
        })();
        d = new Object();
        a = new Worker(c + "/assets/js/flip-thread.js");
        var h = Utils.constructor.toString();
        h += "Utils = new Utils();";
        a.postMessage({
            code: h
        })
    }
    function b() {
        a.addEventListener("message", e)
    }
    function e(h) {
        if (h.data.console) {
            console.log(h.data.message)
        }
        if (h.data.id) {
            var i = d[h.data.id];
            if (i) {
                i(h.data.message)
            }
            delete d[h.data.id]
        }
        if (h.data.emit) {
            var i = d[h.data.evt];
            if (i) {
                i(h.data.msg)
            }
        }
    }
    this.on = function (h, i) {
        d[h] = i
    };
    this.off = function (h) {
        delete d[h]
    };
    this.initFunction = function (k, j) {
        k = k.toString();
        if (!j) {
            k = k.replace("(", "!!!");
            var i = k.split("!!!");
            var h = i[0].split(" ")[1];
            k = "self." + h + " = function(" + i[1];
            a.postMessage({
                code: k,
                fn: h
            })
        } else {
            a.postMessage({
                code: k
            })
        }
    };
    this.initCode = function (j, l) {
        if (typeof l === "function") {
            l = [l]
        }
        var h = "self." + j + " = function(object, id) {";
        for (var k = 0; k < l.length; k++) {
            h += l[k].toString()
        }
        h += l[0].toString().match(/function ([^\(]+)/)[1] + "(object, id);";
        h += "}";
        a.postMessage({
            code: h,
            fn: j
        })
    };
    this.importScript = function (h) {
        a.postMessage({
            path: h,
            importScript: true
        })
    };
    this.send = function (h, j, l) {
        if (typeof h === "string") {
            var i = h;
            j = j || {};
            j.fn = h
        } else {
            l = j;
            j = h
        }
        var k = Utils.timestamp();
        if (l) {
            d[k] = l
        }
        a.postMessage({
            message: j,
            id: k
        })
    };
    this.destroy = function () {
        if (a.terminate) {
            a.terminate()
        }
        return this._destroy()
    }
});
Class(function XHR() {
    // console.log('< STATIC XHR >')
    var c = this;
    var b;

    function a(e, f) {
        if (typeof f === "object") {
            for (var d in f) {
                var g = e + "[" + d + "]";
                if (typeof f[d] === "object") {
                    a(g, f[d])
                } else {
                    b.push(g + "=" + f[d])
                }
            }
        } else {
            b.push(e + "=" + f)
        }
    }
    this.get = function (e, h, j, g) {
        if (typeof h === "function") {
            g = j;
            j = h;
            h = null
        } else {
            if (typeof h === "object") {
                var d = "?";
                for (var f in h) {
                    d += f + "=" + h[f] + "&"
                }
                d = d.slice(0, -1);
                e += d
            }
        }
        var i = new XMLHttpRequest();
        i.open("GET", e, true);
        i.send();
        i.onreadystatechange = function () {
            if (i.readyState == 4 && i.status == 200) {
                if (typeof j === "function") {
                    var k = i.responseText;
                    if (g == "text") {
                        j(k)
                    } else {
                        try {
                            j(JSON.parse(k))
                        } catch (l) {
                            console.error(k)
                        }
                    }
                }
                i = null
            }
        }
    };
    this.post = function (d, g, j, f, i) {
        if (typeof g === "function") {
            i = f;
            f = j;
            j = g;
            g = null
        } else {
            if (typeof g === "object") {
                if (j == "json" || f == "json" || i == "json") {
                    g = JSON.stringify(g)
                } else {
                    b = new Array();
                    for (var e in g) {
                        a(e, g[e])
                    }
                    g = b.join("&");
                    g = g.replace(/\[/g, "%5B");
                    g = g.replace(/\]/g, "%5D");
                    b = null
                }
            }
        }
        var h = new XMLHttpRequest();
        h.open("POST", d, true);
        switch (i) {
        case "upload":
            i = "application/upload";
            break;
        default:
            i = "application/x-www-form-urlencoded";
            break
        }
        h.setRequestHeader("Content-type", i);
        h.onreadystatechange = function () {
            if (h.readyState == 4 && h.status == 200) {
                if (typeof j === "function") {
                    var k = h.responseText;
                    if (f == "text") {
                        j(k)
                    } else {
                        try {
                            j(JSON.parse(k))
                        } catch (l) {
                            console.error(k)
                        }
                    }
                }
                h = null
            }
        };
        h.send(g)
    }
}, "Static");
Class(function Color(b) {
    Inherit(this, Component);
    var f = this;
    this.r = 1;
    this.g = 1;
    this.b = 1;
    (function () {
        e(b)
    })();

    function e(g) {
        if (g instanceof Color) {
            d(g)
        } else {
            if (typeof g === "number") {
                c(g)
            }
        }
    }
    function d(g) {
        f.r = g.r;
        f.g = g.g;
        f.b = g.b
    }
    function c(g) {
        g = Math.floor(g);
        f.r = (g >> 16 & 255) / 255;
        f.g = (g >> 8 & 255) / 255;
        f.b = (g & 255) / 255
    }
    function a(i, h, g) {
        if (g < 0) {
            g += 1
        }
        if (g > 1) {
            g -= 1
        }
        if (g < 1 / 6) {
            return i + (h - i) * 6 * g
        }
        if (g < 1 / 2) {
            return h
        }
        if (g < 2 / 3) {
            return i + (h - i) * 6 * (2 / 3 - g)
        }
        return i
    }
    this.set = function (g) {
        e(g);
        return this
    };
    this.setRGB = function (j, i, h) {
        this.r = j;
        this.g = i;
        this.b = h;
        return this
    };
    this.setHSL = function (j, i, g) {
        if (i === 0) {
            this.r = this.g = this.b = g
        } else {
            var m = g <= 0.5 ? g * (1 + i) : g + i - (g * i);
            var k = (2 * g) - m;
            this.r = a(k, m, j + 1 / 3);
            this.g = a(k, m, j);
            this.b = a(k, m, j - 1 / 3)
        }
        return this
    };
    this.getStyle = function () {
        return "rgb(" + ((this.r * 255) | 0) + "," + ((this.g * 255) | 0) + "," + ((this.b * 255) | 0) + ")"
    };
    this.getHex = function () {
        return (this.r * 255) << 16 ^ (this.g * 255) << 8 ^ (this.b * 255) << 0
    };
    this.getHexString = function () {
        return ("000000" + this.getHex().toString(16)).slice(-6)
    };
    this.add = function (g) {
        this.r += g.r;
        this.g += g.g;
        this.b += g.b
    };
    this.mix = function (g, h) {
        this.r = this.r * (1 - h) + (g.r * h);
        this.g = this.g * (1 - h) + (g.g * h);
        this.b = this.b * (1 - h) + (g.b * h)
    };
    this.addScalar = function (g) {
        this.r += g;
        this.g += g;
        this.b += g
    };
    this.multiply = function (g) {
        this.r *= g.r;
        this.g *= g.g;
        this.b *= g.b
    };
    this.multiplyScalar = function (g) {
        this.r *= g;
        this.g *= g;
        this.b *= g
    };
    this.clone = function () {
        return new Color().setRGB(this.r, this.g, this.b)
    }
});
Class(function Matrix2() {
    var o = this;
    var k = Matrix2.prototype;
    var g, f, e, n, m, l, u, t, s;
    var r, q, p, d, c, a, j, i, h;
    this.type = "matrix2";
    this.data = new Float32Array(9);
    (function () {
        v()
    })();

    function v(w) {
        w = w || o.data;
        w[0] = 1, w[1] = 0, w[2] = 0;
        w[3] = 0, w[4] = 1, w[5] = 0;
        w[6] = 0, w[7] = 0, w[8] = 1
    }
    function b(w) {
        w = Math.abs(w) < 0.000001 ? 0 : w;
        return w
    }
    k.identity = function (w) {
        v(w);
        return this
    };
    k.transformVector = function (z) {
        var A = this.data;
        var w = z.x;
        var B = z.y;
        z.x = A[0] * w + A[1] * B + A[2];
        z.y = A[3] * w + A[4] * B + A[5];
        return z
    };
    k.setTranslation = function (z, x, w) {
        var A = w || this.data;
        A[0] = 1, A[1] = 0, A[2] = z;
        A[3] = 0, A[4] = 1, A[5] = x;
        A[6] = 0, A[7] = 0, A[8] = 1;
        return this
    };
    k.getTranslation = function (w) {
        var x = this.data;
        w = w || new Vector2();
        w.x = x[2];
        w.y = x[5];
        return w
    };
    k.setScale = function (A, z, w) {
        var x = w || this.data;
        x[0] = A, x[1] = 0, x[2] = 0;
        x[3] = 0, x[4] = z, x[5] = 0;
        x[6] = 0, x[7] = 0, x[8] = 1;
        return this
    };
    k.setShear = function (A, z, w) {
        var x = w || this.data;
        x[0] = 1, x[1] = A, x[2] = 0;
        x[3] = z, x[4] = 1, x[5] = 0;
        x[6] = 0, x[7] = 0, x[8] = 1;
        return this
    };
    k.setRotation = function (x, w) {
        var B = w || this.data;
        var A = Math.cos(x);
        var z = Math.sin(x);
        B[0] = A, B[1] = -z, B[2] = 0;
        B[3] = z, B[4] = A, B[5] = 0;
        B[6] = 0, B[7] = 0, B[8] = 1;
        return this
    };
    k.setTRS = function (z, w, x, E, D) {
        var C = this.data;
        var B = Math.cos(x);
        var A = Math.sin(x);
        C[0] = B * E, C[1] = -A * D, C[2] = z;
        C[3] = A * E, C[4] = B * D, C[5] = w;
        C[6] = 0, C[7] = 0, C[8] = 1;
        return this
    };
    k.translate = function (x, w) {
        this.identity(Matrix2.__TEMP__);
        this.setTranslation(x, w, Matrix2.__TEMP__);
        return this.multiply(Matrix2.__TEMP__)
    };
    k.rotate = function (w) {
        this.identity(Matrix2.__TEMP__);
        this.setTranslation(w, Matrix2.__TEMP__);
        return this.multiply(Matrix2.__TEMP__)
    };
    k.scale = function (x, w) {
        this.identity(Matrix2.__TEMP__);
        this.setScale(x, w, Matrix2.__TEMP__);
        return this.multiply(Matrix2.__TEMP__)
    };
    k.shear = function (x, w) {
        this.identity(Matrix2.__TEMP__);
        this.setRotation(x, w, Matrix2.__TEMP__);
        return this.multiply(Matrix2.__TEMP__)
    };
    k.multiply = function (x) {
        var z = this.data;
        var w = x.data || x;
        g = z[0], f = z[1], e = z[2];
        n = z[3], m = z[4], l = z[5];
        u = z[6], t = z[7], s = z[8];
        r = w[0], q = w[1], p = w[2];
        d = w[3], c = w[4], a = w[5];
        j = w[6], i = w[7], h = w[8];
        z[0] = g * r + f * d + e * j;
        z[1] = g * q + f * c + e * i;
        z[2] = g * p + f * a + e * h;
        z[3] = n * r + m * d + l * j;
        z[4] = n * q + m * c + l * i;
        z[5] = n * p + m * a + l * h;
        return this
    };
    k.copyTo = function (x) {
        var z = this.data;
        var w = x.data || x;
        w[0] = z[0], w[1] = z[1], w[2] = z[2];
        w[3] = z[3], w[4] = z[4], w[5] = z[5];
        w[6] = z[6], w[7] = z[7], w[8] = z[8];
        return x
    };
    k.copyFrom = function (x) {
        var z = this.data;
        var w = x.data || x;
        w[0] = z[0], w[1] = z[1], w[2] = z[2];
        w[3] = z[3], w[4] = z[4], w[5] = z[5];
        w[6] = z[6], w[7] = z[7], w[8] = z[8];
        return this
    };
    k.getCSS = function () {
        var w = this.data;
        if (Device.tween.css3d) {
            return "matrix3d(" + b(w[0]) + ", " + b(w[3]) + ", 0, 0, " + b(w[1]) + ", " + b(w[4]) + ", 0, 0, 0, 0, 1, 0, " + b(w[2]) + ", " + b(w[5]) + ", 0, 1)"
        } else {
            return "matrix(" + b(w[0]) + ", " + b(w[3]) + ", " + b(w[1]) + ", " + b(w[4]) + ", " + b(w[2]) + ", " + b(w[5]) + ")"
        }
    }
    // console.log('MATRIX 2')
});

Matrix2.__TEMP__ = new Matrix2().data;
Class(function Matrix4() {
    var d = this;
    var b = Matrix4.prototype;
    this.type = "matrix4";
    this.data = new Float32Array(16);
    (function () {
        a()
    })();

    function a(e) {
        var f = e || d.data;
        f[0] = 1, f[4] = 0, f[8] = 0, f[12] = 0;
        f[1] = 0, f[5] = 1, f[9] = 0, f[13] = 0;
        f[2] = 0, f[6] = 0, f[10] = 1, f[14] = 0;
        f[3] = 0, f[7] = 0, f[11] = 0, f[15] = 1
    }
    function c(e) {
        e = Math.abs(e) < 0.000001 ? 0 : e;
        return e
    }
    b.identity = function (e) {
        a(e);
        return this
    };
    b.transformVector = function (g, h) {
        var j = this.data;
        var e = g.x,
            k = g.y,
            i = g.z,
            f = g.w;
        h = h || g;
        h.x = j[0] * e + j[4] * k + j[8] * i + j[12] * f;
        h.y = j[1] * e + j[5] * k + j[9] * i + j[13] * f;
        h.z = j[2] * e + j[6] * k + j[10] * i + j[14] * f;
        return h
    };
    b.multiply = function (M, N) {
        var P = this.data;
        var O = M.data || M;
        var L, K, J, I, H, G, F, E, D, C, q, p, o, n, l, k;
        var B, A, z, x, w, v, u, t, s, r, j, i, h, g, f, e;
        L = P[0], K = P[1], J = P[2], I = P[3];
        H = P[4], G = P[5], F = P[6], E = P[7];
        D = P[8], C = P[9], q = P[10], p = P[11];
        o = P[12], n = P[13], l = P[14], k = P[15];
        B = O[0], A = O[1], z = O[2], x = O[3];
        w = O[4], v = O[5], u = O[6], t = O[7];
        s = O[8], r = O[9], j = O[10], i = O[11];
        h = O[12], g = O[13], f = O[14], e = O[15];
        P[0] = L * B + H * A + D * z + o * x;
        P[1] = K * B + G * A + C * z + n * x;
        P[2] = J * B + F * A + q * z + l * x;
        P[3] = I * B + E * A + p * z + k * x;
        P[4] = L * w + H * v + D * u + o * t;
        P[5] = K * w + G * v + C * u + n * t;
        P[6] = J * w + F * v + q * u + l * t;
        P[7] = I * w + E * v + p * u + k * t;
        P[8] = L * s + H * r + D * j + o * i;
        P[9] = K * s + G * r + C * j + n * i;
        P[10] = J * s + F * r + q * j + l * i;
        P[11] = I * s + E * r + p * j + k * i;
        P[12] = L * h + H * g + D * f + o * e;
        P[13] = K * h + G * g + C * f + n * e;
        P[14] = J * h + F * g + q * f + l * e;
        P[15] = I * h + E * g + p * f + k * e;
        return this
    };
    b.setTRS = function (o, n, l, g, f, e, v, u, t, k) {
        k = k || this;
        var r = k.data;
        this.identity(k);
        var j = Math.sin(g);
        var s = Math.cos(g);
        var i = Math.sin(f);
        var q = Math.cos(f);
        var h = Math.sin(e);
        var p = Math.cos(e);
        r[0] = (q * p + i * j * h) * v;
        r[1] = (-q * h + i * j * p) * v;
        r[2] = i * s * v;
        r[4] = h * s * u;
        r[5] = p * s * u;
        r[6] = -j * u;
        r[8] = (-i * p + q * j * h) * t;
        r[9] = (h * i + q * j * p) * t;
        r[10] = q * s * t;
        r[12] = o;
        r[13] = n;
        r[14] = l;
        return k
    };
    b.setScale = function (i, h, f, e) {
        e = e || this;
        var g = e.data || e;
        this.identity(e);
        g[0] = i, g[5] = h, g[10] = f;
        return e
    };
    b.setTranslation = function (g, f, i, e) {
        e = e || this;
        var h = e.data || e;
        this.identity(e);
        h[12] = g, h[13] = f, h[14] = i;
        return e
    };
    b.setRotation = function (g, f, e, i) {
        i = i || this;
        var l = i.data || i;
        this.identity(i);
        var p = Math.sin(g);
        var k = Math.cos(g);
        var o = Math.sin(f);
        var j = Math.cos(f);
        var n = Math.sin(e);
        var h = Math.cos(e);
        l[0] = j * h + o * p * n;
        l[1] = -j * n + o * p * h;
        l[2] = o * k;
        l[4] = n * k;
        l[5] = h * k;
        l[6] = -p;
        l[8] = -o * h + j * p * n;
        l[9] = n * o + j * p * h;
        l[10] = j * k;
        return i
    };
    b.translate = function (f, e, g) {
        this.setTranslation(f, e, g, Matrix4.__TEMP__);
        return this.multiply(Matrix4.__TEMP__)
    };
    b.rotate = function (g, f, e) {
        this.setRotation(g, f, e, Matrix4.__TEMP__);
        return this.multiply(Matrix4.__TEMP__)
    };
    b.scale = function (g, f, e) {
        this.setScale(g, f, e, Matrix4.__TEMP__);
        return this.multiply(Matrix4.__TEMP__)
    };
    b.copyTo = function (f) {
        var g = this.data;
        var e = f.data || f;
        for (var h = 0; h < 16; h++) {
            e[h] = g[h]
        }
        return f
    };
    b.copyRotationTo = function (f) {
        var g = this.data;
        var e = f.data || f;
        e[0] = g[0];
        e[1] = g[1];
        e[2] = g[2];
        e[3] = g[4];
        e[4] = g[5];
        e[5] = g[6];
        e[6] = g[8];
        e[7] = g[9];
        e[8] = g[10];
        return f
    };
    b.copyPosition = function (e) {
        var g = this.data;
        var f = e.data || e;
        g[12] = f[12];
        g[13] = f[13];
        g[14] = f[14];
        return this
    };
    b.getCSS = function () {
        var e = this.data;
        return "matrix3d(" + c(e[0]) + "," + c(e[1]) + "," + c(e[2]) + "," + c(e[3]) + "," + c(e[4]) + "," + c(e[5]) + "," + c(e[6]) + "," + c(e[7]) + "," + c(e[8]) + "," + c(e[9]) + "," + c(e[10]) + "," + c(e[11]) + "," + c(e[12]) + "," + c(e[13]) + "," + c(e[14]) + "," + c(e[15]) + ")"
    };
    b.extractPosition = function (e) {
        e = e || new Vector3();
        var f = this.data;
        e.set(f[12], f[13], f[14]);
        return e
    };
    b.determinant = function () {
        var e = this.data;
        return e[0] * (e[5] * e[10] - e[9] * e[6]) + e[4] * (e[9] * e[2] - e[1] * e[10]) + e[8] * (e[1] * e[6] - e[5] * e[2])
    };
    b.inverse = function (h) {
        var o = this.data;
        var q = (h) ? h.data || h : this.data;
        var l = this.determinant();
        if (Math.abs(l) < 0.0001) {
            console.warn("Attempt to inverse a singular Matrix4. ", this.data);
            console.trace();
            return h
        }
        var g = o[0],
            u = o[4],
            r = o[8],
            k = o[12],
            f = o[1],
            t = o[5],
            p = o[9],
            j = o[13],
            e = o[2],
            s = o[6],
            n = o[10],
            i = o[14];
        l = 1 / l;
        q[0] = (t * n - p * s) * l;
        q[1] = (r * s - u * n) * l;
        q[2] = (u * p - r * t) * l;
        q[4] = (p * e - f * n) * l;
        q[5] = (g * n - r * e) * l;
        q[6] = (r * f - g * p) * l;
        q[8] = (f * s - t * e) * l;
        q[9] = (u * e - g * s) * l;
        q[10] = (g * t - u * f) * l;
        q[12] = -(k * q[0] + j * q[4] + i * q[8]);
        q[13] = -(k * q[1] + j * q[5] + i * q[9]);
        q[14] = -(k * q[2] + j * q[6] + i * q[10]);
        return h
    };
    b.transpose = function (h) {
        var j = this.data;
        var l = h ? h.data || h : this.data;
        var g = j[0],
            q = j[4],
            n = j[8],
            f = j[1],
            p = j[5],
            k = j[9],
            e = j[2],
            o = j[6],
            i = j[10];
        l[0] = g;
        l[1] = q;
        l[2] = n;
        l[4] = f;
        l[5] = p;
        l[6] = k;
        l[8] = e;
        l[9] = o;
        l[10] = i
    };
    b.lookAt = function (g, f) {
        var i = this.data;
        var e = D3.m4v31;
        var j = D3.m4v32;
        var h = D3.m4v33;
        h.set(i[12], i[13], i[14]);
        h.sub(h, g).normalize();
        if (h.lengthSq() === 0) {
            h.z = 1
        }
        e.cross(f, h).normalize();
        if (e.lengthSq() === 0) {
            h.x += 0.0001;
            e.cross(f, h).normalize()
        }
        j.cross(h, e);
        i[0] = e.x, i[4] = j.x, i[8] = h.x;
        i[1] = e.y, i[5] = j.y, i[9] = h.y;
        i[2] = e.z, i[6] = j.z, i[10] = h.z;
        return this
    }
});

Matrix4.__TEMP__ = new Matrix4().data;
Class(function Vector2(c, a) {
    // console.log('Vector2')
    var d = this;
    var b = Vector2.prototype;
    this.x = typeof c == "number" ? c : 0;
    this.y = typeof a == "number" ? a : 0;
    this.type = "vector2";
    b.set = function (e, f) {
        this.x = e;
        this.y = f;
        return this;
    };
    b.clear = function () {
        this.x = 0;
        this.y = 0;
        return this;
    };
    b.copyTo = function (e) {
        e.x = this.x;
        e.y = this.y;
        return this;
    };
    b.copyFrom = function (e) {
        this.x = e.x;
        this.y = e.y;
        return this;
    };
    b.addVectors = function (f, e) {
        this.x = f.x + e.x;
        this.y = f.y + e.y;
        return this;
    };
    b.subVectors = function (f, e) {
        this.x = f.x - e.x;
        this.y = f.y - e.y;
        return this;
    };
    b.multiplyVectors = function (f, e) {
        this.x = f.x * e.x;
        this.y = f.y * e.y;
    };
    b.add = function (e) {
        this.x += e.x;
        this.y += e.y;
        return this;
    };
    b.sub = function (e) {
        this.x -= e.x;
        this.y -= e.y;
        return this;
    };
    b.multiply = function (e) {
        this.x *= e;
        this.y *= e;
        return this;
    };
    b.divide = function (e) {
        this.x /= e;
        this.y /= e;
        return this;
    };
    b.lengthSq = function () {
        return (this.x * this.x + this.y * this.y) || 0.00001
    };
    b.length = function () {
        return Math.sqrt(this.lengthSq());
    };
    b.normalize = function () {
        var e = this.length();
        this.x /= e;
        this.y /= e;
        return this;
    };
    b.perpendicular = function (h, f) {
        var g = this.x;
        var e = this.y;
        this.x = -e;
        this.y = g;
        return this;
    };
    b.lerp = function (e, f) {
        this.x += (e.x - this.x) * f;
        this.y += (e.y - this.y) * f;
        return this;
    };
    b.isZero = function () {
        return this.x == 0 && this.y == 0;
    };
    b.setAngleRadius = function (e, f) {
        this.x = Math.cos(e) * f;
        this.y = Math.sin(e) * f;
        return this;
    };
    b.addAngleRadius = function (e, f) {
        this.x += Math.cos(e) * f;
        this.y += Math.sin(e) * f;
        return this;
    };
    b.clone = function () {
        return new Vector2(this.x, this.y);
    };
    b.dot = function (f, e) {
        e = e || this;
        return (f.x * e.x + f.y * e.y);
    };
    b.distanceTo = function (g, h) {
        var f = this.x - g.x;
        var e = this.y - g.y;
        if (!h) {
            return Math.sqrt(f * f + e * e);
        }
        return f * f + e * e;
    };
    b.solveAngle = function (f, e) {
        if (!e) {
            e = this;
        }
        return Math.acos(f.dot(e) / (f.length() * e.length()));
    };
    b.equals = function (e) {
        return this.x == e.x && this.y == e.y;
    }
});
Class(function Vector3(d, b, a, e) {
    var f = this;
    var c = Vector3.prototype;
    this.x = typeof d === "number" ? d : 0;
    this.y = typeof b === "number" ? b : 0;
    this.z = typeof a === "number" ? a : 0;
    this.w = typeof e === "number" ? e : 1;
    this.type = "vector3";
    c.set = function (g, j, i, h) {
        this.x = g || 0;
        this.y = j || 0;
        this.z = i || 0;
        this.w = h || 1;
        return this
    };
    c.clear = function () {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;
        return this
    };
    c.append = function (g, j, i, h) {
        this.x += g || 0;
        this.y += j || 0;
        this.z += i || 0;
        this.w += h || 0;
        return this
    };
    c.appendVector = function (g) {
        if (!g) {
            return this
        }
        this.x += g.x;
        this.y += g.y;
        this.z += g.z;
        this.w += g.w;
        return this
    };
    c.copyTo = function (g) {
        g.x = this.x;
        g.y = this.y;
        g.z = this.z;
        g.w = this.w;
        return g
    };
    c.copy = function (g) {
        g = g || new Vector3();
        g.set(this.x, this.y, this.z, this.w);
        return g
    };
    c.copyFrom = function (g) {
        this.x = g.x;
        this.y = g.y;
        this.z = g.z;
        this.w = g.w;
        return this
    };
    c.lengthSq = function () {
        return this.x * this.x + this.y * this.y + this.z * this.z
    };
    c.length = function () {
        return Math.sqrt(this.lengthSq())
    };
    c.normalize = function () {
        var g = 1 / this.length();
        this.set(this.x * g, this.y * g, this.z * g);
        return this
    };
    c.addVectors = function (h, g) {
        this.x = h.x + g.x;
        this.y = h.y + g.y;
        this.z = h.z + g.z;
        return this
    };
    c.subVectors = function (h, g) {
        this.x = h.x - g.x;
        this.y = h.y - g.y;
        this.z = h.z - g.z;
        return this
    };
    c.multiplyVectors = function (h, g) {
        this.x = h.x * g.x;
        this.y = h.y * g.y;
        this.z = h.z * g.z;
        return this
    };
    c.add = function (g) {
        this.x += g.x;
        this.y += g.y;
        this.z += g.z;
        return this
    };
    c.sub = function (g) {
        this.x -= g.x;
        this.y -= g.y;
        this.z -= g.z;
        return this
    };
    c.multiply = function (g) {
        this.x *= g;
        this.y *= g;
        this.z *= g;
        return this
    };
    c.divide = function (g) {
        this.x /= g;
        this.y /= g;
        this.z /= g;
        return this
    };
    c.lerp = function (g, h) {
        this.x += (g.x - this.x) * h;
        this.y += (g.y - this.y) * h;
        this.z += (g.z - this.z) * h;
        return this
    };
    c.setAngleRadius = function (g, h) {
        this.x = Math.cos(g) * h;
        this.y = Math.sin(g) * h;
        this.z = Math.sin(g) * h;
        return this
    };
    c.addAngleRadius = function (g, h) {
        this.x += Math.cos(g) * h;
        this.y += Math.sin(g) * h;
        this.z += Math.sin(g) * h;
        return this
    };
    c.dot = function (h, g) {
        g = g || this;
        return h.x * g.x + h.y * g.y + h.z * g.z
    };
    c.clone = function () {
        return new Vector3(this.x, this.y, this.z)
    };
    c.cross = function (i, h) {
        var g = i.y * h.z - i.z * h.y;
        var k = i.z * h.x - i.x * h.z;
        var j = i.x * h.y - i.y * h.x;
        this.set(g, k, j, this.w);
        return this
    };
    c.distanceTo = function (j, k) {
        var i = this.x - j.x;
        var h = this.y - j.y;
        var g = this.z - j.z;
        if (!k) {
            return Math.sqrt(i * i + h * h + g * g)
        }
        return i * i + h * h + g * g
    };
    c.solveAngle = function (h, g) {
        if (!g) {
            g = this
        }
        return Math.acos(h.dot(g) / (h.length() * g.length()))
    };
    c.equals = function (g) {
        return this.x == g.x && this.y == g.y && this.z == g.z
    }
});

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
Class(function D3() {
    // console.log('NEGATIVE D3')
    // console.log(':: STATIC – D3 3D stuff')
    Namespace("D3", this);
    this.CSS3D = Device.tween.css3d;
    this.m4v31 = new Vector3();
    this.m4v32 = new Vector3();
    this.m4v33 = new Vector3();
    this.UP = new Vector3(0, 1, 0);
    this.FWD = new Vector3(0, 0, -1);
    this.translate = function (a, c, b) {
        a = typeof a == "string" ? a : (a || 0) + "px";
        c = typeof c == "string" ? c : (c || 0) + "px";
        b = typeof b == "string" ? b : (b || 0) + "px";
        return "translate3d(" + a + "," + c + "," + b + ")"
    }
}, "Static");
Class(function CSSAnimation(a) {
    // console.log('CSSAnimation')
    Inherit(this, Component);
    var i = this;
    var m = "a" + Utils.timestamp();
    var d, g, j;
    var h = 1000;
    var b = "linear";
    var e = false;
    var k = 1;
    (function () {})();

    function c() {
        i.playing = false;
        if (i.events) {
            i.events.fire(FlipEvents.COMPLETE, null, true)
        }
    }
    function f() {
        var s = CSS._read();
        var n = "/*" + m + "*/";
        var C = "@-" + Device.vendor + "-keyframes " + m + " {\n";
        var t = n + C;
        if (s.strpos(m)) {
            var v = s.split(n);
            s = s.replace(n + v[1] + n, "")
        }
        var x = d.length - 1;
        var z = Math.round(100 / x);
        var w = 0;
        for (var r = 0; r < d.length; r++) {
            var p = d[r];
            if (r == d.length - 1) {
                w = 100
            }
            t += (p.percent || w) + "% {\n";
            var o = false;
            var u = {};
            var B = {};
            for (var A in p) {
                if (TweenManager.checkTransform(A)) {
                    u[A] = p[A];
                    o = true
                } else {
                    B[A] = p[A]
                }
            }
            if (o) {
                t += "-" + Device.vendor + "-transform: " + TweenManager.parseTransform(u) + ";"
            }
            for (A in B) {
                var q = B[A];
                if (typeof q !== "string" && A != "opacity" && A != "zIndex") {
                    q += "px"
                }
                t += CSS._toCSS(A) + ": " + q + ";"
            }
            t += "\n}\n";
            w += z
        }
        t += "}" + n;
        s += t;
        CSS._write(s)
    }
    function l() {
        var o = CSS._read();
        var p = "/*" + m + "*/";
        if (o.strpos(m)) {
            var n = o.split(p);
            o = o.replace(p + n[1] + p, "")
        }
        CSS._write(o)
    }
    this.set("frames", function (n) {
        d = n;
        f()
    });
    this.set("duration", function (n) {
        h = Math.round(n);
        if (i.playing && a) {
            a.div.style[CSS.prefix("AnimationDuration")] = i.duration + "ms"
        }
    });
    this.get("duration", function () {
        return h
    });
    this.set("ease", function (n) {
        b = n;
        if (i.playing && a) {
            a.div.style[CSS.prefix("AnimationTimingFunction")] = TweenManager.getEase(b)
        }
    });
    this.get("ease", function () {
        return b
    });
    this.set("loop", function (n) {
        e = n;
        if (i.playing && a) {
            a.div.style[CSS.prefix("AnimationIterationCount")] = e ? "infinite" : k
        }
    });
    this.get("loop", function () {
        return e
    });
    this.set("count", function (n) {
        k = n;
        if (i.playing && a) {
            a.div.style[CSS.prefix("AnimationIterationCount")] = e ? "infinite" : k
        }
    });
    this.get("count", function () {
        return k
    });
    this.play = function () {
        a.div.style[CSS.prefix("AnimationName")] = m;
        a.div.style[CSS.prefix("AnimationDuration")] = i.duration + "ms";
        a.div.style[CSS.prefix("AnimationTimingFunction")] = TweenManager.getEase(b);
        a.div.style[CSS.prefix("AnimationIterationCount")] = e ? "infinite" : k;
        a.div.style[CSS.prefix("AnimationPlayState")] = "running";
        i.playing = true;
        clearTimeout(g);
        if (!i.loop) {
            j = Date.now();
            g = setTimeout(c, k * h)
        }
    };
    this.pause = function () {
        i.playing = false;
        clearTimeout(g);
        a.div.style[CSS.prefix("AnimationPlayState")] = "paused"
    };
    this.stop = function () {
        i.playing;
        clearTimeout(g);
        a.div.style[CSS.prefix("AnimationName")] = ""
    };
    this.destroy = function () {
        this.stop();
        a = d = null;
        l();
        return this._destroy()
    }
});
Class(function Canvas(c, e, j) {
    Inherit(this, Component);
    var g = this;
    var n, d, h;
    this.children = [];
    this.offset = {
        x: 0,
        y: 0
    };
    this.retina = j;
    (function () {
        if (j instanceof FlipObject) {
            k(j)
        } else {
            f()
        }
        g.width = c;
        g.height = e;
        a(c, e, j)
    })();

    function k() {
        var o = "c" + Utils.timestamp();
        g.context = document.getCSSCanvasContext("2d", o, c, e);
        g.background = "-" + Device.styles.vendor.toLowerCase() + "-canvas(" + o + ")";
        j.css({
            backgroundImage: g.background
        });
        j = null
    }
    function f() {
        g.div = document.createElement("canvas");
        g.context = g.div.getContext("2d");
        g.object = $(g.div)
    }
    function a(o, r, p) {
        var q = (p ? (window.devicePixelRatio || 1) : 1);
        if (g.div) {
            g.div.width = o * q;
            g.div.height = r * q
        }
        g.width = o;
        g.height = r;
        g.scale = q;
        if (g.object) {
            g.object.size(g.width, g.height)
        }
        if (Device.system.retina && p) {
            g.context.scale(q, q);
            g.div.style.width = o + "px";
            g.div.style.height = r + "px"
        }
    }
    function m(q) {
        q = Utils.touchEvent(q);
        q.x += g.offset.x;
        q.y += g.offset.y;
        q.width = 1;
        q.height = 1;
        var p;
        for (var o = g.children.length - 1; o > -1; o--) {
            p = g.children[o].hit(q)
        }
        return p
    }
    function b(p) {
        var o = m(p);
        h = o;
        if (Device.mobile) {
            o.events.fire(FlipEvents.HOVER, {
                action: "over"
            }, true);
            o.__time = Date.now()
        }
    }
    function i(p) {
        var o = m(p);
        if (!Device.mobile) {
            if (o && d) {
                if (o != d) {
                    d.events.fire(FlipEvents.HOVER, {
                        action: "out"
                    }, true);
                    o.events.fire(FlipEvents.HOVER, {
                        action: "over"
                    }, true);
                    d = o
                }
            } else {
                if (o && !d) {
                    d = o;
                    o.events.fire(FlipEvents.HOVER, {
                        action: "over"
                    }, true)
                } else {
                    if (!o && d) {
                        d.events.fire(FlipEvents.HOVER, {
                            action: "out"
                        }, true);
                        d = null
                    }
                }
            }
        }
    }
    function l(p) {
        var o = m(p);
        if (!Device.mobile) {
            if (o && o == h) {
                o.events.fire(FlipEvents.CLICK, {
                    action: "click"
                }, true)
            }
        } else {
            h.events.fire(FlipEvents.HOVER, {
                action: "out"
            }, true);
            if (o == h) {
                if (Date.now() - h.__time < 750) {
                    o.events.fire(FlipEvents.CLICK, {
                        action: "click"
                    }, true)
                }
            }
        }
        h = null
    }
    this.set("interactive", function (o) {
        if (!n && o) {
            g.object.bind("touchstart", b);
            g.object.bind("touchmove", i);
            g.object.bind("touchend", l)
        } else {
            if (n && !o) {
                g.object.unbind("touchstart", b);
                g.object.unbind("touchmove", i);
                g.object.unbind("touchend", l)
            }
        }
        n = o
    });
    this.get("interactive", function () {
        return n
    });
    this.toDataURL = function () {
        return g.div.toDataURL()
    };
    this.sort = function () {
        _objects.sort(function (p, o) {
            return p.z - o.z
        })
    };
    this.render = function (q) {
        if (!(typeof q === "boolean" && q)) {
            g.clear()
        }
        var o = g.children.length;
        for (var p = 0; p < o; p++) {
            g.children[p].render()
        }
    };
    this.clear = function () {
        g.context.clearRect(0, 0, g.div.width, g.div.height)
    };
    this.add = function (o) {
        o._canvas = this;
        o._parent = this;
        this.children.push(o);
        o._z = this.children.length
    };
    this.remove = function (p) {
        p._canvas = null;
        p._parent = null;
        var o = this.children.indexOf(p);
        if (o) {
            this.children.splice(o, 1)
        }
    };
    this.destroy = function () {
        for (var o = 0; o < this.children.length; o++) {
            if (this.children[o].destroy) {
                this.children[o].destroy()
            }
        }
        return this._destroy()
    };
    this.startRender = function () {
        Render.startRender(g.render)
    };
    this.stopRender = function () {
        // console.log('stopRender')
        Render.stopRender(g.render)
    };
    this.texture = function (p) {
        var o = new Image();
        o.src = p;
        return o
    };
    this.size = a
});

Class(function CanvasTexture(a, b, d) {
    Inherit(this, CanvasObject);
    var f = this;
    var e;
    this.width = b || 0;
    this.height = d || 0;
    (function () {
        c()
    })();

    function c() {
        if (typeof a === "string") {
            var g = a;
            a = new Image();
            a.src = g;
            a.onload = function () {
                if (!f.width && !f.height) {
                    f.width = a.width / (f._canvas && f._canvas.retina ? 2 : 1);
                    f.height = a.height / (f._canvas && f._canvas.retina ? 2 : 1)
                }
            }
        }
        f.texture = a
    }
    this.draw = function (h) {
        var g = this._canvas.context;
        if (this.isMask() && !h) {
            return false
        }
        if (a) {
            this.startDraw(this.anchor.tx, this.anchor.ty);
            g.drawImage(a, -this.anchor.tx, -this.anchor.ty, this.width, this.height);
            this.endDraw()
        }
        if (e) {
            g.globalCompositeOperation = "source-in";
            e.render(true);
            g.globalCompositeOperation = "source-over"
        }
    };
    this.mask = function (g) {
        if (!g) {
            return e = null
        }
        if (!this._parent) {
            throw "CanvasTexture :: Must add to parent before masking."
        }
        var k = this._parent.children;
        var j = false;
        for (var h = 0; h < k.length; h++) {
            if (g == k[h]) {
                j = true
            }
        }
        if (j) {
            e = g;
            g.masked = this
        } else {
            throw "CanvasGraphics :: Can only mask a sibling"
        }
    }
});

Class(function CanvasGraphics(h, c) {
    Inherit(this, CanvasObject);
    var e = this;
    var j = {};
    var d = [];
    var a, f;
    this.width = h || 0;
    this.height = c || 0;
    (function () {
        i()
    })();

    function b(l) {
        for (var k in j) {
            var m = j[k];
            if (m instanceof Color) {
                l[k] = m.getHexString()
            } else {
                l[k] = m
            }
        }
    }
    function i() {
        a = new ObjectPool(Array, 25)
    }
    function g() {
        var l = a.get();
        for (var k = 0; k < arguments.length; k++) {
            l[k] = arguments[k]
        }
        d.push(l)
    }
    this.set("strokeStyle", function (k) {
        j.strokeStyle = k
    });
    this.get("strokeStyle", function () {
        return j.strokeStyle
    });
    this.set("fillStyle", function (k) {
        j.fillStyle = k
    });
    this.get("fillStyle", function () {
        return j.fillStyle
    });
    this.set("lineWidth", function (k) {
        j.lineWidth = k
    });
    this.get("lineWidth", function () {
        return j.lineWidth
    });
    this.set("lineWidth", function (k) {
        j.lineWidth = k
    });
    this.get("lineWidth", function () {
        return j.lineWidth
    });
    this.set("lineCap", function (k) {
        j.lineCap = k
    });
    this.get("lineCap", function () {
        return j.lineCap
    });
    this.set("lineJoin", function (k) {
        j.lineJoin = k
    });
    this.get("lineJoin", function () {
        return j.lineJoin
    });
    this.set("lineJoin", function (k) {
        j.lineJoin = k
    });
    this.get("lineJoin", function () {
        return j.lineJoin
    });
    this.set("lineJoin", function (k) {
        j.lineJoin = k
    });
    this.get("lineJoin", function () {
        return j.lineJoin
    });
    this.set("miterLimit", function (k) {
        j.miterLimit = k
    });
    this.get("miterLimit", function () {
        return j.miterLimit
    });
    this.set("font", function (k) {
        j.font = k
    });
    this.get("font", function (k) {
        return j.font
    });
    this.set("textAlign", function (k) {
        j.textAlign = k
    });
    this.get("textAlign", function (k) {
        return j.textAlign
    });
    this.set("textBaseline", function (k) {
        j.textBaseline = k
    });
    this.get("textBaseline", function (k) {
        return j.textBaseline
    });
    this.draw = function (m) {
        if (this.isMask() && !m) {
            return false
        }
        var l = this._canvas.context;
        this.startDraw();
        b(l);
        for (var k = 0; k < d.length; k++) {
            var o = d[k];
            if (!o) {
                continue
            }
            var n = o.shift();
            l[n].apply(l, o);
            o.unshift(n)
        }
        this.endDraw();
        if (f) {
            l.save();
            l.clip();
            f.render(true);
            l.restore()
        }
    };
    this.clear = function () {
        for (var k = 0; k < d.length; k++) {
            d[k].length = 0;
            a.put(d[k])
        }
        d.length = 0
    };
    this.arc = function (m, p, n, l, o, k) {
        if (m && !p) {
            n = m;
            m = 0;
            p = 0
        }
        m = m || 0;
        p = p || 0;
        n = n || 0;
        n -= 90;
        k = k || false;
        o = o || 0;
        o -= 90;
        l = l ? l : this.radius || this.width / 2;
        g("beginPath");
        g("arc", m, p, l, Utils.toRadians(o), Utils.toRadians(n), k)
    };
    this.quadraticCurveTo = function (m, l, k, n) {
        g("quadraticCurveTo", m, l, k, n)
    };
    this.bezierCurveTo = function (m, l, o, n, k, p) {
        g("bezierCurveTo", m, l, o, n, k, p)
    };
    this.fillRect = function (k, n, l, m) {
        g("fillRect", k, n, l, m)
    };
    this.clearRect = function (k, n, l, m) {
        g("clearRect", k, n, l, m)
    };
    this.strokeRect = function (k, n, l, m) {
        g("strokeRect", k, n, l, m)
    };
    this.moveTo = function (k, l) {
        g("moveTo", k, l)
    };
    this.lineTo = function (k, l) {
        g("lineTo", k, l)
    };
    this.stroke = function () {
        g("stroke")
    };
    this.fill = function () {
        if (!f) {
            g("fill")
        }
    };
    this.beginPath = function () {
        g("beginPath")
    };
    this.closePath = function () {
        g("closePath")
    };
    this.fillText = function (m, k, n, l) {
        g("fillText", m, k, n, l)
    };
    this.strokeText = function (m, k, n, l) {
        g("strokeText", m, k, n, l)
    };
    this.mask = function (k) {
        if (!k) {
            return f = null
        }
        if (!this._parent) {
            throw "CanvasTexture :: Must add to parent before masking."
        }
        var n = this._parent.children;
        var m = false;
        for (var l = 0; l < n.length; l++) {
            if (k == n[l]) {
                m = true
            }
        }
        if (m) {
            f = k;
            k.masked = this;
            for (l = 0; l < d.length; l++) {
                if (d[l][0] == "fill" || d[l][0] == "stroke") {
                    d[l].length = 0;
                    a.put(d[l]);
                    d.splice(l, 1)
                }
            }
        } else {
            throw "CanvasGraphics :: Can only mask a sibling"
        }
    }
});

Class(function CanvasObject() {
    Inherit(this, Component);
    var a = this;
    this.alpha = 1;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.rotation = 0;
    this.scale = 1;
    this.visible = true;
    this.anchor = {
        x: 0.5,
        y: 0.5
    };
    this.values = new CanvasValues();
    this.styles = new CanvasValues(true);
    this.children = [];
    this.blendMode = "normal";
    this.updateValues = function () {
        this.anchor.tx = this.anchor.x <= 1 ? this.anchor.x * this.width : this.anchor.x;
        this.anchor.ty = this.anchor.y <= 1 ? this.anchor.y * this.height : this.anchor.y;
        this.values.setTRSA(this.x, this.y, Utils.toRadians(this.rotation), this.scale, this.scale, this.alpha);
        if (this._parent.values) {
            this.values.calculate(this._parent.values)
        }
        if (this._parent.styles) {
            this.styles.calculateStyle(this._parent.styles)
        }
    };
    this.render = function (d) {
        if (!this.visible) {
            return false
        }
        this.updateValues();
        if (this.draw) {
            this.draw(d)
        }
        var b = this.children.length;
        for (var c = 0; c < b; c++) {
            this.children[c].render(d)
        }
    };
    this.startDraw = function (d, c) {
        var b = this._canvas.context;
        var i = this.values.data;
        var g = i[0] + (d || 0);
        var f = i[1] + (c || 0);
        b.save();
        b.globalCompositeOperation = this.blendMode || "normal";
        b.translate(g, f);
        b.rotate(i[2]);
        b.scale(i[3], i[4]);
        b.globalAlpha = i[5];
        if (this.styles.styled) {
            var j = this.styles.values;
            for (var h in j) {
                var e = j[h];
                if (e instanceof Color) {
                    b[h] = e.getHexString()
                } else {
                    b[h] = e
                }
            }
        }
    };
    this.endDraw = function () {
        this._canvas.context.restore()
    };
    this.add = function (b) {
        b._canvas = this._canvas;
        b._parent = this;
        this.children.push(b);
        b._z = this.children.length
    };
    this.remove = function (c) {
        c._canvas = null;
        c._parent = null;
        var b = this.children.indexOf(c);
        if (b) {
            this.children.splice(b, 1)
        }
    };
    this.isMask = function () {
        var b = this;
        while (b) {
            if (b.masked) {
                return true
            }
            b = b._parent
        }
        return false
    };
    this.unmask = function () {
        this.masked.mask(null);
        this.masked = null
    };
    this.setZ = function (b) {
        if (!this._parent) {
            throw "CanvasObject :: Must add to parent before setZ"
        }
        this._z = b;
        this._parent.children.sort(function (d, c) {
            return d._z - c._z
        })
    };
    this.hit = function (d) {
        var c = Utils.hitTestObject(d, this.values.hit(this));
        if (c) {
            return this
        }
        for (var b = this.children.length - 1; b > -1; b--) {
            var f = this.children[b];
            c = f.hit(d);
            if (c) {
                return f
            }
        }
        return false
    };
    this.destroy = function () {
        for (var b = 0; b < this.children.length; b++) {
            if (this.children[b].destroy) {
                this.children[b].destroy()
            }
        }
        return Utils.nullObject(this)
    }
});


Class(function CanvasValues(a) {
    Inherit(this, Component);
    var d = this;
    var c = {};
    var b = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    if (!a) {
        this.data = new Float32Array(6)
    } else {
        this.styled = false
    }
    this.set("shadowOffsetX", function (e) {
        d.styled = true;
        c.shadowOffsetX = e
    });
    this.get("shadowOffsetX", function () {
        return c.shadowOffsetX
    });
    this.set("shadowOffsetY", function (e) {
        d.styled = true;
        c.shadowOffsetY = e
    });
    this.get("shadowOffsetY", function () {
        return c.shadowOffsetY
    });
    this.set("shadowBlur", function (e) {
        d.styled = true;
        c.shadowBlur = e
    });
    this.get("shadowBlur", function () {
        return c.shadowBlur
    });
    this.set("shadowColor", function (e) {
        d.styled = true;
        c.shadowColor = e
    });
    this.get("shadowColor", function () {
        d.styled = true;
        return c.shadowColor
    });
    this.get("values", function () {
        return c
    });
    this.setTRSA = function (f, k, h, j, i, g) {
        var e = this.data;
        e[0] = f;
        e[1] = k;
        e[2] = h;
        e[3] = j;
        e[4] = i;
        e[5] = g
    };
    this.calculate = function (g) {
        var f = g.data;
        var e = this.data;
        e[0] = e[0] + f[0];
        e[1] = e[1] + f[1];
        e[2] = e[2] + f[2];
        e[3] = e[3] * f[3];
        e[4] = e[4] * f[4];
        e[5] = e[5] * f[5]
    };
    this.calculateStyle = function (g) {
        if (!g.styled) {
            return false
        }
        this.styled = true;
        var e = g.values;
        for (var f in e) {
            if (!c[f]) {
                c[f] = e[f]
            }
        }
    };
    this.hit = function (e) {
        b.x = this.data[0];
        b.y = this.data[1];
        b.width = e.width;
        b.height = e.height;
        return b
    }
});

Class(function CSSShader(l, f, k) {
    Inherit(this, Component);
    var h = this;
    var e = "";
    var i = "";
    var b = ["grayscale", "sepia", "saturate", "hue", "invert", "opacity", "brightness", "contrast", "blur"];
    var a;
    this.composite = "normal source-atop";
    this.rows = 5;
    this.cols = 5;
    this.uniforms = {};
    this.transform = {};
    this.filters = {};
    this.perspective = 2000;
    this.detached = false;

    function c(o) {
        for (var n = b.length - 1; n > -1; n--) {
            if (b[n] == o) {
                return true
            }
        }
        return false
    }
    function m() {
        var r = "";
        var n = b.length - 1;
        for (var o in h.filters) {
            if (!c(o)) {
                continue
            }
            var p = o;
            var q = h.filters[o];
            if (typeof q === "number") {
                p = p == "hue" ? "hue-rotate" : p;
                q = p == "hue-rotate" ? q + "deg" : q;
                q = p == "blur" ? q + "px" : q;
                r += p + "(" + q + ") "
            }
        }
        i = r
    }
    function j() {
        e = "perspective(" + h.perspective + ")";
        e += TweenManager.parseTransform(h.transform)
    }
    function d() {
        var o = "";
        if (f && k) {
            o += "custom(url(" + f + ")";
            o += "mix(url(" + k + ")";
            o += h.composite + "),";
            o += h.rows + " " + h.cols + (h.detached ? " detached" : "") + ",";
            o += "transform " + e + ",";
            for (var n in h.uniforms) {
                o += n + " " + h.uniforms[n] + ","
            }
            o = o.slice(0, -1);
            o += ")"
        }
        o += i;
        if (!h._blender) {
            l.div.style[Device.styles.vendor + "Filter"] = o
        } else {
            return o
        }
    }
    function g() {
        if (a || !l || l.div) {
            return false
        }
        l.div.style[Device.styles.vendor + "Transition"] = ""
    }
    this.apply = function () {
        m();
        j();
        return d()
    };
    this.tween = function (o, p, q, n, r) {
        if (typeof n === "function") {
            r = n
        }
        n = n || 0;
        clearTimeout(a);
        a = setTimeout(function () {
            l.div.style[Device.styles.vendor + "Transition"] = "all " + p + "ms " + TweenManager.getEase(q) + " " + n + "ms";
            var u = {};
            var s = {};
            var v = {};
            for (var t in o) {
                if (TweenManager.checkTransform(t)) {
                    u[t] = o[t]
                } else {
                    if (c(t)) {
                        v[t] = o[t]
                    } else {
                        s[t] = o[t]
                    }
                }
            }
            for (t in u) {
                h.transform[t] = u[t]
            }
            for (t in s) {
                h.uniforms[t] = s[t]
            }
            for (t in v) {
                h.filters[t] = v[t]
            }
            a = setTimeout(function () {
                if (r) {
                    r()
                }
            }, p + n);
            if (!h._blender) {
                h.apply()
            } else {
                h._blender.apply()
            }
        }, 10)
    };
    this.stopTween = function () {
        clearTimeout(a);
        a = null;
        g()
    };
    this.clear = function () {
        this.stopTween();
        this.filters = {};
        this.uniforms = {};
        this.transform = {};
        this.apply()
    };
    this.destroy = function () {
        this.clear();
        l = null;
        a = null;
        e = null;
        return this._destroy()
    }
});
Class(function GLShader(A, r, c, f, t) {
    Inherit(this, Component);
    var q = this;
    var m, h, u, g, n;
    var x, s, b;
    this.rows = 1;
    this.cols = 1;
    this.uniforms = {};
    (function () {
        if (!Device.graphics.webgl) {
            q.div = A.div;
            q.object = A.object;
            return
        }
        v();
        z();
        k();
        o()
    })();

    function v() {
        if (typeof r !== "number") {
            f = r;
            t = c;
            r = A.width;
            c = A.height
        }
    }
    function z() {
        var F = f;
        var C = t;
        var D, E, B;
        if (F) {
            if (!F.strpos("void main() {")) {
                throw 'GLShader :: Requires "void main() {"'
            }
            D = F.split("void main() {");
            E = D[0];
            B = D[1].slice(0, -1)
        }
        f = ["precision mediump float;", "attribute vec2 a_position;", "uniform vec2 u_resolution;", "attribute vec2 a_texCoord;", "varying vec2 v_texCoord;", "vec4 position;", E || "", "vec2 _position(vec2 pos) {", "vec2 zeroToOne = pos / u_resolution;", "vec2 zeroToTwo = zeroToOne * 2.0;", "vec2 clipSpace = zeroToTwo - 1.0;", "return clipSpace * vec2(1, -1);", "}", "vec2 coord(vec2 pos) {", "return pos / u_resolution;", "}", "vec2 pixel(vec2 co) {", "return co * u_resolution;", "}", "void main() {", "position = vec4(_position(a_position), 0, 1);", "v_texCoord = a_texCoord;", B || "", (B && B.strpos("gl_Position") ? "" : "gl_Position = position;"), "}", ].join("");
        if (C) {
            if (!C.strpos("void main() {")) {
                throw 'GLShader :: Requires "void main() {"'
            }
            D = C.split("void main() {");
            E = D[0];
            B = D[1].slice(0, -1)
        }
        t = ["precision mediump float;", "varying vec2 v_texCoord;", "uniform sampler2D u_texture;", "uniform vec2 u_resolution;", "vec4 texel;", E || "", "vec2 coord(vec2 pos) {", "return pos / u_resolution;", "}", "vec2 pixel(vec2 co) {", "return co * u_resolution;", "}", "void main() {", "texel = texture2D(u_texture, v_texCoord);", B || "", (B && B.strpos("gl_FragColor") ? "" : "gl_FragColor = texel;"), "}", ].join("")
    }
    function k() {
        m = document.createElement("canvas");
        m.width = q.width = r || 500;
        m.height = q.height = c || 500;
        try {
            h = m.getContext("experimental-webgl")
        } catch (B) {
            h = m.getContext("webgl")
        }
        q.div = m;
        q.object = $(m);
        q.object.mouseEnabled(false)
    }
    function d(I) {
        var O = A.width;
        var H = A.height;
        var D = q.rows;
        var P = q.cols;
        var N = 0;
        var L = 0;
        var C = O / D;
        var F = H / P;
        var Q = [];
        var K = D * P;
        var E, M, B, J;
        for (var G = 0; G < K; G++) {
            E = N;
            B = N + C;
            M = L;
            J = L + F;
            Q.push(E);
            Q.push(M);
            Q.push(B);
            Q.push(M);
            Q.push(E);
            Q.push(J);
            Q.push(E);
            Q.push(J);
            Q.push(B);
            Q.push(M);
            Q.push(B);
            Q.push(J);
            N += C;
            if (N > O - 1) {
                N = 0;
                L += F
            }
        }
        N = q.width / 2 - O / 2;
        L = q.height / 2 - H / 2;
        for (G = 0; G < Q.length; G++) {
            if (G % 2 == 0) {
                if (I) {
                    Q[G] /= O
                } else {
                    Q[G] += N
                }
            } else {
                if (I) {
                    Q[G] /= H
                } else {
                    Q[G] += L
                }
            }
        }
        return new Float32Array(Q)
    }
    function j() {
        if (!q.uniforms) {
            q.uniforms = {}
        }
        for (var B in q.uniforms) {
            var D = q.uniforms[B];
            var C = h.getUniformLocation(u, B);
            if (typeof D === "number") {
                h.uniform1f(C, D)
            } else {
                if (D instanceof Vector2) {
                    h.uniform2f(C, D.x, D.y)
                } else {
                    if (D instanceof Vector3) {
                        h.uniform4f(C, D.x, D.y, D.z, D.w)
                    } else {
                        if (D instanceof Color) {
                            h.uniform3f(C, D.r, D.g, D.b)
                        }
                    }
                }
            }
        }
    }
    function l() {
        u = w();
        h.useProgram(u);
        h.clearColor(0, 0, 0, 0);
        g = d();
        n = d(true)
    }
    function i() {
        var D = h.getAttribLocation(u, "a_position");
        var B = h.getAttribLocation(u, "a_texCoord");
        if (!b) {
            b = h.createBuffer()
        }
        h.bindBuffer(h.ARRAY_BUFFER, b);
        h.bufferData(h.ARRAY_BUFFER, n, h.STATIC_DRAW);
        h.enableVertexAttribArray(B);
        h.vertexAttribPointer(B, 2, h.FLOAT, false, 0, 0);
        if (!x) {
            x = h.createTexture()
        }
        h.bindTexture(h.TEXTURE_2D, x);
        h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_S, h.CLAMP_TO_EDGE);
        h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_T, h.CLAMP_TO_EDGE);
        h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MIN_FILTER, h.NEAREST);
        h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MAG_FILTER, h.NEAREST);
        h.texImage2D(h.TEXTURE_2D, 0, h.RGBA, h.RGBA, h.UNSIGNED_BYTE, A.div);
        var C = h.getUniformLocation(u, "u_resolution");
        h.uniform2f(C, q.width, q.height);
        if (!s) {
            s = h.createBuffer();
            q.buffer = s
        }
        h.bindBuffer(h.ARRAY_BUFFER, s);
        h.enableVertexAttribArray(D);
        h.vertexAttribPointer(D, 2, h.FLOAT, false, 0, 0);
        h.bufferData(h.ARRAY_BUFFER, g, h.STATIC_DRAW);
        h.enableVertexAttribArray(D);
        h.drawArrays(h.TRIANGLES, 0, g.length / 2)
    }
    function p(D, B) {
        var C = h.createShader(B);
        h.shaderSource(C, D);
        h.compileShader(C);
        if (!h.getShaderParameter(C, h.COMPILE_STATUS)) {
            throw h.getShaderInfoLog(C)
        }
        return C
    }
    function w() {
        var B = h.createProgram();
        var D = p(f, h.VERTEX_SHADER);
        var C = p(t, h.FRAGMENT_SHADER);
        h.attachShader(B, D);
        h.attachShader(B, C);
        h.linkProgram(B);
        if (!h.getProgramParameter(B, h.LINK_STATUS)) {
            throw h.getProgramInfoLog(B)
        }
        return B
    }
    function o() {
        m.addEventListener("webglcontextlost", a);
        m.addEventListener("webglcontextrestored", e)
    }
    function e() {
        try {
            h = m.getContext("experimental-webgl", {
                antialias: true
            })
        } catch (B) {
            h = m.getContext("webgl")
        }
    }
    function a() {
        h = u = x = s = b = null
    }
    this.render = function () {
        if (!Device.graphics.webgl) {
            return false
        }
        if (!u) {
            l()
        }
        h.clear(h.COLOR_BUFFER_BIT | h.DEPTH_BUFFER_BIT);
        j();
        i()
    };
    this.destroy = function () {
        if (this.object) {
            this.object.remove()
        }
        m = h = u = x = s = b = null;
        return this._destroy()
    };
    this.startRender = function () {
        Render.startRender(q.render)
    };
    this.stopRender = function () {
        Render.stopRender(q.render)
    }
});
Class(function TweenManager() {
    // console.log('==========================')
    // console.log(':: Tween Manager')
    // console.log('==========================')

    var f = this;
    var a = [];
    var d, c;
    (function () {
        Flip.ready(b);
        Render.startRender(e)
    })();

    function b() {
        f._dynamicPool = new ObjectPool(DynamicObject, 100)
    }

    function e(j) {

        if (a.length) {
            var g = a.length - 1;
            for (var h = g; h > -1; h--) {
                if (a[h]) {
                    a[h].update(j)
                } else {
                    a.splice(h, 1)
                }
            }
        }
    }

    this._addMathTween = function (g) {
        a.push(g)
    };
    this._removeMathTween = function (h) {
        for (var g = a.length - 1; g > -1; g--) {
            if (h == a[g]) {
                a.splice(g, 1)
            }
        }
    };
    this._initCSS = function (l, j, k, m, h, g, i) {
        return new CSSTween(l, j, k, m, h, g, i)
    };
    this.tween = function (k, i, j, l, h, g, m) {
        if (typeof h !== "number") {
            m = g;
            g = h;
            h = 0
        }
        return new MathTween(k, i, j, l, h, m, g)
    };
    this.clearTween = function (g) {
        if (g._mathTween && g._mathTween.stop) {
            g._mathTween.stop()
        }
    };
    this.clearCSSTween = function (g) {
        if (g && !g._cssTween && g.div._transition) {
            g.div.style[Device.styles.vendorTransition] = "";
            g.div._transition = false
        }
    };
    this.checkTransform = function (h) {
        for (var g = f.Transforms.length - 1; g > -1; g--) {
            if (h == f.Transforms[g]) {
                return true
            }
        }
        return false
    };
    this.addCustomEase = function (j) {
        var h = true;
        if (typeof j !== "object" || !j.name || !j.curve) {
            throw "TweenManager :: setCustomEase requires {name, curve}"
        }
        // console.log('custom eases')
        for (var g = f.CSSEases.length - 1; g > -1; g--) {
            if (j.name == f.CSSEases[g].name) {
                h = false
            }
        }
        if (h) {
            j.values = j.curve.split("(")[1].slice(0, -1).split(",");
            for (g = 0; g < j.values.length; g++) {
                j.values[g] = parseFloat(j.values[g])
            }
            f.CSSEases.push(j)
        }
    };
    this.getEase = function (h, g) {
        var k = f.CSSEases;
        for (var j = k.length - 1; j > -1; j--) {
            if (k[j].name == h) {
                if (g) {
                    return k[j].values
                }
                return k[j].curve
            }
        }
        return false
    };
    this.getAllTransforms = function (g) {
        var k = {};
        for (var h = 0; h < f.Transforms.length; h++) {
            var j = f.Transforms[h];
            var l = g[j];
            if (l !== 0 && typeof l === "number") {
                k[j] = l
            }
        }
        return k
    };
    this.getTransformProperty = function () {
        switch (Device.styles.vendor) {
        case "Moz":
            return "-moz-transform";
            break;
        case "Webkit":
            return "-webkit-transform";
            break;
        case "O":
            return "-o-transform";
            break;
        case "ms":
            return "-ms-transform";
            break;
        default:
            return "transform";
            break
        }
    };
    this.parseTransform = function (i) {
        var h = "";
        var k = "";
        if (typeof i.x !== "undefined" || typeof i.y !== "undefined" || typeof i.z !== "undefined") {
            var g = (i.x || 0);
            var l = (i.y || 0);
            var j = (i.z || 0);
            k += g + "px, ";
            k += l + "px";
            if (Device.tween.css3d) {
                k += ", " + j + "px";
                h += "translate3d(" + k + ")"
            } else {
                h += "translate(" + k + ")"
            }
        }
        if (typeof i.scale !== "undefined") {
            h += "scale(" + i.scale + ")"
        } else {
            if (typeof i.scaleX !== "undefined") {
                h += "scaleX(" + i.scaleX + ")"
            }
            if (typeof i.scaleY !== "undefined") {
                h += "scaleY(" + i.scaleY + ")"
            }
        }
        if (typeof i.rotation !== "undefined") {
            h += "rotate(" + i.rotation + "deg)"
        }
        if (typeof i.rotationX !== "undefined") {
            h += "rotateX(" + i.rotationX + "deg)"
        }
        if (typeof i.rotationY !== "undefined") {
            h += "rotateY(" + i.rotationY + "deg)"
        }
        if (typeof i.rotationZ !== "undefined") {
            h += "rotateZ(" + i.rotationZ + "deg)"
        }
        if (typeof i.skewX !== "undefined") {
            h += "skewX(" + i.skewX + "deg)"
        }
        if (typeof i.skewY !== "undefined") {
            h += "skewY(" + i.skewY + "deg)"
        }
        return h
    };
    this.Class = window.Class
}, "Static");

Class(function MathTween(j, l, m, b, i, k, n) {
    var h = this;
    var d, a, f;
    var e;
    (function () {
        if (j && l) {
            if (typeof m !== "number") {
                throw "MathTween Requires object, props, time, ease"
            }
            c()
        }
    })();

    function c() {
        if (j._mathTween && j._mathTween.stop) {
            j._mathTween.stop()
        }
        j._mathTween = h;
        TweenManager._addMathTween(h);
        b = TweenManager.MathEasing.convertEase(b);
        d = Date.now();
        d += i;
        f = l;
        a = TweenManager._dynamicPool.get();
        for (var o in f) {
            if (typeof j[o] === "number") {
                a[o] = j[o]
            }
        }
    }
    function g() {
        if (!j && !l) {
            return false
        }
        j._mathTween = null;
        TweenManager._dynamicPool.put(a.clear());
        d = a = f = e = null;
        j = l = m = b = i = k = n = null;
        TweenManager._removeMathTween(h)
    }
    this.start = function (p, q, r, s, o, u, t) {
        j = p;
        l = q;
        m = r;
        b = s;
        i = o;
        k = u;
        n = t;
        h = this;
        c()
    };
    this.update = function (r) {
        if (r < d) {
            return true
        }
        var p = (r - d) / m;
        p = p > 1 ? 1 : p;
        var q;
        if (typeof b === "function") {
            q = b(p)
        } else {
            q = TweenManager.MathEasing.solve(b, p)
        }
        for (var t in a) {
            if (typeof a[t] === "number") {
                var s = a[t];
                var o = f[t];
                j[t] = s + (o - s) * q
            }
        }
        if (k) {
            k(r)
        }
        if (p == 1) {
            if (!e) {
                e = true;
                if (n) {
                    n()
                }
                g()
            }
            return false
        }
        return true
    };
    this.stop = function () {
        g();
        return null
    }
});
TweenManager.Class(function MathEasing() {
    // console.log(':: MATH EASING')
    function d(i, g, h) {
        return ((a(g, h) * i + f(g, h)) * i + e(g)) * i
    }
    function b(k, n, l) {
        var h = k;
        for (var j = 0; j < 4; j++) {
            var m = c(h, n, l);
            if (m == 0) {
                return h
            }
            var g = d(h, n, l) - k;
            h -= g / m
        }
        return h
    }
    function c(i, g, h) {
        return 3 * a(g, h) * i * i + 2 * f(g, h) * i + e(g)
    }
    function a(g, h) {
        return 1 - 3 * h + 3 * g
    }
    function f(g, h) {
        return 3 * h - 6 * g
    }
    function e(g) {
        return 3 * g
    }
    this.convertEase = function (i) {
        var g = (function () {
            switch (i) {
            case "easeInQuad":
                return TweenManager.MathEasing.Quad.In;
                break;
            case "easeInCubic":
                return TweenManager.MathEasing.Cubic.In;
                break;
            case "easeInQuart":
                return TweenManager.MathEasing.Quart.In;
                break;
            case "easeInQuint":
                return TweenManager.MathEasing.Quint.In;
                break;
            case "easeInSine":
                return TweenManager.MathEasing.Sine.In;
                break;
            case "easeInExpo":
                return TweenManager.MathEasing.Expo.In;
                break;
            case "easeInCirc":
                return TweenManager.MathEasing.Circ.In;
                break;
            case "easeInElastic":
                return TweenManager.MathEasing.Elastic.In;
                break;
            case "easeInBack":
                return TweenManager.MathEasing.Back.In;
                break;
            case "easeInBounce":
                return TweenManager.MathEasing.Bounce.In;
                break;
            case "easeOutQuad":
                return TweenManager.MathEasing.Quad.Out;
                break;
            case "easeOutCubic":
                return TweenManager.MathEasing.Cubic.Out;
                break;
            case "easeOutQuart":
                return TweenManager.MathEasing.Quart.Out;
                break;
            case "easeOutQuint":
                return TweenManager.MathEasing.Quint.Out;
                break;
            case "easeOutSine":
                return TweenManager.MathEasing.Sine.Out;
                break;
            case "easeOutExpo":
                return TweenManager.MathEasing.Expo.Out;
                break;
            case "easeOutCirc":
                return TweenManager.MathEasing.Circ.Out;
                break;
            case "easeOutElastic":
                return TweenManager.MathEasing.Elastic.Out;
                break;
            case "easeOutBack":
                return TweenManager.MathEasing.Back.Out;
                break;
            case "easeOutBounce":
                return TweenManager.MathEasing.Bounce.Out;
                break;
            case "easeInOutQuad":
                return TweenManager.MathEasing.Quad.InOut;
                break;
            case "easeInOutCubic":
                return TweenManager.MathEasing.Cubic.InOut;
                break;
            case "easeInOutQuart":
                return TweenManager.MathEasing.Quart.InOut;
                break;
            case "easeInOutQuint":
                return TweenManager.MathEasing.Quint.InOut;
                break;
            case "easeInOutSine":
                return TweenManager.MathEasing.Sine.InOut;
                break;
            case "easeInOutExpo":
                return TweenManager.MathEasing.Expo.InOut;
                break;
            case "easeInOutCirc":
                return TweenManager.MathEasing.Circ.InOut;
                break;
            case "easeInOutElastic":
                return TweenManager.MathEasing.Elastic.InOut;
                break;
            case "easeInOutBack":
                return TweenManager.MathEasing.Back.InOut;
                break;
            case "easeInOutBounce":
                return TweenManager.MathEasing.Bounce.InOut;
                break;
            case "linear":
                return TweenManager.MathEasing.Linear.None;
                break
            }
        })();
        if (!g) {
            var h = TweenManager.getEase(i, true);
            if (h) {
                g = h
            } else {
                g = TweenManager.MathEasing.Cubic.Out
            }
        }
        return g
    };
    this.solve = function (h, g) {
        if (h[0] == h[1] && h[2] == h[3]) {
            return g
        }
        return d(b(g, h[0], h[2]), h[1], h[3])
    }
}, "Static");
(function () {
    // console.log('FIRST CALL');
    // Looks to setup a bunch of tween managers
    // console.log(':: Tween Managers');

    TweenManager.MathEasing.Linear = {
        None: function (a) {
            return a
        }
    };
    TweenManager.MathEasing.Quad = {
        In: function (a) {
            return a * a
        },
        Out: function (a) {
            return a * (2 - a)
        },
        InOut: function (a) {
            if ((a *= 2) < 1) {
                return 0.5 * a * a
            }
            return -0.5 * (--a * (a - 2) - 1)
        }
    };
    TweenManager.MathEasing.Cubic = {
        In: function (a) {
            return a * a * a
        },
        Out: function (a) {
            return --a * a * a + 1
        },
        InOut: function (a) {
            if ((a *= 2) < 1) {
                return 0.5 * a * a * a
            }
            return 0.5 * ((a -= 2) * a * a + 2)
        }
    };
    TweenManager.MathEasing.Quart = {
        In: function (a) {
            return a * a * a * a
        },
        Out: function (a) {
            return 1 - --a * a * a * a
        },
        InOut: function (a) {
            if ((a *= 2) < 1) {
                return 0.5 * a * a * a * a
            }
            return -0.5 * ((a -= 2) * a * a * a - 2)
        }
    };
    TweenManager.MathEasing.Quint = {
        In: function (a) {
            return a * a * a * a * a
        },
        Out: function (a) {
            return --a * a * a * a * a + 1
        },
        InOut: function (a) {
            if ((a *= 2) < 1) {
                return 0.5 * a * a * a * a * a
            }
            return 0.5 * ((a -= 2) * a * a * a * a + 2)
        }
    };
    TweenManager.MathEasing.Sine = {
        In: function (a) {
            return 1 - Math.cos(a * Math.PI / 2)
        },
        Out: function (a) {
            return Math.sin(a * Math.PI / 2)
        },
        InOut: function (a) {
            return 0.5 * (1 - Math.cos(Math.PI * a))
        }
    };
    TweenManager.MathEasing.Expo = {
        In: function (a) {
            return a === 0 ? 0 : Math.pow(1024, a - 1)
        },
        Out: function (a) {
            return a === 1 ? 1 : 1 - Math.pow(2, -10 * a)
        },
        InOut: function (a) {
            if (a === 0) {
                return 0
            }
            if (a === 1) {
                return 1
            }
            if ((a *= 2) < 1) {
                return 0.5 * Math.pow(1024, a - 1)
            }
            return 0.5 * (-Math.pow(2, -10 * (a - 1)) + 2)
        }
    };
    TweenManager.MathEasing.Circ = {
        In: function (a) {
            return 1 - Math.sqrt(1 - a * a)
        },
        Out: function (a) {
            return Math.sqrt(1 - --a * a)
        },
        InOut: function (a) {
            if ((a *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - a * a) - 1)
            }
            return 0.5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
        }
    };
    TweenManager.MathEasing.Elastic = {
        In: function (c) {
            var d, b = 0.1,
                e = 0.4;
            if (c === 0) {
                return 0
            }
            if (c === 1) {
                return 1
            }
            if (!b || b < 1) {
                b = 1;
                d = e / 4
            } else {
                d = e * Math.asin(1 / b) / (2 * Math.PI)
            }
            return -(b * Math.pow(2, 10 * (c -= 1)) * Math.sin((c - d) * (2 * Math.PI) / e))
        },
        Out: function (c) {
            var d, b = 0.1,
                e = 0.4;
            if (c === 0) {
                return 0
            }
            if (c === 1) {
                return 1
            }
            if (!b || b < 1) {
                b = 1;
                d = e / 4
            } else {
                d = e * Math.asin(1 / b) / (2 * Math.PI)
            }
            return (b * Math.pow(2, -10 * c) * Math.sin((c - d) * (2 * Math.PI) / e) + 1)
        },
        InOut: function (c) {
            var d, b = 0.1,
                e = 0.4;
            if (c === 0) {
                return 0
            }
            if (c === 1) {
                return 1
            }
            if (!b || b < 1) {
                b = 1;
                d = e / 4
            } else {
                d = e * Math.asin(1 / b) / (2 * Math.PI)
            }
            if ((c *= 2) < 1) {
                return -0.5 * (b * Math.pow(2, 10 * (c -= 1)) * Math.sin((c - d) * (2 * Math.PI) / e))
            }
            return b * Math.pow(2, -10 * (c -= 1)) * Math.sin((c - d) * (2 * Math.PI) / e) * 0.5 + 1
        }
    };
    TweenManager.MathEasing.Back = {
        In: function (a) {
            var b = 1.70158;
            return a * a * ((b + 1) * a - b)
        },
        Out: function (a) {
            var b = 1.70158;
            return --a * a * ((b + 1) * a + b) + 1
        },
        InOut: function (a) {
            var b = 1.70158 * 1.525;
            if ((a *= 2) < 1) {
                return 0.5 * (a * a * ((b + 1) * a - b))
            }
            return 0.5 * ((a -= 2) * a * ((b + 1) * a + b) + 2)
        }
    };
    TweenManager.MathEasing.Bounce = {
        In: function (a) {
            return 1 - TweenManager.MathEasing.Bounce.Out(1 - a)
        },
        Out: function (a) {
            if (a < (1 / 2.75)) {
                return 7.5625 * a * a
            } else {
                if (a < (2 / 2.75)) {
                    return 7.5625 * (a -= (1.5 / 2.75)) * a + 0.75
                } else {
                    if (a < (2.5 / 2.75)) {
                        return 7.5625 * (a -= (2.25 / 2.75)) * a + 0.9375
                    } else {
                        return 7.5625 * (a -= (2.625 / 2.75)) * a + 0.984375
                    }
                }
            }
        },
        InOut: function (a) {
            if (a < 0.5) {
                return TweenManager.MathEasing.Bounce.In(a * 2) * 0.5
            }
            return TweenManager.MathEasing.Bounce.Out(a * 2 - 1) * 0.5 + 0.5
        }
    }
})();

Class(function CSSTween(p, B, E, l, u, s, r) {
    // console.log('CSS TWEEN')
    var A = this;
    var g, t, H, F, G;
    var f, q, d, j, o;
    var v, z, b, n;
    (function () {
        if (p && B) {
            if (typeof E !== "number") {
                throw "CSSTween Requires object, props, time, ease"
            }
            i()
        }
    })();

    function i() {
        if (c()) {
            C();
            if (!r) {
                k()
            }
        } else {
            if (!r) {
                e();
                h();
                a()
            }
        }
    }
    function h() {
        var I = TweenManager.getAllTransforms(p);
        var K = [];
        for (var J in B) {
            if (TweenManager.checkTransform(J)) {
                I.use = true;
                I[J] = B[J];
                delete B[J]
            } else {
                K.push(J)
            }
        }
        if (I.use) {
            K.push(TweenManager.getTransformProperty())
        }
        j = I;
        v = K
    }
    function C() {
        var I = TweenManager.getAllTransforms(p);
        F = TweenManager._dynamicPool.get();
        d = TweenManager._dynamicPool.get();
        q = TweenManager._dynamicPool.get();
        H = TweenManager._dynamicPool.get();
        for (var J in I) {
            q[J] = I[J];
            d[J] = I[J]
        }
        for (J in B) {
            if (TweenManager.checkTransform(J)) {
                z = true;
                q[J] = p[J] || 0;
                d[J] = B[J]
            } else {
                b = true;
                if (typeof B[J] === "string") {
                    p.div.style[J] = B[J]
                } else {
                    H[J] = Number(p.css(J));
                    F[J] = B[J]
                }
            }
        }
    }
    function c() {
        if (B.math) {
            delete B.math;
            return g = true
        }
        if (!Device.tween.transition) {
            return g = true
        }
        if (l.strpos("Elastic") || l.strpos("Bounce")) {
            return g = true
        }
        return g = false
    }
    function k() {
        p._cssTween = A;
        A.playing = true;
        B = H.copy();
        j = q.copy();
        if (b) {
            t = TweenManager.tween(B, F, E, l, u, w, x)
        }
        if (z) {
            o = TweenManager.tween(j, d, E, l, u, (!b ? w : null), (!b ? x : null))
        }
    }
    function a() {
        if (!A.kill && p.div && v) {
            p._cssTween = A;
            p.div._transition = true;
            var K = "";
            var I = v.length;
            for (var J = 0; J < I; J++) {
                K += (K.length ? ", " : "") + v[J] + " " + E + "ms " + TweenManager.getEase(l) + " " + u + "ms"
            }
            Render.setupTween(function () {
                if (A.kill || !p || !p.div) {
                    return false
                }
                p.div.style[Device.styles.vendorTransition] = K;
                p.css(B);
                p.transform(j);
                A.playing = true;
                p.div.addEventListener(Device.tween.complete, m)
            })
        }
    }
    function m() {
        if (A.kill || !p || !p.div) {
            return false
        }
        w()
    }
    function x() {
        if (!A.kill && p && p.div) {
            p.css(B);
            p.transform(j)
        }
    }
    function e() {
        if (!p || !p.div) {
            return false
        }
        if (p._cssTween) {
            p._cssTween.stop()
        }
        p.div.removeEventListener(Device.tween.complete, m);
        A.playing = false
    }
    function D() {
        if (g) {
            TweenManager._dynamicPool.put(F.clear());
            TweenManager._dynamicPool.put(d.clear());
            TweenManager._dynamicPool.put(q.clear());
            TweenManager._dynamicPool.put(H.clear())
        }
        g = t = o = H = F = G = null;
        f = q = d = j = o = null;
        v = z = b = null;
        B = E = l = u = s = r = null;
        A.kill = false
    }
    function w() {
        if (A.playing) {
            p._cssTween = null;
            if (!g) {
                e()
            }
            A.playing = false;
            if (f) {
                f.play()
            } else {
                if (s) {
                    s()
                }
            }
            D()
        }
    }
    this.start = function (J, L, M, N, I, O, K) {
        p = J;
        B = L;
        E = M;
        l = N;
        u = I;
        s = O;
        r = K;
        A = this;
        i();
        return this
    };
    this.stop = function () {
        if (A.playing) {
            p.div.style[Device.styles.vendor + "Transition"] = "";
            p.div._transition = false;
            A.kill = true;
            p._cssTween = null;
            if (f) {
                f.stop()
            }
            if (g && t && t.stop) {
                t.stop()
            }
            if (g && o && o.stop) {
                o.stop()
            } else {
                e()
            }
            D()
        }
    };
    this.play = function (I) {
        if (!A.playing) {
            if (g) {
                if (!I) {
                    C()
                }
                k()
            } else {
                h();
                Render.nextFrame(a)
            }
        }
    };
    this.chain = function (I) {
        f = I;
        return f
    }
});

(function () {
    // console.log('SECOND CALL');    
    // console.log(':: Creates many Flip objects');
    // console.log($.fn)
    $.fn.transform = function (b) {
        TweenManager.clearCSSTween(this);
        if (Device.tween.css2d) {
            if (!b) {
                b = this
            } else {
                for (var a in b) {
                    if (typeof b[a] === "number") {
                        this[a] = b[a]
                    }
                }
            }
            if (!this._matrix) {
                this.div.style[Device.styles.vendorTransform] = TweenManager.parseTransform(b)
            } else {
                if (this._matrix.type == "matrix2") {
                    this._matrix.setTRS(this.x, this.y, this.rotation, this.scaleX || this.scale, this.scaleY || this.scale)
                } else {
                    this._matrix.setTRS(this.x, this.y, this.z, this.rotationX, this.rotationY, this.rotationZ, this.scaleX || this.scale, this.scaleY || this.scale, this.scaleZ || this.scale)
                }
                this.div.style[Device.styles.vendorTransform] = this._matrix.getCSS()
            }
        }
        return this
    };

    $.fn.useMatrix3D = function () {
        this._matrix = new Matrix4();
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.scale = 1;
        return this
    };

    $.fn.useMatrix2D = function () {
        this._matrix = new Matrix2();
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.scale = 1;
        return this
    };

    $.fn.matrix = function (a) {
        this.div.style[Device.styles.vendorTransform] = a;
        return this
    };

    $.fn.accelerate = function () {
        this.__accelerated = true;
        if (!this.z) {
            this.z = 0;
            this.transform()
        }
    };

    $.fn.backfaceVisibility = function (a) {
        if (a) {
            this.div.style[CSS.prefix("BackfaceVisibility")] = ""
        } else {
            this.div.style[CSS.prefix("BackfaceVisibility")] = "hidden"
        }
    };

    $.fn.enable3D = function (b, a, c) {
        this.div.style[CSS.prefix("TransformStyle")] = "preserve-3d";
        if (b) {
            this.div.style[CSS.prefix("Perspective")] = b + "px"
        }
        if (typeof a === "number" || typeof c === "number") {
            this.div.style[CSS.prefix("PerspectiveOrigin")] = (a || 0) + "px " + (c || 0) + "px"
        }
        return this
    };

    $.fn.disable3D = function () {
        this.div.style[CSS.prefix("TransformStyle")] = "";
        this.div.style[CSS.prefix("Perspective")] = "";
        return this
    };

    $.fn.transformPoint = function (a, d, c) {
        var b = "";
        if (typeof a !== "undefined") {
            b += a + "px "
        }
        if (typeof d !== "undefined") {
            b += d + "px "
        }
        if (typeof c !== "undefined") {
            b += c + "px"
        }
        this.div.style[CSS.prefix("TransformOrigin")] = b;
        return this
    };

    $.fn.tween = function (c, d, e, a, f, b) {
        if (typeof a === "boolean") {
            b = a;
            a = 0;
            f = null
        } else {
            if (typeof a === "function") {
                f = a;
                a = 0
            }
        }
        if (typeof f === "boolean") {
            b = f;
            f = null
        }
        if (!a || a < 10) {
            a = 10
        }
        return TweenManager._initCSS(this, c, d, e, a, f, b)
    };

    $.fn.clearTransform = function () {
        if (typeof this.x === "number") {
            this.x = 0
        }
        if (typeof this.y === "number") {
            this.y = 0
        }
        if (typeof this.z === "number") {
            this.z = 0
        }
        if (typeof this.scale === "number") {
            this.scale = 1
        }
        if (typeof this.scaleX === "number") {
            this.scaleX = 1
        }
        if (typeof this.scaleY === "number") {
            this.scaleY = 1
        }
        if (typeof this.rotation === "number") {
            this.rotation = 0
        }
        if (typeof this.rotationX === "number") {
            this.rotationX = 0
        }
        if (typeof this.rotationY === "number") {
            this.rotationY = 0
        }
        if (typeof this.rotationZ === "number") {
            this.rotationZ = 0
        }
        if (typeof this.skewX === "number") {
            this.skewX = 0
        }
        if (typeof this.skewY === "number") {
            this.skewY = 0
        }
        if (!this.__accelerated) {
            this.div.style[Device.styles.vendorTransform] = ""
        } else {
            this.accelerate()
        }
        return this
    };

    $.fn.stopTween = function () {
        if (this._cssTween) {
            this._cssTween.stop()
        }
        if (this._mathTween) {
            this._mathTween.stop()
        }
        return this
    }
})();
(function () {
    // console.log('THIRD CALL');
    // console.log(':: Sets values for CSS Eases');

    TweenManager.Transforms = ["scale", "scaleX", "scaleY", "x", "y", "z", "rotation", "rotationX", "rotationY", "rotationZ", "skewX", "skewY", ];
    TweenManager.CSSEases = [{
        name: "easeOutCubic",
        curve: "cubic-bezier(0.215, 0.610, 0.355, 1.000)"
    }, {
        name: "easeOutQuad",
        curve: "cubic-bezier(0.250, 0.460, 0.450, 0.940)"
    }, {
        name: "easeOutQuart",
        curve: "cubic-bezier(0.165, 0.840, 0.440, 1.000)"
    }, {
        name: "easeOutQuint",
        curve: "cubic-bezier(0.230, 1.000, 0.320, 1.000)"
    }, {
        name: "easeOutSine",
        curve: "cubic-bezier(0.390, 0.575, 0.565, 1.000)"
    }, {
        name: "easeOutExpo",
        curve: "cubic-bezier(0.190, 1.000, 0.220, 1.000)"
    }, {
        name: "easeOutCirc",
        curve: "cubic-bezier(0.075, 0.820, 0.165, 1.000)"
    }, {
        name: "easeOutBack",
        curve: "cubic-bezier(0.175, 0.885, 0.320, 1.275)"
    }, {
        name: "easeInCubic",
        curve: "cubic-bezier(0.550, 0.055, 0.675, 0.190)"
    }, {
        name: "easeInQuad",
        curve: "cubic-bezier(0.550, 0.085, 0.680, 0.530)"
    }, {
        name: "easeInQuart",
        curve: "cubic-bezier(0.895, 0.030, 0.685, 0.220)"
    }, {
        name: "easeInQuint",
        curve: "cubic-bezier(0.755, 0.050, 0.855, 0.060)"
    }, {
        name: "easeInSine",
        curve: "cubic-bezier(0.470, 0.000, 0.745, 0.715)"
    }, {
        name: "easeInCirc",
        curve: "cubic-bezier(0.600, 0.040, 0.980, 0.335)"
    }, {
        name: "easeInBack",
        curve: "cubic-bezier(0.600, -0.280, 0.735, 0.045)"
    }, {
        name: "easeInOutCubic",
        curve: "cubic-bezier(0.645, 0.045, 0.355, 1.000)"
    }, {
        name: "easeInOutQuad",
        curve: "cubic-bezier(0.455, 0.030, 0.515, 0.955)"
    }, {
        name: "easeInOutQuart",
        curve: "cubic-bezier(0.770, 0.000, 0.175, 1.000)"
    }, {
        name: "easeInOutQuint",
        curve: "cubic-bezier(0.860, 0.000, 0.070, 1.000)"
    }, {
        name: "easeInOutSine",
        curve: "cubic-bezier(0.445, 0.050, 0.550, 0.950)"
    }, {
        name: "easeInOutExpo",
        curve: "cubic-bezier(1.000, 0.000, 0.000, 1.000)"
    }, {
        name: "easeInOutCirc",
        curve: "cubic-bezier(0.785, 0.135, 0.150, 0.860)"
    }, {
        name: "easeInOutBack",
        curve: "cubic-bezier(0.680, -0.550, 0.265, 1.550)"
    }, {
        name: "linear",
        curve: "linear"
    }]
})();
Class(function Mouse() {
    // console.log('THIRD AGAIN CALL')
    // console.log(':: STATIC – mouse objects and methods')
    var d = this;
    var b;
    this.x = 0;
    this.y = 0;

    function c(g) {
        d.ready = true;
        var f = Utils.touchEvent(g);
        d.x = f.x;
        d.y = f.y
    }
    function a() {
        d.x = d.y = 0
    }
    this.capture = function (e, f) {
        if (b) {
            return false
        }
        b = true;
        d.x = e || 0;
        d.y = f || 0;
        if (!Device.mobile) {
            // console.log('__window object')
            // console.log(__window);

            __window.bind("mousemove", c)
        } else {
            __window.bind("touchend", a);
            __window.bind("touchmove", c);
            __window.bind("touchstart", c)
        }
    };
    this.stop = function () {
        if (!b) {
            return false
        }
        b = false;
        d.x = 0;
        d.y = 0;
        if (!Device.mobile) {
            __window.unbind("mousemove", c)
        } else {
            __window.unbind("touchend", a);
            __window.unbind("touchmove", c);
            __window.unbind("touchstart", c)
        }
    };
    this.preventClicks = function () {
        d._preventClicks = true;
        setTimeout(function () {
            d._preventClicks = false
        }, 500)
    };
    this.preventFireAfterClick = function () {
        d._preventFire = true
    }
}, "Static");

(function () {
    // console.log('FOURTH CALL');
    // console.log(':: Sets click, hover, press, bind, unbind, etc...events');


    $.fn.click = function (d, a) {
        var c = this;

        function b(f) {
            // console.log('click');
            if (!c.div) {
                return false
            }
            if (Mouse._preventClicks) {
                return false
            }
            f.object = c.div.className == "hit" ? c.parent() : c;
            f.action = "click";
            if (!f.pageX) {
                f.pageX = f.clientX;
                f.pageY = f.clientY
            }
            if (d) {
                d(f)
            }
            if (Mouse.autoPreventClicks) {
                Mouse.preventClicks()
            }
        }
        if (a) {
            if (this._events.click) {
                this.div[Flip.removeEvent](Flip.translateEvent("click"), this._events.click, true);
                this.div.style.cursor = "auto";
                this._events.click = null
            }
        } else {
            if (this._events.click) {
                this.click(null, true)
            }
            this.div[Flip.addEvent](Flip.translateEvent("click"), b, true);
            this.div.style.cursor = "pointer"
        }
        this._events.click = b;
        return this
    };

    $.fn.hover = function (g, a) {
        var f = this;
        var e = false;
        var d;

        function b(j) {
            if (!f.div) {
                return false
            }
            var i = Date.now();
            var h = j.toElement || j.relatedTarget;
            if (d && (i - d) < 5) {
                d = i;
                return false
            }
            d = i;
            j.object = f.div.className == "hit" ? f.parent() : f;
            switch (j.type) {
            case "mouseout":
                j.action = "out";
                break;
            case "mouseleave":
                j.action = "out";
                break;
            default:
                j.action = "over";
                break
            }
            if (e) {
                if (Mouse._preventClicks) {
                    return false
                }
                if (j.action == "over") {
                    return false
                }
                if (j.action == "out") {
                    if (c(f.div, h)) {
                        return false
                    }
                }
                e = false
            } else {
                if (j.action == "out") {
                    return false
                }
                e = true
            }
            if (!j.pageX) {
                j.pageX = j.clientX;
                j.pageY = j.clientY
            }
            if (g) {
                g(j)
            }
        }
        function c(l, j) {
            var h = l.children.length - 1;
            for (var k = h; k > -1; k--) {
                if (j == l.children[k]) {
                    return true
                }
            }
            for (k = h; k > -1; k--) {
                if (c(l.children[k], j)) {
                    return true
                }
            }
        }
        if (a) {
            if (this._events.hover) {
                this.div[Flip.removeEvent](Flip.translateEvent("mouseover"), this._events.hover, true);
                this.div[Flip.removeEvent](Flip.translateEvent("mouseout"), this._events.hover, true);
                this._events.hover = null
            }
        } else {
            if (this._events.hover) {
                this.hover(null, true)
            }
            this.div[Flip.addEvent](Flip.translateEvent("mouseover"), b, true);
            this.div[Flip.addEvent](Flip.translateEvent("mouseout"), b, true)
        }
        this._events.hover = b;
        return this
    };
    $.fn.press = function (d, a) {
        var c = this;

        function b(f) {
            if (!c.div) {
                return false
            }
            f.object = c.div.className == "hit" ? c.parent() : c;
            switch (f.type) {
            case "mousedown":
                f.action = "down";
                break;
            default:
                f.action = "up";
                break
            }
            if (!f.pageX) {
                f.pageX = f.clientX;
                f.pageY = f.clientY
            }
            if (d) {
                d(f)
            }
        }
        if (a) {
            if (this._events.press) {
                this.div[Flip.removeEvent](Flip.translateEvent("mousedown"), this._events.press, true);
                this.div[Flip.removeEvent](Flip.translateEvent("mouseup"), this._events.press, true);
                this._events.press = null
            }
        } else {
            if (this._events.press) {
                this.press(null, true)
            }
            this.div[Flip.addEvent](Flip.translateEvent("mousedown"), b, true);
            this.div[Flip.addEvent](Flip.translateEvent("mouseup"), b, true)
        }
        this._events.press = b;
        return this
    };
    $.fn.bind = function (b, f) {
        if (b == "touchstart") {
            if (!Device.mobile) {
                b = "mousedown"
            }
        } else {
            if (b == "touchmove") {
                if (!Device.mobile) {
                    b = "mousemove"
                }
            } else {
                if (b == "touchend") {
                    if (!Device.mobile) {
                        b = "mouseup"
                    }
                }
            }
        }
        this._events["bind_" + b] = this._events["bind_" + b] || [];
        var d = this._events["bind_" + b];
        var c = {};
        c.callback = f;
        c.target = this.div;
        d.push(c);

        function a(j) {
            var k = Utils.touchEvent(j);
            j.x = k.x;
            j.y = k.y;
            for (var g = 0; g < d.length; g++) {
                var h = d[g];
                if (h.target == j.currentTarget) {
                    h.callback(j)
                }
            }
        }
        if (!this._events["fn_" + b]) {
            this._events["fn_" + b] = a;
            this.div[Flip.addEvent](Flip.translateEvent(b), a, true)
        }
        return this
    };
    $.fn.unbind = function (a, e) {
        if (a == "touchstart") {
            if (!Device.mobile) {
                a = "mousedown"
            }
        } else {
            if (a == "touchmove") {
                if (!Device.mobile) {
                    a = "mousemove"
                }
            } else {
                if (a == "touchend") {
                    if (!Device.mobile) {
                        a = "mouseup"
                    }
                }
            }
        }
        var d = this._events["bind_" + a];
        if (!d) {
            return this
        }
        for (var b = 0; b < d.length; b++) {
            var c = d[b];
            if (c.callback == e) {
                d.splice(b, 1)
            }
        }
        if (this._events["fn_" + a] && !d.length) {
            this.div[Flip.removeEvent](Flip.translateEvent(a), this._events["fn_" + a], true);
            this._events["fn_" + a] = null
        }
        return this
    };
    $.fn.interact = function (c, a, b) {
        if (!this.hit) {
            this.hit = $(".hit");
            this.hit.css({
                width: "100%",
                height: "100%",
                zIndex: 99999,
                top: 0,
                left: 0,
                position: "absolute",
                background: "rgba(255, 255, 255, 0)"
            });
            this.addChild(this.hit)
        }
        if (!Device.mobile) {
            this.hit.hover(c).click(a)
        } else {
            this.hit.touchClick(!b ? c : null, a)
        }
    };
    Flip.eventTypes = ["hover", "press", "click", "touchClick", "touchSwipe"];
    Flip.translateEvent = function (a) {
        if (Flip.addEvent == "attachEvent") {
            switch (a) {
            case "click":
                return "onclick";
                break;
            case "mouseover":
                return "onmouseover";
                break;
            case "mouseout":
                return "onmouseleave";
                break;
            case "mousedown":
                return "onmousedown";
                break;
            case "mouseup":
                return "onmouseup";
                break;
            case "mousemove":
                return "onmousemove";
                break
            }
        }
        return a
    }
})();
(function () {

    // console.log('FOURTH AGAIN CALL')
    // console.log(':: sets Flip Objects ($.fn) for attributes and values')
    // console.log($.fn)
    // $.fn.justin = function() {
    //     console.log('justin');
    //     console.log(this);

    //     return this;
    // }

    $.fn.attr = function (a, b) {
        // console.log('a')
        // console.log(a)
        // console.log('b')
        // console.log(b)
        if (a && b) {
            if (b == "") {
                this.div.removeAttribute(a)
            } else {
                this.div.setAttribute(a, b)
            }
        } else {
            if (a) {
                return this.div.getAttribute(a)
            }
        }
        return this
    };

    $.fn.val = function (a) {
        if (typeof a === "undefined") {
            return this.div.value
        } else {
            this.div.value = a
        }
        return this
    };

    $.fn.change = function (b) {
        var a = this;
        if (this._type == "select") {
            this.div.onchange = function () {
                b({
                    object: a,
                    value: a.div.value || ""
                })
            }
        }
    }
// })();




// (function () {
    // console.log('FIFTH CALL');
    // console.log(':: Sets Flip Objects ($.fn) for keypress, keydown and keyup');

    $.fn.keypress = function (a) {
        this.div.onkeypress = function (b) {
            console.log('keypress');
            b = b || window.event;
            b.code = b.keyCode ? b.keyCode : b.charCode;
            a(b)
        }
    };
    $.fn.keydown = function (a) {
        this.div.onkeydown = function (b) {
            b = b || window.event;
            b.code = b.keyCode;
            a(b)
        }
    };
    $.fn.keyup = function (a) {
        this.div.onkeyup = function (b) {
            b = b || window.event;
            b.code = b.keyCode;
            a(b)
        }
    }
})();
Class(function Swipe() {
    // console.log('SWIPE EVENTS')
    var c;
    var b, a;
    this.max = 0;
    this.width = 100;
    this.currentSlide = 0;
    this.saveX = 0;
    this.currentX = 0;
    this.threshold = 0.1;
    this.minDist = 10;
    this.disableY = false;
    this._values = new Object();
    this.__slide = function (e) {
        var f = c.currentSlide;
        c.currentSlide += e;
        var d = -c.currentSlide * c.slideWidth;
        c.swipeContainer.tween({
            x: d
        }, 500, "easeOutCubic");
        c.currentX = d;
        if (f != c.currentSlide && c.slideComplete) {
            c.slideComplete(c.currentSlide)
        }
    };
    this.__start = function (d) {
        if ((!Device.mobile || d.touches.length == 1) && !a) {
            c.swiping = true;
            c.swipeContainer.stopTween();
            c._values.x = Utils.touchEvent(d).x;
            c._values.time = Date.now();
            if (Device.mobile) {
                __window.bind("touchmove", c.__move)
            } else {
                __window.bind("mousemove", c.__move)
            }
            if (c.disableY) {
                b = d.touches[0].pageY
            }
        }
    };
    this.__move = function (g) {
        if ((!Device.mobile || g.touches.length == 1) && !a) {
            if (c.disableY) {
                var i = Utils.touchEvent(g).y;
                if (Math.abs(i - b) > 25) {
                    a = true;
                    if (Device.mobile) {
                        __window.unbind("touchmove", c.__move)
                    } else {
                        __window.unbind("mousemove", c.__move)
                    }
                }
            }
            var d = Utils.touchEvent(g).x;
            var f = d - c._values.x;
            var h = c.saveX + f;
            if (h > 0) {
                f /= 2;
                c._values.snap = "left"
            } else {
                if (h < c.max) {
                    f /= 2;
                    c._values.snap = "right"
                } else {
                    c._values.snap = null
                }
            }
            c.currentX = c.saveX + f;
            c.swipeContainer.x = c.currentX;
            c.swipeContainer.transform();
            if (c.move) {
                c.move(c.currentX, c.currentSlide)
            }
        }
    };
    this.__end = function (j) {
        c.swiping = false;
        if (Device.mobile) {
            __window.unbind("touchmove", c.__move)
        } else {
            __window.unbind("mousemove", c.__move)
        }
        a = false;
        if (a) {
            c.__slide(0)
        } else {
            if (c._values.snap) {
                var f = 0;
                if (c._values.snap == "right") {
                    f = c.max
                }
                c.swipeContainer.tween({
                    x: f
                }, 500, "easeOutCubic");
                c.currentX = f;
                c._values.snap = null
            } else {
                var d = -(c.slideWidth * c.currentSlide + c.slideWidth / 2);
                var i = d + c.slideWidth;
                if (c.currentX < d) {
                    c.__slide(1)
                } else {
                    if (c.currentX > i) {
                        c.__slide(-1)
                    } else {
                        var h = Date.now();
                        var l = Utils.touchEvent(j).x - c._values.x;
                        var k = h - c._values.time;
                        var g = l / k;
                        if (Math.abs(l) >= c.minDist && Math.abs(g) > c.threshold) {
                            if (g < 0) {
                                c.__slide(1)
                            } else {
                                c.__slide(-1)
                            }
                        } else {
                            c.__slide(0)
                        }
                    }
                }
            }
        }
        c._values.x = c._values.time = null;
        c.saveX = c.currentX
    };
    this.addListeners = function (d) {
        c = this;
        c.slideWidth = c.width / c.slides;
        c.max = -c.width + c.slideWidth;
        c.swipeContainer = d;
        d.transform({
            x: 0
        });
        if (Device.mobile) {
            d.bind("touchstart", c.__start);
            __window.bind("touchend", c.__end);
            __window.bind("touchcancel", c.__touchCancel)
        } else {
            d.bind("mousedown", c.__start);
            __window.bind("mouseup", c.__end)
        }
    };
    this.removeListeners = function () {
        var d = c.swipeContainer;
        if (Device.mobile) {
            d.unbind("touchstart", c.__start);
            __window.unbind("touchend", c.__end);
            __window.unbind("touchcancel", c.__touchCancel)
        } else {
            d.unbind("mousedown", c.__start);
            __window.unbind("mouseup", c.__end)
        }
    }
});
(function () {
    // console.log('SIXTH CALL')
    // console.log(':: touchswipe and click events')
    $.fn.touchSwipe = function (i, c) {
        if (!window.addEventListener) {
            return this
        }
        var d = this;
        var a = 75;
        var k, j;
        var f = false;
        var e = Device.mobile;
        var l = {};
        if (e) {
            if (!c) {
                if (this._events.touchswipe) {
                    this.touchSwipe(null, true)
                }
                this.div.addEventListener("touchstart", b);
                this.div.addEventListener("touchend", h);
                this.div.addEventListener("touchcancel", h);
                this._events.touchswipe = true
            } else {
                this.div.removeEventListener("touchstart", b);
                this.div.removeEventListener("touchend", h);
                this.div.removeEventListener("touchcancel", h);
                this._events.touchswipe = false
            }
        }
        function b(m) {
            var n = Utils.touchEvent(m);
            m.preventDefault();
            if (!d.div) {
                return false
            }
            if (m.touches.length == 1) {
                k = n.x;
                j = n.y;
                f = true;
                d.div.addEventListener("touchmove", g)
            }
        }
        function g(o) {
            if (!d.div) {
                return false
            }
            if (f) {
                var p = Utils.touchEvent(o);
                var n = k - p.x;
                var m = j - p.y;
                l.direction = null;
                l.moving = null;
                l.x = null;
                l.y = null;
                if (Math.abs(n) >= a) {
                    h();
                    if (n > 0) {
                        l.direction = "left"
                    } else {
                        l.direction = "right"
                    }
                } else {
                    if (Math.abs(m) >= a) {
                        h();
                        if (m > 0) {
                            l.direction = "up"
                        } else {
                            l.direction = "down"
                        }
                    } else {
                        l.moving = true;
                        l.x = n;
                        l.y = m
                    }
                }
                if (i) {
                    i(l)
                }
            }
        }
        function h(m) {
            if (!d.div) {
                return false
            }
            k = j = f = false;
            d.div.removeEventListener("touchmove", g)
        }
        return this
    };
    $.fn.touchClick = function (f, l, c) {
        if (!window.addEventListener) {
            return this
        }
        var d = this;
        var n, m;
        var e = Device.mobile;
        var h = this;
        var b = {};
        var g = {};
        if (f === null && l === true) {
            c = true
        }
        if (!c) {
            if (this._events.touchclick) {
                this.touchClick(null, null, true)
            }
            this._events.touchclick = true;
            if (e) {
                this.div.addEventListener("touchmove", i, false);
                this.div.addEventListener("touchstart", a, false);
                this.div.addEventListener("touchend", j, false)
            } else {
                this.div.addEventListener("mousedown", a, false);
                this.div.addEventListener("mouseup", j, false)
            }
        } else {
            if (e) {
                this.div.removeEventListener("touchmove", i, false);
                this.div.removeEventListener("touchstart", a, false);
                this.div.removeEventListener("touchend", j, false)
            } else {
                this.div.removeEventListener("mousedown", a, false);
                this.div.removeEventListener("mouseup", j, false)
            }
            this._events.touchclick = false
        }
        function i(o) {
            if (!d.div) {
                return false
            }
            g = Utils.touchEvent(o);
            if (Utils.findDistance(b, g) > 20) {
                m = true
            } else {
                m = false
            }
        }
        function k(o) {
            var p = Utils.touchEvent(o);
            o.touchX = p.x;
            o.touchY = p.y;
            b.x = o.touchX;
            b.y = o.touchY
        }
        function a(o) {
            if (!d.div) {
                return false
            }
            n = Date.now();
            o.preventDefault();
            o.action = "over";
            o.object = d.div.className == "hit" ? d.parent() : d;
            k(o);
            if (f) {
                f(o)
            }
        }
        function j(q) {
            if (!d.div) {
                return false
            }
            var p = Date.now();
            var o = false;
            q.object = d.div.className == "hit" ? d.parent() : d;
            k(q);
            if (n && p - n < 750) {
                if (Mouse._preventClicks) {
                    return false
                }
                if (l && !m) {
                    o = true;
                    q.action = "click";
                    if (l && !m) {
                        l(q)
                    }
                    if (Mouse.autoPreventClicks) {
                        Mouse.preventClicks()
                    }
                }
            }
            if (f) {
                q.action = "out";
                if (!Mouse._preventFire) {
                    f(q)
                }
            }
            m = false
        }
        return this
    }
})();
Mobile.Class(function Accelerometer() {
    // console.log('SEVENTH CALL')
    // console.log(':: STATIC - accelerometer')
    // console.log('Accelerometer')
    var b = this;
    this.x = 0;
    this.y = 0;
    this.z = 0;

    function a(c) {
        switch (window.orientation) {
        case 0:
            b.x = -c.accelerationIncludingGravity.x;
            b.y = c.accelerationIncludingGravity.y;
            b.z = c.accelerationIncludingGravity.z;
            if (c.rotationRate) {
                b.alpha = c.rotationRate.alpha;
                b.beta = c.rotationRate.beta;
                b.gamma = c.rotationRate.gamma
            }
            break;
        case 180:
            b.x = c.accelerationIncludingGravity.x;
            b.y = -c.accelerationIncludingGravity.y;
            b.z = c.accelerationIncludingGravity.z;
            if (c.rotationRate) {
                b.alpha = -c.rotationRate.alpha;
                b.beta = -c.rotationRate.beta;
                b.gamma = c.rotationRate.gamma
            }
            break;
        case 90:
            b.x = c.accelerationIncludingGravity.y;
            b.y = c.accelerationIncludingGravity.x;
            b.z = c.accelerationIncludingGravity.z;
            if (c.rotationRate) {
                b.alpha = -c.rotationRate.beta;
                b.beta = c.rotationRate.alpha;
                b.gamma = c.rotationRate.gamma
            }
            break;
        case -90:
            b.x = -c.accelerationIncludingGravity.y;
            b.y = -c.accelerationIncludingGravity.x;
            b.z = c.accelerationIncludingGravity.z;
            if (c.rotationRate) {
                b.alpha = c.rotationRate.beta;
                b.beta = -c.rotationRate.alpha;
                b.gamma = c.rotationRate.gamma
            }
            break
        }
    }
    this.capture = function () {
        window.ondevicemotion = a
    };
    this.stop = function () {
        window.ondevicemotion = null;
        b.x = b.y = b.z = 0
    }
}, "Static");
Class(function Video(m) {
    // console.log('EIGHTH CALL')
    // console.log(':: STATIC - video classes')

    Inherit(this, Component);
    var i = this;
    var g, n, b, k, l, d;
    var c = 0;
    var e = {};
    this.loop = false;
    this.playing = false;
    this.width = m.width || 0;
    this.height = m.height || 0;
    (function () {
        j();
        a()
    })();

    function j() {
        var o = m.src;
        if (!o.strpos("webm") && !o.strpos("mp4") && !o.strpos("ogv")) {
            o += "." + Device.media.video
        }
        i.div = document.createElement("video");
        i.div.src = o;
        i.div.controls = m.controls;
        i.div.id = m.id || "";
        i.div.width = m.width;
        i.div.height = m.height;
        d = i.div.loop = m.loop;
        i.div.preload = true;
        i.object = $(i.div);
        i.width = m.width;
        i.height = m.height;
        i.object.size(i.width, i.height)
    }
    function a() {
        if (!Device.mobile && !Device.browser.ie) {
            i.div.play();
            setTimeout(function () {
                i.div.pause()
            }, 1)
        }
    }
    function f() {
        if (!i.div || !i.events) {
            return Render.stopRender(f)
        }
        i.duration = i.div.duration;
        i.time = i.div.currentTime;
        if (i.div.currentTime == b) {
            c++;
            if (c > 60 && !k) {
                k = true;
                i.events.fire(FlipEvents.ERROR, null, true)
            }
        } else {
            c = 0;
            if (k) {
                i.events.fire(FlipEvents.READY, null, true);
                k = false
            }
        }
        b = i.div.currentTime;
        if (i.div.currentTime >= i.div.duration - 0.001) {
            if (!d) {
                Render.stopRender(f);
                i.events.fire(FlipEvents.COMPLETE, null, true)
            }
        }
        e.time = i.div.currentTime;
        e.duration = i.div.duration;
        i.events.fire(FlipEvents.UPDATE, e, true)
    }
    function h() {
        if (!Device.mobile) {
            if (!l) {
                i.buffered = i.div.readyState == i.div.HAVE_ENOUGH_DATA
            } else {
                var o = -1;
                var q = i.div.seekable;
                if (q) {
                    for (var p = 0; p < q.length; p++) {
                        if (q.start(p) < l) {
                            o = q.end(p) - 0.5
                        }
                    }
                    if (o >= l) {
                        i.buffered = true
                    }
                } else {
                    i.buffered = true
                }
            }
        } else {
            i.buffered = true
        }
        if (i.buffered) {
            Render.stopRender(h);
            i.events.fire(FlipEvents.READY, null, true)
        }
    }
    this.set("loop", function (o) {
        if (!i.div) {
            return
        }
        d = o;
        i.div.loop = o
    });
    this.get("loop", function () {
        return d
    });
    this.play = function () {
        if (!i.div) {
            return false
        }
        if (!Device.mobile) {
            if (i.ready()) {
                i.playing = true;
                i.div.play();
                Render.startRender(f)
            } else {
                setTimeout(i.play, 10)
            }
        } else {
            i.playing = true;
            i.div.play();
            Render.startRender(f)
        }
    };
    this.pause = function () {
        if (!i.div) {
            return false
        }
        i.playing = false;
        i.div.pause();
        Render.stopRender(f)
    };
    this.stop = function () {
        i.playing = false;
        Render.stopRender(f);
        if (!i.div) {
            return false
        }
        i.div.pause();
        i.div.currentTime = 0
    };
    this.volume = function (o) {
        if (!i.div) {
            return false
        }
        i.div.volume = o
    };
    this.seek = function (o) {
        if (!i.div) {
            return false
        }
        if (i.div.readyState <= 1) {
            return setTimeout(function () {
                i.seek(o)
            }, 10)
        }
        i.div.currentTime = o
    };
    this.canPlayTo = function (o) {
        l = null;
        if (o) {
            l = o
        }
        if (!i.div) {
            return false
        }
        if (!i.buffered) {
            Render.startRender(h)
        }
        return this.buffered
    };
    this.ready = function () {
        if (!i.div) {
            return false
        }
        return i.div.readyState == i.div.HAVE_ENOUGH_DATA
    };
    this.size = function (o, p) {
        if (!i.div) {
            return false
        }
        this.div.width = this.width = o;
        this.div.height = this.height = p;
        this.object.size(o, p)
    };
    this.destroy = function () {
        this.stop();
        this.object.remove();
        return this._destroy()
    }
});
function Viewport3D(_width, _height) {
    Inherit(this, View, "viewport");
    var _this = this;
    var _containers = new Array();
    (function() {
        createElements()
    })();
    function createElements() {
        _this.element.css({
            width: _width,
            height: _height,
            position: "absolute"
        });
        _this.element.div.style[Device.styles.vendor + "TransformStyle"] = "preserve-3d";
        _this.element.div.style[Device.styles.vendor + "Perspective"] = "2000px"
    }
    this.perspective = function(num) {
        _this.element.div.style[Device.styles.vendor + "Perspective"] = num + "px"
    };
    this.perspectiveOrigin = function(x, y) {
        _this.element.div.style[Device.styles.vendor + "PerspectiveOrigin"] = x + "px " + y + "px"
    };
    this.addChild = function($obj) {
        if ($obj.element) {
            $obj = $obj.element
        }
        $obj.div.style[Device.styles.vendor + "TransformStyle"] = "preserve-3d";
        _this.element.addChild($obj);
        _containers.push($obj)
    };
    this.removeChild = function($obj) {
        var len = _containers.length-1;
        for (var i = len; i>-1; i--) {
            if (_containers[i].child3d == $obj) {
                _containers[i].remove();
                _containers.splice(i, 1)
            }
        }
    };
    this.destroy = function() {
        var len = _containers.length-1;
        for (var i = len; i>-1; i--) {
            if (_containers[i].destroy) {
                _containers[i].destroy()
            } else {
                if (_containers[i].remove) {
                    _containers[i].remove()
                }
            }
        }
        _containers = null;
        return this._destroy()
    };
    this.transformPoint = function(x, y, z) {
        this.element.transformPoint(x, y, z);
        return this
    };
    this.transform = function(obj) {
        this.element.transform(obj);
        return this
    };
    this.tween = function(props, time, ease, delay, callback, manual) {
        return this.element.tween(props, time, ease, delay, callback, manual)
    }
}
Class(function GATracker() {
    this.trackPage = function (a) {
        if (typeof ga !== "undefined") {
            ga("send", "pageview", a)
        }
    };
    this.trackEvent = function (b, d, a, c) {
        if (typeof ga !== "undefined") {
            ga("send", "event", b, d, a, (c || 0))
        }
    }
}, "Static");
Class(function Config() {
    // console.log('EIGHTH CALL')
    // console.log(':: STATIC - app configuration')

    var a = this, gradient;

    this.S3 = (function () {
        if (window.location.href.strpos(".net") || window.location.href.strpos(":8080")) {
            return "http://activetheory-v2.s3.amazonaws.com/";
        }
        return "";
    })();
    this.PROXY = (function () {
        if (window.location.href.strpos(":8080")) {
            return "http://localhost:8080/cdn/";
        }
        if (window.location.href.strpos("activetheorylab.net")) {
            return "http://activetheory.activetheorylab.net/cdn/";
        }
        if (window.location.href.strpos("activetheory.net")) {
            return "http://activetheory.net/cdn/";
        }
        // if (window.location.href.strpos("dev")) {
        //     return "http://2c.dev/";
        // }
        return ""
    })();
    this.PATH = this.PROXY;
    this.IMAGES = (function () {
        if (window.location.href.strpos(".net")) {
            return a.S3 + "assets/images/";
        }
        return "/assets/images/"
        // return "assets/images/"
    })();

      this.NAV = [
      {
          type: "home",
          width: 42,
          // subnav: ["Sizzle", "Design", "Live Action", "Brand Integration", "Best of 2C Promos"]
          subnav: []
          // subnav: Data.CATEGORIES.getCategoryNameByType(2)
      }, {
          type: "about",
          width: 50,

          // subnav: ["Promos", "Design", "Live Action", "Brand Integration", "Presentations", "Archive"]
          subnav: []
      }, {
          type: "our work",
          width: 78,

          // subnav: ["Culture", "Team", "Contact", "Our Clients"]
          subnav: []
      }, {
          type: "blog",
          width: 38,

          // subnav: ["Visit 2C Content"]
          subnav: []
      }, /*{
    	type: "directors",
          // subnav: ["Brian", "Bart", "Mark", "Kevin"]
    	subnav: []
      },*/ {
    	type: "contact",
        width: 66,

    	subnav: []
      }];
    
    // var _allTypes = Data.CATEGORIES.getAllCategoryTypes();
    // var _allNames = Data.CATEGORIES.getAllCategoryNames();

    // for (var i = 0; i < _allTypes.length; i++) {
    //     console.log('Category: length is '+Data.CATEGORIES.getCategoryByType( _allTypes[i] ).length);
    //     console.log(_allNames[i].toUpperCase());

    //     var _cat = Data.CATEGORIES.getCategoryByType( _allTypes[i] );

    //     for (var j = 0; j < _cat.length; j++) {
    //         console.log(_cat[j].name);
    //     }
        
    // }

    // settings for nav animations
    this.NAVCONFIG = {
		duration: 300,
		easing: "easeInOutQuad",
		delay: 0
    };

    // slice gradients
    //background: -moz-linear-gradient(top,  rgba(76,59,132,0.3) 0%, rgba(76,59,132,0.85) 33%, rgba(76,59,132,0.85) 100%); /* FF3.6+ */
    //background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(76,59,132,0.3)), color-stop(33%,rgba(76,59,132,0.85)), color-stop(100%,rgba(76,59,132,0.85))); /* Chrome,Safari4+ */
    //background: -webkit-linear-gradient(top,  rgba(76,59,132,0.3) 0%,rgba(76,59,132,0.85) 33%,rgba(76,59,132,0.85) 100%); /* Chrome10+,Safari5.1+ */
    //background: -o-linear-gradient(top,  rgba(76,59,132,0.3) 0%,rgba(76,59,132,0.85) 33%,rgba(76,59,132,0.85) 100%); /* Opera 11.10+ */
    //background: -ms-linear-gradient(top,  rgba(76,59,132,0.3) 0%,rgba(76,59,132,0.85) 33%,rgba(76,59,132,0.85) 100%); /* IE10+ */
    //background: linear-gradient(to bottom,  rgba(76,59,132,0.3) 0%,rgba(76,59,132,0.85) 33%,rgba(76,59,132,0.85) 100%); /* W3C */
    //filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#4d4c3b84', endColorstr='#d94c3b84',GradientType=0 ); /* IE6-9 */

    if (Device.vendor !== ""){
        gradient = "-"+Device.vendor+"-linear-gradient(top,  rgba(76,59,132,0.3) 0%,rgba(76,59,132,0.85) 33%,rgba(76,59,132,0.85) 100%)"; // most browsers
    }else{
        gradient = "linear-gradient(to bottom,  rgba(76,59,132,0.3) 0%,rgba(76,59,132,0.85) 33%,rgba(76,59,132,0.85) 100%)"; // W3C
    }

    this.COLORS = {
        white: "#ffffff",
        grey: "#e0e0e0",
        black: "#000000",
        branding: "#199BFF",
        redshade: "#d44317",
        red: "#c3270e",
        darkgrey: "#4b4b51",
        blue: '#199BFF',
        teal: '#1b8c68',
        purple: "#4c3b84",
        bluegrey: "#222c38",
        slicegradient: gradient,
        sliceinnerglow: "inset 0 0 90px rgba(0,78,196,0.2)"
    };
    this.SKEW = 0;

    // this.ASPECT = 576 / 1000
    this.ASPECT = 600 / 1100
}, "Static");

window.Config = window.Config || {};
// window.Config.ASSETS = ["assets/images/about/bg.jpg", "assets/images/about/logo.png", "assets/images/common/272737.png", "assets/images/common/f4f4f4.png", "assets/images/common/loader.png", "assets/images/common/rotate.png", "assets/images/favicon.png", "assets/images/home/logo-invert.png", "assets/images/home/logo-wide.png", "assets/images/home/particle-gl.png", "assets/images/home/particle0-gl.jpg", "assets/images/home/particle1-gl.jpg", "assets/images/home/particle2-gl.jpg", "assets/images/home/spark-gl.jpg", "assets/images/loader/letter.png", "assets/images/share/apple-touch-icon.png", "assets/images/share/share.jpg", "assets/images/sidebar/fb.png", "assets/images/sidebar/logo.png", "assets/images/sidebar/nav/about-off.png", "assets/images/sidebar/nav/about-on.png", "assets/images/sidebar/nav/contact-off.png", "assets/images/sidebar/nav/contact-on.png", "assets/images/sidebar/nav/lab-off.png", "assets/images/sidebar/nav/lab-on.png", "assets/images/sidebar/nav/work-off.png", "assets/images/sidebar/nav/work-on.png", "assets/images/sidebar/tw.png", "assets/images/work/black.jpg", "assets/images/work/gradient.png", "assets/images/work/halftone.png", "assets/images/work/overlay.png", "assets/images/work/white.png", "assets/shaders/Additive.fs", "assets/shaders/BaseVertex.vs", "assets/shaders/Godray.fs", "assets/shaders/Scan.fs"];
// window.Config.ASSETS = ["assets/images/common/gradient2.png", "assets/images/common/drawer-icon.png", "assets/images/common/drawer-icon-active.png", "assets/images/common/272737.png", "assets/images/common/f4f4f4.png", "assets/images/common/loader.png", "assets/images/common/rotate.png", "assets/images/home/logo-invert.png", "assets/images/home/logo-wide.png", "assets/images/home/particle-gl.png", "assets/images/home/particle0-gl.jpg", "assets/images/home/particle1-gl.jpg", "assets/images/home/particle2-gl.jpg", "assets/images/home/spark-gl.jpg", "assets/images/loader/letter.png", "assets/images/work/black.jpg", "assets/images/work/gradient.png", "assets/images/work/halftone.png", "assets/images/work/overlay.png", "assets/images/work/white.png", "assets/shaders/Additive.fs", "assets/shaders/BaseVertex.vs", "assets/shaders/Godray.fs", "assets/shaders/Scan.fs"];
window.Config.ASSETS = ["/assets/images/common/logo.png", "/assets/images/common/loader.png", "/assets/images/common/gradient2.png", "/assets/images/common/drawer-icon.png", "/assets/images/common/drawer-icon-active.png", "/assets/images/common/video-close.png", "/assets/images/common/play-arrow-white.png", "/assets/images/common/play-arrow-purple.png", "/assets/images/common/rotate.png", "/assets/images/home/logo-invert.png", "/assets/images/loader/letter.png", "/assets/images/work/black.jpg", "/assets/images/work/gradient.png", "/assets/images/work/halftone.png", "/assets/images/work/overlay.png", "/assets/images/work/white.png"];
// window.Config.ASSETS = ["common/272737.png", "common/f4f4f4.png", "common/loader.png", "common/rotate.png", "home/logo-invert.png", "home/logo-wide.png", "home/particle-gl.png", "home/particle0-gl.jpg", "home/particle1-gl.jpg", "home/particle2-gl.jpg", "home/spark-gl.jpg", "loader/letter.png", "work/black.jpg", "work/gradient.png", "work/halftone.png", "work/overlay.png", "work/white.png", "assets/shaders/Additive.fs", "assets/shaders/BaseVertex.vs", "assets/shaders/Godray.fs", "assets/shaders/Scan.fs"];
Class(function FEEvents() {
    var _self = this;
    this.SELECT = "select";
    this.CLOSE = "close";
    this.RESIZE = "resize";
    this.PLAY_VIDEO = "play_video";
    this.TOGGLE_CONTACT = "toggle_contact";
    this.CONTACT_OPEN = "contact_open";
    this.CONTACT_CLOSE = "contact_close";
    this.TOGGLE_SIDEBAR = "toggle_sidebar";
    this.NAV_SELECT = "nav_select";
    this.CLOSE_DETAIL = "close_detail";
    this.FULLSCREEN = "fullscreen";
    this.STATE_CHANGE = "state_change";
    this.PAGE_CHANGE = "page_change";
    this.MOBILE_GALLERY_UPDATE = "mobile_gallery_update";
    this.SUBNAV_TOGGLE = "flip_subnav_toggle";
    this.SUBNAV_EXPAND = "flip_subnav_expand";
    this.SUBNAV_COLLAPSE = "flip_subnav_collapse";
    this.VIDEO_LOAD = "flip_video_load"; // fired when loading a full screen video
    this.VIDEO_UNLOAD = "flip_video_unload"; // fired when closing a full screen video
}, "Static");

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

Class(function FEDevice() {
    // console.log(':: FEDevice – STATIC');

    var _self           = this;
    this.WIDTH          = window.innerWidth;
    this.HEIGHT         = window.innerHeight;
    this.PERFORMANCE    = 2;
    this.IE9 = Device.browser.ie && Device.browser.version == 9;

    this.VELOCITY_MULTIPLIER = (function () {
        if (Mobile.phone) {
            return 175;
        }
        if (Mobile.tablet) {
            return 100;
        }
        return 20
    })();

    this.PARALLAX_MULTIPLIER = (function () {
        if (Mobile.phone) {
            return 0.15;
        }
        if (Mobile.tablet) {
            return 0.15;
        }
        return 0.2;
    })();

    this.VIDEO_THUMBS = (function () {
        if (_self.PERFORMANCE < 2) {
            return false;
        }
        if (Device.mobile) {
            return false;
        }
        if (Device.browser.ie) {
            return false;
        }
        if (Device.browser.firefox) {
            return false;
        }
        return true
    })();

    this.VIDEO_BG = (function () {
        return false;
        if (Mobile.phone) {
            return false;
        }
        console.log('=======================================')
        console.log('DISABLE VIDEO BG UTNIL WE FIGURE IT OUT')
        console.log('=======================================')
        // return true
        return false;
    })();

    this.getAsset = function (c, b) {
        // return "http://" + c.bucket + ".s3.amazonaws.com/" + c.media + "/" + c.media + "." + b
        // console.log('GET ASSET: '+ c);
        // console.log('Builds the path to AWS, then returns that asset path');
        // console.log('Currently, just passing the path through.');
        // console.log(c);
        // console.log(c.main_image[0].urlPath);

        // return c.main_image[0].urlPath;
        return c;
    };

    this.getDetailAsset = function (c, b) {
        // return "http://" + c.bucket + ".s3.amazonaws.com/" + c.media + "/images/" + b + ".jpg";
        return c;
    };

    this.bundleAssets = function (e, d) {
        d = d || [];
        if (typeof e === "string") {
            e = [e];
        }
        for (var c = 0; c < e.length; c++) {
            for (var b = 0; b < Config.ASSETS.length; b++) {
                if (Config.ASSETS[b].strpos(e[c])) {
                    d.push(_self.parseAsset(Config.ASSETS[b]));
                }
            }
        }
        return d;
    };

    this.parseAsset = function (b) {
        if (b.strpos(".js")) {
            return Config.PROXY + b;
        }
        if (b.strpos("-gl")) {
            return Config.PROXY + b;
        }
        if (b.strpos(".vs")) {
            return Config.PROXY + b;
        }
        if (b.strpos(".fs")) {
            return Config.PROXY + b;
        }
        return Config.S3 + b;
    };

    this.performanceSet = function () {
        this.PARALLAX_ITEMS = (function () {
            if (Device.browser.firefox) {
                return false
            }
            if (!Device.mobile && Device.browser.safari) {
                return false
            }
            return _self.PERFORMANCE >= 1;
        })()
    }
}, "Static");
Class(function MathUtil() {
    // console.log(':: STATIC - math utility')
    Inherit(this, Component);
    var f = this;
    var minSliceHeight = 80; // minimum slice height
    var minSliceWidth = 200; // minimum slice width
    var d = 8; // some kind of multiplier that alters the slice height
    var mult = 16; // some kind of multiplier that alters the slice width
    (function () {
        a()
    })();

    function a() {
        TweenManager.addCustomEase({
            name: "workLayer",
            curve: "cubic-bezier(.41,.61,.35,1)"
        });
        TweenManager.addCustomEase({
            name: "workOpen",
            curve: "cubic-bezier(.23,1,.38,.98)"
        });
        TweenManager.addCustomEase({
            name: "workOpenIn",
            curve: "cubic-bezier(.55,.61,.38,.98)"
        });
        TweenManager.addCustomEase({
            name: "slice",
            curve: "cubic-bezier(.34,.37,.32,.99)"
        });
        TweenManager.addCustomEase({
            name: "workSlice",
            curve: "cubic-bezier(.19,1,.11,.99)"
        });
        TweenManager.addCustomEase({
            name: "transitionOut",
            curve: "cubic-bezier(.69,.03,.58,.99)"
        });
    }
    
    // decide whether to return calculated slice height or minimum slice height
    function c() {
    	// function b() receives:
    	// a vector representing device width
    	// a vector equaling 0 (height?)
    	// returns vector containing slice width and height
        var h = b(new Vector2(FEDevice.width, 0), new Vector2(0, 0));
        var calcSliceHeight = Math.ceil(Math.abs(h.y * 1.8)); // multiply height for some odd reason otherwise it becomes too small
        return {
            total: calcSliceHeight > minSliceHeight ? calcSliceHeight : minSliceHeight,
            triangle: calcSliceHeight
        };
    }
    
    // decide whether to return calculated slice width or minimum slice width
    function selectSliceWidth(){
		// console.log('selectSliceWidth');
		var sliceDimensions = getVertSliceDimensions(new Vector2(0, 0), new Vector2(0, FEDevice.height));
		var calcSliceWidth = Math.ceil(Math.abs(sliceDimensions.x * 1.8));
		
		//console.log(sliceDimensions);
		
		return {
			total: calcSliceWidth > minSliceWidth ? calcSliceWidth : minSliceWidth,
			triangle: calcSliceWidth
		};
    }
    
    // b() returns vector containing slice width and height
    // h = Vector2
    // g = Vector2
    function b(h, g) {
        var i = new Vector2(-(g.y - h.y), g.x - h.x).multiply(Math.sin(Utils.toRadians(d))); // get height of slice
        var j = new Vector2().copyFrom(h).add(i); // get width of slice from device width
        return j; // return vector containing slice width and height
    }
    
    // get dimensions of a vertically oriented slice (scrolls horizontally)
    // width and height are Vector2
    function getVertSliceDimensions(v_width, v_height){
    	// v_width passed in as 0,0
    	// v_height passed in as 0,device height
		//var sliceWidth = new Vector2(-(v_height.x - v_width.x), v_height.y - v_width.y).multiply(Math.sin(Utils.toRadians(d)));
		var sliceWidth = new Vector2(-(v_width.y - v_height.y), v_width.x - v_height.x).multiply(Math.sin(Utils.toRadians(mult)));
		// console.log(sliceWidth);
		var sliceVectors = new Vector2().copyFrom(v_height).add(sliceWidth);
		return sliceVectors;
    }
    
    this.getSliceHeight = function () {
        var g = c().total;
        //console.log('getSliceHeight');
        //console.log(g);
        if (Stage.height > FEDevice.width) {
            g *= 2;
        }
        return g;
    };
    
    // get the width value of a slice
    this.getSliceWidth = function (){
		var width = selectSliceWidth().total;
		
		//console.log('getSliceWidth');
        //console.log(width);
		
		if (Stage.width > FEDevice.height){
			width *= 2;
		}
		
		return width;
    };
    
    this.computeCentroid = function (i) {
        var g = (i[0].x + i[1].x + i[2].x) / 3;
        var h = (i[0].y + i[1].y + i[2].y) / 3;
        return {
            x: g,
            y: h
        };
    };
}, "Static");
Class(function VideoUtil() {
    Inherit(this, Component);
    var e = this;
    var c;
    var d = {};
    (function () {})();

    function b(h) {
        // for (var f = 0; f < h.length; f++) {
        //     var g = h[f];
        //     d[g.media] = new Video({
        //         src: "http://" + g.bucket + ".s3.amazonaws.com/" + g.media + "/" + g.media,
        //         width: 100,
        //         height: 100,
        //         loop: true
        //     });
        //     d[g.media].volume(0)
        // }
    }
    function a() {
        c = new Video({
            src: Config.S3 + "assets/videos/reel",
            width: 100,
            height: 100,
            loop: true
        })
    }
    this.init = function () {
        if (Device.mobile) {
            return
        }
        // b(Data.WORK.getData())
        b(Data.PAGES.getData())
    };
    this.getVideo = function (f) {
        return d[f]
    };
    this.getSrc = function (f) {
        return "http://" + f.bucket + ".s3.amazonaws.com/" + f.media + "/" + f.media
    };
    this.getReel = function () {
        return c
    }
}, "Static");
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

Class(function Data() {

    Inherit(this, Model);

    var _self = this;
    var _data;
    var _work;

    // DATA IS SAVED IN A JS FILE AS A VARIABLE (window.__DATA__)
    // OF JSON DATA WITH SETS OF 'pages' AND 'portfolio' TO MATCH
    // WHAT IS IN CMS BUILDER

    Flip.ready(function () {
        _initData();
        // _parseWork();
        _setData();

        // I DON'T KNOW HOW TO USE THE VIDEO UTIL
        //VideoUtil.init()
    });

    function _initData() {
        _data = window.__DATA__;
        delete window.__DATA__;
    }
    function _setData() {

        _self.STATE = new StateModel();

        console.log('DATA :: _setData : _data:');
        console.log(_data);
        // console.log('_data.portfolio');
        // console.log(_data.portfolio);
        // LOADS CREATIVE BY DEFAULT, OTHERWISE PASS SECOND PARAMETER TO SWITCH SITE/DATA
        // _self.SITE          = new SiteModel(_data);
        // _self.CATEGORIES    = new CategoryModel(_data.categories);

        // _self.PAGES         = new PagesModel();

        // console.log(_data.cc_creative);

        // THIS WILL HAVE TO CHANGE, BUT FOR NOW...JUST PUSH THE WORK
        _self.HOME          = new HomeModel(_data.home);
        _self.ABOUT         = new AboutModel(_data.about);
        _self.BELIEVE         = new BelieveModel(_data.believe);
        _self.TEAM         = new TeamModel(_data.team);
        // _self.REELS         = new ReelModel(_data.cc_creative.reels);
        _self.WORK          = new WorkModel(_data.portfolio);
        // console.log(_data.portfolio)
        // _self.CONTENT       = new ContentModel(_data.cc_content.original_content);

    }
}, "Static");
Class(function StateModel() {
    // console.log(':: STATE MODEL')
    Inherit(this, Model);
    Inherit(this, PushState);

    var _self = this;
    // var _currState;

    (function () {
        _init();
        _updateEvent();
    })();

    function _init() {
        //console.log("StateModel _init");
        //console.log(_self.getState());
        var split_state = _self.getState().split("/");

        _self.page      = split_state[0];
        _self.deep      = split_state[1]; // deprecated
        _self.category  = split_state[1];
        _self.detail    = split_state[2];

        /*if (FEDevice.IE9) {
            if (_self.page == "home") {
                _self.page = "work";
                _self.category = null;
            }
        }*/
        
        // console.log('==========================');
        // console.log('STATE MODEL');
        // console.log(_self.page);
        // console.log(_self.category);
        // console.log(_self.detail);
        // console.log('==========================');

        if (_self.deep && !_self.deep.length) {
            // console.log('STATE MODEL :: _init');
            // console.log('_self.deep = null');
            _self.deep = null;
        }

        if (_self.category && !_self.category.length) {
            _self.category = null;
        }

        if (_self.detail && !_self.detail.length) {
            _self.detail = null;
        }

        // if (d.page != "about" && d.page != "home" && d.page != "work" && d.page != "contact") {
        //     d.page = "home";
        // }

        if (_self.page != "home" && _self.page != "work" && _self.page != "about" && _self.page != "contact" && _self.page != "blog") {
            _self.page = "home";
        }
        // console.log('StateModel :: _self.page: ' + _self.page);
    }

    function _updateEvent() {
        // console.log('StateModel :: _updateEvent()');
        _self.dispatcher.events.add(FlipEvents.UPDATE, _onUpdateEvent);
    }
    function _onUpdateEvent(f) {
        console.log('StateModel :: _onUpdateEvent()');
        _init();
        _self.events.fire(FEEvents.STATE_CHANGE);
    }
    
    this.setState = function (e) {
        console.log('StateModel :: setState');
        console.log(e);
        console.log(this);
        // console.log(this._setState(e));
        console.log('========================');
        // _currState = e;
        GATracker.trackPage(e);
        this._setState(e);
        _init();
        _self.events.fire(FEEvents.PAGE_CHANGE);
    }
    // this.getState = function () {
    //     return _currState;
    // }
});
Class(function HomeModel(data) {
    Inherit(this, Model);
    var _self = this;
    var _data = data;
    // var b = pagesdata.slice(0);
    // var _referrer = referrer;
    // var p = Data.prototype = {};
    // var a;
    (function () {
        init()
    })();

    function init() {
        // console.log('DATA – PagesModel – LENGTH: ' + pagesdata.pages.length);
        // console.log(pagesdata);
        // console.log(referrer)

        // console.log('==================');
        // console.log('HOME DATA');
        // console.log(_data);
        // console.log('==================');

        // for (var f = 0; f < pagesdata.pages.length; f++) {
        //     // var e = data[f];
        //     // console.log(data[f].name);
        //     // console.log(data[f].name.toUpperCase());
            
        //     // p.data[f].name.toUpperCase() = data[f].name
        //     // a = data[f].name;;
            
        //     // p[pagesdata[f].name.toUpperCase()] = new PageModel(pagesdata[f]);
        //     // new PageModel(pagesdata[f]);

        // }  
    }
    function _getSortedData() {
        var _hmsl = [];
        var _orderedData = [];

        for (var i = 0; i < _data.length; i++) {
            if (_data[i].status) {
                // ACTIVE
                // console.log('ACTIVE');
                // console.log(_data[i].status);

                // if (_data[i]['feature_type'])
                // console.log('_data[i]');
                // console.log(_data[i]);
                // console.log(_data[i]['feature_type']);
                switch(_data[i]['feature_type']) {
                    case '1':
                        // console.log('case 0: '+_data[i]['feature_type:label']);
                        _hmsl.push({'dragSortOrder': _data[i].dragSortOrder, 'data': Data.REELS.getWorkByName(_data[i]['reels:label']) });
                    break;
                    case '2':
                        // console.log('case 2: '+_data[i]['feature_type:label']);
                        _hmsl.push({'dragSortOrder': _data[i].dragSortOrder, 'data': Data.WORK.getWorkByName(_data[i]['promos:label']) });
                    break;
                    case '3':
                        // console.log('case 1: '+_data[i]['feature_type:label']);
                        _hmsl.push({'dragSortOrder': _data[i].dragSortOrder, 'data': Data.CASESTUDIES.getWorkByName(_data[i]['case_studies:label']) });
                    break;

                }
                // console.log(Data.WORK.getWorkByName(_data[i]['feature_type:label']))
                // _hmsl.push(Data.WORK.getWorkByName(_data[i]['feature_type:label']));
                
            }
        }
        _hmsl.sort(function(a, b){ return parseFloat(b.dragSortOrder) - parseFloat(a.dragSortOrder) });

        

        for (var j = 0; j < _hmsl.length; j++) {
            // console.log(_data[i].data)
            _orderedData.push(_hmsl[j].data);
        }

        return _orderedData;
    }
    // this.getPageDataByName = function(name) {
    //     // console.log(pagesdata.portfolio)
    //     for (var i = 0; i < pagesdata.pages.length; i++) {
    //       if (pagesdata.pages[i].name == name) {
    //         // console.log(this._data.portfolio[i]);
    //         console.log(pagesdata.pages[i].name.toLowerCase());
    //         //
    //         if (pagesdata.pages[i].name.toLowerCase() == 'our work') {
    //             pagesdata.pages[i].portfolio = pagesdata.portfolio;
    //             // pagesdata.pages[i].push({portfolio: pagesdata.portfolio});
    //         }
    //         return pagesdata.pages[i];
    //       }
    //     }
    // }
    this.getData = function() {
        return _data;
    };
    this.getSortedData = function() {

        // return _getSortedData();
        return _data;

    }
    this.getDeep = function (e) {
        console.log('HOME MODEL :: getDeep: e: '+e);
        // console.log(_getSortedData()[0].permalink);
        
        for (var f = 0; f < _getSortedData().length; f++) {
            var _deep = !_getSortedData()[f].permalink ? Utils.urlstr(_getSortedData()[f].main_categories) : _getSortedData()[f].permalink;
            console.log(_deep);
            if (_deep == e) {
                console.log('_deep: '+_deep);
                return _deep;
            }
        }
        // return e;
    }
    this.getImageByPageDetail = function (_pageState) {
        for (var f = 0; f < _getSortedData().length; f++) {

            var _pgst = !_getSortedData()[f].permalink ? Utils.urlstr(_getSortedData()[f]._filename.toLowerCase()) : _getSortedData()[f].permalink;

            
            if (_pgst == _pageState) {
                console.log(_pgst);
                console.log(_pageState);
                console.log(_getSortedData()[f].main_image[0].urlPath);
                // console.log('_pgst: '+_pgst);
                return _getSortedData()[f].main_image[0].urlPath;
            }
        }
    }
    this.getNumByPageDetail = function (_pageState) {
        for (var f = 0; f < _getSortedData().length; f++) {

            var _pgst = !_getSortedData()[f].permalink ? Utils.urlstr(_getSortedData()[f]._filename.toLowerCase()) : _getSortedData()[f].permalink;

            
            if (_pgst == _pageState) {
                // console.log(_pgst);
                // console.log(_pageState);
                // console.log(_getSortedData()[f].main_image[0].urlPath);
                // console.log('_pgst: '+_pgst);
                return _getSortedData()[f].num;
            }
        }
    }
    this.getWorkByNum = function(_num) {
        var _data = _getSortedData();
        for (var f = 0; f < _data.length; f++) {

            if (_data[f].num == _num) {

                return _data[f];
            }
        }

    }
    this.getDetail = function (e) {
        console.log('HOME MODEL :: getDeep: e: '+e);
        // for (var f = 0; f < data.length; f++) {
        //     if (data[f].permalink == e) {
        //         // console.log(c[f]);
        //         return data[f].permalink;
        //     }
        // }
        // console.log('++++++++++++++++++++++++++++');
        // console.log('WORK MODEL');
        // console.log('e');
        // console.log(e);
        // // console.log(_data);
        // console.log('++++++++++++++++++++++++++++');
        // var _prma = !Data.WORK.getWorkByNum(_detailIndex).permalink ? Data.WORK.getWorkByNum(_detailIndex)._filename.toLowerCase() : Data.WORK.getWorkByNum(_detailIndex).permalink;
        // var _ctgy = !Data.STATE.category ? Utils.urlstr(Data.WORK.getWorkByNum(_detailIndex).main_categories) : Data.STATE.category;

        for (var f = 0; f < _getSortedData().length; f++) {
            // var _deep = !_getSortedData()[f].permalink ? Utils.urlstr(_getSortedData()[f].main_categories) : _getSortedData()[f].permalink;
            var _deep = Utils.urlstr(_getSortedData()[f]._filename);
            console.log(_deep);
            if (_deep == e) {
                console.log('_deep: '+_deep);
                return _deep;
            }
        }
    };
});
Class(function AboutModel(data) {
    Inherit(this, Model);
    var _self = this;
    var _data = data;

    var _headline = data[0].headline;
    var _subhead = data[0].subhead;
    var _content = data[0].content;
    // var b = pagesdata.slice(0);
    // var _referrer = referrer;
    // var p = Data.prototype = {};
    // var a;
    this.headline = _headline;
    this.subhead = _subhead;
    this.content = _content;

    (function () {
        init()
    })();

    function init() {
        console.log(_data);
    }
    
    this.getData = function() {
        return _data;
    };

    this.getTeam = function() {
        var _team = [];
        var tm_itm;
        for (var i = 0; i < _data.length; i++) {

            //console.log(_data[i].team.length);
            
            tm_itm = _data[i].team;

            // console.log(tm_itm);
            for (var j = 0; j < tm_itm.length; j++) {
                _team.push(tm_itm[j]);
            }
        }
        return _team;
    }

    this.getClients = function() {
        var _clnt = [];
        var ct_itm;

        for (var i = 0; i < _data.length; i++) {
            // console.log(_data[i].clients.length);
            
            ct_itm = _data[i].clients;

            // console.log(tm_itm);
            for (var j = 0; j < ct_itm.length; j++) {
                _clnt.push(ct_itm[j]);
            }
        }
        return _clnt;
    }

});
Class(function BelieveModel(data) {
    Inherit(this, Model);
    var _self = this;
    var _data = data;

    // var _headline = data[0].headline;
    // var _subhead = data[0].subhead;
    // var _content = data[0].content;
    // var b = pagesdata.slice(0);
    // var _referrer = referrer;
    // var p = Data.prototype = {};
    // var a;
    // this.headline = _headline;
    // this.subhead = _subhead;
    // this.content = _content;

    (function () {
        init()
    })();

    function init() {
        // console.log(_data);
    }
    
    this.getData = function() {
        return _data;
    };

    this.getTeam = function() {
        var _team = [];
        var tm_itm;
        
        for (var i = 0; i < _data.length; i++) {

            //console.log(_data[i].team.length);
            
            tm_itm = _data[i].team;

            // console.log(tm_itm);
            for (var j = 0; j < tm_itm.length; j++) {
                _team.push(tm_itm[j]);
            }
        }
        return _team;
    }

    this.getClients = function() {
        var _clnt = [];
        var ct_itm;

        for (var i = 0; i < _data.length; i++) {
            // console.log(_data[i].clients.length);
            
            ct_itm = _data[i].clients;

            // console.log(tm_itm);
            for (var j = 0; j < ct_itm.length; j++) {
                _clnt.push(ct_itm[j]);
            }
        }
        return _clnt;
    }

});
Class(function TeamModel(data) {
    Inherit(this, Model);
    var _self = this;
    var _data = data;

    // var _headline = data[0].headline;
    // var _subhead = data[0].subhead;
    // var _content = data[0].content;
    // var b = pagesdata.slice(0);
    // var _referrer = referrer;
    // var p = Data.prototype = {};
    // var a;
    // this.headline = _headline;
    // this.subhead = _subhead;
    // this.content = _content;


    (function () {
        init()
    })();

    function init() {
        // console.log(_data);
    }
    
    this.getData = function() {
        return _data;
    };

    this.getTeam = function() {
        var _team = [];
        var tm_itm;
        
        for (var i = 0; i < _data.length; i++) {

            //console.log(_data[i].team.length);
            
            tm_itm = _data[i].team;

            // console.log(tm_itm);
            for (var j = 0; j < tm_itm.length; j++) {
                _team.push(tm_itm[j]);
            }
        }
        return _team;
    }

    this.getClients = function() {
        var _clnt = [];
        var ct_itm;

        for (var i = 0; i < _data.length; i++) {
            // console.log(_data[i].clients.length);
            
            ct_itm = _data[i].clients;

            // console.log(tm_itm);
            for (var j = 0; j < ct_itm.length; j++) {
                _clnt.push(ct_itm[j]);
            }
        }
        return _clnt;
    }

});
Class(function WorkModel(_data) {
    Inherit(this, Model);
    var self = this;

    // var b = _data.portfolio.slice(0);
    var b = _data.slice(0);
    // console.log(b);
    // console.log(data.portfolio);

    (function () {
        _init();
    })();

    function _init() {
        // console.log('DATA WorkModel – LENGTH: '+ _data.portfolio.length);
        // console.log(_data);
        // console.log(_data);

        // for (var f = 0; f < _data.portfolio.length; f++) {

        //     var e = _data.portfolio[f];

        //     // console.log(e.name);
        //     for (var i = 0; i < _data.portfolio[f].main_image.length; i++) {
                
        //         // console.log(e.main_image[i].urlPath);
        //         // console.log('e.main_image[i].urlPath');
        //         // console.log(e.main_image.splice(i, 1));
        //         // e.main_image.splice(i, 1);
        //         // c.splice(f, 1)

        //     }
        //     // console.log(e.name);
        //     // if (!e.media.length) {
        //     //     c.splice(f, 1)
        //     // }
        //     // data.portfolio.splice(f, 1);
        //     // console.log('DATA SPLICE');
        //     // console.log(data.splice(f, 1));

        // }
        // return _data;
        // for (var f = 0; f < c.length; f++) {
        //     var e = c[f];
        //     if (!e.media.length) {
        //         c.splice(f, 1)
        //     }
        // }
    }

    // function _getSortedData() {
    //     var _hmsl = [];
    //     var _orderedData = [];

    //     for (var i = 0; i < _data.length; i++) {
    //         if (_data[i].status) {

    //             _hmsl.push({'dragSortOrder': _data[i].dragSortOrder, 'data': _data[i] });
                
    //         }
    //     }
    //     _hmsl.sort(function(a, b){ return parseFloat(b.dragSortOrder) - parseFloat(a.dragSortOrder) });

    //     for (var j = 0; j < _hmsl.length; j++) {
    //         _orderedData.push(_hmsl[j].data);
    //     }

    //     return _orderedData;
    // }

    this.getOGData = function () {
        // console.log(b);
        return b;
    };
    
    this.getData = function() {
        return _data;
    };
    this.getImages = function() {
        var images = [];

        for (var f = 0; f < _data.length; f++) {

            // var e = _data[f];

            // console.log(e.name);
            for (var i = 0; i < _data[f].main_image.length; i++) {
                
                if (_data[f].main_image[0].urlPath) {
                    images.push(_data[f].main_image[i].urlPath);
                }
                // images.push(FEDevice.getAsset( e.main_image[i].urlPath, "jpg" ));

            }
        }

        return images;
    };
    this.getDeep = function (e) {
        // for (var f = 0; f < data.length; f++) {
        //     if (data[f].permalink == e) {
        //         // console.log(c[f]);
        //         return data[f].permalink;
        //     }
        // }
        // console.log('++++++++++++++++++++++++++++');
        // console.log('WORK MODEL');
        // console.log('e');
        // console.log(e);
        // // console.log(_data);
        // console.log('++++++++++++++++++++++++++++');

        for (var f = 0; f < _data.length; f++) {

            if (_data[f].main_categories.toLowerCase() == e) {

                return Utils.urlstr(_data[f].main_categories.toLowerCase());
            }
        }
    };

    this.getDetail = function (e) {
        // for (var f = 0; f < data.length; f++) {
        //     if (data[f].permalink == e) {
        //         // console.log(c[f]);
        //         return data[f].permalink;
        //     }
        // }
        // console.log('++++++++++++++++++++++++++++');
        // console.log('WORK MODEL');
        // console.log('e');
        // console.log(e);
        // // console.log(_data);
        // console.log('++++++++++++++++++++++++++++');
        // var _prma = !Data.WORK.getWorkByNum(_detailIndex).permalink ? Data.WORK.getWorkByNum(_detailIndex)._filename.toLowerCase() : Data.WORK.getWorkByNum(_detailIndex).permalink;
        // var _ctgy = !Data.STATE.category ? Utils.urlstr(Data.WORK.getWorkByNum(_detailIndex).main_categories) : Data.STATE.category;

        var _detailLink;

        for (var f = 0; f < _data.length; f++) {


            if (_data[f].permalink == e || Utils.urlstr(_data[f]._filename.toLowerCase()) == e) {

                return _detailLink;
            
            }

        }
    };

    // Not implemented
    // this.getDeepCategory = function (e) {

    //     for (var f = 0; f < _data.length; f++) {
            
    //         if (_data[f].main_categories.toLowerCase() == e) {

    //             console.log(_data[f].main_categories.toLowerCase);
    //             console.log(e);
    //             // console.log(_data[f]);
    //             return _data[f].main_categories.toLowerCase();
    //         }
    //     }
    // };

    this.getWorkByName = function(name) {
        for (var f = 0; f < _data.length; f++) {

            if (_data[f].name == name) {

                return _data[f];
            }
        }
    }

    this.getWorkByNum = function(_num) {
        for (var f = 0; f < _data.length; f++) {

            if (_data[f].num == _num) {

                return _data[f];
            }
        }
    }

    this.getImageByPageDetail = function (pageStateDetail) {
        for (var f = 0; f < _data.length; f++) {

            var _pgst = !_data[f].permalink ? Utils.urlstr(_data[f]._filename.toLowerCase()) : _data[f].permalink;

            
            if (_pgst == pageStateDetail) {
                console.log(_pgst);
                console.log(pageStateDetail);
                console.log(_data[f].main_image[0].urlPath);
                // console.log('_pgst: '+_pgst);
                return _data[f].main_image[0].urlPath;
            }
        }
    }

    this.getNumByPageDetail = function (pageStateDetail) {
        for (var f = 0; f < _data.length; f++) {

            var _pgst = !_data[f].permalink ? Utils.urlstr(_data[f]._filename.toLowerCase()) : _data[f].permalink;

            
            if (_pgst == pageStateDetail) {
                // console.log(_pgst);
                // console.log(_pageState);
                // console.log(_getSortedData()[f].main_image[0].urlPath);
                // console.log('_pgst: '+_pgst);
                return _data[f].num;
            }
        }
    }
    this.getImageByFilename = function() {

    }
    this.getNext = function (g, f) {
        var e = _data.indexOf(g);
        e += f;
        if (e < 0) {
            e = _data.length - 1
        }
        if (e > _data.length - 1) {
            e = 0
        }
        return _data[e];
    }
});

Class(function CategoryModel(data) {

    Inherit(this, Model);
    var self = this;

    // var b = _data.portfolio.slice(0);
    var _data = data;
    var b = _data.slice(0);
    var _ctyp = [];
    var _cnam = [];
    // console.log(b);
    // console.log(data.portfolio);

    (function () {
        _init();
    })();

    function _init() {
        
        for (var i = 0; i < _data.length; i++) {

            if (_ctyp.indexOf( _data[i].category_type ) == -1) {
                _ctyp.push( _data[i].category_type );
            }

            if (_cnam.indexOf( _data[i]['category_type:label'] ) == -1) {
                _cnam.push( _data[i]['category_type:label']);
            }

        }
        // for (var j = 0; j < _data.length; j++)
    }
    this.getOGData = function () {
        // console.log(b);
        return b;
    };
    this.getAllCategoryNames = function() {        
        return _cnam;
    };

    this.getAllCategoryTypes = function() {
        
        return _ctyp;
    }
    this.getCategoryByType = function(cat_type) {

        var _catSet = [];

        for (var i = 0; i < _data.length; i++) {
            // console.log('_data[i].data.length');
            // console.log(_data[i].name);
            // console.log(_data[i]['category_type:label']);

            // console.log(cat_type);
            // console.log(~~_data[i]['category_type']);
            if (_data[i].status.toLowerCase() == 'active') {
                if (~~_data[i]['category_type'] == cat_type) {
                    // console.log('_data[i]')
                    // console.log(_data[i]);
                    if(_catSet.indexOf( _data[i].name ) == -1) {
                        _catSet.push(_data[i]);
                    }
                }
            }
            // console.log(_data[i]);
            // console.log(_data[i].category_type);
            // if(_ctyp[i].id == cat_id) {
                // console.log('getCategoriesByID');
                // console.log(_ctyp[cat_id].id);
                // console.log(_ctyp[cat_id].name);

                // return _ctyp[cat_id].name;
            // }
        }
        
        return _catSet;
    };

    this.getCategoryNameByType = function(cat_type) {

        var _catSet = [];

        for (var i = 0; i < _data.length; i++) {
            // console.log('_data[i].data.length');
            // console.log(_data[i].name);
            // console.log(_data[i]['category_type:label']);

            // console.log(cat_type);
            // console.log(~~_data[i]['category_type']);
            if (_data[i].status.toLowerCase() == 'active') {
                if (~~_data[i]['category_type'] == cat_type) {
                    // console.log('_data[i]')
                    // console.log(_data[i]);
                    if(_catSet.indexOf( _data[i].name ) == -1) {
                        _catSet.push(_data[i].name);
                    }
                }
            }
            // console.log(_data[i]);
            // console.log(_data[i].category_type);
            // if(_ctyp[i].id == cat_id) {
                // console.log('getCategoriesByID');
                // console.log(_ctyp[cat_id].id);
                // console.log(_ctyp[cat_id].name);

                // return _ctyp[cat_id].name;
            // }
        }
        
        return _catSet;
    }
    // var _allTypes = Data.CATEGORIES.getAllCategoryTypes();
    // var _allNames = Data.CATEGORIES.getAllCategoryNames();

    // for (var i = 0; i < _allTypes.length; i++) {
    //     console.log('Category: length is '+Data.CATEGORIES.getCategoryByType( _allTypes[i] ).length);
    //     console.log(_allNames[i].toUpperCase());

    //     var _cat = Data.CATEGORIES.getCategoryByType( _allTypes[i] );

    //     for (var j = 0; j < _cat.length; j++) {
    //         console.log(_cat[j].name);
    //     }
        
    // }

    this.getCategoryTypeNameByID = function(cat_id) {
        // var __cat = [];

        for (var i = 0; i < _ctyp.length; i++) {

            // console.log(_data[i]);
            // console.log(_data[i].category_type);
            if(_ctyp[i].id == cat_id) {
                // console.log('getCategoriesByID');
                // console.log(_ctyp[cat_id].id);
                // console.log(_ctyp[cat_id].name);

                return _ctyp[cat_id].name;
            }
        }
    }

    this.getCategoryTypeIDByName = function(cat_name) {
        // var __cat = [];

        for (var i = 0; i < _ctyp.length; i++) {

            // console.log(_data[i]);
            // console.log(_data[i].category_type);
            if(_ctyp[i].name == cat_name) {
                // console.log('getCategoriesByID');
                // console.log(_ctyp[i].id);
                // console.log(_ctyp[i].name);

                return _ctyp[i].id;
            }
        }
    }

    // this.getNext = function (g, f) {
    //     var e = _data.indexOf(g);
    //     e += f;
    //     if (e < 0) {
    //         e = _data.length - 1
    //     }
    //     if (e > _data.length - 1) {
    //         e = 0
    //     }
    //     return _data[e];
    // }
});


Class(function Loader() {
    // console.log('======================================');
    // console.log('<div id="Loader> :: Controller');
    // console.log('======================================');

    Inherit(this, Controller);

    var _self = this;
    var _cont;
    var _load;
    var _alod, _ptst, _aset;

    (function () {
        _init();
        _getProgressImage(_startLoad);
    })();
    

    function _init() {
        _cont = _self.container;
        // _cont.size("100%").bg( 'white' );
        _cont.size("100%").bg( Config.COLORS.white );
    }
    
    function _startLoad() {
        _load = _self.initClass(LoaderView);
        _self.view   = _load;

        _self.delayedCall( _loadActions, Device.mobile ? 750 : 500 );
    }
    
    function _loadActions() {
        // console.log('MMMMMMMMMMMMMMMMM')
        
        // 'l' IS THE ARRAY EVERYTHING THAT NEEDS TO BE LOADED 
        // GETS PUSHED INTO;
        _aset = [];
        
        // if (Device.graphics.webgl && !Device.mobile) {
        //     l.push(Config.PROXY + "assets/models/home.json")
        // }
        
        // FEDevice.bundleAssets(["common", "shaders", "sidebar", "contact", (Data.STATE.page == "lab" ? "work" : Data.STATE.page) + "/"], l);
        FEDevice.bundleAssets(["common", "shaders"], _aset);
        // l.push(Config.PROXY + "assets/js/lib/three.min.js");
        // _aset.push(Config.PROXY + "/assets/js/lib/three.min.js");

        _loadImages();

        _alod = _self.initClass(AssetLoader, _aset);
        _alod.add(10);

        _alod.events.add(FlipEvents.PROGRESS, _onProgress);
        _alod.events.add(FlipEvents.COMPLETE, _onComplete);

        _ptst = _self.initClass(PerformanceTest);
        _ptst.events.add(FlipEvents.COMPLETE, _assetLoadTrigger);
    }

    // function c(q, r) {
    function _loadImages(q, r) {
        // console.log('================================')
        // console.log('Data.STATE.page: '+Data.STATE.page);
        // console.log('================================')
        // console.log('q: '+q)
        // console.log('r: '+r)
        r = r || _aset;
        
        if (!q) {
            // if (Data.STATE.page == "work") {
            //     q = Data.WORK.getImages();
            // } else {
            //     if (Data.STATE.page == "lab") {
            //         q = Data.LAB.getImages();
            //     }
            // }
        }
        if (q) {
            for (var p = 0; p < q.length; p++) {
                r.push(q[p]);
            }
        }
    }

    function _loadAssets() {
        // console.log('=========================')
        // console.log(Config.ASSETS.length);
        // console.log(d);
        // console.log('=========================')
        var __aset = [];
        for (var i = 0; i < Config.ASSETS.length; i++) {
            __aset.push(FEDevice.parseAsset(Config.ASSETS[i]));
        }
        // _loadImages( Data.WORK.getImages(), __aset);

        for (var i = 0; i < __aset.length; i++) {
            for (var j = 0; j < _aset.length; j++) {
                if (_aset[j].strpos(__aset[i])) {
                    __aset.splice(i, 1);
                }
            }
        }
        _alod.destroy();
        _alod = _self.initClass(AssetLoader, __aset);
    }
    function _getProgressImage(_callback) {
        // console.log('q: ' + q);

        var _image       = new Image();
        // p.src       = Config.IMAGES + "loader/letter.png";
        _image.src       = Config.IMAGES + "loader/letter.png";
        _image.onload    = _callback;
    }

    function _onComplete() {

        _loadAssets();

        _self.delayedCall(function () {


            if (!Device.mobile) {
                // console.log('MOVE');
                _self.delayedCall(_load.move, 500);
            } else {
                // console.log('FADE');
                _self.delayedCall(_load.fade, 250);
            }

        }, 100);

        // REMOVE LOADER AFTER EITHER ANIMATION
        _self.delayedCall(function() {
            _self.events.fire(FlipEvents.COMPLETE);
        }, 500);
    }

    function _onProgress(p) {

        // console.log(p.percent)
        _load.update(p.percent);
    
    }
    function _assetLoadTrigger() {
        _alod.trigger(10);
    }
    this.animateOut = function () {
        _load.animateOut();
    }
});

Class(function TopBar() {
    // THESE CONTROLLERS END UP BEING ID'S WITH THE NAME
    // OF THE ID GETTING SET AS THE NAME OF THIS CLASS. IN
    // THIS CASE, this.container WOULD EQUAL '#Sidebar'

    Inherit(this, Controller);
    
    var _chld;
    var _cont;
    var _logo, _loc, _nav;
    var _self   = this;
    var _startY = Device.mobile ? 0 : 0;
    _self.height = 90;
    
    Global.TOPBAR = this;

    (function () {
        _markup();
        _getChildren();
        _eventSubscribe();
    })();

    function _markup() {
        _cont = _self.container;
        _cont.css({
            height: _self.height,
            width: "100%",
            // border: '1px solid red'
        }).setZ(10000);

        _cont.css({
            overflow: "hidden"
        });

        var gradient = "";
        if (Device.vendor !== ""){
            gradient = "-"+Device.vendor+"-linear-gradient(top,  rgba(0,0,0,0.36) 0%,rgba(0,0,0,0) 100%)"; // most browsers
        }else{
            gradient = "linear-gradient(to bottom,  rgba(0,0,0,0.36) 0%,rgba(0,0,0,0) 100%)"; // W3C
        }

        s = _cont.create(".bg");
        s.size("100%", "100%").css({
            background: Config.COLORS.white,
            opacity: 0.80
        }).setZ(0);
    }
    
    function _getChildren() {
        _logo = _self.initClass(TopBarLogo);
        _nav = _self.initClass(TopBarNav);
        // _loc = _self.initClass(TopBarLocation);
    }

    function _resizeEvent() {
        _self.events.subscribe(FlipEvents.RESIZE, _resizeWidth);
    }

    function _resizeWidth() {
        _cont.css({
            width: Stage.width
        });
    }

    function _eventSubscribe(){
        _self.events.subscribe(FEEvents.VIDEO_LOAD, _animateOut);
        _self.events.subscribe(FEEvents.VIDEO_UNLOAD, _animateIn);
    }

    function _animateIn(){
        _cont.stopTween().transform({
            y: -130
        }).tween({
            y: 0
        }, 500, "easeOutQuart");
    }

    function _animateOut(){
        _cont.stopTween().transform({
            y: 0
        }).tween({
            y: -130
        }, 500, "easeOutQuart");
    }
    
    this.animateIn = function(){
        _animateIn();
    };

    this.animateOut = function(){
        _animateOut();
    };

    this.release = function () {
        _chld.release()
    }
});
Class(function Home() {

    Inherit(this, Controller);
    
    var _cont, _dataSet, _wlst, _halftone, _tint;
    var _work_el, new_fullBg, _wdtl, _hmsl, _hbck;
    var _pcon;

    var _self   = this;
    Global.HOME = this;
    // var _vc1    = new Vector2();
    // var _vc2    = new Vector2();

    // constructor
    (function () {
        _markup();
        _initWorkView();
        _getSlideData();
        _eventSubscribe();
        _handleDeepLink();
    })();

    function _markup() {
        _cont = _self.container;
        _cont.size("100%").backfaceVisibility();
        // _cont.backfaceVisibility('visible');
    }
    
    function _initWorkView() {

        Global.HOME.transition = {};
        Global.HOME.origin = {};
        Global.HOME.textures = {};
        Global.HOME.transition.time = 1000;
        Global.HOME.transition.ease = "workOpen";

        // select data related to given page
        // var _data;
        // var _hmsl = [];

        if (Data.STATE.detail) {

        }

    }

    function _getSlideData() {

        _dataSet = Data.HOME.getData();

        console.log('HOME :: _getSlideData:');
        console.log(_dataSet);
        
        // _wlst = _self.initClass(WorkList, _dataSet);
        _hbck = _self.initClass(FullscreenBackground);
        _pcon = _self.initClass(PageContainer);
    
        
        _work_el = _self.element;
        
    }

    function _handleDeepLink() {


        if (Data.STATE.detail) {

            Global.HOME.detaillink = true;
            var _deep = Data.HOME.getDeep(Data.STATE.deep); // TODO: need to change based on page state
            var _detl = Data.HOME.getDetail(Data.STATE.detail); // TODO: need to change based on page state

            _detailSelect({ 'data': Data.HOME.getImageByPageDetail(Data.STATE.detail) });



        }

    }

    function _eventSubscribe() {

        // _wlst.events.add(FEEvents.SELECT, _detailSelect);
        _self.events.subscribe(FEEvents.STATE_CHANGE, _handleDeepLink);

        _self.events.subscribe(FEEvents.VIDEO_LOAD, _loadFullVideo);
        _self.events.subscribe(FEEvents.VIDEO_UNLOAD, _unloadFullVideo);
    }

    function _detailSelect(l) {

        Global.DETAIL_OPEN = true;

        var _dat = l.data;

        _wdtl = _self.initClass(WorkDetail, _dat, "home");
        _wdtl.events.add(FEEvents.CLOSE, _close);
    }

    function _close() {

        Global.WORK.detaillink    = false;
        Global.DETAIL_OPEN      = false;

        Data.STATE.setState("work");

        // _wlst.resume();
        
        _wdtl.animateOut(function () {
            _wdtl = _wdtl.destroy();
        });
    }

    

        // functions for loading and unloading the full screen video
    function _loadFullVideo(params){
        //console.log("_loadFullVideo triggered");
        _video = _self.initClass(VideoOverlay, params.index);



        // _self.delayedCall(function(){
        //     _video.animateIn();
        // }, 1000);
    }


    function _unloadFullVideo(){
        //console.log("_unloadFullVideo triggered");

        _video.animateOut();

        _self.delayedCall(function(){
            _video.destroy();
        }, 500);
    }

    this.loadFullVideo = function(_index){
        _loadFullVideo(_index);
    };

    this.unloadFullVideo = function(){
        _unloadFullVideo();
    };

    this.loadBackground = function(_bgimage, _index) {
        
        _loadBackground(_bgimage, _index);
        
    };
    this.destroyBG = function() {
        // console.log('destroy');
        if (!Global.HOME.detaillink) {
            for (var ii = 3; ii < _work_el.children().length; ii++) {
                if (ii != _work_el.children().length - 1) {
                    var xtrabg = _self.container.children()[ii];
                    xtrabg.remove();
                }
            }
        }
    };
    this.bgresize = function() {
        // console.log('RESIZING');
        _positionBackground();
    };
    this.destroy = function () {
        // Global.BORDER.showBottom();
        return this._destroy();
    };
});

Class(function Container() {

    Inherit(this, Controller);

    var _self   = this;
    var z       = 0;

    var _cont, _load, _elem;
    var _tpbr, _cnct, _icon;
    var _pageclass, _covr;



    (function () {

        Global.CONTAINER = _self.element;

        Mouse.capture();
        _markup();
        
        // PREVIOUSLY ADDED BORDERS, WHICH CALLED SIDEBAR
        // WHICH HAD A DELAYED CALL TO PAGE STATE
        _initLoader();

    })();

    function _markup() {

        _cont = _self.container;

        _cont.size(Stage.width, Stage.height).css({
            overflow: "hidden"
        }).setZ(2);

        Stage.add(_cont);

        
        _elem = _cont.create(".ContainerWrapper");
        _elem.size("100%");

        _covr = _self.initClass(Cover, false);
        Stage.add(_covr);
    }

    // Initializes 'loader' and calls back function after COMPLETE
    function _initLoader() {

        _load = _self.initClass(Loader);
        _load.events.add(FlipEvents.COMPLETE, _initNavigation);

    }

    // RENDERS SIDEBAR
    function _initNavigation() {
        // console.log('INIT SIDEBAR');

        _tpbr = _self.initClass(TopBar, _cont);
        // _icon = _self.initClass(SidebarIcon);
        // _side = _self.initClass(Sidebar);

        // _cnct = _self.initClass(Contact);

        _eventsubscribe();

        _onResize();

        _self.delayedCall(function () {

            // THIS TRANSITION IS A LARGE BLACK BOX THAT IS
            // IMMEDIATELY ADDED TO THE PAGE 
            Transition.instance().resize();

            // THIS SELECTS THE PAGE STATE AND SERVES THE VIEW
            _pageState();

        }, Device.browser.firefox ? 1000 : 500);

        _self.delayedCall(function () {

            // THIS IS THE TRANSITION AFTER
            // LOADING INFORMATION ONTO PAGE
            Transition.instance().animateOut();

            _load = _load.destroy();

        }, Device.browser.firefox ? 1200 : 600);

    }

    // SETS GLOBAL PAGES AND INITIALIZES
    // THAT PAGE NAME AS A CLASS
    function _pageState(pagename) {

        if (!pagename) {
            pagename = Data.STATE.page;
        }

        var className;


        // decide which page to display
        switch (Data.STATE.page) {
            // can we use the same controller for all these?
            case "work":
                className = Work;
                break;
            default:
                className = Home;
                break;
        }

        Global.PAGE         = pagename;
        _pageclass          = _self.initClass(className, null);
        Global.CURRENT_PAGE = _pageclass;
        
        _elem.add(_pageclass);
        
    }

    // function o() {
    function _eventsubscribe() {
        _self.events.subscribe(FlipEvents.RESIZE, _onResize);
        _self.events.subscribe(FEEvents.NAV_SELECT, _navSelectCallback);
        _self.events.subscribe(FEEvents.STATE_CHANGE, _setNavSelectCallback);

        if (Device.mobile) {
            _elem.bind("touchstart", A);
        } else {
            _cont.bind("click", p);
        }
    }
    
    function A() {
        if (Global.SIDEBAR_OPEN) {
            h({
                open: false,
                noDelay: true
            })
        }
    }
    function p() {
        if (Global.CONTACT_OPEN) {
            i({
                open: false
            });
        }
    }
    
    function _onResize() {

        var D = Device.mobile ? 0 : 0;
        var C = Stage.width - D;
        var B = Stage.height;

        _cont.size(Stage.width, Stage.height);

        _elem.css({
            left: D,
            width: C,
            height: B
        });

        FEDevice.width = C;
        FEDevice.height = B;

        if (Mobile.phone) {
            if (FEDevice.width > FEDevice.height) {
                _covr.show("landscape");
            } else {
                _covr.hide();
            }
        }
        if (!Device.mobile) {
            if (!window.navigator.msPointerEnabled) {
                if (Stage.width < 580) {
                    _covr.show("smallDesktop");
                } else {
                    _covr.hide();
                }
            }
        }
        _self.events.fire(FEEvents.RESIZE);
    }
    
    function _setNavSelectCallback() {   

        var _type = Data.STATE.page;
        
        if (Data.STATE.deep) {
            _type += '/' + Data.STATE.deep;
        }
        if (Data.STATE.detail) {
            _type += '/' + Data.STATE.detail;
        }


        Data.STATE.unlock();

        _navSelectCallback({
            type: _type 
        });
    }

    function _navSelectCallback(C) {


        if (FEDevice.IE9) {
            if (C.type == "home") {
                C.type = "work"
            }
        }

        if (Global.TRANSITION) {
            _pageclass.element.hide();
        }
        
        _self.type = C.type;

        var B = z < C.index ? 1 : -1;

        z = C.index;

        Global.TRANSITION = true;

        Data.STATE.setState(C.type);


        Transition.instance().animateIn(B, C.type, t);
    }

    function t(pagename) {
        
        console.log(':: CONTAINER t(pagename): '+ _self.type);
        console.log(pagename);

        if (_self.type !== pagename) {
            return;
        }
        
        _pageclass = _pageclass.destroy();
        _pageState(_self.type);

        _self.delayedCall(j, 250);
    }

    function j() {
        if (_self.type !== Global.PAGE) {
            return;
        }

        Transition.instance().animateOut();
        Global.TRANSITION = false;
        // Data.STATE.unlock()
    }
}, "Singleton");
Class(function Cover() {
    Inherit(this, View);
    var f = this;
    var g, k, i, j, d, c;
    (function () {
        e();
        if (Device.mobile) {
            h();
        } else {
            b();
        }
    })();

    function e() {
        g = f.element;
        g.size("100%").setZ(999999).bg(Config.COLORS.branding);
        g.hide();
    }
    function h() {
        k = g.create("wrap");
        k.size("100%", 60).center(0, 1).transform({
            y: -30
        });
        k.invisible();
        i = k.create("text");
        i.text("Please rotate your device<br/><br/> to landscape.");
        i.fontStyle("OpenSans", 16, "#fff").css({
            textTransform: "uppercase",
            letterSpacing: 2,
            width: "100%",
            textAlign: "center",
            lineHeight: 16,
            top: 0
        });
        j = k.create("rotate");
        j.size(28, 28).center(1, 0).bg(Config.IMAGES + "common/rotate.png").css({
            bottom: -30
        });
        j.transform({
            rotation: 0
        });
    }
    function b() {
        k = g.create("wrap");
        k.size(400, 260).center();
        k.invisible();
        var l = k.create(".logo");
        l.size(150, 150).bg(Config.IMAGES + "home/logo-invert.png").center(1, 0);
        var m = k.create("text");
        m.fontStyle("OpenSansLight", 13, Config.COLORS.white).css({
            letterSpacing: 1,
            top: 175,
            width: "100%",
            textAlign: "center"
        });
        m.text("Please make your browser bigger.<br/><br/>Visit on your mobile device<br/>to see the mobile optimized site.");
    }
    function a(l) {
        if (d) {
            j.tween({
                rotation: l
            }, 600, "easeInOutCirc", function () {
                a(l + 180);
            });
        }
    }
    this.show = function (l) {

        /*console.log('COVER');
        console.log(Device.mobile.phone);
        console.log(l);*/

        if (Device.mobile.phone) {
            g.hide();
            
            k.invisible();
            if (l == "portrait") {
                d = true;
                j.transform({
                    rotation: 0
                });
                a(180);
            }
        } else {
            g.show();
            k.visible();
            if (l == "landscape") {
                d = true;
                j.transform({
                    rotation: 0
                });
                a(180);
            }
        }
    };
    this.hide = function () {

        /*console.log('COVER');
        console.log(Device.mobile.phone);*/
        // console.log(l);

        if (Device.mobile.phone) {
            g.show();
            k.visible();
            d = true;
            j.transform({
                rotation: 0
            });
            a(180);

        } else {
            g.hide();
            k.invisible();
            d = false;

        }
    }
});


Class(function Transition() {
    // console.log('tranistion is called - singleton');

    Inherit(this, View);
    var _self           = this;
    f                   = 1;
    _self.direction     = 1;

    var j, k, d, b;
    var m, e, i;
    
    (function () {
        c();
        l();
        h();
        a();
    })();

    function c() {

        j = _self.element;
        j.size("100%").setZ(999).css({
            left: !Device.mobile ? 0 : 0,
            height: "112%",
            top: "-6%"
        });
        // after first call
        // j.transform({
        //     skewY: Config.SKEW
        // }).invisible();
        k = j.create("fill");
        k.size("100%");

        d = j.create("fill");
        d.size("100%").css({
            overflow: "hidden"
        }).bg(Config.COLORS.white);
    }
    function l() {
        b = j.create(".loader");
        b.size(45, 45).center().css({
            // marginLeft: !Device.mobile ? -150 : -22,
            marginTop: -50
        }).invisible();
        b.inner = b.create(".inner");
        b.inner.size(45, 45).bg(Config.IMAGES + "common/loader.png");
        var n = _self.initClass(CSSAnimation, b.inner);
        n.loop = true;
        n.duration = 1000;
        n.ease = "linear";
        n.frames = [{
            rotation: 0
        }, {
            rotation: 360
        }];
        b.anim = n
    }
    function h() {
        _self.events.subscribe(FlipEvents.RESIZE, a);
    }
    function a() {}
    this.animateIn = function (n, o, p) {
        e = o;
        f = n;
        _self.direction = f;
        m = true;
        Global.CONTAINER.addChild(j);
        j.visible();

        k.stopTween().transform({
            y: Stage.height * f * 1.12
        }).tween({
            y: 0
        }, 600, "easeOutQuint");

        d.stopTween().transform({
            y: Stage.height * f * 1.12
        }).tween({
            y: 0
        }, 800, "easeOutQuint", 200);

        b.visible().stopTween().css({
            opacity: 0
        }).transform({
            y: 100 * f
        }).tween({
            y: 0,
            opacity: 1
        }, 800, "easeOutQuart", 200);

        b.anim.play();
        if (i) {
            clearTimeout(i)
        }
        i = setTimeout(function () {
            if (p) {
                p(e);
            }
        }, 1100);
    };
    this.animateOut = function () {
        if (!m) {
            Global.CONTAINER.addChild(j);
        }
        j.visible();
        d.transform({
            y: 0
        }).tween({
            y: -Stage.height * f * 1.12
        }, 600, "easeOutQuint");

        k.transform({
            y: 0
        }).tween({
            y: -Stage.height * f * 1.12
        }, 700, "easeOutQuint", 200, function () {
            Global.CONTAINER.removeChild(j);
            j.invisible();
            m = false;
        });

        _self.delayedCall(function () {
            b.anim.stop();
            b.invisible();
        }, 100);
    };
    this.resize = function () {
        m = true;
        j.visible();
        Global.CONTAINER.addChild(j);
        a()
    }
}, "Singleton");
Class(function WorkList(workdata) {
    Inherit(this, View);
    
    // var f = this;
    var _self = this;
    var _spacing = 0.56;

    // var o;
    // var g;
    var _elem, _el, _test, _button, _prev, _next;

    var _cube, _front, _right, _left, _back, _cubeWidth, _cubeHeight;
    var _rotateDegrees = 90;
    var _rotateIncrement = 0;

    var Q, O, z, L, A, q;
    var t, k, i, j, h;

    var _touchIncrement;
    var e = true;
    // var w = [];
    var _items = [];
    var _scrollspeed = 15;
    
    var a = new Vector2(); // container vector
    var n = new Vector2(); // user scroll vector
    var M = new Vector2();
    var x = new Vector2();
    var r = new Vector2();
    var l = new Vector2();
    var C = new Vector2();

    this.lastHovered = false;
    
    (function () {

        Global.CAN_CLICK = true;

        _markup();
        _initListItems();
        _initScrollAndPosition();
        _positionItems();
        _buttonActions();

        Render.startRender(_moveContainer);
        Render.nextFrame(_animateIn);

    })();

    function _markup() {

        /*console.log('========================');
        console.log('_markup() FROM WORK LIST');
        console.log('========================');*/
        _cubeWidth = Stage.width;
        _cubeHeight = Stage.height;

        _elem = _self.element;
        _elem.size("100%").setZ(10);
        

        _el = _elem.create("container");
        _el.size("100%");
        // _el.size("100%").useMatrix2D();

        /*_test = _elem.create(".test");
        _test.center().css({
            background: Config.COLORS.white,
            color: Config.COLORS.black
        });*/
        
        // _viewport.addChild(_button)

    }
    function _buttonActions() {
        // _prev.interact(_hoverActions, _clickDetailActions);
        // _next.interact(_hoverActions, _clickDetailActions);
    }
    function _hoverActions(_event) {
        console.log('HOVER ACTIONS');
        console.log(_event.action);
        
        switch(_event.action) {
            case 'over':
                // console.log(_event.object);
                _event.object.css({
                    background: 'red'
                });
            break;
            case 'out':
                // console.log(_event.object);
                _event.object.css({
                    background: 'white'
                });
            break;
        }
    }
    function _clickDetailActions(_event) {

        switch(_event.object.div.className) {
            case 'prev':
                ++_rotateIncrement;
                _cube.tween({
                    rotationY: _rotateIncrement*_rotateDegrees,
                }, 800, 'easeOutCubic');
            break;
            case 'next':
                --_rotateIncrement;
                _cube.tween({
                    rotationY: _rotateIncrement*_rotateDegrees,
                }, 800, 'easeOutCubic');
            break;
        }
    }
    
    function _initListItems() {
        // console.log("WorkList _initListItems");
        // console.log(workdata);
        // console.log("========================");

        for (var S = 0; S < workdata.length; S++) {


            // console.log(workdata[S].main_image[0])
            if (workdata[S].main_image[0]) {


                var _indx = workdata[S].num;
                var _w_itm = _self.initClass(WorkListItem, workdata[S], _indx);
                _w_itm.events.add(FlipEvents.CLICK, _clickEvents, _indx);

                _el.add(_w_itm);
                _items.push(_w_itm);
            }
        }

        _indexItems();
    }
    
    
    // REPOSITIONS WORKLISTITEM WHEN SCROLLING
    function _repositionOnDownScroll(w_itm) {

        console.log('========================');
        console.log('_repositionOnDownScroll(T)' + w_itm);
        console.log(w_itm);
        console.log('A');
        console.log(A);
        // console.log(w)
        console.log('========================');


        if (A && !j) {
            return;
        }
        // GET LAST ITEM IN ARRAY
        var _last = _items[_items.length - 1];
        // console.log('S');
        // console.log(S);
        // POSITION PARAMETER 'T' WHERE THE
        // LAST ITEM IS POSITIONED + Q
        w_itm.positionY(_last.y + Q);
        console.log('_last.y + Q');
        console.log(_last.y + Q);
        // ARRAY SHIFT REMOVING FIRST ITEM 'T',
        // THUS SHIFTING THE ENTIRE GROUP ONE AHEAD
        _items.shift();
        // PUSH 'T' BACK INTO THE ARRAY ADDING IT
        // TO THE END
        _items.push(w_itm);
        // REINDEX ITEMS
        _indexItems();
        // console.log(Transition.instance().direction);
    }

    // function R(S) {
    function _repositionOnUpScroll(wkitm) {

        console.log('========================');
        console.log('_repositionOnUpScroll(S)');
        console.log(wkitm);
        console.log(Q);
        console.log('========================');

        if (A && !j) {
            return;
        }
        var T = _items[0];

        wkitm.positionY(T.y - Q);
        
        _items.pop();
        _items.unshift(wkitm);
        _indexItems();
        // console.log(Transition.instance().direction);
    }

    function _animateIn() {
        /*console.log('========================');
        console.log('_animateIn() FROM WORK LIST');
        console.log('========================');*/

        if (Mobile.os == "Android" || (Mobile.os == "iOS" && FEDevice.PERFORMANCE === 0 && Mobile.tablet)) {
            return;
        }

        // a.y = Stage.height * Transition.instance().direction;
        a.y = Stage.height * Transition.instance().direction;
    }

    function _indexItems() {
        // console.log('========================');
        // console.log('b() FROM WORKLIST');
        // console.log('Assigns an index to the');
        // console.log('_items[] array - length: '+_items.length);
        // console.log('========================');
        for (var S = 0; S < _items.length; S++) {
            _items[S].index = S;
            // console.log(_items[S]);
        }

        //console.log(_items);
    }
    
    // seems to run after scrolling comes to a stop, in either direction
    function H() {
        // var _elX = _el.x;
        var _elY = _el.y;

        a.y = 0;
        // console.log('===================')
        // console.log(a)
        // console.log('===================')
        n.y = 0;
        
        _el.y = 0;
        
        _el.transform();
        
        for (var S = 0; S < _items.length; S++) {
            var _itm = _items[S];
            _itm.positionY(_itm.y + _elY);
        }
        
        s();
        
        _indexItems();
    }
    
    // used when doing an upscroll reposition
    function s() {
        if (k) {
            return;
        }
        Render.nextFrame(function () {
            // triggered when stage comes in and when scolling up
            //console.log('from s(): _repositionOnUpScroll');
            _repositionOnUpScroll(_items[_items.length - 1], true);
        });
    }

    function v(T, V) {

        var U = Math.abs(V - T);

        if (U > 100) {

            return;

        }
        if (U < 5) {

            if (!e) {
            
                e = true;
            
                _elem.mouseEnabled(true);
            
            }
        } else {
           
            if (e) {
           
                e = false;
           
                _elem.mouseEnabled(false);
           
                for (var S = 0; S < _items.length; S++) {
           
                    _items[S].disable();
           
                }
            }
        }
    }
    
    // _moveContainer is called many times per second
    // used when doing a down scroll reposition
    function _moveContainer(pos) {
        // pos seems to be some kind of value that is related to the position of the work list items.
        // it's a very fine-tuned value
        // could be framerate?
        
        var stage_y = a.y;

        // hover scrolling zones
        // if (!Device.mobile){
        //     var zonewidth = Stage.width*0.1;

        //     // left zone
        //     if (Mouse.y > 130 && Mouse.x >= 0 && Mouse.x <= zonewidth){
        //         n.x += _scrollspeed;
        //     }

        //     // right zone
        //     // if (Mouse.y > 130 && Mouse.x >= Stage.width-zonewidth && Mouse.x <= Stage.width && !Global.SIDEBAR.opened){
        //     if (Mouse.y > 130 && Mouse.x >= Stage.width-zonewidth && Mouse.x <= Stage.width){
        //         n.x -= _scrollspeed;
        //     }
        // }

        // arrow keys
        window.onkeydown = function(event){
            // console.log(event.keyCode);
            switch (event.keyCode){
                case 37:
                // left
                n.y += _scrollspeed;
                break;

                case 39:
                // right
                n.y -= _scrollspeed;
                break;
            }
        };
        
        // it's the lerp!
        a.lerp(n, 0.075);

        if (!z) {
            // identify scroll direction with a simple positive/negative value
            scrollDirection = a.y > stage_y ? -1 : 1;
        }

        if (Math.abs(n.y - a.y) <= 0.1 && a.y !== 0 && !z) {
            H();
        }

        v(stage_y, a.y);
        
        _el.y = a.y;
        
        _el.y.toFixed(4);

        if (pos) {
            _el.transform();
        }

        workItemsLength = _items.length - 1;

        for (var S = workItemsLength; S > -1; S--) {
            var workListItem = _items[S];

            // var W = a.y + (workListItem.y + workListItem.height);
            var W = a.y + (workListItem.y + workListItem.height);

            if (pos) {
                workListItem.parallax(_el.y);
            }

            if (W < 0 && scrollDirection == 1 && S === 0) {
                // triggered when stage comes in and when scrolling down
                //console.log('from _moveContainer(): _repositionOnDownScroll');
                _repositionOnDownScroll(workListItem);
            }

            //if (W > Stage.height + (workListItem.height * 1.5) && scrollDirection == -1 && S == workItemsLength) {
            if (W > Stage.height + (workListItem.height * 1.5) && scrollDirection == -1 && S == workItemsLength) {
                // triggered when stage comes in and when scrolling up
                //console.log('from _moveContainer(): _repositionOnUpScroll');
                _repositionOnUpScroll(workListItem);
            }
        }
    }

    // animate list items out of the way when opening a detail view
    // W is boolean, but appears unused
    function _detailOpenAnim(targetItem, performance_value, W) {
        //console.log("_detailOpenAnim()");
        // var maxwidth = Stage.width*0.5;
        var maxheight = Stage.height*0.5;
        //console.log(3 * _items.length);

        for (var i = 0; i < _items.length; i++) {
            var workListItem = _items[i], x;

            // set up animation values
            x = workListItem.y + (maxwidth * (workListItem.index > targetItem.index ? 1 : -1));
            workListItem.oY = workListItem.y;

            var params = {
                y: x,
                unskew: true
            };

            if (workListItem.index == targetItem.index){
                // expand and move
                var next_y = _items[i+1].y + maxheight;
                var expand = next_y - x;

                params.openthis = true;
                params.expand = expand;

                workListItem.animateOpen(params);
            }else{
                // move only
                workListItem.animateOpen(params);
            }

            /*x = workListItem.x + (maxwidth * (workListItem.index < targetItem.index ? -1 : 1));
            workListItem.oY = workListItem.x;

            console.log(workListItem.index+" tween by "+x);
            workListItem.tween({
                x: x
            }, 3000, Global.CURRENT_PAGE.transition.ease);*/

            /*if (performance_value) {
                workListItem.tween({
                    // y: y
                    x: x
                }, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);
            } else {
                // workListItem.y = y;
                workListItem.x = x;
                if (!Device.mobile) {
                    // workListItem.position(workListItem.y);
                    workListItem.positionX(workListItem.x);
                }
            }*/
        }
    }

    function p() {

        /*console.log('======================');
        console.log('p() FROM WORK LIST');
        console.log('======================');*/

        var S = MathUtil.getSliceHeight();
        var sliceWidth = MathUtil.getSliceWidth();

        H();
        
        for (var U = 0; U < workdata.length; U++) {

            for (var T = 0; T < _items.length; T++) {
                
                if (_items[T].data == workdata[U]) {
                
                    _items[T].index = U;
                
                }
            }
        }

        _items.sort(function (Y, X) {
            return Y.index - X.index;
        });

        /*for (U = 0; U < _items.length; U++) {
            var V = _items[U];
            console.log('===================');
            console.log('V.data');
            console.log(V.data);
            console.log('===================');
            // console.log(V.data);
            if (V.data.perma == Global.CURRENT_PAGE.target.perma) {
                Global.CURRENT_PAGE.target = V;
            }
            V.resize(S);
            V.position((S * 0.58) * U);
        }*/
        
        // loop through list items and apply size and position
        for (var T = 0; T < _items.length; T++) {
            var workListItem = _items[T];
            
            if (workListItem.data.perma == Global.CURRENT_PAGE.target.perma) {
                Global.CURRENT_PAGE.target = workListItem;
            }
        
            //workListItem.resize(S, q ? T : null);
            //workListItem.position((S * 0.58) * T, q ? T : null);
            
            workListItem.resize(S);
            workListItem.positionY((S * _spacing) * T);
        }

        Global.CURRENT_PAGE.target.incoming();

        // Q = _items[1].y - _items[0].y;
        Q = _items[1].y - _items[0].y;

        for (U = 0; U < _items.length; U++) {
            _items[U].setMargin(Q);
        }

        // n.y = -(Global.CURRENT_PAGE.target.y - (Stage.height * 0.3));
        n.y = -(Global.CURRENT_PAGE.target.y - (Stage.height * 0.3));

        // _el.y = 1;
        _el.y = 1;
        _el.oY = 0;
        while (_el.y != 0) {
            _moveContainer();
        }
        _moveContainer(true);
        s();
        var W = Global.CURRENT_PAGE.target;
        // Global.CURRENT_PAGE.origin.x = FEDevice.width / 2 - W.bg.width / 2;
        // Global.CURRENT_PAGE.origin.y = W.getY() + (W.height / 2 - W.bg.height / 2);
        // Global.CURRENT_PAGE.origin.y -= FEDevice.width * 0.0636;
        Global.CURRENT_PAGE.origin.x = FEDevice.width / 2 - W.bg.width / 2;
        Global.CURRENT_PAGE.origin.y = W.getY() + (W.height / 2 - W.bg.height / 2);
        Global.CURRENT_PAGE.origin.y -= FEDevice.width * 0.0636;
    }

    function _initScrollAndPosition() {
        
        _self.events.subscribe(FlipEvents.RESIZE, _positionItems);

        ScrollUtil.link(_setScrollPosition);
        
        if (Device.mobile) {
            Stage.bind("touchstart", D);
            Stage.bind("touchend", u);
            Stage.bind("touchcancel", u);
        }
    }
    // function D() {

    // }
    // function _getCurrentController() {
    //     if (!Global.CURRENT_PAGE) {
    //         switch(Global.PAGE) {
    //             case 'home':
    //                 Global.CURRENT_PAGE = Global.HOME;
    //             break;
    //             case 'directors':
    //             case 'work':
    //                 Global.CURRENT_PAGE = Global.WORK;
    //             break;
    //             case 'reels':
    //                 Global.CURRENT_PAGE = Global.REELS;
    //             break;
    //         }
    //     }

    //     return Global.CURRENT_PAGE;
    // }
    // function E(U, S) {
    function _clickEvents(eventObject, S) {
        console.log("=============================");
        console.log("WORK LIST ::");
        console.log(eventObject);
        console.log(S);
        console.log("=============================");

        Global.CAN_CLICK    = false;
        Render.stopRender(_moveContainer);

        H();

        console.log(Global.CURRENT_PAGE);
        console.log(Global.PAGE);
        
        // Global.CURRENT_PAGE.target  = eventObject.target;
        Global.CURRENT_PAGE.target  = eventObject.target;

        var targetItem     = eventObject.target;
        var targetElement  = targetItem.element;

        var targetCenterY = targetItem.y + (targetElement.height/2);
        var move = (Stage.height/2) - targetCenterY;
        _el.oY = _el.y;

        // center selected slice on screen
        _el.tween({
            y: move
        }, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);


        Global.CURRENT_PAGE.origin.x        = FEDevice.width / 2 - targetElement.width / 2;
        Global.CURRENT_PAGE.origin.y        = targetItem.getY() + (targetElement.height / 2);
        Global.CURRENT_PAGE.origin.width    = targetElement.width;
        Global.CURRENT_PAGE.origin.height   = targetElement.height;

        A = true;
        t = eventObject.target;

        // animate slice open
        _detailOpenAnim(targetItem, FEDevice.PERFORMANCE > 0, true);

        _self.delayedCall(function () {
            if (!Device.mobile) {
                _elem.hide();
            } else {
                _elem.css({
                    top: -999999
                });
            }
        }, S ? 1 : Global.CURRENT_PAGE.transition.time*1.4);

        _self.events.fire(FEEvents.SELECT, {
            data: eventObject.target.data
        });
        console.log('WORK LIST :: FIRE SELECT: eventObject.target.data:'+eventObject.target.data);
        console.log('WORK LIST :: eventObject.target');
        console.log(eventObject.target);
        console.log('WORK LIST :: eventObject');
        console.log(eventObject);

    }

    function D(S) {
        if (A) {
            return;
        }
        Stage.bind("touchmove", m);
        l.copyFrom(a);
        M.copyFrom(S);
        z = true;
    }

    // function m(S) {

    //     x.subVectors(S, M);
        
    //     n.y = l.y + x.y;
    //     a.y = n.y;
    //     if (r.y) {
    //         C.subVectors(S, r);
    //         C.time = Date.now();
    //     }
    //     r.subVectors(S, r);
    //     O = r.y > 0 ? -1 : 1;
    //     r.copyFrom(S);
    // }
    function m(S) {

        x.subVectors(S, M);
        
        n.y = l.y + x.y;
        a.y = n.y;
        if (r.y) {
            C.subVectors(S, r);
            C.time = Date.now();
        }
        r.subVectors(S, r);
        O = r.y > 0 ? -1 : 1;
        r.copyFrom(S);
    }

    function u(S) {

        Stage.unbind("touchmove", m);
        
        z = false;
        
        if (C.y) {
        
            C.divide((Date.now() - C.time) || 1);
        
            if (Math.abs(C.y) > 20) {
        
                C.multiply(0.1);
        
            }
        
            if (Mobile.os != "Android") {
        
                n.y += C.y * FEDevice.VELOCITY_MULTIPLIER;
        
            }
        }
        x.clear();
        M.clear();
        r.clear();
        C.clear();
    }

    // function _setScrollPosition(userScrollAmount)
    // userScrollAmount = pretty sure it's the literal scroll value from the device
    // function _setScrollPosition(userScrollAmount) {
    //     if (A) {
    //         return;
    //     }
    //     if (Math.abs(n.y - a.y) < 1000) {
    //      // n.y is amount the element will move?
    //         n.y -= userScrollAmount * 2;
    //     }
    // }

    function _setScrollPosition(userScrollAmount) {
        if (A) {
            return;
        }

        if (Math.abs(n.y - a.y) < 1000) {
            // n.x is amount the element will move
            n.y -= userScrollAmount * 2;
        }
    }

    

    function _positionItems(V) {

        //console.log('=======================');
        //console.log('_positionItems(V) FROM WORK LIST: '+V);
        //console.log(V);
        //console.log('=======================');

        if (A) {
            return i = true;
        }
        var S = MathUtil.getSliceHeight();
        var sliceWidth = MathUtil.getSliceWidth();

        H();
        
        // loop through list items and apply size and position
        for (var T = 0; T < _items.length; T++) {
            var workListItem = _items[T];
        
            //workListItem.resize(S, q ? T : null);
            //workListItem.position((S * 0.58) * T, q ? T : null);
            
            workListItem.resize(S, q ? T : null);
            workListItem.positionY((S * _spacing) * T, q ? T : null);
        }

        // set margin on first item?
        Q = _items[1].y - _items[0].y;
        
        for (T = 0; T < _items.length; T++) {
            _items[T].setMargin(Q);
        }

        q = true;
        k = true;
        clearTimeout(L);
        L = setTimeout(function () {
            k = false;
            s();
        }, 250);
        
        _positionCubeBackgrounds();
    }

    this.resume = function () {
        j = true;
        // Global.BORDER.showBottom();
        if (t && Global.CURRENT_PAGE.target != t) {
            t.resume(true);
        }
        if (i || Global.CURRENT_PAGE.target != t || h) {
            p();
        }
        if (!Device.mobile) {
            _elem.show();
        } else {
            _elem.css({
                top: 0
            });
        }

        h = false;

        _moveContainer();

        j = false;

        if (FEDevice.PERFORMANCE > 0) {

            _detailOpenAnim(Global.CURRENT_PAGE.target, false);
            
            _el.tween({
            
                // y: _el.oY
                y: _el.oY
            
            }, Global.CURRENT_PAGE.transition.time * 0.7, Global.CURRENT_PAGE.transition.ease);

        } else {
            
            _el.transform({
            
                // x: 0
                y: 0
            
            });
            
            if (!Device.mobile) {
            
                _elem.show();
            
            }
        }
        for (var S = 0; S < _items.length; S++) {
            var T = _items[S];
            if (T != Global.CURRENT_PAGE.target) {
                T.resumeText();
                T.resume();
            } else {
                T.resumeText(true);
            }
            T.y = T.oY;
            // T.x = T.oY;
            if (FEDevice.PERFORMANCE > 0) {
                T.tween({
                    y: T.y
                    // x: T.x
                }, Global.CURRENT_PAGE.transition.time * 0.7, Global.CURRENT_PAGE.transition.ease);
            } else {
                T.positionY(T.y, 0);
                // T.positionX(T.x, 0);
            }
        }
        _self.delayedCall(function () {
            if (FEDevice.PERFORMANCE > 0) {
                for (var U = 0; U < _items.length; U++) {
                    _items[U].element.stopTween();
                }
            } else {
                s();
            }
            Global.CAN_CLICK = true;
            A = false;
            Render.startRender(_moveContainer);
            Global.CURRENT_PAGE.target.resumeActive();
        }, FEDevice.PERFORMANCE > 0 ? Global.CURRENT_PAGE.transition.time : 1);

        s();

        Global.CAN_CLICK = true;
        A = false;
        Render.startRender(_moveContainer);
        Global.CURRENT_PAGE.target.resumeActive();
    };
    
    this.openDeeplink = function (T) {
        
        

        _self.delayedCall(function () {
            
            for (var S = 0; S < _items.length; S++) {
                
                // items data
                if (_items[S].data == T) {
                    console.log('===========================');
                    console.log('_items[S].data');
                    console.log(_items[S]);
                    console.log(_items[S].data);
                    console.log(Global.CURRENT_PAGE);
                    // console.log(_glpg);
                    console.log('===========================');

                    _clickEvents({
                        target: _items[S]
                    }, true);

                    Global.CURRENT_PAGE.loadBackground(_items[S].data, _items[S].num);
                    Global.CURRENT_PAGE.bgresize();
                }
            }
        }, 500);        
    };
    function _hoverSlice(state) {
        for (var i = 0; i < _items.length; i++){
            if (_items[i].num == _self.lastHovered){
                switch (state){
                    case "over":
                    _items[i].over();
                    break;

                    case "out":
                    _items[i].out();
                    break;
                }

                return;
            }
        };
    } 
    // state(string) = "over" or "out"
    this.hoverSlice = function(_state){
        //console.log("WorkList hoverSlice");
        //console.log(_self.lastHovered);
        //console.log(state);
        _hoverSlice(_state);
        // for (var i = 0; i < _items.length; i++){
        //     if (_items[i].num == _self.lastHovered){
        //         switch (state){
        //             case "over":
        //             _items[i].over();
        //             break;

        //             case "out":
        //             _items[i].out();
        //             break;
        //         }

        //         return;
        //     }
        // };
    };

    this.destroy = function () {
        Render.stopRender(_moveContainer);
        return this._destroy();
    };
});
Class(function WorkListItem(work_item, index) {
    // work_image = the image source URL

    Inherit(this, View);
    
    // var o = this;
    var _self = this;
    // var f;
    var _elem;
    var _container, _hover, _playButton, _topHit, _bottomHit, new_fullBg;
    var e, margin, c, s; // e is the tint overlay, c is the halftone overlay
    var g, _text, preventHover = false; // g is video, text is text overlay
    // _self.parent._touchIncrement = -1;

    this.y = 0;
    this.active = true;
    this.data = work_item.main_image[0].urlPath;
    this.num = work_item.num;
    this.visible = true;
    
  //   this.dataCollection = {

		// title: Data.WORK.getData()[index].name,
		// image: work_image,
		// director: (Data.WORK.getData()[index].director !== null && typeof Data.WORK.getData()[index].director !== 'undefined') ? Data.WORK.getData()[index].director : 'director',
		// client: (Data.WORK.getData()[index].client !== null && typeof Data.WORK.getData()[index].client !== 'undefined') ? Data.WORK.getData()[index].client : 'network',
		// content: (Data.WORK.getData()[index].content !== null && typeof Data.WORK.getData()[index].content !== 'undefined') ? Data.WORK.getData()[index].content : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

  //   };

    // TO DO: MOVE THIS TO WORK MODEL
    this.dataCollection = {

        title: work_item.name,
        image: work_item.main_image[0].urlPath,
        director: (work_item.director !== null && typeof work_item.director !== 'undefined') ? work_item.director : '',
        client: (work_item.client !== null && typeof work_item.client !== 'undefined') ? work_item.client : '',
        main_category: (work_item.main_category !== null && typeof work_item.main_category !== 'undefined') ? Utils.urlstr(work_item.main_category) : '',
        content: (work_item.excerpt !== null && typeof work_item.excerpt !== 'undefined') ? work_item.excerpt : ''

    };
    
    (function () {

        _init();
        _initSlice();

        _addText();
        _addPlayButton();
    })();

    function _init() {
        /*console.log('===========================================');
        console.log('WORK LIST ITEM: init() - GLOBAL PARAMETER work_image is: ');
        console.log(work_image);
        console.log('===========================================');*/

        _elem = _self.element;
        
        _elem.transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW
        }).css({
            overflow: "hidden",
            outline: "1px solid transparent"
        });
        
        _container = _elem.create("container");
        _container.transform({
            //skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW,
            outline: "1px solid transparent"
        }).css({
            overflow: "hidden"
        });

        margin = _elem.create("margin");
        // margin.size("100%", 50).css({
        margin.size("100%", "3px").css({
            overflow: "hidden",
        }).setZ(1000);

        // create halftone overlay
        _halftone = _elem.create(".halftone");
        _halftone.size("100%").bg(Config.IMAGES + "work/halftone.png").setZ(6);
        
        // create tint overlay
        _tint = _elem.create("overlay");
        _tint.size("100%").bg(Config.COLORS.black).css({
            opacity: 0.45
        }).setZ(7);

        margin.bg = margin.create("bg");
        margin.bg = margin.bg.size("100%").bg(Config.COLORS.black).css({
            outline: "1px solid transparent"
        }).setZ(2000);
        // create initial background
        // for (var ii in _dataSet) {

        //     for ( var j = 0; j < _dataSet[ii].main_image.length; j++ ) {

        //         if (_dataSet[ii].main_image[j]) {

                    // console.log( _dataSet[ii].main_image[j].urlPath );
                    

        //             return;

        //         }
        //     }
        // }
        _loadBackground( work_item.main_image[0].urlPath, index);
        _self.events.subscribe(FlipEvents.RESIZE, _positionBackground);

    }

    function _initSlice() {
        //background: -moz-linear-gradient(top,  rgba(81,235,228,0.54) 0%, rgba(65,223,211,1) 33%, rgba(34,201,181,1) 100%); /* FF3.6+ */
        //background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(81,235,228,0.54)), color-stop(33%,rgba(65,223,211,1)), color-stop(100%,rgba(34,201,181,1))); /* Chrome,Safari4+ */
        //background: -webkit-linear-gradient(top,  rgba(81,235,228,0.54) 0%,rgba(65,223,211,1) 33%,rgba(34,201,181,1) 100%); /* Chrome10+,Safari5.1+ */
        //background: -o-linear-gradient(top,  rgba(81,235,228,0.54) 0%,rgba(65,223,211,1) 33%,rgba(34,201,181,1) 100%); /* Opera 11.10+ */
        //background: -ms-linear-gradient(top,  rgba(81,235,228,0.54) 0%,rgba(65,223,211,1) 33%,rgba(34,201,181,1) 100%); /* IE10+ */
        //background: linear-gradient(to bottom,  rgba(81,235,228,0.54) 0%,rgba(65,223,211,1) 33%,rgba(34,201,181,1) 100%); /* W3C */
        //filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#8a51ebe4', endColorstr='#22c9b5',GradientType=0 ); /* IE6-9 */

        // create the hover overlay
        //var gradient = "";
        //var box_shadow = "";
        
        // gradient based on browser
        /*if (Device.vendor !== ""){
            gradient = "-"+Device.vendor+"-linear-gradient(top,  rgba(81,235,228,0.54) 0%,rgba(65,223,211,1) 33%,rgba(34,201,181,1) 100%)";
        }else{
            gradient = "linear-gradient(to bottom,  rgba(81,235,228,0.54) 0%,rgba(65,223,211,1) 33%,rgba(34,201,181,1) 100%)";
        }*/
        
        _hover = _container.create("hoveroverlay");
        _hover.size("100%", 0).css({
            background: Config.COLORS.slicegradient,
            bottom: 0
        });
        
        
        // box shadow based on browser
        switch (Device.vendor){
            case "moz":
            _hover.css({
                mozBoxShadow: Config.COLORS.sliceinnerglow
            });
            break;
            
            case "webkit":
            _hover.css({
                webkitBoxShadow: Config.COLORS.sliceinnerglow
            });
            break;
            
            case "ms":
            case "o":
            _hover.css({
                boxShadow: Config.COLORS.sliceinnerglow
            });
            break;
            
            default:
            _hover.css({
                boxShadow: Config.COLORS.sliceinnerglow
            });
            break;
        }
       
        // not sure what cover is or how it's related to performance
        /*if (FEDevice.PERFORMANCE > 0 && (Global.LAB || Device.mobile)) {
            _hover.cover = _hover.create("cover");
            // _hover.cover.size("100%").bg(Config.COLORS.branding).transform({
            _hover.cover.bg(Config.COLORS.branding).transform({
                z: 1
            }).setZ(9).css({
                // BG OPACITY
                // opacity: 0
                opacity: 1
            });
        }*/
        
        if (FEDevice.PERF_TIME > 0 || (Mobile.os == "Android" && Mobile.browser == "Chrome")) {
            // _initAltSlice();
        }
        
        /*e = _elem.create("overlay");
        e.bg(Config.IMAGES + "work/overlay.png").css({
        // e.bg(Config.IMAGES + "work/black.jpg").css({
            opacity: 0.3
        }).setZ(2).transform({
            z: 1
        });*/
        /*c = _elem.create(".halftone");
        c.size("100%").bg(Config.IMAGES + "work/halftone.png").setZ(2).transform({
            z: 1
        });*/
        // :: WorkListItemVideo
        // g = _self.initClass(WorkListItemVideo, work_image, null);
        // _hover.add(g);
        // s = _elem.create(".gradient");
        // s.size("100%").css({
        //     width: 800
        // }).bg(Config.IMAGES + "work/gradient.png").setZ(2).transform({
        //     z: 1
        // });
        // _self.bg = _hover;
        
    }
    function _loadBackground(_img, _ind) {

        new_fullBg = _elem.create("fullbg").css({
            opacity: 0
        });

        new_fullBg.css({
            background: ""
        }).setZ(5);

        new_fullBg.canvas = _self.initClass(Canvas, Stage.width, Stage.height, null);
        new_fullBg.add(new_fullBg.canvas);

        new_fullBg.texture      = new Image();
        new_fullBg.texture.src  = FEDevice.getAsset(_img, "jpg");

        new_fullBg.index = _ind;

        new_fullBg.texture.onload = function () {

            _bgIsSet = true;

            new_fullBg.canvas.context.drawImage(new_fullBg.texture, 0, 0);
            _positionBackground();

            new_fullBg.tween({
                opacity: 1
            }, 800, 'easeOutQuad', null, _self.destroyBG);

        };
    }

    function _positionBackground() {

        // TODO: FIGURE OUT ASPECT AND SET IT FOR OUR IMAGES
        var _wdth       = ~~ (FEDevice.width * 1.15);
        var _hght       = ~~ (_wdth * Config.ASPECT);

        if (_hght < Stage.height) {
            _hght   = Stage.height * (Mobile.os == "Android" ? 1.2 : 1);
            _wdth   = _hght / Config.ASPECT;
        }

        _wdth       = ~~_wdth;
        _hght       = ~~_hght;

        new_fullBg.canvas.size(_wdth, _hght);
        new_fullBg.canvas.context.drawImage(new_fullBg.texture, 0, 0, _wdth, _hght);

        // console.log('HOME :: _positionBackground(): new_fullBg: '+new_fullBg);
        // console.log(new_fullBg);
        // console.log(Mobile.os);
        // console.log(Mobile)


        // USED TO HELP CENTER
        // if (Mobile.os == "iOS") {
        //     new_fullBg.object.center();
        // } else {
        // new_fullBg.css({
        //     top: Stage.height / 2 - _hght / 2,
        //     left: FEDevice.width / 2 - _wdth / 2
        // });
        new_fullBg.css({
            top: Stage.height / 2 - _hght / 2,
            left: FEDevice.width / 2 - _wdth / 2
        }).transform({
            y: 0,
        });
        // }

    }
    // create canvas and adds slice background image
    // unused in this application
    // function _initAltSlice() {
    //     /*console.log('===================================');
    //     console.log('WORK LIST ITEM: _initAltSlice()');
    //     console.log('Draws canvas, gets jpg');
    //     // console.log(work_image)
    //     // console.log(_hover)
    //     console.log('===================================');*/

    //     _hover.css({
    //         background: ""
    //     });
    //     _hover.canvas = _self.initClass(Canvas, 100, 100, null);
    //     _hover.add(_hover.canvas);
    //     _hover.texture = new Image();
    //     _hover.texture.src = FEDevice.getAsset(work_item.main_image[0].urlPath, "jpg");

    //     _hover.texture.onload = function () {
    //         // B LOADED!
    //         // _hover.canvas.context.drawImage(_hover.texture, 0, 0, _hover.width, _hover.height);
    //         _hover.canvas.context.drawImage(_hover.texture, 0, 0);
    //     };
    // }

    function _addText() {
        // _text = _self.initClass(WorkListItemText, _self.dataCollection);
        // _text.element.interact(_hoverActions, _clickDetailActions);
    }

    function _hoverActions(mouseevent){
        if (Device.mobile) {
            // no hover on touch devices
            return;
        }
        
        if (preventHover === true || !_self.visible) {
            return false;
        }
        
        if (mouseevent.action == "over"){
            if (_self.parent.lastHovered != index){
                if (_self.parent.lastHovered !== false){
                    // trigger out state of previous slice
                    _self.parent.hoverSlice("out");
                }

                // trigger over state of current slice
                _self.parent.lastHovered = index;
                _self.parent.hoverSlice("over");
            }
        }
    }

    function _clickDetailActions(){
        // CURRENTLY DISABLE FOR CLIENT
        // WHILE WE'RE IN DEV
        // alert('Click to detail still in development');
        // return;
        console.log('=============================');
        console.log('WorkListItem ::');
        console.log('_initClickActions():');
        console.log(work_item.main_image[0].urlPath);
        console.log('=============================');

        if (Device.mobile) {
            
            
            // if (!_touchIncrement){
                console.log('WORK LIST ITEM :: index: ' + index);
                console.log('WORK LIST ITEM :: _touchIncrement: ' + _self.parent._touchIncrement);
                console.log(_self);
                
                

                if (_self.parent._touchIncrement != index) {

                    if (_self.parent.lastHovered !== false){
                        // trigger out state of previous slice
                        _self.parent.hoverSlice("out");
                        _self.parent._touchIncrement = -1;

                    }

                    // trigger over state of current slice
                    _self.parent.lastHovered = index;
                    _self.parent.hoverSlice("over");

                    

                    // console.log(index)

                    _self.parent._touchIncrement = index;

                    return;
                }

            /*} else {
                _touchIncrement = 0;
            }*/
            
        }

        

        
        if (!Global.CAN_CLICK) {
            return false;
        }
        preventHover = true;

        _self.events.fire(FlipEvents.CLICK, {
            data: work_item.main_image[0].urlPath,
            target: _self
        });

        if (FEDevice.PERFORMANCE > 0) {
            // _text.hide();
            if (!Device.mobile && !Device.browser.safari) {
                // BACKGROUND OFF
                _hover.css({
                    opacity: 0
                });
            } else {
                _self.delayedCall(function () {
                    // BACKGROUND OFF
                    _hover.css({
                        opacity: 0
                    });
                }, 100);
            }
        }
        _self.visible = false;
    }

    function _clickPlayActions(){
        _self.events.fire(FEEvents.VIDEO_LOAD, {
            index: index
        });
    }
    
    function _addPlayButton() {
        // _playButton = _self.initClass(WorkListItemPlay);
        // _playButton.element.interact(null, _clickPlayActions);
    }

    this.resize = function (t, u) {
        this.height = t;
        this.barHeight = ~~ (t * 0.56);
        var v = ~~ (FEDevice.width * 1.15);
        var t = ~~ (v * Config.ASPECT);

        if (u && Mobile.tablet && FEDevice.PERFORMANCE === 0) {
            _self.delayedCall(function () {
                _hover.size(v, t - 1).center();
                _elem.size(FEDevice.width, _self.barHeight);
                _container.size(FEDevice.width, _elem.height);
                //e.size(_elem.width, _elem.height);
                if (g) {
                    g.resize(v, t);
                }
                // _text.resize();
                // _playButton.resize();
            }, u * (FEDevice.PERF_TIME ? 50 : 250));
        } else {
            _hover.size(v, t - 1).center();
            _elem.size(FEDevice.width, this.barHeight);
            _container.size(FEDevice.width, _elem.height);
            //e.size(_elem.width, _elem.height);
            if (g) {
                g.resize(v, t);
            }
            // WORK LIST ITEM TEXT REFERENCE
            // _text.resize()
        }
        if (_hover.canvas) {
            _hover.canvas.size(v, t);
            _hover.canvas.context.drawImage(_hover.texture, 0, 0, _hover.width, _hover.height);
        }
        
        
    };
    
    // resize the element by width for vertical slices
    this.resizeWidth = function (width, index) {
    	this.width = width;
        this.barWidth = ~~ (width * 0.56);
        var v = ~~ (FEDevice.height * 1.15);
        var width = ~~ (v * Config.ASPECT);
        
        // if (index && Mobile.tablet && FEDevice.PERFORMANCE === 0) {
        //     _self.delayedCall(function () {
        //         //_hover.size(width - 1, v).center();
        //         _elem.size(_self.barWidth, FEDevice.height);
        //         _container.size(_elem.width, FEDevice.height);
        //         //e.size(_elem.width, _elem.height);
        //         if (g) {
        //             g.resize(width, v);
        //         }

        //         //_topHit.resize();
        //         //_bottomHit.resize();
                
        //         // resize text element
        //         _text.resize(_self.barWidth);
        //         _playButton.resize(_self.barWidth);
        //     }, index * (FEDevice.PERF_TIME ? 50 : 250));
        // } else {
            //_hover.size(width - 1, v).center();
            _elem.size(this.barWidth, FEDevice.height);
            _container.size(_elem.width, FEDevice.height);
            //e.size(_elem.width, _elem.height);
            if (g) {
                g.resize(width, v);
            }

            //_topHit.resize();
            //_bottomHit.resize();
            
            // resize text element
            // _text.resize(_self.barWidth);
            // _playButton.resize(_self.barWidth);
        // }
        if (_hover.canvas) {
            _hover.canvas.size(width, v);
            // THIS SQUISHES THE IMAGE...SO DON'T DO IT
            // _hover.canvas.context.drawImage(_hover.texture, 0, 0, _hover.width, _hover.height)
            _hover.canvas.context.drawImage(_hover.texture, 0.5, 0);
        } 

        
        // if (Global.CURRENT_PAGE.container.children()[index] == index) {
        //     // console.log()    
        //     console.log('Global.CURRENT_PAGE.container.children()[index]');
        //     console.log(Global.CURRENT_PAGE.container.children()[index]);
        
        // }


    };
    
    // position()
    // u = y position
    // t = index?
    this.positionY = function (u, t) {
        _elem.y = this.y = ~~u;
        if (t && Mobile.tablet && FEDevice.PERFORMANCE == 0) {
            _self.delayedCall(function () {
                _elem.transform()
            }, t * (FEDevice.PERF_TIME ? 60 : 300))
        } else {
            _elem.transform();
        }
    };
    
    // set slice's X position for vertical slices
    // this.positionX = function(x_pos, index){
    //     _elem.x = this.x = ~~x_pos;
        
    //     if (index && Mobile.tablet && FEDevice.PERFORMANCE == 0){
    //         _self.delayedCall(function () {
    //             _elem.transform();
    //         }, index * (FEDevice.PERF_TIME ? 60 : 300));
    //     }else{
    //         _elem.transform();
    //     }
    // };

    this.over = function(){
        // slide up hover
        _hover.stopTween().tween({
            height: "100%"
        }, 400, "easeInOutQuad");
        
        Global._timeout = setTimeout(function(){

            // MOVED THIS FUNCTIONALITY TO WORK.JS SO
            // BACKGROUNDS AREN'T MAPPED TO EACH LIST ITEM
            /*console.log('=========================');
            console.log(Global.CURRENT_PAGE);
            console.log(work_item.main_image[0].urlPath);
            console.log(index);
            console.log(work_item.num);
            console.log('=========================');*/

            Global.CURRENT_PAGE.loadBackground(work_item.main_image[0].urlPath, work_item.num);
            Global.CURRENT_PAGE.bgresize();

        }, 600);

        //console.log(_text);
        // trigger text rollover action
        // _text.over();
        
        // trigger play button rollover
        // _playButton.over();
    };

    this.out = function(){
        // slide down hover
        _hover.stopTween().tween({
            height: 0
        }, 300, "easeOutQuad");

        clearTimeout(Global._timeout);

        // trigger text rollover action
        // _text.out();

        // trigger play button rollover
        // _playButton.out();
    };
    
    this.parallax = function (w) {
        /*var t = w + this.y;
        var u = this.height / 2;
        var v = t - (Stage.height / 2);
        _hover.y = v * FEDevice.PARALLAX_MULTIPLIER;
        if (FEDevice.PARALLAX_ITEMS) {
            _hover.transform()
        }*/
    };
    
    // this.getY = function () {
    //     return this.y + _hover.y
    // };
    
    this.getX = function () {
        //return this.x + _hover.x
        return this.x;
    };
    
    this.setMargin = function (u) {
        var t = (u - this.barWidth) + 3;
        margin.size(t, "100%");
        margin.bg.size("100%");
        _elem.size(_elem.width + t, _elem.height);
    };

    // params.openthis = boolean, true if we're opening this one, otherwise we're moving it over
    // params.unskew = boolean, true if we're unskewing everything
    // params.x = integer, how much to move item
    // params.expand = integer, if we're expanding it, the new width of the element
    this.animateOpen = function(params){
        preventHover = true;

        var animTime = Global.CURRENT_PAGE.transition.time*0.4;
        var tweenparams = {
            x: params.x
        };

        if (params.unskew){
            tweenparams.skewX = 0;

            //_text.unskew();
        }

        if (params.openthis){
            tweenparams.width = params.expand;

            _self.delayedCall(function(){
                _self.tween(tweenparams, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);
            }, animTime);

            _container.tween({
                opacity: 0
            }, animTime, Global.CURRENT_PAGE.transition.ease);

            // _text.tween({
            //     opacity: 0
            // }, animTime, Global.CURRENT_PAGE.transition.ease);

            // _playButton.tween({
            //     opacity: 0
            // }, animTime, Global.CURRENT_PAGE.transition.ease);

            _hover.tween({
                opacity: 0
            }, animTime, Global.CURRENT_PAGE.transition.ease);
        }else{
            _self.delayedCall(function(){
                _self.tween(tweenparams, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);
            }, animTime);
        }

        /*if (params.openthis){
            tweenparams.width = params.expand;
            _self.tween(tweenparams, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);

            // tween interior elements
            _container.tween({
                width: tweenparams.width
            }, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);

            _playButton.animateWidth(tweenparams.width);
        }else{
            _self.tween(tweenparams, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);
        }*/
    };

    // params.closethis = boolean, true if we're closing this one, otherwise we're moving it over
    // params.skew = boolean, true if we're skewing everything
    // params.x = integer, how much to move item
    // params.contract = integer, if we're contracting it, the new width of the element
    this.animateClose = function(params){
        var animTime = Global.CURRENT_PAGE.transition.time*0.4;
        var tweenparams = {
            x: params.x
        };

        if (params.skew){
            tweenparams.skewX = (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : Config.SKEW;

            // _text.skew();
        }

        if (params.closethis){
            tweenparams.width = params.contract;
            
            _self.tween(tweenparams, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);
            
            _self.delayedCall(function(){
                _container.tween({
                    opacity: 0
                }, animTime, Global.CURRENT_PAGE.transition.ease);

                // _text.tween({
                //     opacity: 0
                // }, animTime, Global.CURRENT_PAGE.transition.ease);

                _playButton.tween({
                    opacity: 0
                }, animTime, Global.CURRENT_PAGE.transition.ease);

                _hover.tween({
                    opacity: 0
                }, animTime, Global.CURRENT_PAGE.transition.ease);
            }, animTime);
        }else{
            _self.tween(tweenparams, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);
        }

        /*if (params.closethis){
            tweenparams.width = params.contract;
            _self.tween(tweenparams, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);

            // tween interior elements
            _container.tween({
                width: tweenparams.width
            }, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);

            _playButton.animateWidth(tweenparams.width);
        }else{
            _self.tween(tweenparams, Global.CURRENT_PAGE.transition.time, Global.CURRENT_PAGE.transition.ease);
        }*/

        preventHover = false;
    };

    this.disable = function () {
        _hoverActions({
            action: "out"
        });
    };
    this.resume = function (t) {
        if (t) {
            preventHover = false;
            _hover.clearAlpha();
        }
        // g.resume();
        /*e.visible().css({
            opacity: 0.5
        });*/
        _hover.stopTween().visible().clearAlpha();
        if (!Device.mobile) {
            _hover.show();
        }
        _self.visible = true;
    };
    this.resumeText = function (t) {
        if (t) {
            // _text.animateIn()
        } else {
            // _text.show()
        }
    };
    this.resumeActive = function () {
        // g.resume();
        preventHover = false;
        _self.visible = true;
        if (FEDevice.PERFORMANCE > 0) {
            _hover.stopTween().visible().clearAlpha();
            //e.visible();
            if (_hover.cover) {
                _hover.cover.css({
                    opacity: 1
                }).tween({
                    opacity: 0
                }, 300, "easeOutCubic");
            }
            if (Mobile.phone) {
                g.element.css({
                    opacity: 0
                });
            }
            if (FEDevice.width > Stage.height) {
                /*e.css({
                    opacity: 0
                }).tween({
                    opacity: 0.5
                }, 300, "easeOutCubic");*/
                /*c.css({
                    opacity: 0
                }).tween({
                    opacity: 1
                }, 300, "easeOutCubic");*/
                s.css({
                    opacity: 0
                }).tween({
                    opacity: 1
                }, 300, "easeOutCubic");
            } else {
                /*e.css({
                    opacity: 0.5
                });*/
                /*c.css({
                    opacity: 1
                });*/
                s.css({
                    opacity: 1
                });
            }
        } else {
            _hover.stopTween().visible().clearAlpha();
            /*e.css({
                opacity: 0.5
            });*/
            /*c.css({
                opacity: 1
            });*/
            s.css({
                opacity: 1
            });
        }
    };
    this.incoming = function () {
        if (FEDevice.PERFORMANCE > 0) {
            _hover.invisible()
        }
        //e.invisible();
        /*e.css({
            opacity: 0
        });*/
        /*c.css({
            opacity: 0
        });*/
        s.css({
            opacity: 0
        });
    }
});
Class(function LoaderView() {

    Inherit(this, View);

    // PRIVATE GLOBAL VARIABLES    
    var _elem, q, i, b, h, _el;
    // var n
    var _canvas, f, m, a, e;

    var _self   = this;
    // var c       = Device.mobile.phone ? 80 : 140;
    var _ldsz   = Device.mobile.phone ? 80 : 140;
    var g       = 0;
    var k       = 0;


    (function () {
        _init();
        _renderFonts();
        _mainLoader();
        
        Render.startRender(r);
        _self.delayedCall(o, 200);

    })();


    function _init() {

        _elem = _self.element;
        
        _elem.size("100%").css({
            top: Device.mobile ? -10 : -50, 
            opacity: 0.9
        });
        _elem.percent = 0;
        _elem.wrapper = _elem.create(".wrapper");

        // _elem.wrapper.size("100%").bg('red').css({
        _elem.wrapper.size("100%").bg(Config.COLORS.white).css({
            left: "-100%"
        }).setZ(2);

    }

    function _renderFonts() {

        _el = _elem.create(".hidden");

        _el.css({
            opacity: 0
        });


        var w = ["GeomSlab703-ExtraBold", "GeomSlab703-Light", "GeomSlab703-LightItalic", "GeomSlab703-MediumCondensed",
                 "GeomSlab703-BoldCondensed", "GeomSlab703-Medium", "GeomSlab703-MediumItalic", "GeomSlab703-Bold", 
                 "GeomSlab703-BoldItalic", "AvenirLight"];
        for (var u = 0; u < w.length; u++) {
            
            var v = _el.create(".a");
            v.text("a").fontStyle(w[u], 12, "#000");
        }
    }

    function _mainLoader() {

        h = _elem.create(".circle");
        h.radius = _ldsz * 1.8;
        h.size(h.radius * 2, h.radius * 2).center();

        _canvas = _self.initClass(Canvas, h.radius * 2, h.radius * 2, true, null);
        h.addChild(_canvas);

        // CANVAS GRAPHICS, TO DRAW LOADING CIRCLE
        a = _self.initClass(CanvasGraphics, h.radius, h.radius * 2);

        a.anchor = {
            x: 0.5,
            y: 0.5
        };

        a.rotation = 0;
        // a.x = _ldsz * 1.79;
        // a.y = _ldsz * -0.72;
        a.x = -1.15;
        a.y = 1.15;
        a.strokeStyle = Config.COLORS.branding;
        a.lineWidth = h.radius * 0.015;
        _canvas.add(a);

        // 'f' BECOMES THE LOADER IMAGE IN THE CENTER
        f = {};
        f.texture = new Image();
        f.texture.src = Config.IMAGES + "loader/letter.png";

        var w;
        var _ltsz = Device.mobile.phone ? _ldsz + 74 : _ldsz + 124;

        for (var v = 0; v < 2; v++) {

            w = _self.initClass(CanvasTexture, f.texture, _ltsz, _ltsz);

            w.ox = w.x = _canvas.width / 2 - w.width / 2;
            w.oy = w.y = _canvas.height / 2 - w.height / 2;
            w.alpha = 0;
            _canvas.add(w);

            f["t" + v] = w;
            var u = _self.initClass(CanvasGraphics);
            _canvas.add(u);
            u.mask(w);

            u.beginPath();
            if (v === 0) {
                u.moveTo(0, 0);
                u.lineTo(_canvas.width, 0);
                u.lineTo(0, _canvas.height);
            } else {
                u.moveTo(_canvas.width, 0);
                u.lineTo(_canvas.width, _canvas.height);
                u.lineTo(0, _canvas.height);
            }
            u.fill();

            f["m" + v] = u;
        }

        w = _self.initClass(CanvasTexture, f.texture, _ltsz, _ltsz);
        w.x = _canvas.width / 2 - w.width / 2;
        w.y = _canvas.height / 2 - w.height / 2;
        w.visible = false;
        _canvas.add(w);

        f.clean = w;
        _canvas.startRender();
    }

    function r() {
        if (!_self || !a || !a.clear) {
            Render.stopRender(r);
            return false;
        }
        a.clear();
        var w = 0.2;
        if (k > 0.97) {
            w = 0.25;
        }
        k += (g - k) * w;
        if (k >= 0.996) {
            k = 100;
        }
        var v = _self.complete ? 360 : 360 * k;
        a.arc(h.radius, h.radius, v, h.radius/2, 0, false);
        a.stroke();

        // var u = _self.complete ? 180 + 180 : 180 + 180 * k;
        // a.arc(h.radius, h.radius, u, h.radius / 2, 180, false);
        // a.stroke();
    }
    function o() {
        // ALL RELATED TO LOADER LOGO IN CENTER 'f'

        var v = f.t0;
        var u = f.t1;
        v.alpha = 0;
        u.alpha = 0;
        v.y += 40;
        v.x -= 40;
        u.y -= 40;
        u.x += 40;

        TweenManager.tween(v, {
            alpha: 1,
            x: v.ox,
            y: v.oy
        }, 500, "workOpen");

        TweenManager.tween(u, {
            alpha: 1,
            x: v.ox,
            y: v.oy
        }, 500, "workOpen", 20);

        _self.delayedCall(function () {
            f.clean.visible = true;
            v.visible = false;
            u.visible = false;
        }, 550);
    }
    this.update = function (u) {
        g = u;
    };
    this.move = function () {
        _elem.tween({
            y: 100,
            opacity: 0
        }, 500, "workOpen", 75);
    };
    this.fade = function () {
        _elem.tween({
            opacity: 0
        }, 3000, "easeOutCubic");
    };
    this.destroy = function () {
        // console.log('DESTROY');
        Render.stopRender(r);
        _canvas.stopRender();
        return _self._destroy();
    }
});
Class(function TopBarNav(_ht) {
    Inherit(this, View);
    // var g = this;
    var _self = this;
    var _hght = _ht;

    // var j;
    var _elem, _items;
    var k, b;
    (function () {
        _markup();
        _loadNavi();
        // _animateMarkup();
        _eventPageChange();
        _onPageChange();
        _onResize();
        // _self.delayedCall(function () {
        _animateMarkup();
        // }, 200);

    })();

    function _markup() {

        
        _elem = _self.element;
        _elem.css({
            // height: _hght - 213,
            height: 20,
            width: 360,
            // top: Device.mobile.phone ? 180 : 225,
            top: Device.mobile.phone ? 20 : 68,
            // left: 120,
            left: Stage.width - 330,
            opacity: 0,
            // border: '1px solid red',
            overflow: "hidden"
        });
        // console.log('HEIGHT: '+ _hght - 70)
        // _elem.transform({
        //     skewY: Config.SKEW
        // }).transformPoint(0, 0);

        // var m = _elem.create(".line");
        // m.size(85, 1).bg(Config.COLORS.branding).center(1, 0).css({
        //     top: 10,
        //     opacity: 0.5
        // });

        // if (Mobile.os == "iOS") {
        //     m.size(85, 0).css({
        //         borderTop: "1px solid" + Config.COLORS.branding
        //     });
        // }
    }

    function _loadNavi() {
        // PAGES NOW SET IN CONFIG
        // var _pages = ["about", "work", "case studies", "contact"];
        // var _pages = [];
        var _pages = Config.NAV;

        // console.log(Config.NAV)
        var x = 0;
        _items = [];

        for (var i = 0; i < Config.NAV.length; i++) {
            // console.log(Config.NAV[i].type)
            // _pages.push(Config.NAV[i].type);
            var _item = _self.initClass(TopBarNavItem, Config.NAV[i].type, i);
            _item.events.add(FlipEvents.CLICK, _clickActions);
            _item.events.add(FlipEvents.HOVER, _hoverActions);
            
            // console.log(Config.NAV[i].width);

            _item.css({
                // top: 3 * 43 + (_pages[i] == "contact" ? 40 : 0)
                top: 0,
                width: Config.NAV[i].width,
                height: 17,
                left: x,
                // border: '1px solid blue'
            });

            x += Config.NAV[i].width + 20;

            _items[Config.NAV[i].type] = _item;
        }
    }

    function _animateMarkup() {
        _elem.tween({
            left: Stage.width - 380,
            opacity: 1
        }, 600, "easeOutSine")
    }

    function _onResize() {
        _self.events.subscribe(FlipEvents.RESIZE, _repositionNav);
    }

    function _eventPageChange() {
        _self.events.subscribe(FEEvents.PAGE_CHANGE, _onPageChange);
    }

    function _repositionNav() {
        // console.log('hi')
        _elem.css({
            left: Stage.width - 380,
        })
    }

    function _hoverActions(p) {

        switch (p.action) {
            case "over":

                var m = p.index < b ? -1 : 1;
                _items[p.text].over(m);
                b = p.index;

                break;
            case "out":
                var o = 0;
                for (var n in _items) {
                    var m = o < b ? -1 : 1;
                    if (_items[p.text].hovered && !_items[p.text].active) {
                        _items[p.text].out(m);
                    }
                    o++;
                }
                break;
        }

    }

    function _clickActions(m) {
        // if (m.text == "contact") {

        //     if (!Global.CONTACT_OPEN) {
        //         _self.events.fire(FEEvents.TOGGLE_CONTACT, {
        //             open: true
        //         });
        //     }
        // } else {
        //     g.events.fire(FEEvents.NAV_SELECT, {
        //         type: m.text,
        //         index: m.index + 1
        //     });
        // }
    }

    function _onPageChange() {

        var m = _items[Data.STATE.page];
        if (m) {
            if (m !== k) {
                if (k) {
                    k.deactivate();
                }
                k = m;
                k.activate();
            }
        } else {
            if (k) {
                k.deactivate();
            }
            k = null;
        }
    }
    // this.resize = function() {
    //     _resizeEvent()
    // }
    this.animateIn = function () {
        // _elem.
    };
    this.release = function () {
        for (var m in _items) {
            // console.log(this);
            _items[m].release();
        }
    }
});
Class(function TopBarNavItem(h, j) {
    Inherit(this, View);
    // var f = this;
    var _self = this;
    // var i;
    var _elem;
    // var a;
    var _roll;
    var k, l;
    (function () {
        _initMarkup();
        _textMarkup();
        // c();
        _initInteract()
    })();

    function _initMarkup() {
        // console.log('h')
        // console.log(h)
        // console.log('j')
        // console.log(j)
        // console.log(Config.NAV[j].width);
        _elem = _self.element;
        _elem.css({
            width: Config.NAV[j].width,
            overflow: 'hidden',
            // border: '1px solid red',
            // opacity: .8

        });

        _roll = _elem.create(".bg");
        _roll.size("100%").bg(Config.COLORS.white).css({
            opacity: 0.8,

        }).transform({
            y: -20
        });
    }

    function _textMarkup() {

        k = _elem.create(".text");
        k.fontStyle("GeomSlab703-Medium", 14, Config.COLORS.black);
        // k.size(200, 30).css({
        k.css({
            // color: 'white',
            // border: '1px solid green',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: Config.NAV[j].width,
            textAlign: 'center'
            // cssPadding: '4'
        // }).bg(Config.IMAGES + "sidebar/nav/" + h + "-off.png");
        });

        k.text(h.toUpperCase());
        // console.log(h)

        // console.log('NAV: ' + _spac)
    }

    function _initInteract() {
        _elem.interact(_hoverActions, _clickActions);
    }

    function _hoverActions(n) {
        if (!_self.active) {

            // console.log(n.action);
            // console.log(j);
            // console.log(h);

            _self.events.fire(FlipEvents.HOVER, {
                action: n.action,
                index: j,
                text: h
            })
        }
    }

    function _clickActions() {
        console.log(j, h)
        if (h.toUpperCase() == Global.PAGE && Global.DETAIL_OPEN) {
            _self.events.fire(FEEvents.CLOSE_DETAIL)
        }
        // if (!_self.active || h.toLowerCase() == "contact") {

        if (!_self.active) {
            _self.events.fire(FEEvents.NAV_SELECT, {
                type: Utils.urlstr(h.toLowerCase()),
                index: j
            })
        }


    }

    this.over = function (n) {
        // console.log('OVER: '+_self)
        // console.log(_self)
        // console.log(this)
        // console.log(n);
        // console.log(_self.index);
        _self.hovered = true;

        k.tween({
            color: Config.COLORS.branding
        }, 500, "easeOutSine", 200);
        
        _roll.stopTween().transform({
            y: -20
        }).tween({
            y: 0
        }, 400, "easeInQuart");
    };
    this.out = function (n) {
        _self.hovered = false;

        k.tween({
            color: Config.COLORS.black
        }, 500, "easeOutSine");

        _roll.stopTween().transform({
            y: 0
        }).tween({
            y: 20
        }, 300, "easeOutQuart");
    };
    this.activate = function () {
        _self.active = true;
        // l.stopTween().transform({
        //     x: -225
        // }).tween({
        //     x: 0
        // }, 600, Device.mobile ? "easeInOutQuart" : "workSlice", 10);
        // l.inner.stopTween().transform({
        //     x: 225
        // }).tween({
        //     x: 0
        // }, 600, Device.mobile ? "easeInOutQuart" : "workSlice", 10);
    };
    this.deactivate = function () {
        _self.active = false;
        // k.fontStyle("OpenSansSemi", 12, Config.COLORS.branding);
        // l.tween({
        //     x: 225
        // }, 600, "workSlice");
        // l.inner.tween({
        //     x: -225
        // }, 600, "workSlice");
        // k.tween({
        //     opacity: 0.6
        // }, 300, "easeOutSine");
        // a.tween({
        //     x: 225
        // }, 600, "workSlice");
        // _self.delayedCall(function () {
        //     if (f.active) {
        //         return;
        //     }
        //     l.stopTween().transform({
        //         x: -225
        //     });
        //     l.inner.stopTween().transform({
        //         x: 225
        //     });
        //     a.stopTween().transform({
        //         x: -225
        //     })
        // }, 800)
    };
    _self.lock = function () {};
    _self.release = function () {
        i.hit.show();
    };
    this.animateIn = function () {}
});
Class(function TopBarLogo() {
    Inherit(this, View);
    var _self = this;
    var _elem, _imge;
    // var a;
    var g;
    var j, q, c, e;
    // var b = 44;
    (function () {
        _initMarkup();
        _self.delayedCall(function() {
            _animateMarkup();
        }, 100)
        
        // h();
        // o();
        _initInteract();
        // j.startRender()
    })();

    function _initMarkup() {
        // console.log('TOP BAR LOGO!!')
        _elem = _self.element;
        // d.size(90, 90).center(1, 0).css({

        var logoWidth = 156;
        var logoHeight = 72;
        if (Device.mobile.phone){
            // logosize = 68;
        }

        _elem.size(logoWidth, logoHeight).css({
            top: 10,
            left: -30,
            opacity: 0,
        });
        

        _imge = _elem.create(".bg");
        _imge.size(logoWidth, logoHeight).bg(Config.IMAGES + "common/logo.png");
    }
    
    function _animateMarkup() {
        _elem.tween({
            left: Device.mobile.phone ? 10 : 20,
            opacity: 1,
        }, 600, 'easeOutSine');
    }
    // function h() {
    //     g = d.create(".circle");
    //     g.radius = b * 1.8;
    //     g.percent = 0;
    //     g.isIn = true;
    //     g.size(g.radius * 2, g.radius * 2).center();
    //     j = p.initClass(Canvas, g.radius * 2, g.radius * 2, true, null);
    //     g.addChild(j);
    //     c = p.initClass(CanvasGraphics, g.radius, g.radius * 2);
    //     c.anchor = {
    //         x: 0.5,
    //         y: 0.5
    //     };
    //     c.rotation = 45;
    //     c.x = b * 1.79;
    //     c.y = b * -0.72;
    //     c.lineWidth = g.radius * 0.07;
    //     j.add(c);
    //     q = p.initClass(CanvasGraphics, g.radius, g.radius * 2);
    //     q.anchor = {
    //         x: 0.5,
    //         y: 0.5
    //     };
    //     q.rotation = 45;
    //     q.x = b * 1.79;
    //     q.y = b * -0.72;
    //     q.lineWidth = g.radius * 0.07;
    //     j.add(q);
    //     f()
    // }

    // FOR ROLLOVER ANIMATION
    // function o() {
    //     e = {};
    //     e.texture = new Image();
    //     e.texture.src = Config.IMAGES + "loader/letter.png";
    //     for (var t = 0; t < 2; t++) {
    //         var u = p.initClass(CanvasTexture, e.texture, b, b);
    //         u.ox = u.x = j.width / 2 - u.width / 2;
    //         u.oy = u.y = j.height / 2 - u.height / 2;
    //         u.alpha = 0;
    //         j.add(u);
    //         e["t" + t] = u;
    //         var s = p.initClass(CanvasGraphics);
    //         j.add(s);
    //         s.mask(u);
    //         s.beginPath();
    //         if (t == 0) {
    //             s.moveTo(0, 0);
    //             s.lineTo(j.width, 0);
    //             s.lineTo(0, j.height)
    //         } else {
    //             s.moveTo(j.width, 0);
    //             s.lineTo(j.width, j.height);
    //             s.lineTo(0, j.height)
    //         }
    //         s.fill();
    //         e["m" + t] = s
    //     }
    //     u = p.initClass(CanvasTexture, e.texture, b, b);
    //     u.x = j.width / 2 - u.width / 2;
    //     u.y = j.height / 2 - u.height / 2;
    //     u.visible = false;
    //     j.add(u);
    //     e.clean = u
    // }

    // FOR ROLLOVER ANIMATION
    // function n() {
    //     var t = e.t0;
    //     var s = e.t1;
    //     t.visible = true;
    //     s.visible = true;
    //     a.hide();
    //     t.alpha = 0;
    //     s.alpha = 0;
    //     t.y += 10;
    //     t.x -= 10;
    //     s.y -= 10;
    //     s.x += 10;
    //     TweenManager.tween(t, {
    //         alpha: 1,
    //         x: t.ox,
    //         y: t.oy
    //     }, 500, "workOpen");
    //     TweenManager.tween(s, {
    //         alpha: 1,
    //         x: t.ox,
    //         y: t.oy
    //     }, 500, "workOpen", 20);
    //     p.delayedCall(function () {
    //         t.visible = false;
    //         s.visible = false;
    //         a.show()
    //     }, 520)
    // }

    // FOR ROLLOVER ANIMATION
    // function f() {
    //     c.clear();
    //     c.strokeStyle = g.isIn ? Config.COLORS.branding : Config.COLORS.white;
    //     c.arc(g.radius, g.radius, 360, g.radius / 2, 0, false);
    //     c.stroke();
    //     q.clear();
    //     var t = 180 * g.percent;
    //     q.strokeStyle = g.isIn ? Config.COLORS.white : Config.COLORS.branding;
    //     q.arc(g.radius, g.radius, t, g.radius / 2, 0, false);
    //     q.lineWidth = g.isIn ? g.radius * 0.1 : g.radius * 0.07;
    //     q.stroke();
    //     var s = 180 + 180 * g.percent;
    //     q.arc(g.radius, g.radius, s, g.radius / 2, 180, false);
    //     q.stroke()
    // }

    // function k() {}

    function _initInteract() {
        _elem.interact(_hoverActions, _clickActions);
    }

    function _hoverActions(mouseevent) {
        // we don't need no hover actions
        // we don't need no mouse control

        /*switch (mouseevent.action) {
        case "over":
            n();
            g.isIn = true;
            g.percent = 0;
            TweenManager.tween(g, {
                percent: 1
            }, 300, "easeOutCubic", 0, function () {
                g.isIn = false;
                g.percent = 0;
                TweenManager.tween(g, {
                    percent: 1
                }, 400, "easeInOutQuart", 0, null, f)
            }, f);
            break;
        case "out":
            break
        }*/
    }

    function _clickActions() {
        // if (Data.STATE.deep) {
        //     _self.events.fire(FEEvents.NAV_SELECT, {
        //         type: "home"
        //     });
        // }
        // if (!Global.HOME) {

        //     _self.events.fire(FEEvents.NAV_SELECT, {
        //         type: "home"
        //     });
        // }
    }
    this.animateIn = function () {}
});
Class(function FullscreenBackground() {

    Inherit(this, View);
    
    var _self = this;
    var _elem, _bckg, _hdln, _cont, _play; 
    var new_fullBg, _halftone, _tint, _pcon;
    var i;
    (function () {
        _markup();
        // _animateIn();
        _onResize();
        _getChildren();
        // _getContent();
        // _getChildren01();
        // _getChildren02()
    })();

    function _markup() {
        _elem = _self.element;
        _elem.size(Stage.width, Stage.height).css({
            // opacity: 0,
            // border: '1px solid blue'
            background: Config.COLORS.grey
        }).setZ(100);

        // create halftone overlay
        _halftone = _elem.create("halftone");
        _halftone.size("100%").bg(Config.IMAGES + "work/halftone.png").setZ(6);
        
        // create tint overlay
        _tint = _elem.create("overlay");
        _tint.size("100%").bg(Config.COLORS.black).css({
            opacity: 0.25
        }).setZ(7);

        //  f.transform({
        //     skewX: Config.SKEW
        // }).transformPoint(0, 0);
        // console.log('HOME VIDEO BG:')
    }

    function _getChildren() {
        var _data = Data.WORK.getData();
        // console.log(_data);

        _loadBackground(_data[0].featured_images[1].urlPath, 0);
        _positionBackground();
    }

    
    
    function _positionBackground() {

        // TODO: FIGURE OUT ASPECT AND SET IT FOR OUR IMAGES
        var _wdth       = ~~ (FEDevice.width * 1.15);
        var _hght       = ~~ (_wdth * Config.ASPECT);

        if (_hght < Stage.height) {
            _hght   = Stage.height * (Mobile.os == "Android" ? 1.2 : 1);
            _wdth   = _hght / Config.ASPECT;
        }

        _wdth       = ~~_wdth;
        _hght       = ~~_hght;

        new_fullBg.canvas.size(_wdth, _hght);
        new_fullBg.canvas.context.drawImage(new_fullBg.texture, 0, 0, _wdth, _hght);

        // USED TO HELP CENTER
        // if (Mobile.os == "iOS") {
        //     new_fullBg.object.center();
        // } else {
            new_fullBg.css({
                top: Stage.height / 2 - _hght / 2,
                left: FEDevice.width / 2 - _wdth / 2
            }).transform({
                y: 0,
            });
        // }

    }

    function _loadBackground(_img, _ind) {
        new_fullBg = _elem.create("fullbg").css({
            opacity: 0
        });

        new_fullBg.css({
            background: ""
        }).setZ(5);
        
        new_fullBg.canvas = _self.initClass(Canvas, Stage.width, Stage.height, null);
        new_fullBg.add(new_fullBg.canvas);
        new_fullBg.texture = new Image();
        new_fullBg.texture.src = FEDevice.getAsset(_img, "jpg");

        new_fullBg.index = _ind;

        new_fullBg.texture.onload = function () {

            _bgIsSet = true;

            new_fullBg.canvas.context.drawImage(new_fullBg.texture, 0, 0);
            _positionBackground();

            new_fullBg.tween({
                opacity: 1
            }, 800, 'easeOutQuad', null, _self.destroyBG);

        };


    }
    function _animateIn() {
        // _elem.tween({
        //     opacity: 1
        // }, 5000, "easeOutQuart")
    }
    function _onResize() {
        _self.events.subscribe(FlipEvents.RESIZE, _resizeBackground);
    }

    function _resizeBackground() {
        // console.log('hi')
        _elem.css({
            width: Stage.width,
            height: Stage.height
        });
        // _cont.center();
        // _hdln.css({
        //     top: Stage.height - 400,
        // //     left: Stage.width - 600,
        // });

        _positionBackground();
    }

    this.animateIn = function () {

        // a.tween({
        //     y: 0,
        //     opacity: 1
        // }, 500, "workOpen");

        // h.tween({
        //     y: 0,
        //     opacity: 1
        // }, 500, "workOpen", 50);

        // i.animateIn()
    }

});

Class(function PageContainer() {

    Inherit(this, View);
    
    var _self = this;
    var _elem, _bckg, _cont, _home, _data;
    var i, z;

    var e               = true;
    var _scrollspeed    = 15;
    var _pageMargin     = 200;
    var _buffer         = Stage.height + _pageMargin;
    var a               = new Vector2(); // container vector
    var n               = new Vector2(); // user scroll vector;
    var _pageHeight;

    // this.container;

    (function () {
        _markup();
        _onResize();
        _getContent();
        _initScrollAndPosition();

        Render.startRender(_moveContainer);
        Render.nextFrame(_animateIn);
    })();

    function _markup() {
        // console.log('PAGE CONTAINER :: ');
        _elem = _self.element;
        _elem.size(Stage.width - _pageMargin, Stage.height).css({
            // opacity: 0.2,
            // borderLeft: '5px solid white',
            // borderRight: '5px solid white',
            // background: Config.COLORS.grey,
            left: Stage.width/2 - _elem.width/2
        }).setZ(100);

        _cont = _elem.create('container');
        _cont.css({
            // background: Config.COLORS.black
        });
        _cont.size('100%');
        _self.container = _cont;

        var _bg = _elem.create('bg');
        _bg.size('100%').css({
            // opacity: 0.5,
            // background: Config.COLORS.black
        });

        
    }

    

    function _getContent() {

        _home = _self.initClass(HomePage, _self, _pageMargin);

    }

    // BEGIN SCROLL
    function _moveContainer(pos) {
        // pos seems to be some kind of value that is related to the position of the work list items.
        // it's a very fine-tuned value
        // could be framerate?
        
        var stage_y = a.y;

        // arrow keys
        window.onkeydown = function(event){
            // console.log(event.keyCode);
            switch (event.keyCode){
                case 37:
                // left
                n.y += _scrollspeed;
                break;

                case 39:
                // right
                n.y -= _scrollspeed;
                break;
            }
        };
        
        // it's the lerp!
        a.lerp(n, 0.075);

        if (!z) {
            // identify scroll direction with a simple positive/negative value
            scrollDirection = a.y > stage_y ? -1 : 1;
        }

        if (Math.abs(n.y - a.y) <= 0.1 && a.y !== 0 && !z) {
            // H();
        }

        v(stage_y, a.y);
        
        _cont.y = a.y;
        
        _cont.y.toFixed(4);

        if (pos) {
            _cont.transform();
        }

        // workItemsLength = _items.length - 1;

        // for (var S = workItemsLength; S > -1; S--) {
        //     var workListItem = _items[S];

        //     // var W = a.y + (workListItem.y + workListItem.height);
        //     var W = a.y + (workListItem.y + workListItem.height);

        //     if (pos) {
        //         workListItem.parallax(_el.y);
        //     }

        //     if (W < 0 && scrollDirection == 1 && S === 0) {
        //         // triggered when stage comes in and when scrolling down
        //         //console.log('from _moveContainer(): _repositionOnDownScroll');
        //         _repositionOnDownScroll(workListItem);
        //     }

        //     //if (W > Stage.height + (workListItem.height * 1.5) && scrollDirection == -1 && S == workItemsLength) {
        //     if (W > Stage.height + (workListItem.height * 1.5) && scrollDirection == -1 && S == workItemsLength) {
        //         // triggered when stage comes in and when scrolling up
        //         //console.log('from _moveContainer(): _repositionOnUpScroll');
        //         _repositionOnUpScroll(workListItem);
        //     }
        // }
    }

    function _initScrollAndPosition() {
        
        // _self.events.subscribe(FlipEvents.RESIZE, _positionItems);

        ScrollUtil.link(_setScrollPosition);
        
        if (Device.mobile) {
            Stage.bind("touchstart", D);
            Stage.bind("touchend", u);
            Stage.bind("touchcancel", u);
        }
    }

    function _setScrollPosition(userScrollAmount) {
        // if (A) {
        //     return;
        // }

        // if (Math.abs(n.y - a.y) < 1000) {
        //     // n.x is amount the element will move
        //     n.y -= userScrollAmount * 2;
        // }
        console.log('PageContainer :: _pageHeight: ' + _pageHeight)

        if (Math.abs(n.y - a.y) < 1000) {
            // n.x is amount the element will move
            n.y -= userScrollAmount * 2;

            if (n.y > 0){
                n.y = 0;
            }

            // _pageHeight == undefined ? _pageHeight = Stage.height : '';

            if (n.y < -(_pageHeight - Stage.height*2 + _buffer)){

                n.y = -(_pageHeight - Stage.height*2 + _buffer);

                
            }
            // console.log(n.y);
            console.log(_pageHeight)
        }
    }

    function _setPageHeight(_height) {
        _pageHeight = _height;
    }

    // used when doing an upscroll reposition
    function s() {
        if (k) {
            return;
        }
        Render.nextFrame(function () {
            // triggered when stage comes in and when scolling up
            //console.log('from s(): _repositionOnUpScroll');
            // _repositionOnUpScroll(_items[_items.length - 1], true);
        });
    }

    function v(T, V) {

        var U = Math.abs(V - T);

        if (U > 100) {

            return;

        }
        if (U < 5) {

            if (!e) {
            
                e = true;
            
                _elem.mouseEnabled(true);
            
            }
        } else {
           
            if (e) {
           
                e = false;
           
                _elem.mouseEnabled(false);
           
                // for (var S = 0; S < _items.length; S++) {
           
                //     _items[S].disable();
           
                // }
            }
        }
    }

    function H() {
        // var _elX = _el.x;
        var _contY = _cont.y;

        a.y = 0;
        // console.log('===================')
        // console.log('H() CALLED!')
        // console.log('===================')
        n.y = 0;
        
        _cont.y = 0;
        
        _cont.transform();
        
    }

    // used when doing an upscroll reposition
    function s() {
        // if (k) {
        //     return;
        // }
        Render.nextFrame(function () {
            // triggered when stage comes in and when scolling up
            console.log('from s() ::');
            // _repositionOnUpScroll(_items[_items.length - 1], true);
        });
    }

    function _animateIn() {
        /*console.log('========================');
        console.log('_animateIn() FROM WORK LIST');
        console.log('========================');*/

        if (Mobile.os == "Android" || (Mobile.os == "iOS" && FEDevice.PERFORMANCE === 0 && Mobile.tablet)) {
            return;
        }

        // a.y = Stage.height * Transition.instance().direction;
        a.y = Stage.height * Transition.instance().direction;
    }
    function _onResize() {
        _self.events.subscribe(FlipEvents.RESIZE, _resizeBackground);

        // _setPageHeight(Stage.height);
    }

    function _resizeBackground() {
        _elem.size(Stage.width - _pageMargin, Stage.height).css({
            // width: Stage.width-100,
            // height: Stage.height
        });
    }

    this.setPageHeight = function(_pheight) {
        _setPageHeight(_pheight);
    }

    this.animateIn = function () {

        // a.tween({
        //     y: 0,
        //     opacity: 1
        // }, 500, "workOpen");

        // h.tween({
        //     y: 0,
        //     opacity: 1
        // }, 500, "workOpen", 50);

        // i.animateIn()
    }

});

Class(function HomePage(container, margin) {

    Inherit(this, View);
    
    var _self = this;
    var _team, _gutter, _hdln, _play;
    var _abot, _about, _believe;
    var col1, col2, col3;

    var _container = container;
    var _margin = margin;
    
    var _gutter = 10;

    (function () {

        _main();
        // _getHomeAbout();

        // _onResize();
    })();    

    function _main() {
        
        _self.initClass(HomeMainContent, _container, _margin);
        // _self.initClass(HomeFeatured, _container, _margin);

    }

    this.animateIn = function () {

        // a.tween({
        //     y: 0,
        //     opacity: 1
        // }, 500, "workOpen");

        // h.tween({
        //     y: 0,
        //     opacity: 1
        // }, 500, "workOpen", 50);

        // i.animateIn()
    }

});

Class(function HomeMainContent(container, margin) {

    Inherit(this, View);
    
    var _self = this;
    var _team, _gutter, _hdln, _play;
    var _abot, _about, _believe, _pageHeight;
    var col1, col2, col3;
    
    var _c1_header, _c1_subhead, _c1_content;
    var _c2_header, _c2_list;
    var _c3_header, _c3_photo;

    var _gutter = 10;
    var _container = container;
    var _margin = margin;




    (function () {

        _getHomeMain();
        _getHomeAbout();

        _onResize();
    })();    

    function _getHomeMain() {
        // console.log(Data.HOME.getData());
        var _text = 'A Digital Creative Agency';

        console.log('_container.container' + _container.container)
        console.log(_container.container)

        // _cont.center();
        _play = _container.container.create('play');
        _play.size(130, 130).css({
            // position: 'relative',
            top: (Stage.height/2) - 50,
            left: Stage.width/2 - _play.width/2 - _margin/2,
            background: 'red'
        }).transform({
            // y: (Stage.height/2) - 50,
            // x: (Stage.width/2)
        }).setZ(50);

        _hdln = _container.container.create('headline');
        // _hdln.fontStyle("GeomSlab703-ExtraBoldCondensed", 48, Config.COLORS.white);
        _hdln.fontStyle("GeomSlab703-ExtraBold", 48, Config.COLORS.white);
        _hdln.size(500, 100).css({
            // position: 'relative',
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 48,
            top: parseInt(_play.div.style.top, 10) + parseInt(_play.div.style.height, 10),
            left: Stage.width/2 - _hdln.width/2 - _margin/2,
            // paddingTop: 130,

            // height: 'auto'
            // left: -250
            // left: Stage.width - 600,
            border: '1px solid red'
        }).setZ(50);

        _hdln.text(_text);

    }

    function _getHomeAbout() {
        _abot = _container.container.create('about');

        console.log('HOME MAIN CONTENT :: play: ' + parseInt(_play.div.style.top, 10));
        console.log('HOME MAIN CONTENT :: hdln top: ' + _hdln.div.style.top);
        console.log('HOME MAIN CONTENT :: hdln width: ' + _hdln.div.style.width);



        _abot.css({
            position: 'relative',
            width: '100%',
            // height: 2000,
            // left: '-50%',
            // top: Stage.height - 100,
            top: parseInt(_play.div.style.top, 10) + parseInt(_play.div.style.height, 10) + 200,
            color: Config.COLORS.white,
            // background: Config.COLORS.branding,
            borderTop: '2px solid ' + Config.COLORS.white,
            borderBottom: '2px solid ' + Config.COLORS.white
        });

        _col1 = _abot.create('column1');
        _col2 = _abot.create('column2');
        _col3 = _abot.create('column3');

        _dat_about      = Data.ABOUT.getData();
        _dat_believe    = Data.BELIEVE.getData();
        _dat_team       = Data.TEAM.getData();


        _col1.css({
            left: 0,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red',

        });

        _col2.css({
            left: (Stage.width - _margin)/3 + _gutter,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'

        });

        _col3.css({
            left: ((Stage.width - _margin)/3 + _gutter) * 2,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'

        });

        _getColumnOneData();
        _getColumnTwoData();
        _getColumnThreeData();

    }

    function _getColumnOneData() {


        _c1_header  = _col1.create('header');
        _c1_header.fontStyle("GeomSlab703-ExtraBold", 40, Config.COLORS.white);
        _c1_subhead = _col1.create('subhead');     
        _c1_subhead.fontStyle("AvenirLight", 24, Config.COLORS.white);
        _c1_content = _col1.create('content');
        _c1_content.css({
            position: 'relative',
        });

        _c1_header.text(_dat_about[0].header.toUpperCase());
        _c1_subhead.text(_dat_about[0].subheader);
        _c1_content.text(_dat_about[0].content);
        
    }

    function _getColumnTwoData() {
        _c2_header  = _col2.create('header');
        _c2_header.fontStyle("GeomSlab703-Medium", 36, Config.COLORS.white);


        for(var j = 0; j < _dat_believe.length; j++) {

            if (j == 0) {
                _c2_list = _col2.create('list');
                _c2_list.fontStyle("AvenirLight", 26, Config.COLORS.white);
                _c2_list.text(_dat_believe[j].name);
                _c2_list.css({
                    position: 'relative',
                    marginTop: 10,
                    paddingLeft: 10,
                    paddingTop: 2,
                    paddingRight: 14,
                    paddingBottom: 5,
                    width: parseInt(_col2.div.style.width, 10) <= (CSS.textSize(_c2_list).width) ? '' : CSS.textSize(_c2_list).width,
                    // width: CSS.textSize(_c2_list).width + 20,
                    background: Config.COLORS.branding,

                });
            } else {
                if (_dat_believe[j].name) {

                    var _c = _c2_list.clone();
                    _c.fontStyle("AvenirLight", 26, Config.COLORS.white);

                    _c.text(_dat_believe[j].name);

                    _c.css({
                    //     position: 'relative',
                        paddingLeft: 10,
                        paddingTop: 2,
                        paddingRight: 0,
                        paddingBottom: 5,
                        width: parseInt(_col2.div.style.width, 10) <= (CSS.textSize(_c).width) ? '' : CSS.textSize(_c).width,
                    //     background: Config.COLORS.branding,
                    //     textWrap: 'normal'
                    });
                    _col2.addChild(_c);

                    console.log('wwww: '+parseInt(_col2.div.style.width, 10))
                    console.log('wwww: '+ (CSS.textSize(_c).width + 20))
                }
            }
        }

        _c2_header.text('Things we believe in');


        
    }

    function _getColumnThreeData() {

        _c3_header  = _col3.create('header');
        _c3_header.fontStyle("GeomSlab703-Medium", 36, Config.COLORS.white);

        _c3_header.text('Flip Profile');

        _c3_image = _col3.create('profile');

        console.log('_dat_team: ' + _dat_team[0]);
        console.log(_dat_team[0].headshot[0].urlPath);

        // function _addPhoto(){
        _c3_photo = _col3.create(".photo");
        _c3_photo.size(300, 250).bg(_dat_team[0].headshot[0].urlPath).css({
            // left: -_diff,
            // top: -_diff
        });
    // }
        // '<h4>' + _dat_team[0].name + '</h4>' +
        // '<h5>' + _dat_team[0].title + '</h5>' +
        // '<h4>Q: </h4><h5>' + _dat_team[0].question + '</h5>' +
        // '<h4>A: </h4><h5>' + _dat_team[0].answer + '</h5>'


        _self.delayedCall(function() {
            
            _pageHeight = (parseInt(_abot.div.style.top, 10) + Math.max(_col1.div.offsetHeight, _col2.div.offsetHeight, _col3.div.offsetHeight) + 50);
            _abot.css({
                height: Math.max(_col1.div.offsetHeight, _col2.div.offsetHeight, _col3.div.offsetHeight) + 50
            });
            _container.setPageHeight(_pageHeight);

        }, 100);
        
    }

    function _getList() {
        var _list = '';
        for(var j = 0; j < _dat_believe.length; j++) {

            if (_dat_believe[j].name) {
                _list += '<h5>' + _dat_believe[j].name + '</h5>';
                // console.log(_believe[j].name)
            }
        }
        return _list;
    }

    function _animateIn() {
        /*console.log('========================');
        console.log('_animateIn() FROM WORK LIST');
        console.log('========================');*/

        if (Mobile.os == "Android" || (Mobile.os == "iOS" && FEDevice.PERFORMANCE === 0 && Mobile.tablet)) {
            return;
        }

        // a.y = Stage.height * Transition.instance().direction;
        a.y = Stage.height * Transition.instance().direction;
    }
    function _onResize() {
        _self.events.subscribe(FlipEvents.RESIZE, _resizePage);
    }

    function _resizePage() {

        _resizeMainAndAbout();
        _container.setPageHeight(_pageHeight);
    
    }
    
    function _resizeMainAndAbout() {

        _play.size(130, 130).css({
            // position: 'relative',
            top: (Stage.height/2) - 50,
            left: Stage.width/2 - _play.width/2 - _margin/2
        });

        _hdln.css({
            top: parseInt(_play.div.style.top, 10) + parseInt(_play.div.style.height, 10),
            left: Stage.width/2 - _hdln.width/2 - _margin/2,
        });


        _abot.css({
            // top: Stage.height - 100,
            height: Math.max(_col1.div.offsetHeight, _col2.div.offsetHeight, _col3.div.offsetHeight) + 50,
            top: parseInt(_play.div.style.top, 10) + parseInt(_play.div.style.height, 10) + 200,

        });

        _col1.css({
            left: 0,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'
        });
        _col2.css({
            left: (Stage.width - _margin)/3 + _gutter,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'

        });
        _col3.css({
            left: ((Stage.width - _margin)/3 + _gutter) * 2,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'
        });
        
        _pageHeight = (parseInt(_abot.div.style.top, 10) + Math.max(_col1.div.offsetHeight, _col2.div.offsetHeight, _col3.div.offsetHeight) + 50);
        _container.setPageHeight(_pageHeight - Stage.height);
        console.log('Stage: '+Stage.height);
        console.log('Page: '+_pageHeight);
        // console.log(_pageHeight);
        // console.log(CSS.textSize(_col1).height);
        // console.log('col1 height: ' + CSS.textSize(_col1).height);
        // console.log('col1 height: ' + (CSS.textSize(_col1).height + 124));
        console.log('col1 height: ' + _col1.div.offsetHeight);

    }

    this.animateIn = function () {

        // a.tween({
        //     y: 0,
        //     opacity: 1
        // }, 500, "workOpen");

        // h.tween({
        //     y: 0,
        //     opacity: 1
        // }, 500, "workOpen", 50);

        // i.animateIn()
    }

});

Class(function HomeFeatured(container, margin) {

    Inherit(this, View);
    
    var _self = this;
    var _team, _gutter, _hdln, _play;
    var _abot, _about, _believe;
    var col1, col2, col3;
    
    var _gutter = 10;
    var _conainer = container;
    var _margin = margin;

    (function () {

        _getHomeMain();
        _getHomeAbout();

        _onResize();
    })();    

    function _getHomeMain() {
        // console.log(Data.HOME.getData());
        var _text = 'A Digital Creative Agency';


        // _cont.center();
        _play = _conainer.create('play');
        _play.size(130, 130).css({
            // position: 'relative',
            top: (Stage.height/2) - 50,
            left: Stage.width/2 - _play.width/2 - _margin/2,
            background: 'red'
        }).transform({
            // y: (Stage.height/2) - 50,
            // x: (Stage.width/2)
        }).setZ(50);

        _hdln = _conainer.create('headline');
        // _hdln.fontStyle("GeomSlab703-ExtraBoldCondensed", 48, Config.COLORS.white);
        _hdln.fontStyle("GeomSlab703-ExtraBold", 48, Config.COLORS.white);
        _hdln.size(500, 100).css({
            // position: 'relative',
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 48,
            paddingTop: 130,
            // height: 'auto'
            // left: -250
            // left: Stage.width - 600,
            // border: '1px solid red'
        }).center().setZ(50);

        _hdln.text(_text);

    }

    function _getHomeAbout() {
        _abot = _conainer.create('about');

        _abot.css({
            // position: 'relative',
            width: '100%',
            height: 2000,
            // left: '-50%',
            top: Stage.height - 100,
            color: Config.COLORS.white,
            // background: Config.COLORS.branding,
            borderTop: '2px solid ' + Config.COLORS.white,
            borderBottom: '2px solid ' + Config.COLORS.white
        });

        _col1 = _abot.create('column1');
        _col2 = _abot.create('column2');
        _col3 = _abot.create('column3');

        _dat_about      = Data.ABOUT.getData();
        _dat_believe    = Data.BELIEVE.getData();
        _dat_team       = Data.TEAM.getData();


        _col1.css({
            left: 0,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red',

        });

        _col2.css({
            left: (Stage.width - _margin)/3 + _gutter,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'

        });

        _col3.css({
            left: ((Stage.width - _margin)/3 + _gutter) * 2,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'

        });


        

        _col1.text(
            '<h3>' + _dat_about[0].header + '</h3>' +
            '<h4>' + _dat_about[0].subheader + '</h4>' +
            _dat_about[0].content
        );

        for (var i = 0; i < _col1.children().length; i++) {
            _col1.children()[i].style.position = 'static';
            _col1.children()[i].style.height = 'auto';
        }


        // console.log(Data.BELIEVE.getData());
        _col2.text(
            '<h3>Things we believe</h3>' +
            _getList()
        );

        for (var k = 0; k < _col2.children().length; k++) {
            _col2.children()[k].style.position = 'static';
            _col2.children()[k].style.height = 'auto';
        }

        _col3.text(
            '<h3>Flip Profile</h3>' +
            '<h4>' + _dat_team[0].name + '</h4>' +
            '<h5>' + _dat_team[0].title + '</h5>' +
            '<h4>Q: </h4><h5>' + _dat_team[0].question + '</h5>' +
            '<h4>A: </h4><h5>' + _dat_team[0].answer + '</h5>'
        );

        for (var l = 0; l < _col3.children().length; l++) {
            _col3.children()[l].style.position = 'static';
            _col3.children()[l].style.height = 'auto';
        }

    }

    function _getList() {
        var _list = '';
        for(var j = 0; j < _dat_believe.length; j++) {

            if (_dat_believe[j].name) {
                _list += '<h5>' + _dat_believe[j].name + '</h5>';
                // console.log(_believe[j].name)
            }
        }
        return _list;
    }

    function _animateIn() {
        /*console.log('========================');
        console.log('_animateIn() FROM WORK LIST');
        console.log('========================');*/

        if (Mobile.os == "Android" || (Mobile.os == "iOS" && FEDevice.PERFORMANCE === 0 && Mobile.tablet)) {
            return;
        }

        // a.y = Stage.height * Transition.instance().direction;
        a.y = Stage.height * Transition.instance().direction;
    }
    function _onResize() {
        _self.events.subscribe(FlipEvents.RESIZE, _resizePage);
    }

    function _resizePage() {

        _resizeMainAndAbout();
    
    }
    
    function _resizeMainAndAbout() {

        _play.size(130, 130).css({
            // position: 'relative',
            top: (Stage.height/2) - 50,
            left: Stage.width/2 - _play.width/2 - _margin/2
        })


        _abot.css({
            top: Stage.height - 100,
        });

        _col1.css({
            left: 0,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'
        });
        _col2.css({
            left: (Stage.width - _margin)/3 + _gutter,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'

        });
        _col3.css({
            left: ((Stage.width - _margin)/3 + _gutter) * 2,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'
        });

    }

    this.animateIn = function () {

        // a.tween({
        //     y: 0,
        //     opacity: 1
        // }, 500, "workOpen");

        // h.tween({
        //     y: 0,
        //     opacity: 1
        // }, 500, "workOpen", 50);

        // i.animateIn()
    }

});

// ====================================
// MAIN
// ====================================

Class(function Main() {

    (function () {
      init();
      _webkitbackface();
    })();

    function init() {
        Mouse.capture();
        // THIS STARTS THE ACTUAL APP!
        Container.instance();
        // console.log(Data.ABOUT)
        // console.log(Data.WORK.getImages())


    }
    function _webkitbackface() {
        // console.log('MAIN :: ' + CSS._read());
        // console.log('DEVICE VENDOR :: ' + Device.vendor);

        if (Device.browser.chrome && Device.vendor == 'webkit') {

            var _css = '* { -webkit-backface-visibility: visible; }';
            CSS._write(_css);
            // var _css = CSS._read();

        }

        
        // var s = CSS._read();
        // var n = "/*" + m + "*/";
        // var C = "@-" + Device.vendor + "-keyframes " + m + " {\n";
        // var t = n + C;
        // if (s.strpos(m)) {
        //     var v = s.split(n);
        //     s = s.replace(n + v[1] + n, "")
        // }
        // var x = d.length - 1;
        // var z = Math.round(100 / x);
        // var w = 0;
        // for (var r = 0; r < d.length; r++) {
        //     var p = d[r];
        //     if (r == d.length - 1) {
        //         w = 100
        //     }
        //     t += (p.percent || w) + "% {\n";
        //     var o = false;
        //     var u = {};
        //     var B = {};
        //     for (var A in p) {
        //         if (TweenManager.checkTransform(A)) {
        //             u[A] = p[A];
        //             o = true
        //         } else {
        //             B[A] = p[A]
        //         }
        //     }
        //     if (o) {
        //         t += "-" + Device.vendor + "-transform: " + TweenManager.parseTransform(u) + ";"
        //     }
        //     for (A in B) {
        //         var q = B[A];
        //         if (typeof q !== "string" && A != "opacity" && A != "zIndex") {
        //             q += "px"
        //         }
        //         t += CSS._toCSS(A) + ": " + q + ";"
        //     }
        //     t += "\n}\n";
        //     w += z
        // }
        // t += "}" + n;
        // s += t;
        // CSS._write(s)
    }
});