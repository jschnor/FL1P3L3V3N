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