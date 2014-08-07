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